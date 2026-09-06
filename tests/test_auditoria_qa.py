"""Integracion: el auditor mide la app de ejemplo de la guia."""
import os
import sys
from pathlib import Path

import pytest

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDITOR_DIR = os.path.join(BASE, "recursos", "auditoria-seguridad")
APP_EJEMPLO = Path(BASE) / "recursos" / "codigo-ejemplo"

sys.path.insert(0, AUDITOR_DIR)

from qa_auditor.audit import scan  # noqa: E402
from qa_auditor.report import render_console  # noqa: E402


@pytest.fixture(scope="module")
def example_report():
    return scan(APP_EJEMPLO)


def test_security_score_en_porcentaje(example_report):
    assert example_report.security_score >= 0
    assert example_report.security_score <= 100
    assert example_report.security_score == float(example_report.security_score)


def test_indice_global_ponderado(example_report):
    assert 0 <= example_report.overall <= 100
    assert len(example_report.dimensions) == 9


def test_dimensiones_iso_25010_presentes(example_report):
    keys = {d.key for d in example_report.dimensions}
    for expected in {"funcionalidad", "fiabilidad", "eficiencia", "usabilidad",
                     "seguridad", "mantenibilidad", "portabilidad", "compatibilidad", "ia"}:
        assert expected in keys, f"Falta la dimension {expected}"


def test_debilidades_con_remedio(example_report):
    for w in example_report.weaknesses:
        assert w.title
        assert w.remedy, "Cada debilidad debe indicar como corregirla"


def test_report_consola_incluye_security(example_report):
    out = render_console(example_report)
    assert "SEGURIDAD" in out
    assert "%" in out


def test_app_ejemplo_sin_critical(example_report):
    criticos = [w for w in example_report.weaknesses if w.severity.value == "critical"]
    assert criticos == [], "La app de ejemplo no debe tener hallazgos criticos"
