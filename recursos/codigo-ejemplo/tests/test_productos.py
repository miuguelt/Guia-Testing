"""Tests del CRUD de productos del microservicio FastAPI."""
from fastapi import status


def test_crear_producto(client):
    response = client.post("/productos/", json={
        "nombre": "Laptop HP",
        "precio": 1500.00,
        "stock": 10,
        "categoria_id": 1,
    })
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["nombre"] == "Laptop HP"
    assert "id" in data


def test_listar_productos_vacio(client):
    response = client.get("/productos/")
    assert response.status_code == 200
    assert response.json() == []


def test_obtener_producto_no_existente(client):
    response = client.get("/productos/9999")
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_actualizar_producto(client):
    r = client.post("/productos/", json={"nombre": "Mouse", "precio": 25.0, "stock": 50})
    pid = r.json()["id"]
    response = client.put(f"/productos/{pid}", json={"nombre": "Mouse Logitech", "precio": 35.0})
    assert response.status_code == 200
    assert response.json()["nombre"] == "Mouse Logitech"


def test_soft_delete(client):
    r = client.post("/productos/", json={"nombre": "Teclado", "precio": 40.0, "stock": 5})
    pid = r.json()["id"]
    response = client.delete(f"/productos/{pid}")
    assert response.status_code == 204


def test_validacion_precio_negativo(client):
    response = client.post("/productos/", json={"nombre": "X", "precio": -10, "stock": 5})
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT


def test_validacion_precio_cero(client):
    response = client.post("/productos/", json={"nombre": "X", "precio": 0, "stock": 5})
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT

