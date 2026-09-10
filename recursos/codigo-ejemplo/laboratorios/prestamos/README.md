# Laboratorio de TDD y BDD: cantidades de equipos

Ejemplo ficticio. Regla R-CANT: aceptar valores de tipo entero entre 1 y 5,
incluidos; rechazar otros valores y tipos, incluidos booleanos. La función
no crea préstamos, no comprueba permisos ni reserva existencias.

El paquete contiene la solución final. La web muestra las etapas rojas de TDD.
Trabaja en una carpeta propia para conservar esta referencia. Este laboratorio
se ejecuta por separado del ejecutor de las otras tecnologías.

## Preparación

Abre PowerShell en la raíz descomprimida guia-testing-qa. Usa el intérprete
de tu entorno de práctica con pytest y Behave instalados:

~~~powershell
python --version
python -m pytest --version
python -m behave --version
Set-Location laboratorios/prestamos
~~~

Si falta una dependencia, desde el entorno activo:

~~~powershell
python -m pip install pytest behave
~~~

Instalar requiere internet o paquetes locales. Ejecutar este laboratorio no
necesita red, servidor, base de datos, credenciales, Java ni Node.js.

## Ejecutar

~~~powershell
python -m pytest test_cantidades.py -q
python -m behave --dry-run
python -m behave --tags=@cantidad --format progress
~~~

Esperas 13 pruebas pytest aprobadas; el modo en seco identifica pasos pero
no verifica comportamiento; la ejecución real de Behave informa 6 escenarios
y 18 pasos aprobados. Las ejecuciones reales terminan con código 0.

## Reproducir el ciclo TDD

En otra carpeta, crea test_cantidades.py con una prueba que importe la función
y compruebe cantidad_valida(1) is True. Crea cantidades.py con la función
devolviendo False: debe fallar por esa aserción. Devuelve True: pasa.
Agrega el caso cantidad_valida(6) is False: vuelve a fallar. Generaliza con
el rango y amplía tipos y fronteras antes de consultar la solución completa.
Refactoriza manteniendo las 13 pruebas aprobadas.

En una copia, cambia MAX_EQUIPOS = 5 por MAX_EQUIPOS = 4. La prueba y el
escenario que esperan aceptar 5 deben fallar. Restablece el límite y repite.
Esa comprobación demuestra sensibilidad a este defecto.

## Diagnóstico y evidencia

- ModuleNotFoundError: verifica intérprete, dependencias y carpeta.
- Undefined: compara pasos Gherkin y decoradores antes de diagnosticar el producto.
- Ninguna prueba o escenarios omitidos: revisa rutas y etiquetas.
- Aserción fallida: registra entrada, esperado, observado y regla antes de corregir.

Guarda regla, casos, comando, versiones, salida roja, cambio y salida verde en
ART-TEST-02; enlaza escenarios con ART-TEST-01. Para el préstamo completo diseña
también permisos, persistencia y concurrencia. Este laboratorio no los verifica.
