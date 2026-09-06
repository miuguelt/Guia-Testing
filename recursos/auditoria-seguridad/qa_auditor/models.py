"""Modelos del auditor: hallazgos, severidades, dimensiones y pesos."""
from __future__ import annotations

import enum
from dataclasses import dataclass, field


class Severity(str, enum.Enum):
    """Severidad de un hallazgo, en orden de impacto."""

    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


SEVERITY_ORDER = {
    Severity.CRITICAL: 0,
    Severity.HIGH: 1,
    Severity.MEDIUM: 2,
    Severity.LOW: 3,
    Severity.INFO: 4,
}

SEVERITY_PENALTY = {
    Severity.CRITICAL: 25.0,
    Severity.HIGH: 15.0,
    Severity.MEDIUM: 8.0,
    Severity.LOW: 3.0,
    Severity.INFO: 1.0,
}


def severity_key(value: str) -> int:
    """Indice de orden para ordenar hallazgos por impacto."""
    try:
        return SEVERITY_ORDER[Severity(value)]
    except ValueError:
        return 99


@dataclass
class Finding:
    """Un hallazgo del auditor con evidencia textual y remediacion."""

    dimension: str
    severity: Severity
    title: str
    detail: str = ""
    evidence: str = ""
    remedy: str = ""
    source: str = ""
    category: str = ""  # OWASP A0x, ISO 25010 subcaracteristica, etc.

    def key(self) -> tuple[int, str, str]:
        return (severity_key(self.severity.value), self.dimension, self.title)


@dataclass
class CheckResult:
    """Resultado de un check (paso o hallazgos)."""

    ok: bool
    title: str
    findings: list[Finding] = field(default_factory=list)
    detail: str = ""


def penalize(findings: list[Finding]) -> float:
    """Suma los puntos de penalizacion de una lista de hallazgos."""
    return sum(SEVERITY_PENALTY.get(f.severity, 0.0) for f in findings)
