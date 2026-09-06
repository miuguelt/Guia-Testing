"""Fase 3: Pruebas de integracion HTTP y Base de Datos con TestClient."""
from fastapi import status


def test_flujo_completo_producto(client):
    # 1. Crear producto
    create_res = client.post("/productos/", json={
        "nombre": "Monitor 4K",
        "precio": 350.0,
        "stock": 8,
        "categoria_id": 1,
    })
    assert create_res.status_code == status.HTTP_201_CREATED
    producto = create_res.json()
    pid = producto["id"]
    assert producto["nombre"] == "Monitor 4K"
    assert producto["activo"] is True

    # 2. Consultar producto creado
    get_res = client.get(f"/productos/{pid}")
    assert get_res.status_code == status.HTTP_200_OK
    assert get_res.json()["precio"] == 350.0

    # 3. Actualizar stock
    put_res = client.put(f"/productos/{pid}", json={"stock": 12})
    assert put_res.status_code == status.HTTP_200_OK
    assert put_res.json()["stock"] == 12

    # 4. Borrado logico
    del_res = client.delete(f"/productos/{pid}")
    assert del_res.status_code == status.HTTP_204_NO_CONTENT

    # 5. Verificar que ya no aparece en busqueda directa
    get_after_del = client.get(f"/productos/{pid}")
    assert get_after_del.status_code == status.HTTP_404_NOT_FOUND
