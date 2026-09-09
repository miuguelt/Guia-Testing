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
        "email": "<CORREO_DE_PRUEBA>",
        "password": "<CONTRASEÑA_DE_PRUEBA>"
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
        title: "Playwright con Flask y Jinja",
        badge: "Modulo 9",
        intro: "Si ya dominas Flask, conserva ese mapa mental: ruta Flask -> render_template() -> HTML Jinja -> accion del usuario -> nueva peticion. Playwright automatiza y comprueba ese recorrido en un navegador real.",
        blocks: [
            {
                type: "alert", variant: "info",
                title: "Qué prueba cada herramienta",
                body: "PyTest con test_client comprueba reglas, validaciones y respuestas del servidor sin red. Playwright comprueba el camino crítico que una persona recorre en la interfaz. No son rivales: una misma funcionalidad puede necesitar las dos pruebas, con responsabilidades distintas."
            },
            {
                type: "diagram",
                diagramType: "flask-playwright-flow",
                title: "Del endpoint al navegador",
                body: "@app.get('/productos') -> render_template('productos.html') -> el navegador recibe HTML -> locator.fill() y locator.click() -> Flask recibe request.form -> redirect() o flash() -> expect() comprueba la respuesta visible."
            },
            {
                type: "comparison",
                title: "Correspondencia Flask/Jinja y Playwright",
                headers: ["En Flask/Jinja", "En Playwright", "Qué se comprueba"],
                rows: [
                    ["@app.get('/productos')", "page.goto('/productos')", "La ruta carga."],
                    ["render_template()", "getByRole() / getByTestId()", "El HTML existe y es localizable."],
                    ["<label for=\"nombre\"> + <input id=\"nombre\">", "getByLabel('Nombre')", "El campo es usable como lo percibe el usuario."],
                    ["<form method=\"post\"> + request.form", "fill() + click()", "El formulario se diligencia y se envía."],
                    ["redirect(url_for(...))", "expect(page).toHaveURL(...)", "La navegación termina en la URL correcta."],
                    ["flash() mostrado por Jinja", "getByRole('status'/'alert')", "El éxito o el error se comunica." ]
                ]
            },
            {
                type: "tools",
                title: "Herramientas esenciales: un modelo mental por pieza",
                stack: [
                    { icon: "🧪", name: "test y fixtures", tag: "organización", role: "Define el caso, su preparación y su limpieza.", when: "Aislar cada flujo Flask para que una prueba no contamine a otra." },
                    { icon: "🌐", name: "browser y context", tag: "aislamiento", role: "browser es el motor; context separa cookies, almacenamiento y permisos.", when: "Probar usuarios o sesiones independientes sin compartir estado." },
                    { icon: "📄", name: "page", tag: "pestaña", role: "Representa una pestaña y permite navegar, escribir, hacer clic y observar.", when: "Seguir el recorrido completo de una persona por la aplicación." },
                    { icon: "🎯", name: "locator", tag: "elemento", role: "Es una referencia viva a un elemento del DOM con espera automática.", when: "Localizar labels, botones, filas y mensajes sin depender de la maquetación." },
                    { icon: "✅", name: "expect", tag: "aserción", role: "Comprueba URL, texto, visibilidad y estados esperando a que la web esté lista.", when: "Demostrar el resultado observable de una ruta o un formulario." },
                    { icon: "🔌", name: "request", tag: "HTTP auxiliar", role: "Cliente HTTP para preparar datos o consultar un endpoint sin abrir la interfaz.", when: "Reducir el tiempo de preparación, no reemplazar el flujo que se quiere demostrar." },
                    { icon: "🛣️", name: "page.route", tag: "red", role: "Intercepta una petición para continuarla, modificarla o aislar una dependencia externa.", when: "Controlar un servicio de terceros; no ocultar los errores propios de Flask." },
                    { icon: "🔎", name: "trace, report y codegen", tag: "diagnóstico", role: "Generan evidencia: acciones, DOM, consola, red, capturas y video.", when: "Entender por qué falló un selector, un redirect o una respuesta visual." }
                ]
            },
            {
                type: "steps",
                title: "Paso a paso: de una ruta Flask a un E2E confiable",
                intro: "Avanza en este orden: primero el HTML y el contrato del usuario; después la interacción; por último el diagnóstico.",
                steps: [
                    {
                        number: 1,
                        title: "Abrir el ejemplo Flask/Jinja",
                        tag: "Orientar",
                        desc: "Usa recursos/codigo-ejemplo/flask_jinja_demo/. Tiene productos, formulario POST, validación, redirect, flash y plantillas Jinja. Lee primero app.py y después productos.html.",
                        tip: "El comportamiento de Flask es la fuente de verdad; Playwright solo lo observa desde fuera.",
                        pitfall: "Empezar por un selector sin saber qué requisito debe demostrar el test."
                    },
                    {
                        number: 2,
                        title: "Instalar el ejecutor y Chromium",
                        tag: "Preparar",
                        desc: "Instala Playwright como dependencia de desarrollo y descarga el navegador. Define FLASK_SECRET_KEY solo en el entorno local porque flash() usa la sesión firmada de Flask.",
                        command: "npm install -D @playwright/test; npx playwright install chromium; $env:FLASK_SECRET_KEY = \"<CLAVE_LOCAL_DE_PRUEBA>\"",
                        tip: "Una clave local o efímera nunca debe ser una credencial de producción ni quedar guardada en Git.",
                        pitfall: "Olvidar npx playwright install: el ejecutor estará instalado, pero no tendrá el navegador."
                    },
                    {
                        number: 3,
                        title: "Conectar Playwright con flask run",
                        tag: "Configurar",
                        desc: "playwright.flask.config.js define baseURL, captura en fallos, video, trace y webServer. webServer inicia Flask antes de los tests y permite usar page.goto('/productos').",
                        command: "npx playwright test --config=playwright.flask.config.js",
                        tip: "Una sola baseURL evita repetir host y puerto en todos los casos.",
                        pitfall: "Usar una URL absoluta distinta en cada test: los casos se vuelven difíciles de mover a CI."
                    },
                    {
                        number: 4,
                        title: "Localizar con intención de usuario",
                        tag: "Interactuar",
                        desc: "Prefiere getByRole, getByLabel y getByText; usa getByTestId cuando necesitas un contrato explícito. Las etiquetas label for= y los roles HTML de la plantilla Jinja hacen la interfaz más accesible y el test más estable.",
                        tip: "Un buen localizador explica qué control usa la persona, no dónde quedó dibujado.",
                        pitfall: "Usar XPath o div > ul > li:nth-child(2): cualquier cambio de maquetación rompe el test."
                    },
                    {
                        number: 5,
                        title: "Afirmar el flujo Flask completo",
                        tag: "Verificar",
                        desc: "Después del click comprueba la URL del redirect, el mensaje flash y la fila que Jinja agregó. En el caso inválido comprueba el alert y que el producto no apareció.",
                        command: "npx playwright test --config=playwright.flask.config.js --ui",
                        tip: "Cada acción importante necesita una aserción observable; hacer click no demuestra que el servidor aceptó los datos.",
                        pitfall: "Usar esperas fijas con setTimeout: hacen el test lento y esconden problemas de sincronización."
                    },
                    {
                        number: 6,
                        title: "Preparar datos sin deformar el objetivo",
                        tag: "Separar responsabilidades",
                        desc: "Usa request para preparar un estado o consultar un endpoint, y context para aislar cookies y almacenamiento. Si el objetivo es comprobar el formulario, el alta debe ocurrir con page y no con request.",
                        tip: "La preparación por HTTP ahorra tiempo; el camino crítico siempre debe conservar la interfaz que se quiere verificar.",
                        pitfall: "Crear el registro con request y luego declarar que se probó el formulario: solo se probó la API."
                    },
                    {
                        number: 7,
                        title: "Diagnosticar y conservar evidencia",
                        tag: "Transferir",
                        desc: "Usa headed para ver el navegador, UI para avanzar paso a paso, codegen para descubrir una interacción y show-report para abrir la traza, la consola, las peticiones y las capturas.",
                        command: "npx playwright test --config=playwright.flask.config.js --headed; npx playwright show-report",
                        tip: "Primero clasifica el fallo: vista Flask, HTML/Jinja, localizador, sincronización o aserción.",
                        pitfall: "Borrar test-results/ antes de revisar la causa de un fallo en CI."
                    }
                ]
            },
            {
                type: "code", lang: "python", file: "flask_jinja_demo/app.py",
                title: "La vista Flask que el navegador recorrerá",
code: `@app.route("/productos", methods=["GET", "POST"])
def products_view():
    products = session.get("products", [])
    if request.method == "POST":
        name = request.form.get("nombre", "").strip()
        price = float(request.form.get("precio", "0"))
        if price <= 0:
            flash("El precio debe ser mayor que cero.", "error")
            return render_template("productos.html", products=products), 400
        products.append({"nombre": name, "precio": f"{price:.2f}"})
        session["products"] = products
        flash("Producto creado.", "success")
        return redirect(url_for("products_view"))
    return render_template("productos.html", products=products)`
            },
            {
                type: "code", lang: "html", file: "flask_jinja_demo/templates/productos.html",
                title: "La plantilla Jinja expone contratos accesibles",
                code: `{% extends "base.html" %}
{% block content %}
  <h1>Productos</h1>
  <form method="post" aria-label="Crear producto">
    <label for="nombre">Nombre</label>
    <input id="nombre" name="nombre" required>
    <label for="precio">Precio</label>
    <input id="precio" name="precio" type="number" required>
    <button type="submit">Guardar producto</button>
  </form>
  <section aria-label="Lista de productos" data-testid="lista-productos">
    {% if products %}
      {% for product in products %}
        <li data-testid="producto-row">{{ product.nombre }}</li>
      {% endfor %}
    {% else %}
      <p>No hay productos.</p>
    {% endif %}
  </section>
{% endblock %}`
            },
            {
                type: "code", lang: "javascript", file: "tests/e2e/flask_jinja.spec.js",
                title: "El spec comprueba resultados, no solo acciones",
                code: `import { test, expect } from "@playwright/test";

test("crea un producto y sigue el redirect de Flask", async ({ page }) => {
  await page.goto("/productos");
  await page.getByLabel("Nombre").fill("Teclado");
  await page.getByLabel("Precio").fill("45");
  await page.getByRole("button", { name: "Guardar producto" }).click();

  await expect(page).toHaveURL(/\\/productos$/);
  await expect(page.getByRole("status")).toContainText("Producto creado");
  await expect(page.getByTestId("producto-row")).toContainText("Teclado");
});`
            },
            {
                type: "alert", variant: "warning",
                title: "Checklist antes de entregar",
                body: "El test inicia con un estado conocido; usa localizadores accesibles; evita esperas fijas; afirma URL y resultado visible; separa server-side de E2E; conserva report, video o trace cuando falla; y nunca incluye credenciales reales."
            },
            {
                type: "alert", variant: "info",
                title: "Comandos del laboratorio",
                body: "npx playwright test --config=playwright.flask.config.js | --headed para ver el navegador | --ui para depurar paso a paso | codegen para descubrir acciones | show-report para revisar la evidencia"
            }
        ]
    },

    "m-cobertura": {
        title: "Cobertura y Metricas de Calidad",
        badge: "Modulo 10",
        intro: "Mide qué porcentaje de tu código está cubierto por tests. Umbral didáctico orientativo: 80% o más en lógica de negocio.",
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
                body: "EL MITO DE LA SEGURIDAD POR OSCURIDAD: Ocultar los tests pensando que 'los atacantes sabrán cómo atacarnos o qué validaciones tenemos' es una falacia que viola el Principio de Kerckhoffs. Un software debe ser seguro por su arquitectura, validación de entradas, sanitización y control de accesos, NO por mantener el código o las pruebas en secreto. Los atacantes modernos usan herramientas automatizadas (Burp Suite, OWASP ZAP, SQLmap) que descubren fallas de seguridad en segundos sin necesidad de leer tus pruebas. Si una prueba demuestra que un endpoint no valida permisos o que un parámetro es vulnerable a inyección SQL, la vulnerabilidad está en el código de producción expuesto a internet, no en el test.\n\nLOS 3 RIESGOS REALES QUE SÍ PUEDEN AYUDAR A UN ATACANTE:\n1. Secretos quemados (Hardcoded Secrets): Dejar credenciales reales de staging o producción ('<CONTRASEÑA_REAL>', claves de Stripe o AWS) en los tests pensando que 'solo es un archivo de prueba'. Si el repositorio se filtra o es público, el atacante tiene acceso directo.\n2. Fuga de PII en fixtures: Exportar tablas reales de clientes con correos, nombres o teléfonos para usarlos como datos de test (grave violación de normativas GDPR y Habeas Data).\n3. Endpoints de depuración huérfanos: Rutas como '/api/dev/reset-database' o '/admin/bypass-auth' probadas en tests pero que quedaron activas y desprotegidas en producción.\n\nSOLUCIÓN: Usa siempre generadores de datos sintéticos (Faker), inyecta credenciales efímeras mediante GitHub Secrets y simula servicios externos con Mocks y Stubs."
            },
            {
                type: "comparison",
                title: "🌐 Repositorios Públicos vs. Privados en Git: ¿Qué tan recomendable es hacer público tu código?",
                headers: ["Criterio de Evaluación", "Repositorio Público", "Repositorio Privado", "Recomendación para el Aprendiz / Desarrollador"],
                rows: [
                    ["Portafolio y Empleabilidad", "⭐⭐⭐⭐⭐ Máxima visibilidad: Demuestra a reclutadores código limpio, pruebas con >=80% de cobertura y CI/CD verde.", "❌ Invisible para reclutadores sin invitación o acceso explícito.", "Haz públicos solo los proyectos de práctica que no contengan información sensible; la decisión no sustituye la valoración de competencias."],
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
      - COOLIFY_WEBHOOK_SECRET=\${COOLIFY_WEBHOOK_SECRET}
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
        badge: "Modulo 13 · IA",
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

    "m-gema-testing": {
        title: "Constructor de Gema QA: de requisitos a pruebas",
        badge: "Modulo 14 · taller interactivo",
        intro: "Construye una Gema de IA que te haga las preguntas correctas, convierta tus riesgos en una estrategia de pruebas y te entregue un encargo verificable para tu proyecto.",
        blocks: [
            {
                type: "alert", variant: "info",
                title: "La mejor opción es un flujo, no una herramienta mágica",
                body: "Para un aprendiz, la opción más segura es conservar el ejecutor del proyecto (PyTest, Vitest/Jest, JUnit o Playwright) y usar la IA como copiloto: primero entender, luego planear, después generar por capas y finalmente ejecutar y revisar. La Gema es independiente del proveedor para que puedas cambiar de asistente sin cambiar la disciplina."
            },
            { type: "ai-coach" },
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
    },

    "m-herramientas-ia": {
        title: "Laboratorio de herramientas IA para calidad",
        badge: "Modulo 15 · elección informada",
        intro: "Conoce herramientas parecidas a una Gema, aprende qué construyen y escoge la que encaja con el lenguaje, la capa de pruebas y el nivel de control que necesita tu proyecto.",
        blocks: [
            {
                type: "alert", variant: "info",
                title: "Mapa rápido para el aprendiz",
                body: "Asistentes y agentes (GitHub Copilot, Cursor, Gemini Code Assist, Claude Code y Amazon Q) ayudan a entender y escribir. Qodo revisa cambios y reglas. Diffblue Cover se especializa en unitarias Java/Kotlin. mabl ayuda a planear y autorizar pruebas de navegador y API. Ninguna herramienta decide por sí sola si el requisito de negocio está cumplido."
            },
            { type: "tool-lab" },
            {
                type: "comparison",
                title: "Cómo escoger sin perseguir la novedad",
                headers: ["Necesidad", "Primera opción para aprender", "Qué debe verificar el aprendiz"],
                rows: [
                    ["Escribir una primera prueba en un archivo del IDE", "Copilot, Cursor o Gemini Code Assist", "Imports reales, aserciones, comando y resultado."],
                    ["Trabajar con un proyecto Java/Kotlin grande", "Diffblue Cover + JUnit", "Que compile, que la prueba valide una regla útil y que no capture un defecto como si fuera contrato."],
                    ["Revisar código generado contra requisitos y reglas", "Qodo o Amazon Q", "Hallazgos reproducibles, severidad y pruebas de regresión."],
                    ["Automatizar un viaje visible de navegador o una API", "Playwright para aprender código; mabl para explorar autoría asistida", "Aserciones observables, datos ficticios, costos y privacidad."],
                    ["Aprender sin depender de una cuenta paga", "Framework local + cualquier asistente aprobado", "Que el proyecto siga siendo ejecutable sin el proveedor de IA." ]
                ]
            },
            {
                type: "steps",
                title: "Ruta práctica de herramientas",
                intro: "Construye criterio antes de aumentar la autonomía.",
                steps: [
                    { number: 1, title: "Identifica la capa y el lenguaje", tag: "Elegir", desc: "Escribe si necesitas unitarias, integración, E2E, revisión o seguridad y confirma el lenguaje y el ejecutor del proyecto.", tip: "Si no puedes nombrar la capa, todavía estás definiendo el problema.", pitfall: "Escoger una herramienta porque generó más líneas de código." },
                    { number: 2, title: "Prueba una tarea pequeña y medible", tag: "Experimentar", desc: "Usa una función o un flujo pequeño. Mide si la respuesta compila, corre, cubre un riesgo y es entendible para ti.", tip: "Pide primero un plan y después el código; así puedes comparar intención contra resultado.", pitfall: "Entregar acceso a todo el repositorio cuando solo necesitas un archivo." },
                    { number: 3, title: "Compara la propuesta con tu suite", tag: "Contrastar", desc: "Ejecuta el comando real, revisa la diferencia y agrega un caso que la IA no haya visto. Si hay un fallo, clasifícalo como aplicación, prueba o ambiente.", tip: "Una prueba adicional escrita por ti es una forma concreta de aprender a evaluar la IA.", pitfall: "Aceptar un parche automático sin mirar el diff." },
                    { number: 4, title: "Registra decisión y límites", tag: "Transferir", desc: "Documenta por qué elegiste la herramienta, qué datos compartiste, qué costos o cuentas exige y qué verificación humana quedó pendiente.", tip: "La herramienta debe poder cambiarse sin perder tus requisitos ni tu suite.", pitfall: "Convertir la cuenta o el servicio en la única fuente de verdad del proyecto." }
                ]
            },
            {
                type: "alert", variant: "warning",
                title: "Disponibilidad y planes cambian",
                body: "Las fichas del laboratorio enlazan documentación oficial consultada en 2026. Antes de usar una herramienta en clase, confirma versión, licencia, país, privacidad, límites de uso e integración con tu entorno."
            }
        ]
    },

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
