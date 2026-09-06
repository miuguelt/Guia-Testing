"""CLI del auditor: python -m qa_auditor --target <dir> [opciones]."""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

from .audit import scan
from .report import render_console, render_html, render_json, write_reports
from .scoring import risk_label


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="qa-auditor",
        description="Mide el indice de calidad (0-100%) de una app en 9 dimensiones "
                    "(ISO/IEC 25010 + control de codigo IA) e identifica debilidades.",
    )
    parser.add_argument("--target", required=True, help="Carpeta de la aplicacion a auditar.")
    parser.add_argument("--url", default=None, help="URL desplegada para checks HTTP en caliente.")
    parser.add_argument("--json", default=None, help="Ruta de salida del reporte JSON.")
    parser.add_argument("--html", default=None, help="Ruta de salida del reporte HTML.")
    parser.add_argument("--min-score", type=float, default=0.0,
                        help="Umbral minimo global (exit != 0 si el score es menor).")
    parser.add_argument("--no-color", action="store_true", help="Desactiva ansi en consola.")
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    target = Path(args.target)
    if not target.exists():
        print(f"ERROR: objetivo inexistente: {target}", file=sys.stderr)
        return 2
    report = scan(target, url=args.url)
    out = render_console(report)
    if args.no_color:
        import re as _re

        out = _re.sub(r"\x1b\[[0-9;]*m", "", out)
    print(out)
    write_reports(report, args.json, args.html)
    if args.json:
        print(f"\nReporte JSON: {args.json} (snapshot para CI)")
    if args.html:
        print(f"Reporte HTML: {args.html}")
    if report.overall < args.min_score:
        print(f"\nCOMPUERTA FALLIDA: {report.overall:.1f}% < {args.min_score:.1f}% "
              f"({risk_label(report.overall)}). Corrige las debilidades señaladas.",
              file=sys.stderr)
        return 1
    print(f"\nCOMPUERTA OK: {report.overall:.1f}% >= {args.min_score:.1f}%"
          if args.min_score else "")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
