// Catálogo declarativo por tema; conserva el contenido existente.
Object.assign(window.MODULES, {
    "m-reto": {
        title: "Reto Final: Pipeline QA Completo",
        badge: "Modulo 16",
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
                        when: "Cada push, y solo si el coverage >= 80%."
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
