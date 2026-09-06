"""Fase 4: Step definitions de Behave / BDD."""
from services.calculos import clasificar_nivel_stock, calcular_total_con_impuestos

try:
    from behave import given, when, then
except ImportError:
    # Si behave no esta instalado, proveemos decoradores no-op de compatibilidad didactica
    def given(pattern): return lambda f: f
    when = given
    then = given


@given('un producto con stock actual de {actual:d} unidades y stock minimo de {minimo:d}')
def step_dado_stock(context, actual, minimo):
    context.stock_actual = actual
    context.stock_minimo = minimo


@when('se clasifica el nivel de stock')
def step_clasificar(context):
    context.resultado_stock = clasificar_nivel_stock(context.stock_actual, context.stock_minimo)


@then('el estado resultante es "{esperado}"')
def step_verificar_estado(context, esperado):
    assert context.resultado_stock == esperado


@given('un precio unitario de {precio:f} y una cantidad de {cantidad:d}')
def step_dado_precio_cantidad(context, precio, cantidad):
    context.precio = precio
    context.cantidad = cantidad


@when('se aplica un descuento del {descuento:f} por ciento y un IVA del {iva:f} por ciento')
def step_calcular_total(context, descuento, iva):
    tasa_iva = iva / 100.0
    context.total = calcular_total_con_impuestos(context.precio, context.cantidad, descuento, tasa_iva)


@then('el total final a facturar es {total_esperado:f}')
def step_verificar_total(context, total_esperado):
    assert context.total == total_esperado
