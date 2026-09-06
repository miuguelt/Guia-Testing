# Auditoría Multidimensional para Aplicaciones Construidas con IA

Este paquete mide el **índice de calidad (0–100 %)** de una aplicación en 9
dimensiones: las 8 características del estándar **ISO/IEC 25010** más el
control de calidad de **código generado por IA** (marcas de alucinación,
stubs sin implementar, secretos, licencias y pruebas sin aserciones).

Cada hallazgo soporta **severidad** (`critical/high/medium/low/info`) y pesa
sobre su dimensión. El **índice de seguridad** incluye los controles estáticos
del OWASP Top 10 y, si se pasa `--url`, controles de cabeceras HTTP/cookies
del alojamiento en caliente.

## Ejecución

```powershell
# Auditoría estática de una app
python -m qa_auditor --target recursos/codigo-ejemplo

# Auditoría estática + en caliente (cabeceras, cookies, divulgación de servidor)
python -m qa_auditor --target recursos/codigo-ejemplo --url http://localhost:8000

# Salidas y compuerta de calidad (exit code != 0 si el score < umbral)
python -m qa_auditor --target app --json informe.json --html informe.html --min-score 80
```

## Suite de pruebas

```powershell
pytest tests -v
```

## Dimensiones medidas

| Dimensión (ISO 25010) | Qué mide | Indicadores típicos |
|---|---|---|
| Funcionalidad | Rutas, schemas, validación de reglas de negocio | Pydantic, `status_code`, respuesta tipada |
| Fiabilidad | Manejo de errores, transacciones, health-check | `try/except`, `rollback`, `exception_handler` |
| Eficiencia | Índices, paginación, I/O asíncrono, caché | `index=True`, `limit/offset`, `async` |
| Usabilidad | Idioma es-CO, metadatos, accesibilidad, README | `lang`, `alt`, `aria-label` |
| Seguridad | OWASP Top 10 estático + cabeceras en caliente | Secretos, SQLi, XSS, CORS `*`, CSP |
| Mantenibilidad | Tamaño de módulo/función, tipado, docstrings | ≤250 líneas/módulo, ≤40 por función |
| Portabilidad | Config por entorno, dependencias fijadas, Docker | `.env.example`, `==`, compose |
| Compatibilidad | Contratos REST, OpenAPI, charset UTF-8 | `response_model`, `/docs`, `utf-8` |
| Calidad IA | Código generado con IA bien consolidado | `TODO/FIXME`, stubs, `pass` en test, datos simulados |

## Severidad → puntos

| Severidad | Puntos por hallazgo |
|---|---|
| `critical` | 25 |
| `high` | 15 |
| `medium` | 8 |
| `low` | 3 |
| `info` | 1 |

Un hallazgo `critical` no ejecuta `exit 0` sin remediación: la compuerta
`--min-score` corta el *pipeline* (CI/CD) en el momento exacto.
