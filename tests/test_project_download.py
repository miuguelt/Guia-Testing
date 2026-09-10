"""Regression checks for the learner project download package."""

from pathlib import Path
from zipfile import ZipFile


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DOWNLOAD_PATH = PROJECT_ROOT / "web" / "downloads" / "guia-testing-qa.zip"


def test_download_package_is_published_and_clean():
    """The web guide must publish a usable source package, without local debris."""
    assert DOWNLOAD_PATH.is_file(), "Falta el ZIP descargable del proyecto de práctica"

    with ZipFile(DOWNLOAD_PATH) as package:
        names = set(package.namelist())

    package_root = "guia-testing-qa/"
    required = {
        f"{package_root}README.md",
        f"{package_root}requirements.txt",
        f"{package_root}package.json",
        f"{package_root}vitest.config.js",
        f"{package_root}run-tests.ps1",
        f"{package_root}src/components/Contador.jsx",
        f"{package_root}tests/unit/test_calculos.py",
        f"{package_root}tests/Contador.test.jsx",
        f"{package_root}tests/e2e/flask_jinja.spec.js",
    }
    assert required <= names
    assert "README.md" not in names
    relative_names = {
        name.removeprefix(package_root)
        for name in names
        if name.startswith(package_root)
    }
    assert not any(
        name.startswith(("__pycache__/", ".pytest_cache/", "node_modules/", "target/"))
        or name in {".coverage", "test.db"}
        for name in relative_names
    )


def test_guide_links_to_the_project_download():
    """The published download section must expose the ZIP to the learner."""
    guide = (PROJECT_ROOT / "web" / "index.html").read_text(encoding="utf-8")
    assert 'href="downloads/guia-testing-qa.zip"' in guide
    assert "run-tests.ps1 -SkipJava -SkipE2E" in guide


def test_download_path_is_resolved_from_the_web_app_base_path():
    """The download must work when the static guide is hosted below a URL prefix."""
    main = (PROJECT_ROOT / "web" / "js" / "main.js").read_text(encoding="utf-8")
    assert "resolveProjectDownloadUrl" in main
    assert "download-project-link" in main
    assert "../downloads/guia-testing-qa.zip" in main
