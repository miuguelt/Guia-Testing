"""Servicio de calculos puros de inventario y facturacion (Logica de Dominio)."""

def calcular_subtotal(precio: float, cantidad: int) -> float:
    """Calcula el subtotal base. Valida que cantidad y precio sean no negativos."""
    if cantidad < 0:
        raise ValueError("La cantidad no puede ser negativa")
    if precio < 0:
        raise ValueError("El precio no puede ser negativo")
    return round(precio * cantidad, 2)


def aplicar_descuento(monto: float, porcentaje: float) -> float:
    """Aplica un descuento porcentual (0 a 100)."""
    if monto < 0:
        raise ValueError("El monto no puede ser negativo")
    if not (0 <= porcentaje <= 100):
        raise ValueError("El porcentaje de descuento debe estar entre 0 y 100")
    descuento = monto * (porcentaje / 100.0)
    return round(monto - descuento, 2)


def calcular_iva(base_imponible: float, tasa: float = 0.19) -> float:
    """Calcula el valor del IVA sobre la base imponible."""
    if base_imponible < 0:
        raise ValueError("La base imponible no puede ser negativa")
    if tasa < 0:
        raise ValueError("La tasa de IVA no puede ser negativa")
    return round(base_imponible * tasa, 2)


def calcular_total_con_impuestos(precio: float, cantidad: int, porcentaje_descuento: float = 0.0, tasa_iva: float = 0.19) -> float:
    """Calcula el total final aplicando descuento y sumando IVA."""
    subtotal = calcular_subtotal(precio, cantidad)
    base = aplicar_descuento(subtotal, porcentaje_descuento)
    iva = calcular_iva(base, tasa_iva)
    return round(base + iva, 2)


def clasificar_nivel_stock(stock_actual: int, stock_minimo: int = 5) -> str:
    """
    Clasifica el nivel de inventario:
    - stock_actual == 0: AGOTADO
    - 0 < stock_actual <= stock_minimo: CRITICO
    - stock_actual > stock_minimo * 5: SOBRESTOCK
    - en otro caso: OPTIMO
    """
    if stock_actual < 0 or stock_minimo < 0:
        raise ValueError("Los valores de stock no pueden ser negativos")
    if stock_actual == 0:
        return "AGOTADO"
    if stock_actual <= stock_minimo:
        return "CRITICO"
    if stock_actual > stock_minimo * 5:
        return "SOBRESTOCK"
    return "OPTIMO"
