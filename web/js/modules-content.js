const MODULES = {
    "m-reflexion": {
        title: "Reflexion Inicial: El Bug de 500M USD",
        badge: "Modulo 1",
        intro: "Antes de escribir un solo test, entendamos por que la calidad de software puede literalmente bankruptear una empresa.",
        blocks: [
            {
                type: "alert", variant: "warning",
                title: "Caso Real: Knight Capital (1 de Agosto, 2012)",
                body: "En 45 minutos, un algoritmo de trading con codigo de prueba (DEAD code) no eliminado provoco perdidas por $440 millones USD. La empresa quebró en 2 dias. La causa raiz: un test de carga (SMBAT) se dejo activo en produccion. Sin testing adecuado, sin revision de codigo, sin CI/CD. 9 meses despues, Knight Capital fue adquirida por Getco por $1.50 por accion (antes cotizaba a $10+)."
            },
            {
                type: "code", lang: "python", file: "knight_capital_bug.py",
                title: "El tipo de bug que provoco la catastrofe",
                code: `# Codigo de prueba que NUNCA debio llegar a produccion
def perform_trades(market_data):
    # SMBAT (codigo de prueba de carga) - DEBE ELIMINARSE
    if should_place_orders:  # <- Flag activado en produccion
        for i in range(1000):  # <- Loop sin fin
            place_order(market_data.symbol, quantity=999)  # <- Cantidades absurdas
    # Codigo real
    execute_real_trade(market_data)

# LECCION: Sin tests automatizados que validen el deploy,
# sin revision de codigo (code review), sin pipeline CI/CD,
# este tipo de bugs son inevitables.`
            },
            {
                type: "alert", variant: "info",
                title: "Preguntas de Reflexion (discute con tu equipo)",
                body: "1. Como verificas que tu codigo funciona antes de subirlo? 2. Como sabes que un cambio no rompio algo que funcionaba? 3. Que pasa si el desarrollador que escribio el codigo ya no esta? 4. Como garantizas calidad en un equipo de 50 desarrolladores? 5. Cuanto costaria un bug en produccion para tu proyecto?"
            },
            {
                type: "alert", variant: "success",
                title: "Lo que aprenderas en esta guia",
                body: "Al finalizar los 12 modulos seras capaz de: escribir tests unitarios con PyTest y Jest, testear APIs REST con TestClient, testear componentes React, testear Servlets Java con JUnit 5, automatizar E2E con Playwright, medir cobertura, configurar CI/CD en GitHub Actions, y aplicar TDD/BDD."
            },
            {
                type: "timeline",
                title: "Historia: como nacio la disciplina de las pruebas",
                items: [
                    { year: "1994", title: "SUnit — el patron xUnit", desc: "Kent Beck escribe SUnit en Smalltalk y define lo que hoy llamamos 'framework de pruebas': setup, una asercion por caso, y resultados en verde o rojo." },
                    { year: "1997", title: "JUnit lleva xUnit a Java", desc: "Beck junto a Erich Gamma portan la idea a Java. El modelo se convierte en el estandar que despues copiarian Python, PHP, Ruby y JavaScript." },
                    { year: "2003-2004", title: "pytest nace en Python", desc: "Holger Krekel publica 'py' (luego pytest): asserts naturales, fixtures por inyeccion y un modelo de plugins que lo convierte en el estandar de Python." },
                    { year: "2009", title: "La piramide toma forma", desc: "Mike Cohn populariza el modelo 70/20/10 en 'Succeeding with Agile' y el testing se organiza alrededor de la velocidad y el costo." },
                    { year: "2012", title: "Knight Capital: el costo de no probar", desc: "Un codigo de carga activo en produccion causa perdidas por $440 millones en 45 minutos. La industria entera entiende el testing como inversion." },
                    { year: "2017", title: "JUnit 5 y la modernizacion", desc: "JUnit 5 (Jupiter) renueva el estandar Java con extensiones, parametrizacion y display names, mientras el E2E se vuelve automatizable real con Selenium y Playwright." }
                ]
            }
        ]
    },

    "m-piramide": {
        title: "La Piramide de Testing",
        badge: "Modulo 2",
        intro: "El modelo de Mike Cohn (2009) que organiza los tests por costo, velocidad y cantidad.",
        blocks: [
            {
                type: "diagram", diagramType: "pyramid",
                title: "Piramide de Testing de Mike Cohn",
                body: "70% Unit (rapidos, baratos, aislados) / 20% Integration (medios, lentos) / 10% E2E (caros, lentos, completos)"
            },
            {
                type: "tools",
                title: "El stack de herramientas de esta guia",
                stack: [
                    {
                        icon: "⚡", name: "PyTest", tag: "Python",
                        role: "Framework de pruebas para Python: aserciones simples con assert, fixtures y parametrizacion.",
                        when: "Logica de negocio y APIs (FastAPI, Flask). 70% inferior de la piramide y quality gates en CI."
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
                        when: "Flujos criticos de usuario. 10% superior de la piramide: son caros, usar solo los que importan."
                    },
                    {
                        icon: "🚀", name: "GitHub Actions", tag: "CI/CD",
                        role: "Pipeline como codigo YAML: lint, tests, cobertura y despliegue en cada push.",
                        when: "Compuertas de calidad (Quality Gates) que impiden que el VPS reciba codigo sin pruebas verdes."
                    },
                    {
                        icon: "📊", name: "pytest-cov / JaCoCo", tag: "Cobertura",
                        role: "Miden las lineas y ramas ejecutadas por los tests y producen reportes con umbrales.",
                        when: "Verificar el objetivo de cobertura (80% SENA ADSO) y bloquear el avance si baja."
                    }
                ]
            },
            {
                type: "code", lang: "python", file: "estructura_tests.py",
                title: "Estructura recomendada de carpetas",
                code: `proyecto/
├── tests/
│   ├── unit/              # 70% - Pruebas unitarias (aisladas, rapidas)
│   │   ├── test_models.py
│   │   ├── test_services.py
│   │   └── test_utils.py
│   ├── integration/       # 20% - Pruebas de integracion
│   │   ├── test_api.py     # API + BD real o test-db
│   │   └── test_db.py
│   └── e2e/               # 10% - End-to-end (Playwright)
│       └── test_flujo_compra.py
├── src/
│   └── app/
├── pytest.ini
└── .github/workflows/`
            },
            {
                type: "comparison",
                title: "Unit vs Integration vs E2E",
                headers: ["Aspecto", "Unit", "Integration", "E2E"],
                rows: [
                    ["Velocidad", "ms (<10)", "segundos", "minutos"],
                    ["Costo", "Bajo", "Medio", "Alto"],
                    ["Cantidad", "70%", "20%", "10%"],
                    ["Aislamiento", "Total (mocks)", "Parcial", "Ninguno"],
                    ["Confianza", "Baja", "Media", "Alta"],
                    ["Mantenibilidad", "Alta", "Media", "Baja"]
                ]
            },
            {
                type: "comparison",
                title: "Pruebas Funcionales vs Pruebas de Rendimiento y Servidor",
                headers: ["Tipo de Prueba", "Qué Evalúa", "Herramienta", "Métrica de Éxito"],
                rows: [
                    ["Funcional: Unitarias", "Lógica pura, cálculos, validaciones aisladas", "PyTest, Jest, JUnit 5", "Aserción booleana (True/False) en <5ms"],
                    ["Funcional: Integración", "Endpoints REST + Base de datos real", "TestClient, Testcontainers", "Status HTTP y persistencia correcta"],
                    ["Funcional: E2E", "Flujo crítico completo del usuario (UI)", "Playwright, Cypress", "Flujo sin errores visuales ni roturas"],
                    ["Servidor: Carga (Load)", "Comportamiento bajo tráfico normal esperado", "k6, Locust", "Latencia p95 < 200ms, 0% errores"],
                    ["Servidor: Estrés (Stress)", "Punto de quiebre (Breaking Point) del VPS", "k6, Apache Bench", "Identificar CPU 100% o DB Pool agotado"],
                    ["Servidor: Pico (Spike)", "Saltos bruscos de 10 a 1000 usuarios en 5s", "k6 (stages ramping)", "Recuperación automática sin reinicio"],
                    ["Servidor: Resistencia (Soak)", "Carga continua por horas (Fugas de memoria)", "Locust, k6", "RAM y descriptores de archivo estables"],
                    ["Despliegue: Humo (Smoke)", "Salud crítica post-despliegue en VPS", "curl, scripts bash", "/health responde 200 OK y DB viva"]
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
                intro: "Sigue este orden secuencial estricto en cada proyecto que desarrolles. Probar de la base a la cúspide te garantiza resolver el 80% de los fallos con retroalimentación instantánea (< 10 ms) antes de invertir tiempo en pruebas pesadas de navegador.",
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
                        title: "Fase 2: Pruebas Unitarias de Dominio (Base 70% de la Pirámide)",
                        tag: "Lógica Pura & Algoritmos",
                        desc: "Escribe pruebas unitarias aisladas para funciones de cálculo, validaciones de esquemas Pydantic/JPA y reglas de negocio. Emplea mocks y stubs para aislar la base de datos y la red.",
                        command: "pytest tests/unit -v",
                        tip: "Aplica el patrón AAA (Arrange, Act, Assert). Cada prueba unitaria debe durar menos de 5 ms.",
                        pitfall: "Intentar conectar una base de datos real en un test unitario destruye la velocidad de la suite y añade dependencias frágiles."
                    },
                    {
                        number: 3,
                        title: "Fase 3: Pruebas de Integración y Contratos de API (Nivel Medio 20%)",
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
                        title: "Fase 5: Pruebas End-to-End en Navegador Real (Cúspide 10%)",
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
                        desc: "Genera el reporte de cobertura de código (`pytest-cov`, `JaCoCo`, `c8`) para certificar que se supere el umbral del 80% exigido en ADSO. Ejecuta `qa_auditor` para detectar vulnerabilidades OWASP y código muerto.",
                        command: "pytest --cov=app --cov-report=term-missing --cov-fail-under=80",
                        tip: "Examina no solo las líneas ejecutadas sino también la cobertura de ramas (`branch coverage`) en condicionales if/else.",
                        pitfall: "Confiar ciegamente en un 100% de cobertura cuando los tests carecen de aserciones profundas (tests cosméticos)."
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
        title: "PyTest: Testeando el Microservicio FastAPI",
        badge: "Modulo 3",
        intro: "Testamos el codigo REAL de la Guia FastAPI con TestClient y fixtures.",
        blocks: [
            {
                type: "tools",
                title: "Herramientas de este modulo y sus contextos",
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
        title: "PyTest: Testeando la App Flask",
        badge: "Modulo 4",
        intro: "Testamos la aplicacion Flask real de la Guia Flask con SQLite en memoria. Para seguir este modulo necesitas el proyecto Flask completo en tu computador: la carpeta con run.py, requirements.txt, app/ y tests/test_routes.py. Si no lo tienes, clonalo desde el repositorio que indique tu instructor o pidelo como entrega de la guia anterior.",
        blocks: [
            {
                type: "tools",
                title: "Herramientas de este modulo y sus contextos",
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
                type: "steps",
                title: "Paso a Paso del Aprendiz: De Cero a Pruebas Automatizadas en Flask",
                intro: "Aprende a ejecutar la aplicacion Flask real (Guia-Flask) y a probar rutas, formularios CSRF, sesiones de usuario y plantillas Jinja con el test_client de Flask. Todos los comandos se ejecutan en la raiz del proyecto Guia-Flask.",
                steps: [
                    {
                        number: 1,
                        title: "Obtener el proyecto Flask (Guia-Flask)",
                        tag: "Paso 1: Preparacion",
                        desc: "Asegurate de tener en tu computador la aplicacion Flask completa: la carpeta que contiene run.py, requirements.txt, app/ y tests/test_routes.py. Si aun no la tienes, clonala desde el repositorio que te indique tu instructor.",
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
        "email": "test@test.com",
        "password": "Test123!",
    }, follow_redirects=True)
    assert response.status_code == 200
    # Login
    response = client.post("/auth/login", data={
        "email": "test@test.com",
        "password": "Test123!",
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
        title: "Jest: Testeando Componentes React",
        badge: "Modulo 5",
        intro: "Testamos los componentes de la Guia React con Jest y React Testing Library.",
        blocks: [
            {
                type: "tools",
                title: "Herramientas de este modulo y sus contextos",
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
        title: "JUnit 5: Testeando Servlets JSP",
        badge: "Modulo 6",
        intro: "Testamos los Servlets y DAOs de la Guia JSP con JUnit 5 y Mockito.",
        blocks: [
            {
                type: "tools",
                title: "Herramientas de este modulo y sus contextos",
                stack: [
                    {
                        icon: "☕", name: "JUnit 5 (Jupiter)", tag: "Java",
                        role: "Framework xUnit moderno: @Test, @BeforeEach, @DisplayName, @ParameterizedTest y extensiones para Maven/Spring Boot.",
                        when: "Backend Java clasico (Servlets, DAOs, Spring Boot) y cualquier logica de negocio que deba pasar por Maven."
                    },
                    {
                        icon: "🔧", name: "Mockito", tag: "Java",
                        role: "Crea dobles de dependencias (Connection, PreparedStatement, repositorios HTTP) y verifica interacciones con verify().",
                        when: "Aislar la unidad de BD y red en tests locales rapidos; simular errores SQL y comprobar que la consulta usa parametros."
                    },
                    {
                        icon: "💾", name: "H2 / Testcontainers", tag: "DB test",
                        role: "H2 en memoria para integracion rapida; Testcontainers cuando hay que garantizar el mismo dialecto de la BD real (PostgreSQL).",
                        when: "Tests de integracion con JPA que no deben tocar la base de produccion."
                    }
                ]
            },
            {
                type: "steps",
                title: "Paso a Paso del Aprendiz: De Cero a Pruebas Automatizadas en Java con JUnit 5 & Mockito",
                intro: "Aprende a probar DAOs, Servlets y servicios de negocio en Java aislando la base de datos y la red con Mockito.",
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
                        desc: "Crea la clase correspondiente en `src/test/java/` (ej. `ProductoDAOTest.java`) y añade la extensión de Mockito para habilitar inyección automática de mocks.",
                        command: "mvn test-compile",
                        tip: "Usa `@DisplayName` con descripciones legibles en español para documentar la intención de negocio de cada método de prueba.",
                        pitfall: "Olvidar inicializar los mocks si no se usa `@ExtendWith(MockitoExtension.class)` ni `MockitoAnnotations.openMocks(this)`."
                    },
                    {
                        number: 3,
                        title: "Declarar Mocks y definir comportamientos con when...thenReturn",
                        tag: "Paso 3: Aislamiento",
                        desc: "Crea dobles de `Connection`, `PreparedStatement` o `HttpServletRequest`. Simula sus respuestas usando la sintaxis fluida de Mockito.",
                        command: "mvn test -Dtest=ProductoDAOTest",
                        tip: "Simula excepciones SQLException con `when(mockStmt.executeUpdate()).thenThrow(new SQLException('Conexión perdida'))` para probar manejo de errores.",
                        pitfall: "Intentar hacer mock de tipos primitivos o clases finales (`final class`) sin la extensión adecuada de Mockito."
                    },
                    {
                        number: 4,
                        title: "Escribir aserciones y verificar interacciones con verify()",
                        tag: "Paso 4: Aserciones & Verify",
                        desc: "Ejecuta el método del DAO/Servlet y valida el resultado con `assertEquals` o `assertTrue`. Usa `verify(mockStmt).executeUpdate()` para garantizar que la consulta se ejecutó.",
                        command: "mvn test",
                        tip: "`verify(mockStmt, never()).createStatement()` certifica que nunca se concatenó SQL vulnerable a inyecciones.",
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
                type: "code", lang: "java", file: "src/test/java/ProductoDAOTest.java",
                title: "ProductoDAOTest.java - Test del DAO con Mockito",
                code: `import org.junit.jupiter.api.*;
import org.mockito.Mockito;
import java.sql.*;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("ProductoDAO - Tests del CRUD")
class ProductoDAOTest {

    private Connection mockConn;
    private PreparedStatement mockStmt;
    private ResultSet mockRs;
    private ProductoDAO productoDAO;

    @BeforeEach
    void setUp() throws SQLException {
        mockConn = mock(Connection.class);
        mockStmt = mock(PreparedStatement.class);
        mockRs = mock(ResultSet.class);
        when(mockConn.prepareStatement(anyString())).thenReturn(mockStmt);
        productoDAO = new ProductoDAO(mockConn);
    }

    @Test
    @DisplayName("crear producto ejecuta INSERT correctamente")
    void testCrearProducto() throws SQLException {
        Producto p = new Producto(0, "Laptop", 1500.0, 10, "Electronica");
        when(mockStmt.executeUpdate()).thenReturn(1);
        boolean result = productoDAO.crear(p);
        assertTrue(result);
        verify(mockStmt).executeUpdate();
    }

    @Test
    @DisplayName("listar productos retorna lista no vacia")
    void testListarProductos() throws SQLException {
        when(mockStmt.executeQuery()).thenReturn(mockRs);
        when(mockRs.next()).thenReturn(true, true, false);
        when(mockRs.getInt("id")).thenReturn(1, 2);
        when(mockRs.getString("nombre")).thenReturn("Mouse", "Teclado");
        when(mockRs.getDouble("precio")).thenReturn(25.0, 40.0);

        List<Producto> productos = productoDAO.listar();
        assertEquals(2, productos.size());
        assertEquals("Mouse", productos.get(0).nombre());
    }

    @Test
    @DisplayName("PreparedStatement previene SQL Injection")
    void testPreparedStatementPrevieneInyeccion() throws SQLException {
        Producto malicioso = new Producto(0, "'; DROP TABLE productos; --", 100.0, 1, "X");
        productoDAO.crear(malicioso);
        // Verifica que se use setString (no concatenacion)
        verify(mockStmt).setString(eq(1), contains("DROP TABLE"));
        verify(mockStmt, never()).createStatement();
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
    },

    "m-tdd": {
        title: "TDD: Test-Driven Development",
        badge: "Modulo 7",
        intro: "Rojo - Verde - Refactor: el ciclo de Kent Beck que revoluciono la programacion.",
        blocks: [
            {
                type: "diagram", diagramType: "tdd-cycle",
                title: "Ciclo TDD: Rojo -> Verde -> Refactor",
                body: "1. ROJO: Escribe un test que FALLA (define que quieres). 2. VERDE: Escribe el codigo MINIMO para que pase. 3. REFACTOR: Mejora el codigo sin romper tests."
            },
            {
                type: "steps",
                title: "Paso a Paso del Aprendiz: Dominando el Ciclo TDD en 5 Pasos",
                intro: "Aprende a programar guiado por pruebas bajo la disciplina de Kent Beck: pensar el contrato antes de escribir una sola línea de código.",
                steps: [
                    {
                        number: 1,
                        title: "Paso 1: Rojo (Red) - Escribir el test que falla",
                        tag: "Fase Roja",
                        desc: "Escribe una prueba unitaria pequeña que describa una expectativa de negocio antes de que la función o método exista. Ejecuta la prueba y verifica que falle exactamente por la razón esperada.",
                        command: "pytest tests/unit/test_calculo.py -v",
                        tip: "El test debe fallar inicialmente por NameError o por aserción no cumplida, nunca por un error de sintaxis en el archivo de prueba.",
                        pitfall: "Escribir código de producción antes de ver la prueba fallar; si no la viste fallar, no sabes si realmente está probando algo."
                    },
                    {
                        number: 2,
                        title: "Paso 2: Verde (Green) - El código mínimo indispensable",
                        tag: "Fase Verde",
                        desc: "Escribe la implementación más simple posible que haga que el test pase a verde. Está permitido devolver un valor hardcodeado (técnica Fake It) para validar el cableado.",
                        command: "pytest -k 'test_calculo' -v",
                        tip: "No intentes escribir la solución perfecta o hiper-optimizada en este paso. El único objetivo es poner la barra en verde en menos de 2 minutos.",
                        pitfall: "Ponerse a programar funcionalidades adicionales no cubiertas por el test actual (over-engineering)."
                    },
                    {
                        number: 3,
                        title: "Paso 3: Refactorización (Refactor) - Limpiar sin alterar comportamiento",
                        tag: "Fase Refactor",
                        desc: "Con las pruebas en verde que actúan como red de seguridad, elimina código duplicado, renombra variables confusas y divide funciones largas.",
                        command: "pytest -v",
                        tip: "Ejecuta la suite completa tras cada cambio pequeño de refactorización. Si algo se rompe, haz `Ctrl+Z` inmediatamente.",
                        pitfall: "Añadir nueva funcionalidad durante la fase de refactorización; la refactorización solo mejora el diseño del código existente."
                    },
                    {
                        number: 4,
                        title: "Paso 4: Triangular casos borde (Baby Steps)",
                        tag: "Iteración Corta",
                        desc: "Agrega un segundo y tercer caso de prueba que obligue a generalizar la implementación (técnica de triangulación: 0, negativos, nulos, colecciones vacías).",
                        command: "pytest --tb=line -v",
                        tip: "Mantén el ritmo de los ciclos: cada ciclo Rojo-Verde-Refactor debe tomar entre 2 y 5 minutos.",
                        pitfall: "Escribir suites gigantescas de 50 tests antes de implementar la primera línea de código."
                    },
                    {
                        number: 5,
                        title: "Paso 5: Documentar la evolución y certificar cobertura",
                        tag: "Calidad Continua",
                        desc: "Verifica que el nuevo código tenga un 100% de cobertura natural y documenta los contratos en la suite de pruebas como documentación viva.",
                        command: "pytest --cov=app --cov-report=term-missing",
                        tip: "Los tests de TDD son la mejor especificación técnica del sistema: si alguien tiene dudas de qué hace una función, el test lo responde.",
                        pitfall: "Borrar tests de casos borde creyendo que ya no son necesarios una vez que el código funciona."
                    }
                ]
            },
            {
                type: "code", lang: "python", file: "tdd_ejemplo.py",
                title: "TDD paso a paso: funcion es_primo()",
                code: `# === PASO 1: ROJO - Test que falla ===
def test_es_primo_deberia_retornar_true_para_2():
    assert es_primo(2) == True  # NameError: es_primo no existe

# === PASO 2: VERDE - Implementacion minima ===
def es_primo(n):
    if n < 2: return False
    for i in range(2, n):
        if n % i == 0: return False
    return True

# === PASO 3: REFACTOR - Optimizar ===
import math
def es_primo(n):
    if n < 2: return False
    if n == 2: return True
    if n % 2 == 0: return False
    for i in range(3, int(math.sqrt(n)) + 1, 2):  # Solo impares hasta raiz
        if n % i == 0: return False
    return True

# === MAS TESTS (casos borde) ===
def test_es_primo_casos_borde():
    assert es_primo(0) == False
    assert es_primo(1) == False
    assert es_primo(2) == True
    assert es_primo(3) == True
    assert es_primo(4) == False
    assert es_primo(97) == True  # Primo grande
    assert es_primo(100) == False`
            },
            {
                type: "alert", variant: "success",
                title: "Beneficios del TDD",
                body: "1. Diseno mejorado: piensas en la interfaz antes de implementar. 2. Documentacion viva: los tests describen el comportamiento. 3. Confianza para refactorizar. 4. Menos bugs en produccion. 5. Cobertura natural (100% del codigo nuevo)."
            },
            {
                type: "alert", variant: "info",
                title: "¿En que contextos usar TDD?",
                body: "IDEAL: logica con reglas de negocio (impuestos, validaciones, calculos), algoritmos y utilidades — codigo puro sin IO. DIFICIL: manejo de dependencias externas muy voluminosas (BD compleja, servicios de terceros), prototipos exploratorios UI y sus casos: practica la tecnica primero en estos ultimos con mocks, o limita el TDD al dominio (la capa de servicios)."
            },
            {
                type: "timeline",
                title: "Historia: TDD, de Smalltalk a la IA",
                items: [
                    { year: "1998", title: "Beck formaliza test-first", desc: "Kent Beck describe el ciclo rojo-verde-refactor en Smalltalk y lo integra a XP (Extreme Programming) como disciplina central." },
                    { year: "2002", title: "El libro que lo hizo masivo", desc: "'Test-Driven Development: By Example' (Beck) define la receta practica y los patrones: FakeIt, TwoStep, Triple A." },
                    { year: "2008", title: "TDD en las corrientes mainstream", desc: "Grandes equipos lo asumen (Google, Amazon reconocen su adopcion interna); aparece el debate sobre su impacto real con respecto al coverage." },
                    { year: "2012-2019", title: "Characterization testing y refactor legacy", desc: "Michael Feathers ('Working Effectively with Legacy Code') soporta el TDD para sistemas viejos: escribir la red para poder cambiar." },
                    { year: "2023-2025", title: "TDD con IA asistida", desc: "Los LLM redactan el test inicial ya escrito (la 'red') y el humano decide el contrato; la disciplina sigue siendo el proceso, no la herramienta." }
                ]
            }
        ]
    }
};

window.MODULES = MODULES;
