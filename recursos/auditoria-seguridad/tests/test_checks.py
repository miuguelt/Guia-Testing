"""Tests de checks ISO/IEC 25010 y de calidad de codigo IA."""
from qa_auditor.ai_checks import (
    check_ai_hallucinated_imports,
    check_ai_mock_data,
    check_ai_stubs,
    check_ai_test_quality,
    check_ai_unused_code,
)
from qa_auditor.quality_checks import (
    check_compatibilidad,
    check_eficiencia,
    check_fiabilidad,
    check_funcionalidad,
    check_mantenibilidad,
    check_portabilidad,
    check_usabilidad,
)


def test_stub_todo_y_pass(ctx_vulnerable):
    find = check_ai_stubs(ctx_vulnerable)
    titles = " ".join(f.title for f in find)
    assert any("completar" in t.lower() for t in [f.title for f in find])
    assert any(f.category == "stub" for f in find)
    assert any(f.severity.value == "medium" for f in find)


def test_prueba_sin_asercion_detectada(ctx_vulnerable):
    find = check_ai_test_quality(ctx_vulnerable)
    assert len(find) == 1
    assert "sin aserciones" in find[0].title.lower()


def test_import_alucinado(ctx_vulnerable):
    find = check_ai_hallucinated_imports(ctx_vulnerable)
    assert find, "debio detectar import no declarado"
    assert any(f.category == "hallucination" for f in find)


def test_funcion_muerta_detectada(ctx_vulnerable):
    find = check_ai_unused_code(ctx_vulnerable)
    assert any("completar_pago" in f.evidence or "completar" in f.evidence for f in find)


def test_datos_simulados(ctx_vulnerable):
    find = check_ai_mock_data(ctx_vulnerable)
    assert any("simulado" in f.title.lower() or "simulados" in f.title.lower() for f in find)


def test_funcionalidad_contrato(ctx_clean):
    find = check_funcionalidad(ctx_clean)
    assert not any("Sin validacion" in f.title for f in find)


def test_fiabilidad_sin_handler(tmp_path):
    (tmp_path / "x.py").write_text("def nada():\n    return 1\n", encoding="utf-8")
    ctx = __import__("qa_auditor.scanner", fromlist=["ScanContext"]).ScanContext.build(tmp_path)
    find = check_fiabilidad(ctx)
    assert any("centralizado" in f.title or "fallas" in f.title for f in find)


def test_eficiencia_paginacion(tmp_path):
    (tmp_path / "x.py").write_text("items = session.query(P).all()\n", encoding="utf-8")
    ctx = __import__("qa_auditor.scanner", fromlist=["ScanContext"]).ScanContext.build(tmp_path)
    find = check_eficiencia(ctx)
    assert any("Paginacion" in f.title or "paginacion" in f.title for f in find)


def test_usabilidad_lang(tmp_path):
    (tmp_path / "index.html").write_text("<html><head><title>x</title></head></html>", encoding="utf-8")
    ctx = __import__("qa_auditor.scanner", fromlist=["ScanContext"]).ScanContext.build(tmp_path)
    find = check_usabilidad(ctx)
    assert any("idioma" in f.title.lower() for f in find)


def test_portabilidad_config_hardcodeada(tmp_path):
    (tmp_path / "x.py").write_text("DB_URL = 'sqlite:///local.db'\n", encoding="utf-8")
    ctx = __import__("qa_auditor.scanner", fromlist=["ScanContext"]).ScanContext.build(tmp_path)
    find = check_portabilidad(ctx)
    assert any("hardcodeada" in f.title.lower() for f in find)


def test_mantenibilidad_modulo_grande(tmp_path):
    (tmp_path / "gigante.py").write_text("x = 1\n" * 300, encoding="utf-8")
    ctx = __import__("qa_auditor.scanner", fromlist=["ScanContext"]).ScanContext.build(tmp_path)
    find = check_mantenibilidad(ctx)
    assert any("grande" in f.title.lower() for f in find)


def test_compatibilidad_openapi(tmp_path):
    (tmp_path / "main.py").write_text(
        'from fastapi import FastAPI\napp = FastAPI(title="X")\n@app.get("/")\ndef h(): return 1\n',
        encoding="utf-8",
    )
    ctx = __import__("qa_auditor.scanner", fromlist=["ScanContext"]).ScanContext.build(tmp_path)
    find = check_compatibilidad(ctx)
    assert any("openapi" in f.title.lower() or "OpenAPI" in f.title for f in find)
