"""Contrato de la práctica humano–IA distribuida por toda la guía."""
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "web"
MODULE_IDS = [
    "m-reflexion", "m-piramide", "m-tdd", "m-bdd",
    "m-pytest-fastapi", "m-pytest-flask", "m-jest-react", "m-junit-jsp",
    "m-playwright", "m-cobertura", "m-cicd", "m-observabilidad",
    "m-ia-testing", "m-gema-testing", "m-herramientas-ia", "m-reto",
]


def test_guia_carga_el_acompanamiento_ia_distribuido():
    html = (WEB / "index.html").read_text(encoding="utf-8")

    assert "css/ai-guided-practice.css" in html
    assert "js/ai-guided-practice-data.js" in html
    assert "js/ai-guided-practice.js" in html


def test_los_16_modulos_tienen_una_practica_ia_especifica():
    data = (WEB / "js" / "ai-guided-practice-data.js").read_text(encoding="utf-8")

    for module_id in MODULE_IDS:
        assert f"'{module_id}'" in data, module_id
    for field in ["goal:", "prompt:", "verify:", "cannotProve:", "humanDecision:", "recovery:"]:
        assert data.count(field) >= len(MODULE_IDS), field


def test_panel_separa_borrador_comprobacion_y_decision_humana():
    script = (WEB / "js" / "ai-guided-practice.js").read_text(encoding="utf-8")

    for expected in [
        "Propuesta de la IA ≠ evidencia",
        "Qué debes comprobar",
        "Qué no demuestra todavía",
        "Decisión humana",
        "aria-live",
        "navigator.clipboard",
        "recordSimulator",
    ]:
        assert expected in script


def test_panel_declara_privacidad_y_alternativa_sin_ia():
    script = (WEB / "js" / "ai-guided-practice.js").read_text(encoding="utf-8")

    assert "No pegues secretos" in script
    assert "Puedes hacer esta práctica sin IA" in script
    assert "no envía" in script


def test_portada_ensena_el_ciclo_de_trabajo_humano_ia():
    html = (WEB / "index.html").read_text(encoding="utf-8")

    for expected in ["Comprender", "Encargar", "Cuestionar", "Comprobar", "Decidir"]:
        assert expected in html


def test_simuladores_no_presentan_porcentajes_o_umbral_como_reglas_universales():
    html = (WEB / "index.html").read_text(encoding="utf-8")

    assert "ocurren el 80% de los defectos" not in html
    assert "Pruebas Unitarias (70%" not in html
    assert "Umbrales de cobertura (>= 80%)" not in html
    assert "proporción balanceada (70% Unit, 20% Integration, 10% E2E)" not in html


def test_simuladores_conservan_el_caso_conductor_y_distinguen_metodo_de_ejecucion():
    simulators = (WEB / "js" / "simulators.js").read_text(encoding="utf-8")

    assert "cantidad de equipos" in simulators
    assert "Válida (1 a 5)" in simulators
    assert 'title: "TDD: Ciclo Rojo-Verde-Refactor"' not in simulators
    assert 'title: "BDD: Especificaciones de Comportamiento"' not in simulators
    assert "Comprobaciones estáticas" in simulators
    assert "Compuerta: evidencia y decisión" in simulators
    assert "Que porcentaje de tests deben ser unitarios" not in simulators
    assert "Unit (70%)" not in simulators
    assert "Integration (20%)" not in simulators
    assert "E2E (10%)" not in simulators


def test_guia_no_convierte_ejemplos_contextuales_en_reglas_universales():
    visible_sources = [
        WEB / "index.html",
        WEB / "js" / "modules-content.js",
        WEB / "js" / "modules-cicd.js",
        WEB / "js" / "modules-ai-testing.js",
        WEB / "js" / "ai-testing-coach.js",
    ]
    content = "\n".join(path.read_text(encoding="utf-8") for path in visible_sources)

    for misleading_claim in [
        "garantizar retroalimentación rápida",
        "70% inferior de la piramide",
        "10% superior de la piramide",
        "Base 70% de la Pirámide",
        "Nivel Medio 20%",
        "Cúspide 10%",
        "impide físicamente",
        "Garantiza reproducibilidad determinista",
        "score caiga por debajo de 80%",
        "cobertura >= 80%",
    ]:
        assert misleading_claim not in content, misleading_claim
