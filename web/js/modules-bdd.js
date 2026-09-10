// Taller declarativo BDD: comparte la regla de cantidad con TDD.
window.MODULES["m-bdd"] = {
    title: "BDD: desarrollo guiado por comportamiento",
    badge: "Método · BDD",
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
