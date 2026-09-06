"""Motor de scoring: convierte hallazgos en porcentajes por dimension."""
from __future__ import annotations

from dataclasses import dataclass

from .models import Finding

DIMENSIONS: dict[str, float] = {
    "funcionalidad": 1.0,
    "fiabilidad": 1.0,
    "eficiencia": 0.75,
    "usabilidad": 0.75,
    "seguridad": 2.0,
    "mantenibilidad": 0.75,
    "portabilidad": 0.5,
    "compatibilidad": 0.5,
    "ia": 1.25,
}

SEVERITY_CAP = {
    # (penalizacion por hallazgo, techo total para esa severidad)
    "critical": (100.0, 100.0),
    "high": (25.0, 75.0),
    "medium": (8.0, 90.0),
    "low": (3.0, 100.0),
    "info": (1.0, 100.0),
}

RISK_LEVELS = [
    (90.0, "EXCELENTE"),
    (80.0, "MUY BUENA"),
    (70.0, "BUENA"),
    (60.0, "ACEPTABLE"),
    (50.0, "DEBIL"),
    (0.0, "CRITICA"),
]


@dataclass
class DimensionScore:
    """Score 0-100 de una dimension y su carga de hallazgos."""

    key: str
    score: float
    findings: list[Finding]
    weight: float


@dataclass
class Report:
    """Informe completo del barrido."""

    target: str
    url: str | None
    dimensions: list[DimensionScore]
    security_score: float
    weaknesses: list[Finding]

    @property
    def overall(self) -> float:
        """Promedio ponderado de dimensiones (0-100)."""
        total_weight = sum(d.weight for d in self.dimensions)
        if total_weight == 0:
            return 0.0
        return round(
            sum(d.score * d.weight for d in self.dimensions) / total_weight, 1
        )

    def to_dict(self) -> dict:
        return {
            "target": self.target,
            "url": self.url,
            "overall_score": self.overall,
            "security_score": round(self.security_score, 1),
            "risk_level": risk_label(self.overall),
            "dimensions": [
                {
                    "key": d.key,
                    "score": round(d.score, 1),
                    "weight": d.weight,
                    "findings_count": len(d.findings),
                }
                for d in self.dimensions
            ],
            "weaknesses": [
                {
                    "dimension": f.dimension,
                    "severity": f.severity.value,
                    "category": f.category,
                    "title": f.title,
                    "detail": f.detail,
                    "evidence": f.evidence,
                    "remedy": f.remedy,
                }
                for f in self.weaknesses
            ],
        }


def risk_label(score: float) -> str:
    """Rotulo cualitativo del score (0-100)."""
    for threshold, label in RISK_LEVELS:
        if score >= threshold:
            return label
    return RISK_LEVELS[-1][1]


def _dimension_score(key: str, findings: list[Finding]) -> float:
    """100 menos penalizaciones, con techo por severidad y minimo 0.

    Cada hallazgo resta su severidad, pero la suma por severidad tiene tope
    (p. ej. tres `high` suman 75 y la dimension queda en 25). Un solo
    `critical` anula la dimension por completo (100 puntos).
    """
    per_severity: dict[str, float] = {}
    for f in findings:
        sev = f.severity.value
        per_finding, cap = SEVERITY_CAP[sev]
        per_severity[sev] = min(per_severity.get(sev, 0.0) + per_finding, cap)
    total_penalty = sum(per_severity.values())
    score = max(0.0, 100.0 - total_penalty)
    return round(score, 2)


def build_report(findings: list[Finding], target: str, url: str | None = None) -> Report:
    """Construye el informe agrupando hallazgos por dimension."""
    dim_scores: list[DimensionScore] = []
    for key, weight in DIMENSIONS.items():
        dim_findings = [f for f in findings if f.dimension == key]
        dim_scores.append(DimensionScore(
            key=key,
            score=_dimension_score(key, dim_findings),
            findings=dim_findings,
            weight=weight,
        ))
    security = next(d for d in dim_scores if d.key == "seguridad").score
    weaknesses = sorted(findings, key=lambda f: f.key())[:50]
    return Report(
        target=target,
        url=url,
        dimensions=dim_scores,
        security_score=security,
        weaknesses=weaknesses,
    )
