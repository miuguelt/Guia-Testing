# ==============================================================================
# Dockerfile: Microservicio Flask con Observabilidad para Coolify
# ==============================================================================
FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias de ejecución mínimas
RUN pip install --no-cache-dir flask

# Copiar código fuente
COPY flask_observability.py /app/flask_observability.py
COPY app_flask_ejemplo.py /app/app_flask_ejemplo.py

# Usuario sin privilegios por seguridad
RUN useradd -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

# Healthcheck nativo para Coolify (usa wget preinstalado en Linux)
HEALTHCHECK --interval=20s --timeout=5s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/healthz')" || exit 1

ENV PYTHONUNBUFFERED=1
ENV SERVICE_NAME="flask-catalogo-service"
ENV PORT=8000

CMD ["python", "app_flask_ejemplo.py"]
