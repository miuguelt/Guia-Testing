"""Checks en caliente contra una URL desplegada (headers y cookies HTTP)."""
from __future__ import annotations

from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from .models import Finding, Severity

SECURITY_HEADERS = {
    "content-security-policy": "CSP",
    "strict-transport-security": "HSTS/Seguridad de transporte",
    "x-content-type-options": "MIME sniffing",
    "x-frame-options": "Clickjacking",
    "referrer-policy": "Fuga de referrer",
    "permissions-policy": "APIs del navegador autorizadas",
}

COOKIE_ATTRS = {"secure": "Secure", "httponly": "HttpOnly", "samesite": "SameSite"}


def _fetch(url: str) -> tuple[dict[str, str], str] | None:
    """GET con 6 s de tiempo de espera; devuelve (headers, status)."""
    try:
        with urlopen(Request(url, headers={"User-Agent": "qa-auditor/1.0"}), timeout=6) as resp:
            headers = {k.lower(): v for k, v in resp.getheaders()}
            return headers, f"{resp.status} {resp.reason}"
    except HTTPError as e:
        return {k.lower(): v for k, v in e.headers.items()}, f"{e.code} {e.reason}"
    except (URLError, TimeoutError, OSError) as e:
        return None, str(e)


def check_live_http(url: str) -> list[Finding]:
    """Audita la configuracion de cabeceras defensivas y cookies del deploy."""
    payload = _fetch(url)
    if payload is None:
        return [Finding(
            dimension="seguridad",
            severity=Severity.HIGH,
            category="live-unreachable",
            title="Servidor en caliente no accesible",
            detail=f"No se pudo conectar a {url}.",
            evidence=payload[1] if payload else "timeout/conexion rechazada",
            remedy="Levantar el servicio o verificar puerto; los checks estaticos siguen valiendo.",
        )]
    headers, status = payload
    findings: list[Finding] = []
    server = headers.get("server", "")
    if server:
        findings.append(Finding(
            dimension="seguridad",
            severity=Severity.LOW,
            category="A05",
            title="Divulgacion del servidor",
            detail="La cabecera `Server` revela tecnologia y version a los atacantes.",
            evidence=f"Server: {server}",
            remedy="Desactivar `Server` (reverse proxy) o dejar solo el nombre genérico.",
        ))
    for header, label in SECURITY_HEADERS.items():
        if header not in headers:
            findings.append(Finding(
                dimension="seguridad",
                severity=Severity.HIGH if header in {"content-security-policy", "x-frame-options", "x-content-type-options"} else Severity.MEDIUM,
                category="A05",
                title=f"Cabecera de seguridad ausente: {label}",
                detail=f"El deploy no envía `{header}`; el ataque {label.lower()} queda sin cortina.",
                evidence=f"GET {url} → {status} sin `{header}`",
                remedy="Configurar `{header}` en Nginx/Caddy/ASGI (CSP, HSTS, X-Frame-Options, etc.).",
            ))
    set_cookie = headers.get("set-cookie", "")
    if set_cookie:
        missing = [name for name in COOKIE_ATTRS if name not in set_cookie.lower()]
        if missing:
            findings.append(Finding(
                dimension="seguridad",
                severity=Severity.MEDIUM,
                category="A02",
                title="Cookie de sesion sin atributos defensivos",
                detail="La cookie de sesión no establece: " + ", ".join(COOKIE_ATTRS[m] for m in missing) + ".",
                evidence="set-cookie presente en la respuesta.",
                remedy="`Secure; HttpOnly; SameSite=Lax` obligatorio; `__Host-` para el nombre.",
            ))
    return findings
