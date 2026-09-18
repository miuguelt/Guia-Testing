// Continuación: E2E y cobertura. Los demás temas viven en catálogos propios.
Object.assign(window.MODULES, {
    "m-playwright": {
        title: "Playwright con Flask y Jinja",
        badge: "Estación 10/18 · Playwright",
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
                diagramType: "architecture",
                title: "Diagrama Visual: Arquitectura de Pruebas E2E con Playwright",
                nodes: [
                    { title: "🎭 Playwright Runner", detail: "Orquesta navegadores Chromium/Firefox/WebKit en modo headless o con UI interactiva." },
                    { title: "🌐 BrowserContext Aislado", detail: "Crea una sesión efímera independiente con cookies, almacenamiento y caché limpios." },
                    { title: "🔍 Locators Accesibles", detail: "Localiza por semántica de usuario con getByRole('button') y getByLabel() con auto-waiting nativo." },
                    { title: "✅ expect(page) Web-First", detail: "Reintenta aserciones automáticamente hasta confirmar URL, visibilidad de alertas o filas de la tabla." }
                ],
                body: "Playwright simula la interacción real del usuario sobre el navegador Chromium. La prueba interactúa con el formulario Jinja renderizado por Flask y verifica tanto las redirecciones de servidor como la aparición de mensajes de confirmación en el DOM."
            },
            {
                type: "case-study",
                title: "Caso Práctico Paso a Paso: Flujo E2E Completo de Solicitud de Préstamo con Playwright",
                context: "Automatizar el camino crítico del aprendiz: inicia sesión en el portal, navega a '/prestamos/nuevo', selecciona 3 laptops para el Laboratorio Sistemas-A, envía el formulario y verifica la redirección a '/prestamos/mis-solicitudes' junto con el mensaje de confirmación y la nueva fila en la tabla.",
                preconditions: [
                    "Servidor web local activo en 'http://127.0.0.1:5000' con base de datos de pruebas inicializada.",
                    "Playwright configurado con 'baseURL: http://127.0.0.1:5000' en 'playwright.config.js'.",
                    "Usuario de prueba 'aprendiz.adso' con credenciales válidas y rol estudiante activo."
                ],
                code: `import { test, expect } from "@playwright/test";

test("Aprendiz solicita exitosamente 3 laptops para laboratorio", async ({ page }) => {
    // 1. Navegar al formulario de login
    await page.goto("/login");
    await page.getByLabel("Correo Institucional").fill("aprendiz@sena.edu.co");
    await page.getByLabel("Contraseña").fill("PasswordSeguro123!");
    await page.getByRole("button", { name: /iniciar sesión/i }).click();

    // 2. Comprobar aterrizaje en dashboard y navegar a préstamos
    await expect(page).toHaveURL(/\\/dashboard$/);
    await page.getByRole("link", { name: /solicitar préstamo/i }).click();

    // 3. Diligenciar formulario de préstamo (Regla R-CANT: 3 unidades)
    await expect(page).toHaveURL(/\\/prestamos\\/nuevo$/);
    await page.getByLabel("Tipo de Equipo").selectOption("Portátil Dell Latitude");
    await page.getByLabel("Cantidad de Equipos").fill("3");
    await page.getByLabel("Laboratorio Destino").selectOption("Lab Sistemas A");
    await page.getByRole("button", { name: /confirmar préstamo/i }).click();

    // 4. Aserción final del flujo: redirect a listado y confirmación visual
    await expect(page).toHaveURL(/\\/prestamos\\/mis-solicitudes$/);
    await expect(page.getByRole("status")).toContainText(/solicitud registrada con éxito/i);
    
    // Verificar que la fila aparezca en la tabla de solicitudes activas
    const filaPrestamo = page.getByTestId("solicitud-row").first();
    await expect(filaPrestamo).toContainText("Portátil Dell Latitude");
    await expect(filaPrestamo).toContainText("3");
    await expect(filaPrestamo).toContainText("PENDIENTE");
});`,
                command: "npx playwright test tests/e2e/prestamos.spec.js --headed",
                oracle: "El flujo debe completar las 3 pantallas secuenciales (login -> formulario -> listado) sin timeouts. La URL final debe ser /prestamos/mis-solicitudes y la tabla debe contener la fila con 3 laptops.",
                expectedVsObserved: [
                    ["Login + Formulario (3 laptops)", "Redirect a /mis-solicitudes, banner verde de éxito y fila en tabla", "Pasa en verde"],
                    ["Formulario con 6 laptops", "Permanece en /prestamos/nuevo, botón bloqueado o alerta 'Máximo 5 equipos'", "Fallo si redirige o persiste"],
                    ["Servidor no disponible en :5000", "Playwright reporta error de conexión ERR_CONNECTION_REFUSED", "Fallo de infraestructura (no del test)"]
                ],
                decision: "Las pruebas E2E con Playwright validan la integración total (Front + Back + DB) desde la perspectiva del aprendiz, protegiendo el camino crítico contra regresiones visuales o de enrutamiento."
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
        badge: "Estación 11/18 · Cobertura",
        intro: "Mide qué porcentaje de tu código está cubierto por tests. Umbral didáctico orientativo: 80% o más en lógica de negocio.",
        blocks: [
            {
                type: "tools",
                title: "Herramientas de cobertura por ecosistema",
                stack: [
                    {
                        icon: "📊", name: "pytest-cov / coverage.py", tag: "Python",
                        role: "Mide lineas y ramas ejecutadas; umbral con --cov-fail-under y reportes HTML/XML intercomunicables con CI.",
                        when: "Cada pull request: aplicar a la lógica de negocio el umbral acordado y revisar las líneas relevantes no cubiertas."
                    },
                    {
                        icon: "📊", name: "V8 Coverage (Vitest + c8)", tag: "JavaScript",
                        role: "Cobertura nativa del motor V8 (via Istanbul o c8): reportes HTML, LCOV y umbrales configurados junto al runner del proyecto.",
                        when: "Componentes y hooks: detectar ramas importantes no cubiertas y sostener el umbral contextual del frontend."
                    },
                    {
                        icon: "📊", name: "JaCoCo", tag: "Java",
                        role: "Cobertura JVM para Maven/Gradle: XML, HTML y reglas de umbral que rompen el build si baja.",
                        when: "Backend Spring Boot/Servlets: en el mismo run de Maven en CI."
                    }
                ]
            },
            {
                type: "diagram",
                diagramType: "pyramid",
                title: "Diagrama Visual: Jerarquía y Niveles de Cobertura de Código",
                tiers: [
                    { id: "e2e", name: "Mutation Testing (Efectividad Real)", pct: "Oro", speed: "Lenta (minutos)", cost: "Alto CPU", tools: "mutmut, Stryker, PIT", desc: "Introduce mutaciones sintácticas en el código (invierte condicionales, vacía métodos) y verifica si tus pruebas fallan al detectarlas." },
                    { id: "integration", name: "Branch Coverage (Cobertura de Ramas)", pct: "Recomendado", speed: "Rápida (~segundos)", cost: "Medio", tools: "pytest --cov-branch, c8", desc: "Evalúa que cada bifurcación lógica (if/else, switch, ternarios) haya sido probada en ambos sentidos: verdadero y falso." },
                    { id: "unit", name: "Line Coverage (Cobertura de Instrucciones)", pct: "80% Base", speed: "Muy rápida (~ms)", cost: "Bajo", tools: "pytest-cov, Istanbul, JaCoCo", desc: "Registra qué líneas de código fueron ejecutadas al menos una vez por el runner. Útil como base inicial, no como garantía final." }
                ],
                body: "La cobertura no debe medirse únicamente por líneas ejecutadas. Una suite con 100% de cobertura de líneas puede ocultar ramas huérfanas y aserciones ausentes. Avanzar hacia Branch Coverage y Mutation Testing asegura que las pruebas validen el comportamiento real."
            },
            {
                type: "case-study",
                title: "Caso Práctico Guiado en Flask: Cobertura Progresiva y Detección de Líneas con Flash y Sesiones",
                context: "Auditar y conquistar la cobertura de la aplicación Flask 'flask_jinja_demo/app.py'. La ruta 'POST /productos' valida campos, emite mensajes con 'flash()', guarda en sesión y redirige. Observa cómo la columna 'Missing' de la terminal nos canta con números de línea exactos qué código falta por validar en cada etapa hasta alcanzar 100% confiable.",
                preconditions: [
                    "Entorno virtual activo con pytest, pytest-cov y Flask instalados.",
                    "Archivo app.py con validación de nombre vacío, precio <= 0, flash() y sesión.",
                    "Objetivo: Entender qué y cuánto falta leyendo la columna Missing de la terminal."
                ],
                code: `# 1. EL CÓDIGO A VALIDAR: flask_jinja_demo/app.py (Extracto numerado)
# L-21: if request.method == "POST":
# L-22:     name = request.form.get("nombre", "").strip()
# L-23:     price_text = request.form.get("precio", "").strip()
# L-25:     if not name:
# L-26:         flash("El nombre es obligatorio.", "error")
# L-27:         return render_template("productos.html", products=products), 400
# L-29:     try:
# L-30:         price = float(price_text)
# L-31:     except ValueError:
# L-32:         price = 0
# L-34:     if price <= 0:
# L-35:         flash("El precio debe ser mayor que cero.", "error")
# L-36:         return render_template("productos.html", products=products), 400
# L-38:     products.append({"nombre": name, "precio": f"{price:.2f}"})
# L-39:     session["products"] = products
# L-40:     flash("Producto creado.", "success")
# L-41:     return redirect(url_for("products_view"))

# 2. LA SUITE PROGRESIVA: test_cobertura_flask.py
import os, pytest
os.environ["FLASK_SECRET_KEY"] = "clave-local-prueba"
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as c:
        yield c

# FASE 1: Solo caso feliz -> Terminal reporta 76% | Missing: 12, 16, 26-27, 31-32, 35-36
def test_crear_producto_exitoso_con_flash(client):
    res = client.post("/productos", data={"nombre": "Mouse", "precio": "45.00"}, follow_redirects=True)
    assert res.status_code == 200
    assert "Producto creado." in res.get_data(as_text=True)

# FASE 2: Valida nombre vacío -> Missing reduce a: 12, 16, 31-32, 35-36 (82%)
def test_crear_producto_sin_nombre_muestra_flash_error(client):
    res = client.post("/productos", data={"nombre": "", "precio": "45.00"})
    assert res.status_code == 400
    assert "El nombre es obligatorio." in res.get_data(as_text=True)

# FASE 3: Valida precios inválidos -> Missing reduce a: 12, 16 (94%)
def test_crear_producto_precio_invalido_muestra_flash_error(client):
    res = client.post("/productos", data={"nombre": "Teclado", "precio": "-10.00"})
    assert res.status_code == 400
    assert "El precio debe ser mayor que cero." in res.get_data(as_text=True)

    res_txt = client.post("/productos", data={"nombre": "Teclado", "precio": "gratis"})
    assert res_txt.status_code == 400

# FASE 4: Redirección de home y guardián de entorno -> Missing vacío: 100%
def test_ruta_home_redirige_a_productos(client):
    res = client.get("/")
    assert res.status_code == 302
    assert "/productos" in res.headers["Location"]`,
                command: "pytest --cov=app --cov-report=term-missing",
                oracle: "La columna 'Missing' es el mapa exacto de trabajo: cada rango de líneas indicado (ej. 26-27 o 35-36) indica qué condicional de error con flash() no ha sido probado. Al agregar las pruebas correspondientes, las líneas desaparecen de 'Missing' hasta alcanzar 100%.",
                expectedVsObserved: [
                    ["Fase 1: Solo test_crear_producto_exitoso (Happy Path)", "Stmts: 34, Miss: 8, Cover: 76% | Missing: 12, 16, 26-27, 31-32, 35-36", "Alerta: 76% no alcanza el umbral del 80%. Missing canta que los flash de error no se han probado."],
                    ["Fase 2: Añadir test de nombre vacío (flash error)", "Stmts: 34, Miss: 6, Cover: 82% | Missing: 12, 16, 31-32, 35-36", "Pasa el umbral (82% >= 80%), pero Missing advierte que las ramas de precio siguen huérfanas."],
                    ["Fase 3: Añadir tests de precio negativo y texto", "Stmts: 34, Miss: 2, Cover: 94% | Missing: 12, 16", "Validaciones de formulario cubiertas al 100%; solo falta redirección y clave de entorno."],
                    ["Fase 4: Suite completa con redirección", "Stmts: 34, Miss: 0, Cover: 100% | Missing: (limpio)", "100% de instrucciones ejecutadas con aserciones rigurosas de HTTP y mensajes flash."],
                    ["Fase 5: Ejecución con --cov-branch", "Branch: 8, BrPart: 0, Cover: 100%", "Comprueba que cada if fue evaluado tanto en su camino verdadero como en el falso."]
                ],
                decision: "Nunca te conformes con un porcentaje ciego. Usa la columna 'Missing' para identificar las líneas de código huérfanas de pruebas y complétalas con aserciones que verifiquen el estado real."
            },
            {
                type: "steps",
                title: "Paso a Paso del Aprendiz: De Escribir Solo 'pytest' a Medir Cobertura Confiable",
                intro: "Aprende a medir qué porcentaje de código ejecutan tus pruebas con los comandos más sencillos posibles, sin fricción y con total certeza de qué líneas te faltan.",
                steps: [
                    {
                        number: 1,
                        title: "El atajo definitivo: escribe solamente 'pytest' y obtén cobertura",
                        tag: "Paso 1: Cero Fricción",
                        desc: "En tu archivo `pytest.ini`, añade la directiva: `addopts = -v --cov=app --cov-report=term-missing`. A partir de ese instante, así como solamente escribes `pytest` para correr los tests, escribes exactamente `pytest` y obtienes de forma automática tus pruebas y la tabla completa de cobertura con la columna Missing, sin tener que recordar banderas.",
                        command: "pytest  # ¡Sin parámetros extra! Lee pytest.ini y entrega reporte confiable",
                        tip: "Al configurar `addopts` en `pytest.ini`, todo tu equipo o evaluador ejecuta exactamente el mismo estándar de cobertura con un comando de una sola palabra.",
                        pitfall: "No definir `--cov-report=term-missing`: el plugin solo te mostrará un porcentaje global ciego (ej. 76%) y no sabrás qué líneas te faltan."
                    },
                    {
                        number: 2,
                        title: "El comando directo sin archivo de configuración: las 3 piezas indispensables",
                        tag: "Paso 2: Comando Directo",
                        desc: "Si no tienes un archivo `pytest.ini` configurado, el comando directo más simple y completo es `pytest --cov=app --cov-report=term-missing`. Se compone de tres partes: 1) `pytest` (el ejecutor), 2) `--cov=app` (la carpeta a medir), y 3) `--cov-report=term-missing` (muestra qué líneas faltan).",
                        command: "pytest --cov=app --cov-report=term-missing",
                        tip: "Si tu archivo está en la misma carpeta donde ejecutas el comando, escribe `pytest --cov=. --cov-report=term-missing`.",
                        pitfall: "Escribir solamente `pytest --cov`: funciona, pero oculta la columna Missing. Sin ver los números de línea, encontrar qué falta toma diez veces más tiempo."
                    },
                    {
                        number: 3,
                        title: "Aprender a leer la columna 'Missing': saber cuánto y qué falta",
                        tag: "Paso 3: Diagnóstico en Consola",
                        desc: "En la salida de consola, observa la fila de tu archivo: `Miss: 6` te dice CUÁNTO falta (6 sentencias para el 100%). La columna `Missing: 26-27, 35-36` te dice QUÉ falta (las líneas 26 a 27 y 35 a 36 jamás se ejecutaron). Abre `app.py` en esas líneas: verás de inmediato qué `if`, `flash` o `return` no tiene una prueba.",
                        command: "# Inspecciona visualmente en tu editor las líneas que aparecen en la columna Missing",
                        tip: "Las líneas en 'Missing' son tu lista de tareas pendiente: diseña un test específico cuya entrada obligue al flujo a entrar en esas líneas.",
                        pitfall: "Intentar adivinar qué falta mirando los tests en lugar de mirar los números exactos de la columna Missing."
                    },
                    {
                        number: 4,
                        title: "Auditar bifurcaciones con '--cov-branch': descubrir saltos a medias",
                        tag: "Paso 4: Cobertura de Ramas",
                        desc: "Una línea con `if` puede aparecer cubierta si se ejecutó cuando la condición fue verdadera, pero si nunca probaste el falso, la decisión está incompleta. Añade `--cov-branch`. Si ves en Missing `25->29`, significa que la condición en la línea 25 nunca saltó directamente a la línea 29.",
                        command: "pytest --cov=app --cov-branch --cov-report=term-missing",
                        tip: "Puedes incluir `--cov-branch` directamente dentro de `addopts` en `pytest.ini` para tener branch coverage automático.",
                        pitfall: "Quedarse satisfecho con 100% de Line Coverage cuando condicionales complejos con or o and tienen ramas huérfanas."
                    },
                    {
                        number: 5,
                        title: "Fijar la compuerta de calidad local con '--cov-fail-under=80'",
                        tag: "Paso 5: Quality Gate",
                        desc: "Para asegurar que nadie entregue código con cobertura insuficiente, añade `--cov-fail-under=80`. Si el porcentaje baja de 80.0%, pytest terminará con código de error (rojo) y bloqueará el commit o el pipeline de CI/CD.",
                        command: "pytest --cov=app --cov-report=term-missing --cov-fail-under=80",
                        tip: "El umbral del 80% en lógica de negocio es un estándar contextual sano; úsalo como compuerta de protección, no como fin cosmético.",
                        pitfall: "Aplicar `--cov-fail-under=80` sobre carpetas con archivos autogenerados o migraciones que distorsionan el promedio."
                    }
                ]
            },
            {
                type: "code", lang: "ini", file: "pytest.ini",
                title: "Configuración cero-fricción: escribe solo 'pytest' y obtén cobertura",
                code: `[pytest]
# Al definir addopts, el aprendiz solo escribe 'pytest' en la terminal
# y obtiene de inmediato los tests y la tabla con líneas faltantes.
addopts = -v --cov=app --cov-report=term-missing --cov-fail-under=80

# Comandos equivalentes si no tienes pytest.ini:
# 1. El más directo y confiable:
#    pytest --cov=app --cov-report=term-missing
# 2. Con cobertura de ramas (bifurcaciones if/else):
#    pytest --cov=app --cov-branch --cov-report=term-missing
# 3. Reporte visual interactivo en HTML (abre htmlcov/index.html):
#    pytest --cov=app --cov-report=html`
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
