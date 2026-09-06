# language: es
Caracteristica: Gestion de Inventario y Calculos de Stock
  Como encargado del almacen
  Quiero clasificar el nivel de stock y calcular totales
  Para garantizar inventario suficiente y facturacion precisa

  Escenario: Alerta por stock critico
    Dado un producto con stock actual de 3 unidades y stock minimo de 5
    Cuando se clasifica el nivel de stock
    Entonces el estado resultante es "CRITICO"

  Escenario: Calculo de orden con descuento e impuestos
    Dado un precio unitario de 500.0 y una cantidad de 4
    Cuando se aplica un descuento del 10 por ciento y un IVA del 19 por ciento
    Entonces el total final a facturar es 2142.0
