"""Checks estaticos de las 8 caracteristicas ISO/IEC 25010 (subconjunto).

Cada funcion ``check_*`` devuelve hallazgos en la dimension homonima.
La severidad se calibra segun impacto en el objetivo del sistema
(no es lista de pecados: sin hallazgo = esa subcaracteristica aporta 0 ptos).
"""
from __future__ import annotations

import re

from .models import Finding, Severity
from .scanner import ScanContext


def _join_python(ctx: ScanContext) -> str:
    return "\n".join(t for p, t in ctx.all_text() if p.suffix == ".py")


def check_funcionalidad(ctx: ScanContext) -> list[Finding]:
    """Validacion contractual: Pydantic, errores negocio y estado HTTP."""
    text = _join_python(ctx)
    findings: list[Finding] = []
    has_pydantic = bool(re.search(r"(pydantic|BaseModel|Field\(|@validator|model_validator)", text))
    if not has_pydantic:
        findings.append(Finding(
            dimension="funcionalidad",
            severity=Severity.MEDIUM,
            category="contract",
            title="Sin validacion de datos de entrada",
            detail="No se detecta esquema de contrato (BaseModel/Field) en el codigo fuente Python.",
            evidence="Busqueda de pydantic/BaseModel/Field sin coincidencias.",
            remedy="Definir schemas Pydantic v2 con validacion de reglas de negocio y devolver 422/400.",
        ))
    if re.search(r"assert\s", text) and not re.search(r"APP_ENV|PYTEST|TEST_", text):
        findings.append(Finding(
            dimension="funcionalidad",
            severity=Severity.LOW,
            category="robustness",
            title="Dependencia de aserciones en produccion",
            detail="`assert` se elimina con `python -O`; no debe ser la validacion.",
            evidence=ctx.rel(ctx.root) + " (modulos .py)",
            remedy="Reemplazar assert por validaciones explicitas que devuelvan 4xx.",
        ))
    if not re.search(r'status_code\s*=\s*status\.HTTP_|status\.HTTP_4|HTTP_500', text or ""):
        findings.append(Finding(
            dimension="funcionalidad",
            severity=Severity.LOW,
            category="contract",
            title="Contrato HTTP sin codigos de error explicitos",
            detail="No se detectan respuestas 404/409/422 tipadas para flujos de error.",
            evidence="Busqueda de status.HTTP_ sin coincidencias.",
            remedy="Modelar respuestas de error en el contrato (OpenAPI y TestClient).",
        ))
    return findings


def check_fiabilidad(ctx: ScanContext) -> list[Finding]:
    """Manejo de errores, transacciones y punto de salud."""
    text = _join_python(ctx)
    findings: list[Finding] = []
    has_handler = bool(re.search(r"exception_handler|errorhandler|try\s*:|except\s", text))
    if not has_handler:
        findings.append(Finding(
            dimension="fiabilidad",
            severity=Severity.MEDIUM,
            category="failure",
            title="Sin manejo centralizado de fallas",
            detail="Sin try/except ni exception handler, un error interno se filtra al cliente.",
            evidence="Busqueda de try:/except/exception_handler sin coincidencias.",
            remedy="Agregar GlobalExceptionHandler (o @app.exception_handler) y responder 500 generico.",
        ))
    if re.search(r"session|async_session|SessionLocal", text) and not re.search(r"rollback|begin\(|transl", text):
        findings.append(Finding(
            dimension="fiabilidad",
            severity=Severity.MEDIUM,
            category="transaction",
            title="Transacciones sin rollback",
            detail="La sesion de base de datos no revierte ante falla; quedan estados parciales.",
            evidence="Se detecta uso de session pero no rollback.",
            remedy="Usar `try/except/rollback` o contexto `with session.begin():`.",
        ))
    if not re.search(r'"/health"|/healthz|health\b', text):
        findings.append(Finding(
            dimension="fiabilidad",
            severity=Severity.LOW,
            category="observability",
            title="Sin endpoint de salud",
            detail="CI/CD y orquestadores no pueden verificar que el servicio arranco.",
            evidence="Busqueda de /health sin coincidencias.",
            remedy="Agregar GET /health que valide conexion a base de datos y devuelva 200/503.",
        ))
    return findings


def check_eficiencia(ctx: ScanContext) -> list[Finding]:
    """Elementos de rendimiento: indice, paginacion y parametrizacion."""
    text = _join_python(ctx)
    findings: list[Finding] = []
    if re.search(r"\.query\([^)]*\.all\(\)", text) and not re.search(r"index=True|Index\(", text):
        findings.append(Finding(
            dimension="eficiencia",
            severity=Severity.LOW,
            category="resource",
            title="Consultas sin indice en el modelo",
            detail="Las busquedas por filtro escalan O(n) en tablas crecientes.",
            evidence="Se usan consultas ORM sin index=True.",
            remedy="Agregar `index=True` en columnas de filtro frecuente (nombre, estado, categoria).",
        ))
    if re.search(r"\.all\(\)", text) and not re.search(r"limit|offset|paginate|page\s*=|skip\[|take\(", text):
        findings.append(Finding(
            dimension="eficiencia",
            severity=Severity.LOW,
            category="resource",
            title="Listados sin paginacion",
            detail="Endpoints de coleccion traen todas las filas en una peticion.",
            evidence="Se detecta .all() sin limit/offset.",
            remedy="Implementar paginacion (limit/offset o keyset) en los listados.",
        ))
    return findings


def check_usabilidad(ctx: ScanContext) -> list[Finding]:
    """Idioma es-CO, metadatos y accesibilidad basica del frontend."""
    findings: list[Finding] = []
    html = [t for p, t in ctx.all_text() if p.suffix == ".html"]
    if html:
        joined = "\n".join(html)
        if not re.search(r'lang=["\']es', joined):
            findings.append(Finding(
                dimension="usabilidad",
                severity=Severity.MEDIUM,
                category="localization",
                title="Documento HTML sin idioma declarado",
                detail="Los lectores de pantalla y traductores no saben que el contenido es es-CO.",
                evidence="`lang` no presente en los documentos.",
                remedy="Declarar `<html lang=\"es-CO\">`.",
            ))
        if re.search(r"<img\b", joined) and not re.search(r"alt=", joined):
            findings.append(Finding(
                dimension="usabilidad",
                severity=Severity.LOW,
                category="accessibility",
                title="Imagenes sin atributo alt",
                detail="Usuarios con lector de pantalla no reciben descripcion del contenido grafico.",
                evidence="`<img` sin `alt=`.",
                remedy="Agregar `alt` descriptivo a cada imagen.",
            ))
    return findings


def check_mantenibilidad(ctx: ScanContext) -> list[Finding]:
    """Tamano de modulos/funciones, tipado y docstrings."""
    text = _join_python(ctx)
    findings: list[Finding] = []
    big_files = [p for p, t in ctx.all_text() if t.count("\n") > 250]
    for p in big_files[:3]:
        findings.append(Finding(
            dimension="mantenibilidad",
            severity=Severity.LOW,
            category="size",
            title="Modulo demasiado grande",
            detail="Archivos > 250 lineas concentran varias capacidades y dificultan la revisión.",
            evidence=f"{ctx.rel(p)} ({p.read_text(errors='ignore').count(chr(10))} lineas)",
            remedy="Dividir por funcionalidad; una capacidad publica principal por archivo.",
        ))
    long_funcs = re.findall(r"def ([a-zA-Z_][\w]*)\s*\([\s\S]{0,600}?\):\s*[\s\S]{0,180}?(?=\ndef |\nclass |\Z)", text)
    if len(long_funcs) > 3:
        findings.append(Finding(
            dimension="mantenibilidad",
            severity=Severity.LOW,
            category="size",
            title="Funciones sobrecargadas",
            detail="Se detectan funciones que superan el umbral de 40 lineas.",
            evidence=f"{len(long_funcs)} funciones candidatas: {', '.join(long_funcs[:5])}",
            remedy="Extraer pasos intermedios en funciones helpers de una sola responsabilidad.",
        ))
    if text and not re.search(r"->\s*[A-Z][\w\[\],| ]*|:\s*[A-Za-z_][\w\[\],| ]*", text):
        findings.append(Finding(
            dimension="mantenibilidad",
            severity=Severity.LOW,
            category="type-safety",
            title="Sin tipado estatico",
            detail="Sin anotaciones de tipos el refactor seguro con IA pierde su red de seguridad.",
            evidence="Funciones sin `->` ni parametros tipados.",
            remedy="Anotar todos los parametros y retornos (mypy en CI).",
        ))
    return findings


def check_portabilidad(ctx: ScanContext) -> list[Finding]:
    """Configuracion por entorno, dependencias fijadas y contenedor."""
    findings: list[Finding] = []
    refs = [p for p in ctx.refs]
    ref_names = {p.name for p in refs}
    text = _join_python(ctx)
    if refs and "requirements.txt" in ref_names:
        for p in refs:
            if p.name != "requirements.txt":
                continue
            unpinned = [
                (n, l) for n, l in enumerate(p.read_text(errors="ignore").splitlines(), 1)
                if l and not l.startswith("#") and "==" not in l and ">=" not in l and "<=" not in l and "~=" not in l
            ]
            if unpinned:
                findings.append(Finding(
                    dimension="portabilidad",
                    severity=Severity.LOW,
                    category="config",
                    title="Dependencias sin anclar",
                    detail=f"{len(unpinned)} lineas sin version en requirements.txt.",
                    evidence="; ".join(f"l{n}: {l.strip()}" for n, l in unpinned[:3]),
                    remedy="Anclar con `==` exacto para reproducibilidad del despliegue.",
                ))
    if text and not re.search(r"os\.(environ|getenv)|pydantic_settings|Settings|config\.", text):
        findings.append(Finding(
            dimension="portabilidad",
            severity=Severity.MEDIUM,
            category="config",
            title="Configuracion hardcodeada",
            detail="No se leen secretos del entorno; la configuracion viaja pegada al codigo.",
            evidence="os.environ/getenv/Settings no detectados.",
            remedy="Usar pydantic-settings o variables de entorno con `.env.example` documentado.",
        ))
    return findings


def check_compatibilidad(ctx: ScanContext) -> list[Finding]:
    """Contratos REST, OpenAPI y charset UTF-8."""
    text = _join_python(ctx)
    findings: list[Finding] = []
    if not re.search(r"FastAPI\(|app = Flask|Flask\(|router = APIRouter", text) and not any(p.suffix == ".py" for p, _ in ctx.all_text()):
        return findings
    if re.search(r"FastAPI\(|APIRouter", text) and not re.search(r'"/docs"|docs_url|openapi', text):
        findings.append(Finding(
            dimension="compatibilidad",
            severity=Severity.LOW,
            category="api",
            title="OpenAPI deshabilitado",
            detail="El contrato interactivo (docs) no permite validar el API desde otros equipos.",
            evidence="FastAPI detectado pero sin docs_url/openapi.",
            remedy="Mantener /docs en desarrollo y versionar el contrato OpenAPI.",
        ))
    if any(not t.startswith("\ufeff") for p, t in ctx.all_text() if p.suffix == ".json"):
        has_utf8_declaration = any("# -*- coding: utf-8 -*-" in t or "charset=utf-8" in t for p, t in ctx.all_text())
        if not has_utf8_declaration:
            findings.append(Finding(
                dimension="compatibilidad",
                severity=Severity.LOW,
                category="encoding",
                title="Codificacion explicita no garantizada",
                detail="Sin indicacion de encoding, la localizacion es-CO puede corromperse en otro SO.",
                evidence="No se halla -*- coding: utf-8 -*- ni charset=utf-8.",
                remedy="Servir con charset=utf-8 y guardar todos los fuentes en UTF-8.",
            ))
    return findings
