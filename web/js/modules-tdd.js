// Taller declarativo TDD: contenido cargado antes del renderizador.
window.MODULES["m-tdd"] = {
    title: "TDD: desarrollo guiado por pruebas",
    badge: "Estación 4/18 · TDD",
    intro: "Test-Driven Development (TDD) es una forma de desarrollar en ciclos pequeños: primero expresas un comportamiento esperado en una prueba, observas que falla, implementas lo necesario y mejoras el diseño. La prueba ayuda a decidir la interfaz y el siguiente cambio.",
    blocks: [
        {
            type: "alert", variant: "info", title: "Qué vas a aprender y qué necesitas",
            body: "Demostrarás un ciclo rojo → verde → refactorizar y detectarás una prueba que da falsa confianza. Lee antes Fundamentos y Diseño de casos. Para ejecutar necesitas Python, pytest, un editor y la terminal; en Descargar Proyecto está la preparación. Estimación didáctica: 35–50 minutos. El simulador de arriba enseña el orden; los comandos de este taller ejecutan Python realmente."
        },
        {
            type: "comparison", title: "Entiende cada palabra y su propósito",
            headers: ["Palabra", "Significado", "Decisión que orienta"],
            rows: [
                ["Test · prueba", "Ejemplo con entrada y resultado esperado.", "¿Qué debe hacer la función? Una aserción hace comprobable la respuesta."],
                ["Driven · guiado", "El siguiente cambio nace de una prueba que todavía no pasa.", "¿Qué falta implementar? El fallo delimita el trabajo."],
                ["Development · desarrollo", "Diseñar, implementar y refactorizar.", "¿Cómo mantengo el código comprensible mientras agrego comportamiento?"]
            ]
        },
        {
            type: "comparison", title: "Tres fases, una regla para avanzar",
            headers: ["Fase", "Acción", "Condición para avanzar"],
            rows: [
                ["Rojo", "Escribe una expectativa pequeña y ejecútala.", "Falla porque falta ese comportamiento. Explica la aserción que falló."],
                ["Verde", "Implementa lo más sencillo que satisface las pruebas actuales.", "Pasan la prueba nueva y las anteriores. No ocultes fallos ni acomodes el resultado esperado al código."],
                ["Refactorizar", "Mejora nombres, separación o duplicación conservando comportamiento.", "La suite sigue pasando. Si ya es claro, no fuerces un cambio."]
            ]
        },
        {
            type: "pipeline",
            title: "Ciclo Visual TDD: Red → Green → Refactor",
            intro: "Visualización gráfica de la cadencia de desarrollo guiado por pruebas. Cada iteración comienza con una prueba que falla por la razón correcta antes de escribir código de producción.",
            steps: [
                {
                    number: "1",
                    title: "🔴 1. Red (Rojo)",
                    desc: "Escribe una prueba pequeña y enfocada para una nueva capacidad. Ejecútala y confirma que falla con una aserción clara (no por error de sintaxis)."
                },
                {
                    number: "2",
                    title: "🟢 2. Green (Verde)",
                    desc: "Escribe la cantidad mínima de código de producción para que la prueba pase. No agregues lógica especulativa ni optimizaciones prematuras."
                },
                {
                    number: "3",
                    title: "🔵 3. Refactor (Refactorizar)",
                    desc: "Limpia el código, elimina duplicación y mejora la legibilidad manteniendo la suite verde. La prueba es tu red de seguridad."
                },
                {
                    number: "4",
                    title: "🔁 4. Siguiente Caso",
                    desc: "Avanza al siguiente valor límite o regla de negocio (ej. límites R-CANT: 1, 5, 0, 6) repitiendo el ciclo rigurosamente."
                }
            ]
        },
        {
            type: "mental-map",
            title: "Mapa visual: el ciclo Rojo → Verde → Refactorizar",
            body: "TDD es un ritmo de diseño en pasos cortos. La prueba no evalúa código terminado: define el siguiente comportamiento observable y orienta la implementación mínima.",
            center: "Ciclo TDD",
            accessibleText: "El ciclo TDD se compone de Rojo (escribir prueba que falla), Verde (código mínimo para pasar), Refactorizar (limpiar sin romper) y Repetir con el siguiente caso frontera.",
            nodes: [
                { title: "1. Rojo (Red)", detail: "Prueba pequeña que falla por la razón esperada." },
                { title: "2. Verde (Green)", detail: "Código mínimo que hace pasar la aserción." },
                { title: "3. Refactor", detail: "Limpiar y simplificar manteniendo verde la suite." },
                { title: "4. Siguiente caso", detail: "Frontera, caso inválido o nuevo requisito." }
            ]
        },
        {
            type: "definition",
            title: "Modelo mental: qué significa cada fase en la práctica",
            intro: "Comprende el propósito profundo de cada fase antes de tocar la terminal.",
            pieces: [
                {
                    letter: "🔴", term: "Fase Roja", translation: "Test que falla primero",
                    meaning: "Escribes una expectativa pequeña antes de que exista el código. La prueba debe fallar demostrando que el comportamiento aún no está.",
                    analogy: "Como un carpintero que marca con lápiz y regla la madera antes de cortar: la marca indica exactamente dónde debe terminar el corte.",
                    example: "assert cantidad_valida(1) is True falla con NameError o AssertionError."
                },
                {
                    letter: "🟢", term: "Fase Verde", translation: "Solución mínima",
                    meaning: "Escribes solo el código necesario para satisfacer la prueba. No construyes arquitecturas complejas ni agregas casos no pedidos.",
                    analogy: "Como hacer el primer corte justo sobre la línea trazada para que la pieza encaje en el marco.",
                    example: "def cantidad_valida(cantidad): return True hace pasar la prueba inmediatamente."
                },
                {
                    letter: "🔵", term: "Refactorizar", translation: "Limpieza con red de seguridad",
                    meaning: "Mejoras nombres de variables, eliminas duplicación y extraes constantes sin cambiar lo que el programa hace hacia afuera.",
                    analogy: "Como lijar y pulir la madera: la pieza conserva exactamente sus medidas pero queda limpia y duradera.",
                    example: "Extraer MIN_EQUIPOS = 1 y MAX_EQUIPOS = 5 manteniendo las 13 pruebas en verde."
                }
            ]
        },
        {
            type: "image",
            title: "Infografía Conceptual: El Ritmo del Ciclo TDD (Rojo → Verde → Refactorizar)",
            src: "img/tdd-cycle.jpg",
            alt: "Infografía del ciclo TDD: Rojo prueba que falla, Verde código mínimo, Refactorizar optimización de diseño",
            caption: "El latido de TDD: La prueba se diseña primero para evidenciar la ausencia de una función. El código verde aporta la solución más directa. La fase de refactorización limpia y pule el código con la tranquilidad de que las pruebas automatizadas vigilan cada cambio."
        },
        {
            type: "alert", variant: "warning", title: "TDD no significa escribir pruebas después",
            body: "Escribir toda la solución y agregar asserts al final es una estrategia de pruebas posterior. Tampoco basta escribir una prueba y no verla fallar: podría no ejecutarse o comprobar algo irrelevante. Un error de dependencia o sintaxis se corrige antes de interpretar el rojo como evidencia del comportamiento."
        },
        {
            type: "case-study",
            title: "Caso Práctico Paso a Paso: El Ciclo Red-Green-Refactor de Validación de Préstamos",
            context: "Diseñar bajo TDD estricto la función 'cantidad_valida(c)' para garantizar que solo admita enteros de 1 a 5, rechazando booleanos y cadenas sin fallos en tiempo de ejecución.",
            preconditions: [
                "Entorno: Python 3.10+ con pytest instalado.",
                "Directorio de trabajo: 'practica-tdd/' con cantidades.py y test_cantidades.py.",
                "Regla de oro: No escribir ni una sola línea de código en cantidades.py sin antes ver una prueba fallar por la causa correcta."
            ],
            code: `import pytest
from cantidades import cantidad_valida

def test_rojo_acepta_un_equipo():
    assert cantidad_valida(1) is True

def test_rojo_rechaza_seis_equipos():
    assert cantidad_valida(6) is False

@pytest.mark.parametrize("valor_invalido", [0, 6, "3", True, None])
def test_casos_borde_y_tipos(valor_invalido):
    assert cantidad_valida(valor_invalido) is False`,
            command: "python -m pytest test_cantidades.py -v",
            oracle: "Fase 1 (Rojo): test_acepta_un_equipo falla con AssertionError. Fase 2 (Verde): retorna solución mínima y pasa. Fase 3 (Refactor): extrae constantes MIN=1, MAX=5 y todas las pruebas siguen en verde.",
            expectedVsObserved: [
                ["Paso 1: Test test_acepta_un_equipo()", "FALLA (Rojo esperado)", "Si pasa de inmediato, el test no está comprobando nada nuevo"],
                ["Paso 2: return True en cantidades.py", "PASA (Verde mínimo)", "Si falla, la solución no es la más directa"],
                ["Paso 3: Test test_rechaza_seis()", "FALLA (Segundo Rojo)", "Demuestra que la constante True es insuficiente"],
                ["Paso 4: return type(c) is int and 1 <= c <= 5", "PASAN TODOS (Verde robusto)", "Suite verde con 13 comprobaciones"],
                ["Paso 5: Refactorizar a constantes", "PASAN TODOS (Red de seguridad)", "El diseño mejora sin alterar el contrato público"]
            ],
            decision: "La suite TDD es la red de seguridad viva. Cualquier cambio futuro en la regla de préstamos alertará inmediatamente al desarrollador si rompe el contrato establecido."
        },
        {
            type: "alert", variant: "info", title: "Caso conductor: cantidad de un préstamo",
            body: "Regla ficticia R-CANT: aceptar una cantidad entera entre 1 y 5, ambos incluidos; rechazar otros valores y tipos, incluidos booleanos. Esta función responde True o False: no crea préstamos, no comprueba permisos ni reserva existencias. Primero trabajaremos con enteros y después con tipos incorrectos."
        },
        {
            type: "steps", title: "Prepara un ejercicio propio",
            steps: [
                { title: "Ubícate en el paquete descargado", desc: "Descomprime el ZIP y abre PowerShell en guia-testing-qa. Comprueba que el intérprete python tiene pytest. La solución de consulta está en laboratorios/prestamos.", command: "python --version\npython -m pytest --version", pitfall: "Si falta pytest, sigue Descargar Proyecto → Diagnóstico. ModuleNotFoundError no demuestra un defecto de la regla." },
                { title: "Crea tu carpeta de trabajo", desc: "Ejecuta una vez. Crea con tu editor cantidades.py y test_cantidades.py dentro de esta carpeta. Copia los dos bloques siguientes en sus respectivos archivos.", command: "New-Item -ItemType Directory -Path practica-tdd\nSet-Location practica-tdd", tip: "Si la carpeta ya existe, entra y revisa sus archivos antes de continuar. No necesitas servidor." }
            ]
        },
        {
            id: "tdd-test-first", type: "code", lang: "python", file: "practica-tdd/test_cantidades.py",
            title: "1. Primero la prueba: un equipo es una cantidad válida",
            code: "from cantidades import cantidad_valida\n\n\ndef test_acepta_un_equipo():\n    resultado = cantidad_valida(1)\n    assert resultado is True\n"
        },
        {
            id: "tdd-red", type: "code", lang: "python", file: "practica-tdd/cantidades.py",
            title: "2. Punto de partida: existe la función, falta el comportamiento",
            code: "def cantidad_valida(cantidad):\n    return False\n"
        },
        {
            type: "steps", title: "Observa el rojo antes de cambiar la función",
            steps: [
                { title: "Ejecuta exactamente la prueba", command: "python -m pytest test_cantidades.py -q", desc: "Esperas 1 failed y código de salida 1: la función devuelve False donde la regla exige True. Esta aserción fallida demuestra la ausencia del comportamiento.", tip: "Si obtienes 1 passed, comprueba que guardaste la versión inicial. Si no se recoge ninguna prueba, revisa carpeta y nombres: archivo test_cantidades.py y función con prefijo test_." }
            ]
        },
        {
            id: "tdd-green", type: "code", lang: "python", file: "practica-tdd/cantidades.py",
            title: "3. Primer verde: reemplaza el contenido de cantidades.py",
            code: "def cantidad_valida(cantidad):\n    return True\n"
        },
        {
            type: "alert", variant: "warning", title: "Una prueba verde todavía permite una solución incorrecta",
            body: "Repite el comando: esperas 1 passed. Devolver siempre True satisface ese único ejemplo; también aceptaría 0 o 6. La solución constante es temporal, no el resultado final. Agrega un contraejemplo antes de generalizar para demostrar por qué debes cambiar la implementación."
        },
        {
            id: "tdd-test-boundary", type: "code", lang: "python", file: "practica-tdd/test_cantidades.py",
            title: "4. Agrega esta prueba sin borrar la primera",
            code: "def test_rechaza_seis_equipos():\n    assert cantidad_valida(6) is False\n"
        },
        {
            type: "alert", variant: "info", title: "Segundo rojo y generalización",
            body: "Repite python -m pytest test_cantidades.py -q: esperas 1 failed y 1 passed. Cambia la función a return 1 <= cantidad <= 5: los dos ejemplos pasan. Antes de terminar, agrega 0, 3, 5, -1 y tipos incorrectos. Dos casos no demuestran todo el contrato."
        },
        {
            id: "tdd-test-final", type: "code", lang: "python", file: "practica-tdd/test_cantidades.py",
            title: "5. Suite de referencia: sustituye las pruebas después de hacer tus predicciones",
            code: "import pytest\n\nfrom cantidades import cantidad_valida\n\n\n@pytest.mark.parametrize(\"cantidad,esperado\", [\n    (0, False), (1, True), (3, True), (5, True), (6, False), (-1, False),\n])\ndef test_limites(cantidad, esperado):\n    assert cantidad_valida(cantidad) is esperado\n\n\n@pytest.mark.parametrize(\"cantidad\", [None, \"3\", 1.5, True, False, [], {}])\ndef test_rechaza_tipos_no_enteros(cantidad):\n    assert cantidad_valida(cantidad) is False\n"
        },
        {
            type: "alert", variant: "info", title: "Predice antes de mirar la solución",
            body: "Con solo 1 <= cantidad <= 5, la suite falla: 1.5 y True se aceptan y algunos tipos generan TypeError. En Python bool hereda de int; isinstance(True, int) es True. Aquí la regla exige tipo int exactamente. Es una decisión de este dominio, no una regla universal."
        },
        {
            id: "tdd-final", type: "code", lang: "python", file: "practica-tdd/cantidades.py",
            title: "6. Solución completa del contrato de cantidad",
            code: "def cantidad_valida(cantidad):\n    return type(cantidad) is int and 1 <= cantidad <= 5\n"
        },
        {
            id: "tdd-refactor", type: "code", lang: "python", file: "practica-tdd/cantidades.py",
            title: "7. Refactorización opcional: nombra los límites, conserva el comportamiento",
            code: "MIN_EQUIPOS = 1\nMAX_EQUIPOS = 5\n\n\ndef cantidad_valida(cantidad):\n    return type(cantidad) is int and MIN_EQUIPOS <= cantidad <= MAX_EQUIPOS\n"
        },
        {
            type: "steps", title: "Comprueba, conserva evidencia y transfiere",
            steps: [
                { title: "Ejecuta después de cada cambio", command: "python -m pytest test_cantidades.py -q", desc: "Esperas 13 passed, código 0, antes y después de refactorizar. pytest.mark.parametrize repite la comprobación con distintas entradas.", pitfall: "Una prueba omitida (skipped) o no recogida no es una prueba aprobada." },
                { title: "Práctica independiente", desc: "Cambia la regla a un máximo de 4. Primero agrega una prueba que rechace 5; observa el rojo y ajusta luego la implementación. Revisa los casos que dependían de la regla anterior y documenta el cambio antes de actualizar expectativas.", tip: "Cambiar un requisito es comportamiento nuevo; no lo llames refactorización." },
                { title: "Evidencia ART-TEST-02", desc: "Conserva regla, entradas, salida roja y su causa, cambio mínimo y resultado verde. Referencia el taller en Registro de evidencias → ART-TEST-02. Si usas IA, aplica V.E.R.A.: verifica la propuesta, ejecútala y explica qué aceptaste." }
            ]
        },
        {
            type: "tools",
            title: "Herramientas del ecosistema para aplicar TDD",
            stack: [
                {
                    icon: "🐍", name: "pytest", tag: "Python",
                    role: "Ejecutor de pruebas con aserciones nativas y parametrización rápida.",
                    when: "Desarrollo de backend, lógica pura, funciones de cálculo y validadores."
                },
                {
                    icon: "⚡", name: "Vitest / Jest", tag: "JavaScript / TypeScript",
                    role: "Ejecutores en tiempo real con modo watch que reejecutan la prueba en cada guardado.",
                    when: "Lógica de frontend, utilidades, componentes y APIs en Node.js."
                },
                {
                    icon: "☕", name: "JUnit 5", tag: "Java",
                    role: "Estándar de pruebas unitarias con anotaciones (@Test, @ParameterizedTest).",
                    when: "Servicios de negocio, entidades de dominio y validadores en Java / Spring."
                },
                {
                    icon: "🧬", name: "mutmut / Stryker", tag: "Mutación",
                    role: "Introduce cambios artificiales en el código para verificar si los tests fallan.",
                    when: "Auditar si tu suite TDD es realmente sensible o tiene pruebas con falsos verdes."
                }
            ]
        },
        {
            type: "steps",
            title: "Paso a paso del aprendiz: cómo aplicar TDD en cualquier proyecto",
            intro: "Aplica este procedimiento universal cada vez que vayas a construir una función o regla en tu proyecto formativo:",
            steps: [
                { number: 1, title: "Formula una aserción observable", tag: "Paso 1: Rojo", desc: "Elige la regla más simple. Escribe la prueba con una entrada concreta y el resultado esperado exacto. Ejecuta la prueba y verifica que falle por la ausencia del código, no por un error de sintaxis o importación.", tip: "Si la prueba pasa antes de programar la solución, no estás haciendo TDD o la prueba no está comprobando nada." },
                { number: 2, title: "Programa la solución más directa", tag: "Paso 2: Verde", desc: "Escribe el código mínimo que transforme la prueba en verde. Aunque devolver un valor constante parezca ingenuo, confirma que la aserción está conectada a la función real.", tip: "No agregues lógica para casos futuros que todavía no tienen una prueba escrita." },
                { number: 3, title: "Introduce una prueba de frontera o contraejemplo", tag: "Paso 3: Segundo Rojo", desc: "Escribe la siguiente prueba con un límite (por ejemplo, el valor superior o un tipo inválido). La solución simplista fallará, obligándote a implementar la regla completa de forma justificada.", tip: "Cada nueva línea de lógica en producción debe estar justificada por una aserción previa." },
                { number: 4, title: "Refactoriza bajo la protección de la suite", tag: "Paso 4: Limpieza", desc: "Una vez todas las pruebas pasen, renombra variables confusas, extrae constantes y simplifica condicionales. Vuelve a ejecutar la suite completa tras cada cambio cosmético.", tip: "Si una prueba se rompe durante el refactor, deshaz el último cambio inmediatamente." }
            ]
        },
        {
            type: "comparison", title: "Cuándo aporta TDD y qué límites conserva",
            headers: ["Situación", "Cómo aplicarlo"],
            rows: [
                ["Reglas, validaciones y cálculos", "Empieza por funciones pequeñas y resultados deterministas."],
                ["Defecto en código existente", "Reprodúcelo con una prueba de regresión antes de corregir. Si no hay pruebas, caracteriza primero el comportamiento observable."],
                ["Interfaz, base de datos o servicio externo", "Decide qué comprobar en unidad y qué requiere integración o E2E. Un doble no demuestra que el proveedor real funciona."],
                ["Prototipo con requisitos desconocidos", "Explora para aclarar el contrato; después usa ejemplos verificables."],
                ["Cobertura y calidad", "TDD puede favorecer diseño comprobable y regresión rápida; no garantiza 100 % de cobertura, ausencia de defectos ni seguridad."]
            ]
        },
        {
            type: "alert", variant: "success", title: "Explica antes de avanzar",
            body: "¿Por qué devolver True pasó la primera prueba y falló la segunda? ¿Qué diferencia hay entre cambiar el límite y renombrar una constante? Un ejemplo restringe parte del comportamiento; refactorizar conserva el contrato. Continúa en BDD para acordar ese contrato con quienes conocen la necesidad."
        }
    ]
};
