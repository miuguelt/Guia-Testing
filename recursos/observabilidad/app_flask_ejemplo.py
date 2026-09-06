"""
Aplicación Flask de Referencia con Observabilidad Completa para Coolify.

Demuestra:
1. Instrumentación completa con FlaskObservability (Logs JSON, X-Request-ID, /healthz, /readyz, /metrics).
2. Endpoints normales y de negocio.
3. Endpoints de simulación de fallos (Error 500 con traceback, Caída de base de datos) para probar el AI Log Watcher.
"""
import os
import sys
import time
from flask import Flask, jsonify, request

# Asegurar importación del módulo de observabilidad local
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from flask_observability import setup_observability

app = Flask(__name__)

# Estado simulado de conectividad con la base de datos
DB_STATUS = {"connected": True}


def check_db_health() -> bool:
    """Readiness probe: Verifica si la base de datos está disponible."""
    return DB_STATUS["connected"]


# Inicializar observabilidad
obs = setup_observability(
    app,
    service_name=os.getenv("SERVICE_NAME", "flask-catalogo-service"),
    readiness_check=check_db_health,
)

# Base de datos simulada en memoria
INVENTARIO = [
    {"id": 1, "nombre": "Laptop ThinkPad", "precio": 1200.0, "stock": 10},
    {"id": 2, "nombre": "Monitor 4K", "precio": 450.0, "stock": 15},
    {"id": 3, "nombre": "Teclado Mecanico", "precio": 95.0, "stock": 30},
]


@app.route("/", methods=["GET"])
def index():
    """Ruta raíz informativa."""
    return jsonify({
        "servicio": "Microservicio de Catálogo con Observabilidad",
        "endpoints": {
            "health": "/healthz",
            "readiness": "/readyz",
            "metrics": "/metrics",
            "productos": "/api/productos",
            "simular_error": "/api/simular-error",
            "simular_db_toggle": "/api/simular-db-toggle",
        }
    })


@app.route("/api/productos", methods=["GET"])
def listar_productos():
    """Endpoint de negocio normal."""
    app.logger.info("Consultando lista de productos de inventario", extra={
        "extra_data": {"total_items": len(INVENTARIO)}
    })
    return jsonify({"productos": INVENTARIO, "total": len(INVENTARIO)}), 200


@app.route("/api/productos", methods=["POST"])
def crear_producto():
    """Creación con validación básica."""
    data = request.get_json(silent=True) or {}
    if not data.get("nombre") or "precio" not in data:
        app.logger.warning("Intento de creación de producto con datos incompletos", extra={
            "extra_data": {"payload": data}
        })
        return jsonify({"error": "Campos 'nombre' y 'precio' son obligatorios"}), 400

    nuevo = {
        "id": len(INVENTARIO) + 1,
        "nombre": data["nombre"],
        "precio": float(data["precio"]),
        "stock": int(data.get("stock", 0)),
    }
    INVENTARIO.append(nuevo)
    app.logger.info(f"Producto creado exitosamente: {nuevo['nombre']}", extra={
        "extra_data": {"producto_id": nuevo["id"]}
    })
    return jsonify(nuevo), 201


@app.route("/api/simular-error", methods=["GET"])
def simular_error():
    """
    Ruta para simular un fallo interno no controlado (HTTP 500).
    Permite verificar cómo el JSONFormatter captura el stack trace y cómo
    el AI Log Watcher procesa el log para generar el diagnóstico.
    """
    app.logger.info("Iniciando operación propensa a fallo simulado...")
    # Simulación de un cálculo inválido o error en repositorio
    divisor = 0
    resultado = 100 / divisor
    return jsonify({"resultado": resultado})


@app.route("/api/simular-db-toggle", methods=["POST", "GET"])
def simular_db_toggle():
    """
    Alterna el estado de la base de datos simulada para probar el probe /readyz.
    Cuando DB_STATUS es False, /readyz responde 503 Service Unavailable en Coolify.
    """
    DB_STATUS["connected"] = not DB_STATUS["connected"]
    estado = "CONECTADA" if DB_STATUS["connected"] else "DESCONECTADA (SIMULACIÓN DE CAÍDA)"
    app.logger.warning(f"Estado de la base de datos modificado manualmente: {estado}")
    return jsonify({"db_connected": DB_STATUS["connected"], "mensaje": f"Base de datos ahora {estado}"})


if __name__ == "__main__":
    puerto = int(os.getenv("PORT", 8000))
    print(f"[*] Iniciando Flask Observability App en http://0.0.0.0:{puerto}")
    app.run(host="0.0.0.0", port=puerto, debug=False)
