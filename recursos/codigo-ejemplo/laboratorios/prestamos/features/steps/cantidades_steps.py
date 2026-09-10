from behave import given, when, then

from cantidades import cantidad_valida


@given("una solicitud de {cantidad:d} equipos")
def preparar_solicitud(context, cantidad):
    context.cantidad = cantidad


@when("valido la cantidad solicitada")
def validar_solicitud(context):
    context.resultado = cantidad_valida(context.cantidad)


@then("la cantidad es {resultado}")
def comprobar_resultado(context, resultado):
    assert resultado in ("aceptada", "rechazada")
    assert context.resultado is (resultado == "aceptada")
