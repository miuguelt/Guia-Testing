# Registro de iteraciones de la guía


## 2026-09-09 20:28 -05:00 - validated

- Iteración: adso-testing-qa-calidad-2026-20260909202815543
- Estándar: 2.4.0
- Resumen: Auditoría editorial de Guía Testing y comparación estructural de 34 guías; estándar de autoría DevBrain 2.5.0 incorporado y recuperable por MCP. No es liberación de la web.
- Evidencia: docs/auditoria-pedagogica-2026-09-09.md; docs/comparacion-guias-2026-09-09.md; GUIDE_READINESS_REVIEW.md; artifacts/pedagogical-audit/guide-contract.json
- Retroalimentación: La validación estructural no demuestra autonomía; validación con aprendices pendiente; Las recomendaciones de contenido web quedan documentadas, no implementadas
- Reglas candidatas: first-result-with-recovery; worked-practice-independent-transfer; simulation-output-must-match-its-claim

## 2026-09-09 21:02 -05:00 - validated

- Iteración: adso-testing-qa-calidad-2026-20260909210252730
- Estándar: 2.5.0
- Resumen: Primera iteración web de la ruta autónoma y práctica de casos
- Evidencia: web/index.html; web/js/modules-content.js; guide.manifest.json; deliverables.registry.json; pytest -q: 50 passed; Test-DevBrainEducationalGuide.ps1 -Strict: passed; Test-GuideDeliverables.ps1 -Strict: passed; Test-WebQuality.ps1: 0 errores
- Retroalimentación: Validar con un principiante real antes de declarar autonomía pedagógica
- Reglas candidatas: worked-example-before-framework; observable-oracle-and-resolved-cases; transfer-and-boundary-statement

## 2026-09-09 21:14 -05:00 - validated

- Iteración: adso-testing-qa-calidad-2026-20260909211426798
- Estándar: 2.5.0
- Resumen: Segunda iteración web: diagnóstico y recuperación para principiantes
- Evidencia: web/index.html; web/css/styles.css; GUIDE_READINESS_REVIEW.md; pytest -q: 50 passed; recorrido local #descargar: diagnóstico visible; Test-DevBrainEducationalGuide.ps1 -Strict: passed; Test-GuideDeliverables.ps1 -Strict: passed
- Retroalimentación: Validar con un principiante real la secuencia de recuperación y adaptar mensajes según los bloqueos observados
- Reglas candidatas: diagnostic-order-location-version-environment-dependency; classify-environment-vs-product-failure

## 2026-09-09 21:19 -05:00 - validated

- Iteración: adso-testing-qa-calidad-2026-20260909211935435
- Estándar: 2.5.0
- Resumen: Tercera iteración: cierre de evidencias y regresión reproducible
- Evidencia: deliverables.registry.json; web/js/deliverables-registry.js; exportar-proyecto.ps1; web/downloads/guia-testing-qa.zip; pytest -q: 51 passed; Test-DevBrainEducationalGuide.ps1 -Strict: passed; Test-GuideDeliverables.ps1 -Strict: passed; Test-WebQuality.ps1: 0 errores
- Retroalimentación: Validar con un principiante la comprensión de alcance, resultado observado y regresión
- Reglas candidatas: evidence-must-report-observed-result; defect-reproduction-and-regression; no-prefixed-success-metrics

## 2026-09-10 16:16 -05:00 - validated

- Iteración: adso-testing-qa-calidad-2026-20260910161637611
- Estándar: 2.5.0
- Resumen: Fundamentos ampliados y ruta TDD/BDD con laboratorio compartido y descarga reproducible
- Evidencia: docs/revision-fundamentos-tdd-bdd-2026-09-10.md; 72 pruebas aprobadas; 13 casos pytest y 6 escenarios Behave desde ZIP limpio; 30 revisiones de tamaño sin desbordamiento; Presentación de código y modularidad aprobadas
- Retroalimentación: Validación con aprendiz e instructor pendiente; alcance técnico y limitaciones documentados
- Reglas candidatas: no se proponen reglas globales.

## 2026-09-10 19:37 -05:00 - validated

- Iteración: adso-testing-qa-calidad-2026-20260910193730820
- Estándar: 2.5.0
- Resumen: Acompañamiento humano-IA distribuido en 16 módulos, corrección de reglas universales y revisión responsive de enlaces profundos
- Evidencia: 81 pruebas automatizadas aprobadas; Test-DevBrainEducationalGuide strict aprobado; Test-WebQuality: 0 errores; Test-GuideDeliverables: 3 artefactos y 3 estaciones; Web audit: 0 violaciones axe y 0 desbordamientos; Recorrido TDD en navegador: bloqueo, tres verificaciones y registro confirmados
- Retroalimentación: Validar comprensión y transferencia con un aprendiz real antes de declarar autonomía pedagógica; El auditor de foco cuenta controles de secciones SPA ocultas; el foco calculado del menú se verificó manualmente
- Reglas candidatas: no se proponen reglas globales

## 2026-09-12 00:00 -05:00 - validated

- Iteración: adso-testing-qa-calidad-2026-20260912000000000
- Estándar: 2.5.0
- Versión de la guía: 3.7.0
- Resumen: 18 estaciones con priorización por riesgo, gestión de defectos, práctica mínima de rendimiento y accesibilidad, caja blanca, simulador de diseño de casos y shell accesible orientado por índice.
- Evidencia: `pytest -q` (86 aprobadas); `tests/test_v370_completion.py`; validación de sintaxis JavaScript (28 archivos); peso de imágenes y fuentes dentro de los objetivos; recorrido local en navegador fresco sobre riesgo y defectos, máquina de estados visible, shell versionado/deferido, sin overflow en el viewport normal y sin errores/advertencias de consola.
- Retroalimentación: Validar con un aprendiz e instructor la comprensión de la matriz de riesgo y del ciclo de defectos. `Test-GuideDeliverables.ps1` sigue necesitando una corrección de infraestructura: inspecciona el redirect `index.html` raíz en vez del entrypoint `./web/index.html` declarado por el manifiesto; el contrato real sí queda cubierto por `tests/test_guide.py`. No se presenta una auditoría axe como ejecutada.
- Reglas candidatas: no se proponen reglas globales.
