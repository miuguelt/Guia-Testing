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

    required = {
        "README.md",
        "requirements.txt",
        "package.json",
        "vitest.config.js",
        "src/components/Contador.jsx",
        "tests/unit/test_calculos.py",
        "tests/Contador.test.jsx",
        "tests/e2e/flask_jinja.spec.js",
    }
    assert required <= names
    assert not any(
        name.startswith(("__pycache__/", ".pytest_cache/", "node_modules/", "target/"))
        or name in {".coverage", "test.db"}
        for name in names
    )


def test_guide_links_to_the_project_download():
    """The published download section must expose the ZIP to the learner."""
    guide = (PROJECT_ROOT / "web" / "index.html").read_text(encoding="utf-8")
    assert 'href="downloads/guia-testing-qa.zip"' in guide
