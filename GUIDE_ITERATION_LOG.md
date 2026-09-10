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
