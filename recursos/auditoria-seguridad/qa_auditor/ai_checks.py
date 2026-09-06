"""Checks de calidad especificos para codigo generado por IA.

Detectan las inconfundibles marcas de codigo producido por asistentes sin
revision: stubs, funciones muertas, pasarelas de datos simulados, secretos
que la IA "invento" y pruebas sin aserciones.
"""
from __future__ import annotations

import re

from .models import Finding, Severity
from .scanner import ScanContext

AI_STUB_PATTERNS = [
    re.compile(r"#\s*(?:TODO|FIXME|HACK|XXX|pendiente|implementar)\b", re.IGNORECASE),
    re.compile(r"(?m)^\s*(?:pass|\.\.\.|TODO)\s*$"),
    re.compile(r"raise\s+NotImplementedError", re.IGNORECASE),
    re.compile(r"def\s+\w+\([^)]*\)\s*:\s*(?:\"\"\".*?\"\"\")?\[*pass", re.IGNORECASE),
]

AI_SIMULATION_PATTERNS = [
    re.compile(r"(?i)(fake|dummy|mockdata|simulado|simulacion|datos de ejemplo|sample_data)\b"),
    re.compile(r"(?i)(stub|dummy_)(data|object|service|repo)"),
    re.compile(r"github\.com/\w+/(?:repo|example|demo)/nada|example\.com", re.IGNORECASE),
]

HALLUCINATED_IMPORTS = [
    re.compile(r"(?im)^\s*(?:from|import)\s+(\w[\w.]*)(?:\s+import\b.*)?$"),
]


def _strip_comments(line: str) -> str:
    return line.split("#")[0].strip()


def check_ai_stubs(ctx: ScanContext) -> list[Finding]:
    """Marcas de desarrollo interrumpido: TODO/FIXME, pass, NotImplementedError."""
    findings: list[Finding] = []
    for path, text in ctx.all_text():
        if path.suffix not in {".py", ".js", ".ts", ".tsx", ".java", ".kt"}:
            continue
        for pattern in AI_STUB_PATTERNS:
            for m in pattern.finditer(text):
                line_no = text[: m.start()].count("\n") + 1
                line = _strip_comments(text.splitlines()[line_no - 1]) if m.group() == "pass" else text.splitlines()[line_no - 1].strip()
                findings.append(Finding(
                    dimension="ia",
                    severity=Severity.HIGH if "NotImplementedError" in m.group() or "FIXME" in m.group() else Severity.MEDIUM,
                    category="stub",
                    title="Codigo generado sin completar",
                    detail="Marcador típico de IA: el asistente dejo la funcion en esqueleto sin implementacion real.",
                    evidence=f"{ctx.rel(path)}:{line_no}: {line[:100]}",
                    remedy="Completar la implementacion real y eliminar el marcador; si es valido, mover a un issue.",
                    source=ctx.rel(path),
                ))
    return findings


def check_ai_mock_data(ctx: ScanContext) -> list[Finding]:
    """Datos simulados en produccion: endpoits que no tocan la base de datos."""
    findings: list[Finding] = []
    for path, text in ctx.all_text():
        if path.suffix not in {".py", ".js", ".ts", ".java"}:
            continue
        if re.search(r"#.*(dummy|mock|fake|simulado)", text, re.IGNORECASE) and re.search(r"def\s+\w+|class\s+\w+", text):
            for m in re.finditer(r"#.*(dummy|mock|fake|simulado).*", text, re.IGNORECASE):
                findings.append(Finding(
                    dimension="ia",
                    severity=Severity.MEDIUM,
                    category="mock-data",
                    title="Comentario de datos simulados",
                    detail="La IA dejó una pasarela en modo demo o la referencia de simulación persiste.",
                    evidence=f"{ctx.rel(path)}:{text[: m.start()].count(chr(10)) + 1}: {m.group().strip()[:90]}",
                    remedy="Implementar la capa real y eliminar el comentario; usar V.E.R.A. para avisar cambios.",
                    source=ctx.rel(path),
                ))
    return findings


def check_ai_hallucinated_imports(ctx: ScanContext) -> list[Finding]:
    """Import de una libreria que no existe en el manifiesto de dependencias.

    Los modulos locales (archivos .py propios del proyecto) asi como las
    librerias estandar conocidas se excluyen: `from database` no es una
    alucinacion si database.py existe en el mismo arbol.
    """
    declared: set[str] = set()
    for ref in ctx.refs:
        text = ctx.read(ref)
        if ref.name == "requirements.txt":
            for line in text.splitlines():
                stripped = line.split("#")[0].strip()
                if stripped:
                    declared.add(re.split(r"[=<>~! ]", stripped)[0].lower())
        elif ref.name == "package.json":
            for name in re.findall(r'"([@a-z0-9_.-]+/[a-z0-9_.-]+|[a-z0-9_.-]+)"\s*:\s*"\^', text):
                declared.add(name.lower())
    local_modules = {
        p.stem.lower()
        for p in ctx.files
        if p.suffix == ".py"
    } | {
        p.name.lower()
        for p in ctx.files
        if p.is_file() and p.parent != ctx.root
        and "__" not in p.name and p.suffix == ""
    }
    if not declared:
        return []
    stdlib = {"os", "sys", "re", "json", "pathlib", "dataclasses", "typing",
              "datetime", "sqlite3", "logging", "enum", "fastapi", "pydantic",
              "sqlalchemy", "random", "time", "collections", "itertools",
              "typing_extensions", "uuid", "math", "abc", "functools"}
    findings: list[Finding] = []
    for path, text in ctx.all_text():
        if path.suffix != ".py":
            continue
        for m in re.finditer(r"^\s*(?:from|import)\s+([a-zA-Z_][\w.]*)", text, re.MULTILINE):
            base = m.group(1).split(".")[0].lower()
            if base in stdlib or base.startswith(".") or base in local_modules:
                continue
            if base not in declared and base != "__future__":
                findings.append(Finding(
                    dimension="ia",
                    severity=Severity.HIGH,
                    category="hallucination",
                    title="Dependencia no declarada (posible alucinacion de import)",
                    detail=f"Se importa `{base}` pero no aparece en requirements.txt/package.json.",
                    evidence=f"{ctx.rel(path)}:{text[: m.start()].count(chr(10)) + 1}: {m.group(0).strip()}",
                    remedy="Confirmar la libreria (pip show) o quitarla; instalar de forma explícita y anclar la version.",
                    source=ctx.rel(path),
                ))
    return findings


def check_ai_test_quality(ctx: ScanContext) -> list[Finding]:
    """Pruebas generadas que no afirman nada (riesgo de falsa confianza)."""
    findings: list[Finding] = []
    for path, text in ctx.all_text():
        if "test" not in path.name or path.suffix not in {".py", ".js", ".ts", ".tsx"}:
            continue
        for m in re.finditer(r"^\s*def\s+test_([a-zA-Z0-9_]+)\s*\([\s\S]*?^\s*def\s+(?:test_|\w)|^\s*def\s+test_([a-zA-Z0-9_]+)\s*\([\s\S]*?\Z", text, re.MULTILINE):
            block = m.group(0)
            effective = re.sub(r"(?m)^\s*assert\s+True\b.*$", "", block)
            if "assert" not in effective and "expect(" not in effective and "toBe(" not in effective:
                name = m.group(1) or m.group(2)
                findings.append(Finding(
                    dimension="ia",
                    severity=Severity.HIGH,
                    category="test-quality",
                    title="Prueba sin aserciones",
                    detail=f"test_{name} ejecuta codigo pero no verifica nada: aprobara en verde siempre.",
                    evidence=f"{ctx.rel(path)}: test_{name} sin assert/expect/toBe",
                    remedy="Agregar aserciones de resultado esperado o eliminar la prueba; jamás aceptar una prueba que no puede fallar.",
                    source=ctx.rel(path),
                ))
    return findings


def check_ai_unused_code(ctx: ScanContext) -> list[Finding]:
    """Funciones/importaciones nunca invocadas tras la autogeneracion."""
    findings: list[Finding] = []
    for path, text in ctx.all_text():
        if path.suffix != ".py":
            continue
        lines = text.splitlines()
        for i, line in enumerate(lines):
            m = re.match(r"^def\s+([a-zA-Z_]\w*)\s*\(", line)
            if not m:
                continue
            name = m.group(1)
            is_decorated = i > 0 and bool(re.match(r"^\s*@", lines[i - 1]))
            calls = len(re.findall(rf"\b{name}\(", text))
            if calls <= 1 and not is_decorated:
                findings.append(Finding(
                    dimension="ia",
                    severity=Severity.LOW,
                    category="dead-code",
                    title="Funcion definida pero no invocada",
                    detail="Residuo de autogeneracion: el asistente la creo pero ninguna ruta la llama.",
                    evidence=f"{ctx.rel(path)}: def {name} (~{calls} uso(s))",
                    remedy="Eliminar si no aporta valor o integrarla; si es un handler con decorador, ignorar.",
                    source=ctx.rel(path),
                ))
    return findings
