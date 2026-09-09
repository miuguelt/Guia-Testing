# Proyecto de práctica: Testing QA

Este proyecto es una base pequeña y autocontenida para que el aprendiz practique la pirámide de pruebas sin depender de una base de datos externa ni de credenciales reales.

## Requisitos

- Python 3.11 o posterior.
- Node.js 20 o posterior y npm.
- JDK 21 y Maven, solo para la suite Java.

## Preparación en Windows

Abre PowerShell en esta carpeta y crea un entorno virtual para Python:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
npm ci
npx playwright install chromium
```

Como alternativa, `.\setup-windows.ps1` prepara el entorno completo de una vez. Después de ejecutarlo debes activar `.venv` en la ventana actual.

Si PowerShell impide activar el entorno, ejecuta `Set-ExecutionPolicy -Scope Process Bypass` y repite la activación. La política solo aplica a la ventana actual.

Para las pruebas E2E de Flask define una clave local y temporal en la misma ventana:

```powershell
$env:FLASK_SECRET_KEY = "<CLAVE_LOCAL_DE_PRUEBA>"
```

No uses una clave de producción ni la guardes en Git.

## Ejecución por tipo de prueba

### 1. Unitarias de dominio

Prueban cálculos y validaciones sin red ni base de datos:

```powershell
pytest tests/unit/ -v
pytest tests/unit/test_calculos.py -v
pytest tests/unit/test_schemas.py -v
```

### 2. Integración de la API FastAPI

Usan `TestClient` y una base SQLite en memoria aislada por prueba:

```powershell
pytest tests/integration/ -v
pytest tests/test_productos.py -v
```

Para levantar la API manualmente en otra ventana:

```powershell
uvicorn main:app --reload --host 127.0.0.1 --port 8009
```

Luego consulta `http://127.0.0.1:8009/docs` o ejecuta:

```powershell
Invoke-RestMethod http://127.0.0.1:8009/productos/
```

### 3. BDD con Gherkin y Behave

La especificación está en `features/inventario.feature` y sus pasos en `features/steps/`:

```powershell
behave
behave features/inventario.feature -v
```

También existe una versión equivalente con PyTest en `tests/test_bdd_simulado.py` para comparar ambos enfoques.

### 4. Componentes React con Vitest

La prueba `tests/Contador.test.jsx` usa el componente de ejemplo `src/components/Contador.jsx` y un DOM simulado con JSDOM:

```powershell
npm test
npx vitest run tests/Contador.test.jsx
npm run test:watch
npm run test:coverage
```

El reporte queda en `coverage/index.html` y es un artefacto local que no se debe subir a Git.

### 5. Java con JUnit 5 y Spring Boot

Los tests unitarios de servicio, controlador y acceso a datos se ejecutan con Maven:

```powershell
mvn test
mvn -Dtest=FincaServiceTest test
mvn -Dtest=FincaControllerTest test
mvn test jacoco:report
```

El informe de cobertura queda en `target/site/jacoco/index.html`.

### 6. E2E con Playwright sobre Flask y Jinja

El archivo `playwright.config.js` inicia automáticamente la demostración Flask en el puerto 5017. La suite valida renderizado, creación, redirección y manejo de errores:

```powershell
npm run e2e
npm run e2e:headed
npm run e2e:ui
npx playwright show-report
```

Para ejecutar un solo caso:

```powershell
npx playwright test tests/e2e/flask_jinja.spec.js -g "crea un producto"
```

Playwright conserva capturas, video y traza cuando un caso falla. El informe se abre con `npx playwright show-report`.

## Ejecución completa recomendada

Desde esta carpeta, en este orden:

```powershell
pytest tests/unit/ -v
pytest tests/integration/ -v
behave
npm test
mvn test
npm run e2e
pytest --cov=services --cov=routers --cov=schemas --cov-fail-under=80 --cov-report=term-missing
```

Cada grupo debe terminar sin fallos. Las pruebas de Python no requieren iniciar un servidor; solo las E2E levantan Flask automáticamente.
