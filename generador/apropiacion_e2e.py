"""Bloque 4.3.7: Playwright aplicado a una aplicación Flask con Jinja."""

import os

from .config import EJ_DIR
from .estilos import agregar_codigo, agregar_pasos, leer, tabla


def playwright_e2e(doc):
    doc.add_heading("4.3.7 Playwright con Flask y Jinja", level=3)
    doc.add_paragraph(
        "Como ya dominas Flask, no necesitas aprender otro frontend para empezar. "
        "La pregunta es qué ocurre con tu aplicación cuando una persona la usa: "
        "una ruta Flask llama a render_template(), Jinja produce HTML, el navegador "
        "muestra ese HTML y una acción del usuario genera otra petición. Playwright "
        "automatiza y comprueba esa cadena completa."
    )
    doc.add_paragraph(
        "Playwright no reemplaza a PyTest ni al test_client de Flask. PyTest prueba "
        "la vista y las reglas del servidor sin abrir un navegador; Playwright "
        "comprueba el camino crítico desde la interfaz, con un navegador real."
    )

    doc.add_heading("Mapa mental de Flask/Jinja a Playwright", level=4)
    tabla(doc, ["Flask/Jinja", "Playwright", "Qué se comprueba"], [
        ["@app.get('/productos')", "page.goto('/productos')", "La ruta carga."],
        ["render_template()", "getByRole() / getByTestId()", "El HTML aparece y es localizable."],
        ["label + input", "getByLabel().fill()", "El campo es usable como lo percibe el usuario."],
        ["request.form", "click()", "El formulario se envía."],
        ["redirect(url_for())", "expect(page).toHaveURL()", "La navegación termina donde debe."],
        ["flash() en una plantilla", "getByRole('status'/'alert')", "El resultado se comunica."],
    ], ancho_cm=[5.2, 5.2, 4.8])

    doc.add_heading("Herramientas esenciales", level=4)
    tabla(doc, ["Herramienta", "Modelo mental", "Uso en Flask/Jinja"], [
        ["test y fixtures", "Organizan el caso y su preparación.", "Crear contexto limpio para cada flujo."],
        ["browser / context", "Motor y sesión aislada.", "Separar usuarios, cookies y almacenamiento."],
        ["page", "Una pestaña del navegador.", "Navegar, observar y ejecutar acciones."],
        ["locator", "Referencia viva a un elemento.", "Encontrar campos, botones, filas y mensajes."],
        ["expect", "Aserción que espera.", "Comprobar URL, texto, visibilidad y estado."],
        ["request", "Cliente HTTP auxiliar.", "Preparar datos sin recorrer la interfaz."],
        ["route", "Control de peticiones.", "Aislar una dependencia externa cuando aplique."],
        ["trace, report y codegen", "Evidencia y diagnóstico.", "Revisar DOM, red, consola y acciones grabadas."],
    ], ancho_cm=[4.0, 5.0, 6.2])

    agregar_pasos(doc, "Paso a paso para probar la aplicación Flask", [
        {
            "num": 1,
            "titulo": "Abrir el ejemplo correcto",
            "desc": "Trabaja desde recursos/codigo-ejemplo/. El ejemplo flask_jinja_demo/ tiene una ruta de productos, un formulario POST, validación, redirect, flash y plantillas Jinja.",
            "tip": "Primero identifica el comportamiento que quieres probar; después eliges el localizador y la aserción.",
        },
        {
            "num": 2,
            "titulo": "Instalar Playwright y Chromium",
            "desc": "Instala el ejecutor de pruebas y el navegador que usará la suite. La clave local se define en el entorno porque Flask necesita firmar los mensajes flash.",
            "cmd": "npm install -D @playwright/test; npx playwright install chromium; $env:FLASK_SECRET_KEY = \"<CLAVE_LOCAL_DE_PRUEBA>\"",
            "tip": "Nunca copies credenciales de producción a los tests ni guardes la clave local en Git.",
        },
        {
            "num": 3,
            "titulo": "Conectar el ejecutor con Flask",
            "desc": "playwright.flask.config.js declara baseURL y webServer. Playwright inicia flask run en el puerto 5017 antes de correr los casos y reutiliza un servidor local si ya está levantado.",
            "cmd": "npx playwright test --config=playwright.flask.config.js",
            "tip": "Con baseURL usa rutas relativas: page.goto('/productos'), no URLs repetidas en cada prueba.",
        },
        {
            "num": 4,
            "titulo": "Localizar como lo haría el usuario",
            "desc": "Prefiere getByRole y getByLabel; usa getByTestId cuando necesitas un contrato explícito. La etiqueta Jinja label for=nombre permite localizar el input sin acoplarse a clases CSS.",
            "tip": "Evita XPath y selectores como div > table > tr:nth-child(2): describen la maquetación, no la intención.",
        },
        {
            "num": 5,
            "titulo": "Afirmar el resultado completo",
            "desc": "Comprueba la URL después del redirect, el mensaje flash y la fila que Jinja agregó a la lista. En el caso inválido comprueba el alert y que no apareció un producto nuevo.",
            "cmd": "npx playwright test --config=playwright.flask.config.js --ui",
            "tip": "Una acción sin una aserción observable no demuestra que el requisito se cumplió.",
        },
        {
            "num": 6,
            "titulo": "Diagnosticar sin esperas fijas",
            "desc": "Usa headed para ver el navegador, UI para avanzar paso a paso, codegen para descubrir una interacción y el reporte con trace para inspeccionar DOM, red, consola y capturas.",
            "cmd": "npx playwright test --config=playwright.flask.config.js --headed; npx playwright show-report",
            "tip": "Confía en las esperas automáticas de expect y localizadores; setTimeout solo oculta problemas de sincronización.",
        },
    ])

    doc.add_heading("Código del ejemplo", level=4)
    doc.add_paragraph(
        "Lee los archivos en este orden: la vista Flask define el comportamiento; "
        "la plantilla Jinja define el HTML que el navegador recibe; la configuración "
        "conecta el servidor; el spec describe el flujo y sus resultados."
    )
    archivos = [
        ("Vista Flask: flask_jinja_demo/app.py", "flask_jinja_demo/app.py"),
        ("Plantilla Jinja: templates/productos.html", "flask_jinja_demo/templates/productos.html"),
        ("Configuración: playwright.flask.config.js", "playwright.flask.config.js"),
        ("Spec E2E: tests/e2e/flask_jinja.spec.js", "tests/e2e/flask_jinja.spec.js"),
    ]
    for titulo, ruta in archivos:
        ruta_absoluta = os.path.join(EJ_DIR, ruta)
        if os.path.exists(ruta_absoluta):
            doc.add_heading(titulo, level=5)
            agregar_codigo(doc, leer(EJ_DIR, ruta))

    doc.add_heading("Regla de separación", level=4)
    doc.add_paragraph(
        "Prueba con client.get() y client.post() las reglas del servidor, validaciones "
        "y códigos HTTP. Prueba con Playwright los caminos críticos que una persona "
        "ejecuta en el navegador. El mismo requisito puede tener ambas pruebas, pero "
        "cada una aporta una evidencia diferente."
    )
