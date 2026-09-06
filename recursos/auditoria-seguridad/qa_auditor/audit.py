"""Orquestador del barrido: ejecuta los registros de checks y entrega el informe."""
from __future__ import annotations

from pathlib import Path

from .ai_checks import (
    check_ai_hallucinated_imports,
    check_ai_mock_data,
    check_ai_stubs,
    check_ai_test_quality,
    check_ai_unused_code,
)
from .models import Finding
from .quality_checks import (
    check_compatibilidad,
    check_eficiencia,
    check_fiabilidad,
    check_funcionalidad,
    check_mantenibilidad,
    check_portabilidad,
    check_usabilidad,
)
from .scanner import ScanContext
from .scoring import Report, build_report
from .security_static import (
    check_authz,
    check_cors,
    check_deps,
    check_secrets,
    check_secrets_gitignore,
    check_sqli,
    check_xss,
)

STATIC_CHECKS = [
    check_secrets,
    check_secrets_gitignore,
    check_sqli,
    check_xss,
    check_authz,
    check_cors,
    check_deps,
    check_funcionalidad,
    check_fiabilidad,
    check_eficiencia,
    check_usabilidad,
    check_mantenibilidad,
    check_portabilidad,
    check_compatibilidad,
    check_ai_stubs,
    check_ai_mock_data,
    check_ai_hallucinated_imports,
    check_ai_test_quality,
    check_ai_unused_code,
]


def scan(target: Path, url: str | None = None) -> Report:
    """Realiza la auditoria estatica (y opcional en caliente) del objetivo."""
    ctx = ScanContext.build(target)
    findings: list[Finding] = []
    for check in STATIC_CHECKS:
        findings.extend(check(ctx))
    if url:
        from .security_live import check_live_http

        findings.extend(check_live_http(url))
    return build_report(findings, target=str(target), url=url)
