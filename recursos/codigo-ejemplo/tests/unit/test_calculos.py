"""Fase 1: Pruebas unitarias de logica pura de dominio (sin DB, sin I/O)."""
import pytest
from services.calculos import (
    calcular_subtotal,
    aplicar_descuento,
    calcular_iva,
    calcular_total_con_impuestos,
    clasificar_nivel_stock,
)


def test_calcular_subtotal_correcto():
    assert calcular_subtotal(100.0, 3) == 300.0
    assert calcular_subtotal(49.99, 2) == 99.98


def test_calcular_subtotal_valores_negativos():
    with pytest.raises(ValueError, match="no puede ser negativa"):
        calcular_subtotal(100.0, -1)
    with pytest.raises(ValueError, match="no puede ser negativo"):
        calcular_subtotal(-50.0, 2)


def test_aplicar_descuento_valido():
    assert aplicar_descuento(100.0, 10.0) == 90.0
    assert aplicar_descuento(200.0, 0.0) == 200.0
    assert aplicar_descuento(150.0, 100.0) == 0.0


def test_aplicar_descuento_fuera_de_rango():
    with pytest.raises(ValueError, match="entre 0 y 100"):
        aplicar_descuento(100.0, -5.0)
    with pytest.raises(ValueError, match="entre 0 y 100"):
        aplicar_descuento(100.0, 105.0)


def test_calcular_iva():
    assert calcular_iva(100.0, 0.19) == 19.0
    assert calcular_iva(200.0, 0.0) == 0.0


def test_calcular_total_con_impuestos_completo():
    # Precio: 1000, Cantidad: 2 -> Subtotal: 2000
    # Descuento 10% -> Base: 1800
    # IVA 19% de 1800 -> 342
    # Total esperado: 2142.0
    total = calcular_total_con_impuestos(precio=1000.0, cantidad=2, porcentaje_descuento=10.0, tasa_iva=0.19)
    assert total == 2142.0


@pytest.mark.parametrize("actual,minimo,esperado", [
    (0, 5, "AGOTADO"),
    (2, 5, "CRITICO"),
    (5, 5, "CRITICO"),
    (10, 5, "OPTIMO"),
    (30, 5, "SOBRESTOCK"),
])
def test_clasificar_nivel_stock(actual, minimo, esperado):
    assert clasificar_nivel_stock(actual, minimo) == esperado


def test_casos_borde_calculos_negativos():
    with pytest.raises(ValueError, match="El monto no puede ser negativo"):
        aplicar_descuento(-10.0, 5.0)

    with pytest.raises(ValueError, match="La base imponible no puede ser negativa"):
        calcular_iva(-100.0, 0.19)

    with pytest.raises(ValueError, match="La tasa de IVA no puede ser negativa"):
        calcular_iva(100.0, -0.19)

    with pytest.raises(ValueError, match="no pueden ser negativos"):
        clasificar_nivel_stock(-1, 5)

    with pytest.raises(ValueError, match="no pueden ser negativos"):
        clasificar_nivel_stock(5, -1)

