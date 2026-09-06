// Continuacion de modules-content.js — Modulos 8-12
Object.assign(window.MODULES, {
    "m-bdd": {
        title: "BDD: Behavior-Driven Development",
        badge: "Modulo 8",
        intro: "Lenguaje Gherkin (Given-When-Then) para que negocio y tecnica hablen el mismo idioma.",
        blocks: [
            {
                type: "code", lang: "python", file: "features/productos.feature",
                title: "productos.feature - Escenario en Gherkin",
                code: `Feature: Gestion de Productos
    Como administrador del inventario
    Quiero gestionar productos
    Para mantener el stock actualizado

    Scenario: Crear un producto valido
        Given que estoy autenticado como admin
        And no existe un producto "Laptop Dell"
        When envio POST /productos con:
            | nombre    | precio | stock |
            | Laptop Dell | 1200   | 5     |
        Then la respuesta tiene status 201
        And el producto "Laptop Dell" existe en la base de datos

    Scenario Outline: Validacion de precio
        Given que envio un producto con precio <precio>
        Then la respuesta es <status>
        Examples:
            | precio | status |
            | -10    | 422    |
            | 0      | 422    |
            | 100    | 201    |`
            },
            {
                type: "code", lang: "python", file: "tests/steps/productos_steps.py",
                title: "productos_steps.py - Implementacion con Behave",
                code: `from behave import given, when, then
import requests

BASE_URL = "http://localhost:8000"

@given('que estoy autenticado como admin')
def step_auth(context):
    r = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "admin@sena.edu.co",
        "password": "admin123"
    })
    context.token = r.json()["access_token"]
    context.headers = {"Authorization": f"Bearer {context.token}"}

@when('envio POST /productos con datos validos')
def step_create(context):
    context.response = requests.post(
        f"{BASE_URL}/productos/",
        json={"nombre": "Producto Test", "precio": 99.9, "stock": 1},
        headers=context.headers
    )

@then('la respuesta tiene status 201')
def step_status(context):
    assert context.response.status_code == 201, \
        f"Expected 201, got {context.response.status_code}"`
            },
            {
                type: "steps",
                title: "Paso a Paso del Aprendiz: De Cero a Pruebas Automatizadas BDD con Behave",
                intro: "Aprende a conectar especificaciones de negocio legibles (Gherkin) con pruebas automatizadas en Python usando Behave.",
                steps: [
                    {
                        number: 1,
                        title: "Instalar Behave y crear estructura de carpetas",
                        tag: "Paso 1: Setup",
                        desc: "Instala `behave` y `requests` en tu entorno virtual. Crea el directorio `features/` y su subdirectorio `features/steps/`.",
                        command: "pip install behave requests; mkdir -p features/steps",
                        tip: "Behave busca por convención todos los archivos `.feature` en la carpeta `features/` y las implementaciones Python en `features/steps/`.",
                        pitfall: "Colocar los archivos `_steps.py` fuera de la carpeta `features/steps/`; Behave no podrá encontrarlos."
                    },
                    {
                        number: 2,
                        title: "Redactar el escenario en lenguaje Gherkin",
                        tag: "Paso 2: Especificación",
                        desc: "Crea `features/productos.feature`. Redacta la historia de usuario y escenarios con la estructura Given (Dado que), When (Cuando), Then (Entonces).",
                        command: "touch features/productos.feature",
                        tip: "Usa `Scenario Outline` con una tabla de `Examples` cuando quieras probar múltiples combinaciones de datos para la misma regla.",
                        pitfall: "Escribir pasos técnicos en Gherkin como 'Hacer clic en div.col-md-4' en lugar de la intención de negocio 'Cuando agrego el producto al carrito'."
                    },
                    {
                        number: 3,
                        title: "Implementar las funciones de paso (Step Definitions)",
                        tag: "Paso 3: Implementación",
                        desc: "En `features/steps/productos_steps.py`, decora funciones Python con `@given(...)`, `@when(...)` y `@then(...)`, vinculando el contexto con `context`.",
                        command: "behave",
                        tip: "El objeto `context` es compartido a lo largo de todos los pasos de un mismo escenario; úsalo para pasar tokens (`context.token`) y respuestas (`context.response`).",
                        pitfall: "Modificar variables globales en lugar de guardarlas en `context`, lo que genera colisiones entre escenarios."
                    },
                    {
                        number: 4,
                        title: "Ejecutar Behave y verificar coincidencia de pasos",
                        tag: "Paso 4: Ejecución",
                        desc: "Ejecuta `behave` en terminal. Si algún paso no tiene implementación, Behave imprimirá el fragmento de código exacto que debes pegar.",
                        command: "behave features/productos.feature",
                        tip: "Usa `behave -k` para ejecutar solo los escenarios que coincidan con un texto o etiqueta (`@tag`).",
                        pitfall: "Tener diferencias de espacios o caracteres entre el texto en `.feature` y la cadena en `@when(...)`, lo que marcará el paso como 'Undefined'."
                    },
                    {
                        number: 5,
                        title: "Añadir aserciones de negocio rigurosas",
                        tag: "Paso 5: Validación",
                        desc: "En el paso `@then`, valida que la respuesta HTTP tenga el código esperado y que los registros existan o hayan cambiado en el backend.",
                        command: "behave --format progress",
                        tip: "Incluye mensajes descriptivos en los asserts: `assert context.response.status_code == 201, f'Esperaba 201 pero recibí {context.response.status_code}'`.",
                        pitfall: "Confiar en que el paso pasó solo porque no lanzó excepción, olvidando verificar el contenido de la respuesta."
                    }
                ]
            },
            {
                type: "alert", variant: "info",
                title: "¿En que contextos usar BDD?",
                body: "IDEAL: funcionalidades con alto valor de negocio y lenguaje claro (checkout, precios, permisos), contratos frontend-backend y trabajo con producto/negocio involucrado. EVITA: BDD como unica capa de pruebas (necesitas unitarias antes), y Gherkin al extremo (una cascada de escenarios lentos y fragiles). Regla: lo que el negocio puede leer, en Gherkin; lo que las maquinas validan, en unitarias."
            },
            {
                type: "timeline",
                title: "Historia: BDD y el lenguaje compartido",
                items: [
                    { year: "2003", title: "Dan North y JBehave", desc: "Nace el término Behavior-Driven Development; Given-When-Then (de Chris Matts y North) estructura el escenario como contrato tridimensional." },
                    { year: "2005-2008", title: "RSpec y Cucumber", desc: "RSpec le da forma en Ruby; Aslak Hellesøy crea Cucumber (2008) y Gherkin se vuelve el lenguaje de escenarios multi-idioma." },
                    { year: "2010-2016", title: "SpecFlow (.NET) y Cucumber-JVM", desc: "El patrón aterriza en el ecosistema corporativo: QA, product owners y desarrolladores escriben juntos features y steps con doctesta 'plain text executable'." },
                    { year: "Hoy", title: "BDD en equipos agiles", desc: "Gauge (ThoughtWorks, 2014) lleva la especificacion viva a multiples lenguajes; persiste la discusion entre 'Gherkin como especificacion' y 'Gherkin como tests'." }
                ]
            }
        ]
    },

    "m-playwright": {
        title: "Pruebas E2E con Playwright",
        badge: "Modulo 9",
        intro: "Automatiza pruebas de navegador reales: click, type, navigate, screenshot.",
        blocks: [
            {
                type: "tools",
                title: "E2E: herramienta por contexto",
                stack: [
                    {
                        icon: "🎬", name: "Playwright", tag: "Microsoft",
                        role: "E2E moderno multi-navegador (Chromium, Firefox, WebKit): auto-waiting, trace-viewer, videos y screenshots.",
                        when: "Flujos criticos de usuario en CI: login, inventario, checkout. Es la herramienta de esta guia."
                    },
                    {
                        icon: "🐭", name: "Cypress", tag: "Open source",
                        role: "Corre dentro del navegador: resultados en tiempo real, debugging visual excelente y gran DX.",
                        when: "Proyectos que ya estan sobre Cypress; equipos que priorizan la experiencia del desarrollador."
                    },
                    {
                        icon: "🔍", name: "Selenium WebDriver", tag: "2004",
                        role: "El estandar veterano de W3C: grid de navegadores remota, soporte masivo de drivers y muchos lenguajes.",
                        when: "Automatizacion legada o entornos donde la compatibilidad multi-navegador institucional sea obligatoria."
                    }
                ]
            },
            {
                type: "steps",
                title: "Paso a Paso del Aprendiz: De Cero a Pruebas Automatizadas E2E con Playwright",
                intro: "Aprende a automatizar navegadores reales (Chromium, Firefox, WebKit) simulando las acciones exactas de un usuario en producción.",
                steps: [
                    {
                        number: 1,
                        title: "Instalar dependencias y binarios de navegadores",
                        tag: "Paso 1: Setup",
                        desc: "Instala `@playwright/test` como dependencia de desarrollo y descarga los binarios de los navegadores headless con el CLI de Playwright.",
                        command: "npm install -D @playwright/test && npx playwright install chromium",
                        tip: "En entornos locales puedes instalar solo `chromium` para ahorrar espacio y tiempo; en el pipeline CI instala los 3 motores si tu app es multiplataforma.",
                        pitfall: "Olvidar ejecutar `npx playwright install`; el comando `playwright test` fallará diciendo que no encuentra el ejecutable del navegador."
                    },
                    {
                        number: 2,
                        title: "Configurar playwright.config.js y servidor de prueba",
                        tag: "Paso 2: Configuración",
                        desc: "Configura `baseURL` (ej. `http://localhost:5173`), capturas automáticas en fallo (`screenshot: 'only-on-failure'`) y trazas para depuración (`trace: 'on-first-retry'`).",
                        command: "npx playwright test --config=playwright.config.js",
                        tip: "Puedes configurar la propiedad `webServer` en `playwright.config.js` para que Playwright arranque tu frontend automáticamente antes de correr los tests.",
                        pitfall: "Usar URLs absolutas hardcodeadas en cada test (`page.goto('http://localhost:5173/...')`) en vez de rutas relativas (`page.goto('/...')`) aprovechando `baseURL`."
                    },
                    {
                        number: 3,
                        title: "Escribir la prueba E2E con selectores data-testid",
                        tag: "Paso 3: Redacción E2E",
                        desc: "Crea `tests/e2e/inventario.spec.js`. Navega, llena formularios con `page.fill('[data-testid=...]')` y haz clic en botones con `page.click()`.",
                        command: "npx playwright test inventario.spec.js",
                        tip: "Los selectores `data-testid` son inmunes a cambios de diseño visual (CSS/Tailwind) y a modificaciones de texto en la interfaz.",
                        pitfall: "Usar XPaths complejos o selectores CSS anidados (`div > table > tr:nth-child(2) > td:nth-child(3)`), que se rompen con cualquier cambio de maquetación."
                    },
                    {
                        number: 4,
                        title: "Aserciones web-first con auto-espera (Auto-waiting)",
                        tag: "Paso 4: Aserciones",
                        desc: "Usa siempre `await expect(locator).toBeVisible()` o `await expect(page).toHaveURL()`. Playwright esperará activamente hasta 5 segundos a que el elemento aparezca en el DOM.",
                        command: "npx playwright test --ui",
                        tip: "El modo interactivo `--ui` te permite ver la ejecución en tiempo real, viajar en el tiempo paso a paso y ver qué pasaba en el DOM en cada microsegundo.",
                        pitfall: "Usar esperas fijas (`await new Promise(r => setTimeout(r, 3000))`); provocan tests lentos e inestables (flaky tests). Confía en el auto-waiting de Playwright."
                    },
                    {
                        number: 5,
                        title: "Inspeccionar reportes y depurar con Trace Viewer",
                        tag: "Paso 5: Diagnóstico",
                        desc: "Cuando un test E2E falla, abre el reporte HTML interactivo con capturas de pantalla, video de la sesión y la traza completa de peticiones de red.",
                        command: "npx playwright show-report",
                        tip: "El Trace Viewer de Playwright te muestra las llamadas fetch del navegador, capturas de pantalla de antes y después de cada clic y la consola de JavaScript.",
                        pitfall: "Borrar la carpeta `test-results/` antes de inspeccionar por qué falló un test en el servidor de CI."
                    }
                ]
            },
            {
                type: "code", lang: "javascript", file: "e2e/inventario.spec.js",
                title: "inventario.spec.js - Flujo E2E completo",
                code: `import { test, expect } from "@playwright/test";

test.describe("Flujo de Inventario", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:5173");
    });

    test("login y crear producto", async ({ page }) => {
        // Login
        await page.fill("[data-testid=email]", "admin@sena.edu.co");
        await page.fill("[data-testid=password]", "admin123");
        await page.click("[data-testid=login-btn]");
        await expect(page).toHaveURL(/dashboard/);

        // Navegar a productos
        await page.click("text=Productos");
        await expect(page.locator("h1")).toContainText("Lista de Productos");

        // Crear producto
        await page.click("[data-testid=new-product]");
        await page.fill("[data-testid=nombre]", "Monitor LG 27");
        await page.fill("[data-testid=precio]", "350");
        await page.fill("[data-testid=stock]", "8");
        await page.click("[data-testid=save]");

        // Verificar
        await expect(page.locator("text=Monitor LG 27")).toBeVisible();
    });

    test("validacion: precio negativo no se envia", async ({ page }) => {
        await page.click("[data-testid=new-product]");
        await page.fill("[data-testid=nombre]", "Test");
        await page.fill("[data-testid=precio]", "-50");
        await page.click("[data-testid=save]");
        await expect(page.locator(".error")).toContainText(/precio/i);
    });

    test("screenshot del dashboard", async ({ page }) => {
        await page.screenshot({ path: "screenshots/dashboard.png", fullPage: true });
    });
});`
            },
            {
                type: "alert", variant: "info",
                title: "Comandos Playwright",
                body: "npx playwright install (instala navegadores) | npx playwright test (ejecuta) | npx playwright test --headed (con UI) | npx playwright codegen (genera codigo grabando)"
            },
            {
                type: "timeline",
                title: "Historia: automatizacion E2E",
                items: [
                    { year: "2004", title: "Selenium nace en ThoughtWorks", desc: "Jason Huggins crea Selenium Core; en 2006 aparece Selenium RC y en 2008 el WebDriver de Simon Stewart. En 2009 ambos se fusionan en Selenium 2." },
                    { year: "2016", title: "Cypress: E2E sin friction", desc: "Brian Mann lanza Cypress: los tests corren y ven el estado del navegador, con recargas en caliente y debugging como una web app." },
                    { year: "2017", title: "Puppeteer: el protocolo Chrome DevTools", desc: "Google lanza Puppeteer y la automatizacion conecta directo al navegador; cambia el balance entre rapidez y control." },
                    { year: "2020", title: "Microsoft lanza Playwright", desc: "Ingenieros provenientes de Puppeteer crean Playwright en Microsoft: Chromium, Firefox y WebKit con un solo API, auto-waiting y trazas." },
                    { year: "Hoy", title: "E2E como puerta de la piramide", desc: "Los flujos criticos se automatizan y ejecutan en CI con evidencia (video + trace); la piramide de Cohn sigue mandando: pocos y buenos." }
                ]
            }
        ]
    },

    "m-cobertura": {
        title: "Cobertura y Metricas de Calidad",
        badge: "Modulo 10",
        intro: "Mide que porcentaje de tu codigo esta cubierto por tests. Objetivo SENA: 80%+ en logica de negocio.",
        blocks: [
            {
                type: "tools",
                title: "Herramientas de cobertura por ecosistema",
                stack: [
                    {
                        icon: "📊", name: "pytest-cov / coverage.py", tag: "Python",
                        role: "Mide lineas y ramas ejecutadas; umbral con --cov-fail-under y reportes HTML/XML intercomunicables con CI.",
                        when: "Cada pull request: bloquear el merge si la logica de negocio baja del 80%."
                    },
                    {
                        icon: "📊", name: "V8 Coverage (Vitest + c8)", tag: "JavaScript",
                        role: "Cobertura nativa del motor V8 (via Istanbul o c8): reportes HTML, LCOV y umbrales configurados junto al runner del proyecto.",
                        when: "Componentes y hooks: detectar ramas no cubiertas y sostener el 80% en el frontend."
                    },
                    {
                        icon: "📊", name: "JaCoCo", tag: "Java",
                        role: "Cobertura JVM para Maven/Gradle: XML, HTML y reglas de umbral que rompen el build si baja.",
                        when: "Backend Spring Boot/Servlets: en el mismo run de Maven en CI."
                    }
                ]
            },
            {
                type: "steps",
                title: "Paso a Paso del Aprendiz: De Cero a Medición de Cobertura y Quality Gates",
                intro: "Aprende a medir qué porcentaje de código ejecutan tus pruebas y cómo asegurar el umbral mínimo del 80% exigido en ADSO.",
                steps: [
                    {
                        number: 1,
                        title: "Instalar el plugin de cobertura según tu lenguaje",
                        tag: "Paso 1: Herramientas",
                        desc: "Instala `pytest-cov` en Python, `@vitest/coverage-v8` en JavaScript o añade `jacoco-maven-plugin` en el `pom.xml` de Java.",
                        command: "pip install pytest-cov  # O en Node: npm i -D @vitest/coverage-v8",
                        tip: "Elige siempre motores de cobertura nativos (como el profiling de V8 en Node o tracing en Python) para reducir el impacto en tiempo de ejecución.",
                        pitfall: "Intentar medir cobertura sin haber instalado el plugin correspondiente; el comando fallará con argumentos no reconocidos."
                    },
                    {
                        number: 2,
                        title: "Configurar el umbral de bloqueo al 80%",
                        tag: "Paso 2: Umbral",
                        desc: "Configura la bandera `--cov-fail-under=80`. Si el porcentaje global o de lógica de negocio es 79.9%, el comando retornará código de error 1 rompiendo el build.",
                        command: "pytest --cov=app --cov-fail-under=80",
                        tip: "Excluye archivos de configuración, migraciones y scripts de inicio en `.coveragerc` o `pyproject.toml` para no distorsionar la métrica de negocio.",
                        pitfall: "Contar archivos autogenerados o de configuración en el cálculo de cobertura, lo que infla o baja artificialmente el porcentaje."
                    },
                    {
                        number: 3,
                        title: "Ejecutar la suite y generar reporte HTML visual",
                        tag: "Paso 3: Generación",
                        desc: "Genera una carpeta HTML interactiva para explorar archivo por archivo qué líneas no fueron tocadas por los tests.",
                        command: "pytest --cov=app --cov-report=html --cov-report=term-missing",
                        tip: "Abre `htmlcov/index.html` en tu navegador. Las líneas en rojo son las que jamás se ejecutaron durante ninguna prueba.",
                        pitfall: "Olvidar añadir `htmlcov/` y `.coverage` al `.gitignore`, ensuciando el repositorio Git con miles de archivos temporales."
                    },
                    {
                        number: 4,
                        title: "Auditar la cobertura de ramas (Branch Coverage)",
                        tag: "Paso 4: Cobertura de Ramas",
                        desc: "Activa `--cov-branch`. La cobertura de ramas comprueba que en cada condicional `if/else` se hayan probado tanto la condición verdadera como la falsa.",
                        command: "pytest --cov=app --cov-branch --cov-report=term-missing",
                        tip: "Una línea con `if` puede aparecer en verde, pero si nunca probaste el camino `else`, la rama tiene un fallo latente no detectado.",
                        pitfall: "Quedarse solo con 'Line Coverage' básica creyendo que todo el flujo condicional está a salvo."
                    },
                    {
                        number: 5,
                        title: "Detectar tests cosméticos (Sin Aserciones Reales)",
                        tag: "Paso 5: Auditoría Crítica",
                        desc: "Revisa que cada test que ejecute líneas tenga aserciones con `assert` o `expect` que validen el estado. Un test sin aserciones infla la cobertura pero no prueba nada.",
                        command: "python -m qa_auditor --target app/",
                        tip: "Usa `qa_auditor` para detectar automáticamente funciones de prueba vacías o sin aserciones que pasan en verde por engaño.",
                        pitfall: "Celebrar tener 100% de cobertura cuando los tests solo invocan funciones sin verificar su valor de retorno."
                    }
                ]
            },
            {
                type: "code", lang: "bash", file: "comandos_cobertura.sh",
                title: "Comandos para medir cobertura",
                code: `# Python - pytest-cov
pytest --cov=app --cov-report=html --cov-report=term-missing
# Abre htmlcov/index.html en el navegador

# JavaScript - Jest con coverage
npx jest --coverage --coverageReporters html

# Java - JaCoCo (Maven)
mvn test jacoco:report
# Abre target/site/jacoco/index.html

# Configurar umbral minimo (pytest.ini)
# [pytest]
# cov_fail_under = 80`
            },
            {
                type: "comparison",
                title: "Tipos de Cobertura",
                headers: ["Tipo", "Que mide", "Util?"],
                rows: [
                    ["Line", "Lineas ejecutadas", "Basica"],
                    ["Branch", "Ramas de decision (if/else)", "Mejor"],
                    ["Path", "Caminos completos", "Ideal pero costosa"],
                    ["Mutation", "Tests que detectan mutaciones", "Oro estandar"]
                ]
            },
            {
                type: "alert", variant: "warning",
                title: "100% cobertura != 100% calidad",
                body: "Puedes tener 100% cobertura y no testear casos borde. La cobertura mide que el codigo se EJECUTO, no que se PROBO correctamente. Combina cobertura + casos de prueba + code review."
            },
            {
                type: "timeline",
                title: "Historia: medir la calidad de los tests",
                items: [
                    { year: "2003-2004", title: "coverage.py mide Python", desc: "Ned Batchelder publica coverage.py: la primera herramienta masiva de medicion de lineas ejecutadas para CPython." },
                    { year: "2009-2014", title: "JaCoCo y Istanbul", desc: "JaCoCo (sucesor de EclEmma) se vuelve el estandar JVM; Ben Coe lanza Istanbul (2014) para JavaScript y con ello nacen los reportes LCOV/HTML de los frontends." },
                    { year: "2016-2020", title: "Umbrales en el pipeline", desc: "--cov-fail-under, las reglas de CoCo, y c8 (V8 nativo): los badges de cobertura pasan a ser una compuerta (gate) en el CI, no una simple estadistica." },
                    { year: "Hoy", title: "Mutation testing: el oro estandar", desc: "Stryker (JS/TS), PIT (Java) y mutmut (Python) mutan el codigo y comprueban si tu suite lo detecta: miden la efectividad real de los tests." }
                ]
            }
        ]
    },

    "m-cicd": {
        title: "CI/CD con GitHub Actions",
        badge: "Modulo 11",
        intro: "Automatiza: cada push ejecuta tests, cada merge a main despliega. Pipeline completo.",
        blocks: [
            {
                type: "tools",
                title: "Herramientas del pipeline y sus contextos",
                stack: [
                    {
                        icon: "🚀", name: "GitHub Actions", tag: "CI/CD",
                        role: "Workflows YAML que corren lint, tests, cobertura y deploy como respuesta a push y PR en GitHub.",
                        when: "Quality Gate por cada push/merge y despliegue automatizado a VPS con smoke test y rollback."
                    },
                    {
                        icon: "📈", name: "k6", tag: "Rendimiento",
                        role: "Pruebas de carga/estres como codigo JS (Grafana/Load Impact): VUs por etapas, thresholds y resultados JSON.",
                        when: "Antes de produccion: load (trafico esperado), spike (picos), soak (horas) y estres (punto de quiebre)."
                    },
                    {
                        icon: "🔧", name: "Git + .gitignore", tag: "Versionamiento",
                        role: "El codigo de pruebas es ciudadano de primera clase (first-class): se versiona con el codigo de produccion.",
                        when: "Todo lo que se ejecuta en la nube: tests, fixtures y pipelines. Los reportes, cache y `.env` quedan fuera del repo."
                    },
                    {
                        icon: "🛡️", name: "pre-commit + Gitleaks", tag: "Git Testing & Seguridad",
                        role: "Hooks locales que ejecutan linters, escaneo de secretos y pruebas unitarias rápidas antes de permitir el commit.",
                        when: "En la máquina del desarrollador antes de que el código o credenciales salgan hacia el repositorio remoto."
                    }
                ]
            },
            {
                type: "steps",
                title: "Paso a Paso del Aprendiz: De Cero a un Pipeline CI/CD en GitHub Actions",
                intro: "Construye un flujo automatizado de integración y entrega continua que proteja el servidor de producción contra código roto.",
                steps: [
                    {
                        number: 1,
                        title: "Crear el archivo de workflow en .github/workflows/ci.yml",
                        tag: "Paso 1: Definición",
                        desc: "Crea la carpeta `.github/workflows` en la raíz del repositorio y define el archivo `ci.yml` con la sintaxis estándar de GitHub Actions.",
                        command: "mkdir -p .github/workflows; touch .github/workflows/ci.yml",
                        tip: "Usa nombres descriptivos para cada trabajo (`jobs: python-tests`, `jobs: react-tests`) para que el visor de GitHub muestre qué falló a simple vista.",
                        pitfall: "Cometer errores de indentación en el YAML (espacios vs tabs), lo que hace que GitHub Actions rechace el workflow sin ejecutarlo."
                    },
                    {
                        number: 2,
                        title: "Configurar disparadores automáticos (Triggers)",
                        tag: "Paso 2: Disparadores",
                        desc: "Define `on: [push, pull_request]` apuntando a las ramas `main` y `develop` para que cada commit y solicitud de cambio sea evaluado antes de integrarse.",
                        command: "git push origin develop",
                        tip: "Configura la protección de ramas en los ajustes de GitHub para prohibir 'Merge' si el pipeline de CI no está completamente verde.",
                        pitfall: "Permitir merges directos a `main` sin pasar por la compuerta de GitHub Actions."
                    },
                    {
                        number: 3,
                        title: "Configurar la matriz de entornos y dependencias cacheadas",
                        tag: "Paso 3: Matriz de Ejecución",
                        desc: "Usa actions oficiales (`actions/setup-python@v5`, `actions/setup-node@v4`, `actions/setup-java@v4`) activando la opción `cache: 'pip'` o `cache: 'npm'`.",
                        command: "git add .github/workflows/ci.yml && git commit -m 'ci: setup pipeline'",
                        tip: "El caché de dependencias acelera el tiempo de ejecución del pipeline de 3 minutos a menos de 30 segundos por corrida.",
                        pitfall: "Descargar paquetes desde cero en cada ejecución de CI consumiendo minutos innecesarios de la cuota de GitHub."
                    },
                    {
                        number: 4,
                        title: "Establecer la compuerta de fallo rápido (Fail-Fast)",
                        tag: "Paso 4: Quality Gate",
                        desc: "Encadena los pasos: primero linters y chequeo de tipos, luego pruebas unitarias, después pruebas de integración y finalmente validación de cobertura con umbral.",
                        command: "pytest --cov=app --cov-fail-under=80",
                        tip: "Si el linter detecta un error de sintaxis en el segundo 5, el runner aborta inmediatamente sin perder tiempo corriendo las pruebas pesadas.",
                        pitfall: "Configurar `continue-on-error: true` en pasos críticos de pruebas, lo que permite que el pipeline se marque en verde aunque los tests hayan fallado."
                    },
                    {
                        number: 5,
                        title: "Despliegue seguro al VPS condicionado con Smoke Test",
                        tag: "Paso 5: Despliegue & Rollback",
                        desc: "Solo si todos los jobs anteriores fueron exitosos, el job de despliegue conecta vía SSH al VPS, actualiza el contenedor Docker y ejecuta un smoke test (`curl /health`).",
                        command: "curl -f http://localhost:8000/health",
                        tip: "Si `/health` no responde 200 en 15 segundos, ejecuta auto-rollback automático en el script con `git checkout HEAD~1 && docker compose up -d`.",
                        pitfall: "Desplegar el nuevo código y no verificar en caliente si el servicio levantó correctamente."
                    }
                ]
            },
            {
                type: "code", lang: "yaml", file: ".github/workflows/ci.yml",
                title: "ci.yml - Pipeline completo multi-stack",
                code: `name: CI - Testing Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  python-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.11", "3.12"]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: \${{ matrix.python-version }}
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-cov httpx
      - name: Run tests with coverage
        run: pytest --cov=app --cov-fail-under=80 --cov-report=xml
      - name: Upload coverage
        uses: codecov/codecov-action@v4

  react-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage --watchAll=false

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [python-tests, react-tests]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/`
            },
            {
                type: "alert", variant: "info",
                title: "🐙 Relación Simbiótica: Testing y GitHub como Quality Gate en la Nube",
                body: "GitHub transforma las pruebas de un simple script en la máquina del programador ('en mi máquina sí funciona') en un árbitro automatizado e inmutable. A través de GitHub Actions, cada evento de push o pull request arranca runners efímeros e independientes que clonan el repositorio, instalan dependencias y ejecutan la suite de tests (PyTest, Jest, JUnit, Playwright). Mediante Branch Protection Rules (Reglas de Protección de Ramas), GitHub impide físicamente que un desarrollador fusione código hacia 'main' o 'develop' si el pipeline de pruebas no está 100% en verde. Además, proporciona feedback directo e interactivo: anotaciones de error sobre las líneas exactas del código en el Pull Request, badges de estado para el README, almacenamiento de artefactos (videos y trazas de Playwright) y compuertas de cobertura conectadas a herramientas como Codecov."
            },
            {
                type: "comparison",
                title: "¿Se deben subir los tests a Git? La Regla SSoT y el Control de Artefactos",
                headers: ["Elemento de QA / Testing", "¿Se sube a Git?", "Archivos / Ejemplos", "Justificación Técnica (SSoT y CI/CD)"],
                rows: [
                    ["Código de Pruebas", "✅ SÍ (Obligatorio)", "tests/test_*.py, *.spec.js, *Test.java", "Ciudadano de primera clase. Sin ellos, el runner de GitHub Actions no tiene nada que ejecutar y no hay Quality Gate."],
                    ["Fixtures y Datos Sintéticos", "✅ SÍ (Obligatorio)", "conftest.py, fábricas Faker, mocks", "Garantiza reproducibilidad determinista para que cualquier clon del repositorio ejecute la suite."],
                    ["Configuraciones de Testing", "✅ SÍ (Obligatorio)", "pytest.ini, vitest.config.js, playwright.config.js", "Define cómo se descubren los casos, flags de ejecución, timeouts y umbrales de cobertura obligatorios."],
                    ["Pipelines CI y Hooks de Git", "✅ SÍ (Obligatorio)", ".github/workflows/ci.yml, .pre-commit-config.yaml", "Formaliza el contrato de calidad que todos los colaboradores y runners deben cumplir obligatoriamente."],
                    ["Secretos y Credenciales Reales", "❌ NUNCA (.gitignore)", ".env, .env.local, id_rsa, *.pem, API keys", "Vulnerabilidad crítica. Un secreto comiteado queda en el historial de Git para siempre, incluso si se borra luego."],
                    ["Reportes y Cobertura Efímera", "❌ NUNCA (.gitignore)", "htmlcov/, .coverage, coverage/, playwright-report/", "Son resultados temporales derivados. Generan ruido masivo, ensucian el árbol y provocan conflictos de merge."],
                    ["Cachés de Frameworks y Compilación", "❌ NUNCA (.gitignore)", ".pytest_cache/, __pycache__/, node_modules/, .nyc_output/", "Archivos generados dependientes del SO local; el entorno de CI debe crearlos limpios."],
                    ["Bases de Datos Locales", "❌ NUNCA (.gitignore)", "test.db, dev.sqlite3, dumps *.sql locales", "Riesgo de fuga de datos reales y corrupción binaria en el historial del repositorio Git."]
                ]
            },
            {
                type: "alert", variant: "danger",
                title: "🔒 Seguridad en Pruebas: ¿Subir los tests revela información a los atacantes?",
                body: "EL MITO DE LA SEGURIDAD POR OSCURIDAD: Ocultar los tests pensando que 'los atacantes sabrán cómo atacarnos o qué validaciones tenemos' es una falacia que viola el Principio de Kerckhoffs. Un software debe ser seguro por su arquitectura, validación de entradas, sanitización y control de accesos, NO por mantener el código o las pruebas en secreto. Los atacantes modernos usan herramientas automatizadas (Burp Suite, OWASP ZAP, SQLmap) que descubren fallas de seguridad en segundos sin necesidad de leer tus pruebas. Si una prueba demuestra que un endpoint no valida permisos o que un parámetro es vulnerable a inyección SQL, la vulnerabilidad está en el código de producción expuesto a internet, no en el test.\n\nLOS 3 RIESGOS REALES QUE SÍ PUEDEN AYUDAR A UN ATACANTE:\n1. Secretos quemados (Hardcoded Secrets): Dejar credenciales reales de staging o producción ('Admin123!', API keys de Stripe o AWS) en los tests pensando que 'solo es un archivo de prueba'. Si el repositorio se filtra o es público, el atacante tiene acceso directo.\n2. Fuga de PII en fixtures: Exportar tablas reales de clientes con correos, nombres o teléfonos para usarlos como datos de test (grave violación de normativas GDPR y Habeas Data).\n3. Endpoints de depuración huérfanos: Rutas como '/api/dev/reset-database' o '/admin/bypass-auth' probadas en tests pero que quedaron activas y desprotegidas en producción.\n\nSOLUCIÓN: Usa siempre generadores de datos sintéticos (Faker), inyecta credenciales efímeras mediante GitHub Secrets y simula servicios externos con Mocks y Stubs."
            },
            {
                type: "comparison",
                title: "🌐 Repositorios Públicos vs. Privados en Git: ¿Qué tan recomendable es hacer público tu código?",
                headers: ["Criterio de Evaluación", "Repositorio Público", "Repositorio Privado", "Recomendación para el Aprendiz / Desarrollador"],
                rows: [
                    ["Portafolio y Empleabilidad", "⭐⭐⭐⭐⭐ Máxima visibilidad: Demuestra a reclutadores código limpio, pruebas con >=80% de cobertura y CI/CD verde.", "❌ Invisible para reclutadores sin invitación o acceso explícito.", "Tus proyectos de práctica, formativos y de código abierto DEBEN ser públicos para certificar tus competencias."],
                    ["Propiedad Intelectual (IP)", "⚠️ Código accesible para todos. Cualquiera puede clonar, bifurcar o aprender de tu software.", "🔒 Protegido. Ideal para ventajas comerciales, patentes y modelos de negocio propietarios.", "Usa repositorios privados para empresas, clientes con NDA o sistemas comerciales cerrados."],
                    ["Costos en GitHub Actions", "🆓 Ilimitado y gratuito: Runners públicos de GitHub con alta disponibilidad sin costo.", "⏱️ Minutos limitados (2.000 min/mes en plan gratuito compartidos entre todos tus repos).", "Los repos públicos son ideales para ejecutar suites completas de pruebas unitarias, integración y E2E sin agotar cuota."],
                    ["Auditoría Comunitaria", "👁️ Ley de Linus: 'Con suficientes ojos, todos los errores son superficiales'. La comunidad puede reportar fallos.", "🛡️ Auditoría restringida exclusivamente al equipo interno.", "REGLA DE ORO: Desarrolla y prueba TODO proyecto privado con los estándares de un repositorio público (cero secretos)."]
                ]
            },
            {
                type: "alert", variant: "warning",
                title: "🧪 Tests para Git: Validando el propio flujo de trabajo (Hooks y Secret Scanning)",
                body: "Así como testeamos la lógica con PyTest o Jest, debemos 'testear Git' para garantizar que ningún commit rompa el estándar antes de salir de la máquina local:\n• Pre-commit Hooks: Scripts que se ejecutan automáticamente en el staging area al escribir 'git commit'. Si un test unitario rápido o un linter falla, Git aborta el commit físicamente.\n• Secret Scanning (Gitleaks / detect-secrets): Test estático que analiza cada línea añadida buscando patrones regex de API keys de AWS, tokens de GitHub o contraseñas, impidiendo que entren al historial.\n• Commitlint (Conventional Commits): Valida que los mensajes de commit sigan el estándar ('feat:', 'fix:', 'test:'), facilitando el versionado semántico automático.\n• Pruebas de CI en local con 'act': Permite ejecutar tus workflows de GitHub Actions en contenedores Docker locales para testear el pipeline YAML antes de hacer 'git push'."
            },
            {
                type: "code", lang: "yaml", file: ".pre-commit-config.yaml",
                title: ".pre-commit-config.yaml - Testing de Git y Escaneo de Secretos con Gitleaks y PyTest",
                code: `# Quality Gate Local en Git: higiene, escaneo de secretos y pruebas unitarias
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.6.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-json
      - id: check-added-large-files
        args: ['--maxkb=500']

  # Detección estricta de secretos antes de comitear
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.4
    hooks:
      - id: gitleaks

  # Linter de código Python
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.4.4
    hooks:
      - id: ruff
        args: [--fix]

  # Smoke test local: pruebas unitarias rápidas obligatorias (< 2s)
  - repo: local
    hooks:
      - id: pytest-unit-fast
        name: pytest unit fast
        entry: pytest tests/unit -q --tb=line
        language: system
        types: [python]
        pass_filenames: false`
            },
            {
                type: "code", lang: "yaml", file: ".github/workflows/deploy-vps.yml",
                title: "deploy-vps.yml - Quality Gate y Despliegue Automatizado a VPS",
                code: `name: CD - Deploy to VPS
on:
  push:
    branches: [main]

jobs:
  # 1. QUALITY GATE: Ningún despliegue ocurre si los tests fallan
  test-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Python
        uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install -r requirements.txt && pytest --cov=app --cov-fail-under=80

  # 2. DESPLIEGUE A VPS: Condicionado a que test-gate esté 100% verde
  deploy-vps:
    needs: [test-gate]
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH to VPS
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: \${{ secrets.VPS_HOST }}
          username: \${{ secrets.VPS_USER }}
          key: \${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/qualitymesh-app
            git pull origin main
            docker compose up -d --build --remove-orphans
            
            # 3. SMOKE TEST EN VIVO EN EL VPS POST-DEPLOY
            echo "Ejecutando Smoke Test post-deploy..."
            for i in {1..10}; do
              if curl -f http://127.0.0.1:8000/health; then
                echo "✅ Smoke Test exitoso: VPS saludable"
                exit 0
              fi
              echo "Esperando que el servicio inicie ($i/10)..."
              sleep 3
            done
            
            # 4. ROLLBACK AUTOMÁTICO SI EL SMOKE TEST FALLA
            echo "🚨 SMOKE TEST FALLÓ: Ejecutando rollback a versión anterior"
            git checkout HEAD~1
            docker compose up -d --build
            exit 1`
            },
            {
                type: "code", lang: "javascript", file: "tests/stress/test_servidor_k6.js",
                title: "test_servidor_k6.js - Prueba de Carga y Estrés de Servidor con k6",
                code: `import http from "k6/http";
import { check, sleep } from "k6";

// Configuración de etapas de estrés (Ramping VUs)
export const options = {
  stages: [
    { duration: "30s", target: 50 },   // Carga normal: 50 usuarios
    { duration: "1m",  target: 200 },  // Estrés: 200 usuarios concurrentes
    { duration: "30s", target: 500 },  // Pico (Spike): 500 usuarios (breaking point)
    { duration: "30s", target: 0 },    // Recuperación / Ramping down
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],     // Errores HTTP deben ser menores a 1%
    http_req_duration: ["p(95)<250"],   // 95% de peticiones deben tardar < 250ms
  },
};

export default function () {
  const res = http.get("http://127.0.0.1:8000/productos/");
  check(res, {
    "status es 200": (r) => r.status === 200,
    "tiempo respuesta < 250ms": (r) => r.timings.duration < 250,
  });
  sleep(1);
}`
            },
            {
                type: "diagram", diagramType: "pipeline",
                title: "Flujo CI/CD",
                body: "Push -&gt; Lint -&gt; Tests Unit -&gt; Build -&gt; Tests E2E -&gt; Deploy Staging -&gt; Approval -&gt; Deploy Prod"
            },
            {
                type: "timeline",
                title: "Historia: de la construccion continua al Quality Gate",
                items: [
                    { year: "1991", title: "Grady Booch acuna 'continuous integration'", desc: "El termino nace como practica de construir e integrar en cada cambio para descubrir fallos temprano; Kent Beck la eleva a disciplina XP en 1997." },
                    { year: "2005", title: "Git y la automatizacion global", desc: "Linus Torvalds crea Git; los repositorios distribuidos permiten hooks, clones remotos y la integracion en la nube (Hudson 2005/Jenkins 2011)." },
                    { year: "2011", title: "Travis CI y la era as-a-service", desc: "Github comunitario adopta CI en la nube para pull requests; nace el badge verde que decide si el PR es mergeable." },
                    { year: "2017", title: "k6: rendimiento como codigo", desc: "Load Impact libera k6: JS, etapas y thresholds; Grafana lo adquiere en 2021 y las pruebas de carga entran al pipeline." },
                    { year: "2019", title: "GitHub Actions: pipelines nativos", desc: "Actions sale de beta: workflows YAML, reutilizables y marketplace; el guard de tests se vuelve la puerta hacia el VPS." }
                ]
            }
        ]
    },

    "m-observabilidad": {
        title: "Observabilidad en Producción: Logs JSON, Métricas y AI SRE en Coolify",
        badge: "Modulo 12",
        intro: "Cierra el ciclo de calidad cuando el contenedor ya está en producción. Aprende a emitir logs estructurados en JSON con Correlation ID (X-Request-ID), exponer endpoints de salud (/healthz, /readyz, /metrics), capturar logs con Dozzle y automatizar el triaje y diagnóstico de caídas en Coolify usando agentes de IA.",
        blocks: [
            {
                type: "alert", variant: "info",
                title: "¿Por qué observabilidad en una guía de testing?",
                body: "El testing automatizado pre-producción (PyTest, Jest, Playwright) previene defectos anticipados, pero en producción el software interactúa con redes reales, picos de tráfico, bases de datos saturadas y fallos de infraestructura. La observabilidad completa el ciclo de aseguramiento de calidad (ISO/IEC 25010: Confiabilidad y Capacidad de Mantenimiento)."
            },
            {
                type: "comparison",
                title: "Los 4 Pilares de la Observabilidad y Diagnóstico en VPS con Coolify",
                headers: ["Pilar", "Mecanismo Técnico", "Implementación en Flask", "Uso en Coolify y AI SRE"],
                rows: [
                    ["Logs Estructurados", "JSONFormatter + X-Request-ID", "Logs de 1 línea JSON con timestamp ISO y source", "La IA procesa el stack trace sin errores de saltos de línea."],
                    ["Métricas de Servicio", "Prometheus Metrics (/metrics)", "SimpleMetricsRegistry contando requests y duración", "Alerta automática si la tasa de errores supera el umbral."],
                    ["Health & Readiness", "Endpoints /healthz y /readyz", "Verifica conexión viva a PostgreSQL/Redis en runtime", "Coolify detecta contenedores zombi y programa reinicios."],
                    ["Agente AI SRE", "ai_log_watcher.py (Daemon)", "Webhook multihilo en puerto 9050 con SHA-256", "Emite diagnóstico RCA, severidad y parche sugerido."]
                ]
            },
            {
                type: "code", lang: "python", file: "recursos/observabilidad/flask_observability.py",
                title: "flask_observability.py - Middleware de Observabilidad Flask",
                code: `from flask import Flask, request, g, jsonify
import logging, uuid, time, json

class JSONFormatter(logging.Formatter):
    """Emite cada log como un objeto JSON estructurado de una sola línea."""
    def __init__(self, service_name="flask-app", environment="production"):
        super().__init__()
        self.service_name = service_name
        self.environment = environment

    def format(self, record):
        payload = {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(record.created)),
            "service": self.service_name,
            "level": record.levelname,
            "message": record.getMessage(),
            "source": f"{record.filename}:{record.lineno}",
            "request_id": getattr(record, "request_id", "-")
        }
        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)
        return json.dumps(payload, ensure_ascii=False)

class FlaskObservability:
    """Instrumentación integral: X-Request-ID, /healthz, /readyz y /metrics."""
    def __init__(self, app=None, service_name="mi-servicio"):
        if app:
            self.init_app(app, service_name)

    def init_app(self, app, service_name="mi-servicio"):
        @app.before_request
        def before_request():
            req_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
            g.request_id = req_id
            g.start_time = time.time()

        @app.after_request
        def after_request(response):
            response.headers["X-Request-ID"] = getattr(g, "request_id", "-")
            return response

        @app.route("/healthz")
        def healthz():
            return jsonify({"status": "healthy", "service": service_name}), 200

        @app.route("/readyz")
        def readyz():
            # Aquí se verifica DB, Redis, etc.
            return jsonify({"status": "ready"}), 200`
            },
            {
                type: "code", lang: "python", file: "recursos/observabilidad/ai_log_watcher.py",
                title: "ai_log_watcher.py - Agente de Triaje con Deduplicación SHA-256",
                code: `import hashlib, json
from http.server import HTTPServer, BaseHTTPRequestHandler

class ErrorFingerprinter:
    """Evita tormentas de alertas generando huellas SHA-256 de errores."""
    def __init__(self):
        self.seen_hashes = set()

    def get_fingerprint(self, error_message, source_file=""):
        normalized = f"{source_file}::{error_message.strip()}"
        return hashlib.sha256(normalized.encode("utf-8")).hexdigest()

    def is_duplicate(self, error_message, source_file=""):
        fp = self.get_fingerprint(error_message, source_file)
        if fp in self.seen_hashes:
            return True
        self.seen_hashes.add(fp)
        return False

# Servidor daemon que recibe webhooks de Coolify
# POST /webhook/coolify -> Analiza con IA -> Envía alerta a Discord/Telegram/Slack`
            },
            {
                type: "code", lang: "yaml", file: "recursos/observabilidad/docker-compose.observability.yml",
                title: "docker-compose.observability.yml - Stack con Dozzle y Agente AI SRE",
                code: `version: '3.8'
services:
  app:
    build: .
    ports:
      - "8000:8000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/healthz"]
      interval: 15s
      timeout: 5s
      retries: 3
    restart: unless-stopped

  dozzle:
    image: amir20/dozzle:latest
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    ports:
      - "8888:8080"
    environment:
      - DOZZLE_LEVEL=info
    restart: unless-stopped

  ai-watcher:
    build:
      context: .
      dockerfile: Dockerfile
    command: python recursos/observabilidad/ai_log_watcher.py
    ports:
      - "9050:9050"
    environment:
      - COOLIFY_WEBHOOK_SECRET=secreto_seguro_vps
      - DISCORD_WEBHOOK_URL=\${DISCORD_WEBHOOK_URL}
    restart: unless-stopped`
            },
            {
                type: "steps",
                title: "Paso a Paso del Aprendiz: De Código a Observabilidad en Coolify con IA",
                intro: "Aprende el flujo completo para monitorear tus contenedores desplegados en un servidor VPS usando Coolify y triaje con IA.",
                steps: [
                    {
                        number: 1,
                        title: "Instrumentar la aplicación con logs estructurados JSON",
                        tag: "Paso 1: Código",
                        desc: "Integra `JSONFormatter` y `FlaskObservability` en tu servidor Flask. Cada línea de log se emitirá como un objeto JSON con timestamp ISO y correlación `X-Request-ID`.",
                        command: "python recursos/observabilidad/app_flask_ejemplo.py",
                        tip: "Los logs en JSON eliminan errores de parseo por saltos de línea cuando una excepción Python imprime un stack trace largo.",
                        pitfall: "Usar prints simples sin timestamp; en contenedores Docker es imposible saber cuándo ocurrió el fallo."
                    },
                    {
                        number: 2,
                        title: "Desplegar Dozzle para inspección visual de logs en tiempo real",
                        tag: "Paso 2: Contenedor",
                        desc: "Despliega Dozzle montando `/var/run/docker.sock`. Te permite buscar y filtrar logs de todos los contenedores desde tu navegador web sin abrir sesiones SSH.",
                        command: "docker compose -f recursos/observabilidad/docker-compose.observability.yml up -d dozzle",
                        tip: "Dozzle consume menos de 15MB de memoria RAM y soporta filtros con expresiones regulares y streaming en vivo.",
                        pitfall: "Dejar Dozzle público sin configurar credenciales de autenticación básica (DOZZLE_USERNAME y DOZZLE_PASSWORD)."
                    },
                    {
                        number: 3,
                        title: "Configurar Webhooks de incidentes en Coolify",
                        tag: "Paso 3: Coolify",
                        desc: "En el panel de Coolify ve a Notificaciones > Webhook. Registra la URL del agente de IA (`http://localhost:9050/webhook/coolify`) y activa los eventos 'Deployment failure' y 'Restart limit reached'.",
                        command: "curl -X POST http://localhost:9050/webhook/coolify -H 'Content-Type: application/json' -d '{\"event\":\"restart_limit_reached\",\"application_name\":\"catalogo-flask\"}'",
                        tip: "El evento 'Restart limit reached' detecta cuando un contenedor cae repetidamente en un Crash-Loop antes de saturar el VPS.",
                        pitfall: "No validar el header X-Coolify-Secret en el webhook, exponiendo el servidor de IA a peticiones maliciosas."
                    },
                    {
                        number: 4,
                        title: "Activar el Agente AI SRE para triaje y remediación asistida",
                        tag: "Paso 4: Diagnóstico IA",
                        desc: "Inicia `ai_log_watcher.py`. Al recibir una alerta de Coolify, extrae las últimas 50 líneas del log, deduplica por huella SHA-256 y emite el informe estructurado (Causa Raíz, Severidad y Parche sugerido).",
                        command: "python recursos/observabilidad/ai_log_watcher.py --test",
                        tip: "La huella SHA-256 evita que el agente de IA gaste tokens procesando 50 veces el mismo error que se repite en bucle.",
                        pitfall: "Aplicar parches de código propuestos por la IA a ciegas sin verificar con la suite de pruebas unitarias (`pytest tests/`)."
                    }
                ]
            },
            {
                type: "tools",
                title: "Stack de Observabilidad Post-Despliegue",
                stack: [
                    {
                        icon: "🐳", name: "Coolify", tag: "PaaS / VPS",
                        role: "Plataforma self-hosted para desplegar contenedores, gestionar variables de entorno y emitir webhooks de ciclo de vida.",
                        when: "Despliegues en servidores VPS propios (Hetzner, DigitalOcean, AWS)."
                    },
                    {
                        icon: "📋", name: "Dozzle", tag: "Log Viewer",
                        role: "Visor ligero de logs en tiempo real para Docker con búsqueda y filtros instantáneos.",
                        when: "Inspección operativa sin necesidad de configurar stacks pesados como ELK o Grafana Loki."
                    },
                    {
                        icon: "🤖", name: "AI Log Watcher", tag: "AI SRE",
                        role: "Daemon multihilo que escucha eventos de Coolify y analiza logs con modelos LLM para generar diagnósticos RCA.",
                        when: "Respuesta a incidentes y triaje automatizado 24/7."
                    }
                ]
            }
        ]
    },

    "m-ia-testing": {
        title: "IA en Testing: Tu Copiloto de Calidad",
        badge: "Modulo IA",
        intro: "La IA generativa puede escribir tests, encontrar bugs y sugerir casos borde. Pero TU decides que es correcto.",
        blocks: [
            {
                type: "alert", variant: "info",
                title: "La IA NO reemplaza al tester — lo potencia",
                body: "Un tester que usa IA estrategicamente es 3x mas productivo. Pero la IA alucina, inventa asserts incorrectos, y genera codigo que parece correcto pero no lo es. TU eres el guardia de calidad."
            },
            {
                type: "steps",
                title: "Paso a Paso del Aprendiz: Auditoría de Calidad y Código con IA usando qa_auditor",
                intro: "Aprende a ejecutar el sistema de auditoría multidimensional en 9 dimensiones (OWASP, mantenibilidad y alucinaciones de IA) con compuerta de calidad.",
                steps: [
                    {
                        number: 1,
                        title: "Localizar y entender el auditor multidimensional",
                        tag: "Paso 1: Arquitectura",
                        desc: "El auditor reside en `recursos/auditoria-seguridad/` y evalúa 9 dimensiones ponderadas: seguridad (OWASP), funcionalidad, fiabilidad, mantenibilidad y riesgos específicos de código generado por IA.",
                        command: "cd recursos/auditoria-seguridad; python -m qa_auditor --help",
                        tip: "El auditor calcula un score global de 0 a 100% y un índice específico de seguridad.",
                        pitfall: "Modificar los pesos de las dimensiones sin comprender que la seguridad y el código IA tienen mayor ponderación por su impacto en producción."
                    },
                    {
                        number: 2,
                        title: "Ejecutar escaneo estático del código fuente",
                        tag: "Paso 2: Análisis Estático",
                        desc: "Ejecuta el auditor apuntando a la carpeta de tu aplicación para detectar secretos expuestos, SQL injection potencial, funciones muertas y módulos sobredimensionados.",
                        command: "python -m qa_auditor --target ../codigo-ejemplo",
                        tip: "El reporte muestra exactamente el archivo y número de línea de cada debilidad junto con su severidad (ALTA, MEDIA, BAJA) y el remedio sugerido.",
                        pitfall: "Ignorar las advertencias de imports alucinados en código sugerido por asistentes de IA."
                    },
                    {
                        number: 3,
                        title: "Auditoría dinámica en caliente contra el servidor en vivo",
                        tag: "Paso 3: Análisis Dinámico",
                        desc: "Levanta tu servicio web y agrega el parámetro `--url http://localhost:8000` para verificar cabeceras HTTP de seguridad (HSTS, CSP, X-Frame-Options) y cookies seguras.",
                        command: "python -m qa_auditor --target ../codigo-ejemplo --url http://localhost:8000",
                        tip: "Verificar cabeceras en caliente te alerta si tu API expone detalles técnicos del servidor o permite incrustación en iframes maliciosos (Clickjacking).",
                        pitfall: "Hacer auditorías de seguridad únicamente sobre el código estático sin comprobar cómo responde el servidor en tiempo de ejecución."
                    },
                    {
                        number: 4,
                        title: "Detectar código IA defectuoso (Tests Vacíos y TODOs)",
                        tag: "Paso 4: Auditoría de IA",
                        desc: "Revisa la sección 'ia' del informe: detecta tests que pasan en verde pero no tienen aserciones, funciones con `pass` o `NotImplementedError` y mocks ficticios.",
                        command: "python -m qa_auditor --target ../codigo-ejemplo --json informe.json",
                        tip: "Un test generado por IA suele incluir `assert True` o no incluir ningún `assert`. `qa_auditor` los marca como hallazgo crítico.",
                        pitfall: "Aceptar sugerencias de código de IA sin verificar que contengan lógica real y no plantillas vacías."
                    },
                    {
                        number: 5,
                        title: "Establecer la compuerta de calidad mínima (--min-score)",
                        tag: "Paso 5: Quality Gate",
                        desc: "Integra el auditor en tu terminal o CI exigiendo una calificación mínima (ej. 80%). Si el score no se alcanza, el comando devuelve código de salida distinto de 0.",
                        command: "python -m qa_auditor --target ../codigo-ejemplo --min-score 80 --html informe.html",
                        tip: "El archivo `informe.html` generado proporciona un panel visual completo para presentar ante instructores o comités de calidad.",
                        pitfall: "Dejar que el score caiga por debajo de 80% acumulando deuda técnica hasta el final de la formación."
                    }
                ]
            },
            {
                type: "code", lang: "text", file: "prompts/prompt_testing.txt",
                title: "Prompt estrategico: Generar tests unitarios",
                code: `Actua como un ingeniero QA senior experto en PyTest.

Contexto: Tengo una API FastAPI con este endpoint:

[PEGA TU CODIGO AQUI]

Genera tests unitarios con PyTest que cubran:
1. Caso feliz (status 200, estructura JSON correcta)
2. Caso borde (datos faltantes, tipos incorrectos)
3. Caso de error (404, 422, 500)
4. Inyeccion SQL (si aplica)
5. Autenticacion (si aplica: token valido, expirado, sin token)

Usa pytest fixtures, TestClient, y SQLite en memoria.
Asegura que cada test sea independiente (no compartan estado).
Incluye docstring explicando que prueba cada test.`
            },
            {
                type: "code", lang: "text", file: "prompts/prompt_bug.txt",
                title: "Prompt estrategico: Debuggear un test fallido",
                code: `Tengo un test que falla intermitentemente:

\`\`\`
[PEGA EL LOG DEL TEST AQUI]
\`\`\`

1. Analiza la causa raiz del fallo intermitente (flaky test)
2. Sugiere 3 formas de hacerlo deterministico
3. Cual es la mejor practica para evitar este tipo de tests?`
            },
            {
                type: "code", lang: "text", file: "prompts/prompt_sre_coolify.txt",
                title: "Prompt estrategico: Triaje de Logs y Crash en Coolify con IA (AI SRE)",
                code: `Actua como un Ingeniero Senior SRE especializado en Docker, Flask y Coolify.

Contexto del Incidente:
- Contenedor: catalogo-flask-api
- Evento Coolify: restart_limit_reached (Crash-loop)
- Ultimas 50 lineas de log:
[PEGA AQUI LOS LOGS DE COOLIFY / DOCKER]

Proporciona un diagnostico en JSON estructurado:
1. Severidad (CRITICAL, HIGH, MEDIUM, LOW)
2. Causa Raiz exacta del fallo (excepcion, memoria OOM, timeout de DB)
3. Impacto en el servicio
4. Accion inmediata en Coolify (aumentar Memory Limit, ajustar variables de entorno o reiniciar DB)
5. Parche de codigo sugerido para evitar que vuelva a ocurrir.`
            },
            {
                type: "code", lang: "text", file: "prompts/prompt_coverage.txt",
                title: "Prompt estrategico: Mejorar cobertura",
                code: `Tengo este reporte de cobertura:

[PEGA EL REPORTE AQUI - muestra las lineas no cubiertas]

Para cada archivo con cobertura < 80%:
1. Identifica las funciones/metodos no cubiertos
2. Sugiere casos de prueba especificos para cada uno
3. Prioriza por riesgo de negocio

Ademas, identifica:
- Codigo muerto (no cubierto ni ejecutable)
- Codigo defensivo innecesario
- Posibles bugs en lineas no cubiertas`
            },
            {
                type: "alert", variant: "warning",
                title: "⚠️ Las 3 reglas de oro para usar IA en Testing",
                body: "1. NUNCA confies en un test generado por IA sin revisarlo manualmente. La IA inventa asserts que siempre pasan. 2. LA IA alucina nombres de funciones, metodos y librerias que no existen. Verifica cada import. 3. SIEMPRE pregunta a la IA 'Por que este test pasaria si el codigo esta roto?' — si no sabe explicarlo, el test es inutil."
            },
            {
                type: "alert", variant: "info",
                title: "¿En que contextos usar IA en Testing?",
                body: "IDEAL: generar el primer borrador de tests para funciones nuevas, complementar casos borde (tabla de decision, particiones), redactar prompts para reportes de cobertura y analizar logs de tests flaky. PRUDENCIA: IA como autoridad final sobre correctitud de contratos o validaciones de negocio, y NUNCA en secretos/credenciales del proyecto. Workflow V.E.R.A.: revisar el resultado, ejecutar la suite y llevar la bitacora en docs/ai-log.md."
            },
            {
                type: "timeline",
                title: "Historia: la IA entra a la disciplina de prueba",
                items: [
                    { year: "2017", title: "Code completion y el test autogenerado", desc: "Kite y Tabnine sugieren codigo; Diffblue Cover (2017) lanza la primera generacion industrial de tests unitarios Java." },
                    { year: "2021", title: "Copilot escribe los primeros tests", desc: "GitHub Copilot (Codex/OpenAI) autocompleta en el editor; los equipos descubren que tambien propone tests — y que deben revisarlos." },
                    { year: "2022-2023", title: "LLM como QA assistant", desc: "ChatGPT y modelos generativos responden sobre reports de cobertura y logs flak; los prompts estructurados (como los de este modulo) se vuelven skill." },
                    { year: "2024", title: "Agentes de testing autosuficientes", desc: "Agentes (Devin, SWE-agent) corren la suite, corrigen tests rotos y abren el PR; la orquestacion y la evaluacion humana determinan que la calidad no se diluya." },
                    { year: "Hoy", title: "TDD con superpoderes", desc: "La mejor practica madura: IA para la 'red' y la velocidad, humano para el contrato: lo que se va a decir que tenga valor para el negocio." }
                ]
            }
        ]
    },

    "m-reto": {
        title: "Reto Final: Pipeline QA Completo",
        badge: "Modulo 13",
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
                body: "1. Tests unitarios (PyTest + Jest + JUnit) con cobertura 80%+. 2. Tests E2E con Playwright (al menos 3 flujos criticos). 3. Pipeline GitHub Actions funcional. 4. README con instrucciones. 5. Reporte de cobertura HTML."
            },
            {
                type: "alert", variant: "warning",
                title: "Rúbrica de Evaluación",
                body: "Cobertura 80%+ (25 pts) | Tests unitarios significativos (25 pts) | E2E automatizados (20 pts) | Pipeline CI/CD funcional (20 pts) | Documentacion (10 pts)"
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
