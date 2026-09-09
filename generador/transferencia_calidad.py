"""Bloques 4.4.3 y 4.4.4: auditoría qa_auditor y observabilidad con IA."""
from .estilos import agregar_pasos


def qa_auditor(doc):
    doc.add_heading("4.4.3 Auditoría del código generado con IA (qa_auditor)", level=3)
    doc.add_paragraph(
        "Sistema en recursos/auditoria-seguridad/ que mide 9 dimensiones de "
        "calidad y detecta anomalías en código generado con IA: pruebas "
        "vacías, imports alucinados y vulnerabilidades OWASP. Comando: "
        "python -m qa_auditor --target ..\\codigo-ejemplo --url "
        "http://localhost:8000 --min-score 80"
    )


def observabilidad(doc):
    doc.add_heading("4.4.4 Observabilidad post-despliegue y triaje con IA", level=3)
    agregar_pasos(doc, "Paso a paso para observabilidad y diagnóstico en VPS:", [
        {"num": 1, "titulo": "Registros JSON y correlación", "desc": "Configurar JSONFormatter en Flask inyectando X-Request-ID y endpoints /healthz, /readyz y /metrics.", "cmd": "python recursos/observabilidad/app_flask_ejemplo.py", "tip": "Los registros JSON evitan errores de análisis y facilitan el procesamiento por agentes de IA."},
        {"num": 2, "titulo": "Alertas en Coolify", "desc": "Activar en Coolify notificaciones de fallo de despliegue y límite de reinicios vía Discord o Webhook.", "cmd": "curl -X POST http://localhost:9050/webhook/coolify", "tip": "Los límites de reinicios detectan ciclos de caída antes de saturar el servidor VPS."},
        {"num": 3, "titulo": "Visor Dozzle", "desc": "Desplegar Dozzle montando /var/run/docker.sock para inspeccionar registros en vivo desde la web.", "cmd": "docker compose -f recursos/observabilidad/docker-compose.observability.yml up -d", "tip": "Dozzle consume menos de 15 MB de RAM y permite búsquedas con expresiones regulares."},
        {"num": 4, "titulo": "Agente SRE con IA", "desc": "Ejecutar ai_log_watcher para deduplicar incidentes con SHA-256 y generar diagnóstico RCA.", "cmd": "python recursos/observabilidad/ai_log_watcher.py --test", "tip": "El mensaje estructurado devuelve severidad, causa raíz y el parche de código exacto."},
    ])
