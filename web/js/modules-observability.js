// Catálogo declarativo por tema; conserva el contenido existente.
Object.assign(window.MODULES, {
    "m-observabilidad": {
        title: "Observabilidad en Producción: Logs JSON, Métricas y AI SRE en Coolify",
        badge: "Modulo 12",
        intro: "Cierra el ciclo de calidad cuando el contenedor ya está en producción. Aprende a emitir logs estructurados en JSON con Correlation ID (X-Request-ID), exponer endpoints de salud (/healthz, /readyz, /metrics), capturar logs con Dozzle y automatizar el triaje y diagnóstico de caídas en Coolify usando agentes de IA.",
        blocks: [
            {
                type: "alert", variant: "info",
                title: "¿Por qué observabilidad en una guía de testing?",
                body: "El testing automatizado pre-producción (PyTest, Jest, Playwright) previene defectos anticipados, pero en producción el software interactúa con redes reales, picos de tráfico, bases de datos saturadas y fallos de infraestructura. La observabilidad completa el ciclo de aseguramiento de calidad (ISO/IEC 25010: Confiabilidad y Capacidad de Mantenimiento)."
            },
            {
                type: "comparison",
                title: "Los 4 Pilares de la Observabilidad y Diagnóstico en VPS con Coolify",
                headers: ["Pilar", "Mecanismo Técnico", "Implementación en Flask", "Uso en Coolify y AI SRE"],
                rows: [
                    ["Logs Estructurados", "JSONFormatter + X-Request-ID", "Logs de 1 línea JSON con timestamp ISO y source", "La IA procesa el stack trace sin errores de saltos de línea."],
                    ["Métricas de Servicio", "Prometheus Metrics (/metrics)", "SimpleMetricsRegistry contando requests y duración", "Alerta automática si la tasa de errores supera el umbral."],
                    ["Health & Readiness", "Endpoints /healthz y /readyz", "Verifica conexión viva a PostgreSQL/Redis en runtime", "Coolify detecta contenedores zombi y programa reinicios."],
                    ["Agente AI SRE", "ai_log_watcher.py (Daemon)", "Webhook multihilo en puerto 9050 con SHA-256", "Emite diagnóstico RCA, severidad y parche sugerido."]
                ]
            },
            {
                type: "code", lang: "python", file: "recursos/observabilidad/flask_observability.py",
                title: "flask_observability.py - Middleware de Observabilidad Flask",
                code: `from flask import Flask, request, g, jsonify
import logging, uuid, time, json

class JSONFormatter(logging.Formatter):
    """Emite cada log como un objeto JSON estructurado de una sola línea."""
    def __init__(self, service_name="flask-app", environment="production"):
        super().__init__()
        self.service_name = service_name
        self.environment = environment

    def format(self, record):
        payload = {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(record.created)),
            "service": self.service_name,
            "level": record.levelname,
            "message": record.getMessage(),
            "source": f"{record.filename}:{record.lineno}",
            "request_id": getattr(record, "request_id", "-")
        }
        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)
        return json.dumps(payload, ensure_ascii=False)

class FlaskObservability:
    """Instrumentación integral: X-Request-ID, /healthz, /readyz y /metrics."""
    def __init__(self, app=None, service_name="mi-servicio"):
        if app:
            self.init_app(app, service_name)

    def init_app(self, app, service_name="mi-servicio"):
        @app.before_request
        def before_request():
            req_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
            g.request_id = req_id
            g.start_time = time.time()

        @app.after_request
        def after_request(response):
            response.headers["X-Request-ID"] = getattr(g, "request_id", "-")
            return response

        @app.route("/healthz")
        def healthz():
            return jsonify({"status": "healthy", "service": service_name}), 200

        @app.route("/readyz")
        def readyz():
            # Aquí se verifica DB, Redis, etc.
            return jsonify({"status": "ready"}), 200`
            },
            {
                type: "code", lang: "python", file: "recursos/observabilidad/ai_log_watcher.py",
                title: "ai_log_watcher.py - Agente de Triaje con Deduplicación SHA-256",
                code: `import hashlib, json
from http.server import HTTPServer, BaseHTTPRequestHandler

class ErrorFingerprinter:
    """Evita tormentas de alertas generando huellas SHA-256 de errores."""
    def __init__(self):
        self.seen_hashes = set()

    def get_fingerprint(self, error_message, source_file=""):
        normalized = f"{source_file}::{error_message.strip()}"
        return hashlib.sha256(normalized.encode("utf-8")).hexdigest()

    def is_duplicate(self, error_message, source_file=""):
        fp = self.get_fingerprint(error_message, source_file)
        if fp in self.seen_hashes:
            return True
        self.seen_hashes.add(fp)
        return False

# Servidor daemon que recibe webhooks de Coolify
# POST /webhook/coolify -> Analiza con IA -> Envía alerta a Discord/Telegram/Slack`
            },
            {
                type: "code", lang: "yaml", file: "recursos/observabilidad/docker-compose.observability.yml",
                title: "docker-compose.observability.yml - Stack con Dozzle y Agente AI SRE",
                code: `version: '3.8'
services:
  app:
    build: .
    ports:
      - "8000:8000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/healthz"]
      interval: 15s
      timeout: 5s
      retries: 3
    restart: unless-stopped

  dozzle:
    image: amir20/dozzle:latest
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    ports:
      - "8888:8080"
    environment:
      - DOZZLE_LEVEL=info
    restart: unless-stopped

  ai-watcher:
    build:
      context: .
      dockerfile: Dockerfile
    command: python recursos/observabilidad/ai_log_watcher.py
    ports:
      - "9050:9050"
    environment:
      - COOLIFY_WEBHOOK_SECRET=\${COOLIFY_WEBHOOK_SECRET}
      - DISCORD_WEBHOOK_URL=\${DISCORD_WEBHOOK_URL}
    restart: unless-stopped`
            },
            {
                type: "steps",
                title: "Paso a Paso del Aprendiz: De Código a Observabilidad en Coolify con IA",
                intro: "Aprende el flujo completo para monitorear tus contenedores desplegados en un servidor VPS usando Coolify y triaje con IA.",
                steps: [
                    {
                        number: 1,
                        title: "Instrumentar la aplicación con logs estructurados JSON",
                        tag: "Paso 1: Código",
                        desc: "Integra `JSONFormatter` y `FlaskObservability` en tu servidor Flask. Cada línea de log se emitirá como un objeto JSON con timestamp ISO y correlación `X-Request-ID`.",
                        command: "python recursos/observabilidad/app_flask_ejemplo.py",
                        tip: "Los logs en JSON eliminan errores de parseo por saltos de línea cuando una excepción Python imprime un stack trace largo.",
                        pitfall: "Usar prints simples sin timestamp; en contenedores Docker es imposible saber cuándo ocurrió el fallo."
                    },
                    {
                        number: 2,
                        title: "Desplegar Dozzle para inspección visual de logs en tiempo real",
                        tag: "Paso 2: Contenedor",
                        desc: "Despliega Dozzle montando `/var/run/docker.sock`. Te permite buscar y filtrar logs de todos los contenedores desde tu navegador web sin abrir sesiones SSH.",
                        command: "docker compose -f recursos/observabilidad/docker-compose.observability.yml up -d dozzle",
                        tip: "Dozzle consume menos de 15MB de memoria RAM y soporta filtros con expresiones regulares y streaming en vivo.",
                        pitfall: "Dejar Dozzle público sin configurar credenciales de autenticación básica (DOZZLE_USERNAME y DOZZLE_PASSWORD)."
                    },
                    {
                        number: 3,
                        title: "Configurar Webhooks de incidentes en Coolify",
                        tag: "Paso 3: Coolify",
                        desc: "En el panel de Coolify ve a Notificaciones > Webhook. Registra la URL del agente de IA (`http://localhost:9050/webhook/coolify`) y activa los eventos 'Deployment failure' y 'Restart limit reached'.",
                        command: "curl -X POST http://localhost:9050/webhook/coolify -H 'Content-Type: application/json' -d '{\"event\":\"restart_limit_reached\",\"application_name\":\"catalogo-flask\"}'",
                        tip: "El evento 'Restart limit reached' detecta cuando un contenedor cae repetidamente en un Crash-Loop antes de saturar el VPS.",
                        pitfall: "No validar el header X-Coolify-Secret en el webhook, exponiendo el servidor de IA a peticiones maliciosas."
                    },
                    {
                        number: 4,
                        title: "Activar el Agente AI SRE para triaje y remediación asistida",
                        tag: "Paso 4: Diagnóstico IA",
                        desc: "Inicia `ai_log_watcher.py`. Al recibir una alerta de Coolify, extrae las últimas 50 líneas del log, deduplica por huella SHA-256 y emite el informe estructurado (Causa Raíz, Severidad y Parche sugerido).",
                        command: "python recursos/observabilidad/ai_log_watcher.py --test",
                        tip: "La huella SHA-256 evita que el agente de IA gaste tokens procesando 50 veces el mismo error que se repite en bucle.",
                        pitfall: "Aplicar parches de código propuestos por la IA a ciegas sin verificar con la suite de pruebas unitarias (`pytest tests/`)."
                    }
                ]
            },
            {
                type: "tools",
                title: "Stack de Observabilidad Post-Despliegue",
                stack: [
                    {
                        icon: "🐳", name: "Coolify", tag: "PaaS / VPS",
                        role: "Plataforma self-hosted para desplegar contenedores, gestionar variables de entorno y emitir webhooks de ciclo de vida.",
                        when: "Despliegues en servidores VPS propios (Hetzner, DigitalOcean, AWS)."
                    },
                    {
                        icon: "📋", name: "Dozzle", tag: "Log Viewer",
                        role: "Visor ligero de logs en tiempo real para Docker con búsqueda y filtros instantáneos.",
                        when: "Inspección operativa sin necesidad de configurar stacks pesados como ELK o Grafana Loki."
                    },
                    {
                        icon: "🤖", name: "AI Log Watcher", tag: "AI SRE",
                        role: "Daemon multihilo que escucha eventos de Coolify y analiza logs con modelos LLM para generar diagnósticos RCA.",
                        when: "Respuesta a incidentes y triaje automatizado 24/7."
                    }
                ]
            }
        ]
    }
});
