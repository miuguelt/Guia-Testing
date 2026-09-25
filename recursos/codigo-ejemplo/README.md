# Proyecto de práctica: Testing QA multi-lenguaje

Este proyecto es pequeño, autocontenido y reproducible. Está diseñado para que
el aprendiz pueda leer una regla de negocio, escribir una aserción, ejecutar la
prueba, interpretar el resultado y conservar la evidencia sin depender de una
base de datos externa ni de credenciales reales.

## Qué aprenderás con el ejemplo

| Capa | Ejemplo | Qué demuestra |
| --- | --- | --- |
| Unitarias | `services/calculos.py` y `tests/unit/` | Lógica pura, casos borde y errores esperados. |
| Integración | `main.py`, `routers/` y `tests/integration/` | Contrato HTTP, validación y SQLite en memoria aislada por prueba. |
| BDD | `features/inventario.feature` | Requisitos expresados como escenarios Given-When-Then. |
| Componentes | `src/components/Contador.jsx` y Vitest | Comportamiento visible de un componente React en DOM simulado. |
| Java | `src/main/java/` y `tests/*Test.java` | Servicio, controlador y repositorio Spring Boot, más un DAO JDBC aislado con JUnit 5 y Mockito. |
| E2E | `flask_jinja_demo/` y `tests/e2e/` | Un flujo real desde el navegador hasta la plantilla y el servidor. |

La regla general es simple: cada prueba debe tener un propósito, datos
deterministas, una acción y una aserción que compruebe el resultado. La
cobertura ayuda a descubrir huecos, pero no reemplaza la calidad de las
aserciones.

## Requisitos

- Python 3.11 o posterior.
- Node.js 20 o posterior y npm.
- JDK 21 y Maven para la suite Java.
- Chromium instalado por Playwright para la suite E2E.

Puedes comenzar con Python y JavaScript. Java y E2E se activan cuando instales
sus herramientas.

## Mapa de archivos

```text
services/calculos.py                 # reglas de negocio puras
schemas/producto.py                  # validación de entrada con Pydantic
routers/productos.py                 # API FastAPI
tests/unit/                          # pruebas rápidas de dominio
tests/integration/                   # API + base de datos en memoria
features/inventario.feature          # especificación BDD en Gherkin
src/components/Contador.jsx          # componente React
tests/Contador.test.jsx               # pruebas de componente con Vitest
src/main/java/...                     # ejemplo Spring Boot
src/main/java/co/sena/adso/productos/ # modelo y DAO JDBC del taller
tests/*Test.java                      # JUnit 5, Mockito y controlador
flask_jinja_demo/                    # aplicación web mínima para E2E
tests/e2e/                            # Playwright sobre navegador real
.github/workflows/ci.yml              # Quality Gate en GitHub Actions
run-tests.ps1 / run-tests.sh          # ejecutor unificado
```

## Preparación en Windows

Abre PowerShell en la carpeta `guia-testing-qa` extraída del ZIP:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\setup-windows.ps1
.\.venv\Scripts\Activate.ps1
```

El script crea el entorno virtual, instala `requirements.txt`, instala las
dependencias de Node.js y descarga Chromium. Si PowerShell ya permite ejecutar
scripts, el primer comando no es necesario.

Para la aplicación Flask de E2E define una clave efímera solo en la ventana
actual. No uses una clave de producción ni la guardes en Git:

```powershell
$env:FLASK_SECRET_KEY = "<CLAVE_LOCAL_DE_PRUEBA>"
```

## Ejecución por tipo de prueba

### 1. Unitarias e integración con PyTest

```powershell
python -m pytest tests/unit/ -v
python -m pytest tests/integration/ -v
python -m pytest tests/ -v
python -m pytest tests/ --cov=services --cov=routers --cov=schemas --cov-fail-under=80 --cov-report=html
```

La integración usa SQLite en memoria y reemplaza la dependencia de base de datos
mediante una fixture. Por eso una prueba no modifica datos de tu computador.

### 2. BDD con Behave

```powershell
python -m behave -q
python -m behave features/inventario.feature -v
```

Lee primero `features/inventario.feature`: el escenario expresa el requisito;
`features/steps/` conecta cada frase con código ejecutable. También existe una
versión equivalente en `tests/test_bdd_simulado.py` para comparar BDD con
PyTest.

### 3. Componentes React con Vitest

```powershell
npm test
npm run test:coverage
npm run test:watch
```

Vitest ejecuta el componente en JSDOM y aplica una compuerta de 80 % en líneas,
funciones, ramas y sentencias cuando solicitas cobertura.

### 4. Java con JUnit 5 y JaCoCo

```powershell
mvn --batch-mode test
mvn -Dtest=FincaServiceTest test
mvn test jacoco:report
```

El informe queda en `target/site/jacoco/index.html`. Los tests del servicio
usan Mockito para aislar el repositorio; los de controlador validan respuestas
HTTP con MockMvc; H2 permite practicar persistencia sin tocar una base de
producción.

### 5. E2E con Playwright sobre Flask y Jinja

```powershell
$env:FLASK_SECRET_KEY = "<CLAVE_LOCAL_DE_PRUEBA>"
npm run e2e
npm run e2e:headed
npx playwright show-report
```

La configuración levanta Flask automáticamente en `127.0.0.1:5017`. Las
pruebas comprueban renderizado, creación, redirección y validación. Cuando una
prueba falla, conserva captura, video o traza en `test-results/`.

## Una orden para recorrer el proyecto

Después de ejecutar `setup-windows.ps1`, puedes empezar con las suites locales
que no requieren Maven ni navegador:

```powershell
.\run-tests.ps1 -SkipJava -SkipE2E
```

Cuando JDK, Maven y Chromium estén disponibles, ejecuta la ruta completa:

```powershell
.\run-tests.ps1 -Coverage
```

El script termina con código distinto de cero si una verificación falla. Omitir
una tecnología requiere declararlo de forma explícita; omitirla no la presenta
como aprobada. En macOS o Linux usa:

```bash
bash run-tests.sh
```

## Cómo pensar la prueba: TDD, BDD y pirámide

1. **TDD:** define el comportamiento con una prueba que falla, implementa lo
   mínimo para hacerla pasar y refactoriza manteniendo la suite verde.
2. **BDD:** expresa el mismo comportamiento en lenguaje del negocio con
   `Dado`, `Cuando` y `Entonces`, y después enlaza los pasos con código.
3. **Pirámide:** muchas pruebas unitarias rápidas, menos integraciones y pocas
   E2E enfocadas en los caminos críticos. Las pruebas más cercanas al usuario
   dan confianza, pero cuestan más tiempo y mantenimiento.
4. **Regresión:** cuando encuentres un defecto, conserva un caso que falle por
   la causa real antes de corregirlo. Así el error no vuelve silenciosamente.

## Pipeline CI/CD en GitHub Actions

El archivo `.github/workflows/ci.yml` es la implementación ejecutable de CI del
proyecto. GitHub lo inicia en cada `push` a `main` o `develop` y en cada
`pull_request` hacia `main`.

El flujo es paralelo donde conviene y termina en una compuerta explícita:

```text
PyTest + Behave ─────┐
Vitest + cobertura ──┼─> quality-gate ─> integración permitida
JUnit 5 + JaCoCo ────┤
Playwright E2E ──────┘
```

- `setup-python`, `setup-node` y `setup-java` fijan las versiones del entorno.
- `npm ci` y `pip install -r requirements.txt` instalan desde archivos
  versionados; el caché solo acelera, no define las dependencias.
- PyTest exige 80 % en la lógica Python; Vitest aplica 80 % en sus métricas.
- Playwright instala Chromium y guarda sus reportes como artefactos, incluso si
  el caso falla.
- `quality-gate` depende de las cuatro suites y falla si alguna falla, se
  cancela o queda omitida. Configúralo como verificación obligatoria en la
  protección de la rama `main`.

CI comprueba que el cambio sea integrable. CD es la entrega o despliegue: debe
ser un trabajo posterior con `needs: quality-gate`, entorno protegido, revisión
cuando corresponda, secretos del proveedor y una prueba de humo. No guardes
claves en YAML ni en el repositorio.

## Herramientas que mejoran el desarrollo

Incorpora cada herramienta cuando resuelva un riesgo concreto:

| Riesgo | Herramientas útiles | Resultado |
| --- | --- | --- |
| Formato y errores simples | Ruff, ESLint, Black, pre-commit | Feedback antes del commit. |
| Secretos | Gitleaks, GitHub Secret Scanning | Bloqueo de llaves y contraseñas expuestas. |
| Dependencias vulnerables | Dependabot, `pip-audit`, `npm audit`, Trivy | Alertas y actualización controlada. |
| Errores de código | CodeQL, SonarQube | Análisis estático y hallazgos trazables. |
| API | Postman/Newman, Schemathesis | Contratos, validaciones y casos generados. |
| Navegador | Playwright, sus trazas y reportes | Evidencia reproducible de flujos reales. |
| Rendimiento | k6, Locust | Latencia, tasa de errores y comportamiento bajo carga. |
| Observabilidad | OpenTelemetry, Sentry, Grafana | Diagnóstico después del despliegue. |
| Workflow local | `act` | Validación aproximada del YAML antes del envío. |

Estas herramientas complementan las pruebas; no sustituyen requisitos claros,
datos de prueba seguros, revisión por pares ni el juicio técnico.

## Solución de problemas

- **`No existe .venv`:** ejecuta `python -m venv .venv` y luego
  `python -m pip install -r requirements.txt`, o vuelve a ejecutar
  `setup-windows.ps1`.
- **`npm ci` falla:** confirma Node.js 20 o posterior y ejecuta el comando desde
  la carpeta que contiene `package.json` y `package-lock.json`.
- **Playwright no encuentra Chromium:** ejecuta
  `npx playwright install chromium`.
- **Flask no inicia:** define `FLASK_SECRET_KEY` en la misma ventana antes de
  `npm run e2e`.
- **`mvn` no existe:** instala JDK 21 y Maven, o usa `-SkipJava` mientras
  practicas Python, BDD y JavaScript.
- **Una prueba falla:** conserva el comando y la salida, identifica si falló
  el entorno, la aserción o la aplicación, y registra la evidencia antes de
  cambiar código.


## Taller conectado de TDD y BDD

El laboratorio [Préstamos](laboratorios/prestamos/README.md) comparte una regla
entre pytest y Behave. Incluye solución final, diagnóstico, salidas esperadas y
una modificación controlada para comprobar que los tests detectan un defecto.
Se ejecuta por separado siguiendo su README, sin servidor ni base de datos.
