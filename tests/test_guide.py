"""Tests de estructura de la guia Testing."""
import os
import pytest

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def test_estructura_web():
    assert os.path.isfile(os.path.join(BASE, "web", "index.html"))
    assert os.path.isfile(os.path.join(BASE, "web", "css", "styles.css"))


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

    # Validar que modules-content-2.js contiene los bloques interactivos
    mc_path = os.path.join(BASE, "web", "js", "modules-content-2.js")
    with open(mc_path, "r", encoding="utf-8") as f:
        mc = f.read()
    assert "Relación Simbiótica: Testing y GitHub" in mc
    assert "La Regla SSoT y el Control de Artefactos" in mc
    assert "Seguridad en Pruebas" in mc
    assert "Repositorios Públicos vs. Privados" in mc
    assert "Tests para Git" in mc
    assert ".pre-commit-config.yaml" in mc

    # Validar que generar_guia.py incluye la teoría
    gg_path = os.path.join(BASE, "generar_guia.py")
    with open(gg_path, "r", encoding="utf-8") as f:
        gg = f.read()
    assert "Relacion entre Testing y GitHub" in gg
    assert "First-Class Citizens" in gg
    assert "seguridad por oscuridad" in gg
    assert "Repositorios Publicos vs Privados" in gg
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
    for f in ["modules-content.js", "modules-content-2.js"]:
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
    for f in ["modules-content.js", "modules-content-2.js"]:
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
    gen_path = os.path.join(BASE, "generar_guia.py")
    with open(gen_path, "r", encoding="utf-8") as f:
        code = f.read()
    assert "agregar_pasos" in code
    assert "Flujo Logico Maestro de 7 Fases" in code


def test_simulador_secuenciador_fases():
    sim_path = os.path.join(BASE, "web", "js", "simulators.js")
    with open(sim_path, "r", encoding="utf-8") as f:
        code = f.read()
    assert "renderPhaseSequencer" in code
    assert "sim-sequencer-container" in code
    assert "addXP(100" in code
    assert "Pruebas Unitarias de Lógica Pura" in code
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
    assert "sena-dossier-root" in html
    assert "testing-session.js" in html
    assert "sena-dossier.js" in html
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



