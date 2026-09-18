// Taller declarativo BDD: comparte la regla de cantidad con TDD.
window.MODULES["m-bdd"] = {
    title: "BDD: desarrollo guiado por comportamiento",
    badge: "Estación 5/18 · BDD",
    intro: "Behavior-Driven Development (BDD) es una manera de colaborar para acordar qué necesita hacer el sistema mediante ejemplos concretos. Negocio, desarrollo y pruebas descubren reglas, las expresan con un lenguaje compartido y automatizan los ejemplos útiles para comprobar que el producto conserva ese comportamiento.",
    blocks: [
        {
            type: "alert", variant: "info", title: "Qué vas a aprender y qué necesitas",
            body: "Convertirás una necesidad ambigua en criterios de aceptación, escribirás un escenario comprensible y lo ejecutarás con Behave. Lee antes Diseño de casos y la introducción de TDD. Para la parte manual basta una tabla; para ejecutar necesitas el paquete descargable, Python y Behave. Estimación didáctica: 25–40 minutos."
        },
        {
            type: "comparison", title: "BDD, Gherkin y Behave son conceptos diferentes",
            headers: ["Concepto", "Qué es", "Ejemplo"],
            rows: [
                ["BDD", "Colaboración y desarrollo alrededor de comportamientos.", "Acordar qué ocurre si se piden más equipos de los permitidos."],
                ["Gherkin", "Sintaxis para organizar ejemplos como contexto, acción y consecuencia.", "Dado un contexto, Cuando ocurre una acción, Entonces observo un resultado."],
                ["Behave / Cucumber", "Herramientas que relacionan el texto con funciones ejecutables.", "Un paso llama cantidad_valida y otro comprueba su respuesta."],
                ["Escenario automatizado", "Comprobación de un ejemplo mediante una herramienta.", "La cantidad 6 es rechazada por la función real."]
            ]
        },
        {
            type: "architecture",
            title: "Arquitectura BDD: Especificación Viva en 3 Capas",
            intro: "Diagrama visual interactivo que ilustra cómo se conectan los archivos de especificación Gherkin con los pasos de prueba ejecutables y el código del dominio de negocio.",
            nodes: [
                {
                    title: "1. Capa Gherkin (.feature)",
                    type: "cliente",
                    desc: "Especificación de negocio en lenguaje ubicuo (Dado, Cuando, Entonces). Legible y acordada por Product Owner, Desarrolladores y QA."
                },
                {
                    title: "2. Capa de Pasos (Steps Behave)",
                    type: "servidor",
                    desc: "Decoradores @given, @when, @then en Python que parsean los parámetros de entrada y los envían a las funciones de negocio."
                },
                {
                    title: "3. Capa de Dominio (Entidades & Lógica)",
                    type: "bd",
                    desc: "Reglas de negocio puras (ej. validar_prestamo, verificar_cupo en Sistema de Préstamos). Totalmente desacopladas de Behave."
                }
            ]
        },
        {
            type: "mental-map",
            title: "Mapa visual: el flujo colaborativo de BDD",
            body: "BDD alinea a quienes definen el negocio con quienes escriben el código. La conversación produce ejemplos, los ejemplos se escriben en Gherkin y la herramienta los convierte en pruebas vivas.",
            center: "Flujo BDD",
            accessibleText: "El flujo BDD conecta 1. Descubrimiento con los Tres Amigos, 2. Formulación en Gherkin, 3. Automatización con Behave o Cucumber, y 4. Documentación viva validada en CI.",
            nodes: [
                { title: "1. Descubrir", detail: "Tres amigos (PO, Dev, QA) debaten ejemplos concretos." },
                { title: "2. Formular", detail: "Escribir escenarios con Dado, Cuando y Entonces." },
                { title: "3. Automatizar", detail: "Pasos ejecutables que llaman a la función real." },
                { title: "4. Documentación viva", detail: "Especificaciones que pasan en verde en cada commit." }
            ]
        },
        {
            type: "definition",
            title: "Modelo mental: la estructura Gherkin descompuesta",
            intro: "Gherkin no es un lenguaje de programación: es una plantilla estructurada para que humanos y máquinas entiendan la misma regla.",
            pieces: [
                {
                    letter: "D", term: "Dado que · Given", translation: "Contexto inicial",
                    meaning: "Describe el estado del mundo y las precondiciones antes de que ocurra la acción.",
                    analogy: "Como poner los ingredientes sobre la mesa antes de empezar a cocinar.",
                    example: "Dado que el estudiante no tiene sanciones y solicita 3 equipos."
                },
                {
                    letter: "C", term: "Cuando · When", translation: "Acción desencadenante",
                    meaning: "La acción concreta que realiza la persona o el evento que dispara el comportamiento.",
                    analogy: "Como presionar el botón de encendido del microondas.",
                    example: "Cuando valida la cantidad solicitada."
                },
                {
                    letter: "E", term: "Entonces · Then", translation: "Consecuencia observable",
                    meaning: "El resultado que se espera verificar. Debe ser observable por el usuario o el negocio.",
                    analogy: "Como comprobar que la comida salió caliente y el temporizador volvió a cero.",
                    example: "Entonces la cantidad es aceptada y quedan 7 equipos disponibles."
                },
                {
                    letter: "T", term: "Tres Amigos", translation: "Colaboración previa",
                    meaning: "Reunión rápida entre Negocio (¿qué?), Desarrollo (¿cómo?) y QA (¿qué puede fallar?).",
                    analogy: "Como el cliente, el arquitecto y el maestro de obra revisando el plano antes de poner ladrillos.",
                    example: "Preguntarse: ¿qué ocurre si el usuario solicita 0 o 6 equipos?"
                }
            ]
        },
        {
            type: "image",
            title: "Infografía Conceptual: La Colaboración de los Tres Amigos en BDD",
            src: "img/bdd-three-amigos.jpg",
            alt: "Infografía de los Tres Amigos en BDD: Producto, Desarrollo y QA colaborando alrededor de una pizarra con Gherkin",
            caption: "El corazón de BDD es la alineación previa: Producto aporta el valor de negocio, Desarrollo la viabilidad técnica y QA la visión crítica de límites y casos esquina. Juntos construyen ejemplos claros que se convierten en pruebas automatizadas."
        },
        {
            type: "steps", title: "Las tres prácticas de BDD",
            steps: [
                { title: "Descubrimiento: conversar sobre ejemplos", tag: "Antes del código", desc: "Reúne las perspectivas de negocio, desarrollo y pruebas: los tres amigos. Pueden ser tres personas o varios participantes. Identifiquen reglas, ejemplos y preguntas abiertas; no hace falta empezar por un archivo .feature." },
                { title: "Formulación: acordar lo observable", tag: "Lenguaje compartido", desc: "Escriban los ejemplos con términos del dominio. Quien conoce el proceso confirma si representan la necesidad. Gherkin ayuda a expresarlos sin ambigüedad." },
                { title: "Automatización: conectar y comprobar", tag: "Retroalimentación", desc: "Conecta los escenarios importantes con el sistema y ejecútalos durante el desarrollo. La documentación es viva si se mantiene y verifica frente al producto cuando cambian las reglas." }
            ]
        },
        {
            type: "comparison", title: "Descubrimiento resuelto: préstamo de equipos",
            headers: ["Elemento", "Resultado de la conversación"],
            rows: [
                ["Necesidad", "Como encargado quiero controlar cantidades para repartir equipos."],
                ["Regla R-CANT", "Cantidades enteras de 1 a 5, ambos incluidos; otros tipos se rechazan."],
                ["Ejemplos", "1 y 5 se aceptan; 0 y 6 se rechazan."],
                ["Pregunta abierta", "¿Se limita cada solicitud o el total de préstamos activos? Para este taller se limita cada solicitud."],
                ["Criterio de aceptación", "Al validar 6, se rechaza. En la aplicación completa tampoco se crea el préstamo ni se reduce la disponibilidad."],
                ["Alcance ejecutable", "Automatizamos cantidad. Permisos, existencias y persistencia requieren contratos adicionales."]
            ]
        },
        {
            type: "comparison", title: "Dado–Cuando–Entonces, sin ambigüedad",
            headers: ["Parte", "Qué expresa", "Ejemplo"],
            rows: [
                ["Dado / Given", "Precondición y datos conocidos.", "Una solicitud de 6 equipos."],
                ["Cuando / When", "Acción que dispara el comportamiento.", "Se valida la cantidad solicitada."],
                ["Entonces / Then", "Consecuencia verificable.", "La cantidad es rechazada."],
                ["Y / And; Pero / But", "Continúan la parte anterior.", "Y quedan 10 equipos disponibles, en una prueba del préstamo completo."],
                ["Escenario / Scenario", "Un ejemplo concreto.", "Rechazar una cantidad superior al máximo."],
                ["Esquema del escenario / Scenario Outline + Ejemplos / Examples", "Repite el escenario sustituyendo parámetros por cada fila.", "Validar 0, 1, 3, 5, 6 y -1."],
                ["Antecedentes / Background", "Preparación común; mantenla breve.", "El catálogo contiene equipos; la acción que quieres probar va en Cuando."],
                ["Etiquetas / Tags", "Seleccionan grupos mediante @etiqueta.", "@cantidad identifica esta regla."]
            ]
        },
        {
            type: "alert", variant: "warning", title: "Contraejemplo: un escenario que no permite decidir",
            body: "«Dado un usuario válido, Cuando hace clic, Entonces todo funciona» no precisa estado, acción ni resultado. Mejora: «Dado que quedan 2 equipos y tengo permiso, Cuando solicito 3, Entonces se rechaza el préstamo y quedan 2 equipos». Evita selectores CSS y funciones internas al acordar reglas de negocio."
        },
        {
            type: "case-study",
            title: "Caso Práctico Paso a Paso: Especificación Viva con Gherkin y Behave",
            context: "En la mesa de los 'Tres Amigos' (Negocio, Dev, QA) se acuerda formalizar la regla de negocio de solicitudes de préstamo como especificación ejecutable viva.",
            preconditions: [
                "Herramienta: Behave (BDD runner para Python).",
                "Archivo de especificación: laboratorios/prestamos/features/cantidades.feature.",
                "Steps de conexión: laboratorios/prestamos/features/steps/cantidades_steps.py."
            ],
            code: `# features/cantidades.feature
# language: es
@cantidad
Característica: Validar cantidades de equipos en préstamos
  Como encargado del inventario
  Quiero que el sistema rechace solicitudes mayores a 5
  Para que todos los aprendices tengan acceso equitativo

  Esquema del escenario: Comprobar límites de solicitud
    Dado una solicitud de <cantidad> equipos
    Cuando valido la cantidad solicitada
    Entonces la cantidad es <resultado>

    Ejemplos:
      | cantidad | resultado |
      | 1        | aceptada  |
      | 5        | aceptada  |
      | 6        | rechazada |
      | 0        | rechazada |`,
            command: "behave features/cantidades.feature --tags=@cantidad",
            oracle: "Para cada fila del 'Scenario Outline', el paso @then debe comprobar que el resultado devuelto por la función de dominio coincide con la etiqueta esperada.",
            expectedVsObserved: [
                ["Fila 1: cantidad=1", "aceptada (True)", "Pasa en verde"],
                ["Fila 2: cantidad=5", "aceptada (True)", "Pasa en verde"],
                ["Fila 3: cantidad=6", "rechazada (False)", "Fallo si se acepta: Rompe criterio de negocio"],
                ["Fila 4: cantidad=0", "rechazada (False)", "Fallo si se acepta: Petición sin sentido"]
            ],
            decision: "La especificación viva sirve como documentación compartida que no queda obsoleta. Si un commit futuro rompe la regla de cantidad máxima, el pipeline BDD fallará con un mensaje en lenguaje humano comprensible para el cliente."
        },
        {
            id: "bdd-feature", type: "code", lang: "gherkin", file: "laboratorios/prestamos/features/cantidades.feature",
            title: "Escenario ejecutable incluido en el paquete",
            code: "# language: es\n@cantidad\nCaracterística: Validar cantidades de equipos\n  Para limitar cada solicitud\n  Como encargado de préstamos\n  Quiero aceptar solo cantidades enteras entre 1 y 5\n\n  Esquema del escenario: Comprobar límites de cantidad\n    Dado una solicitud de <cantidad> equipos\n    Cuando valido la cantidad solicitada\n    Entonces la cantidad es <resultado>\n\n    Ejemplos:\n      | cantidad | resultado |\n      | 0        | rechazada |\n      | 1        | aceptada  |\n      | 3        | aceptada  |\n      | 5        | aceptada  |\n      | 6        | rechazada |\n      | -1       | rechazada |\n"
        },
        {
            id: "bdd-steps", type: "code", lang: "python", file: "laboratorios/prestamos/features/steps/cantidades_steps.py",
            title: "Los pasos llaman la función real y comparan el resultado",
            code: "from behave import given, when, then\n\nfrom cantidades import cantidad_valida\n\n\n@given(\"una solicitud de {cantidad:d} equipos\")\ndef preparar_solicitud(context, cantidad):\n    context.cantidad = cantidad\n\n\n@when(\"valido la cantidad solicitada\")\ndef validar_solicitud(context):\n    context.resultado = cantidad_valida(context.cantidad)\n\n\n@then(\"la cantidad es {resultado}\")\ndef comprobar_resultado(context, resultado):\n    assert resultado in (\"aceptada\", \"rechazada\")\n    assert context.resultado is (resultado == \"aceptada\")\n"
        },
        {
            type: "steps", title: "Ejecuta el ejemplo y aprende a diagnosticarlo",
            steps: [
                { title: "Entra a la carpeta correcta", desc: "Desde guia-testing-qa del ZIP. Si vienes de practica-tdd, vuelve primero con Set-Location .. . La carpeta incluye cantidades.py, test_cantidades.py y features/steps.", command: "Set-Location laboratorios/prestamos\npython -m behave --version", pitfall: "Si falta Behave, vuelve a Descargar Proyecto e instala las dependencias en el intérprete activo." },
                { title: "Comprueba el vínculo entre texto y funciones", command: "python -m behave --dry-run", desc: "El modo en seco identifica escenarios y pasos. No ejecuta aserciones ni demuestra que la regla sea correcta.", tip: "Undefined indica un paso sin definición. Compara su texto y parámetros con el decorador Python." },
                { title: "Ejecuta realmente la regla", command: "python -m behave --tags=@cantidad --format progress\npython -m pytest test_cantidades.py -q", desc: "Esperas 6 escenarios y 18 pasos aprobados, seguidos de 13 pruebas pytest aprobadas, todos con código 0. Los tipos incorrectos se comprueban en pytest; Gherkin cubre los enteros seleccionados." },
                { title: "Provoca una diferencia en una copia", desc: "Copia el laboratorio a tu carpeta de práctica. Cambia solo el máximo de 5 a 4, sin modificar los ejemplos. El escenario con 5 debe fallar. Restablece 5 y repite.", pitfall: "No borres la aserción ni cambies expectativas para obtener verde. Confirma primero el contrato." }
            ]
        },
        {
            type: "comparison", title: "Qué significa cada resultado de Behave",
            headers: ["Resultado", "Interpretación", "Siguiente acción"],
            rows: [
                ["Passed", "Los pasos se ejecutaron y sus aserciones pasaron.", "Explica qué regla y datos se comprobaron."],
                ["Failed", "Una aserción o un paso produjo un error.", "Compara esperado y observado; clasifica producto, prueba o preparación."],
                ["Undefined / Ambiguous", "Falta un paso o compiten varias definiciones.", "Corrige el vínculo texto–decoradores antes de diagnosticar el producto."],
                ["Skipped / Untested", "Una parte no se ejecutó.", "Revisa etiquetas, fallo previo y modo en seco."]
            ]
        },
        {
            type: "comparison", title: "TDD, BDD, ATDD y E2E: cómo se relacionan",
            headers: ["Concepto", "Foco", "Relación"],
            rows: [
                ["TDD", "Guiar cambios pequeños con pruebas, implementación y refactorización.", "Puede guiar la implementación de un comportamiento acordado en BDD."],
                ["BDD", "Descubrir y compartir comportamiento mediante ejemplos.", "Puede automatizarse en dominio, API o interfaz; no exige navegador."],
                ["ATDD", "Acordar pruebas de aceptación antes de implementar.", "Se solapa con BDD, que destaca también conversación y lenguaje compartido."],
                ["E2E", "Alcance de una prueba que recorre un flujo completo.", "BDD puede ejecutarse como E2E; el taller de cantidad comprueba solo dominio."],
                ["Pruebas posteriores", "Comprobar una implementación que ya existe.", "Aportan regresión, pero no demuestran que el desarrollo siguió TDD o BDD."]
            ]
        },
        {
            type: "comparison",
            title: "El Doble Bucle: cómo colaboran BDD y TDD en la práctica",
            headers: ["Fase del bucle", "Nivel", "Qué ocurre en el código"],
            rows: [
                ["1. Escenario BDD (Rojo exterior)", "Aceptación / Negocio", "Escribes el escenario en .feature y ejecutas Behave: falla porque el sistema aún no tiene esa capacidad."],
                ["2. TDD Unitario (Bucle interior)", "Unidades / Dominio", "Para resolver el paso, aplicas Rojo → Verde → Refactor en la clase, función o validador específico."],
                ["3. Integración de capas", "Componentes", "Conectas los decoradores (@given, @when, @then) con la función o servicio ya testeado."],
                ["4. Escenario BDD (Verde exterior)", "Aceptación completa", "Ejecutas Behave de nuevo: todos los pasos pasan a verde. La regla de negocio está cumplida y documentada."]
            ]
        },
        {
            type: "image",
            title: "Infografía Conceptual: El Doble Bucle de Calidad (Outside-In TDD + BDD)",
            src: "img/double-loop-testing.jpg",
            alt: "Diagrama del Doble Bucle: El bucle exterior BDD guía las necesidades de negocio mientras que el bucle interior TDD construye los componentes unitarios con precisión técnica",
            caption: "Sincronía perfecta: El bucle exterior (BDD) define la meta global mediante un escenario de aceptación que empieza en Rojo. El desarrollador entra al bucle interior (TDD) para construir iterativamente los componentes necesarios. Cuando los módulos unitarios están verdes, el escenario exterior pasa a Verde."
        },
        {
            type: "tools",
            title: "Herramientas del ecosistema para aplicar BDD",
            stack: [
                {
                    icon: "🥒", name: "Behave", tag: "Python",
                    role: "Framework BDD en Python que ejecuta archivos .feature con pasos decorados en Python.",
                    when: "Pruebas de aceptación y reglas de negocio en proyectos Python."
                },
                {
                    icon: "🌐", name: "Cucumber.js", tag: "JavaScript / TypeScript",
                    role: "Implementación oficial de Cucumber para Node.js y navegadores.",
                    when: "Equipos JS/TS que comparten especificaciones ejecutables con PO y analistas."
                },
                {
                    icon: "☕", name: "Cucumber-JVM", tag: "Java",
                    role: "Motor BDD integrado con JUnit y Spring Boot.",
                    when: "Aplicaciones empresariales Java que validan flujos de negocio completos."
                },
                {
                    icon: "🔷", name: "Reqnroll / SpecFlow", tag: "C# .NET",
                    role: "Framework BDD para el ecosistema .NET conectado a xUnit o NUnit.",
                    when: "Servicios y aplicaciones web sobre Microsoft .NET."
                }
            ]
        },
        {
            type: "steps",
            title: "Paso a paso del aprendiz: cómo aplicar BDD en cualquier aplicación",
            intro: "Sigue estos 4 pasos para transformar cualquier requerimiento en una prueba de aceptación automatizada:",
            steps: [
                { number: 1, title: "Reúne las tres perspectivas (Tres Amigos)", tag: "Paso 1: Conversar", desc: "Antes de programar, define la necesidad y pregunta: ¿qué datos son válidos?, ¿qué pasa en el límite?, ¿qué mensaje debe mostrarse si falla? Registra las respuestas en ejemplos concretos.", tip: "Si trabajas solo, ponte el sombrero de negocio, luego el de tester que busca fallos y finalmente el de desarrollador." },
                { number: 2, title: "Redacta el archivo .feature en Gherkin", tag: "Paso 2: Formular", desc: "Crea la carpeta features/ y escribe la especificación usando Dado (contexto), Cuando (acción) y Entonces (consecuencia). Usa un Esquema del escenario con Ejemplos si hay varios valores para la misma regla.", tip: "Agrega `# language: es` en la primera línea para usar palabras clave en español." },
                { number: 3, title: "Implementa los step definitions (código pegamento)", tag: "Paso 3: Conectar", desc: "Crea features/steps/regla_steps.py. Usa decoradores @given, @when y @then que reciban context y llamen a tus funciones o APIs reales sin lógica duplicada.", tip: "El paso solo delega y aserta; la regla de negocio debe vivir en el código de tu aplicación." },
                { number: 4, title: "Ejecuta y verifica la documentación viva", tag: "Paso 4: Comprobar", desc: "Ejecuta `behave` o `npm run test:bdd`. Observa que todos los pasos se iluminen en verde. Integra el comando en tu pipeline CI para que nadie pueda romper la regla en el futuro.", tip: "Usa `behave --dry-run` para verificar la correspondencia de textos antes de ejecutar." }
            ]
        },
        {
            type: "steps", title: "Práctica independiente y transferencia",
            steps: [
                { title: "Diseña sin copiar el ejemplo", desc: "Escribe escenarios para falta de permiso, disponibilidad insuficiente y dos solicitudes simultáneas sobre el último equipo. Precisa el resultado y el estado que debe conservarse.", tip: "Si dos solicitudes compiten por un equipo, solo una debe reservarlo y la disponibilidad nunca debe ser negativa. Esto necesita integración y control de concurrencia; cantidad_valida no lo prueba." },
                { title: "Revisa con otra perspectiva", desc: "Negocio confirma reglas, desarrollo identifica dependencias y pruebas busca límites. Si trabajas solo, registra preguntas pendientes en lugar de asumir respuestas." },
                { title: "Conserva la evidencia", desc: "Relaciona requisito → escenario → prueba → resultado en ART-TEST-01; agrega archivos y salida real a ART-TEST-02. Si usas navegador, enlaza ejecuciones y defectos en ART-TEST-03. Sustituye equipos y límites por los de tu proyecto." }
            ]
        },
        {
            type: "alert", variant: "success", title: "Explica antes de avanzar",
            body: "¿Por qué un archivo .feature con pasos vacíos no prueba el negocio? ¿Por qué este taller no es E2E? El texto necesita comprobaciones conectadas al sistema; aquí se llama una función sin interfaz, API ni base de datos. Usa BDD cuando conversar sobre reglas aporte valor; evita acumular escenarios que nadie revisa."
        }
    ]
};
