"""
Tests para el Framework de Observabilidad y AI Log Watcher.
"""
import json
import logging
import os
import sys
import time
import pytest

# Incluir recursos/observabilidad en el PYTHONPATH
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OBS_DIR = os.path.join(BASE_DIR, "recursos", "observabilidad")
if OBS_DIR not in sys.path:
    sys.path.insert(0, OBS_DIR)

from flask_observability import JSONFormatter, SimpleMetricsRegistry, FlaskObservability
from ai_log_watcher import ErrorFingerprinter, AILogAnalyzer, CoolifyWebhookServer


def test_json_formatter_emits_valid_json():
    formatter = JSONFormatter(service_name="test-service", environment="test")
    record = logging.LogRecord(
        name="test_logger",
        level=logging.ERROR,
        pathname="/app/main.py",
        lineno=42,
        msg="Error de prueba en base de datos",
        args=(),
        exc_info=None,
    )
    output = formatter.format(record)
    parsed = json.loads(output)

    assert parsed["service"] == "test-service"
    assert parsed["level"] == "ERROR"
    assert parsed["message"] == "Error de prueba en base de datos"
    assert "timestamp" in parsed
    assert parsed["source"] == "main.py:42"


def test_json_formatter_captures_exception_trace():
    formatter = JSONFormatter(service_name="test-service")
    try:
        raise ValueError("Parametro invalido en endpoint")
    except ValueError:
        exc_info = sys.exc_info()

    record = logging.LogRecord(
        name="test_logger",
        level=logging.CRITICAL,
        pathname="/app/main.py",
        lineno=50,
        msg="Fallo critico",
        args=(),
        exc_info=exc_info,
    )
    output = formatter.format(record)
    parsed = json.loads(output)

    assert "exception" in parsed
    assert "ValueError: Parametro invalido en endpoint" in parsed["exception"]


def test_simple_metrics_registry():
    registry = SimpleMetricsRegistry()
    registry.record_request(method="GET", endpoint="/productos", status_code=200, duration_seconds=0.012)
    registry.record_request(method="GET", endpoint="/productos", status_code=200, duration_seconds=0.018)
    registry.record_request(method="POST", endpoint="/productos", status_code=201, duration_seconds=0.045)

    prom_text = registry.generate_prometheus_output()
    assert 'http_requests_total{method="GET",endpoint="/productos",status="200"} 2' in prom_text
    assert 'http_requests_total{method="POST",endpoint="/productos",status="201"} 1' in prom_text
    assert "http_request_duration_seconds_total" in prom_text


def test_flask_observability_endpoints():
    try:
        from flask import Flask
    except ImportError:
        pytest.skip("Flask no esta instalado en este interprete")

    app = Flask("test-app")
    obs = FlaskObservability(app, service_name="test-app")

    client = app.test_client()

    # 1. Probar liveness probe
    res_health = client.get("/healthz")
    assert res_health.status_code == 200
    data_health = res_health.get_json()
    assert data_health["status"] == "healthy"
    assert data_health["service"] == "test-app"

    # 2. Probar readiness probe
    res_ready = client.get("/readyz")
    assert res_ready.status_code == 200
    assert res_ready.get_json()["status"] == "ready"

    # 3. Probar metricas Prometheus
    res_metrics = client.get("/metrics")
    assert res_metrics.status_code == 200
    assert "http_requests_total" in res_metrics.get_data(as_text=True)

    # 4. Probar header de correlacion X-Request-ID
    res_with_id = client.get("/healthz", headers={"X-Request-ID": "custom-uuid-1234"})
    assert res_with_id.headers.get("X-Request-ID") == "custom-uuid-1234"


def test_error_fingerprinter_deduplication():
    fp = ErrorFingerprinter(window_seconds=10)
    log_a = "2026-09-06T15:00:00Z ConnectionRefusedError: [Errno 111] Connection refused on db:5432"
    log_b = "2026-09-06T15:00:05Z ConnectionRefusedError: [Errno 111] Connection refused on db:5432"

    hash_a = fp.compute_fingerprint(log_a)
    hash_b = fp.compute_fingerprint(log_b)

    assert hash_a == hash_b
    assert fp.should_process(hash_a) is True
    # Inmediatamente despues debe silenciarse por deduplicacion
    assert fp.should_process(hash_b) is False


def test_ai_log_analyzer_heuristic_fallback():
    analyzer = AILogAnalyzer(api_key=None)

    # Caso 1: Out of Memory
    oom_log = "Killed process 1234 (python) total-vm:2048000kB, anon-rss:1048000kB. Out of memory: Kill process."
    result_oom = analyzer.analyze("flask-api", "restart_limit_reached", oom_log)
    assert result_oom["severity"] == "CRITICAL"
    assert "OOM" in result_oom["root_cause"] or "memoria" in result_oom["root_cause"].lower()
    assert "Memory Limit" in result_oom["coolify_action"]

    # Caso 2: Database Connection Refused
    db_log = "OperationalError: connection to server at 'postgres' (172.18.0.3), port 5432 failed: Connection refused"
    result_db = analyzer.analyze("flask-api", "restart_limit_reached", db_log)
    assert result_db["severity"] == "HIGH"
    assert "base de datos" in result_db["root_cause"].lower() or "conexion" in result_db["root_cause"].lower()


def test_coolify_webhook_server_processing():
    server = CoolifyWebhookServer()
    payload = {
        "event": "restart_limit_reached",
        "resource_name": "mi-contenedor-flask",
        "logs": "MemoryError: Unable to allocate 512 MiB for array with shape",
    }
    res = server.process_coolify_payload(payload)
    assert res["status"] == "analyzed"
    assert res["resource"] == "mi-contenedor-flask"
    assert "rca" in res
    assert "severity" in res["rca"]


def test_alert_dispatcher_telegram_and_slack(monkeypatch):
    from ai_log_watcher import AlertDispatcher

    sent_requests = []

    class MockResponse:
        def __init__(self, status=200):
            self.status = status
        def __enter__(self):
            return self
        def __exit__(self, *args):
            pass

    def mock_urlopen(req, timeout=10):
        sent_requests.append(req)
        return MockResponse(200)

    import urllib.request
    monkeypatch.setattr(urllib.request, "urlopen", mock_urlopen)

    rca_sample = {
        "severity": "HIGH",
        "root_cause": "Conexion rechazada a PostgreSQL",
        "impact": "HTTP 500 en /productos",
        "coolify_action": "Reiniciar servicio db",
        "code_fix": "pool_pre_ping=True",
    }

    # Probar Telegram
    ok_tg = AlertDispatcher.send_telegram_alert("token123", "chat999", "api-flask", rca_sample)
    assert ok_tg is True
    assert len(sent_requests) == 1
    tg_body = json.loads(sent_requests[-1].data.decode("utf-8"))
    assert tg_body["chat_id"] == "chat999"
    assert "Conexion rechazada a PostgreSQL" in tg_body["text"]

    # Probar Slack
    ok_slack = AlertDispatcher.send_slack_webhook("https://hooks.slack.com/services/test", "api-flask", rca_sample)
    assert ok_slack is True
    assert len(sent_requests) == 2
    slack_body = json.loads(sent_requests[-1].data.decode("utf-8"))
    assert "attachments" in slack_body
    assert slack_body["attachments"][0]["color"] == "#E67E22"


def test_app_flask_ejemplo_routes():
    try:
        from app_flask_ejemplo import app as demo_app, DB_STATUS
    except ImportError:
        pytest.skip("Flask no disponible para app_flask_ejemplo")

    client = demo_app.test_client()

    # 1. Ruta index
    res_index = client.get("/")
    assert res_index.status_code == 200
    assert "endpoints" in res_index.get_json()

    # 2. Listar productos
    res_prod = client.get("/api/productos")
    assert res_prod.status_code == 200
    assert len(res_prod.get_json()["productos"]) >= 3

    # 3. Crear producto inválido
    res_bad = client.post("/api/productos", json={"nombre": ""})
    assert res_bad.status_code == 400

    # 4. Simulación de fallo 500
    res_err = client.get("/api/simular-error")
    assert res_err.status_code == 500
    err_json = res_err.get_json()
    assert err_json["error"] == "Internal Server Error"
    assert "request_id" in err_json

    # 5. Simulación de toggle de base de datos
    # Estado inicial: DB conectada -> readyz responde 200
    assert client.get("/readyz").status_code == 200
    # Apagar DB
    client.get("/api/simular-db-toggle")
    assert client.get("/readyz").status_code == 503
    # Restaurar DB
    client.get("/api/simular-db-toggle")
    assert client.get("/readyz").status_code == 200

