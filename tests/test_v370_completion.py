import json
import re
from pathlib import Path


BASE = Path(__file__).resolve().parents[1]
WEB = BASE / "web"


def read(path: str) -> str:
    return (BASE / path).read_text(encoding="utf-8")


def test_v370_shell_is_versioned_and_has_accessible_orientation_controls():
    html = read("web/index.html")
    scripts = re.findall(r'<script\b[^>]*\bsrc="([^"]+)"', html)

    assert scripts
    assert all("?v=3.7.0" in src for src in scripts), scripts
    assert '<a id="breadcrumb-root" href="#welcome">Guía Testing &amp; QA</a>' in html
    assert '<a href="#contenido" class="skip-link">Saltar al contenido</a>' in html
    assert '<main class="content" id="contenido">' in html
    assert re.search(r'<footer>.*?</footer>\s*</div>\s*\n\s*<div id="page-announcer"', html, re.S)

    tab_buttons = re.findall(
        r'<button[^>]*class="sim-tab-btn[^>]*"[^>]*role="tab"[^>]*aria-controls="([^"]+)"',
        html,
    )
    assert len(tab_buttons) == 3
    for panel_id in tab_buttons:
        assert f'id="{panel_id}"' in html
        assert f'aria-labelledby="' in html[html.index(f'id="{panel_id}"') :]


def test_v370_renderer_and_styles_keep_the_orientation_features_in_their_sources():
    renderer = read("web/js/code-renderer.js")
    styles = read("web/css/styles.css")
    main = read("web/js/main.js")

    assert "module-toc-styles" not in renderer
    assert ".module-toc" in styles
    assert "#back-to-top" in styles
    assert ".sidebar-search input::placeholder" in styles
    assert "@media (prefers-reduced-motion: reduce)" in styles
    assert "'m-reflexion'" not in main
    assert "breadcrumb-root" in main


def test_v370_defect_lifecycle_has_a_rendered_state_machine():
    renderer = read("web/js/code-renderer.js")
    defects = read("web/js/modules-defectos.js")

    assert "state-machine-flow" in renderer
    assert "state-machine-state" in renderer
    assert 'diagramType: "state-machine"' in defects
    assert 'title: "Ciclo de vida del defecto' in defects
    assert 'name: "Nuevo"' in defects
    assert 'name: "Retest"' in defects
    assert 'name: "Cerrado"' in defects


def test_v370_manifest_and_documentation_describe_the_18_station_route():
    manifest = json.loads(read("guide.manifest.json"))
    assert manifest["guide"]["version"] == "3.7.0"
    assert manifest["platform"]["modules"] == 18
    glossary = " ".join(item["term"] for item in manifest["glossary"])
    assert "Riesgo" in glossary
    assert "defecto" in glossary.lower()

    readme = read("README.md")
    assert "Mapa de las 18 estaciones" in readme
    assert "Decidir qué probar: priorización por riesgo" in readme
    assert "Gestión de defectos: del hallazgo al cierre" in readme

    readiness = read("GUIDE_READINESS_REVIEW.md")
    log = read("GUIDE_ITERATION_LOG.md")
    assert "3.7.0" in readiness
    assert "18 estaciones" in readiness
    assert "3.7.0" in log


def test_v370_assets_and_module_badges_match_the_new_contract():
    assert not (WEB / "assets" / "testing-journey-hero.png").exists()
    assert not (WEB / "css" / "design-refresh.css").exists()
    assert sum(path.stat().st_size for path in (WEB / "img").glob("*.jpg")) < 700_000
    assert sum(path.stat().st_size for path in (WEB / "fonts").glob("*.woff2")) < 400_000

    module_sources = list((WEB / "js").glob("modules-*.js"))
    badges = []
    for path in module_sources:
        badges.extend(re.findall(r'badge:\s*"([^"]+)"', path.read_text(encoding="utf-8")))
    assert len(badges) == 18
    assert all(re.match(r"^Estación (?:[1-9]|1[0-8])/18 ·", badge) for badge in badges)
