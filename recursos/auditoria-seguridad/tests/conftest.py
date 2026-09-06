"""Fixtures del auditor: proyectos sinteticos con problemas conocidos."""
import sys
from pathlib import Path

import pytest

PACKAGE_DIR = Path(__file__).resolve().parents[1]  # auditoria-seguridad
sys.path.insert(0, str(PACKAGE_DIR))

from qa_auditor.scanner import ScanContext  # noqa: E402

FIXTURES = Path(__file__).resolve().parent / "fixtures"


@pytest.fixture
def vulnerable_app(tmp_path: Path) -> Path:
    """App con secretos, SQLi, XSS, stubs IA y deps sin anclar."""
    (tmp_path / "src").mkdir()
    (tmp_path / "src" / "app.py").write_text(
        'import numpy as np\n'
        'POSTGRES = "postgres://admin:secreto123@db:5432/finca"\n'
        'API_KEY = "sk-proj-3X7FhB0wXqLm9Np2R8Tz5KdY6GcJ1Vb4"\n'
        'cur.execute("SELECT * FROM productos WHERE nombre = " + nombre)\n'
        'div.innerHTML = user_input\n'
        "def obtener_precios():\n"
        "    # datos simulados temporalmente mientras hay contrato\n"
        "    return [{'precio': 10}]\n",
        encoding="utf-8",
    )
    (tmp_path / "src" / "viejo.py").write_text(
        "def_import = 1\n"
        "def completar_pago():\n"
        "    # TODO: implementar transaccion\n"
        "    pass\n",
        encoding="utf-8",
    )
    (tmp_path / "requirements.txt").write_text("requests\nfastapi>=0.110\n", encoding="utf-8")
    (tmp_path / "tests").mkdir(parents=True)
    (tmp_path / "tests" / "test_demo.py").write_text(
        "def test_crear():\n"
        "    crear()\n"
        "    assert True\n",  # asercion trampa: aprobara en verde siempre
        encoding="utf-8",
    )
    return tmp_path


@pytest.fixture
def clean_app(tmp_path: Path) -> Path:
    """App minima bien construida: sin hallazgos deliberate."""
    (tmp_path / "app").mkdir()
    (tmp_path / "app" / "main.py").write_text(
        '"""API con seguridad basica."""\n'
        "from fastapi import FastAPI, Depends\n"
        "from pydantic import BaseModel\n"
        "from sqlalchemy.orm import Session\n\n"
        "app = FastAPI(title=\"Demo\", docs_url=\"/docs\")\n\n"
        "@app.get(\"/health\")\n"
        "def health():\n"
        '    return {"ok": True}\n',
        encoding="utf-8",
    )
    (tmp_path / "requirements.txt").write_text(
        "fastapi==0.128.8\npydantic==2.13.3\n", encoding="utf-8"
    )
    return tmp_path


@pytest.fixture
def ctx_vulnerable(vulnerable_app: Path) -> ScanContext:
    return ScanContext.build(vulnerable_app)


@pytest.fixture
def ctx_clean(clean_app: Path) -> ScanContext:
    return ScanContext.build(clean_app)
