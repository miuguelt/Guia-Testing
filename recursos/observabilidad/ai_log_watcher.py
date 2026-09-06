"""
AI Log Watcher & Coolify Webhook Listener.

Servicio de triaje automatico para contenedores en Coolify / Docker:
1. Servidor HTTP daemon (0.0.0.0:9050) que recibe Webhooks de Coolify (/webhook/coolify).
2. Deduplica errores mediante fingerprinting SHA-256 para evitar tormentas de alertas.
3. Consulta a un LLM (OpenAI / Gemini / endpoint local) para realizar Root Cause Analysis (RCA).
4. Despacha alertas enriquecidas con diagnostico y solucion a Discord, Telegram, Slack o stdout.
5. Endpoint de salud /healthz para liveness check del propio watcher.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any, Dict, List, Optional, Tuple


class ErrorFingerprinter:
    """
    Agrupa y deduplica excepciones para prevenir tormentas de alertas y llamadas repetitivas al LLM.
    """

    def __init__(self, window_seconds: int = 600):
        self.window_seconds = window_seconds
        self.seen_errors: Dict[str, float] = {}

    def compute_fingerprint(self, raw_log: str) -> str:
        """
        Extrae la firma clave del error (archivo, linea o tipo de excepcion) y calcula su hash SHA-256.
        """
        normalized = re.sub(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?", "", raw_log)
        normalized = re.sub(r"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}", "", normalized)
        
        match = re.search(r"(\w+Error|Exception):\s*(.*)", normalized)
        if match:
            signature = f"{match.group(1)}:{match.group(2)[:100]}"
        else:
            signature = normalized.strip()[:200]

        return hashlib.sha256(signature.encode("utf-8")).hexdigest()

    def should_process(self, fingerprint: str) -> bool:
        """
        Determina si el error debe procesarse o si esta dentro de la ventana de silencio (deduplicado).
        """
        now = time.time()
        last_seen = self.seen_errors.get(fingerprint)
        if last_seen and (now - last_seen) < self.window_seconds:
            return False
        self.seen_errors[fingerprint] = now
        return True


class AILogAnalyzer:
    """
    Orquesta el analisis de logs con un LLM para generar diagnostico de causa raiz y soluciones.
    """

    def __init__(self, api_key: Optional[str] = None, model: str = "gemini-1.5-flash"):
        self.api_key = api_key or os.getenv("LLM_API_KEY") or os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")
        self.model = model

    def build_rca_prompt(self, container_name: str, event_type: str, log_snippet: str) -> str:
        return f"""Eres un Ingeniero Senior SRE (Site Reliability Engineer) y experto en contenedores Docker y Coolify.
Analiza el siguiente fallo detectado en un contenedor en produccion y proporciona un diagnostico estructurado en JSON.

[METADATOS DEL EVENTO]
Contenedor: {container_name}
Tipo de Evento: {event_type}

[REGISTRO DE LOGS / TRACEBACK]
{log_snippet}

Responde EXCLUSIVAMENTE con un JSON valido (sin bloques markdown ```json) con este esquema:
{{
  "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "root_cause": "Explicacion concisa de la causa raiz",
  "impact": "Servicios o endpoints afectados",
  "coolify_action": "Accion inmediata en la interfaz o configuracion de Coolify",
  "code_fix": "Codigo o correccion sugerida (o N/A si es infraestructura)"
}}"""

    def analyze(self, container_name: str, event_type: str, log_snippet: str) -> Dict[str, Any]:
        if not self.api_key:
            return self._heuristic_fallback(container_name, event_type, log_snippet)

        prompt = self.build_rca_prompt(container_name, event_type, log_snippet)
        try:
            endpoint = os.getenv("LLM_API_BASE", "https://api.openai.com/v1/chat/completions")
            req_data = json.dumps({
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.1,
            }).encode("utf-8")

            req = urllib.request.Request(
                endpoint,
                data=req_data,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.api_key}",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                result = json.loads(resp.read().decode("utf-8"))
                content = result["choices"][0]["message"]["content"].strip()
                cleaned = re.sub(r"^```json\s*|\s*```$", "", content)
                return json.loads(cleaned)
        except Exception as exc:
            fallback = self._heuristic_fallback(container_name, event_type, log_snippet)
            fallback["warning"] = f"LLM API no disponible ({str(exc)}). Diagnostico generado por motor heuristico."
            return fallback

    def _heuristic_fallback(self, container_name: str, event_type: str, log: str) -> Dict[str, Any]:
        log_lower = log.lower()
        if "out of memory" in log_lower or "oomkilled" in log_lower or "kill" in log_lower or "memoryerror" in log_lower:
            return {
                "severity": "CRITICAL",
                "root_cause": "Agotamiento de memoria RAM (OOM Killer). El contenedor supero el limite configurado.",
                "impact": "El contenedor fue terminado forzosamente por el kernel de Linux.",
                "coolify_action": "En Coolify > Application > General, aumentar el 'Memory Limit' (ej. de 256MB a 512MB o 1GB).",
                "code_fix": "Verificar cargas masivas en memoria o paginar consultas de base de datos.",
            }
        elif "connection refused" in log_lower or "connectionrefused" in log_lower or "operationalerror" in log_lower or "psycopg" in log_lower or "sqlalchemy" in log_lower:
            return {
                "severity": "HIGH",
                "root_cause": "Fallo de conexion a la base de datos o pool de conexiones saturado.",
                "impact": "Rutas dependientes de base de datos responden HTTP 500.",
                "coolify_action": "Comprobar que el servicio PostgreSQL en Coolify este activo y que DATABASE_URL use la red interna.",
                "code_fix": "Configurar pool_pre_ping=True y pool_recycle=300 en el engine de SQLAlchemy.",
            }
        elif "address already in use" in log_lower:
            return {
                "severity": "HIGH",
                "root_cause": "Colision de puertos dentro del contenedor o proceso zombi en ejecucion.",
                "impact": "El servidor web no puede iniciar el socket de escucha.",
                "coolify_action": "Reiniciar el contenedor asegurando que EXPOSE y el puerto de arranque coincidan (ej. 8000).",
                "code_fix": "N/A - Verificar comando CMD en el Dockerfile.",
            }
        else:
            return {
                "severity": "MEDIUM",
                "root_cause": f"Excepcion no controlada detectada en tiempo de ejecucion ({event_type}).",
                "impact": "Degradacion parcial de funcionalidades en la aplicacion.",
                "coolify_action": "Revisar logs en tiempo real en la pestana 'Logs' de Coolify.",
                "code_fix": "Envolver la seccion afectada en un bloque try/except e incluir logging.error().",
            }


class AlertDispatcher:
    """
    Envia el reporte generado a canales externos (Discord, Telegram, Slack o Consola).
    """

    @staticmethod
    def send_discord_webhook(webhook_url: str, container_name: str, rca_report: Dict[str, Any]) -> bool:
        severity_colors = {
            "CRITICAL": 0xE74C3C,
            "HIGH": 0xE67E22,
            "MEDIUM": 0xF1C40F,
            "LOW": 0x3498DB,
        }
        color = severity_colors.get(rca_report.get("severity", "LOW"), 0x95A5A6)

        payload = {
            "embeds": [{
                "title": f"🚨 [AI SRE Alert] Fallo en Contenedor: {container_name}",
                "color": color,
                "fields": [
                    {"name": "Severidad", "value": rca_report.get("severity", "UNKNOWN"), "inline": True},
                    {"name": "Causa Raiz", "value": rca_report.get("root_cause", "No especificada")},
                    {"name": "Impacto", "value": rca_report.get("impact", "No especificado")},
                    {"name": "Accion en Coolify", "value": rca_report.get("coolify_action", "Verificar logs")},
                    {"name": "Correccion de Codigo", "value": f"```{rca_report.get('code_fix', 'N/A')}```"},
                ],
                "footer": {"text": "DevBrain SRE Observability Agent • Coolify Integration"},
            }]
        }

        try:
            req = urllib.request.Request(
                webhook_url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json", "User-Agent": "AILogWatcher/1.0"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                return resp.status in (200, 204)
        except Exception as err:
            sys.stderr.write(f"[AlertDispatcher] Error al despachar a Discord: {err}\n")
            return False

    @staticmethod
    def send_telegram_alert(bot_token: str, chat_id: str, container_name: str, rca_report: Dict[str, Any]) -> bool:
        text = (
            f"🚨 *[AI SRE Alert] Fallo en Contenedor:* `{container_name}`\n\n"
            f"⚡ *Severidad:* {rca_report.get('severity', 'UNKNOWN')}\n"
            f"🔍 *Causa Raiz:* {rca_report.get('root_cause', 'N/A')}\n"
            f"💥 *Impacto:* {rca_report.get('impact', 'N/A')}\n"
            f"🛠 *Accion en Coolify:* {rca_report.get('coolify_action', 'N/A')}\n\n"
            f"💻 *Parche Sugerido:*\n`{rca_report.get('code_fix', 'N/A')}`"
        )
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = {"chat_id": chat_id, "text": text, "parse_mode": "Markdown"}
        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                return resp.status == 200
        except Exception as err:
            sys.stderr.write(f"[AlertDispatcher] Error al despachar a Telegram: {err}\n")
            return False

    @staticmethod
    def send_slack_webhook(webhook_url: str, container_name: str, rca_report: Dict[str, Any]) -> bool:
        color = "#E74C3C" if rca_report.get("severity") == "CRITICAL" else "#E67E22"
        payload = {
            "attachments": [{
                "color": color,
                "title": f"🚨 [AI SRE Alert] Fallo en Contenedor: {container_name}",
                "fields": [
                    {"title": "Severidad", "value": rca_report.get("severity", "UNKNOWN"), "short": True},
                    {"title": "Causa Raiz", "value": rca_report.get("root_cause", "N/A"), "short": False},
                    {"title": "Accion en Coolify", "value": rca_report.get("coolify_action", "N/A"), "short": False},
                    {"title": "Parche Sugerido", "value": f"```{rca_report.get('code_fix', 'N/A')}```", "short": False},
                ]
            }]
        }
        try:
            req = urllib.request.Request(
                webhook_url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                return resp.status == 200
        except Exception as err:
            sys.stderr.write(f"[AlertDispatcher] Error al despachar a Slack: {err}\n")
            return False


class CoolifyWebhookServer:
    """
    Servidor HTTP daemon para procesar webhooks de Coolify Notifications y despachar diagnosticos con IA.
    """

    def __init__(
        self,
        port: int = 9050,
        webhook_secret: Optional[str] = None,
        discord_webhook: Optional[str] = None,
        telegram_bot_token: Optional[str] = None,
        telegram_chat_id: Optional[str] = None,
        slack_webhook: Optional[str] = None,
    ):
        self.port = port
        self.webhook_secret = webhook_secret or os.getenv("COOLIFY_WEBHOOK_SECRET")
        self.discord_webhook = discord_webhook or os.getenv("DISCORD_WEBHOOK_URL")
        self.telegram_bot_token = telegram_bot_token or os.getenv("TELEGRAM_BOT_TOKEN")
        self.telegram_chat_id = telegram_chat_id or os.getenv("TELEGRAM_CHAT_ID")
        self.slack_webhook = slack_webhook or os.getenv("SLACK_WEBHOOK_URL")

        self.fingerprinter = ErrorFingerprinter()
        self.analyzer = AILogAnalyzer()

    def process_coolify_payload(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        event = payload.get("event", payload.get("title", "unknown_event"))
        resource = payload.get("resource_name", payload.get("name", "coolify-app"))
        raw_logs = payload.get("logs", payload.get("message", "Sin logs adicionales"))

        fp = self.fingerprinter.compute_fingerprint(raw_logs)
        if not self.fingerprinter.should_process(fp):
            return {"status": "ignored", "reason": "duplicate_suppressed", "fingerprint": fp}

        rca = self.analyzer.analyze(container_name=resource, event_type=event, log_snippet=raw_logs)

        # Despachar a todos los canales configurados
        if self.discord_webhook:
            AlertDispatcher.send_discord_webhook(self.discord_webhook, resource, rca)
        if self.telegram_bot_token and self.telegram_chat_id:
            AlertDispatcher.send_telegram_alert(self.telegram_bot_token, self.telegram_chat_id, resource, rca)
        if self.slack_webhook:
            AlertDispatcher.send_slack_webhook(self.slack_webhook, resource, rca)

        return {
            "status": "analyzed",
            "fingerprint": fp,
            "resource": resource,
            "rca": rca,
        }

    def create_http_handler(server_instance):
        class WebhookHandler(BaseHTTPRequestHandler):
            def do_GET(self):
                if self.path == "/healthz":
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(b'{"status":"healthy","service":"ai-log-watcher"}\n')
                else:
                    self.send_response(404)
                    self.end_headers()

            def do_POST(self):
                if self.path.startswith("/webhook/coolify"):
                    # Validar secreto si esta configurado
                    if server_instance.webhook_secret:
                        token = self.headers.get("X-Coolify-Secret") or self.headers.get("Authorization", "").replace("Bearer ", "")
                        if token != server_instance.webhook_secret:
                            self.send_response(401)
                            self.send_header("Content-Type", "application/json")
                            self.end_headers()
                            self.wfile.write(b'{"error":"Unauthorized"}\n')
                            return

                    content_length = int(self.headers.get("Content-Length", 0))
                    raw_body = self.rfile.read(content_length).decode("utf-8")
                    try:
                        payload = json.loads(raw_body)
                    except Exception:
                        payload = {"message": raw_body}

                    result = server_instance.process_coolify_payload(payload)
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps(result, ensure_ascii=False).encode("utf-8"))
                else:
                    self.send_response(404)
                    self.end_headers()

            def log_message(self, format, *args):
                # Suprimir salida verbosa de BaseHTTPRequestHandler en tests
                pass

        return WebhookHandler

    def serve_forever(self):
        handler_cls = self.create_http_handler()
        server = ThreadingHTTPServer(("0.0.0.0", self.port), handler_cls)
        print(f"[AI Log Watcher] Servidor HTTP daemon activo en http://0.0.0.0:{self.port}")
        print(f"[AI Log Watcher] Endpoint webhook: http://0.0.0.0:{self.port}/webhook/coolify")
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\n[AI Log Watcher] Deteniendo servidor...")
            server.server_close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AI Log Watcher & Coolify Webhook Listener")
    parser.add_argument("--port", type=int, default=int(os.getenv("WEBHOOK_PORT", 9050)), help="Puerto de escucha HTTP")
    parser.add_argument("--test", action="store_true", help="Ejecuta una prueba sintetica con log simulado y sale")
    args = parser.parse_args()

    server = CoolifyWebhookServer(port=args.port)

    if args.test:
        print("[AI Log Watcher] Ejecutando analisis sintetico de prueba...")
        ejemplo_log = """
        Traceback (most recent call last):
          File "/app/routers/productos.py", line 42, in get_productos
            db.query(Producto).all()
          File "sqlalchemy/orm/session.py", line 1500, in query
        OperationalError: (psycopg2.OperationalError) connection to server at "postgres" (172.18.0.3), port 5432 failed: Connection refused
        """
        resultado = server.process_coolify_payload({
            "event": "restart_limit_reached",
            "resource_name": "catalogo-flask-api",
            "logs": ejemplo_log,
        })
        print(json.dumps(resultado, indent=2, ensure_ascii=False))
    else:
        server.serve_forever()
