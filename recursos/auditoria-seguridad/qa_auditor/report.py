"""Reportes del auditor: consola, JSON y HTML autocontenido."""
from __future__ import annotations

import json

from .scoring import Report, risk_label

BAR = "█"
COLORS = {"critical": "\x1b[31m", "high": "\x1b[1;31m", "medium": "\x1b[33m",
          "low": "\x1b[36m", "info": "\x1b[2m", "reset": "\x1b[0m",
          "good": "\x1b[32m"}
SEVERITY_SPANISH = {"critical": "CRÍTICO", "high": "ALTO", "medium": "MEDIO",
                    "low": "BAJO", "info": "INFO"}


def render_console(report: Report) -> str:
    """Tabla-legible del informe con barra de progreso por dimension."""
    pad = max(len(d.key) for d in report.dimensions)
    lines: list[str] = []
    lines.append(f"Objetivo: {report.target}" + (f"  ·  URL: {report.url}" if report.url else ""))
    lines.append("=" * (pad + 62))
    for dim in report.dimensions:
        bars = int(round(dim.score / 10))
        color = COLORS["good"] if dim.score >= 80 else COLORS["medium"] if dim.score >= 60 else COLORS["critical"]
        minus = int(round((100 - dim.score) / 10))
        lines.append(
            f"  {dim.key:<{pad}} {color}{BAR * bars}{COLORS['reset']}"
            f"{(BAR * minus)}{COLORS['reset']}"
            f"  {dim.score:5.1f}%"
        )
    lines.append("=" * (pad + 62))
    lines.append(f"  ÍNDICE GLOBAL (ponderado): {report.overall:5.1f}%  {risk_label(report.overall)}")
    lines.append(f"  SEGURIDAD (OWASP):        {report.security_score:5.1f}%  {risk_label(report.security_score)}")
    if report.weaknesses:
        lines.append("")
        lines.append("  DEBILIDADES (top prioridad por severidad):")
        for w in report.weaknesses[:10]:
            c = COLORS.get(w.severity.value, COLORS["reset"])
            lines.append(
                f"   {c}[{SEVERITY_SPANISH[w.severity.value]}]{COLORS['reset']} "
                f"{w.title} <{w.category or w.dimension}>"
            )
            if w.evidence:
                lines.append(f"       evidencia: {w.evidence[:110]}")
            if w.remedy:
                lines.append(f"       remedio:   {w.remedy[:110]}")
    else:
        lines.append("")
        lines.append("  sin hallazgos: todas las dimensiones al 100%.")
    return "\n".join(lines)


def render_json(report: Report) -> str:
    """Reporte maquina-legible para CI/CD (GoldenSignal JSON)."""
    return json.dumps(report.to_dict(), indent=2, ensure_ascii=False)


def render_html(report: Report) -> str:
    """HTML autocontenido (sin CDN) con barras y tarjetas de debilidad."""
    colors = {"critical": "#dc3545", "high": "#e87939", "medium": "#f0ad4e",
              "low": "#5bc0de", "info": "#9aa0a6",
              "good": "#2f9e44"}
    rows = []
    for d in report.dimensions:
        fill = (colors["good"] if d.score >= 80
                else colors["medium"] if d.score >= 60 else colors["critical"])
        rows.append(
            f'<div class="dim"><div class="dim-head"><span>{d.key}</span>'
            f'<b>{d.score:.1f}%</b></div>'
            f'<div class="bar"><div class="fill" style="width:{d.score:.1f}%;'
            f"background:{fill};\"></div></div>"
            f"<small>{len(d.findings)} hallazgos</small></div>"
        )
    cards = ""
    for w in report.weaknesses[:20]:
        cards += (
            f'<div class="card"><h4><span class="sev" style="background:{colors.get(w.severity.value, "#999")}">'
            f'{SEVERITY_SPANISH[w.severity.value]}</span> {w.title}</h4>'
            f"<p>{w.detail}</p><code>{w.evidence or ''}</code>"
            f"<p class=\"remedy\"><b>Remedio:</b> {w.remedy}</p></div>"
        )
    if not cards:
        cards = "<div class='card ok'><h4>Sin debilidades detectadas</h4></div>"
    return f"""<!DOCTYPE html>
<html lang="es-CO"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Auditoría QA — {report.target}</title>
<style>
 body{{font-family:system-ui,sans-serif;background:#0f1117;color:#e6e6e6;margin:0;padding:24px}}
 h1,h2{{color:#fff}} .dim{{margin:10px 0}} .dim-head{{display:flex;justify-content:space-between}}
 .bar{{background:#262b36;border-radius:4px;height:14px}}
 .fill{{height:14px;border-radius:4px}}
 .card{{background:#181c24;border-left:3px solid #444;padding:10px 14px;margin:10px 0;border-radius:4px}}
 .card code{{display:block;background:#0d0f14;padding:6px 8px;border-radius:3px;font-size:12px;word-break:break-all}}
 .sev{{color:#fff;padding:2px 8px;border-radius:3px;font-size:11px;vertical-align:middle}}
 .remedy{{color:#9fd8a0;font-size:13px}} .ok{{border-color:#2f9e44}}
 .grid{{columns:2;gap:20px}} .score{{font-size:42px;color:#fff}}
</style></head><body>
<h1>Auditoría Multidimensional QA</h1>
<div class="grid">
<section><h2>Índices</h2>
<div class="score">{report.overall:.1f}%</div><p>{risk_label(report.overall)} global</p>
<div class="score">{report.security_score:.1f}%</div><p>{risk_label(report.security_score)} seguridad</p></section>
<section><h2>Dimensiones ISO/IEC 25010 + IA</h2>{''.join(rows)}</section>
</div><h2>Debilidades</h2>{cards}
</body></html>"""


def write_reports(report: Report, json_path: str | None, html_path: str | None) -> None:
    """Escribe los archivos de reporte solicitados."""
    if json_path:
        with open(json_path, "w", encoding="utf-8") as fh:
            fh.write(render_json(report))
    if html_path:
        with open(html_path, "w", encoding="utf-8") as fh:
            fh.write(render_html(report))
