import re
from pathlib import Path


BASE = Path(__file__).resolve().parents[1]
STYLES = (BASE / "web" / "css" / "styles.css").read_text(encoding="utf-8")
AI_STYLES = (BASE / "web" / "css" / "ai-testing-coach.css").read_text(encoding="utf-8")
EVIDENCE_STYLES = (BASE / "web" / "css" / "vendor" / "devbrain-evidence.css").read_text(encoding="utf-8")


def css_rule(source: str, selector: str) -> str:
    """Obtiene la primera regla simple de un selector para hacer el contrato legible."""
    match = re.search(rf"(?m)^\s*{re.escape(selector)}\s*\{{(?P<body>[^}}]*)\}}", source)
    assert match, f"No existe la regla CSS esperada: {selector}"
    return match.group("body")


def test_layout_principal_es_mobile_first_y_reserva_el_menu_para_pantallas_holgada():
    """Given 320 px, When carga la guía, Then el contenido ocupa el ancho y el menú no lo comprime."""
    sidebar = css_rule(STYLES, ".sidebar")
    main_wrapper = css_rule(STYLES, ".main-wrapper")
    content = css_rule(STYLES, ".content")

    assert "transform: translateX(-100%)" in sidebar
    assert "display: inline-flex" in css_rule(STYLES, ".sidebar-toggle")
    assert "margin-left: 0" in main_wrapper
    assert "width: 100%" in content
    assert "max-width: none" in content
    assert "@media (min-width: 85rem)" in STYLES
    assert "width: calc(100% - var(--sidebar-width))" in STYLES
    assert "min-height: 42px" in css_rule(STYLES, ".btn")
    assert "@media (max-width: 1024px)" not in STYLES
    assert "@media (max-width: 768px)" not in STYLES


def test_rejillas_de_la_guia_arrancan_en_una_columna_y_se_expanden_progresivamente():
    """Given una pantalla angosta, When se pinta cualquier panel, Then ninguna rejilla exige dos columnas."""
    for selector in (
        ".download-content-grid",
        ".download-requirements",
        ".download-command-grid",
        ".download-results-grid",
        ".tech-grid",
        ".concept-grid",
        ".grid-2-cols",
        ".sim-split",
        ".modal-stats-grid",
    ):
        if selector == ".modal-stats-grid":
            assert re.search(
                r"\.modal-stats-grid\s*\{[^}]*grid-template-columns:\s*1fr",
                STYLES,
            ), selector
        else:
            assert "grid-template-columns: 1fr" in css_rule(STYLES, selector), selector

    assert "@container section-card (min-width: 48rem)" in STYLES
    assert "@container section-card (min-width: 64rem)" in STYLES


def test_laboratorio_ia_y_evidencias_respetan_el_mismo_contrato_mobile_first():
    """Given 320 px, When cargan módulos dinámicos, Then comienzan apilados y abren columnas solo con holgura."""
    assert "grid-template-columns: 1fr" in css_rule(AI_STYLES, ".gema-layout")
    assert re.search(
        r"\.tool-lab-practice,\s*\.tool-compare\s*\{[^}]*grid-template-columns:\s*1fr",
        AI_STYLES,
    )
    assert "@media (max-width: 760px)" not in AI_STYLES
    assert "@media (min-width: 40rem)" in EVIDENCE_STYLES
    assert "grid-template-columns: 1fr" in css_rule(EVIDENCE_STYLES, ".evidence-form-grid")
    assert "min-height: 2.625rem" in css_rule(EVIDENCE_STYLES, ".dbe-campo__control")


def test_pregunta_esencial_aprovecha_el_ancho_de_su_tarjeta():
    """Given la tarjeta hero, When aparece la pregunta PBL, Then usa el contrato global de ancho."""
    question = re.search(
        r"\.content p,\s*\.content li,\s*\.content blockquote\s*\{(?P<body>[^}]*)\}",
        STYLES,
        re.DOTALL,
    )
    assert question, "No existe el contrato global de prosa de la guía"

    assert "max-width: none" in question.group("body")
    assert "width: 100%" in question.group("body")


def test_la_web_aprovecha_el_ancho_util_para_toda_la_prosa():
    """Given cualquier panel de la guía, When muestra texto natural, Then no lo encoge con 78ch."""
    content = css_rule(STYLES, ".content")

    assert "width: 100%" in content
    assert "max-width: none" in content
    assert re.search(
        r"\.content p,\s*\.content li,\s*\.content blockquote\s*\{[^}]*"
        r"width:\s*100%;[^}]*max-width:\s*none",
        STYLES,
        re.DOTALL,
    )
    assert "max-width: 78ch" not in STYLES
    assert "max-width: 70ch" not in AI_STYLES
    assert "max-width: 78ch" not in EVIDENCE_STYLES
    assert "max-width: 1040px" not in STYLES


def test_el_boton_del_menu_muestra_foco_visible():
    """Given navegación por teclado, When el menú recibe foco, Then la ubicación es perceptible."""
    assert ".sidebar-toggle:focus," in STYLES
    assert ".sidebar-toggle:focus-visible" in STYLES
    assert "outline:" in css_rule(STYLES, ".sidebar-toggle:focus-visible")
