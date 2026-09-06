"""Tests del motor de scoring y del flujo completo (scan -> informe)."""
import pytest

from qa_auditor.audit import scan
from qa_auditor.models import Finding, Severity
from qa_auditor.report import render_console, render_html, render_json
from qa_auditor.scoring import build_report, risk_label


def _f(dim: str, sev: Severity) -> Finding:
    return Finding(dimension=dim, severity=sev, title=f"{dim}-{sev.value}")


def test_severidad_orden():
    ws = sorted(
        [_f("seguridad", Severity.INFO), _f("seguridad", Severity.CRITICAL),
         _f("seguridad", Severity.MEDIUM)],
        key=lambda f: f.key(),
    )
    assert [w.severity for w in ws] == [Severity.CRITICAL, Severity.MEDIUM, Severity.INFO]


def test_critical_no_destruye_la_dimension():
    report = build_report([_f("seguridad", Severity.CRITICAL)], "x")
    seg = next(d for d in report.dimensions if d.key == "seguridad")
    assert seg.score == 0.0
    assert report.security_score == 0.0


def test_alta_acumulada_penaliza():
    report = build_report([_f("eficiencia", Severity.MEDIUM)] * 4, "x")
    dim = next(d for d in report.dimensions if d.key == "eficiencia")
    assert dim.score < 100
    assert dim.score >= 0


def test_riesgo_nivel_por_umbral():
    assert risk_label(95) == "EXCELENTE"
    assert risk_label(85) == "MUY BUENA"
    assert risk_label(65) == "ACEPTABLE"
    assert risk_label(55) == "DEBIL"
    assert risk_label(10) == "CRITICA"


def test_scan_global_vulnerable(vulnerable_app):
    report = scan(vulnerable_app)
    assert report.overall < 80, "la app vulnerable debe salir bajita"
    dims = {d.key: d.score for d in report.dimensions}
    assert dims["seguridad"] < 90
    assert dims["ia"] < 100
    assert any(w.category == "A02" for w in report.weaknesses)
    assert any(w.category == "hallucination" for w in report.weaknesses)


def test_scan_clean_logra_alto_score(clean_app):
    report = scan(clean_app)
    assert report.overall >= 55, "app limpia debe superar 55% (puede tener info/low)"
    assert report.security_score >= 80, "app sin secretos ni XSS: seguridad alta"


def test_reportes_json_html_consola(vulnerable_app, tmp_path):
    report = scan(vulnerable_app)
    data = render_json(report)
    assert '"overall_score"' in data and '"weaknesses"' in data
    html = render_html(report)
    assert "<html" in html and "Auditoría" in html
    console = render_console(report)
    assert "SEGURIDAD" in console and "%" in console


def test_score_bounded(tmp_path):
    report = scan(tmp_path)
    assert 0 <= report.overall <= 100
    assert 0 <= report.security_score <= 100
