"""Fase 1: Pruebas unitarias de validacion con Pydantic v2."""
import pytest
from pydantic import ValidationError
from schemas.producto import ProductoCreate, ProductoUpdate


def test_producto_create_valido():
    p = ProductoCreate(nombre="Teclado Gamer", precio=120.0, stock=15, categoria_id=2)
    assert p.nombre == "Teclado Gamer"
    assert p.precio == 120.0
    assert p.stock == 15


def test_producto_create_precio_cero_o_negativo():
    with pytest.raises(ValidationError):
        ProductoCreate(nombre="Mouse", precio=0.0)
    with pytest.raises(ValidationError):
        ProductoCreate(nombre="Mouse", precio=-10.0)


def test_producto_create_nombre_vacio():
    with pytest.raises(ValidationError):
        ProductoCreate(nombre="", precio=50.0)


def test_producto_update_parcial():
    u = ProductoUpdate(precio=89.99)
    assert u.precio == 89.99
    assert u.nombre is None
    assert u.stock is None
