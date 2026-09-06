"""Auditor multidimensional de calidad para aplicaciones construidas con IA.

Uso:
    python -m qa_auditor --target <ruta> [--url <http>] [--json out.json]
"""

from .scanner import ScanContext
from .audit import scan
from .scoring import build_report, risk_label

__all__ = ["ScanContext", "scan", "build_report", "risk_label", "__version__"]

__version__ = "1.0.0"
