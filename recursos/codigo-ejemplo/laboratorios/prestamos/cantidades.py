MIN_EQUIPOS = 1
MAX_EQUIPOS = 5


def cantidad_valida(cantidad):
    return type(cantidad) is int and MIN_EQUIPOS <= cantidad <= MAX_EQUIPOS
