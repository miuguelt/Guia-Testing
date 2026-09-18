// Catálogo declarativo por tema; conserva el contenido existente.
Object.assign(window.MODULES, {
    "m-herramientas-ia": {
        title: "Laboratorio de herramientas IA para calidad",
        badge: "Estación 17/18 · IA",
        intro: "Conoce herramientas parecidas a una Gema, aprende qué construyen y escoge la que encaja con el lenguaje, la capa de pruebas y el nivel de control que necesita tu proyecto.",
        blocks: [
            {
                type: "alert", variant: "info",
                title: "Mapa rápido para el aprendiz",
                body: "Asistentes y agentes (GitHub Copilot, Cursor, Gemini Code Assist, Claude Code y Amazon Q) ayudan a entender y escribir. Qodo revisa cambios y reglas. Diffblue Cover se especializa en unitarias Java/Kotlin. mabl ayuda a planear y autorizar pruebas de navegador y API. Ninguna herramienta decide por sí sola si el requisito de negocio está cumplido."
            },
            { type: "tool-lab" },
            {
                type: "diagram",
                diagramType: "architecture",
                title: "Diagrama Visual: Ecosistema Comparativo de Herramientas IA para Calidad de Software",
                nodes: [
                    { title: "🧠 Asistentes de IDE (Copilot / Cursor)", detail: "Generación en línea de casos de prueba unitarios, fixtures y refactorización rápida." },
                    { title: "🛡️ Agentes de Análisis & Revisión (Qodo / Amazon Q)", detail: "Auditoría de Pull Requests, detección de casos borde olvidados y reglas de calidad." },
                    { title: "☕ Especialistas JVM (Diffblue Cover)", detail: "Generación 100% autónoma de suites completas de JUnit 5 para Spring Boot." },
                    { title: "🌐 Autoría E2E Asistida (Playwright + AI / mabl)", detail: "Grabación inteligente, selectores auto-curativos (self-healing) y validación visual." }
                ],
                body: "Cada herramienta de IA tiene un área de especialidad. La clave del éxito en QA consiste en emparejar la herramienta adecuada con la capa correcta de la pirámide de pruebas, sin ceder la responsabilidad del oráculo."
            },
            {
                type: "case-study",
                title: "Caso Práctico Paso a Paso: Benchmark Comparativo de Mocks: Copilot vs Cursor vs Qodo",
                context: "Evaluar cómo generan dobles de prueba (Mocks) diferentes asistentes de IA al aislar el servicio de correo en el flujo de notificación de préstamos. Se contrasta la propuesta de Copilot, Cursor y Qodo evaluando si generan dobles limpios o acoplan los tests a la implementación interna.",
                preconditions: [
                    "Servicio 'NotificadorPrestamo' que invoca a un cliente SMTP externo.",
                    "Regla: al aprobar un préstamo válido, debe enviar 1 correo sin bloquear el hilo principal.",
                    "Suite de comparación en 'tests/test_notificaciones.py' con PyTest y pytest-mock."
                ],
                code: `# app/notificador.py
class NotificadorPrestamo:
    def __init__(self, cliente_email):
        self.cliente_email = cliente_email

    def notificar_aprobacion(self, correo_aprendiz: str, id_prestamo: int) -> bool:
        asunto = f"Préstamo #{id_prestamo} Aprobado"
        cuerpo = "Tu solicitud de equipos ha sido confirmada."
        return self.cliente_email.enviar(correo_aprendiz, asunto, cuerpo)

# tests/test_benchmark_ia.py (Solución de referencia validada)
def test_notificar_aprobacion_aislado(mocker):
    # Mock limpio del cliente externo
    mock_email = mocker.Mock()
    mock_email.enviar.return_value = True

    notificador = NotificadorPrestamo(cliente_email=mock_email)
    resultado = notificador.notificar_aprobacion("aprendiz@sena.edu.co", 849)

    assert resultado is True
    # Verificación estricta de interacción
    mock_email.enviar.assert_called_once_with(
        "aprendiz@sena.edu.co",
        "Préstamo #849 Aprobado",
        "Tu solicitud de equipos ha sido confirmada."
    )`,
                command: "pytest tests/test_benchmark_ia.py -v",
                oracle: "El mock debe capturar los argumentos exactos sin enviar tráfico SMTP real. La prueba debe ejecutarse en < 20ms.",
                expectedVsObserved: [
                    ["Propuesta GitHub Copilot", "Mock simple correcto pero sin validar argumentos exactos en assert_called", "Aceptable con corrección"],
                    ["Propuesta Cursor Composer", "Generó la fixture completa con mocker e incluyó assert_called_once_with", "Óptima y directa"],
                    ["Propuesta Qodo Gen", "Generó además casos de fallo de conexión SMTP (timeout y retry)", "Excelente cobertura de riesgo"]
                ],
                decision: "Cursor y Qodo destacan en comprensión de arquitectura y generación de escenarios de fallo, mientras que Copilot es más ágil para autocompletar la sintaxis inmediata."
            },
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
