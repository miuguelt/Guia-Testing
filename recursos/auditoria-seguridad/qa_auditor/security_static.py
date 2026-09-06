"""Checks de seguridad estaticos alineados a OWASP Top 10 (2021).

Cada check lee el contexto de barrido y devuelve hallazgos con severidad,
evidencia (linea) y remediacion. Los checks marcados ``live`` requieren una
URL objetivo y se resuelven en seguridad_http.py.
"""
from __future__ import annotations

import re
from pathlib import Path

from .models import Finding, Severity
from .scanner import ScanContext

SECRET_PATTERNS = [
    (re.compile(r"(?i)(api[_-]?key|apikey|secret|password|passwd|token)\s*[=:]\s*['\"][A-Za-z0-9_\-./+]{16,}['\"]"), "Clave o token en texto plano"),
    (re.compile(r"-----BEGIN (RSA|EC|DSA|OPENSSH|PRIVATE) KEY-----"), "Llave privada en el repositorio"),
    (re.compile(r"(?i)AWS_ACCESS_KEY_ID|AKIA[0-9A-Z]{16}"), "Credencial de AWS en el codigo"),
    (re.compile(r"(?i)postgres(ql)?://[^:]+:[^@]+@"), "Cadena de conexion con usuario/clave"),
    (re.compile(r"(?i)(sk|pk)-[a-z0-9]{20,}"), "Llave de API de IA (OpenAI/Anthropic)"),
]

SQL_CALLS = re.compile(
    r"""(?:cursor\s*\.\s*)?(?:execute|executemany|raw|query)\s*\(|prepareStatement\s*\(""",
    re.IGNORECASE,
)
SQL_CONCAT_MARKERS = re.compile(r'\s*\+|\.format\(|%\s*\(|\s%[sdqgtr]|f["\']|[^ "]%\s')


def _call_fragment(text: str, call_start: int, width: int = 200) -> str:
    """Fragmento desde la llamada hasta el cierre de parentesis (acotado)."""
    opening = text.find("(", call_start)
    if opening == -1:
        return text[call_start:call_start + width]
    return text[call_start:call_start + width].split(")", 1)[0] or text[call_start:call_start + width]


def check_sqli(ctx: ScanContext) -> list[Finding]:
    """OWASP A03: inyeccion SQL por construccion dinamica de consultas."""
    findings: list[Finding] = []
    for path, text in ctx.all_text():
        if path.suffix not in {".py", ".java", ".js", ".ts", ".go"}:
            continue
        for m in SQL_CALLS.finditer(text):
            fragment = _call_fragment(text, m.start())
            if "SELECT" not in fragment.upper() and "INSERT" not in fragment.upper() \
                    and "UPDATE" not in fragment.upper() and "DELETE" not in fragment.upper():
                continue
            if not SQL_CONCAT_MARKERS.search(fragment):
                continue
            findings.append(Finding(
                dimension="seguridad",
                severity=Severity.CRITICAL,
                category="A03",
                title="Posible inyeccion SQL",
                detail="Llamada SQL con cadena concatenada: el atacante puede alterar la sentencia SQL.",
                evidence=f"{ctx.rel(path)}:{_line_of(text, m.start())}: {fragment[:80]}",
                remedy="Usar ORM con parametros (SQLAlchemy `query` o `execute(..., {\"param\": v})`) nunca concatenar.",
                source=ctx.rel(path),
            ))
    return findings

XSS_PATTERNS = [
    re.compile(r"innerHTML\s*=\s*(answer|payload|data|user_input|nombre|name|title|comment|valor|value|q)"),
    re.compile(r"(?i)render_template_string\([^)]*(\+|{[\s]*request|{[\s]*user|args)"),
    re.compile(r"(?i)\bEval\s*\(|new Function\s*\("),
]


def _line_of(text: str, start: int) -> int:
    return text[:start].count("\n") + 1


def check_secrets(ctx: ScanContext) -> list[Finding]:
    """OWASP A02: secretos (cadenas de conexion, llaves, tokens) en el codigo."""
    findings: list[Finding] = []
    for path, text in ctx.all_text(include_refs=True):
        if path.name == ".env.example":
            continue  # es el archivo permitido de ejemplo
        for pattern, desc in SECRET_PATTERNS:
            for m in pattern.finditer(text):
                findings.append(Finding(
                    dimension="seguridad",
                    severity=Severity.CRITICAL if "PRIVATE KEY" in desc or "AWS" in desc else Severity.HIGH,
                    category="A02",
                    title=desc,
                    detail="Secretos en el repositorio quedan expuestos en Git y en la imagen Docker.",
                    evidence=f"{ctx.rel(path)}:{_line_of(text, m.start())}: {m.group()[:60]}",
                    remedy="Usar variables de entorno, Windows Credential Manager o `.env` local ignorado por Git.",
                    source=ctx.rel(path),
                ))
    return findings


def check_xss(ctx: ScanContext) -> list[Finding]:
    """OWASP A03: XSS reflejado/almacenado por sinks DOM o plantillas sin escape."""
    findings: list[Finding] = []
    for path, text in ctx.all_text():
        if path.suffix not in {".html", ".js", ".jsx", ".ts", ".tsx", ".py"}:
            continue
        for pattern in XSS_PATTERNS:
            for m in pattern.finditer(text):
                findings.append(Finding(
                    dimension="seguridad",
                    severity=Severity.HIGH,
                    category="A03",
                    title="Sink XSS (dinamico-peligroso)",
                    detail="Escritura de contenido dinámico en el DOM o plantillas sin escape de salida.",
                    evidence=f"{ctx.rel(path)}:{_line_of(text, m.start())}: {m.group()[:80]}",
                    remedy="Usar textContent/innerText o escapes de contexto (Jinja `{{ }}`, React `{exp}`).",
                    source=ctx.rel(path),
                ))
    return findings


def check_authz(ctx: ScanContext) -> list[Finding]:
    """OWASP A01/A07: deteccion heuristica de rutas protegidas sin autenticacion."""
    python = [t for p, t in ctx.all_text() if p.suffix == ".py"]
    if not python:
        return []
    joined = "\n".join(python)
    has_auth = "@login_required" in joined or "Depends(get_current_user" in joined or "RoleCheck" in joined
    routes = re.findall(r'@(?:app|router)\.(get|post|put|delete|patch)\(', joined)
    if routes and "admin" in joined and not has_auth and "login" not in joined and "auth" not in joined:
        return [Finding(
            dimension="seguridad",
            severity=Severity.HIGH,
            category="A01",
            title="Posible ausencia de control de acceso",
            detail=f"{len(routes)} rutas declaradas; no se detectan dependencias de autenticacion ni autorizacion por rol.",
            evidence="No se halló `Depends(get_current_user)`, `@login_required` ni `RoleCheck`.",
            remedy="Proteger toda ruta que requiera sesion: inyeccion de dependencia de usuario + verificación de rol.",
        )]
    return []


def check_cors(ctx: ScanContext) -> list[Finding]:
    """OWASP A05: CORS con origen comodin o lista de origenes permisiva."""
    findings: list[Finding] = []
    for path, text in ctx.all_text():
        if path.suffix not in {".py", ".js", ".ts", ".json"}:
            continue
        if re.search(r"(?i)allow_origins\s*=\s*\[?\s*[\"']\*[\"']", text) or re.search(r'(?i)"cors"\s*:\s*\{\s*"origins"\s*:\s*"\*"', text):
            findings.append(Finding(
                dimension="seguridad",
                severity=Severity.HIGH,
                category="A05",
                title="CORS con comodin (*)",
                detail="Cualquier origen puede consumir la API con credenciales si ademas se permite `allow_credentials`.",
                evidence=ctx.rel(path),
                remedy="Listar explicitamente los dominios propios en `allow_origins` y desactivar `allow_credentials`.",
                source=ctx.rel(path),
            ))
    return findings


def check_deps(ctx: ScanContext) -> list[Finding]:
    """OWASP A06: dependencias sin version fijada o con versiones futuras."""
    findings: list[Finding] = []
    for path, text in ctx.all_text(include_refs=True):
        if path.name == "requirements.txt":
            for line_no, line in enumerate(text.splitlines(), start=1):
                stripped = line.split("#")[0].strip()
                if stripped and re.match(r"^[A-Za-z0-9_.-]+$", stripped):
                    findings.append(Finding(
                        dimension="seguridad",
                        severity=Severity.MEDIUM,
                        category="A06",
                        title="Dependencia sin version fijada",
                        detail="Un lockfile minimo (==) impide que una subida maliciosa entre a la pila.",
                        evidence=f"{path}:{line_no}: {line.strip()}",
                        remedy="Fijar con `==` (o lockfile de Poetry/uv) y ejecutar `pip-audit` en CI.",
                        source=path.name,
                    ))
        if path.name == "package.json" and '^' in text:
            for m in re.finditer(r'"[^"]+":\s*"\^([0-9]+\.[0-9]+\.[0-9]+)"', text):
                findings.append(Finding(
                    dimension="seguridad",
                    severity=Severity.LOW,
                    category="A06",
                    title="Rango semver con caret",
                    detail=f"Dependencia ^v{m.group(1)} admite parches futuros sin revalidacion.",
                    evidence=ctx.rel(path),
                    remedy="Usar exactitud (`no-save --save-exact`) o lockfile commitado y `npm audit` en CI.",
                    source=ctx.rel(path),
                ))
    return findings


def check_secrets_gitignore(ctx: ScanContext) -> list[Finding]:
    """OWASP A02: .env presente en la carpeta analizada."""
    findings: list[Finding] = []
    for path in ctx.refs:
        if path.name == ".env":
            findings.append(Finding(
                dimension="seguridad",
                severity=Severity.CRITICAL,
                category="A02",
                title="Archivo .env en el repositorio",
                detail="Las variables reales quedan expuestas en Git si no se ignora el archivo.",
                evidence=ctx.rel(path),
                remedy="Registrar solo `.env.example`; el `.env` real debe vivir fuera de Git.",
                source=ctx.rel(path),
            ))
    return findings
