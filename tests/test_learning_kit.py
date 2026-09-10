"""Contrato del kit visual y de simulacion que acompana cada modulo."""
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
WEB_ROOT = PROJECT_ROOT / "web"


def test_kit_visual_y_simulador_estan_conectados_a_la_guia():
    html = (WEB_ROOT / "index.html").read_text(encoding="utf-8")
    assert 'css/module-learning-kit.css' in html
    assert 'js/module-learning-kit-data.js' in html
    assert 'js/module-learning-kit.js' in html


def test_kit_declara_los_16_modulos_de_la_ruta():
    data = (WEB_ROOT / "js" / "module-learning-kit-data.js").read_text(encoding="utf-8")
    expected_ids = [
        "m-reflexion", "m-piramide", "m-pytest-fastapi", "m-pytest-flask",
        "m-jest-react", "m-junit-jsp", "m-tdd", "m-bdd", "m-playwright",
        "m-cobertura", "m-cicd", "m-observabilidad", "m-ia-testing",
        "m-gema-testing", "m-herramientas-ia", "m-reto",
    ]
    for module_id in expected_ids:
        assert module_id in data


def test_kit_tiene_diagrama_grafico_tabla_y_simulador_accesibles():
    script = (WEB_ROOT / "js" / "module-learning-kit.js").read_text(encoding="utf-8")
    css = (WEB_ROOT / "css" / "module-learning-kit.css").read_text(encoding="utf-8")
    for expected in [
        "renderFlowDiagram", "renderFocusChart", "renderDecisionTable",
        "renderDecisionSimulator", "aria-live", "role=\"img\"",
    ]:
        assert expected in script
    assert ".learning-kit" in css
    assert ".learning-kit-chart" in css
    assert ".learning-kit-simulator" in css


def test_kit_prioriza_un_modelo_visual_semantico_sobre_el_panel_generico():
    """Cada módulo debe explicar su relación causal, no mostrar métricas ornamentales."""
    script = (WEB_ROOT / "js" / "module-learning-kit.js").read_text(encoding="utf-8")

    assert "renderSemanticVisual" in script
    assert "learning-kit-model" in script
    assert "grid.appendChild(this.renderFocusChart(kit, moduleId))" not in script
    assert "grid.appendChild(this.renderDecisionTable(kit))" not in script
    assert "grid.appendChild(this.renderDecisionSimulator(moduleId, kit))" not in script


def test_portada_no_presenta_una_ilustracion_generica_como_contenido():
    """La orientación inicial debe vivir en texto y HTML accesible, no en una imagen decorativa."""
    html = (WEB_ROOT / "index.html").read_text(encoding="utf-8")

    assert "testing-journey-hero.png" not in html
    assert "hero-art" not in html
    assert "Ruta de aprendizaje" in html


def test_simulador_de_decisiones_se_consolida_en_la_sesion():
    session = (WEB_ROOT / "js" / "testing-session.js").read_text(encoding="utf-8")
    kit = (WEB_ROOT / "js" / "module-learning-kit.js").read_text(encoding="utf-8")
    assert "sim-module-decisions" in session
    assert "sim-module-decisions" in kit


def test_cada_modulo_tiene_lectura_propia_y_un_recorrido_especifico():
    """La capa compartida no debe volver a pintar el mismo resumen en todos los módulos."""
    data = (WEB_ROOT / "js" / "module-learning-kit-data.js").read_text(encoding="utf-8")
    for field in ["moduleNumber", "headline", "question", "signal", "evidence", "flow", "special"]:
        assert data.count(field) >= 16, field


def test_kit_incluye_micro_laboratorio_interactivo_y_estados_accesibles():
    """Cada módulo debe ofrecer una acción observable, no solo contenido decorativo."""
    kit = (WEB_ROOT / "js" / "module-learning-kit.js").read_text(encoding="utf-8")
    css = (WEB_ROOT / "css" / "module-learning-kit.css").read_text(encoding="utf-8")
    for expected in ["renderSpecialLab", "learning-kit-special", "learning-kit-flow-detail", "data-special-option"]:
        assert expected in kit
    for expected in [".learning-kit-proof-strip", ".learning-kit-step", ".learning-kit-special", ".learning-kit-empty"]:
        assert expected in css


def test_micro_laboratorio_tiene_registro_separado_en_la_sesion():
    """El nuevo ejercicio no debe sobrescribir el simulador de decisiones existente."""
    session = (WEB_ROOT / "js" / "testing-session.js").read_text(encoding="utf-8")
    assert "sim-module-special" in session
