"""
Generador de la Guia de Aprendizaje Testing & QA (DOCX).
Lee los archivos reales de recursos/codigo-ejemplo/ (SSOT).
"""
import os
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EJ_DIR = os.path.join(BASE_DIR, "recursos", "codigo-ejemplo")


def leer(ruta_relativa):
    ruta = os.path.join(EJ_DIR, ruta_relativa)
    with open(ruta, "r", encoding="utf-8") as f:
        return f.read()


def configurar_estilos(doc):
    style = doc.styles["Normal"]
    style.font.name = "Calibri"
    style.font.size = Pt(11)
    for nivel in range(1, 4):
        sn = f"Heading {nivel}"
        if sn in doc.styles:
            doc.styles[sn].font.color.rgb = RGBColor(0x4A, 0x2C, 0x8A)


def agregar_codigo(doc, codigo):
    for linea in codigo.split("\n"):
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Cm(1)
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        shading = p._element.get_or_add_pPr()
        shd = shading.makeelement(qn("w:shd"), {qn("w:fill"): "F5F5F5", qn("w:val"): "clear"})
        shading.append(shd)
        run = p.add_run(linea if linea else " ")
        run.font.name = "Consolas"
        run.font.size = Pt(9)


def agregar_pasos(doc, titulo, pasos):
    doc.add_heading(titulo, level=3)
    for p in pasos:
        par = doc.add_paragraph()
        run_num = par.add_run(f"Paso {p['num']}: {p['titulo']}. ")
        run_num.font.bold = True
        par.add_run(p['desc'])
        if "cmd" in p and p["cmd"]:
            p_cmd = doc.add_paragraph()
            p_cmd.paragraph_format.left_indent = Cm(0.8)
            p_cmd.paragraph_format.space_before = Pt(1)
            p_cmd.paragraph_format.space_after = Pt(2)
            run_cmd = p_cmd.add_run(f"> {p['cmd']}")
            run_cmd.font.name = "Consolas"
            run_cmd.font.size = Pt(9)
            run_cmd.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)
        if "tip" in p and p["tip"]:
            p_tip = doc.add_paragraph()
            p_tip.paragraph_format.left_indent = Cm(0.8)
            p_tip.paragraph_format.space_before = Pt(0)
            p_tip.paragraph_format.space_after = Pt(2)
            run_tip = p_tip.add_run(f"💡 Regla de oro: {p['tip']}")
            run_tip.font.size = Pt(8.5)
            run_tip.font.italic = True
            run_tip.font.color.rgb = RGBColor(0x15, 0x80, 0x3D)


def portada(doc):
    for _ in range(4):
        doc.add_paragraph("")
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("SERVICIO NACIONAL DE APRENDIZAJE - SENA")
    r.font.size = Pt(16); r.font.bold = True; r.font.color.rgb = RGBColor(0x4A, 0x2C, 0x8A)
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("Tecnologo en Analisis y Desarrollo de Software (ADSO)")
    r.font.size = Pt(14); r.font.color.rgb = RGBColor(0x66, 0x66, 0x66)
    doc.add_paragraph("")
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("GUIA DE APRENDIZAJE\nFase 5: Evaluacion - Calidad de Software")
    r.font.size = Pt(26); r.font.bold = True; r.font.color.rgb = RGBColor(0x4A, 0x2C, 0x8A)
    doc.add_page_break()


def identificacion(doc):
    doc.add_heading("1. IDENTIFICACION DE LA GUIA DE APRENDIZAJE", level=1)
    t = doc.add_table(rows=7, cols=2); t.style = "Table Grid"
    datos = [
        ("Programa", "Analisis y Desarrollo de Software (ADSO)"),
        ("Fase", "5 - Evaluacion"),
        ("Competencia", "Asegurar la calidad del software mediante pruebas automatizadas"),
        ("Resultado de Aprendizaje", "Disenar y ejecutar pruebas unitarias, de integracion y E2E con CI/CD"),
        ("Duracion", "40 horas (10 teoria + 30 practica)"),
        ("Tecnologias", "PyTest, Jest/Vitest, JUnit 5, Mockito, Playwright, GitHub Actions, pytest-cov"),
        ("Metodologia", "Aprendizaje por proyectos - TDD/BDD"),
    ]
    for i, (k, v) in enumerate(datos):
        t.rows[i].cells[0].paragraphs[0].add_run(k).font.bold = True
        t.rows[i].cells[1].paragraphs[0].add_run(v)
    doc.add_page_break()


def presentacion(doc):
    doc.add_heading("2. PRESENTACION", level=1)
    doc.add_paragraph(
        "Esta guia cierra el ciclo curricular del programa ADSO. Tras construir aplicaciones "
        "con Flask, FastAPI, JSP y React, ahora aprendes a VERIFICAR que funcionen correctamente "
        "mediante pruebas automatizadas. La calidad no es una fase final: es una cultura."
    )
    doc.add_heading("Pregunta Esencial (PBL)", level=2)
    doc.add_paragraph(
        "Como garantizas que el software que construyas no falle en produccion y cueste millones? "
        "El bug de Knight Capital (2012) perdio $440M en 45 minutos por codigo de prueba no eliminado."
    )
    doc.add_page_break()


def modulos(doc):
    doc.add_heading("3. ACTIVIDADES DE APRENDIZAJE", level=1)

    doc.add_heading("3.1 Reflexion: El Bug de 500M USD", level=2)
    doc.add_paragraph("Caso real: Knight Capital, 1 de agosto de 2012. Un algoritmo de trading con codigo de prueba (SMBAT) no eliminado provoco perdidas por $440M en 45 minutos.")
    agregar_codigo(doc, leer(os.path.join("tests", "conftest.py"))[:2000] if os.path.exists(os.path.join(EJ_DIR, "tests", "conftest.py")) else "# Ver recursos/codigo-ejemplo/tests/conftest.py")

    doc.add_heading("3.2 Piramide de Testing y Flujo Logico Maestro de 7 Fases", level=2)
    doc.add_paragraph("Para avanzar rapidamente en cualquier proyecto de software, el aprendiz debe abordar las pruebas de la base a la cúspide (70% Unitarias / 20% Integracion / 10% E2E):")

    t_fases = doc.add_table(rows=8, cols=4)
    t_fases.style = "Table Grid"
    cabeceras = ["Fase", "Nivel", "Herramientas", "Objetivo Tecnico"]
    for c_idx, h in enumerate(cabeceras):
        celda = t_fases.rows[0].cells[c_idx]
        r = celda.paragraphs[0].add_run(h)
        r.font.bold = True
    filas_fases = [
        ("1. Arnes", "Configuracion", "venv, npm, pom.xml", "Aislar dependencias y armar arnes tests/"),
        ("2. Dominio (70%)", "Unitarias", "PyTest, Vitest, JUnit 5", "Logica pura, calculos y modelos en < 5 ms"),
        ("3. Integracion (20%)", "API & DB", "TestClient, MockMvc", "Endpoints HTTP y base de datos de prueba limpia"),
        ("4. Componentes", "Frontend UI", "React Testing Library", "DOM virtual y accesibilidad con getByRole"),
        ("5. E2E (10%)", "Cuspide", "Playwright", "Caminos dorados en navegador real headless"),
        ("6. Cobertura", "Calidad", "pytest-cov, JaCoCo, qa_auditor", "Validar cobertura >= 80% y OWASP SAST"),
        ("7. CI/CD", "Automatizacion", "GitHub Actions", "Quality Gate en cada push antes de tocar VPS"),
    ]
    for r_idx, fila in enumerate(filas_fases, start=1):
        for c_idx, val in enumerate(fila):
            t_fases.rows[r_idx].cells[c_idx].paragraphs[0].add_run(val)

    doc.add_paragraph("")

    # 3.3 PyTest FastAPI
    doc.add_heading("3.3 PyTest: Microservicio FastAPI", level=2)
    doc.add_paragraph("Automatizacion de pruebas de endpoints REST con TestClient y base de datos aislada en memoria:")
    agregar_pasos(doc, "Paso a paso para pruebas automatizadas en FastAPI:", [
        {"num": 1, "titulo": "Entorno", "desc": "Instalar PyTest, el cliente de prueba HTTP y la herramienta de cobertura.", "cmd": "pip install pytest pytest-cov httpx fastapi sqlalchemy pydantic", "tip": "Usa httpx para que TestClient no requiera levantar un servidor de red real."},
        {"num": 2, "titulo": "Aislamiento (conftest.py)", "desc": "Crear fixtures con SQLite en memoria y dependency_overrides para inyectar una sesion limpia por cada test.", "cmd": "pytest tests/ -v", "tip": "Llama app.dependency_overrides.clear() al terminar cada test."},
        {"num": 3, "titulo": "Redaccion AAA", "desc": "Escribir los casos de prueba con patron Arrange, Act, Assert validando status codes y JSON.", "cmd": "pytest tests/test_productos.py -v", "tip": "Valida status codes de error como 404 y 422 ademas del caso exitoso 201."},
        {"num": 4, "titulo": "Ejecucion CLI", "desc": "Ejecutar la suite con banderas de diagnostico rapido.", "cmd": "pytest tests/ -v -s -x --tb=short", "tip": "La bandera -x detiene la ejecucion en el primer fallo para resolverlo de inmediato."},
        {"num": 5, "titulo": "Cobertura", "desc": "Verificar que la logica alcance al menos el 80% de cobertura.", "cmd": "pytest --cov=app --cov-report=term-missing", "tip": "Inspecciona response.json()['detail'] si un endpoint responde 422."},
    ])
    if os.path.exists(os.path.join(EJ_DIR, "tests", "test_productos.py")):
        agregar_codigo(doc, leer(os.path.join("tests", "test_productos.py")))

    # 3.4 PyTest Flask
    doc.add_heading("3.4 PyTest: Aplicacion Web Flask", level=2)
    agregar_pasos(doc, "Paso a paso para pruebas automatizadas en Flask:", [
        {"num": 1, "titulo": "Setup", "desc": "Instalar extensiones de prueba para Flask.", "cmd": "pip install pytest pytest-flask flask flask-sqlalchemy", "tip": "Usa create_app() para instanciar configuraciones de prueba."},
        {"num": 2, "titulo": "Aislamiento", "desc": "Activar TESTING=True y SQLite en memoria con app.app_context().", "cmd": "pytest tests/test_routes.py -v", "tip": "TESTING=True propaga las excepciones para que PyTest las muestre en detalle."},
        {"num": 3, "titulo": "Rutas y Jinja", "desc": "Probar peticiones GET/POST y validar HTML decodificado con get_data(as_text=True).", "cmd": "pytest -k 'test_index' -v", "tip": "Usa follow_redirects=True para validar la pagina destino de los redirects."},
        {"num": 4, "titulo": "Sesiones", "desc": "Simular usuarios con client.session_transaction() sin requerir formulario de login.", "cmd": "pytest tests/ -m 'auth' -v", "tip": "Modificar session dentro de su transaccion asegura la persistencia en cookies."},
        {"num": 5, "titulo": "Validacion", "desc": "Correr la suite completa y medir cobertura de blueprints.", "cmd": "pytest --cov=app --cov-fail-under=80", "tip": "Prueba siempre los manejadores de error 404 y 500."},
    ])

    # 3.5 Jest / Vitest React
    doc.add_heading("3.5 Vitest / Jest: Componentes React", level=2)
    agregar_pasos(doc, "Paso a paso para pruebas automatizadas en React:", [
        {"num": 1, "titulo": "Dependencias", "desc": "Instalar Vitest, React Testing Library y jsdom.", "cmd": "npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom", "tip": "jsdom emula el DOM del navegador en Node.js de forma ultra rapida."},
        {"num": 2, "titulo": "Configuracion", "desc": "Configurar environment: 'jsdom' y setupFiles en vitest.config.js.", "cmd": "npm test", "tip": "jest-dom agrega aserciones como .toBeInTheDocument() y .toBeDisabled()."},
        {"num": 3, "titulo": "Render Accesible", "desc": "Renderizar el componente y buscar elementos mediante screen.getByRole.", "cmd": "npm test -- Contador.test.jsx", "tip": "Busca botones por su texto visible, no por selectores de clase CSS."},
        {"num": 4, "titulo": "Eventos", "desc": "Simular clics con fireEvent o user-event y verificar cambios de estado.", "cmd": "npm run test:watch", "tip": "Ante actualizaciones asincronas, usa waitFor(() => expect(...))."},
        {"num": 5, "titulo": "Cobertura Frontend", "desc": "Generar reporte de cobertura V8 para componentes.", "cmd": "npm run test:coverage", "tip": "Asegurate de probar estados de loading, error y exito."},
    ])
    if os.path.exists(os.path.join(EJ_DIR, "tests", "Contador.test.jsx")):
        agregar_codigo(doc, leer(os.path.join("tests", "Contador.test.jsx")))

    # 3.6 JUnit 5 y Mockito
    doc.add_heading("3.6 JUnit 5 & Mockito: Backend Java", level=2)
    agregar_pasos(doc, "Paso a paso para pruebas automatizadas en Java:", [
        {"num": 1, "titulo": "Maven pom.xml", "desc": "Agregar dependencias junit-jupiter-engine y mockito-core con scope test.", "cmd": "mvn dependency:resolve", "tip": "Asegura compatibilidad con maven-surefire-plugin 3.x."},
        {"num": 2, "titulo": "Estructura de clase", "desc": "Crear clase de prueba en src/test/java/ con @ExtendWith(MockitoExtension.class).", "cmd": "mvn test-compile", "tip": "Usa @DisplayName para documentar la intencion en espanol."},
        {"num": 3, "titulo": "Mocks y Stubs", "desc": "Crear dobles con @Mock y definir respuestas simuladas con when().thenReturn().", "cmd": "mvn test -Dtest=ProductoDAOTest", "tip": "Simula SQLException para verificar la recuperacion ante fallos."},
        {"num": 4, "titulo": "Aserciones y Verify", "desc": "Validar resultados con assertEquals y verificar llamadas con verify(mockStmt).executeUpdate().", "cmd": "mvn test", "tip": "verify(mock, never()) garantiza que metodos peligrosos no fueron invocados."},
        {"num": 5, "titulo": "Reporte JaCoCo", "desc": "Generar reporte de cobertura con JaCoCo.", "cmd": "mvn test jacoco:report", "tip": "Revisa target/site/jacoco/index.html en tu navegador."},
    ])
    if os.path.exists(os.path.join(EJ_DIR, "tests", "ProductoDAOTest.java")):
        agregar_codigo(doc, leer(os.path.join("tests", "ProductoDAOTest.java")))

    # 3.7 TDD
    doc.add_heading("3.7 Metodologia TDD: Ciclo Rojo - Verde - Refactor", level=2)
    doc.add_paragraph("El ciclo fundamental de TDD consiste en 3 pasos iterativos cortos (< 5 minutos):")
    doc.add_paragraph("1. ROJO: Escribir una prueba unitaria pequeña que falle antes de escribir codigo de produccion.")
    doc.add_paragraph("2. VERDE: Escribir la implementacion minima para hacer pasar el test.")
    doc.add_paragraph("3. REFACTOR: Limpiar el codigo y eliminar duplicacion manteniendo la prueba en verde.")

    # 3.8 BDD
    doc.add_heading("3.8 BDD con Behave y Gherkin", level=2)
    agregar_pasos(doc, "Paso a paso para BDD:", [
        {"num": 1, "titulo": "Setup", "desc": "Instalar behave y crear carpetas features/ y features/steps/.", "cmd": "pip install behave requests", "tip": "Gherkin conecta al equipo de negocio con el equipo tecnico."},
        {"num": 2, "titulo": "Escenario", "desc": "Redactar .feature con estructura Given, When, Then.", "cmd": "behave features/", "tip": "Usa Scenario Outline para probar tablas de combinaciones."},
        {"num": 3, "titulo": "Steps Python", "desc": "Implementar funciones con @given, @when, @then pasando datos por context.", "cmd": "behave", "tip": "context.response almacena las respuestas entre pasos."},
    ])

    # 3.9 Playwright E2E
    doc.add_heading("3.9 Playwright: Pruebas End-to-End en Navegador Real", level=2)
    agregar_pasos(doc, "Paso a paso para pruebas E2E con Playwright:", [
        {"num": 1, "titulo": "Instalacion", "desc": "Instalar Playwright y descargar los navegadores headless.", "cmd": "npm install -D @playwright/test && npx playwright install chromium", "tip": "chromium headless es suficiente para pruebas locales rapidas."},
        {"num": 2, "titulo": "Configuracion", "desc": "Establecer baseURL y captura de trazas en playwright.config.js.", "cmd": "npx playwright test", "tip": "trace: 'on-first-retry' guarda capturas paso a paso en caso de fallo."},
        {"num": 3, "titulo": "Selectores data-testid", "desc": "Interactuar mediante page.fill('[data-testid=...]') y aserciones web-first con auto-espera.", "cmd": "npx playwright test --ui", "tip": "data-testid protege las pruebas ante cambios de diseno visual."},
        {"num": 4, "titulo": "Diagnostico", "desc": "Inspeccionar reportes visuales con Trace Viewer.", "cmd": "npx playwright show-report", "tip": "Evita esperas fijas con setTimeout; confia en el auto-waiting."},
    ])
    if os.path.exists(os.path.join(EJ_DIR, "tests", "e2e", "inventario.spec.js")):
        agregar_codigo(doc, leer(os.path.join("tests", "e2e", "inventario.spec.js")))

    # 3.10 Cobertura
    doc.add_heading("3.10 Medicion de Cobertura y Quality Gates", level=2)
    doc.add_paragraph("Umbral obligatorio ADSO: Cobertura >= 80% en logica de negocio.")
    doc.add_paragraph("Comandos: pytest --cov=app --cov-fail-under=80 | npm run test:coverage | mvn test jacoco:report")

    # 3.11 CI/CD con GitHub Actions
    doc.add_heading("3.11 CI/CD con GitHub Actions y Quality Gates", level=2)
    agregar_pasos(doc, "Paso a paso para el Pipeline CI/CD:", [
        {"num": 1, "titulo": "Workflow YAML", "desc": "Definir .github/workflows/ci.yml con eventos push y pull_request hacia main.", "cmd": "git push origin main", "tip": "Configura cache de dependencias para acelerar el pipeline."},
        {"num": 2, "titulo": "Compuerta de Calidad", "desc": "Encadenar linter, pruebas unitarias, integracion y validacion de umbral del 80%.", "cmd": "pytest --cov=app --cov-fail-under=80", "tip": "Si un test falla, el despliegue al servidor VPS se cancela de inmediato."},
        {"num": 3, "titulo": "Smoke Test en VPS", "desc": "Ejecutar curl a /health post-despliegue con auto-rollback en caso de caida.", "cmd": "curl -f http://localhost:8000/health", "tip": "Asegura zero downtime y recuperacion automatica."},
    ])
    if os.path.exists(os.path.join(EJ_DIR, ".github", "workflows", "ci.yml")):
        agregar_codigo(doc, leer(os.path.join(".github", "workflows", "ci.yml")))

    # 3.12 Auditoría Multidimensional
    doc.add_heading("3.12 Auditoria Multidimensional y Codigo IA (qa_auditor)", level=2)
    doc.add_paragraph("Sistema en recursos/auditoria-seguridad/ que mide 9 dimensiones de calidad y detecta anomalias en codigo generado con IA (tests vacios, imports alucinados y vulnerabilidades OWASP).")
    doc.add_paragraph("Comando: python -m qa_auditor --target ..\\codigo-ejemplo --url http://localhost:8000 --min-score 80")

    # 3.13 Observabilidad Post-Despliegue en Coolify & Triaje con IA
    doc.add_heading("3.13 Observabilidad en Coolify y Triaje de Logs con IA (AI SRE)", level=2)
    agregar_pasos(doc, "Paso a paso para observabilidad y diagnostico inteligente en VPS:", [
        {"num": 1, "titulo": "Logs JSON y Correlation ID", "desc": "Configurar JSONFormatter en Flask inyectando X-Request-ID y endpoints /healthz, /readyz y /metrics.", "cmd": "python recursos/observabilidad/app_flask_ejemplo.py", "tip": "Los logs JSON evitan errores de parseo y facilitan el procesamiento por agentes de IA."},
        {"num": 2, "titulo": "Alertas Coolify", "desc": "Activar en Coolify Notifications eventos de Deployment failure y Restart limit reached via Discord o Webhook.", "cmd": "curl -X POST http://localhost:9050/webhook/coolify", "tip": "Restart limit reached detecta crash-loops antes de que sature el servidor VPS."},
        {"num": 3, "titulo": "Visor Dozzle", "desc": "Desplegar Dozzle montando /var/run/docker.sock para inspeccionar logs en vivo desde la web sin SSH.", "cmd": "docker compose -f recursos/observabilidad/docker-compose.observability.yml up -d", "tip": "Dozzle consume menos de 15MB de RAM y permite busqueda con expresiones regulares."},
        {"num": 4, "titulo": "Agente AI SRE", "desc": "Ejecutar ai_log_watcher para deduplicar incidentes con SHA-256 y generar diagnostico RCA con solucion inmediata.", "cmd": "python recursos/observabilidad/ai_log_watcher.py --test", "tip": "El prompt estructurado devuelve severidad, causa raiz y el parche de codigo exacto."},
    ])

    doc.add_page_break()


def evidencias(doc):
    doc.add_heading("4. EVIDENCIAS DE APRENDIZAJE", level=1)
    doc.add_heading("4.1 Conocimiento", level=2)
    for i, p in enumerate([
        "Explique la piramide de testing y justifique los porcentajes.",
        "Diferencia entre Unit, Integration y E2E con ejemplos.",
        "Que es TDD? Describa el ciclo Rojo-Verde-Refactor.",
        "Que es BDD? Como se relaciona con Gherkin?",
        "Por que 100% cobertura no significa 0 bugs?",
        "Explique 3 beneficios de CI/CD automatizado.",
    ], 1):
        doc.add_paragraph(f"{i}. {p}")

    doc.add_heading("4.2 Producto", level=2)
    for item in [
        "Repositorio con tests para las 4 guias (PyTest, Jest, JUnit, Playwright)",
        "Cobertura minima del 80% en logica de negocio",
        "Pipeline GitHub Actions funcional",
        "Reporte de cobertura HTML",
        "README con instrucciones de ejecucion",
    ]:
        doc.add_paragraph(item, style="List Bullet")
    doc.add_page_break()


def bibliografia(doc):
    doc.add_heading("5. BIBLIOGRAFIA", level=1)
    refs = [
        "Cohn, M. (2009). Succeeding with Agile. Addison-Wesley.",
        "Beck, K. (2003). Test-Driven Development: By Example. Addison-Wesley.",
        "North, D. (2006). Introducing BDD. Better Software Magazine.",
        "Playwright. (2024). https://playwright.dev/docs",
        "PyTest. (2024). https://docs.pytest.org/",
        "Jest. (2024). https://jestjs.io/docs",
        "JUnit 5. (2024). https://junit.org/junit5/docs/",
        "GitHub Actions. (2024). https://docs.github.com/actions",
        "Microsoft. (2024). Playwright Best Practices.",
        "OWASP. (2024). Testing Guide. https://owasp.org/www-project-web-security-testing-guide/",
    ]
    for r in refs:
        doc.add_paragraph(r, style="List Bullet")


def generar():
    doc = Document()
    configurar_estilos(doc)
    portada(doc)
    identificacion(doc)
    presentacion(doc)
    modulos(doc)
    evidencias(doc)
    bibliografia(doc)
    ruta = os.path.join(BASE_DIR, "Guia_Aprendizaje_Testing.docx")
    doc.save(ruta)
    print(f"Documento generado: {ruta}")
    return ruta


if __name__ == "__main__":
    generar()
