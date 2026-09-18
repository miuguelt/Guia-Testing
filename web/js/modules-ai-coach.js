// Catálogo declarativo por tema; conserva el contenido existente.
Object.assign(window.MODULES, {
    "m-gema-testing": {
        title: "Constructor de Gema QA: convierte tu proyecto en un encargo claro",
        badge: "Estación 16/18 · IA",
        intro: "Aquí no vas a crear una IA ni a generar todos los tests de una vez. Vas a completar un formulario que transforma la información de tu proyecto en una instrucción de trabajo para tu asistente de IA.",
        blocks: [
            {
                type: "alert", variant: "info",
                title: "Qué vas a producir",
                body: "Al final tendrás un encargo QA personalizado para pegar en Copilot, Cursor, Gemini, Claude, Amazon Q u otro asistente. Ese encargo pedirá diagnóstico, matriz de trazabilidad, pruebas por capas y evidencia. No reemplaza la ejecución ni tu revisión."
            },
            {
                type: "steps",
                title: "Ruta del módulo: completa, genera y verifica",
                intro: "Usa un proyecto real de práctica, pero nunca pegues secretos. Avanza en orden y guarda la salida para convertirla en evidencia.",
                steps: [
                    {
                        number: 1,
                        title: "Completa las cuatro estaciones",
                        tag: "1 · Contexto · 2 · Riesgo · 3 · Estrategia · 4 · Entrega",
                        desc: "Responde los campos marcados con * y agrega detalles concretos. Describe el proyecto, lo que no puede fallar, los casos que quieres cubrir y cómo sabrás que el trabajo está terminado.",
                        tip: "Es mejor escribir un flujo crítico real que llenar el formulario con frases genéricas.",
                        pitfall: "Dejar que la IA adivine el framework, el comando de pruebas o los criterios de éxito."
                    },
                    {
                        number: 2,
                        title: "Genera la instrucción QA",
                        tag: "Usar el botón de la estación 4",
                        desc: "En la última estación confirma que no incluiste información sensible y pulsa `Generar mi instrucción QA`. Revisa el resultado y corrige tus respuestas si la salida no menciona tu riesgo, tu herramienta o tu definición de terminado.",
                        tip: "La salida es un encargo revisable, no una orden que debas aceptar sin leer.",
                        pitfall: "Confundir la instrucción generada con una suite de pruebas ya ejecutada."
                    },
                    {
                        number: 3,
                        title: "Lleva el encargo a tu asistente",
                        tag: "Aplicar",
                        desc: "Copia o descarga el `.md` y pégalo en el asistente que tengas disponible. Pídele primero diagnóstico y matriz; después trabaja un riesgo y una capa de pruebas a la vez.",
                        tip: "Si el asistente inventa un archivo o una librería, detén la sesión y pídele que cite el archivo real.",
                        pitfall: "Solicitar todos los tests en una sola respuesta y aceptar cambios grandes sin revisar el diff."
                    },
                    {
                        number: 4,
                        title: "Entrega la evidencia",
                        tag: "Demostrar",
                        desc: "Guarda la instrucción generada, la matriz, los tests revisados, el comando y el resultado de ejecución. Completa la bitácora V.E.R.A. con lo que propuso la IA, lo que verificaste y lo que quedó pendiente.",
                        tip: "La evidencia demuestra tu proceso de calidad; el texto generado por la IA por sí solo no lo demuestra.",
                        pitfall: "Entregar una suite verde sin mostrar qué requisito cubre ni qué riesgo sigue abierto."
                    }
                ]
            },
            { type: "ai-coach" },
            {
                type: "diagram",
                diagramType: "architecture",
                title: "Diagrama Visual: Arquitectura del Contrato de Encargo con Gema QA",
                nodes: [
                    { title: "📋 Formulario Contextual", detail: "Captura contexto, riesgo crítico, framework y criterios de aceptación." },
                    { title: "📄 Contrato Gema QA (.md)", detail: "Genera prompt estructurado con restricciones, oráculos y política anti-alucinaciones." },
                    { title: "🤖 Copiloto LLM (Cursor / Claude)", detail: "Procesa el encargo por capas: primero matriz de riesgos, luego suites aisladas." },
                    { title: "🛡️ Bitácora V.E.R.A.", detail: "Verifica aserciones, ejecuta tests y registra la decisión del ingeniero humano." }
                ],
                body: "El Constructor de Gema QA actúa como un compilador de requerimientos hacia la IA: transforma intenciones de negocio ambiguas en especificaciones técnicas rigurosas con oráculos explícitos y límites claros."
            },
            {
                type: "case-study",
                title: "Caso Práctico Paso a Paso: Encargo Estructurado y Auditoría con Gema QA",
                context: "Utilizar el Constructor de Gema QA para redactar el encargo del módulo de préstamos de laboratorios (SENA ADSO). La Gema genera el contrato exigiendo la regla R-CANT (1 a 5 equipos), cobertura mínima del 80% y oráculos determinísticos. Se envía a un asistente de IA, se auditan las aserciones y se ejecuta la suite generada.",
                preconditions: [
                    "Formulario de Gema completado con: Entidad='Prestamo', Regla='R-CANT: [1, 5] equipos', Stack='FastAPI + PyTest'.",
                    "Archivo de salida 'gema-qa-prestamos.md' generado sin secretos ni credenciales reales.",
                    "Entorno de pruebas local listo con pytest y pytest-cov instalados."
                ],
                code: `### 📜 Contrato Gema QA Generado (Extracto de la Instrucción):

**ROL:** Ingeniero QA Senior con enfoque en Calidad y Seguridad de Software.
**CONTEXTO:** Sistema de Préstamo de Equipos y Laboratorios (SENA ADSO).
**REGLA CRÍTICA:** R-CANT: Solo se permiten entre 1 y 5 equipos por solicitud.

**INSTRUCCIONES DE TRABAJO:**
1. NO inventes imports ni módulos que no existan en el árbol de archivos.
2. Genera una matriz de trazabilidad: Requisito ➔ Riesgo ➔ Casos CP-01 a CP-06.
3. Para cada caso, define: Entrada, Precondición, Oráculo y Aserción estricta.
4. Entrega el código en PyTest con SQLite en memoria y TestClient.

---
### 🧪 Código Generado tras el Contrato Gema:
def test_contrato_gema_cantidad_valida(client):
    res = client.post("/api/v1/prestamos/", json={"aprendiz_id": 1, "cantidad": 4})
    assert res.status_code == 201
    assert res.json()["cantidad"] == 4

def test_contrato_gema_cantidad_invalida(client):
    res = client.post("/api/v1/prestamos/", json={"aprendiz_id": 1, "cantidad": 7})
    assert res.status_code == 422`,
                command: "pytest tests/test_gema_prestamos.py -v --cov=app/prestamos --cov-fail-under=80",
                oracle: "La suite generada por el encargo debe incluir aserciones tanto de éxito (201) como de rechazo (422) y alcanzar una cobertura de al menos 80% sin mocks ficticios.",
                expectedVsObserved: [
                    ["Encargo genérico ('hazme tests para préstamos')", "Código desordenado, sin fixture en memoria, asserts triviales", "Falta de precisión (Rechazado)"],
                    ["Encargo con Gema QA estructurada", "Suite completa con fixtures, parametrize y 6 casos frontera", "Aprobado para ejecución"],
                    ["Ejecución de la suite resultante", "6 pruebas ejecutadas en 0.08s con 89% de cobertura", "Pasa en verde"]
                ],
                decision: "Invertir 5 minutos en redactar un encargo estructurado con la Gema QA ahorra horas de depuración de alucinaciones y código basura generado por la IA."
            },
            {
                type: "steps",
                title: "Cómo usar la salida sin perder el control",
                intro: "La instrucción generada no es una orden para aceptar a ciegas: es un contrato de trabajo y de verificación.",
                steps: [
                    { number: 1, title: "Pide diagnóstico y matriz antes del código", tag: "Entender", desc: "Entrega el encargo y exige que la IA inspeccione archivos, configuración y pruebas actuales. Verifica que cada requisito tenga riesgo, caso, archivo y aserciones.", tip: "Si la IA inventa una ruta o una librería, detén el proceso y pídele que cite el archivo real.", pitfall: "Pedir 'crea todos los tests' sin indicar qué significa correcto para el negocio." },
                    { number: 2, title: "Genera por una capa y un riesgo a la vez", tag: "Construir", desc: "Empieza por lógica unitaria, continúa con integración y deja los flujos E2E críticos para el final. Ejecuta la suite después de cada lote pequeño.", tip: "Un test que falla por una razón clara enseña más que cien archivos generados de una sola vez.", pitfall: "Cambiar el código de producción solo para que el test pase sin registrar el defecto." },
                    { number: 3, title: "Audita cada prueba como evidencia", tag: "Revisar", desc: "Comprueba imports, datos aislados, aserciones de resultado y efectos secundarios, mensajes de error y ausencia de esperas fijas o estados compartidos.", tip: "Pregunta: ¿por qué este test fallaría si la funcionalidad estuviera rota? Si no hay respuesta, rediseña la prueba.", pitfall: "Confundir cobertura de líneas con cobertura de riesgos." },
                    { number: 4, title: "Cierra con ejecución y bitácora V.E.R.A.", tag: "Demostrar", desc: "Guarda comandos, resultados, cobertura, defectos encontrados y decisiones humanas. La evidencia es tu verificación, no el texto que generó la IA.", tip: "Conserva el diff y el reporte en tu rama de trabajo para poder explicar cada cambio.", pitfall: "Presentar una suite verde sin mostrar qué escenarios quedaron pendientes." }
                ]
            },
            {
                type: "alert", variant: "warning",
                title: "No pegues secretos ni datos reales",
                body: "No pegues secretos. Antes de copiar código, registros o configuración a cualquier IA, retira contraseñas, tokens, llaves privadas, datos personales y variables de entorno. Usa marcadores como <TU_TOKEN_AQUI>, datos ficticios y una cuenta desechable."
            },
            {
                type: "alert", variant: "success",
                title: "Producto de aprendizaje",
                body: "Al terminar tendrás una instrucción de pruebas, una matriz de trazabilidad, una suite ejecutada y una bitácora que explica qué propuso la IA, qué verificaste y qué decidiste."
            }
        ]
    }
});
