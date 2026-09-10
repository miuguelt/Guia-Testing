"""Run the learner's examples, including the failures the text predicts."""
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
from zipfile import ZipFile

import pytest

ROOT = Path(__file__).resolve().parents[1]


@pytest.fixture(scope="module")
def course():
    node = shutil.which("node")
    assert node, "Node.js is required to load the web content."
    html = (ROOT / "web/index.html").read_text(encoding="utf-8")
    scripts = re.findall(r'src="(js/modules-[^"?]+)', html)
    program = "global.window={};" + "".join(
        f"require({json.dumps('./web/' + path)});" for path in scripts
    ) + "process.stdout.write(JSON.stringify(window.MODULES));"
    result = subprocess.run(
        [node, "-e", program], cwd=ROOT, capture_output=True, text=True,
        encoding="utf-8", check=True,
    )
    return json.loads(result.stdout)


def code_by_id(course, module_id):
    return {
        block["id"]: block["code"]
        for block in course[module_id]["blocks"] if "id" in block
    }


def run_python(directory, *args):
    environment = {
        **os.environ, "PYTEST_DISABLE_PLUGIN_AUTOLOAD": "1",
        "PYTHONDONTWRITEBYTECODE": "1", "PYTHONIOENCODING": "utf-8",
    }
    return subprocess.run(
        [sys.executable, "-B", "-m", *args], cwd=directory, env=environment,
        capture_output=True, text=True, encoding="utf-8", timeout=40,
    )


def test_tdd_examples_reproduce_red_green_boundary_and_refactor(course, tmp_path):
    snippets = code_by_id(course, "m-tdd")
    first = snippets["tdd-test-first"]
    boundary = first + "\n" + snippets["tdd-test-boundary"]
    stages = [
        ("tdd-red", first, 1, "1 failed"),
        ("tdd-green", first, 0, "1 passed"),
        ("tdd-green", boundary, 1, "1 failed, 1 passed"),
        ("tdd-final", snippets["tdd-test-final"], 0, "13 passed"),
        ("tdd-refactor", snippets["tdd-test-final"], 0, "13 passed"),
    ]
    for index, (implementation, tests, exit_code, summary) in enumerate(stages):
        stage = tmp_path / str(index)
        stage.mkdir()
        (stage / "cantidades.py").write_text(snippets[implementation], encoding="utf-8")
        (stage / "test_cantidades.py").write_text(tests, encoding="utf-8")
        result = run_python(stage, "pytest", "test_cantidades.py", "-q", "-p", "no:cacheprovider")
        assert result.returncode == exit_code, result.stdout + result.stderr
        assert summary in result.stdout, result.stdout


def test_downloaded_workshop_matches_web_and_executes(course, tmp_path):
    with ZipFile(ROOT / "web/downloads/guia-testing-qa.zip") as package:
        prefix = "guia-testing-qa/laboratorios/prestamos/"
        files = [entry for entry in package.namelist() if entry.startswith(prefix) and not entry.endswith("/")]
        assert files, "The download must contain the workshop."
        for entry in files:
            target = tmp_path / Path(entry).relative_to(prefix.rstrip("/"))
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(package.read(entry))
    tdd = code_by_id(course, "m-tdd")
    bdd = code_by_id(course, "m-bdd")
    expected = {
        "cantidades.py": tdd["tdd-refactor"],
        "test_cantidades.py": tdd["tdd-test-final"],
        "features/cantidades.feature": bdd["bdd-feature"],
        "features/steps/cantidades_steps.py": bdd["bdd-steps"],
    }
    for name, source in expected.items():
        assert (tmp_path / name).read_text(encoding="utf-8") == source
    result = run_python(tmp_path, "behave", "--tags=@cantidad", "--format", "progress")
    assert result.returncode == 0, result.stdout + result.stderr
    assert "6 scenarios passed" in result.stdout
    assert "18 steps passed" in result.stdout
    result = run_python(tmp_path, "pytest", "test_cantidades.py", "-q", "-p", "no:cacheprovider")
    assert result.returncode == 0, result.stdout + result.stderr
    assert "13 passed" in result.stdout


def test_bdd_detects_wrong_boundary(course, tmp_path):
    tdd = code_by_id(course, "m-tdd")
    bdd = code_by_id(course, "m-bdd")
    (tmp_path / "features/steps").mkdir(parents=True)
    (tmp_path / "cantidades.py").write_text(
        tdd["tdd-refactor"].replace("MAX_EQUIPOS = 5", "MAX_EQUIPOS = 4"),
        encoding="utf-8",
    )
    (tmp_path / "features/cantidades.feature").write_text(bdd["bdd-feature"], encoding="utf-8")
    (tmp_path / "features/steps/cantidades_steps.py").write_text(bdd["bdd-steps"], encoding="utf-8")
    result = run_python(tmp_path, "behave", "--format", "progress")
    assert result.returncode == 1, result.stdout + result.stderr
    assert "5 scenarios passed, 1 failed" in result.stdout
