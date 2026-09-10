// Catálogo declarativo por tema; conserva el contenido existente.
Object.assign(window.MODULES, {
    "m-herramientas-ia": {
        title: "Laboratorio de herramientas IA para calidad",
        badge: "Modulo 15 · elección informada",
        intro: "Conoce herramientas parecidas a una Gema, aprende qué construyen y escoge la que encaja con el lenguaje, la capa de pruebas y el nivel de control que necesita tu proyecto.",
        blocks: [
            {
                type: "alert", variant: "info",
                title: "Mapa rápido para el aprendiz",
                body: "Asistentes y agentes (GitHub Copilot, Cursor, Gemini Code Assist, Claude Code y Amazon Q) ayudan a entender y escribir. Qodo revisa cambios y reglas. Diffblue Cover se especializa en unitarias Java/Kotlin. mabl ayuda a planear y autorizar pruebas de navegador y API. Ninguna herramienta decide por sí sola si el requisito de negocio está cumplido."
            },
            { type: "tool-lab" },
            {
                type: "comparison",
                title: "Cómo escoger sin perseguir la novedad",
                headers: ["Necesidad", "Primera opción para aprender", "Qué debe verificar el aprendiz"],
                rows: [
                    ["Escribir una primera prueba en un archivo del IDE", "Copilot, Cursor o Gemini Code Assist", "Imports reales, aserciones, comando y resultado."],
                    ["Trabajar con un proyecto Java/Kotlin grande", "Diffblue Cover + JUnit", "Que compile, que la prueba valide una regla útil y que no capture un defecto como si fuera contrato."],
                    ["Revisar código generado contra requisitos y reglas", "Qodo o Amazon Q", "Hallazgos reproducibles, severidad y pruebas de regresión."],
                    ["Automatizar un viaje visible de navegador o una API", "Playwright para aprender código; mabl para explorar autoría asistida", "Aserciones observables, datos ficticios, costos y privacidad."],
                    ["Aprender sin depender de una cuenta paga", "Framework local + cualquier asistente aprobado", "Que el proyecto siga siendo ejecutable sin el proveedor de IA." ]
                ]
            },
            {
                type: "steps",
                title: "Ruta práctica de herramientas",
                intro: "Construye criterio antes de aumentar la autonomía.",
                steps: [
                    { number: 1, title: "Identifica la capa y el lenguaje", tag: "Elegir", desc: "Escribe si necesitas unitarias, integración, E2E, revisión o seguridad y confirma el lenguaje y el ejecutor del proyecto.", tip: "Si no puedes nombrar la capa, todavía estás definiendo el problema.", pitfall: "Escoger una herramienta porque generó más líneas de código." },
                    { number: 2, title: "Prueba una tarea pequeña y medible", tag: "Experimentar", desc: "Usa una función o un flujo pequeño. Mide si la respuesta compila, corre, cubre un riesgo y es entendible para ti.", tip: "Pide primero un plan y después el código; así puedes comparar intención contra resultado.", pitfall: "Entregar acceso a todo el repositorio cuando solo necesitas un archivo." },
                    { number: 3, title: "Compara la propuesta con tu suite", tag: "Contrastar", desc: "Ejecuta el comando real, revisa la diferencia y agrega un caso que la IA no haya visto. Si hay un fallo, clasifícalo como aplicación, prueba o ambiente.", tip: "Una prueba adicional escrita por ti es una forma concreta de aprender a evaluar la IA.", pitfall: "Aceptar un parche automático sin mirar el diff." },
                    { number: 4, title: "Registra decisión y límites", tag: "Transferir", desc: "Documenta por qué elegiste la herramienta, qué datos compartiste, qué costos o cuentas exige y qué verificación humana quedó pendiente.", tip: "La herramienta debe poder cambiarse sin perder tus requisitos ni tu suite.", pitfall: "Convertir la cuenta o el servicio en la única fuente de verdad del proyecto." }
                ]
            },
            {
                type: "alert", variant: "warning",
                title: "Disponibilidad y planes cambian",
                body: "Las fichas del laboratorio enlazan documentación oficial consultada en 2026. Antes de usar una herramienta en clase, confirma versión, licencia, país, privacidad, límites de uso e integración con tu entorno."
            }
        ]
    }
});
