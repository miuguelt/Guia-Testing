"""Fase 4: Ejecucion automatizada de escenarios BDD en pytest."""
from services.calculos import clasificar_nivel_stock, calcular_total_con_impuestos


def test_bdd_escenario_stock_critico():
    # Dado un producto con stock actual de 3 unidades y stock minimo de 5
    actual = 3
    minimo = 5
    # Cuando se clasifica el nivel de stock
    resultado = clasificar_nivel_stock(actual, minimo)
    # Entonces el estado resultante es "CRITICO"
    assert resultado == "CRITICO"


def test_bdd_escenario_calculo_orden_con_descuento_e_iva():
    # Dado un precio unitario de 500.0 y una cantidad de 4
    precio = 500.0
    cantidad = 4
    # Cuando se aplica un descuento del 10% y un IVA del 19%
    total = calcular_total_con_impuestos(precio, cantidad, porcentaje_descuento=10.0, tasa_iva=0.19)
    # Entonces el total final a facturar es 2142.0
    assert total == 2142.0
