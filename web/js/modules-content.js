const MODULES = {
    "m-reflexion": {
        title: "Reflexión inicial: el costo de un defecto no detectado",
        badge: "Estación 1/18 · Propósito",
        intro: "Antes de escribir una prueba, identifica qué daño quieres evitar y qué evidencia te permitiría decidir si el cambio es seguro.",
        blocks: [
            {
                type: "alert", variant: "warning",
                title: "Caso real: Knight Capital (1 de agosto de 2012)",
                body: "El 1 de agosto de 2012, un fallo de despliegue en Knight Capital provocó una actividad de negociación no deseada y pérdidas superiores a 440 millones de dólares. La investigación de la SEC describe controles de despliegue, revisión y límites de mercado insuficientes. Usa el caso para preguntar qué barreras habrían reducido el riesgo; no lo conviertas en la afirmación simplificada de que un único test habría evitado todo el incidente."
            },
            {
                type: "code", lang: "python", file: "knight_capital_bug.py",
                title: "Un ejemplo de control insuficiente",
                code: `# Pseudocódigo didáctico: no reproduce el sistema real de Knight Capital.
def perform_trades(market_data):
    # Un modo de prueba activado por error puede cambiar el comportamiento.
    if should_place_orders:  # <- Flag activado en produccion
        for i in range(1000):  # <- muchas ordenes no deseadas
            place_order(market_data.symbol, quantity=999)  # <- Cantidades absurdas
    # Codigo real
    execute_real_trade(market_data)

# LECCION: combina pruebas, revision, controles de despliegue,
# limites operativos y una respuesta que detenga la actividad anomala.`
            },
            {
                type: "alert", variant: "info",
                title: "Preguntas de reflexión (discútelas con tu equipo)",
                body: "1. ¿Cómo verificas que tu código funciona antes de subirlo? 2. ¿Cómo sabes que un cambio no rompió algo que funcionaba? 3. ¿Qué ocurre si la persona que escribió el código ya no está? 4. ¿Qué controles necesita un equipo para trabajar con confianza? 5. ¿Cuánto costaría un defecto en producción para tu proyecto?"
            },
            {
                type: "alert", variant: "success",
                title: "Lo que aprenderas en esta guia",
                body: "Al finalizar la ruta podrás convertir un requisito en casos de prueba, ejecutar una prueba manual y automatizada, interpretar un fallo, registrar un defecto, repetir tras la corrección y aplicar la técnica en PyTest, Jest/Vitest, JUnit o Playwright según tu aplicativo. Las herramientas son medios: la evidencia y el criterio son el centro."
            },
            {
                type: "timeline",
                title: "Historia: cómo nació la disciplina de las pruebas",
                items: [
                    { year: "1994", title: "SUnit — el patron xUnit", desc: "Kent Beck escribe SUnit en Smalltalk y define lo que hoy llamamos 'framework de pruebas': setup, una asercion por caso, y resultados en verde o rojo." },
                    { year: "1997", title: "JUnit lleva xUnit a Java", desc: "Beck junto a Erich Gamma portan la idea a Java. El modelo se convierte en el estandar que despues copiarian Python, PHP, Ruby y JavaScript." },
                    { year: "2003-2004", title: "pytest nace en Python", desc: "Holger Krekel publica 'py' (luego pytest): asserts naturales, fixtures por inyeccion y un modelo de plugins que lo convierte en el estandar de Python." },
                    { year: "2009", title: "La piramide toma forma", desc: "Mike Cohn populariza la pirámide de pruebas en 'Succeeding with Agile' y el testing se organiza alrededor de la velocidad y el costo." },
                    { year: "2012", title: "Knight Capital: controles de despliegue insuficientes", desc: "La SEC documenta una falla de despliegue y controles operativos insuficientes que causaron actividad no deseada. El caso sirve para estudiar capas de prevención y respuesta, no para atribuirlo a una sola causa." },
                    { year: "2017", title: "JUnit 5 y la modernizacion", desc: "JUnit 5 (Jupiter) renueva el estandar Java con extensiones, parametrizacion y display names, mientras el E2E se vuelve automatizable real con Selenium y Playwright." }
                ]
            }
        ]
    },

    "m-piramide": {
        title: "La pirámide de pruebas",
        badge: "Estación 2/18 · Pirámide",
        intro: "El modelo de Mike Cohn ayuda a conversar sobre costo, velocidad y alcance. No fija porcentajes universales: primero diseña casos a partir de una regla y después elige el nivel de prueba que aporta más información.",
        blocks: [
            {
                type: "alert", variant: "info",
                title: "Primero define el oráculo: qué significa que el resultado sea correcto",
                body: "Caso ficticio de esta guía: una persona puede solicitar entre 1 y 5 equipos disponibles y debe tener permiso. El oráculo es la regla que decide aceptar o rechazar la solicitud; la herramienta y el porcentaje de cobertura vienen después. Reemplaza la entidad, el rango y el rol por los de tu aplicativo cuando hagas la transferencia."
            },
            {
                type: "comparison",
                title: "Ejemplo resuelto: de una regla a seis casos de prueba",
                headers: ["ID", "Entrada", "Técnica", "Resultado esperado"],
                rows: [
                    ["CP-01", "Cantidad 0 + permiso", "Fuera del límite inferior", "Rechazar; no crear solicitud"],
                    ["CP-02", "Cantidad 1 + permiso", "Límite inferior válido", "Crear solicitud por una unidad"],
                    ["CP-03", "Cantidad 3 + permiso", "Representante de partición válida", "Crear solicitud por tres unidades"],
                    ["CP-04", "Cantidad 5 + permiso", "Límite superior válido", "Crear solicitud por cinco unidades"],
                    ["CP-05", "Cantidad 6 + permiso", "Fuera del límite superior", "Rechazar; no crear solicitud"],
                    ["CP-06", "Cantidad 1 + sin permiso", "Regla de autorización", "Denegar; no crear solicitud"]
                ]
            },
            {
                type: "steps",
                title: "Práctica guiada: ejecuta CP-05 y registra un defecto",
                intro: "Haz la prueba manual antes de escribir el test. La evidencia útil conserva lo esperado, lo observado y la decisión tomada.",
                steps: [
                    { number: 1, title: "Prepara el escenario", tag: "Entrada", desc: "Usa un usuario de prueba con permiso y una aplicación limpia. Anota versión, ambiente y disponibilidad inicial." },
                    { number: 2, title: "Ejecuta la cantidad 6", tag: "Actuar", desc: "Envía la solicitud con seis equipos y conserva la respuesta visible o el registro de la interfaz." },
                    { number: 3, title: "Compara con el oráculo", tag: "Comprobar", desc: "Si se creó la solicitud, el resultado observado contradice CP-05. No lo marques como aprobado porque la pantalla respondió 200." },
                    { number: 4, title: "Describe el defecto", tag: "Diagnóstico", desc: "Escribe pasos reproducibles, resultado esperado, resultado observado, severidad, prioridad y evidencia. Si falla la preparación, clasifícalo como problema de entorno." },
                    { number: 5, title: "Repite después de corregir", tag: "Regresión", desc: "Ejecuta CP-01 a CP-06 y registra qué cambió. Una corrección sin repetición no demuestra que el defecto quedó resuelto." }
                ]
            },
            {
                type: "alert", variant: "warning",
                title: "Ahora cambia el ejemplo",
                body: "Elige una regla de tu aplicativo. Escribe una partición válida, una inválida, dos valores frontera y una combinación de permiso o estado. Justifica por qué cada caso puede revelar un defecto. Si todavía no tienes aplicativo, usa el caso de préstamos y completa la plantilla de ART-TEST-01."
            },
            {
                type: "diagram", diagramType: "pyramid",
                title: "Pirámide de pruebas de Mike Cohn",
                body: "Base: pruebas rápidas y aisladas. Centro: interacción entre componentes y contratos. Punta: recorridos críticos completos. La mezcla se decide por riesgo, velocidad, costo de mantenimiento y confianza necesaria; 70/20/10 es una proporción ilustrativa, no una garantía."
            },
            {
                type: "mental-map",
                title: "Mapa visual: cada capa responde una pregunta distinta",
                body: "No subas a una prueba más costosa si una capa inferior puede darte la misma evidencia. La pregunta del riesgo orienta la herramienta.",
                center: "Evidencia útil",
                accessibleText: "La evidencia útil se divide en regla aislada, conexión entre componentes, recorrido del usuario y repetición automática.",
                nodes: [
                    { title: "Unitarias", detail: "¿La regla calcula bien?" },
                    { title: "Integración", detail: "¿Los componentes conversan?" },
                    { title: "E2E", detail: "¿La persona logra su objetivo?" },
                    { title: "CI/CD", detail: "¿Lo repetimos en cada cambio?" }
                ]
            },
            {
                type: "image",
                title: "Infografía Conceptual: La Pirámide de Pruebas y el Flujo CI/CD",
                src: "img/test-pyramid-pipeline.jpg",
                alt: "Infografía de la Pirámide de Pruebas con bases sólidas de pruebas unitarias, pruebas de integración y pruebas E2E culminando en un Quality Gate automatizado",
                caption: "Estrategia por niveles de prueba: La base sostiene pruebas unitarias ultrarrápidas y exhaustivas; el medio valida la integración real entre servicios y persistencia; y la cúspide protege flujos críticos de usuario (E2E). Todo el conjunto se valida automáticamente en el pipeline CI/CD antes de permitir el despliegue."
            },
            {
                type: "tools",
                title: "Qué necesitas para esta práctica",
                stack: [
                    {
                        icon: "⚡", name: "PyTest", tag: "Python",
                        role: "Framework de pruebas para Python: aserciones simples con assert, fixtures y parametrización.",
                        when: "Lógica de negocio y APIs (FastAPI, Flask). Suele aportar una base rápida y amplia; su peso depende del riesgo y la arquitectura."
                    },
                    {
                        icon: "⚛️", name: "Jest / Vitest", tag: "JavaScript",
                        role: "Corre tests de componentes React y logica JS; con Testing Library se prueba como usa el usuario.",
                        when: "Frontend moderno: componentes, hooks, utilidades puras y pruebas de integracion de UI."
                    },
                    {
                        icon: "☕", name: "JUnit 5 + Mockito", tag: "Java",
                        role: "JUnit ejecuta los tests; Mockito sustituye bases de datos y servicios externos por dobles en memoria.",
                        when: "Backend Java (Servlets, Spring Boot, DAOs): aislar la unidad y verificar sus interacciones."
                    },
                    {
                        icon: "🎬", name: "Playwright", tag: "E2E",
                        role: "Automatiza navegadores reales (Chromium, Firefox, WebKit): llenar, clicar, esperar y capturar evidencia.",
                        when: "Flujos críticos de usuario. Son más lentos y costosos; selecciona los que protegen riesgos importantes."
                    },
                    {
                        icon: "🚀", name: "GitHub Actions", tag: "CI/CD",
                        role: "Pipeline como codigo YAML: lint, tests, cobertura y despliegue en cada push.",
                        when: "Compuertas de calidad (Quality Gates) que impiden que el VPS reciba codigo sin pruebas verdes."
                    },
                    {
                        icon: "📊", name: "pytest-cov / JaCoCo", tag: "Cobertura",
                        role: "Miden las lineas y ramas ejecutadas por los tests y producen reportes con umbrales.",
                        when: "Verificar un umbral de cobertura acordado para el ejercicio y bloquear el avance si baja."
                    }
                ]
            },
            {
                type: "code", lang: "python", file: "estructura_tests.py",
                title: "Estructura recomendada de carpetas",
                code: `proyecto/
├── tests/
│   ├── unit/              # Referencia inicial; ajusta por riesgo (aisladas, rapidas)
│   │   ├── test_models.py
│   │   ├── test_services.py
│   │   └── test_utils.py
│   ├── integration/       # Integracion; cantidad segun contratos y riesgos
│   │   ├── test_api.py     # API + BD real o test-db
│   │   └── test_db.py
│   └── e2e/               # E2E; solo recorridos criticos (Playwright)
│       └── test_flujo_compra.py
├── src/
│   └── app/
├── pytest.ini
└── .github/workflows/`
            },
            {
                type: "comparison",
                title: "Unit vs Integration vs E2E (proporciones orientativas)",
                headers: ["Aspecto", "Unit", "Integration", "E2E"],
                rows: [
                    ["Velocidad", "ms (<10)", "segundos", "minutos"],
                    ["Costo", "Bajo", "Medio", "Alto"],
                    ["Cantidad", "Referencia histórica", "Referencia histórica", "Referencia histórica"],
                    ["Aislamiento", "Total (mocks)", "Parcial", "Ninguno"],
                    ["Confianza", "Baja", "Media", "Alta"],
                    ["Mantenibilidad", "Alta", "Media", "Baja"]
                ]
            },
            {
                type: "comparison",
                title: "Pruebas funcionales, de rendimiento y de servidor",
                headers: ["Tipo de Prueba", "Qué Evalúa", "Herramienta", "Métrica de Éxito"],
                rows: [
                    ["Funcional: Unitarias", "Lógica pura, cálculos, validaciones aisladas", "PyTest, Jest, JUnit 5", "Aserciones correctas y tiempo objetivo medido en tu entorno"],
                    ["Funcional: Integración", "Endpoints REST + Base de datos real", "TestClient, Testcontainers", "Status HTTP y persistencia correcta"],
                    ["Funcional: E2E", "Flujo crítico completo del usuario (UI)", "Playwright, Cypress", "Flujo sin errores visuales ni roturas"],
                    ["Servidor: Carga (Load)", "Comportamiento bajo tráfico normal esperado", "k6, Locust", "SLO/p95 y tasa de errores acordados para el ambiente"],
                    ["Servidor: Estrés (Stress)", "Punto de quiebre (Breaking Point) del VPS", "k6, Apache Bench", "Caracterizar saturación, errores y recuperación observados"],
                    ["Servidor: Pico (Spike)", "Saltos bruscos de usuarios definidos por la hipótesis", "k6 (stages ramping)", "Degradación y recuperación comparadas con el criterio acordado"],
                    ["Servidor: Resistencia (Soak)", "Carga continua durante el período acordado", "Locust, k6", "Tendencias estables de memoria, errores y descriptores"],
                    ["Despliegue: Humo (Smoke)", "Salud crítica post-despliegue en VPS", "curl, scripts bash", "Endpoints críticos responden según el contrato y la dependencia está disponible"]
                ]
            },
            {
                type: "glossary",
                title: "Glosario transversal: las palabras que conectan la guía",
                intro: "Cuando una palabra parezca abstracta, busca primero su idea sencilla, luego la analogía y finalmente el ejemplo.",
                entries: [
                    { term: "Unidad", alias: "unit test", meaning: "Parte pequeña y aislada del código, como una función o una clase.", analogy: "Revisar una sola pieza de una bicicleta antes de probar toda la bicicleta.", example: "calcular_descuento(100, 10) devuelve 90." },
                    { term: "Integración", alias: "integration test", meaning: "Prueba que dos o más componentes intercambian datos correctamente.", analogy: "Comprobar que el cajero, la caja y el recibo se pasan la información correcta.", example: "POST /productos guarda y devuelve el registro esperado." },
                    { term: "Mock", alias: "doble de prueba", meaning: "Sustituto controlado de una dependencia real, como un correo o una base de datos.", analogy: "Un teléfono de juguete que permite practicar la conversación sin llamar a nadie.", example: "Mockito verifica que el repositorio fue consultado." },
                    { term: "TDD", alias: "Test-Driven Development", meaning: "Ciclo en el que primero se escribe una prueba que falla, luego el código mínimo y después se mejora.", analogy: "Dibujar la ruta antes de construir la carretera y usarla para comprobar cada avance.", example: "Rojo → Verde → Refactor." },
                    { term: "BDD", alias: "Behavior-Driven Development", meaning: "Forma de describir comportamientos con ejemplos que negocio y técnica pueden leer.", analogy: "Un libreto común para que actores, director y público sepan qué debe suceder.", example: "Given una condición, When una acción, Then un resultado." },
                    { term: "Cobertura", alias: "coverage", meaning: "Medida de qué líneas o ramas fueron ejecutadas por las pruebas.", analogy: "Un mapa que marca calles recorridas; no confirma que la calle esté bien construida.", example: "pytest-cov reporta líneas y ramas no ejecutadas." },
                    { term: "Quality Gate", alias: "compuerta de calidad", meaning: "Regla que debe cumplirse antes de permitir una entrega o despliegue.", analogy: "La puerta de un peaje que solo se abre cuando el vehículo cumple las condiciones.", example: "El pipeline se detiene si la suite falla o la cobertura baja." },
                    { term: "CI/CD", alias: "integración y entrega continuas", meaning: "Automatización que construye, prueba y prepara entregas cada vez que cambia el código.", analogy: "Una banda de revisión que inspecciona cada paquete antes de enviarlo.", example: "GitHub Actions ejecuta la suite en cada pull request." },
                    { term: "Observabilidad", alias: "logs, métricas y trazas", meaning: "Capacidad de entender qué ocurre dentro de un sistema a partir de sus señales.", analogy: "El tablero, los testigos y la caja negra de un vehículo.", example: "Un log con request_id ayuda a seguir una falla." }
                ]
            },
            {
                type: "timeline",
                title: "Historia: la piramide y el modelo de calidad",
                items: [
                    { year: "1991", title: "ISO/IEC 9126 define la calidad de software", desc: "Primer estándar formal de calidad: funcionalidad, confiabilidad, usabilidad, eficiencia, mantenibilidad y portabilidad." },
                    { year: "1997-2002", title: "xUnit y TDD preparan el terreno", desc: "Los frameworks de pruebas permiten tests rápidos y baratos; Kent Beck formaliza TDD y los tests pasan a escribirse antes que el código." },
                    { year: "2009", title: "Mike Cohn populariza la pirámide", desc: "En 'Succeeding with Agile' recomienda muchas pruebas unitarias rápidas, pocas E2E lentas: automatizar la base, no la punta." },
                    { year: "2011", title: "ISO/IEC 25010 reemplaza a la 9126", desc: "El nuevo modelo define 8 características de calidad (seguridad, compatibilidad, mantenibilidad) y alinea las pruebas con el negocio." },
                    { year: "2012", title: "La pirámide invertida (Ice Cream Cone)", desc: "Alister Scott critica las suites que invierten la pirámide (mucho E2E, poco unit): las produce un CI sin cobertura de base." },
                    { year: "2021", title: "Test Honeycomb: adaptación a microservicios", desc: "Spotify propone el panal que explicita el rol del sistema de eventos y los contratos entre servicios, complementando la pirámide." }
                ]
            },
            {
                type: "steps",
                title: "Ruta de Ejecución Lógica del Aprendiz: Las 7 Fases para Probar Cualquier Proyecto",
                intro: "Sigue este orden como una ruta de aprendizaje, no como una ley universal. Empieza por el comportamiento y el riesgo; luego elige la prueba más pequeña que pueda darte evidencia útil. Las duraciones y proporciones cambian según el proyecto.",
                steps: [
                    {
                        number: 1,
                        title: "Fase 1: Preparación del Arnés de Pruebas (Test Harness Setup)",
                        tag: "Entorno & Configuración",
                        desc: "Crea el entorno virtual aislado, instala dependencias de testing (`pytest`, `vitest` o dependencias Maven), define el archivo de configuración (`pytest.ini`, `vitest.config.js` o `pom.xml`) y estructura las carpetas `tests/unit`, `tests/integration` y `tests/e2e`.",
                        command: "python -m venv venv; .\\venv\\Scripts\\activate; pip install pytest pytest-cov httpx",
                        tip: "Nunca instales librerías de pruebas globalmente en el sistema operativo. Usa siempre entornos virtuales o package.json locales para asegurar reproducibilidad en CI.",
                        pitfall: "Olvidar aislar el entorno produce que las pruebas pasen en tu máquina pero fallen en el servidor CI de GitHub Actions."
                    },
                    {
                        number: 2,
                        title: "Fase 2: Pruebas Unitarias de Dominio (base rápida)",
                        tag: "Lógica Pura & Algoritmos",
                        desc: "Escribe pruebas unitarias aisladas para funciones de cálculo, validaciones de esquemas Pydantic/JPA y reglas de negocio. Emplea mocks y stubs para aislar la base de datos y la red.",
                        command: "pytest tests/unit -v",
                        tip: "Aplica el patrón AAA (Arrange, Act, Assert). Acordar un tiempo objetivo ayuda a detectar I/O accidental, pero el umbral debe medirse en tu entorno y no se convierte en una garantía universal.",
                        pitfall: "Intentar conectar una base de datos real en un test unitario destruye la velocidad de la suite y añade dependencias frágiles."
                    },
                    {
                        number: 3,
                        title: "Fase 3: Pruebas de Integración y Contratos de API",
                        tag: "Endpoints & Persistencia",
                        desc: "Prueba los controladores y endpoints HTTP con clientes de prueba en memoria (TestClient / MockMvc / test_client). Conecta una base de datos de pruebas (SQLite en memoria o transacciones con rollback).",
                        command: "pytest tests/integration -v",
                        tip: "Valida tanto el código de estado (200, 201, 404, 422) como la estructura JSON de la respuesta y que la persistencia en base de datos ocurra efectivamente.",
                        pitfall: "No limpiar la base de datos entre pruebas causa que el resultado de un test dependa del orden de ejecución del anterior (tests acoplados)."
                    },
                    {
                        number: 4,
                        title: "Fase 4: Pruebas de Componentes Frontend (Testing Library)",
                        tag: "Interfaz & Accesibilidad",
                        desc: "Renderiza componentes en un DOM virtual simulado con jsdom. Simula clics, llenado de inputs y verifica que los estados visuales se actualicen correctamente usando consultas accesibles (`screen.getByRole`).",
                        command: "npm test",
                        tip: "Prueba el componente como lo usa una persona real: busca botones por su nombre visible y formularios por su etiqueta, no por clases CSS internas ni IDs ocultos.",
                        pitfall: "Probar el estado interno de React (`wrapper.state()`) en lugar del DOM visible hace que las pruebas se rompan cada vez que refactorizas el código."
                    },
                    {
                        number: 5,
                        title: "Fase 5: Pruebas End-to-End en Navegador Real (flujos críticos)",
                        tag: "Flujos Críticos Reales",
                        desc: "Automatiza con Playwright los caminos dorados (Happy Paths) indispensables del sistema: login de usuario, creación de registros en el inventario y verificación en la tabla principal.",
                        command: "npx playwright test",
                        tip: "Reserva las pruebas E2E exclusivamente para los flujos que generen pérdidas de dinero o bloqueo total si fallan. Son costosas de mantener y lentas de ejecutar.",
                        pitfall: "Llenar la suite con cientos de tests E2E para probar validaciones de campos; esas validaciones deben probarse en unitarias o integración."
                    },
                    {
                        number: 6,
                        title: "Fase 6: Medición de Cobertura y Auditoría Multidimensional",
                        tag: "Compuerta de Calidad",
                        desc: "Genera el reporte de cobertura de código (`pytest-cov`, `JaCoCo`, `c8`) y relaciona las líneas y ramas cubiertas con requisitos y riesgos. El umbral del ejercicio es una decisión didáctica; no demuestra por sí solo la calidad ni la seguridad.",
                        command: "pytest --cov=app --cov-report=term-missing --cov-fail-under=80",
                        tip: "Examina no solo las líneas ejecutadas sino también la cobertura de ramas (`branch coverage`) en condicionales if/else.",
                        pitfall: "Confiar ciegamente en un 100% de cobertura cuando los tests carecen de aserciones profundas, casos borde o comprobación de efectos secundarios."
                    },
                    {
                        number: 7,
                        title: "Fase 7: Automatización en CI/CD y Despliegue con Quality Gate",
                        tag: "Automatización & Entrega",
                        desc: "Configura el pipeline de GitHub Actions (`.github/workflows/ci.yml`). Cada commit dispara los tests; si alguno falla, la compuerta se cierra y el despliegue al servidor VPS se cancela de inmediato.",
                        command: "git push origin main",
                        tip: "Configura un smoke test post-despliegue con curl a `/health` en el VPS para verificar que el nuevo contenedor arrancó saludablemente.",
                        pitfall: "Hacer despliegues manuales por SSH o FTP sin pasar por un pipeline automatizado de pruebas."
                    }
                ]
            }
        ]
    },

    "m-pytest-fastapi": {
        title: "PyTest: prueba un microservicio FastAPI",
        badge: "Estación 6/18 · FastAPI",
        intro: "Prueba endpoints FastAPI sin levantar un servidor real: controla las dependencias, prepara datos aislados y relaciona cada respuesta con una regla.",
        blocks: [
            {
                type: "tools",
                title: "Qué necesitas para esta práctica",
                stack: [
                    {
                        icon: "⚡", name: "PyTest", tag: "Python",
                        role: "Framework de pruebas en Python: funciones test_*, asserts puros y parametrizacion. Sin estructura obligatoria.",
                        when: "Cualquier logica de negocio o API en Python: dominio, calculos y endpoints. Es la capa base de la piramide."
                    },
                    {
                        icon: "🌐", name: "TestClient", tag: "FastAPI",
                        role: "Cliente HTTP que ejecuta la app FastAPI en el mismo proceso, sin levantar servidor ni usar red.",
                        when: "Pruebas de integracion de endpoints: status codes, JSON, validaciones 422 y auth. Rapido y deterministico."
                    },
                    {
                        icon: "🔧", name: "Fixtures y dependency_overrides", tag: "pytest",
                        role: "Montaje/desmontaje automatico por test: base de datos aislada en memoria, sesion de prueba, tokens.",
                        when: "Cada vez que el test necesita un contexto real (DB, auth) sin contaminar a los demas tests."
                    }
                ]
            },
            {
                type: "diagram",
                diagramType: "architecture",
                title: "Diagrama Visual: Arquitectura de Pruebas en FastAPI con TestClient",
                nodes: [
                    { title: "⚡ PyTest Runner", detail: "Orquesta fixtures, aserciones y reportes de cobertura en milisegundos." },
                    { title: "🌐 TestClient (Starlette/HTTPX)", detail: "Ejecuta peticiones HTTP síncronas en memoria contra la app ASGI sin abrir puertos de red." },
                    { title: "🛡️ Validación Pydantic", detail: "Intercepta cargas inválidas o tipos incompatibles retornando 422 Unprocessable Entity." },
                    { title: "💾 SQLite en Memoria (Aislada)", detail: "Cada función de prueba crea y destruye su esquema con 'Base.metadata.drop_all'." }
                ],
                body: "TestClient se comunica directamente con la aplicación FastAPI en memoria. La base de datos SQLite se crea limpia por cada prueba mediante dependency_overrides, garantizando aislamiento total y cero contaminación cruzada."
            },
            {
                type: "case-study",
                title: "Caso Práctico Paso a Paso: Endpoint de Préstamos en FastAPI con TestClient",
                context: "Probar el endpoint 'POST /api/v1/prestamos/' verificando que cree la solicitud con código 201 y descuente stock, o devuelva 422 si la cantidad solicitada excede el límite de 5 equipos.",
                preconditions: [
                    "FastAPI app con schema Pydantic: 'cantidad: int = Field(ge=1, le=5)'.",
                    "Fixture 'client' con dependency_override sobre 'get_db' inyectando SQLite en memoria.",
                    "Estado inicial: 10 equipos registrados en la tabla de inventario."
                ],
                code: `from fastapi import status

def test_crear_prestamo_exitoso(client):
    # Caso válido: 3 laptops
    response = client.post("/api/v1/prestamos/", json={
        "aprendiz_id": 101,
        "cantidad": 3,
        "laboratorio": "Sistemas-A"
    })
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["cantidad"] == 3
    assert data["estado"] == "ACTIVO"
    assert "id" in data

def test_rechazar_prestamo_excedido(client):
    # Caso frontera superior inválida: 6 laptops
    response = client.post("/api/v1/prestamos/", json={
        "aprendiz_id": 101,
        "cantidad": 6,
        "laboratorio": "Sistemas-A"
    })
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    detalle = response.json()["detail"][0]
    assert "less_than_equal" in detalle["type"] or "le" in str(detalle)`,
                command: "pytest tests/test_prestamos_api.py -v",
                oracle: "Para cantidad 3 se debe recibir 201 Created y JSON persistido. Para cantidad 6 Pydantic debe interceptar antes de llegar a la base de datos y retornar 422.",
                expectedVsObserved: [
                    ["POST cantidad=3", "201 Created + JSON con ID", "Pasa en verde"],
                    ["POST cantidad=6", "422 Unprocessable Entity", "Fallo si devuelve 200/201 (defecto grave)"],
                    ["POST cantidad='tres'", "422 Validation Error", "Fallo si causa 500 Internal Error"]
                ],
                decision: "El uso de Pydantic combinado con TestClient previene que datos corruptos lleguen a la capa de persistencia. La prueba automatizada se integra al pipeline de CI como barrera bloqueante."
            },
            {
                type: "steps",
                title: "Paso a Paso del Aprendiz: De Cero a Pruebas Automatizadas en FastAPI",
                intro: "Guía práctica para instrumentar pruebas automáticas en cualquier API de FastAPI con base de datos SQLAlchemy.",
                steps: [
                    {
                        number: 1,
                        title: "Instalar dependencias y preparar el entorno",
                        tag: "Paso 1: Setup",
                        desc: "Activa el entorno virtual e instala PyTest, el cliente HTTP síncrono para TestClient (`httpx`) y la herramienta de cobertura.",
                        command: "pip install pytest pytest-cov httpx fastapi sqlalchemy pydantic",
                        tip: "`httpx` es requerido por FastAPI para que `TestClient` funcione sin necesidad de montar un servidor ASGI real en red.",
                        pitfall: "Usar `requests` directamente contra una URL remota en vez de `TestClient(app)`; la red vuelve las pruebas lentas y dependientes de conectividad."
                    },
                    {
                        number: 2,
                        title: "Configurar fixtures y base de datos aislada en conftest.py",
                        tag: "Paso 2: Aislamiento",
                        desc: "Crea el archivo `tests/conftest.py`. Configura un motor SQLite en memoria y usa `app.dependency_overrides[get_db]` para inyectar la sesión efímera en cada test.",
                        command: "mkdir -p tests; touch tests/conftest.py",
                        tip: "El generador con `yield` en la fixture permite ejecutar código de limpieza (`Base.metadata.drop_all()`) automáticamente al terminar cada prueba.",
                        pitfall: "Olvidar llamar a `app.dependency_overrides.clear()` al desmontar la fixture, provocando contaminación cruzada entre suites."
                    },
                    {
                        number: 3,
                        title: "Escribir el caso de prueba con patrón AAA",
                        tag: "Paso 3: Redacción",
                        desc: "Crea un archivo `tests/test_productos.py`. Recibe la fixture `client`, envía la petición HTTP y valida el status code junto con el payload JSON devuelto.",
                        command: "pytest tests/test_productos.py -v",
                        tip: "Valida siempre el caso positivo (201 Created), los casos borde (precio = 0 o negativo -> 422) y el no encontrado (404 Not Found).",
                        pitfall: "Validar únicamente que `response.status_code == 200` sin verificar que el cuerpo JSON traiga los datos correctos."
                    },
                    {
                        number: 4,
                        title: "Ejecutar la suite en terminal con banderas de diagnóstico",
                        tag: "Paso 4: Ejecución",
                        desc: "Ejecuta los tests usando banderas que te brinden visibilidad detallada: `-v` (verbose), `-s` (muestra prints de depuración) y `-x` (detiene la ejecución en el primer fallo).",
                        command: "pytest tests/ -v -s -x --tb=short",
                        tip: "La bandera `--tb=short` acorta los volcados de excepción para que encuentres el fallo en menos de 2 segundos.",
                        pitfall: "Ejecutar sin `-v` cuando hay 50 tests y no saber cuál es el que falló ni qué función lo contenía."
                    },
                    {
                        number: 5,
                        title: "Medir cobertura y depurar fallos de validación",
                        tag: "Paso 5: Calidad & Depuración",
                        desc: "Comprueba el porcentaje de líneas cubiertas y analiza el detalle de cualquier error 422 Unprocessable Entity revisando el JSON de `response.json()['detail']`.",
                        command: "pytest --cov=app --cov-report=term-missing",
                        tip: "Si un test de FastAPI falla con 422, imprime `response.json()` para ver el campo exacto que Pydantic rechazó.",
                        pitfall: "Ignorar los errores 422 asumiendo que son errores internos 500 del servidor."
                    }
                ]
            },
            {
                type: "code", lang: "python", file: "tests/conftest.py",
                title: "conftest.py - Fixtures compartidas (SSOT: Guia FastAPI)",
                code: `import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import app
from database import Base, get_db

# SQLite en memoria para tests (rapido, aislado)
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            db_session.close()
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()`
            },
            {
                type: "code", lang: "python", file: "tests/test_productos.py",
                title: "test_productos.py - CRUD completo del microservicio",
                code: `from fastapi import status

def test_crear_producto(client):
    response = client.post("/productos/", json={
        "nombre": "Laptop HP",
        "precio": 1500.00,
        "stock": 10,
        "categoria_id": 1
    })
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["nombre"] == "Laptop HP"
    assert data["precio"] == 1500.00
    assert "id" in data

def test_listar_productos_vacio(client):
    response = client.get("/productos/")
    assert response.status_code == 200
    assert response.json() == []

def test_obtener_producto_no_existente(client):
    response = client.get("/productos/9999")
    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_actualizar_producto(client):
    # Crear
    r = client.post("/productos/", json={"nombre": "Mouse", "precio": 25.0, "stock": 50})
    pid = r.json()["id"]
    # Actualizar
    response = client.put(f"/productos/{pid}", json={"nombre": "Mouse Logitech", "precio": 35.0})
    assert response.status_code == 200
    assert response.json()["nombre"] == "Mouse Logitech"

def test_soft_delete(client):
    r = client.post("/productos/", json={"nombre": "Teclado", "precio": 40.0, "stock": 5})
    pid = r.json()["id"]
    response = client.delete(f"/productos/{pid}")
    assert response.status_code == 204
    # Soft delete: sigue existiendo pero estado=False
    r_get = client.get(f"/productos/{pid}")
    assert r_get.status_code == 404  # No aparece en listado publico

def test_validacion_precio_negativo(client):
    response = client.post("/productos/", json={"nombre": "X", "precio": -10, "stock": 5})
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

def test_validacion_precio_cero(client):
    response = client.post("/productos/", json={"nombre": "X", "precio": 0, "stock": 5})
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY`
            },
            {
                type: "alert", variant: "info",
                title: "Ejecutar los tests",
                body: "cd recursos/codigo-ejemplo && pytest tests/test_productos.py -v --cov=main --cov-report=term-missing"
            },
            {
                type: "timeline",
                title: "Historia: pytest y el testing de APIs",
                items: [
                    { year: "2003", title: "Holger Krekel crea 'py'", desc: "Nace 'py.test' como proyecto personal: asserts descriptivos y colleccion automatica de funciones, sin clases ni setUp heredados de xUnit." },
                    { year: "2004-2008", title: "pytest se consolida", desc: "La comunidad Python lo adopta gracias a fixtures, marcas y plugins (pytest-django lo lleva a Django en 2013); su assert natural gana a unittest." },
                    { year: "2018", title: "FastAPI y TestClient: la prueba en el mismo proceso", desc: "FastAPI nace y hereda TestClient de Starlette: el endpoint se prueba sin servidor, la dependencia se reemplaza con override y la DB con SQLite en memoria." },
                    { year: "2018-2024", title: "pytest 7 y 8: el estandar de facto", desc: "Hoy pytest 8 es el runner más usado del ecosistema Python (FastAPI, NumPy, la mayoría de proyectos); `pytest --cov` forma parte del deploy." }
                ]
            }
        ]
    },

    "m-pytest-flask": {
        title: "PyTest: prueba una aplicación Flask",
        badge: "Estación 7/18 · Flask",
        intro: "Prueba las rutas de una aplicación Flask con SQLite en memoria. Necesitas el proyecto completo —run.py, requirements.txt, app/ y tests/test_routes.py— para ejecutar esta práctica.",
        blocks: [
            {
                type: "tools",
                title: "Qué necesitas para esta práctica",
                stack: [
                    {
                        icon: "⚡", name: "PyTest", tag: "Python",
                        role: "El mismo runner que FastAPI: funciones test_*, asserts y fixtures; en Flask orquesta el ciclo de la app en cada test.",
                        when: "HTTP, formularios, plantillas y seguridad del servidor (CSRF, sesiones, redirects)."
                    },
                    {
                        icon: "🌶️", name: "test_client() de Flask", tag: "Flask",
                        role: "Cliente de pruebas propio del framework: sin red, con app_context y TESTING=True para propagar errores.",
                        when: "Probar rutas, redirecciones, sesiones y contenido HTML renderizado (Jinja)."
                    },
                    {
                        icon: "💾", name: "SQLite en memoria", tag: "DB test",
                        role: "Base de datos efimera por test: create_all/drop_all garantizan un punto de partida limpio sin tocar la BD real.",
                        when: "Aislar el estado entre tests: registros, sesiones y operaciones de escritura."
                    }
                ]
            },
            {
                type: "diagram",
                diagramType: "architecture",
                title: "Diagrama Visual: Arquitectura de Pruebas en Flask con TestClient y Contexto",
                nodes: [
                    { title: "⚡ PyTest + Client", detail: "app.test_client() simula peticiones HTTP WSGI sin abrir sockets de red." },
                    { title: "🔄 Application Context", detail: "with app.app_context() inicializa sesiones, configs y extensiones globales." },
                    { title: "🌶️ Rutas & Jinja2", detail: "Procesa formularios, mensajes Flash y renderiza plantillas HTML en memoria." },
                    { title: "💾 SQLite en Memoria", detail: "db.create_all() al inicio y db.drop_all() al desmontar garantizan estado virgen." }
                ],
                body: "Flask ejecuta las solicitudes a través de Werkzeug TestClient en proceso. Las sesiones de usuario y los mensajes flash se verifican en la respuesta HTML o inspeccionando la sesión del cliente sin levantar un servidor real."
            },
            {
                type: "case-study",
                title: "Caso Práctico Paso a Paso: Formulario Web de Préstamos en Flask con Sesiones y Flash",
                context: "Probar la ruta 'POST /prestamos/solicitar' que recibe un formulario con aprendiz_id y cantidad. Si cantidad está entre 1 y 5 y hay stock, redirige a '/prestamos/mis-solicitudes' con mensaje flash 'Solicitud creada con éxito'. Si cantidad es 6 o menor a 1, recarga con advertencia de validación.",
                preconditions: [
                    "App Flask configurada con TESTING=True y SQLite en memoria (:memory:).",
                    "Sesión simulada de usuario autenticado como Aprendiz (aprendiz_id=202).",
                    "Inventario inicial con 10 laptops registradas en la base de datos de pruebas."
                ],
                code: `def test_solicitud_prestamo_exitosa_con_flash(client):
    # Act: Envío de formulario válido con follow_redirects para seguir el 302
    response = client.post("/prestamos/solicitar", data={
        "equipo_id": 1,
        "cantidad": 3
    }, follow_redirects=True)
    
    # Assert: Estado 200 tras redirección y presencia de mensaje flash en HTML
    assert response.status_code == 200
    assert b"Solicitud creada con exito" in response.data
    assert b"Laptops solicitadas: 3" in response.data

def test_solicitud_prestamo_excede_limite_invalido(client):
    # Act: Envío de formulario con 6 equipos (viola la regla R-CANT)
    response = client.post("/prestamos/solicitar", data={
        "equipo_id": 1,
        "cantidad": 6
    }, follow_redirects=True)
    
    # Assert: Rechazo visible en plantilla o código de error
    assert response.status_code == 400 or b"La cantidad permitida es de 1 a 5 equipos" in response.data`,
                command: "pytest tests/test_routes.py::test_solicitud_prestamo_exitosa_con_flash -v",
                oracle: "Para cantidad 3, debe producir redirección 302 -> 200 e inyectar el mensaje flash de éxito en el HTML renderizado. Para cantidad 6, debe rechazar la solicitud sin persistir registros en la base de datos.",
                expectedVsObserved: [
                    ["POST cantidad=3 (follow_redirects=True)", "Redirección 302 a /mis-solicitudes con status final 200 y mensaje Flash presente", "Pasa en verde"],
                    ["POST cantidad=6", "Mensaje 'La cantidad permitida es de 1 a 5 equipos' en la plantilla sin inserción en DB", "Fallo si redirige como éxito o persiste en SQLite"],
                    ["POST sin autenticación", "Redirección 302 al formulario de login", "Fallo si permite solicitar anónimamente"]
                ],
                decision: "Las pruebas en Flask permiten validar el ciclo completo de la aplicación web clásica (HTTP, sesiones, cookies, mensajes flash y renderizado Jinja) en milisegundos sin necesidad de un navegador visual pesado."
            },
            {
                type: "steps",
                title: "Práctica guiada: de la ruta al caso automatizado",
                intro: "Ejecuta la aplicación desde la raíz del proyecto y prueba rutas, formularios CSRF, sesiones y plantillas Jinja con el cliente de pruebas de Flask.",
                steps: [
                    {
                        number: 1,
                        title: "Obtén el proyecto Flask",
                        tag: "Paso 1: Preparación",
                        desc: "Asegúrate de tener la aplicación completa: la carpeta que contiene run.py, requirements.txt, app/ y tests/test_routes.py. Si aún no la tienes, clónala desde el repositorio que te indique tu instructor.",
                        command: "git clone <URL-del-repositorio-Guia-Flask>",
                        tip: "Todo este paso a paso se ejecuta dentro de la raiz de ese proyecto, nunca dentro de la carpeta tests/.",
                        pitfall: "Ejecutar los comandos en otra carpeta (por ejemplo el Escritorio): pytest no encontrara la aplicacion y fallara con ModuleNotFoundError."
                    },
                    {
                        number: 2,
                        title: "Abrir el terminal en la raiz del proyecto",
                        tag: "Paso 2: Terminal",
                        desc: "Abre PowerShell (menu inicio y escribe PowerShell) y navega hasta la carpeta del proyecto. Reemplaza la ruta del ejemplo por la tuya.",
                        command: "cd \"C:\\Users\\TuUsuario\\Guia-Flask\"",
                        tip: "En PowerShell puedes arrastrar la carpeta sobre la ventana para pegar su ruta completa sin errores de escritura.",
                        pitfall: "Olvidar las comillas cuando la ruta tiene espacios; PowerShell interpretaria dos carpetas distintas."
                    },
                    {
                        number: 3,
                        title: "Crear el entorno virtual",
                        tag: "Paso 3: Entorno virtual",
                        desc: "Crea la carpeta venv: un entorno aislado con su propio Python y sus propias librerias, para no mezclarlas con otros proyectos del sistema.",
                        command: "python -m venv venv",
                        tip: "Si PowerShell responde que python no se reconoce, instala Python desde python.org marcando la casilla Add Python to PATH y abre un terminal nuevo.",
                        pitfall: "Instalar las librerias directamente en el Python del sistema (sin venv) genera conflictos entre proyectos."
                    },
                    {
                        number: 4,
                        title: "Activar el entorno virtual",
                        tag: "Paso 4: Activacion",
                        desc: "Activa el entorno para que pip y pytest usen las librerias del proyecto y no las globales.",
                        command: ".\\venv\\Scripts\\activate",
                        tip: "El prompt debe cambiar y mostrar (venv) al inicio; mientras ese texto no aparezca, los comandos usan el Python global.",
                        pitfall: "Si PowerShell bloquea el script por politicas de ejecucion, ejecuta antes: Set-ExecutionPolicy -Scope Process Bypass."
                    },
                    {
                        number: 5,
                        title: "Instalar las dependencias de la aplicacion",
                        tag: "Paso 5: Dependencias",
                        desc: "Instala Flask y sus extensiones leyendo la lista del archivo requirements.txt de la raiz del proyecto.",
                        command: "pip install -r requirements.txt",
                        tip: "La bandera -r indica a pip que lea el archivo; si responde archivo no encontrado, revisa en que carpeta estas.",
                        pitfall: "Ejecutar pip install sin activar el entorno instala las librerias en el Python global y los tests usaran otro entorno."
                    },
                    {
                        number: 6,
                        title: "Instalar las herramientas de prueba",
                        tag: "Paso 6: PyTest",
                        desc: "Instala el ejecutor de pruebas pytest y el medidor de cobertura pytest-cov.",
                        command: "pip install pytest pytest-cov",
                        tip: "pytest ejecuta las funciones test_* y pytest-cov mide el porcentaje de codigo cubierto por ellas.",
                        pitfall: "Olvidar pytest-cov: el comando con --cov fallara porque pytest no reconoce esa bandera."
                    },
                    {
                        number: 7,
                        title: "Levantar la aplicacion para verificar (opcional)",
                        tag: "Paso 7: Smoke check",
                        desc: "Arranca el servidor de desarrollo y abre http://127.0.0.1:5000 en el navegador. Para detenerlo vuelve al terminal y presiona Ctrl+C.",
                        command: "python run.py",
                        tip: "No es obligatorio para correr los tests (el test_client no usa red), pero confirma que el entorno quedo bien configurado.",
                        pitfall: "Si el puerto 5000 esta ocupado, el error Address already in use indica que ya hay otro proceso servidor corriendo."
                    },
                    {
                        number: 8,
                        title: "Ejecutar la suite completa de pruebas",
                        tag: "Paso 8: Ejecucion",
                        desc: "Ejecuta todas las pruebas del proyecto. PyTest lee pytest.ini, que define testpaths = tests, y muestra el resultado de cada prueba en pantalla.",
                        command: "pytest",
                        tip: "La ultima linea resume el resultado: N passed si todo paso o M failed si algo fallo; corrige los fallos de arriba hacia abajo.",
                        pitfall: "ModuleNotFoundError al ejecutar pytest significa que no estas en la raiz del proyecto o que el entorno no esta activo."
                    },
                    {
                        number: 9,
                        title: "Ejecutar el archivo de rutas y una prueba puntual",
                        tag: "Paso 9: Seleccion",
                        desc: "Corre solo las pruebas del archivo test_routes.py (rutas, plantillas y sesiones). Con el formato archivo::prueba ejecutas un unico caso.",
                        command: "pytest tests/test_routes.py -v",
                        tip: "La bandera -v (verbose) muestra el nombre y el estado de cada prueba; para una sola prueba usa pytest tests/test_routes.py::test_health_check -v.",
                        pitfall: "Escribir la ruta del archivo desde otra carpeta: PyTest respondera que el archivo no existe."
                    },
                    {
                        number: 10,
                        title: "Medir la cobertura",
                        tag: "Paso 10: Calidad",
                        desc: "Verifica el porcentaje de lineas ejecutadas por las pruebas en el paquete app y exige el umbral minimo del 80 %.",
                        command: "pytest --cov=app --cov-report=term-missing --cov-fail-under=80",
                        tip: "--cov-report=term-missing agrega la columna Missing con las lineas que ninguna prueba ejecuto; si la cobertura baja del 80 %, la ejecucion termina en error.",
                        pitfall: "Confundir el paquete a medir: --cov=app cubre la aplicacion Flask; --cov=. mediria tambien los archivos de tests."
                    }
                ]
            },
            {
                type: "code", lang: "python", file: "tests/test_routes.py",
                title: "test_routes.py - 30+ tests para la app Flask",
                code: `import pytest
from app import create_app, db

@pytest.fixture
def client():
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "WTF_CSRF_ENABLED": False,
    })
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json == {"status": "ok", "version": "1.0"}

def test_index_returns_html(client):
    response = client.get("/")
    assert response.status_code == 200
    assert b"<html" in response.data.lower()

def test_404_handling(client):
    response = client.get("/ruta-inexistente")
    assert response.status_code == 404

def test_static_css_served(client):
    response = client.get("/static/css/style.css")
    assert response.status_code == 200
    assert b"body" in response.data

def test_user_creation_and_login(client):
    # Registro
    response = client.post("/auth/register", data={
        "username": "testuser",
        "email": "<CORREO_DE_PRUEBA>",
        "password": "<CONTRASEÑA_DE_PRUEBA>",
    }, follow_redirects=True)
    assert response.status_code == 200
    # Login
    response = client.post("/auth/login", data={
        "email": "<CORREO_DE_PRUEBA>",
        "password": "<CONTRASEÑA_DE_PRUEBA>",
    }, follow_redirects=True)
    assert response.status_code == 200
    assert b"Bienvenido" in response.data or b"Dashboard" in response.data`
            },
            {
                type: "timeline",
                title: "Historia: probar aplicaciones web clasicas",
                items: [
                    { year: "2008-2010", title: "Werkzeug y Flask.test_client", desc: "El cliente de pruebas de Werkzeug permite llamar a la app en proceso; Flask 1.x lo vuelve publico y pactado con app_context y TESTING." },
                    { year: "2015", title: "pytest-flask", desc: "Extensiones para fixtures (client, app) y compatibilidad de la sintaxis de pytest con el ciclo de Flask; luego se estandariza el patrón create_app." },
                    { year: "Hoy", title: "El patron de referencia", desc: "create_app + SQLite en memoria + TESTING=True: una app efimera por test, con reintentos dev de CSRF desactivados y asserts sobre HTML y status codes." }
                ]
            }
        ]
    },

    "m-jest-react": {
        title: "Jest: prueba componentes React",
        badge: "Estación 8/18 · React",
        intro: "Prueba componentes React desde el comportamiento visible: interacción, estados, accesibilidad y mensajes que la persona puede reconocer.",
        blocks: [
            {
                type: "tools",
                title: "Qué necesitas para esta práctica",
                stack: [
                    {
                        icon: "⚛️", name: "Jest", tag: "JavaScript",
                        role: "Runner de Facebook (2014): describe/it/expect, mocks, snapshots y cobertura automatica de V8.",
                        when: "Logica de componentes, hooks y utilidades; requiere configuracion jsdom para imitar el DOM."
                    },
                    {
                        icon: "⚡", name: "Vitest", tag: "Vite",
                        role: "Runner basado en Vite (2021), API compatible con Jest: sin config adicional en proyectos Vite; es el que usa el codigo ejemplo.",
                        when: "Proyectos modernos con Vite/ESM; corre con la misma import (vitest) sobre aserciones de jest-dom."
                    },
                    {
                        icon: "📊", name: "React Testing Library", tag: "React",
                        role: "Prueba la interfaz como la percibe el usuario: getByRole, getByText, fireEvent y renderHook.",
                        when: "Render condicional, eventos, estados de loading/error y custom hooks. Reduce los tests fragiles ligados a la implementacion."
                    }
                ]
            },
            {
                type: "diagram",
                diagramType: "architecture",
                title: "Diagrama Visual: Arquitectura de Pruebas en React con Vitest y Testing Library",
                nodes: [
                    { title: "⚡ Vitest Runner", detail: "Ejecuta suites en milisegundos con soporte nativo de ESM y Vite." },
                    { title: "🖥️ JSDOM", detail: "Emula el DOM del navegador en memoria de Node.js sin abrir ventanas reales." },
                    { title: "🧩 <FormularioPrestamo />", detail: "Componente React montado con 'render()' gestionando estado local y accesibilidad." },
                    { title: "🔍 screen.getByRole & userEvent", detail: "Interacciona con inputs y botones mediante roles accesibles (ARIA) como una persona real." }
                ],
                body: "React Testing Library promueve pruebas centradas en el usuario y accesibilidad: consulta elementos por rol semántico ('button', 'spinbutton', 'alert'), dispara eventos reales y comprueba que la interfaz mute visiblemente según las reglas de negocio."
            },
            {
                type: "case-study",
                title: "Caso Práctico Paso a Paso: FormularioDePrestamo.jsx con Accesibilidad y Eventos",
                context: "Probar el componente frontend '<FormularioDePrestamo />' que contiene un input de cantidad (1 a 5) y botón 'Confirmar Solicitud'. Si se ingresa 6, debe mostrar un mensaje accesible <role='alert'>La cantidad máxima permitida es 5</role> y deshabilitar el botón de envío.",
                preconditions: [
                    "Vitest y @testing-library/react configurados con jsdom.",
                    "Componente FormularioDePrestamo importado con soporte para prop callback 'onSubmit'.",
                    "Matchers semánticos de @testing-library/jest-dom activos (toBeInTheDocument, toBeDisabled)."
                ],
                code: `import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FormularioDePrestamo from "./FormularioDePrestamo";

describe("FormularioDePrestamo", () => {
    it("permite solicitar 3 equipos y emite onSubmit", () => {
        const handleSubmit = vi.fn();
        render(<FormularioDePrestamo onSubmit={handleSubmit} />);

        const input = screen.getByLabelText(/cantidad de equipos/i);
        const submitBtn = screen.getByRole("button", { name: /confirmar solicitud/i });

        fireEvent.change(input, { target: { value: "3" } });
        fireEvent.click(submitBtn);

        expect(handleSubmit).toHaveBeenCalledTimes(1);
        expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({ cantidad: 3 }));
    });

    it("bloquea envío y muestra alerta si cantidad es 6", () => {
        const handleSubmit = vi.fn();
        render(<FormularioDePrestamo onSubmit={handleSubmit} />);

        const input = screen.getByLabelText(/cantidad de equipos/i);
        const submitBtn = screen.getByRole("button", { name: /confirmar solicitud/i });

        fireEvent.change(input, { target: { value: "6" } });

        const alerta = screen.getByRole("alert");
        expect(alerta).toHaveTextContent(/la cantidad maxima permitida es 5/i);
        expect(submitBtn).toBeDisabled();
        expect(handleSubmit).not.toHaveBeenCalled();
    });
});`,
                command: "npm test -- FormularioDePrestamo.test.jsx",
                oracle: "Para cantidad 3: el botón debe estar activo y llamar al handler con { cantidad: 3 }. Para cantidad 6: debe renderizarse inmediatamente el nodo con role='alert' y el botón de submit debe quedar deshabilitado.",
                expectedVsObserved: [
                    ["Input = 3 + Click", "Handler onSubmit llamado 1 vez con { cantidad: 3 }", "Pasa en verde"],
                    ["Input = 6", "Elemento role='alert' en el DOM y submitBtn deshabilitado", "Fallo si permite el envío"],
                    ["Input = 0", "Mensaje 'La cantidad mínima es 1' y botón deshabilitado", "Fallo si se omite el límite inferior"]
                ],
                decision: "Al basar las consultas en getByRole y getByLabelText, las pruebas garantizan que el aplicativo sea accesible para lectores de pantalla y resistente a cambios de diseño CSS."
            },
            {
                type: "steps",
                title: "Paso a Paso del Aprendiz: De Cero a Pruebas Automatizadas en React",
                intro: "Aprende a probar componentes React con Vitest (compatible con Jest) y React Testing Library siguiendo las mejores prácticas de accesibilidad.",
                steps: [
                    {
                        number: 1,
                        title: "Instalar dependencias de testing frontend",
                        tag: "Paso 1: Setup",
                        desc: "Instala Vitest, React Testing Library, los matchers extendidos de jest-dom y el emulador de DOM jsdom en tus devDependencies.",
                        command: "npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom",
                        tip: "Vitest comparte la misma API que Jest (`describe`, `it`, `expect`, `vi.fn`), pero es hasta 10 veces más rápido al integrarse nativamente con Vite.",
                        pitfall: "Olvidar instalar `jsdom`; sin él, React Testing Library fallará con 'document is not defined'."
                    },
                    {
                        number: 2,
                        title: "Configurar vitest.config.js y setupTests.js",
                        tag: "Paso 2: Configuración",
                        desc: "Configura el entorno `environment: 'jsdom'` y carga automáticamente `@testing-library/jest-dom` antes de cada suite de prueba.",
                        command: "npm run test",
                        tip: "Importar `@testing-library/jest-dom` habilita matchers semánticos como `.toBeInTheDocument()`, `.toBeVisible()` y `.toBeDisabled()`.",
                        pitfall: "Usar `.toBe(true)` para verificar presencia en el DOM en lugar de `.toBeInTheDocument()`."
                    },
                    {
                        number: 3,
                        title: "Renderizar el componente y buscar elementos accesibles",
                        tag: "Paso 3: Render & Queries",
                        desc: "Renderiza con `render(<Componente />)` y consulta elementos con `screen.getByRole()` o `screen.getByLabelText()`, simulando la experiencia de un usuario real.",
                        command: "npm test -- Contador.test.jsx",
                        tip: "Prioriza siempre `getByRole('button', { name: /guardar/i })` sobre `getByTestId` o selectores CSS de clase.",
                        pitfall: "Consultar elementos por clases de Tailwind o CSS (`container.querySelector('.btn-primary')`), lo que rompe los tests si cambias el diseño."
                    },
                    {
                        number: 4,
                        title: "Simular interacción del usuario y verificar mutaciones del DOM",
                        tag: "Paso 4: Eventos & Aserciones",
                        desc: "Dispara eventos con `fireEvent.click()` o `@testing-library/user-event` y verifica que el texto o los atributos cambien de acuerdo con la lógica.",
                        command: "npm run test:watch",
                        tip: "Si el componente hace peticiones asíncronas o cambia tras un useEffect, usa `await waitFor(() => expect(...))` o `screen.findByText()`.",
                        pitfall: "Hacer aserciones síncronas (`getBy...`) inmediatamente después de disparar una acción asíncrona; fallará porque el estado aún no se ha actualizado."
                    },
                    {
                        number: 5,
                        title: "Ejecutar suite completa y reporte de cobertura frontend",
                        tag: "Paso 5: Cobertura V8",
                        desc: "Genera el reporte de cobertura de componentes React y hooks para asegurar que se prueben todos los estados (loading, success, error).",
                        command: "npm run test:coverage",
                        tip: "Configura el script `\"test:coverage\": \"vitest run --coverage\"` en tu `package.json`.",
                        pitfall: "Probar solo el estado de éxito (happy path) e ignorar los estados de error en formularios y llamadas a APIs."
                    }
                ]
            },
            {
                type: "code", lang: "javascript", file: "src/components/Contador.test.jsx",
                title: "Contador.test.jsx - Test de componente con estado",
                code: `import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Contador from "./Contador";

describe("Contador", () => {
    it("inicia en 0", () => {
        render(<Contador />);
        expect(screen.getByText(/contador: 0/i)).toBeInTheDocument();
    });

    it("incrementa al hacer clic", () => {
        render(<Contador />);
        const btn = screen.getByRole("button", { name: /incrementar/i });
        fireEvent.click(btn);
        expect(screen.getByText(/contador: 1/i)).toBeInTheDocument();
    });

    it("decrementa al hacer clic", () => {
        render(<Contador />);
        const btn = screen.getByRole("button", { name: /decrementar/i });
        fireEvent.click(btn);
        expect(screen.getByText(/contador: -1/i)).toBeInTheDocument();
    });

    it("no excede el limite inferior -10", () => {
        render(<Contador />);
        const btn = screen.getByRole("button", { name: /decrementar/i });
        for (let i = 0; i < 15; i++) fireEvent.click(btn);
        expect(screen.getByText(/contador: -10/i)).toBeInTheDocument();
    });
});`
            },
            {
                type: "code", lang: "javascript", file: "src/hooks/useFetch.test.js",
                title: "useFetch.test.js - Test de custom hook",
                code: `import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useFetch } from "./useFetch";

describe("useFetch", () => {
    it("maneja estados loading y data", async () => {
        const mockData = { id: 1, name: "Test" };
        global.fetch = vi.fn(() =>
            Promise.resolve({ ok: true, json: () => Promise.resolve(mockData) })
        );

        const { result } = renderHook(() => useFetch("/api/test"));

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.data).toEqual(mockData);
        expect(result.current.error).toBeNull();
    });

    it("maneja errores", async () => {
        global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));
        const { result } = renderHook(() => useFetch("/api/test"));
        await waitFor(() => {
            expect(result.current.error).toBeTruthy();
            expect(result.current.loading).toBe(false);
        });
    });
});`
            },
            {
                type: "timeline",
                title: "Historia: probar interfaces sin prueba de humo",
                items: [
                    { year: "2011", title: "Jasmine: el test en el navegador", desc: "Jasmine aporta describe/it y aserciones con expect; Karma ejecuta el test dentro del navegador (lento y fragil en CI)." },
                    { year: "2014", title: "Jest nace en Facebook", desc: "Christoph Nakazawa lo crea para los proyectos React internos: corre en Node, con jsdom y auto-discovery, sin configuracion." },
                    { year: "2016", title: "Snapshot testing: adopcion masiva", desc: "Jest agrega snapshots y la revision visual se vuelve parte del pull request; se vuelve el runner estandar de React." },
                    { year: "2017", title: "React Testing Library", desc: "Kent C. Dodds construye sobre DOM Testing Library: 'testea como el usuario, no como la implementacion'." },
                    { year: "2021", title: "Vitest: la velocidad de Vite", desc: "Anthony Fu crea Vitest sobre Vite, compatible con la API de Jest: transpilado instantaneo y sin config en apps Vite (el codigo ejemplo lo usa)." }
                ]
            }
        ]
    },

    "m-junit-jsp": {
        title: "JUnit 5: Pruebas de Spring Boot",
        badge: "Estación 9/18 · Java",
        intro: "Probamos servicios, controladores y repositorios de Spring Boot con JUnit 5, Mockito y H2.",
        blocks: [
            {
                type: "tools",
                title: "Qué necesitas para esta práctica",
                stack: [
                    {
                        icon: "☕", name: "JUnit 5 (Jupiter)", tag: "Java",
                        role: "Framework xUnit moderno: @Test, @BeforeEach, @DisplayName, @ParameterizedTest y extensiones para Maven/Spring Boot.",
                        when: "Servicios, controladores y repositorios de Spring Boot, además de cualquier lógica de negocio que deba pasar por Maven."
                    },
                    {
                        icon: "🔧", name: "Mockito", tag: "Java",
                        role: "Crea dobles de dependencias como repositorios HTTP o de datos y verifica interacciones con `verify()`.",
                        when: "Aislar la unidad de la base de datos y la red en pruebas locales rápidas; simular errores y comprobar interacciones."
                    },
                    {
                        icon: "💾", name: "H2 / Testcontainers", tag: "DB test",
                        role: "H2 en memoria para integracion rapida; Testcontainers cuando hay que garantizar el mismo dialecto de la BD real (PostgreSQL).",
                        when: "Tests de integracion con JPA que no deben tocar la base de produccion."
                    }
                ]
            },
            {
                type: "diagram",
                diagramType: "architecture",
                title: "Diagrama Visual: Arquitectura de Pruebas Unitarias con JUnit 5 y Mockito",
                nodes: [
                    { title: "☕ JUnit 5 Engine (Jupiter)", detail: "Ejecuta las pruebas parametrizadas y aserciones en el ciclo Maven Test." },
                    { title: "🎯 @InjectMocks PrestamoService", detail: "Instancia bajo prueba con lógica de negocio pura (validación R-CANT y permisos)." },
                    { title: "🔧 @Mock InventarioRepository", detail: "Doble de prueba que simula stock disponible sin consultar la base de datos SQL." },
                    { title: "📋 verify() & assertThrows()", detail: "Comprueba contratos: llamadas exactas al repositorio y captura de excepciones de dominio." }
                ],
                body: "Mockito intercepta las dependencias externas (repositorios, clientes REST). La prueba unitaria se enfoca exclusivamente en la regla de negocio del servicio, ejecutándose en menos de 50 milisegundos."
            },
            {
                type: "case-study",
                title: "Caso Práctico Paso a Paso: Aislamiento con Mockito en PrestamoService.java",
                context: "Probar el método 'crearSolicitud(Aprendiz, int cantidad)' de 'PrestamoService'. Si la cantidad es 3 y hay stock, debe guardar en el repositorio y retornar la solicitud activa. Si la cantidad es 6, debe lanzar 'ReglaNegocioException' y verificar que NUNCA se llamó a 'repository.save()'.",
                preconditions: [
                    "Proyecto Spring Boot con dependencia 'spring-boot-starter-test' (JUnit 5 + Mockito).",
                    "Mock de 'InventarioRepository' configurado con 10 equipos disponibles.",
                    "Entidad de prueba Aprendiz con estado ACTIVO y permiso verificado."
                ],
                code: `@ExtendWith(MockitoExtension.class)
@DisplayName("PrestamoService - Reglas de Negocio")
class PrestamoServiceTest {

    @Mock
    private InventarioRepository inventarioRepo;

    @Mock
    private SolicitudRepository solicitudRepo;

    @InjectMocks
    private PrestamoService prestamoService;

    @Test
    @DisplayName("Debe crear solicitud cuando la cantidad es 3 y hay stock")
    void testCrearSolicitudValida() {
        Aprendiz aprendiz = new Aprendiz(101L, "Sofia ADSO", true);
        when(inventarioRepo.obtenerStockDisponible("LAPTOP")).thenReturn(10);
        when(solicitudRepo.save(any(SolicitudPrestamo.class)))
            .thenAnswer(inv -> inv.getArgument(0));

        SolicitudPrestamo resultado = prestamoService.crearSolicitud(aprendiz, "LAPTOP", 3);

        assertNotNull(resultado);
        assertEquals(3, resultado.getCantidad());
        assertEquals(EstadoSolicitud.APROBADA, resultado.getEstado());
        verify(solicitudRepo, times(1)).save(any(SolicitudPrestamo.class));
    }

    @Test
    @DisplayName("Debe rechazar solicitud y no persistir si cantidad supera límite de 5")
    void testRechazarCantidadExcedida() {
        Aprendiz aprendiz = new Aprendiz(101L, "Sofia ADSO", true);

        ReglaNegocioException ex = assertThrows(ReglaNegocioException.class, () -> {
            prestamoService.crearSolicitud(aprendiz, "LAPTOP", 6);
        });

        assertTrue(ex.getMessage().contains("excede el maximo permitido"));
        verify(solicitudRepo, never()).save(any(SolicitudPrestamo.class));
    }
}`,
                command: "mvn test -Dtest=PrestamoServiceTest",
                oracle: "Para cantidad 3: el servicio debe retornar la entidad guardada y llamar a save() 1 vez. Para cantidad 6: debe lanzar ReglaNegocioException y save() NUNCA debe ejecutarse (verify never).",
                expectedVsObserved: [
                    ["crearSolicitud(aprendiz, 'LAPTOP', 3)", "Retorna SolicitudPrestamo con cantidad 3 y llama a save()", "Pasa en verde"],
                    ["crearSolicitud(aprendiz, 'LAPTOP', 6)", "Lanza ReglaNegocioException; verify(never()).save() se cumple", "Fallo si guarda en BD o no lanza excepción"],
                    ["crearSolicitud(inactivo, 'LAPTOP', 1)", "Lanza AccesoDenegadoException sin tocar inventario", "Fallo si ignora permiso del aprendiz"]
                ],
                decision: "El uso de verify(never()) aporta evidencia contundente de que ninguna falla de validación produce efectos secundarios en la base de datos."
            },
            {
                type: "steps",
                title: "Paso a Paso del Aprendiz: De Cero a Pruebas Automatizadas en Java con JUnit 5 & Mockito",
                intro: "Aprende a probar servicios y controladores de Spring Boot aislando el repositorio con Mockito y usando H2 para integración.",
                steps: [
                    {
                        number: 1,
                        title: "Configurar dependencias en pom.xml de Maven",
                        tag: "Paso 1: Setup Maven",
                        desc: "Agrega en el bloque `<dependencies>` de tu `pom.xml` las librerías `junit-jupiter-engine` y `mockito-core` con scope de test.",
                        command: "mvn dependency:resolve",
                        tip: "Usa el plugin `maven-surefire-plugin` versión 3.x para compatibilidad total con la arquitectura de motores de JUnit 5.",
                        pitfall: "Mezclar anotaciones de JUnit 4 (`org.junit.Test`) con anotaciones de JUnit 5 (`org.junit.jupiter.api.Test`)."
                    },
                    {
                        number: 2,
                        title: "Crear clase de prueba con @ExtendWith(MockitoExtension.class)",
                        tag: "Paso 2: Estructura",
                        desc: "Crea la clase correspondiente en `tests/` (por ejemplo, `FincaServiceTest.java`) y añade la extensión de Mockito para habilitar inyección automática de mocks.",
                        command: "mvn test-compile",
                        tip: "Usa `@DisplayName` con descripciones legibles en español para documentar la intención de negocio de cada método de prueba.",
                        pitfall: "Olvidar inicializar los mocks si no se usa `@ExtendWith(MockitoExtension.class)` ni `MockitoAnnotations.openMocks(this)`."
                    },
                    {
                        number: 3,
                        title: "Declarar Mocks y definir comportamientos con when...thenReturn",
                        tag: "Paso 3: Aislamiento",
                        desc: "Crea un doble de `FincaRepository` y simula sus respuestas usando la sintaxis `when(...).thenReturn(...)` de Mockito.",
                        command: "mvn test -Dtest=FincaServiceTest",
                        tip: "Simula excepciones SQLException con `when(mockStmt.executeUpdate()).thenThrow(new SQLException('Conexión perdida'))` para probar manejo de errores.",
                        pitfall: "Intentar hacer mock de tipos primitivos o clases finales (`final class`) sin la extensión adecuada de Mockito."
                    },
                    {
                        number: 4,
                        title: "Escribir aserciones y verificar interacciones con verify()",
                        tag: "Paso 4: Aserciones & Verify",
                        desc: "Ejecuta el servicio o controlador y valida el resultado con aserciones de JUnit. Usa `verify(repository)` para comprobar las interacciones importantes.",
                        command: "mvn test",
                        tip: "`verify(mockStmt, never()).createStatement()` aporta evidencia de que esa interacción no ocurrió en el caso probado; complementa la revisión de seguridad.",
                        pitfall: "Verificar llamadas con parámetros exactos cuando los objetos comparados no implementan `equals()`; en ese caso usa `any()` o `argThat()`."
                    },
                    {
                        number: 5,
                        title: "Medir cobertura con JaCoCo y reporte Surefire",
                        tag: "Paso 5: Calidad JVM",
                        desc: "Ejecuta el ciclo de pruebas de Maven generando el informe JaCoCo para auditar el cumplimiento del 80% de cobertura en Java.",
                        command: "mvn test jacoco:report",
                        tip: "Abre `target/site/jacoco/index.html` en tu navegador para revisar qué líneas y ramas quedaron sin probar.",
                        pitfall: "Ignorar las advertencias de compilación de Maven que indican pruebas omitidas (`Skipped`)."
                    }
                ]
            },
            {
                type: "code", lang: "java", file: "tests/FincaServiceTest.java",
                title: "FincaServiceTest.java - Servicio aislado con Mockito",
                code: `import co.sena.adso.fincas.entity.Finca;
import co.sena.adso.fincas.repository.FincaRepository;
import org.junit.jupiter.api.*;
import org.mockito.*;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("FincaService - reglas de negocio")
class FincaServiceTest {

    @Mock private FincaRepository repository;
    @InjectMocks private co.sena.adso.fincas.service.FincaService service;

    @BeforeEach
    void setUp() { MockitoAnnotations.openMocks(this); }

    @Test
    @DisplayName("listar retorna las fincas del repositorio")
    void testListar() {
        when(repository.findAll()).thenReturn(List.of(
            new Finca(1L, "La Esperanza", "Carlos", "El Gualilo", "Vélez", 12.5)
        ));

        List<Finca> resultado = service.listar();

        assertEquals(1, resultado.size());
        assertEquals("La Esperanza", resultado.get(0).getNombre());
        verify(repository).findAll();
    }

    @Test
    @DisplayName("obtenerPorId informa cuando no existe")
    void testObtenerPorIdNoExistente() {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
            () -> service.obtenerPorId(999L));
        verify(repository).findById(999L);
    }
}`
            },
            {
                type: "timeline",
                title: "Historia: la linea JUnit",
                items: [
                    { year: "1997", title: "JUnit 1.x: el port de SUnit", desc: "Kent Beck y Erich Gamma portan el framework de Smalltalk a Java; los asserts y las anotaciones originales marcan a xUnit." },
                    { year: "2006", title: "JUnit 4: las anotaciones", desc: "@Test, @Before, @Ignore reemplazan clases y metodos por convencion; el estandar se vuelve mas declarativo y facil de leer." },
                    { year: "2008", title: "Mockito: mocks sin ruido", desc: "Szczepan Faber libera Mockito ('dynamic mocks for Java') y el aislamiento total de la unidad deja de requerir XML de configuracion." },
                    { year: "2017", title: "JUnit 5 (Jupiter)", desc: "Rediseño total: extensiones via @ExtendWith, DisplayName, parametrizacion y @Nested. Mockito 5 (2023) requiere JDK 11+; esta guia corre en Spring Boot 3/JDK 21." }
                ]
            }
        ]
    }
};

window.MODULES = MODULES;
