// Registro derivado de deliverables.registry.json. No editar manualmente.
window.GUIDE_DELIVERABLES = {
  "version": "2.5.0",
  "standard": "devbrain.educational-guide",
  "guideId": "adso-testing-qa-calidad-2026",
  "status": "learning-guide-adaptation",
  "sourceStatus": "Registro local de trabajo para la guía; la valoración institucional corresponde al instructor y al LMS aplicable.",
  "portfolioTemplate": "docs/evidencias-template.md",
  "submission": {
    "packageName": "EV-TESTING-QA-2026",
    "namingRule": "EV-TESTING-QA-<ficha>-<apellido><nombre>.zip",
    "format": "Repositorio Git con suite de pruebas, reporte de cobertura, bitácora docs/ai-log.md y este registro local en Markdown/JSON. Si el instructor solicita un formato institucional, diligéncialo en el canal oficial correspondiente.",
    "where": "Actividad de Aseguramiento de Calidad y Pruebas en la plataforma LMS institucional del SENA.",
    "whatIsGraded": "La guía propone revisar el plan de pruebas, la cobertura de unitarias/integración, la automatización E2E, la bitácora V.E.R.A. y la trazabilidad entre cada evidencia y su criterio. El instrumento y los umbrales definitivos los establece el instructor.",
    "approval": [
      "Las tres evidencias técnicas están completadas en estado 'lista', ninguna en blanco.",
      "La suite de pruebas ejecuta con 100% de tests aprobados.",
      "La cobertura de código alcanza el umbral acordado para el alcance y se revisa junto con aserciones, riesgos y casos no probados.",
      "El registro local está completo, se puede exportar y fue revisado contra el instrumento definido por el instructor."
    ],
    "competencyMap": [
      {
        "evidenceType": "conocimiento",
        "artifacts": [
          "ART-TEST-01"
        ],
        "criterion": "Define el alcance, estrategia, ambientes, criterios de aceptación y matriz de casos de prueba del sistema.",
        "instrument": "Lista de chequeo de plan de pruebas.",
        "learningResult": "RAP-01 · Diseño y planificación de pruebas de software."
      },
      {
        "evidenceType": "desempeño",
        "artifacts": [
          "ART-TEST-02"
        ],
        "criterion": "Pruebas automatizadas con aserciones de casos borde y excepciones, cobertura contextualizada y límites documentados.",
        "instrument": "Rúbrica de pruebas automatizadas.",
        "learningResult": "RAP-01 · Automatización de pruebas unitarias y de integración con métricas de cobertura."
      },
      {
        "evidenceType": "producto",
        "artifacts": [
          "ART-TEST-03"
        ],
        "criterion": "Automatización de un flujo crítico y registro reproducible de resultados, defectos, severidad, estado y regresión, con alcance declarado cuando no hay hallazgos.",
        "instrument": "Rúbrica analítica de producto de software.",
        "learningResult": "RAP-01 · Pruebas End-to-End y gestión de defectos."
      }
    ]
  },
  "artifacts": [
    {
      "id": "ART-TEST-01",
      "code": "TEST-EV01",
      "name": "Documento del Plan de Pruebas de Software (adaptación 29119-3)",
      "evidenceType": "conocimiento",
      "purpose": "Estructurar la estrategia, ambientes, matriz de trazabilidad y casos de prueba del sistema.",
      "inputs": [
        "Historias de Usuario",
        "Criterios Gherkin / BDD"
      ],
      "instructions": "Redacta el plan de pruebas con alcance, riesgos, criterios de entrada y salida, oráculos y una matriz de casos funcionales y no funcionales. Comienza con los casos válidos, inválidos y de frontera del ejemplo resuelto; amplía según las reglas de tu aplicativo.",
      "example": "Plan resuelto con seis casos para una regla de cantidad y autorización, incluyendo dos límites, un caso válido, uno inválido y una justificación de la selección.",
      "criterion": "Define el alcance, estrategia, ambientes, criterios de aceptación y matriz de casos de prueba del sistema.",
      "instrument": "Lista de chequeo de plan de pruebas.",
      "evidence": "Documento del plan de pruebas con matriz, riesgos y límites declarados.",
      "nextStep": "Avanzar a la automatización de la suite de pruebas unitarias e integración.",
      "station": {
        "sectionId": "m-piramide",
        "order": 1,
        "phase": "contextualizacion",
        "minutes": 60
      },
      "fields": [
        {
          "key": "alcance_estrategia",
          "label": "Alcance y Estrategia de Pruebas",
          "type": "area",
          "hint": "Definición de tipos de prueba, herramientas y ambientes."
        },
        {
          "key": "matriz_casos",
          "label": "Matriz de Casos de Prueba (ID, Precondición, Pasos, Resultado)",
          "type": "area",
          "hint": "Tabla de casos de prueba detallados."
        }
      ],
      "checklist": [
        "Criterios de entrada/salida definidos",
        "Casos borde contemplados",
        "Revisado bajo V.E.R.A."
      ],
      "aiAssist": {
        "prompt": "Generar una matriz de casos de prueba para el módulo seleccionado del proyecto",
        "verify": "Contrastar cada caso con un requisito y ejecutar la suite correspondiente",
        "log": "docs/ai-log.md"
      },
      "upload": {
        "fileName": "01-plan-pruebas-29119-3.md",
        "format": "markdown"
      }
    },
    {
      "id": "ART-TEST-02",
      "code": "TEST-EV02",
      "name": "Suite de Pruebas Unitarias y de Integración con Cobertura",
      "evidenceType": "desempeño",
      "purpose": "Implementar pruebas automatizadas con aserciones rigurosas, aislamiento adecuado y cobertura interpretada según el riesgo.",
      "inputs": [
        "Código de producción",
        "PyTest / Jest / JUnit"
      ],
      "instructions": "Escribe las pruebas automatizadas aislando dependencias externas con dobles apropiados. Ejecuta la suite antes y después de una corrección, conserva el reporte de cobertura y explica qué riesgos y aserciones quedaron fuera del alcance.",
      "example": "Muestra de una suite con casos válidos, bordes y excepciones, resultado observado de la ejecución y reporte de cobertura interpretado; el porcentaje se informa como dato del entorno, no como meta universal.",
      "criterion": "Pruebas automatizadas con aserciones de casos borde y excepciones, cobertura contextualizada y límites documentados.",
      "instrument": "Rúbrica de pruebas automatizadas.",
      "evidence": "Código fuente de pruebas y reporte de cobertura.",
      "nextStep": "Implementar pruebas End-to-End con Playwright.",
      "station": {
        "sectionId": "m-pytest-fastapi",
        "order": 2,
        "phase": "apropiacion",
        "minutes": 60
      },
      "fields": [
        {
          "key": "codigo_tests",
          "label": "Código Fuente de Pruebas Automatizadas",
          "type": "area",
          "hint": "Estructura de tests unitarios e integración."
        },
        {
          "key": "reporte_cobertura",
          "label": "Métricas de Cobertura de Código (Lines, Branch, Coverage %)",
          "type": "area",
          "hint": "Salida del comando de cobertura."
        }
      ],
      "checklist": [
        "Aserciones estrictas implementadas",
        "Casos borde y excepciones ejecutados",
        "Cobertura y límites documentados",
        "Revisado bajo V.E.R.A."
      ],
      "aiAssist": {
        "prompt": "Generar un borrador de tests unitarios con PyTest y mocks para una función del proyecto",
        "verify": "Revisar las aserciones y ejecutar pytest en entorno local",
        "log": "docs/ai-log.md"
      },
      "upload": {
        "fileName": "02-suite-pruebas-cobertura.md",
        "format": "markdown"
      }
    },
    {
      "id": "ART-TEST-03",
      "code": "TEST-EV03",
      "name": "Pruebas End-to-End con Playwright y Reporte de Defectos",
      "evidenceType": "producto",
      "purpose": "Automatizar flujos de usuario completos mediante Playwright y documentar defectos, correcciones y regresiones en un registro reproducible.",
      "inputs": [
        "Aplicación web desplegada",
        "Playwright"
      ],
      "instructions": "Automatiza un flujo crítico del proyecto con precondiciones, datos, resultado esperado y aserciones observables. Conserva la evidencia de ejecución; si aparece un defecto, reprodúcelo, registra pasos, severidad, estado y vuelve a ejecutar el caso después de corregirlo. Si no aparece, declara el alcance y la ausencia de defectos dentro de lo probado.",
      "example": "Script Playwright con evidencia de ejecución y una matriz de defectos que muestra al menos un caso completo de reproducción y regresión, o una declaración del alcance probado cuando no se encontró un defecto.",
      "criterion": "Automatización de un flujo crítico y registro reproducible de resultados, defectos, severidad, estado y regresión, con alcance declarado cuando no hay hallazgos.",
      "instrument": "Rúbrica analítica de producto de software.",
      "evidence": "Scripts Playwright, artefactos de ejecución y reporte de defectos o alcance sin hallazgos.",
      "nextStep": "Consolidar el registro de evidencias y empaquetar la entrega final.",
      "station": {
        "sectionId": "m-playwright",
        "order": 3,
        "phase": "transferencia",
        "minutes": 60
      },
      "fields": [
        {
          "key": "script_playwright",
          "label": "Script de Automatización E2E Playwright",
          "type": "area",
          "hint": "Código del flujo E2E automatizado."
        },
        {
          "key": "matriz_defectos",
          "label": "Reporte de Defectos (Bug Tracker)",
          "type": "area",
          "hint": "ID, Severidad, Pasos de Reproducción y Estado."
        }
      ],
      "checklist": [
        "Precondiciones, datos y aserciones documentados",
        "Evidencia de ejecución conservada",
        "Defectos reproducidos y regresión repetida, o alcance sin hallazgos declarado",
        "Revisado bajo V.E.R.A."
      ],
      "aiAssist": {
        "prompt": "Automatizar flujo E2E de login y creación de recursos con Playwright",
        "verify": "Ejecutar npx playwright test",
        "log": "docs/ai-log.md"
      },
      "upload": {
        "fileName": "03-e2e-bug-tracker.md",
        "format": "markdown"
      }
    }
  ]
};
