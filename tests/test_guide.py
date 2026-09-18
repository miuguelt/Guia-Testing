"""Tests de estructura de la guia Testing."""
import os
import json
from pathlib import Path
import pytest

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODULE_CONTENT_FILES = sorted(path.name for path in (Path(BASE) / "web/js").glob("modules-*.js"))


def test_estructura_web():
    assert os.path.isfile(os.path.join(BASE, "web", "index.html"))
    assert os.path.isfile(os.path.join(BASE, "web", "css", "styles.css"))


def test_navegacion_revela_modulos_renderizados_dinamicamente():
    """Los módulos cargados después del HTML deben ser visibles al navegar."""
    main_path = os.path.join(BASE, "web", "js", "main.js")
    with open(main_path, "r", encoding="utf-8") as f:
        main = f.read()
    assert "target.querySelectorAll('.section-card, .simulator-card, .concept-card')" in main
    assert "classList.add('animate-in')" in main


def test_enlace_profundo_sincroniza_menu_activo():
    """Una URL con hash debe resaltar su módulo, no dejar activo Inicio."""
    main_path = os.path.join(BASE, "web", "js", "main.js")
    with open(main_path, "r", encoding="utf-8") as f:
        main = f.read()
    assert "this.updateSidebarActive(this.currentPage)" in main
    assert "this.updateSidebarActive(pageId)" in main
    assert "behavior: updateHash ? 'smooth' : 'auto'" in main
    assert "window.addEventListener('load', resetInitialScroll" in main


def test_js_modulares():
    for f in ["modules-content.js", "simulators.js", "gamification.js", "code-renderer.js", "main.js"]:
        assert os.path.isfile(os.path.join(BASE, "web", "js", f)), f"Falta {f}"


def test_recursos_codigo():
    ej = os.path.join(BASE, "recursos", "codigo-ejemplo")
    assert os.path.isdir(ej), "Falta recursos/codigo-ejemplo/"
    assert os.path.isfile(os.path.join(ej, "requirements.txt"))
    assert os.path.isfile(os.path.join(ej, "package.json"))


def test_tests_ejemplo():
    ej = os.path.join(BASE, "recursos", "codigo-ejemplo", "tests")
    assert os.path.isfile(os.path.join(ej, "conftest.py"))
    assert os.path.isfile(os.path.join(ej, "test_productos.py"))
    assert os.path.isfile(os.path.join(ej, "unit", "test_calculos.py"))
    assert os.path.isfile(os.path.join(ej, "unit", "test_schemas.py"))
    assert os.path.isfile(os.path.join(ej, "integration", "test_api_productos.py"))
    assert os.path.isfile(os.path.join(BASE, "recursos", "codigo-ejemplo", "services", "calculos.py"))
    assert os.path.isfile(os.path.join(BASE, "recursos", "codigo-ejemplo", "features", "inventario.feature"))
    assert os.path.isfile(os.path.join(ej, "Contador.test.jsx"))
    assert os.path.isfile(os.path.join(ej, "ProductoDAOTest.java"))
    assert os.path.isfile(os.path.join(ej, "e2e", "inventario.spec.js"))



def test_github_actions():
    ci = os.path.join(BASE, "recursos", "codigo-ejemplo", ".github", "workflows", "ci.yml")
    assert os.path.isfile(ci), "Falta .github/workflows/ci.yml"

    with open(ci, "r", encoding="utf-8") as f:
        workflow = f.read()
    assert "python -m pytest tests" in workflow
    assert "python -m behave -q" in workflow
    assert "npm run test:coverage" in workflow
    assert "mvn --batch-mode test jacoco:report" in workflow
    assert "npx playwright install --with-deps chromium" in workflow
    assert "quality-gate" in workflow
    assert "needs: [python-tests, javascript-tests, java-tests, e2e-tests]" in workflow


def test_github_actions_del_monorepo_se_declara_en_la_raiz():
    """GitHub solo descubre workflows dentro de .github/workflows en la raíz."""
    ci = os.path.join(BASE, ".github", "workflows", "ci.yml")
    assert os.path.isfile(ci), "Falta el workflow raíz del monorepo"
    with open(ci, "r", encoding="utf-8") as f:
        workflow = f.read()
    assert "recursos/codigo-ejemplo" in workflow
    assert "quality-gate" in workflow
    assert "mvn --batch-mode test jacoco:report" in workflow


def test_ejemplo_ofrece_un_comando_unificado_y_ignora_artifacts_locales():
    """El aprendiz debe contar con una ruta única y un ignore dentro del ZIP."""
    ej = os.path.join(BASE, "recursos", "codigo-ejemplo")
    assert os.path.isfile(os.path.join(ej, "run-tests.ps1"))
    assert os.path.isfile(os.path.join(ej, "run-tests.sh"))
    with open(os.path.join(ej, ".gitignore"), encoding="utf-8") as f:
        ignore = f.read()
    assert "node_modules/" in ignore
    assert "target/" in ignore
    assert ".env" in ignore


def test_git_pre_commit_hooks():
    pc = os.path.join(BASE, "recursos", "codigo-ejemplo", ".pre-commit-config.yaml")
    assert os.path.isfile(pc), "Falta .pre-commit-config.yaml"
    with open(pc, "r", encoding="utf-8") as f:
        content = f.read()
    assert "gitleaks" in content
    assert "pytest" in content
    assert "check-yaml" in content


def test_teoria_git_github_seguridad():
    # Validar que README.md contiene la teoría requerida
    readme_path = os.path.join(BASE, "README.md")
    with open(readme_path, "r", encoding="utf-8") as f:
        readme = f.read()
    assert "Relación entre Testing y GitHub" in readme
    assert "Quality Gate" in readme
    assert "First-Class Citizen" in readme or "ciudadano de primera clase" in readme.lower()
    assert "Seguridad por Oscuridad" in readme or "Kerckhoffs" in readme
    assert "Repositorio Público" in readme and "Repositorio Privado" in readme
    assert "Tests para Git" in readme

    # Validar los bloques del catálogo de CI/CD.
    mc_path = os.path.join(BASE, "web", "js", "modules-cicd.js")
    with open(mc_path, "r", encoding="utf-8") as f:
        mc = f.read()
    assert "Relación Simbiótica: Testing y GitHub" in mc
    assert "La Regla SSoT y el Control de Artefactos" in mc
    assert "Seguridad en Pruebas" in mc
    assert "Repositorios Públicos vs. Privados" in mc
    assert "Tests para Git" in mc
    assert ".pre-commit-config.yaml" in mc

    # Validar que el generador del DOCX incluye la teoría
    gg_path = os.path.join(BASE, "generador", "transferencia_cicd.py")
    with open(gg_path, "r", encoding="utf-8") as f:
        gg = f.read()
    assert "Relación entre Testing y GitHub" in gg
    assert "First-Class Citizens" in gg
    assert "seguridad por oscuridad" in gg
    assert "Repositorios Públicos vs Privados" in gg
    assert "Tests para Git" in gg


def test_devbrain():
    for f in ["session-start.ps1", "session-end.ps1", "checkpoint.ps1", "integrity-check.ps1"]:
        assert os.path.isfile(os.path.join(BASE, ".devbrain", f)), f"Falta .devbrain/{f}"


def test_start_windows():
    assert os.path.isfile(os.path.join(BASE, "start-windows.ps1"))


def test_readme():
    readme = os.path.join(BASE, "README.md")
    assert os.path.isfile(readme)
    size = os.path.getsize(readme)
    assert size > 2000, f"README muy pequeño: {size} bytes"


def test_pyramid_in_simulators():
    with open(os.path.join(BASE, "web", "js", "simulators.js"), "r", encoding="utf-8") as f:
        content = f.read()
    assert "renderPyramidBuilder" in content
    assert "renderAssertionValidator" in content
    assert "renderQuiz" in content


def test_modules_content():
    content = ""
    for f in MODULE_CONTENT_FILES:
        p = os.path.join(BASE, "web", "js", f)
        if os.path.exists(p):
            with open(p, "r", encoding="utf-8") as file:
                content += file.read()
    assert "m-reflexion" in content
    assert "m-piramide" in content
    assert "m-pytest-fastapi" in content
    assert "m-jest-react" in content
    assert "m-junit-jsp" in content
    assert "m-tdd" in content
    assert "m-bdd" in content
    assert "m-playwright" in content
    assert "m-cicd" in content
    assert "m-observabilidad" in content
    assert "m-reto" in content


def test_paso_a_paso_en_modulos():
    content = ""
    for f in MODULE_CONTENT_FILES:
        p = os.path.join(BASE, "web", "js", f)
        if os.path.exists(p):
            with open(p, "r", encoding="utf-8") as file:
                content += file.read()
    # Verifica que exista el bloque steps en el contenido
    assert '"steps"' in content
    assert "Paso a Paso del Aprendiz" in content
    assert "Ruta de Ejecución Lógica del Aprendiz: Las 7 Fases" in content
    assert "FastAPI" in content
    assert "Flask" in content
    assert "React" in content
    assert "JUnit 5" in content
    assert "Playwright" in content
    assert "qa_auditor" in content


def test_code_renderer_soporta_steps():
    p = os.path.join(BASE, "web", "js", "code-renderer.js")
    with open(p, "r", encoding="utf-8") as f:
        code = f.read()
    assert "bloquePasos" in code
    assert "case 'steps':" in code
    assert "steps-container" in code


def test_readme_metodologia_y_fases():
    readme_path = os.path.join(BASE, "README.md")
    with open(readme_path, "r", encoding="utf-8") as f:
        readme = f.read()
    assert "Ruta Metodológica Paso a Paso para Pruebas Automatizadas" in readme
    assert "Flujo Lógico Maestro de 7 Fases" in readme
    assert "PyTest en FastAPI" in readme
    assert "Playwright (Pruebas End-to-End E2E)" in readme
    assert "JUnit 5 + Mockito" in readme
    assert "Quality Gate" in readme


def test_generador_docx_pasos():
    estilos_path = os.path.join(BASE, "generador", "estilos.py")
    with open(estilos_path, "r", encoding="utf-8") as f:
        code = f.read()
    assert "agregar_pasos" in code
    ctx_path = os.path.join(BASE, "generador", "actividad_contextualizacion.py")
    with open(ctx_path, "r", encoding="utf-8") as f:
        ctx = f.read()
    assert "Flujo Lógico Maestro" in ctx
    assert "7 Fases" in ctx


def test_simulador_secuenciador_fases():
    sim_path = os.path.join(BASE, "web", "js", "simulators.js")
    with open(sim_path, "r", encoding="utf-8") as f:
        code = f.read()
    assert "renderPhaseSequencer" in code
    assert "sim-sequencer-container" in code
    assert "addXP(100" in code
    assert "Pruebas unitarias de lógica" in code
    assert "Comprobaciones estáticas" in code
    assert "Compuerta: evidencia y decisión" in code
    assert "Pipeline CI/CD Automatizado" in code

    html_path = os.path.join(BASE, "web", "index.html")
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()
    assert "sim-sequencer-container" in html
    assert "Secuenciador de Fases" in html

    css_path = os.path.join(BASE, "web", "css", "styles.css")
    with open(css_path, "r", encoding="utf-8") as f:
        css = f.read()
    assert "sim-sequencer-wrapper" in css
    assert "sim-phase-card" in css


def test_modulo_evidencias_sena_html():
    html_path = os.path.join(BASE, "web", "index.html")
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()
    assert "m-evidencias-sena" in html
    assert "testing-session.js" in html
    assert "js/deliverables-registry.js" in html
    assert "sena-dossier.js" not in html
    assert "sena-dossier-root" not in html
    assert "data-db-evidence-dossier" in html
    assert "ART-TEST-01" in html
    assert "ART-TEST-02" in html
    assert "ART-TEST-03" in html
    assert "Registro Integral de Evidencias" in html
    assert "Dossier Integral de Evidencias" not in html


def test_testing_session_js():
    ts_path = os.path.join(BASE, "web", "js", "testing-session.js")
    assert os.path.isfile(ts_path)
    with open(ts_path, "r", encoding="utf-8") as f:
        code = f.read()
    assert "DEFAULT_TEST_CHECKS" in code
    assert "DEFAULT_SIMULATORS" in code
    assert "check-pytest-unit" in code
    assert "check-playwright-e2e" in code
    assert "check-coverage-audit" in code
    assert "sim-pyramid" in code
    assert "sim-sequencer" in code
    assert "calculateProgress" in code
    assert "weightedScore" in code


def test_sena_dossier_js_y_estilos():
    sd_path = os.path.join(BASE, "web", "js", "sena-dossier.js")
    assert os.path.isfile(sd_path)
    with open(sd_path, "r", encoding="utf-8") as f:
        code = f.read()
    assert "generateMarkdownReport" in code
    assert "downloadMarkdown" in code
    assert "downloadJson" in code
    assert "printDossier" in code
    assert "printEvidence" in code
    assert "GFPI-F-023" in code
    assert "initSignaturePad" in code
    assert "sena_apprentice_signature" in code

    css_path = os.path.join(BASE, "web", "css", "styles.css")
    with open(css_path, "r", encoding="utf-8") as f:
        css = f.read()
    assert ".sena-dossier-wrapper" in css
    assert "@media print" in css
    assert ".sena-printable-sheet" in css
    assert ".sena-evidence-sheet" in css
    assert ".evidence-header-table" in css
    assert ".signature-canvas-wrapper" in css
    assert ".evidence-verdict-box" in css


def test_manifest_refleja_la_salida_web_y_la_secuencia_real():
    with open(os.path.join(BASE, "guide.manifest.json"), encoding="utf-8") as f:
        manifest = json.load(f)

    assert manifest["guide"]["entrypoint"] == "./web/index.html"
    assert manifest["platform"]["modules"] == 18
    assert sum(fase["hours"] for fase in manifest["learningSequence"]) == 40
    assert "adaptación didáctica" in manifest["sources"][0]["use"].lower()


def test_registros_de_evidencias_son_una_fuente_unica_y_tienen_estaciones_reales():
    with open(os.path.join(BASE, "deliverables.registry.json"), encoding="utf-8") as f:
        root_registry = json.load(f)
    with open(os.path.join(BASE, "web", "deliverables.registry.json"), encoding="utf-8") as f:
        web_registry = json.load(f)
    with open(os.path.join(BASE, "web", "index.html"), encoding="utf-8") as f:
        html = f.read()

    assert root_registry == web_registry
    for artifact in root_registry["artifacts"]:
        section_id = artifact["station"]["sectionId"]
        assert f'id="{section_id}"' in html
        assert f'data-db-evidence="{artifact["id"]}"' in html


def test_guia_e2e_tiene_modelo_mental_glosario_y_simulador():
    """La ruta E2E debe enseñar el significado antes de pedir comandos."""
    content = ""
    for name in ("modules-content-2.js", "learning-visuals.js"):
        path = os.path.join(BASE, "web", "js", name)
        if os.path.isfile(path):
            with open(path, encoding="utf-8") as f:
                content += f.read()

    assert 'type: "definition"' in content
    assert 'type: "mental-map"' in content
    assert 'type: "glossary"' in content
    assert "End" in content and "to" in content
    assert "sim-e2e-container" in content


def test_renderizador_reconoce_bloques_de_aprendizaje_visual():
    """Los nuevos bloques se renderizan con un componente dedicado."""
    path = os.path.join(BASE, "web", "js", "code-renderer.js")
    with open(path, encoding="utf-8") as f:
        renderer = f.read()

    assert "bloqueDefinicion" in renderer
    assert "bloqueMapaMental" in renderer
    assert "bloqueGlosario" in renderer
    assert "case 'definition':" in renderer
    assert "case 'mental-map':" in renderer
    assert "case 'glossary':" in renderer


def test_simulador_e2e_muestra_recorrido_y_resultado_observable():
    """El simulador E2E debe permitir observar cada paso y clasificar el resultado."""
    files = [
        os.path.join(BASE, "web", "js", "learning-visuals.js"),
        os.path.join(BASE, "web", "index.html"),
        os.path.join(BASE, "web", "css", "styles.css"),
    ]
    content = "".join(open(path, encoding="utf-8").read() for path in files if os.path.isfile(path))

    assert "renderE2EJourney" in content
    assert "e2e-stage" in content
    assert "selector" in content
    assert "sim-e2e-container" in content


def test_testing_session_migra_simuladores_nuevos_sin_borrar_progreso():
    """Una versión nueva debe agregar simuladores al registro local existente."""
    path = os.path.join(BASE, "web", "js", "testing-session.js")
    with open(path, encoding="utf-8") as f:
        session = f.read()

    assert "Object.entries(DEFAULT_SIMULATORS)" in session
    assert "simulators[simId]" in session
    assert "JSON.stringify(simulators)" in session


def test_salida_web_funciona_sin_cdn_ni_motor_de_evidencias_duplicado():
    with open(os.path.join(BASE, "web", "index.html"), encoding="utf-8") as f:
        html = f.read()

    assert "fonts.googleapis.com" not in html
    assert "cdn.jsdelivr.net" not in html
    assert "js/deliverables-registry.js" in html
    assert "registro: window.GUIDE_DELIVERABLES" in html
    assert 'data-db-evidence-dossier' in html
    assert "sena-dossier.js" not in html
    assert "sena-dossier-root" not in html


def test_material_de_aprendizaje_no_contiene_credenciales_de_ejemplo():
    archivos = [
        os.path.join(BASE, "web", "index.html"),
        os.path.join(BASE, "web", "js", "modules-content.js"),
        os.path.join(BASE, "web", "js", "modules-content-2.js"),
        os.path.join(BASE, "web", "js", "testing-session.js"),
    ]
    archivos.extend(os.path.join(BASE, "web", "js", name) for name in MODULE_CONTENT_FILES)
    texto = "\n".join(open(ruta, encoding="utf-8").read().lower() for ruta in archivos)

    assert "admin123" not in texto
    assert "test123!" not in texto
    assert "1.020.345.678" not in texto


def test_modulos_ia_incluyen_constructor_de_gema_y_laboratorio_de_herramientas():
    html_path = os.path.join(BASE, "web", "index.html")
    with open(html_path, encoding="utf-8") as f:
        html = f.read()

    assert 'id="m-gema-testing"' in html
    assert 'id="m-herramientas-ia"' in html
    assert "Constructor de Gema QA" in html
    assert "Laboratorio de herramientas IA" in html
    assert "js/ai-testing-coach.js" in html
    assert "js/ai-tools-lab.js" in html
    assert "css/ai-testing-coach.css" in html

    content = ""
    for name in MODULE_CONTENT_FILES + ["ai-testing-coach.js", "ai-tools-lab.js"]:
        with open(os.path.join(BASE, "web", "js", name), encoding="utf-8") as f:
            content += f.read()

    for expected in [
        '"m-gema-testing"',
        '"m-herramientas-ia"',
        "generatePrompt",
        "ACCEPTANCE CRITERIA",
        "No pegues secretos",
        "Diffblue Cover",
        "GitHub Copilot",
        "Qodo",
        "mabl",
    ]:
        assert expected in content, f"Falta contenido del módulo IA: {expected}"


def test_constructor_gema_tiene_persistencia_y_verificaciones_de_calidad():
    path = os.path.join(BASE, "web", "js", "ai-testing-coach.js")
    with open(path, encoding="utf-8") as f:
        code = f.read()

    assert "localStorage" in code
    assert "navigator.clipboard" in code
    assert "runSanityChecks" in code
    assert "happyPath" in code
    assert "errorCases" in code
    assert "securityCases" in code
    assert "qualityGate" in code


def test_testing_session_persistencia_multidia_y_respaldos():
    """TestingSession debe soportar firma digital, exportación e importación de respaldo completo."""
    path = os.path.join(BASE, "web", "js", "testing-session.js")
    with open(path, encoding="utf-8") as f:
        code = f.read()

    assert "exportFullSessionBackup" in code
    assert "importFullSessionBackup" in code
    assert "getSignature" in code
    assert "saveSignature" in code
    assert "guia_testing_apprentice_signature" in code


def test_devbrain_evidence_hoja_oficial_dinamica_sena():
    """DevBrainEvidence debe generar la hoja oficial SENA con persistencia, simuladores y rúbrica dinámica."""
    path = os.path.join(BASE, "web", "js", "vendor", "devbrain-evidence.js")
    with open(path, encoding="utf-8") as f:
        code = f.read()

    assert "dbeConstruirHojaSena" in code
    assert "sena-evidence-sheet" in code
    assert "evidence-header-table" in code
    assert "DBE_SENA_LOGO_SVG" in code
    assert "exportFullSessionBackup" in code
    assert "btn-export-backup" in code
    assert "btn-restore-backup" in code
    assert "btn-save-memory" in code
    assert "data-toggle-check" in code
    assert "refrescarDossier" in code
    assert "dbeDescargarDocumentoHtml" in code
    assert "dbePaqueteAMarkdown" in code


def test_devbrain_evidence_css_badge_danger():
    """devbrain-evidence.css debe definir .badge--danger para estados de alerta y no cumplidos."""
    path = os.path.join(BASE, "web", "css", "vendor", "devbrain-evidence.css")
    with open(path, encoding="utf-8") as f:
        css = f.read()

    assert ".badge--danger" in css


def test_pdf_print_isolation_and_color_adjust():
    """styles.css y devbrain-evidence.css deben garantizar impresión limpia, exacta en color y aislada al documento oficial."""
    path_css = os.path.join(BASE, "web", "css", "styles.css")
    with open(path_css, encoding="utf-8") as f:
        css = f.read()

    assert "@media print" in css
    assert "print-color-adjust: exact" in css
    assert "-webkit-print-color-adjust: exact" in css
    assert "size: letter portrait" in css
    assert "break-inside: avoid" in css
    assert "printing-dossier" in css
    assert ".signature-mode-tabs" in css
    assert ".signature-typed-preview-card" in css
    assert "table-header-group" in css

    # devbrain-evidence.css no debe tener bordes obsoletos de impresión que compitan con la hoja oficial
    path_dbe_css = os.path.join(BASE, "web", "css", "vendor", "devbrain-evidence.css")
    with open(path_dbe_css, encoding="utf-8") as f:
        dbe_css = f.read()
    assert "border: 1px solid #999" not in dbe_css


def test_multi_mode_signature_and_print_workflow():
    """devbrain-evidence.js y la interfaz web deben proveer firma multi-modal (trazo, tipografía, carga y física) e impresión limpia y estandarizada."""
    path_dbe = os.path.join(BASE, "web", "js", "vendor", "devbrain-evidence.js")
    with open(path_dbe, encoding="utf-8") as f:
        dbe_code = f.read()

    assert "dbeEjecutarImpresionLimpia" in dbe_code
    assert "generarFirmaCaligraficaDataUrl" in dbe_code
    assert "tab-sig-draw" in dbe_code
    assert "tab-sig-type" in dbe_code
    assert "tab-sig-upload" in dbe_code
    assert "tab-sig-manual" in dbe_code
    assert "btn-role-apprentice" in dbe_code
    assert "btn-role-instructor" in dbe_code
    assert "signature-typed-preview" in dbe_code

    path_main = os.path.join(BASE, "web", "js", "main.js")
    with open(path_main, encoding="utf-8") as f:
        main_code = f.read()
    assert "imprimirDossier" in main_code
    assert "beforeprint" in main_code
    assert "afterprint" in main_code
    assert "initPrintHandlers" in main_code
    assert "showToast" in main_code

    path_html = os.path.join(BASE, "web", "index.html")
    with open(path_html, encoding="utf-8") as f:
        html = f.read()
    assert "btn-header-print-pdf" in html

    # Script estandarizado para generación headless
    path_export_pdf = os.path.join(BASE, "exportar-pdf.ps1")
    assert os.path.isfile(path_export_pdf)




