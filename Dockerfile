# ==============================================================================
# Dockerfile: Servicio de Guía Web Estática (Nginx)
# Despliegue en Coolify / Docker
# ==============================================================================

FROM nginx:1.25-alpine

LABEL maintainer="SENA ADSO <desarrollo@sena.edu.co>"
LABEL description="Servidor Nginx ultraligero para la Guía Web Interactiva"

# Limpiar directorio web predeterminado
RUN rm -rf /usr/share/nginx/html/*

# Copiar archivos estáticos de la guía web (carpeta web/)
COPY web/ /usr/share/nginx/html/

# Configurar permisos para lectura global
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80

# Coolify lo usa para saber si el contenedor esta listo. Sin healthcheck da
# por sano el contenedor en cuanto arranca el proceso, aunque no responda.
# wget viene en Alpine; no hace falta instalar curl.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
