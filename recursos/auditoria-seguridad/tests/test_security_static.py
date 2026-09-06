"""Tests de checks de seguridad OWASP estaticos."""
from qa_auditor.models import Severity
from qa_auditor.security_static import (
    check_authz,
    check_cors,
    check_deps,
    check_secrets,
    check_secrets_gitignore,
    check_sqli,
    check_xss,
)


def test_check_secrets_detecta_claves(ctx_vulnerable):
    find = check_secrets(ctx_vulnerable)
    assert len(find) >= 2
    assert all(f.severity in {Severity.CRITICAL, Severity.HIGH} for f in find)
    assert all(f.evidence for f in find)
    assert all(f.category == "A02" for f in find)


def test_check_secrets_ignora_env_example(tmp_path):
    (tmp_path / ".env.example").write_text("API_KEY=AAAA_BBBBBBBB_CCCCCCCC1\n", encoding="utf-8")
    ctx = __import__("qa_auditor.scanner", fromlist=["ScanContext"]).ScanContext.build(tmp_path)
    assert check_secrets(ctx) == []


def test_check_sqli_detecta_concatenacion(ctx_vulnerable):
    find = check_sqli(ctx_vulnerable)
    assert len(find) >= 1
    assert find[0].severity == Severity.CRITICAL
    assert "nomb" in find[0].evidence or "SELECT" in find[0].evidence.upper()


def test_check_xss_detecta_innerhtml(ctx_vulnerable):
    find = check_xss(ctx_vulnerable)
    assert len(find) >= 1
    assert "INNERHTML" in find[0].evidence.upper()


def test_check_cors_comodin(tmp_path):
    (tmp_path / "main.py").write_text(
        "from fastapi.middleware.cors import CORSMiddleware\n"
        "app.add_middleware(CORSMiddleware, allow_origins=[\"*\"])\n",
        encoding="utf-8",
    )
    ctx = __import__("qa_auditor.scanner", fromlist=["ScanContext"]).ScanContext.build(tmp_path)
    find = check_cors(ctx)
    assert find and ("comodin" in find[0].title.lower() or "[*]" in find[0].evidence)


def test_check_deps_sin_version(ctx_vulnerable):
    find = check_deps(ctx_vulnerable)
    assert any("requests" in f.evidence or "requests" in f.detail for f in find)


def test_check_secrets_gitignore_flag_env(tmp_path):
    (tmp_path / ".env").write_text("DB_PASSWORD=rocket123superlong\n", encoding="utf-8")
    ctx = __import__("qa_auditor.scanner", fromlist=["ScanContext"]).ScanContext.build(tmp_path)
    find = check_secrets_gitignore(ctx)
    assert find and find[0].severity == Severity.CRITICAL


def test_check_authz_detecta_rutas_sin_autenticacion(tmp_path):
    (tmp_path / "app.py").write_text(
        "from fastapi import APIRouter\n"
        "router = APIRouter()\n"
        "@router.post(\"/admin/pagos\")\ndef pagos(): return {}\n",
        encoding="utf-8",
    )
    ctx = __import__("qa_auditor.scanner", fromlist=["ScanContext"]).ScanContext.build(tmp_path)
    find = check_authz(ctx)
    assert find and "control de acceso" in find[0].title.lower()
