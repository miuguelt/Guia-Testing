/**
 * TESTING SESSION MANAGER — SENA ADSO 2026
 * Gestor del Estado de Sesión, Matriz de Checks de Pruebas y Resultados de Simuladores.
 * Single Source of Truth (SSoT) para el avance real del aprendiz en la sesión.
 */
(function (global) {
    'use strict';

    const STORAGE_KEYS = {
        PROFILE: 'guia_testing_apprentice_profile',
        SIGNATURE: 'guia_testing_apprentice_signature',
        TEST_CHECKS: 'guia_testing_test_checks',
        SIMULATORS: 'guia_testing_simulators',
        EVIDENCES: 'guia_testing_evidencias_state'
    };

    // Catálogo maestro de suites y checks de prueba evaluables en la guía
    const DEFAULT_TEST_CHECKS = [
        {
            id: 'check-pytest-unit',
            name: 'PyTest: Pruebas Unitarias de Lógica Pura',
            framework: 'PyTest 8.x',
            file: 'tests/unit/test_calculos.py',
            phase: 'Fase 1: Base de la Pirámide',
            description: 'Aserciones de cálculo de IVA (19%), descuentos por volumen y redondeo monetario sin dependencias externas.',
            details: 'Aserciones de cálculo de IVA (19%), descuentos por volumen y redondeo monetario.',
            simId: 'sim-assertion',
            simName: 'Validador de Aserciones',
            stationId: 'm-simuladores',
            tabId: 'tab-all-sims',
            passed: false,
            executedAt: null,
            outputSnippet: 'tests/unit/test_calculos.py::test_calcular_iva PASSED\ntests/unit/test_calculos.py::test_descuento_volumen PASSED\ntests/unit/test_calculos.py::test_redondeo_centavos PASSED\n\n=== 3 passed in 0.04s ==='
        },
        {
            id: 'check-tdd-cycle',
            name: 'TDD: Ciclo Rojo - Verde - Refactor',
            framework: 'PyTest + Pydantic v2',
            file: 'tests/unit/test_schemas.py',
            phase: 'Fase 2: Diseño Guiado por Pruebas',
            description: 'Validación estricta de contratos de datos, tipos de campo, valores límite y excepciones esperadas.',
            details: 'Ciclo Rojo-Verde-Refactor con validación de esquemas y fronteras.',
            simId: 'sim-tdd',
            simName: 'TDD Interactivo',
            stationId: 'm-simuladores',
            tabId: 'tab-dev-order',
            passed: false,
            executedAt: null,
            outputSnippet: 'tests/unit/test_schemas.py::test_producto_schema_valido PASSED\ntests/unit/test_schemas.py::test_precio_negativo_falla PASSED\ntests/unit/test_schemas.py::test_stock_entero_valido PASSED\n\n=== 3 passed in 0.05s ==='
        },
        {
            id: 'check-pytest-integration',
            name: 'PyTest + FastAPI TestClient: Integración HTTP',
            framework: 'FastAPI TestClient + SQLite in-memory',
            file: 'tests/integration/test_api_productos.py',
            phase: 'Fase 3: Capa de Integración',
            description: 'Peticiones HTTP reales (GET, POST, PUT) a endpoints REST con aislamiento de base de datos transaccional.',
            details: 'Integración HTTP y aislamiento de infraestructura con dobles de prueba.',
            simId: 'sim-doubles',
            simName: 'Dobles de Prueba',
            stationId: 'm-simuladores',
            tabId: 'tab-dev-order',
            passed: false,
            executedAt: null,
            outputSnippet: 'tests/integration/test_api_productos.py::test_crear_producto_201 PASSED\ntests/integration/test_api_productos.py::test_listar_productos_200 PASSED\ntests/integration/test_api_productos.py::test_producto_no_encontrado_404 PASSED\n\n=== 3 passed in 0.12s ==='
        },
        {
            id: 'check-bdd-behave',
            name: 'BDD: Especificación de Comportamiento con Gherkin',
            framework: 'Behave / Gherkin Syntax',
            file: 'features/inventario.feature',
            phase: 'Fase 4: Criterios de Aceptación',
            description: 'Escenarios Given-When-Then ejecutables para validar reglas de negocio en lenguaje ubicuo de usuario.',
            details: 'Especificación viva con Gherkin y escenarios ejecutables Given-When-Then.',
            simId: 'm-bdd',
            simName: 'Taller BDD',
            stationId: 'm-bdd',
            tabId: null,
            passed: false,
            executedAt: null,
            outputSnippet: 'Feature: Control de inventario y stock\n  Scenario: Registrar entrada de mercancia -> PASSED\n  Scenario: Descontar stock por venta exitosa -> PASSED\n  Scenario: Bloquear venta por stock insuficiente -> PASSED\n\n1 feature passed, 3 scenarios passed, 9 steps passed'
        },
        {
            id: 'check-jest-react',
            name: 'Jest / Vitest: Pruebas de Componentes UI en React',
            framework: 'Jest / Vitest + React Testing Library',
            file: 'tests/Contador.test.jsx',
            phase: 'Fase 5: Testing Frontend Declarativo',
            description: 'Renderizado de componentes, simulación de clics del usuario, hooks de estado y aserciones en el DOM.',
            details: 'Pruebas de renderizado, interacción y aserciones DOM en componentes React.',
            simId: 'm-jest-react',
            simName: 'Taller Jest React',
            stationId: 'm-jest-react',
            tabId: null,
            passed: false,
            executedAt: null,
            outputSnippet: 'PASS tests/Contador.test.jsx\n  ✓ renderiza el valor inicial en cero (18 ms)\n  ✓ incrementa el contador al hacer clic en + (32 ms)\n  ✓ deshabilita el boton cuando llega al stock maximo (14 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       3 passed, 3 total'
        },
        {
            id: 'check-junit-jsp',
            name: 'JUnit 5 + Mockito: Pruebas Backend Java / JSP',
            framework: 'JUnit Jupiter 5.10 + Mockito 5',
            file: 'tests/ProductoDAOTest.java',
            phase: 'Fase 5: Testing Backend Tipado',
            description: 'Pruebas de acceso a datos DAO utilizando dobles de prueba (Mocks) para aislar llamadas JDBC.',
            details: 'Pruebas DAO tipadas con JUnit 5 y simulación de base de datos con Mockito.',
            simId: 'm-junit-jsp',
            simName: 'Taller JUnit Java',
            stationId: 'm-junit-jsp',
            tabId: null,
            passed: false,
            executedAt: null,
            outputSnippet: '[INFO] Running com.sena.adso.dao.ProductoDAOTest\n[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.421 s\n[INFO] BUILD SUCCESS'
        },
        {
            id: 'check-playwright-e2e',
            name: 'Playwright: Automatización End-to-End en Navegador',
            framework: 'Playwright Chromium Headless',
            file: 'tests/e2e/inventario.spec.js',
            phase: 'Fase 6: Cúspide de la Pirámide E2E',
            description: 'Navegación completa de usuario, llenado de formularios, verificación de tablas y captura de video en fallas.',
            details: 'Automatización de navegación real de usuario con Playwright.',
            simId: 'sim-e2e',
            simName: 'Simulador E2E',
            stationId: 'm-simuladores',
            tabId: 'tab-dev-order',
            passed: false,
            executedAt: null,
            outputSnippet: 'Running 2 tests using 1 worker\n  ✓ [chromium] › inventario.spec.js:12:5 › flujo completo de registro y consulta de producto (1.4s)\n  ✓ [chromium] › inventario.spec.js:28:5 › validacion de alertas visuales ante datos invalidos (980ms)\n\n  2 passed (2.5s)'
        },
        {
            id: 'check-coverage-audit',
            name: 'Auditoría de cobertura con umbral contextual',
            framework: 'pytest-cov / coverage.py',
            file: 'recursos/codigo-ejemplo/htmlcov/',
            phase: 'Fase 7: Quality Gate de Cobertura',
            description: 'Inspección de cobertura de sentencias y ramas de ejecución con reporte de líneas faltantes.',
            details: 'Distribución y balance de cobertura de código según la pirámide de Cohn.',
            simId: 'sim-pyramid',
            simName: 'Pirámide de Pruebas',
            stationId: 'm-simuladores',
            tabId: 'tab-exec-order',
            passed: false,
            executedAt: null,
            outputSnippet: 'Name                           Stmts   Miss Branch BrPart  Cover   Missing\n--------------------------------------------------------------------------\nservices/calculos.py              24      1      8      1    92%\nrouters/productos.py              38      3     10      2    88%\nschemas/producto.py               16      0      0      0   100%\n--------------------------------------------------------------------------\nTOTAL                             78      4     18      3    91%\n\nRequired test coverage of 80.0% reached. Total coverage: 91.2%'
        },
        {
            id: 'check-cicd-pipeline',
            name: 'Pipeline CI/CD y Quality Gate en GitHub Actions',
            framework: 'GitHub Actions Runner / Workflows',
            file: '.github/workflows/ci.yml',
            phase: 'Fase 7: Integración y Despliegue Continuo',
            description: 'Ejecución orquestada y desatendida de linters, SAST, suite de pruebas y compilación de artefactos.',
            details: 'Ordenamiento de fases del pipeline CI/CD y gestión de compuertas de calidad.',
            simId: 'sim-sequencer',
            simName: 'Secuenciador CI/CD',
            stationId: 'm-simuladores',
            tabId: 'tab-exec-order',
            passed: false,
            executedAt: null,
            outputSnippet: 'Job: ci-quality-gate\n  ✓ Set up Python 3.11 (4s)\n  ✓ Install dependencies (12s)\n  ✓ Run PyTest suite with coverage (8s)\n  ✓ Run Flake8 & Bandit Security Scan (3s)\n  ✓ Check the project quality gate (1s)\nConclusion: success (All configured checks passed)'
        }
    ];

    // Catálogo maestro de los simuladores interactivos QA
    const DEFAULT_SIMULATORS = {
        'sim-bva': {
            id: 'sim-bva',
            name: 'Diseño de Casos: Partición de Equivalencia y Valores Límite (BVA)',
            completed: false,
            score: 0,
            maxScore: 6,
            percentage: 0,
            passed: false,
            details: 'Diseñar casos de prueba analizando clases válidas, inválidas y fronteras críticas (n-1, n, n+1).',
            completedAt: null
        },
        'sim-tdd': {
            id: 'sim-tdd',
            name: 'TDD Interactivo: Ciclo Rojo - Verde - Refactor',
            completed: false,
            score: 0,
            maxScore: 3,
            percentage: 0,
            passed: false,
            details: 'Experimentar en código vivo el flujo: fallo esperado (Rojo), código mínimo (Verde) y limpieza (Refactor).',
            completedAt: null
        },
        'sim-doubles': {
            id: 'sim-doubles',
            name: 'Aislamiento con Dobles de Prueba (Mocks, Stubs, Fakes, Spies)',
            completed: false,
            score: 0,
            maxScore: 4,
            percentage: 0,
            passed: false,
            details: 'Decidir la estrategia de sustitución para APIs externas, base de datos y servicios de notificación.',
            completedAt: null
        },
        'sim-triage': {
            id: 'sim-triage',
            name: 'Diagnóstico & Triage de Defectos (Bug Triage)',
            completed: false,
            score: 0,
            maxScore: 4,
            percentage: 0,
            passed: false,
            details: 'Clasificar la causa raíz de un fallo, severidad vs prioridad y formular el reporte de defecto.',
            completedAt: null
        },
        'sim-e2e': {
            id: 'sim-e2e',
            name: 'Recorrido E2E: del objetivo a la evidencia',
            completed: false,
            score: 0,
            maxScore: 1,
            percentage: 0,
            passed: false,
            details: 'Reconocer navegador, localizador, acción, sistema y aserción en un flujo completo.',
            completedAt: null
        },
        'sim-pyramid': {
            id: 'sim-pyramid',
            name: 'Test Pyramid Builder (Pirámide de Cohn)',
            completed: false,
            score: 0,
            maxScore: 50,
            percentage: 0,
            passed: false,
            details: 'Relacionar unidad, integración y E2E con su costo, alcance y tipo de evidencia.',
            completedAt: null
        },
        'sim-assertion': {
            id: 'sim-assertion',
            name: 'Assertion Validator (Validación de Aserciones)',
            completed: false,
            score: 0,
            maxScore: 8,
            percentage: 0,
            passed: false,
            details: 'Predecir el resultado booleano de 8 aserciones críticas en Python y JavaScript.',
            completedAt: null
        },
        'sim-quiz': {
            id: 'sim-quiz',
            name: 'Quiz de fundamentos técnicos de QA',
            completed: false,
            score: 0,
            maxScore: 8,
            percentage: 0,
            passed: false,
            details: 'Evaluación de conceptos: Pirámide de pruebas, TDD, herramientas de cobertura, BDD y Mocking.',
            completedAt: null
        },
        'sim-sequencer': {
            id: 'sim-sequencer',
            name: 'Secuenciador de Fases del Pipeline Maestro',
            completed: false,
            score: 0,
            maxScore: 7,
            percentage: 0,
            passed: false,
            details: 'Ordenar las 7 fases lógicas del flujo maestro de testing desde pruebas unitarias hasta CI/CD.',
            completedAt: null
        },
        'sim-diseno': {
            id: 'sim-diseno',
            name: 'Diseño de Casos Guiado: 10 Decisiones sobre la Regla de Préstamos',
            completed: false,
            score: 0,
            maxScore: 10,
            percentage: 0,
            passed: false,
            details: 'Decidir particiones, límites y oráculos sobre la regla de préstamos con la razón de cada respuesta. Se aprueba con al menos 70% de aciertos.',
            completedAt: null
        },
        'sim-module-decisions': {
            id: 'sim-module-decisions',
            name: 'Decisiones QA por módulo',
            completed: false,
            score: 0,
            maxScore: 1,
            percentage: 0,
            passed: false,
            details: 'Resolver una decisión de calidad en los módulos y explicar la evidencia que respalda el siguiente paso.',
            completedAt: null
        },
        'sim-module-special': {
            id: 'sim-module-special',
            name: 'Micro-laboratorios por módulo',
            completed: false,
            score: 0,
            maxScore: 1,
            percentage: 0,
            passed: false,
            details: 'Resolver una interacción específica del módulo: riesgo, secuencia, contrato, señal o evidencia.',
            completedAt: null
        },
        'sim-ai-guided-practice': {
            id: 'sim-ai-guided-practice',
            name: 'Práctica humano–IA por módulo',
            completed: false,
            score: 0,
            maxScore: 1,
            percentage: 0,
            passed: false,
            details: 'Verificar una propuesta de IA y registrar una decisión humana explicable.',
            completedAt: null
        }
    };

    const listeners = new Set();

    const TestingSession = {
        /**
         * Inicializa la sesión cargando datos persistidos o inicializando los predeterminados.
         */
        init() {
            this.ensureStorage();
        },

        ensureStorage() {
            if (!localStorage.getItem(STORAGE_KEYS.TEST_CHECKS)) {
                localStorage.setItem(STORAGE_KEYS.TEST_CHECKS, JSON.stringify(DEFAULT_TEST_CHECKS));
            }
            const rawSimulators = localStorage.getItem(STORAGE_KEYS.SIMULATORS);
            if (!rawSimulators) {
                localStorage.setItem(STORAGE_KEYS.SIMULATORS, JSON.stringify(DEFAULT_SIMULATORS));
                return;
            }

            // Las guías ya abiertas pueden tener el catálogo anterior. Agregar
            // solo claves ausentes conserva el progreso que el aprendiz ya ganó.
            try {
                const simulators = JSON.parse(rawSimulators);
                let changed = false;
                Object.entries(DEFAULT_SIMULATORS).forEach(([simId, definition]) => {
                    if (!simulators[simId]) {
                        simulators[simId] = Object.assign({}, definition);
                        changed = true;
                    }
                });
                if (changed) {
                    localStorage.setItem(STORAGE_KEYS.SIMULATORS, JSON.stringify(simulators));
                }
            } catch (error) {
                console.warn('No se pudo leer el catálogo local de simuladores; se restaurará el catálogo base.', error);
                localStorage.setItem(STORAGE_KEYS.SIMULATORS, JSON.stringify(DEFAULT_SIMULATORS));
            }
            try {
                const rawChecks = localStorage.getItem(STORAGE_KEYS.TEST_CHECKS);
                if (rawChecks) {
                    const checks = JSON.parse(rawChecks);
                    let changed = false;
                    checks.forEach(c => {
                        const def = DEFAULT_TEST_CHECKS.find(d => d.id === c.id);
                        if (def && (!c.simId || !c.simName || !c.stationId)) {
                            c.simId = def.simId;
                            c.simName = def.simName;
                            c.stationId = def.stationId;
                            c.tabId = def.tabId;
                            c.details = def.details;
                            changed = true;
                        }
                    });
                    if (changed) localStorage.setItem(STORAGE_KEYS.TEST_CHECKS, JSON.stringify(checks));
                }
            } catch (e) {}
        },

        /**
         * Suscribe observadores para re-renderizado en tiempo real.
         */
        subscribe(callback) {
            listeners.add(callback);
            return () => listeners.delete(callback);
        },

        notify() {
            listeners.forEach(cb => {
                try { cb(this.calculateProgress()); } catch (e) { console.error('Listener error in TestingSession', e); }
            });
        },

        /**
         * Lee el perfil del aprendiz.
         */
        getProfile() {
            try {
                const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
                if (data) return JSON.parse(data);
            } catch (e) {}
            return {
                name: 'APRENDIZ ADSO',
                docNumber: '',
                ficha: '<NÚMERO_DE_FICHA>',
                centro: 'Por diligenciar',
                regional: 'Por diligenciar',
                instructor: 'Por diligenciar',
                project: 'Proyecto de práctica del aprendiz',
                date: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
            };
        },

        /**
         * Actualiza y guarda el perfil del aprendiz.
         */
        saveProfile(profileData, notifyObservers = true) {
            const current = this.getProfile();
            const updated = Object.assign({}, current, profileData);
            localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
            // Sincronizar también con la clave esperada por DevBrainEvidence si existe
            try {
                localStorage.setItem('guia_testing_apprentice_profile', JSON.stringify(updated));
            } catch (e) {}
            if (notifyObservers) this.notify();
            return updated;
        },

        /**
         * Evalúa dinámicamente si un check se encuentra verificado según el trabajo real del aprendiz
         * en los simuladores interactivos y talleres prácticos de la plataforma.
         */
        evaluateCheckRealStatus(check, sims, modulesCompleted) {
            const c = Object.assign({}, check);
            const isManualPassed = c.manualOverride === true && c.passed;

            switch (c.id) {
                case 'check-pytest-unit': {
                    const simAssert = sims['sim-assertion'];
                    const simBva = sims['sim-bva'];
                    const pass = (simAssert && simAssert.passed) || (simBva && simBva.passed) || modulesCompleted.includes('m-pytest-fastapi') || modulesCompleted.includes('m-pytest-flask') || isManualPassed;
                    c.passed = !!pass;
                    if (simAssert && simAssert.passed) {
                        c.actualMetric = `${simAssert.score}/${simAssert.maxScore} aserciones acertadas (${simAssert.percentage}%)`;
                        c.executedAt = simAssert.completedAt || c.executedAt;
                    } else if (simBva && simBva.passed) {
                        c.actualMetric = `Fronteras BVA superadas (${simBva.score}/${simBva.maxScore})`;
                        c.executedAt = simBva.completedAt || c.executedAt;
                    } else if (modulesCompleted.includes('m-pytest-fastapi') || modulesCompleted.includes('m-pytest-flask')) {
                        c.actualMetric = 'Módulo PyTest verificado en la plataforma';
                    } else if (isManualPassed) {
                        c.actualMetric = 'Verificado en sesión de laboratorio';
                    } else {
                        c.actualMetric = 'Requiere validar aserciones en el simulador (mín. 70%)';
                    }
                    break;
                }
                case 'check-tdd-cycle': {
                    const simTdd = sims['sim-tdd'];
                    const pass = (simTdd && simTdd.passed) || modulesCompleted.includes('m-tdd') || isManualPassed;
                    c.passed = !!pass;
                    if (simTdd && simTdd.passed) {
                        c.actualMetric = `Ciclo Rojo-Verde-Refactor superado (${simTdd.score}/${simTdd.maxScore} fases)`;
                        c.executedAt = simTdd.completedAt || c.executedAt;
                    } else if (modulesCompleted.includes('m-tdd')) {
                        c.actualMetric = 'Módulo TDD completado';
                    } else if (isManualPassed) {
                        c.actualMetric = 'Ciclo TDD verificado';
                    } else {
                        c.actualMetric = 'Requiere resolver el ciclo en el simulador TDD';
                    }
                    break;
                }
                case 'check-pytest-integration': {
                    const simDoubles = sims['sim-doubles'];
                    const pass = (simDoubles && simDoubles.passed) || modulesCompleted.includes('m-pytest-fastapi') || isManualPassed;
                    c.passed = !!pass;
                    if (simDoubles && simDoubles.passed) {
                        c.actualMetric = `Dobles de prueba: ${simDoubles.score}/${simDoubles.maxScore} resueltos (${simDoubles.percentage}%)`;
                        c.executedAt = simDoubles.completedAt || c.executedAt;
                    } else if (modulesCompleted.includes('m-pytest-fastapi')) {
                        c.actualMetric = 'Módulo FastAPI integración completado';
                    } else if (isManualPassed) {
                        c.actualMetric = 'Integración HTTP verificada';
                    } else {
                        c.actualMetric = 'Requiere resolver simulación de dobles (Mocks/Stubs)';
                    }
                    break;
                }
                case 'check-bdd-behave': {
                    const simDiseno = sims['sim-diseno'];
                    const pass = modulesCompleted.includes('m-bdd') || (simDiseno && simDiseno.passed) || isManualPassed;
                    c.passed = !!pass;
                    if (modulesCompleted.includes('m-bdd')) {
                        c.actualMetric = 'Especificación viva y pasos Behave completados';
                    } else if (simDiseno && simDiseno.passed) {
                        c.actualMetric = `Diseño de reglas: ${simDiseno.score}/${simDiseno.maxScore} aciertos (${simDiseno.percentage}%)`;
                        c.executedAt = simDiseno.completedAt || c.executedAt;
                    } else if (isManualPassed) {
                        c.actualMetric = 'Criterios Gherkin / BDD validados';
                    } else {
                        c.actualMetric = 'Requiere completar el taller de especificación BDD';
                    }
                    break;
                }
                case 'check-jest-react': {
                    const pass = modulesCompleted.includes('m-jest-react') || isManualPassed;
                    c.passed = !!pass;
                    c.actualMetric = pass ? 'Suite de componentes React verificada' : 'Requiere completar el taller de pruebas en React';
                    break;
                }
                case 'check-junit-jsp': {
                    const simDoubles = sims['sim-doubles'];
                    const pass = modulesCompleted.includes('m-junit-jsp') || (simDoubles && simDoubles.passed) || isManualPassed;
                    c.passed = !!pass;
                    if (modulesCompleted.includes('m-junit-jsp')) {
                        c.actualMetric = 'Pruebas DAO JUnit 5 + Mockito completadas';
                    } else if (simDoubles && simDoubles.passed) {
                        c.actualMetric = 'Aislamiento DAO verificado en dobles de prueba';
                    } else if (isManualPassed) {
                        c.actualMetric = 'Pruebas backend Java/JSP verificadas';
                    } else {
                        c.actualMetric = 'Requiere completar el taller JUnit 5 con Mockito';
                    }
                    break;
                }
                case 'check-playwright-e2e': {
                    const simE2E = sims['sim-e2e'];
                    const pass = (simE2E && simE2E.passed) || modulesCompleted.includes('m-playwright') || isManualPassed;
                    c.passed = !!pass;
                    if (simE2E && simE2E.passed) {
                        c.actualMetric = 'Recorrido E2E validado en simulador';
                        c.executedAt = simE2E.completedAt || c.executedAt;
                    } else if (modulesCompleted.includes('m-playwright')) {
                        c.actualMetric = 'Módulo Playwright E2E completado';
                    } else if (isManualPassed) {
                        c.actualMetric = 'Flujo E2E Playwright verificado';
                    } else {
                        c.actualMetric = 'Requiere ejecutar el simulador de recorrido E2E';
                    }
                    break;
                }
                case 'check-coverage-audit': {
                    const simPyr = sims['sim-pyramid'];
                    const pass = (simPyr && simPyr.passed) || modulesCompleted.includes('m-cobertura') || isManualPassed;
                    c.passed = !!pass;
                    if (simPyr && simPyr.passed) {
                        c.actualMetric = 'Pirámide y balance de cobertura validados';
                        c.executedAt = simPyr.completedAt || c.executedAt;
                    } else if (modulesCompleted.includes('m-cobertura')) {
                        c.actualMetric = 'Auditoría de cobertura completada';
                    } else if (isManualPassed) {
                        c.actualMetric = 'Umbral de cobertura >= 80% alcanzado';
                    } else {
                        c.actualMetric = 'Requiere resolver pirámide o taller cobertura';
                    }
                    break;
                }
                case 'check-cicd-pipeline': {
                    const simSeq = sims['sim-sequencer'];
                    const simTriage = sims['sim-triage'];
                    const pass = (simSeq && simSeq.passed) || (simTriage && simTriage.passed) || modulesCompleted.includes('m-cicd') || isManualPassed;
                    c.passed = !!pass;
                    if (simSeq && simSeq.passed) {
                        c.actualMetric = `Pipeline secuenciado (${simSeq.score}/${simSeq.maxScore} fases, 100%)`;
                        c.executedAt = simSeq.completedAt || c.executedAt;
                    } else if (simTriage && simTriage.passed) {
                        c.actualMetric = 'Triage de defecto en CI completado';
                        c.executedAt = simTriage.completedAt || c.executedAt;
                    } else if (modulesCompleted.includes('m-cicd')) {
                        c.actualMetric = 'Workflow CI/CD completado';
                    } else if (isManualPassed) {
                        c.actualMetric = 'Quality Gate en pipeline verificado';
                    } else {
                        c.actualMetric = 'Requiere ordenar fases en el secuenciador CI/CD';
                    }
                    break;
                }
                default:
                    c.actualMetric = c.details || 'Verificación automatizada';
                    break;
            }
            return c;
        },

        /**
         * Obtiene todos los checks de prueba evaluados dinámicamente según la evidencia real del aprendiz.
         */
        getTestChecks() {
            let baseChecks = DEFAULT_TEST_CHECKS.map(c => Object.assign({}, c));
            try {
                const raw = localStorage.getItem(STORAGE_KEYS.TEST_CHECKS);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    baseChecks = baseChecks.map(base => {
                        const existing = parsed.find(p => p.id === base.id);
                        return existing ? Object.assign({}, base, existing) : base;
                    });
                }
            } catch (e) {}

            const sims = this.getSimulators();
            const modulesCompleted = (window.GAMIFICATION && window.GAMIFICATION.completed) || [];

            return baseChecks.map(check => this.evaluateCheckRealStatus(check, sims, modulesCompleted));
        },

        /**
         * Sincroniza y persiste el estado evaluado en localStorage.
         */
        syncTestChecksWithExercises() {
            const evaluated = this.getTestChecks();
            try {
                localStorage.setItem(STORAGE_KEYS.TEST_CHECKS, JSON.stringify(evaluated));
            } catch (e) {}
            return evaluated;
        },

        /**
         * Marca un check de prueba como ejecutado/aprobado (soporte de laboratorio y compatibilidad).
         */
        toggleTestCheck(checkId, passed = true, customOutput = null) {
            const checks = this.getTestChecks();
            const target = checks.find(c => c.id === checkId);
            if (target) {
                target.passed = passed;
                target.manualOverride = passed;
                target.executedAt = passed ? new Date().toISOString() : null;
                if (customOutput) target.outputSnippet = customOutput;
                localStorage.setItem(STORAGE_KEYS.TEST_CHECKS, JSON.stringify(checks));
                if (passed && window.GAMIFICATION && typeof window.GAMIFICATION.addXP === 'function') {
                    window.GAMIFICATION.addXP(40, `Check verificado: ${target.name}`);
                }
                this.notify();
            }
            return checks;
        },

        /**
         * Marca todos los checks como aprobados (ideal para auditoría rápida o simulación completa de CI).
         */
        runAllTestChecks() {
            const checks = this.getTestChecks();
            const now = new Date().toISOString();
            checks.forEach(c => {
                c.passed = true;
                c.executedAt = now;
            });
            localStorage.setItem(STORAGE_KEYS.TEST_CHECKS, JSON.stringify(checks));
            if (window.GAMIFICATION && typeof window.GAMIFICATION.addXP === 'function') {
                window.GAMIFICATION.addXP(150, "Suite completa de pruebas ejecutada con éxito");
            }
            this.notify();
            return checks;
        },

        /**
         * Reinicia los checks de pruebas.
         */
        resetTestChecks() {
            localStorage.setItem(STORAGE_KEYS.TEST_CHECKS, JSON.stringify(DEFAULT_TEST_CHECKS));
            this.notify();
            return DEFAULT_TEST_CHECKS;
        },

        /**
         * Obtiene el estado de todos los simuladores.
         */
        getSimulators() {
            try {
                const raw = localStorage.getItem(STORAGE_KEYS.SIMULATORS);
                if (raw) return JSON.parse(raw);
            } catch (e) {}
            return Object.assign({}, DEFAULT_SIMULATORS);
        },

        /**
         * Registra el resultado real de un simulador cuando el aprendiz interactúa con él.
         */
        recordSimulator(simId, score, maxScore, customDetails = null) {
            const sims = this.getSimulators();
            if (!sims[simId]) return;

            const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
            // Para pasar se requiere al menos 70% de aciertos
            const passed = pct >= 70;

            sims[simId].completed = true;
            sims[simId].score = score;
            sims[simId].maxScore = maxScore;
            sims[simId].percentage = pct;
            sims[simId].passed = passed;
            sims[simId].completedAt = new Date().toISOString();
            if (customDetails) sims[simId].details = customDetails;

            localStorage.setItem(STORAGE_KEYS.SIMULATORS, JSON.stringify(sims));
            this.syncTestChecksWithExercises();
            this.notify();
            return sims[simId];
        },

        /**
         * Obtiene el avance de los módulos de la guía.
         */
        getModulesProgress() {
            const completed = (window.GAMIFICATION && window.GAMIFICATION.completed) || [];
            const totalModules = (window.MODULES && Object.keys(window.MODULES).length) || 16;
            const pct = totalModules > 0 ? Math.round((completed.length / totalModules) * 100) : 0;
            return {
                completed: completed.length,
                total: totalModules,
                percentage: pct
            };
        },

        /**
         * Obtiene el estado de las 3 evidencias definidas en el registro local.
         */
        getDeliverablesProgress() {
            let readyCount = 0;
            const total = 3;
            const artifacts = [
                { id: 'ART-TEST-01', code: 'TEST-EV01', name: 'Plan de Pruebas (IEEE 829)' },
                { id: 'ART-TEST-02', code: 'TEST-EV02', name: 'Suite Automatizada con Cobertura' },
                { id: 'ART-TEST-03', code: 'TEST-EV03', name: 'Playwright E2E & Bug Tracker' }
            ];

            // Revisar si existe store local de DevBrainEvidence
            const prefijo = 'guia_testing';
            artifacts.forEach(art => {
                try {
                    const data = localStorage.getItem(`${prefijo}_evidencia_${art.id}`);
                    if (data) {
                        const parsed = JSON.parse(data);
                        if (parsed && (parsed.estado === 'lista' || parsed.status === 'lista')) readyCount++;
                    }
                } catch (e) {}
            });

            return {
                ready: readyCount,
                total,
                percentage: Math.round((readyCount / total) * 100),
                artifacts
            };
        },

        /**
         * Cálculo ponderado del avance local de aprendizaje.
         * Ponderación:
         * - Módulos teóricos estudiados: 20%
         * - Simuladores interactivos resueltos: 30%
         * - Checks de pruebas automatizadas: 30%
         * - Entregables de calidad registrados localmente: 20%
         */
        calculateProgress() {
            const modules = this.getModulesProgress();
            const checks = this.getTestChecks();
            const passedChecks = checks.filter(c => c.passed).length;
            const checksPct = Math.round((passedChecks / checks.length) * 100);

            const sims = this.getSimulators();
            const simList = Object.values(sims);
            const passedSims = simList.filter(s => s.passed).length;
            const completedSims = simList.filter(s => s.completed).length;
            
            // Promedio ponderado de puntuación de simuladores
            let simScoreSum = 0;
            simList.forEach(s => {
                simScoreSum += (s.percentage || 0);
            });
            const simsAvgPct = Math.round(simScoreSum / simList.length);

            const deliverables = this.getDeliverablesProgress();

            // Ponderación exacta (100% total)
            const weightedScore = Math.round(
                (modules.percentage * 0.20) +
                (simsAvgPct * 0.30) +
                (checksPct * 0.30) +
                (deliverables.percentage * 0.20)
            );

            // Regla orientativa del simulador; el instructor define el juicio final.
            const isApproved = weightedScore >= 70 && passedChecks >= 5 && passedSims >= 2;

            let verdict = 'PENDIENTE / EN FORMACIÓN';
            let verdictBadgeClass = 'badge--pending';
            let verdictDescription = 'El aprendiz aún no alcanza los umbrales mínimos de cobertura y práctica.';

            if (isApproved) {
                verdict = 'LOGRO ORIENTATIVO';
                verdictBadgeClass = 'badge--success';
                verdictDescription = 'El avance local alcanza la regla orientativa del simulador. Presenta tus evidencias al instructor para la valoración correspondiente.';
            } else if (weightedScore >= 40) {
                verdict = 'AVANCE EN PROCESO';
                verdictBadgeClass = 'badge--warning';
                verdictDescription = 'Avance significativo. Completa los simuladores pendientes y ejecuta las suites de prueba para fortalecer tus evidencias.';
            }

            return {
                weightedScore,
                isApproved,
                verdict,
                verdictBadgeClass,
                verdictDescription,
                components: {
                    modules: {
                        completed: modules.completed,
                        total: modules.total,
                        percentage: modules.percentage,
                        weight: '20%'
                    },
                    simulators: {
                        completed: completedSims,
                        passed: passedSims,
                        total: simList.length,
                        avgPercentage: simsAvgPct,
                        weight: '30%',
                        items: sims
                    },
                    testChecks: {
                        passed: passedChecks,
                        total: checks.length,
                        percentage: checksPct,
                        weight: '30%',
                        items: checks
                    },
                    deliverables: {
                        ready: deliverables.ready,
                        total: deliverables.total,
                        percentage: deliverables.percentage,
                        weight: '20%'
                    }
                },
                timestamp: new Date().toISOString()
            };
        },

        getSignature() {
            try {
                return localStorage.getItem(STORAGE_KEYS.SIGNATURE) || localStorage.getItem('sena_apprentice_signature') || '';
            } catch (e) {}
            return '';
        },

        saveSignature(dataUrl) {
            try {
                if (dataUrl) {
                    localStorage.setItem(STORAGE_KEYS.SIGNATURE, dataUrl);
                    localStorage.setItem('sena_apprentice_signature', dataUrl);
                } else {
                    localStorage.removeItem(STORAGE_KEYS.SIGNATURE);
                    localStorage.removeItem('sena_apprentice_signature');
                }
            } catch (e) {}
            this.notify();
            return dataUrl;
        },

        exportFullSessionBackup() {
            const profile = this.getProfile();
            const signature = this.getSignature();
            const checks = this.getTestChecks();
            const simulators = this.getSimulators();
            const progress = this.calculateProgress();

            const deliverables = {};
            ['ART-TEST-01', 'ART-TEST-02', 'ART-TEST-03'].forEach(id => {
                try {
                    const raw = localStorage.getItem(`guia_testing_evidencia_${id}`);
                    if (raw) deliverables[id] = JSON.parse(raw);
                } catch (e) {}
            });

            let gamification = {};
            try {
                const rawG = localStorage.getItem('guia_testing_gamification') || localStorage.getItem('gamification');
                if (rawG) gamification = JSON.parse(rawG);
            } catch (e) {}

            let aiLog = [];
            try {
                const rawLog = localStorage.getItem('guia_testing_ai_log');
                if (rawLog) aiLog = JSON.parse(rawLog);
            } catch (e) {}

            return {
                standard: 'devbrain.educational-guide.session-backup',
                version: '3.7.0',
                exportedAt: new Date().toISOString(),
                guideId: 'adso-testing-qa-calidad-2026',
                apprentice: profile,
                signature,
                simulators,
                testChecks: checks,
                deliverables,
                gamification,
                aiLog,
                progressSnapshot: progress
            };
        },

        importFullSessionBackup(backupData) {
            if (!backupData || typeof backupData !== 'object') {
                throw new Error('Archivo de respaldo no válido.');
            }
            if (backupData.apprentice && typeof backupData.apprentice === 'object') {
                this.saveProfile(backupData.apprentice);
            }
            if (backupData.signature !== undefined) {
                this.saveSignature(backupData.signature);
            }
            if (backupData.simulators && typeof backupData.simulators === 'object') {
                localStorage.setItem(STORAGE_KEYS.SIMULATORS, JSON.stringify(backupData.simulators));
            }
            if (backupData.testChecks && Array.isArray(backupData.testChecks)) {
                localStorage.setItem(STORAGE_KEYS.TEST_CHECKS, JSON.stringify(backupData.testChecks));
            }
            if (backupData.deliverables && typeof backupData.deliverables === 'object') {
                Object.entries(backupData.deliverables).forEach(([id, val]) => {
                    try {
                        localStorage.setItem(`guia_testing_evidencia_${id}`, JSON.stringify(val));
                    } catch (_) {}
                });
            }
            if (backupData.gamification && typeof backupData.gamification === 'object') {
                try {
                    localStorage.setItem('guia_testing_gamification', JSON.stringify(backupData.gamification));
                    localStorage.setItem('gamification', JSON.stringify(backupData.gamification));
                } catch (_) {}
                if (window.GAMIFICATION && typeof window.GAMIFICATION.load === 'function') {
                    window.GAMIFICATION.load();
                }
            }
            if (backupData.aiLog && Array.isArray(backupData.aiLog)) {
                try {
                    localStorage.setItem('guia_testing_ai_log', JSON.stringify(backupData.aiLog));
                } catch (_) {}
            }
            this.notify();
            return true;
        }
    };

    TestingSession.init();
    global.TestingSession = TestingSession;

})(typeof window !== 'undefined' ? window : this);
