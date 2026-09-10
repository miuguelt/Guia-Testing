# Contenido de fundamentos y métodos

Se reutilizan el renderizador y el SDK de código/evidencias existentes.
Los bloques son datos declarativos; no se agrega otro motor de navegación,
evaluación ni persistencia.

- modules-tdd.js: TDD extraído de modules-content.
- modules-bdd.js: BDD extraído de modules-content-2.
- modules-foundations.js: vocabulario y técnicas antes del contenido existente.
- modules-test-strategy.js: alcance, dobles, diagnóstico y confianza.

Los cuatro se cargan después de los catálogos base y antes de CodeRenderer.
Los métodos preceden a las variantes técnicas en menú, pie secuencial y mapa.
Se conservan identificadores de módulo y evidencias.

El laboratorio recursos/codigo-ejemplo/laboratorios/prestamos valida cantidad.
Sus ejemplos visibles se contrastan con el ZIP y se ejecutan en carpetas
temporales mediante tests/test_method_workshops.py. Los fallos intencionales
viven en ejemplos de la web; la descarga conserva la solución final.
No se agregan salidas fingidas a los simuladores.

Estos archivos de contenido conservan los contratos de interacción.
La extracción reduce el tamaño de los dos catálogos heredados.

Para cumplir la compuerta de modularidad se extrajeron, sin alterar sus bloques,
los catálogos de CI/CD, observabilidad, IA, constructor, herramientas y reto
desde modules-content-2.js. La comparación de los objetos cargados por Node
antes y después de la extracción fue idéntica. Cada catálogo tiene un tema
y menos de 400 líneas. Los tests descubren todos los archivos modules-*.js.
