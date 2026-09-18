// Catálogo declarativo por tema; conserva el contenido existente.
Object.assign(window.MODULES, {
    "m-reto": {
        title: "Reto Final: Pipeline QA Completo",
        badge: "Estación 18/18 · Reto",
        intro: "Aplica todo lo aprendido en un proyecto real: pipeline completo que valida las 4 guias.",
        blocks: [
            {
                type: "alert", variant: "info",
                title: "Objetivo del Reto",
                body: "Crear un repositorio que contenga tests para las 4 guias existentes (Flask, FastAPI, React, JSP) y un pipeline CI/CD que los ejecute todos en cada push."
            },
            {
                type: "alert", variant: "success",
                title: "Entregables",
                body: "1. Plan trazable con reglas, riesgos y casos. 2. Suite en una tecnología elegida, con aserciones útiles y cobertura justificada. 3. Recorridos E2E críticos y defectos documentados. 4. CI con resultados de la revisión probada. 5. README, reportes y declaración de lo no probado. Acordar alcance y criterios con el instructor."
            },
            {
                type: "diagram",
                diagramType: "pipeline",
                title: "Diagrama Visual: Hoja de Ruta y Calificación del Reto Integral de Calidad",
                stages: [
                    { icon: "📋", name: "AA12: Planificación", desc: "Plan ISO/IEC 29119-3 y Matriz de Trazabilidad R-CANT." },
                    { icon: "✍️", name: "AA13: Diseño de Casos", desc: "CP-01 a CP-06 con valores límite, oráculos y particiones." },
                    { icon: "🛠️", name: "AA14: Entorno & Humo", desc: "Aislamiento en venv/npm, SQLite en memoria y smoke check." },
                    { icon: "🧪", name: "AA15: Ejecución & Suites", desc: "PyTest, Vitest, JUnit 5, Playwright y reporte de cobertura." },
                    { icon: "📦", name: "AA16: Dossier & CI", desc: "Pipeline GitHub Actions verde + informe de riesgos residuales." }
                ],
                body: "El Reto Final consolida las 5 actividades de aprendizaje en un portafolio de evidencias profesional y reproducible."
            },
            {
                type: "case-study",
                title: "Caso Práctico Paso a Paso: Auditoría Integral y Certificación de Calidad del Ecosistema de Préstamos",
                context: "Realizar la auditoría de entrega final sobre el sistema de préstamos. Se consolida el plan ART-TEST-01, la ejecución automatizada multi-tecnología (FastAPI, React, JUnit, Playwright), el reporte de defectos DEF-01 resuelto, la compuerta de cobertura al 85% y la certificación de calidad en GitHub Actions.",
                preconditions: [
                    "Plan de pruebas y matriz de trazabilidad actualizados en 'docs/pruebas/'.",
                    "Repositorio Git con suites unitarias, integración y E2E operativas.",
                    "Pipeline en GitHub Actions con Quality Gate bloqueante activo."
                ],
                code: `# Secuencia de Verificación Integral del Reto:

# 1. Backend FastAPI: Pruebas unitarias y de integración con cobertura
pytest tests/unit tests/integration --cov=app --cov-branch --cov-fail-under=80

# 2. Frontend React: Pruebas de componentes accesibles con Vitest
npm run test:coverage

# 3. Backend Java Spring Boot: Pruebas con Mockito y reporte JaCoCo
mvn test jacoco:report

# 4. End-to-End: Recorrido del camino crítico con Playwright
npx playwright test --reporter=html

# 5. Auditoría de Seguridad y Calidad con qa_auditor
python -m qa_auditor --target app/ --min-score 85 --html test-results/auditoria.html`,
                command: "python -m qa_auditor --target app/ --min-score 85 --html test-results/auditoria.html",
                oracle: "Todas las suites deben finalizar con código 0. El informe de qa_auditor debe certificar score >= 85%, 0 secretos expuestos, 0 tests vacíos y cobertura de ramas >= 80%.",
                expectedVsObserved: [
                    ["PyTest + Vitest + JUnit 5", "Todas las suites pasan en verde sin omitir aserciones", "Pasa en verde"],
                    ["Playwright E2E en Chromium", "3 flujos críticos validados con capturas y videos", "Caminos dorados certificados"],
                    ["Reporte Final de Auditoría", "Score 92/100, 0 defectos bloqueantes, matriz 100% trazable", "Aprobado con Distinción"]
                ],
                decision: "El ecosistema de software cumple satisfactoriamente con la compuerta de calidad y los estándares de la guía SENA ADSO, quedando certificado para su entrega formal."
            },
            {
                type: "steps",
                title: "Ruta AA12 a AA16: genera la documentación y los artefactos",
                intro: "Avanza en orden y conserva la evidencia de cada decisión. La documentación de pruebas es una adaptación didáctica de ISO/IEC/IEEE 29119-3:2021 y no declara conformidad normativa; confirma el formato institucional con tu instructor.",
                steps: [
                    { number: "AA12", title: "Realizar plan de pruebas", tag: "Planificar", desc: "Identifica versión, alcance y requisitos; analiza riesgos; define niveles, tipos, técnicas, herramientas, responsables, criterios de entrada y salida. Crea docs/pruebas/01-plan-pruebas-29119-3.md y una matriz que conecte requisito, riesgo, caso y evidencia." },
                    { number: "AA13", title: "Definir casos de prueba", tag: "Diseñar", desc: "Deriva casos de éxito, error, límites, permisos, estados y conflictos según el riesgo. Asigna CP-001, prioridad, precondiciones, datos, pasos, esperado, oráculo, limpieza y archivo automatizado. Guarda docs/pruebas/02-casos-prueba.md." },
                    { number: "AA14", title: "Definir ambiente de prueba", tag: "Preparar", desc: "Registra sistema operativo, versiones, dependencias, navegador, servicios, configuración, datos sintéticos, roles y procedimiento de reinicio. Ejecuta una comprobación de humo y guarda docs/pruebas/03-ambiente-prueba.md. No uses secretos ni datos reales." },
                    { number: "AA15", title: "Realizar pruebas", tag: "Ejecutar", desc: "Congela el compromiso evaluado, ejecuta por niveles y registra por caso aprobado, fallido o bloqueado, comando, fecha, duración, esperado y observado. Clasifica ambiente frente a defecto; conserva reportes en test-results/ y documenta confirmación y regresión." },
                    { number: "AA16", title: "Documentar las pruebas", tag: "Cerrar", desc: "Consolida métricas, defectos, criterios de salida, riesgos residuales y lo no probado. Arma el Portafolio de Evidencias con el informe final, matriz de trazabilidad, archivos editables, resultados reproducibles y docs/ai-log.md cuando uses IA." }
                ]
            },
            {
                type: "comparison",
                title: "Estructura mínima de la entrega",
                headers: ["Ubicación", "Contenido", "Regla de revisión"],
                rows: [
                    ["docs/pruebas/", "Plan, casos, ambiente, ejecuciones, defectos, informe y matriz.", "Cada archivo tiene versión, fecha, responsable y enlaces relativos."],
                    ["tests/", "Pruebas unitarias, integración, contrato y E2E.", "Cada prueba tiene una aserción útil y se puede ejecutar con un comando."],
                    ["test-results/", "Cobertura, salidas, capturas, trazas y videos seleccionados.", "Los resultados corresponden al compromiso evaluado y no contienen secretos."],
                    ["docs/ai-log.md", "Herramienta consultada, solicitud, salida aceptada, verificación y decisión humana.", "La IA es apoyo; la ejecución y la explicación son del aprendiz."]
                ]
            },
            {
                type: "alert", variant: "warning",
                title: "Cierre responsable",
                body: "Antes de entregar, comprueba que no existan requisitos sin prueba, casos sin resultado esperado, ejecuciones sin versión, defectos sin estado o enlaces rotos. Declara lo que no probaste y el riesgo residual; una suite verde no demuestra por sí sola que el sistema esté libre de defectos."
            },
            {
                type: "alert", variant: "warning",
                title: "Rúbrica de Evaluación",
                body: "Rúbrica didáctica para acordar con el instructor: trazabilidad y justificación de cobertura (25 pts), pruebas significativas (25 pts), recorridos críticos y defectos (20 pts), CI reproducible (20 pts), documentación y riesgo residual (10 pts). Los puntos no emiten un juicio institucional automático."
            },
            {
                type: "tools",
                title: "El stack completo del reto",
                stack: [
                    {
                        icon: "⚡", name: "PyTest", tag: "Python",
                        role: "Unitarias e integracion de FastAPI y Flask con cobertura (pytest-cov).",
                        when: "Capa base de la piramide: dominio y endpoints."
                    },
                    {
                        icon: "⚛️", name: "Vitest + Testing Library", tag: "JS",
                        role: "Componentes React y hooks con aserciones de usuario (getByRole).",
                        when: "Frontend de la app React: UI y estados."
                    },
                    {
                        icon: "☕", name: "JUnit 5 + Mockito", tag: "Java",
                        role: "Servicios y DAOs aislados con dobles; integracion con H2.",
                        when: "Backend Java de la guia JSP/Spring Boot."
                    },
                    {
                        icon: "🎬", name: "Playwright", tag: "E2E",
                        role: "3 flujos criticos con evidencia (video/trace) y screenshots.",
                        when: "La punta de la piramide: lo que el negocio toca con la mano."
                    },
                    {
                        icon: "🚀", name: "GitHub Actions", tag: "CI/CD",
                        role: "Pipeline que ejecuta todo el stack y depliega a VPS si el Quality Gate pasa.",
                        when: "Cada push, si la suite relevante pasa y se cumple el umbral de cobertura justificado para el proyecto."
                    },
                    {
                        icon: "📈", name: "k6", tag: "Rendimiento",
                        role: "Prueba de carga que valida p95 < 250ms antes de poner el servicio en produccion.",
                        when: "Bono de calidad no funcional: demuestra que la app aguanta."
                    }
                ]
            }
]
    }
});
