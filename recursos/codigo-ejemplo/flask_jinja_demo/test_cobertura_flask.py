import os
import pytest

# Clave local efímera para que Flask pueda firmar cookies y mensajes flash en pruebas
os.environ["FLASK_SECRET_KEY"] = "clave-local-prueba-cobertura"

from app import create_app


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as c:
        yield c


# ==============================================================================
# FASE 1: Caso Feliz (Happy Path)
# Al ejecutar solo esta prueba, pytest-cov reporta ~75% de cobertura y Missing: 16, 26-27, 32, 35-36
# ==============================================================================
def test_crear_producto_exitoso_con_flash(client):
    res = client.post(
        "/productos",
        data={"nombre": "Mouse Inalámbrico", "precio": "45.00"},
        follow_redirects=True,
    )
    assert res.status_code == 200
    assert "Producto creado." in res.get_data(as_text=True)


# ==============================================================================
# FASE 2: Validación de Nombre Vacío con Flash de Error
# Al agregar esta prueba, las líneas 26-27 desaparecen de la columna Missing
# ==============================================================================
def test_crear_producto_sin_nombre_muestra_flash_error(client):
    res = client.post(
        "/productos",
        data={"nombre": "", "precio": "45.00"},
    )
    assert res.status_code == 400
    assert "El nombre es obligatorio." in res.get_data(as_text=True)


# ==============================================================================
# FASE 3: Validación de Precios Inválidos (Negativo y Texto) con Flash de Error
# Al agregar estas pruebas, las líneas 32 y 35-36 desaparecen de Missing
# ==============================================================================
def test_crear_producto_precio_negativo_muestra_flash_error(client):
    res = client.post(
        "/productos",
        data={"nombre": "Teclado Mecánico", "precio": "-10.00"},
    )
    assert res.status_code == 400
    assert "El precio debe ser mayor que cero." in res.get_data(as_text=True)


def test_crear_producto_precio_no_numerico(client):
    res = client.post(
        "/productos",
        data={"nombre": "Monitor", "precio": "no-es-numero"},
    )
    assert res.status_code == 400
    assert "El precio debe ser mayor que cero." in res.get_data(as_text=True)


# ==============================================================================
# FASE 4: Redirección de Home y Validación de Configuración
# Cubre la línea 16 y la línea 12 -> Alcanza 100% de cobertura y Missing queda totalmente vacío
# ==============================================================================
def test_ruta_home_redirige_a_productos(client):
    res = client.get("/")
    assert res.status_code == 302
    assert "/productos" in res.headers["Location"]


def test_error_si_falta_secret_key(monkeypatch):
    monkeypatch.delenv("FLASK_SECRET_KEY", raising=False)
    with pytest.raises(RuntimeError, match="Define FLASK_SECRET_KEY"):
        create_app()

