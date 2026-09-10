# language: es
@cantidad
Característica: Validar cantidades de equipos
  Para limitar cada solicitud
  Como encargado de préstamos
  Quiero aceptar solo cantidades enteras entre 1 y 5

  Esquema del escenario: Comprobar límites de cantidad
    Dado una solicitud de <cantidad> equipos
    Cuando valido la cantidad solicitada
    Entonces la cantidad es <resultado>

    Ejemplos:
      | cantidad | resultado |
      | 0        | rechazada |
      | 1        | aceptada  |
      | 3        | aceptada  |
      | 5        | aceptada  |
      | 6        | rechazada |
      | -1       | rechazada |
