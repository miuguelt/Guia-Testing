import pytest

from cantidades import cantidad_valida


@pytest.mark.parametrize("cantidad,esperado", [
    (0, False), (1, True), (3, True), (5, True), (6, False), (-1, False),
])
def test_limites(cantidad, esperado):
    assert cantidad_valida(cantidad) is esperado


@pytest.mark.parametrize("cantidad", [None, "3", 1.5, True, False, [], {}])
def test_rechaza_tipos_no_enteros(cantidad):
    assert cantidad_valida(cantidad) is False
