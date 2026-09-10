// Continuación: E2E y cobertura. Los demás temas viven en catálogos propios.
Object.assign(window.MODULES, {
    "m-playwright": {
        title: "Playwright con Flask y Jinja",
        badge: "Modulo 9",
        intro: "Si ya dominas Flask, conserva ese mapa mental: ruta Flask -> render_template() -> HTML Jinja -> accion del usuario -> nueva peticion. Playwright automatiza y comprueba ese recorrido en un navegador real.",
        blocks: [
            {
                type: "definition",
                title: "E2E: entiende la palabra antes de escribir el comando",
                intro: "E2E es la abreviatura de End-to-End. Se lee ‘de extremo a extremo’: la prueba entra por el mismo lugar que una persona y comprueba el resultado al final del recorrido.",
                pieces: [
                    {
                        letter: "E",
                        term: "End",
                        translation: "extremo / punto del recorrido",
                        meaning: "Señala el inicio o el final de una experiencia completa.",
                        analogy: "Como revisar un viaje desde la puerta de la casa hasta llegar al destino, no solo el motor del carro.",
                        example: "La prueba inicia en la pantalla de productos y termina cuando aparece la fila creada."
                    },
                    {
                        letter: "→",
                        term: "to",
                        translation: "hacia / conecta",
                        meaning: "Une los pasos que ocurren entre el inicio y el final.",
                        analogy: "Es la carretera que conecta la casa, la vía y el destino; si un puente falla, el viaje completo se detiene.",
                        example: "El navegador conecta llenar el formulario, enviar la petición y recibir la respuesta."
                    },
                    {
                        letter: "E",
                        term: "End",
                        translation: "resultado final",
                        meaning: "Confirma si la persona logró su objetivo observable, no solo si se ejecutó una función.",
                        analogy: "Llegar al destino y comprobar que la reserva quedó confirmada, no asumirlo porque el carro arrancó.",
                        example: "expect(page.getByTestId('producto-row')).toContainText('Teclado')."
                    }
                ]
            },
            {
                type: "mental-map",
                title: "Mapa mental: qué conecta una prueba E2E",
                body: "Lee el mapa de izquierda a derecha: la persona provoca una acción, el sistema la procesa y la aserción convierte una observación en evidencia.",
                center: "Objetivo logrado",
                accessibleText: "Persona, navegador, localizador, acción, sistema y aserción se conectan para comprobar un objetivo completo.",
                nodes: [
                    { title: "Persona", detail: "Tiene un objetivo" },
                    { title: "Navegador", detail: "Muestra la interfaz" },
                    { title: "Localizador", detail: "Encuentra el control" },
                    { title: "Aserción", detail: "Prueba el resultado" }
                ]
            },
            {
                type: "alert", variant: "info",
                title: "Qué prueba cada herramienta y por qué no debes mezclarlas",
                body: "PyTest con test_client comprueba reglas, validaciones y respuestas del servidor sin abrir un navegador. Playwright comprueba el camino crítico que una persona recorre en la interfaz. No son rivales: una misma funcionalidad puede necesitar las dos pruebas, con responsabilidades distintas. Practica el recorrido completo en el Simulador E2E de la sección Simuladores."
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
                type: "glossary",
                title: "Glosario E2E: una palabra, una imagen y una decisión",
                intro: "Abre una tarjeta o escribe una palabra. Usa la analogía para formar la imagen mental y el ejemplo para reconocerla en el código.",
                entries: [
                    { term: "Prueba E2E", alias: "End-to-End", meaning: "Comprueba un flujo completo desde la interfaz hasta el resultado que ve la persona.", analogy: "Un inspector recorre todo el servicio de un restaurante: pedir, cocinar, entregar y cobrar.", example: "page.goto → fill → click → expect visible." },
                    { term: "Navegador", alias: "browser", meaning: "Programa que interpreta HTML, CSS y JavaScript y muestra una página.", analogy: "Es el vehículo real que usa la persona para entrar al sistema.", example: "browser.newContext() crea una sesión aislada." },
                    { term: "DOM", alias: "Document Object Model", meaning: "Representación en forma de árbol de los elementos que componen la página.", analogy: "Es el plano de una casa: permite ubicar la puerta, la cocina y una habitación.", example: "Un botón forma parte del DOM y puede tener texto y rol." },
                    { term: "Localizador", alias: "locator", meaning: "Referencia que permite encontrar un elemento del DOM y actuar sobre él.", analogy: "Es una dirección; getByLabel('Precio') busca por el nombre que entiende una persona.", example: "page.getByRole('button', { name: 'Guardar' }).click()." },
                    { term: "Aserción", alias: "assertion / expect", meaning: "Comprobación que compara lo observado con lo esperado y puede hacer fallar la prueba.", analogy: "Es la pregunta final del inspector: ¿la reserva aparece como confirmada?", example: "expect(page).toHaveURL(/productos$/)." },
                    { term: "Fixture", alias: "preparación", meaning: "Dato o recurso preparado antes de una prueba y limpiado al terminar.", analogy: "Es organizar la mesa y tener los ingredientes listos antes de cocinar.", example: "page y browser vienen como fixtures de Playwright." },
                    { term: "Contexto", alias: "browser context", meaning: "Sesión aislada con sus propias cookies, almacenamiento y permisos.", analogy: "Es una habitación separada: dos huéspedes no comparten sus llaves ni sus pertenencias.", example: "Un contexto por usuario evita que una sesión contamine otra." },
                    { term: "Headless", alias: "sin interfaz visible", meaning: "Modo en el que el navegador funciona sin mostrar una ventana, útil para CI.", analogy: "El conductor hace el recorrido con las luces apagadas para el público, pero los sensores siguen registrando todo.", example: "CI suele ejecutar Chromium headless y guardar la evidencia si falla." },
                    { term: "Espera automática", alias: "auto-waiting", meaning: "Playwright espera condiciones razonables del elemento antes de actuar, en vez de dormir un tiempo fijo.", analogy: "Esperar a que el ascensor llegue, no oprimir el botón y contar diez segundos.", example: "click() espera que el elemento sea visible y esté habilitado." },
                    { term: "Prueba frágil", alias: "brittle", meaning: "Prueba que se rompe por cambios internos o visuales aunque el comportamiento requerido siga correcto. Flaky describe, en cambio, resultados intermitentes sin cambios relevantes.", analogy: "Una alarma que se activa porque cambiaron el color de la puerta, no porque entró alguien.", example: "nth-child(2) suele ser más frágil que getByLabel('Precio')." },
                    { term: "Trace", alias: "traza", meaning: "Registro navegable de acciones, capturas, red, consola y DOM de una ejecución.", analogy: "Es la caja negra y el mapa de un viaje: permite reconstruir qué ocurrió.", example: "show-report ayuda a revisar una falla sin repetirla a ciegas." },
                    { term: "Servidor web", alias: "webServer", meaning: "Proceso que entrega la aplicación para que el navegador pueda visitarla.", analogy: "Es el local que debe abrir antes de que llegue el cliente.", example: "La configuración puede iniciar Flask antes de npx playwright test." }
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
                intro: "Aprende a medir qué porcentaje de código ejecutan tus pruebas y cómo aplicar un umbral contextual. El 80% es un ejemplo de esta práctica, no una exigencia institucional universal.",
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
    }
});
