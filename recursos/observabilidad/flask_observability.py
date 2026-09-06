"""
Módulo de Observabilidad para Flask en Entornos Contenedorizados (Coolify / Docker).

Proporciona:
1. Logs estructurados en formato JSON (machine-readable) para ingesta automatizada.
2. Inyección y propagación de Correlation ID (X-Request-ID).
3. Probes de salud estandarizadas: /healthz (liveness) y /readyz (readiness).
4. Métricas de latencia y conteo de peticiones HTTP compatibles con Prometheus.
"""
from __future__ import annotations

import json
import logging
import sys
import time
import uuid
from typing import Any, Callable, Dict, List, Optional
from flask import Flask, Request, Response, g, jsonify, request


class JSONFormatter(logging.Formatter):
    """
    Formateador de logs que serializa los registros a JSON plano en una sola línea.
    Facilita el parseo determinista por herramientas como Loki, Vector o agentes de IA.
    """

    def __init__(self, service_name: str = "flask-service", environment: str = "production"):
        super().__init__()
        self.service_name = service_name
        self.environment = environment

    def format(self, record: logging.LogRecord) -> str:
        timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(record.created))
        
        # Extraer correlation id desde el contexto de Flask si existe
        request_id = "N/A"
        try:
            if hasattr(g, "request_id"):
                request_id = g.request_id
        except RuntimeError:
            # Fuera de contexto de petición
            pass

        log_payload: Dict[str, Any] = {
            "timestamp": timestamp,
            "level": record.levelname,
            "service": self.service_name,
            "environment": self.environment,
            "logger": record.name,
            "message": record.getMessage(),
            "request_id": request_id,
            "source": f"{record.filename}:{record.lineno}",
        }

        # Incluir metadatos adicionales pasados en extra={}
        if hasattr(record, "extra_data") and isinstance(record.extra_data, dict):
            log_payload["data"] = record.extra_data

        # Capturar excepción formateada si existe
        if record.exc_info:
            log_payload["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_payload, ensure_ascii=False)


class SimpleMetricsRegistry:
    """
    Registro ligero de métricas HTTP en memoria (formato de texto Prometheus).
    Evita dependencias binarias pesadas si prometheus_client no está instalado.
    """

    def __init__(self) -> None:
        self.total_requests: Dict[str, int] = {}
        self.total_duration_seconds: Dict[str, float] = {}
        self.in_flight_requests: int = 0

    def record_request(self, method: str, endpoint: str, status_code: int, duration_seconds: float) -> None:
        key = f"{method}:{endpoint}:{status_code}"
        self.total_requests[key] = self.total_requests.get(key, 0) + 1
        self.total_duration_seconds[key] = self.total_duration_seconds.get(key, 0.0) + duration_seconds

    def generate_prometheus_output(self) -> str:
        lines: List[str] = [
            "# HELP http_requests_total Total de peticiones HTTP procesadas",
            "# TYPE http_requests_total counter",
        ]
        for key, count in sorted(self.total_requests.items()):
            method, endpoint, status = key.split(":", 2)
            lines.append(f'http_requests_total{{method="{method}",endpoint="{endpoint}",status="{status}"}} {count}')

        lines.extend([
            "# HELP http_request_duration_seconds_total Duracion acumulada de peticiones en segundos",
            "# TYPE http_request_duration_seconds_total counter",
        ])
        for key, duration in sorted(self.total_duration_seconds.items()):
            method, endpoint, status = key.split(":", 2)
            lines.append(f'http_request_duration_seconds_total{{method="{method}",endpoint="{endpoint}",status="{status}"}} {duration:.6f}')

        return "\n".join(lines) + "\n"


class FlaskObservability:
    """
    Extension integral de observabilidad para Flask.
    """

    def __init__(
        self,
        app: Optional[Flask] = None,
        service_name: str = "flask-app",
        readiness_check: Optional[Callable[[], bool]] = None,
    ) -> None:
        self.service_name = service_name
        self.readiness_check = readiness_check or (lambda: True)
        self.metrics = SimpleMetricsRegistry()
        self.logger = logging.getLogger(service_name)
        if app is not None:
            self.init_app(app)

    def init_app(self, app: Flask) -> None:
        self._configure_logging(app)
        self._register_hooks(app)
        self._register_endpoints(app)
        app.extensions["observability"] = self

    def _configure_logging(self, app: Flask) -> None:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(JSONFormatter(service_name=self.service_name))
        
        # Reemplazar handlers predeterminados para evitar texto plano
        app.logger.handlers.clear()
        app.logger.addHandler(handler)
        app.logger.setLevel(logging.INFO)
        self.logger = app.logger

    def _register_hooks(self, app: Flask) -> None:
        @app.before_request
        def before_request_hook() -> None:
            g.start_time = time.time()
            # Asignar o propagar X-Request-ID
            incoming_id = request.headers.get("X-Request-ID")
            g.request_id = incoming_id if incoming_id else str(uuid.uuid4())
            self.metrics.in_flight_requests += 1

        @app.after_request
        def after_request_hook(response: Response) -> Response:
            # Devolver el Request ID al cliente para trazabilidad cruzada
            if hasattr(g, "request_id"):
                response.headers["X-Request-ID"] = g.request_id

            duration = time.time() - getattr(g, "start_time", time.time())
            status = response.status_code
            endpoint = request.endpoint or "unknown"
            method = request.method

            self.metrics.record_request(method, endpoint, status, duration)
            self.metrics.in_flight_requests = max(0, self.metrics.in_flight_requests - 1)

            # Emitir log estructurado de la peticion
            log_level = logging.INFO if status < 400 else (logging.WARNING if status < 500 else logging.ERROR)
            app.logger.log(
                log_level,
                f"{method} {request.path} -> {status} ({duration * 1000:.2f}ms)",
                extra={"extra_data": {
                    "method": method,
                    "path": request.path,
                    "status_code": status,
                    "duration_ms": round(duration * 1000, 2),
                    "remote_addr": request.remote_addr,
                }},
            )
            return response

        @app.errorhandler(Exception)
        def handle_unhandled_exception(e: Exception):
            # Loguear con stack trace completo en JSON
            app.logger.error(
                f"Excepcion no controlada: {str(e)}",
                exc_info=True,
                extra={"extra_data": {"path": request.path, "method": request.method}},
            )
            return jsonify({
                "error": "Internal Server Error",
                "message": "Ha ocurrido un error interno.",
                "request_id": getattr(g, "request_id", "N/A"),
            }), 500

    def _register_endpoints(self, app: Flask) -> None:
        @app.route("/healthz", methods=["GET"])
        def healthz():
            """Liveness probe para Coolify / Docker: el contenedor esta vivo."""
            return jsonify({
                "status": "healthy",
                "service": self.service_name,
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            }), 200

        @app.route("/readyz", methods=["GET"])
        def readyz():
            """Readiness probe para Coolify: el servicio puede atender trafico."""
            is_ready = True
            try:
                is_ready = self.readiness_check()
            except Exception as exc:
                app.logger.warning(f"Fallo en check de readiness: {exc}")
                is_ready = False

            if is_ready:
                return jsonify({"status": "ready", "service": self.service_name}), 200
            return jsonify({"status": "unready", "error": "Dependency unavailable"}), 503

        @app.route("/metrics", methods=["GET"])
        def metrics():
            """Endpoint raspable por Prometheus o herramientas de monitoreo."""
            output = self.metrics.generate_prometheus_output()
            return Response(output, mimetype="text/plain; version=0.0.4; charset=utf-8")


def setup_observability(
    app: Flask,
    service_name: str = "flask-app",
    readiness_check: Optional[Callable[[], bool]] = None,
) -> FlaskObservability:
    """Helper directo para inicializar la observabilidad en una aplicacion Flask."""
    return FlaskObservability(app, service_name=service_name, readiness_check=readiness_check)
