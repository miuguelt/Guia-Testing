# 🧪 Guía de Testing de Software, QA & Pruebas Automatizadas

> [!NOTE]
> **SSoT Pointer Canónico:**
> La versión canónica, interactiva y multi-lenguaje estandarizada para aprendices e instructores se encuentra en:
> **[`guia-testing-qa-universal`](../guia-testing-qa-universal)** (Servicio en puerto 8143 / 8035).
> Este repositorio contiene los entornos de simulación, scripts generadores (`generar_guia.py`) y la suite web interactiva.

---

## 📋 Resumen del Ecosistema de Calidad

Esta guía formativa cubre el aseguramiento de la calidad de software (QA), la pirámide de pruebas de Mike Cohn, el diseño bajo TDD/BDD y la automatización multi-stack (PyTest, Jest/Vitest, JUnit 5, Mockito, Playwright) bajo el estándar **ISO/IEC 25010** y el marco curricular SENA ADSO (Fase 5 - Evaluación).

## Proyecto descargable para practicar

La guía publica un paquete fuente listo para trabajar en
[`recursos/codigo-ejemplo/`](recursos/codigo-ejemplo/). También se puede descargar
el mismo paquete desde la opción **Descargar Proyecto** de la interfaz o desde
[`web/downloads/guia-testing-qa.zip`](web/downloads/guia-testing-qa.zip).

La guía paso a paso del paquete está en
[`recursos/codigo-ejemplo/README.md`](recursos/codigo-ejemplo/README.md). Allí se
explica la preparación en Windows y la ejecución separada de unitarias,
integración, BDD, Vitest, JUnit/JaCoCo y Playwright.

Si se actualiza el código del ejemplo, regenera el archivo público con
`& .\exportar-proyecto.ps1`; el comando reemplaza
`web/downloads/guia-testing-qa.zip` usando únicamente archivos fuente y de
configuración.

---

---

## 🐙 Git & Testing: Relación con GitHub, Seguridad y Versionamiento

### 1. La Relación entre Testing y GitHub (El Quality Gate en la Nube)
GitHub no es un mero almacenamiento de archivos; es el **orquestador central y árbitro de calidad** del software moderno.
* **De la laptop a la nube:** El mayor riesgo de un equipo es el síndrome *"en mi máquina sí funciona"*. GitHub Actions erradica esto ejecutando las suites en runners limpios, efímeros e independientes (`ubuntu-latest`, `windows-latest`).
* **Branch Protection Rules & Required Status Checks:** Permiten configurar reglas estrictas para que ninguna rama pueda fusionarse hacia `main` o `develop` a menos que todos los tests unitarios, de integración y E2E pasen con éxito (Quality Gate 100% verde).
* **Feedback Inmediato en Pull Requests:** Al abrir un PR, GitHub ejecuta automáticamente el pipeline e informa mediante anotaciones inline en el código qué línea falló, reporta el porcentaje de cobertura con Codecov y guarda artefactos de depuración (videos y trazas de Playwright).

---

### 2. ¿Es recomendable subir los tests a Git?
**SÍ, ROTUNDAMENTE.** El código de pruebas es un **ciudadano de primera clase (*First-Class Citizen*)**.
1. **Single Source of Truth (SSoT):** El código de producción y sus pruebas deben evolucionar sincronizados en el mismo commit. Si se modifica una regla de negocio o la firma de una función, la prueba que la valida viaja en el mismo cambio.
2. **Habilitador Único de CI/CD:** Los runners remotos de GitHub Actions clonan el repositorio. Si las pruebas no están versionadas, el runner no tiene nada que ejecutar y el Quality Gate queda inoperativo.
3. **Trazabilidad y Regresiones con `git bisect`:** Si surge un error en producción, el comando `git bisect run pytest` recorre el historial de Git ejecutando automáticamente los tests hasta aislar el commit exacto que introdujo el bug.
4. **Documentación Viva (*Living Documentation*):** Los requisitos en Word o Wiki se desactualizan; las pruebas no pueden mentir porque si fallan, rompen el build. Un desarrollador nuevo comprende el sistema leyendo y ejecutando los tests.
5. **Onboarding y Reproducibilidad:** Cualquier compañero que clone el repositorio puede verificar de inmediato la salud del proyecto ejecutando `pytest`, `npm test` o `mvn test`.

#### Matriz Canónica: ¿Qué SÍ y qué NUNCA se sube a Git?

| Elemento de QA | ¿Se sube a Git? | Archivos / Patrones | Razón Técnica y de Calidad |
| :--- | :---: | :--- | :--- |
| **Código de Pruebas** | ✅ **SÍ** (Obligatorio) | `tests/test_*.py`, `*.spec.js`, `*Test.java` | Las pruebas son código de producción; garantizan la estabilidad del software. |
| **Fixtures y Datos Sintéticos** | ✅ **SÍ** (Obligatorio) | `conftest.py`, fábricas `Faker`, seeders | Permiten reproducibilidad determinista en cualquier máquina sin dependencias externas. |
| **Configuración de Tests** | ✅ **SÍ** (Obligatorio) | `pytest.ini`, `vitest.config.js`, `playwright.config.js` | Definen timeouts, flags, descubrimiento de tests y umbrales de cobertura obligatorios. |
| **Pipelines CI & Git Hooks** | ✅ **SÍ** (Obligatorio) | `.github/workflows/*.yml`, `.pre-commit-config.yaml` | Formalizan el contrato de calidad que todos los colaboradores y runners deben cumplir. |
| **Secretos y Credenciales** | ❌ **NUNCA** (`.gitignore`) | `.env`, `.env.local`, `id_rsa`, `*.pem`, API keys | Vulnerabilidad crítica. Un secreto comiteado queda expuesto en el historial para siempre. |
| **Reportes y Cobertura** | ❌ **NUNCA** (`.gitignore`) | `htmlcov/`, `.coverage`, `coverage/`, `playwright-report/` | Artefactos efímeros derivados. Generan ruido masivo y conflictos de merge constantes. |
| **Cachés de Compilación** | ❌ **NUNCA** (`.gitignore`) | `.pytest_cache/`, `__pycache__/`, `node_modules/`, `.nyc_output/` | Específicos del sistema operativo local; deben regenerarse limpios en cada runner. |
| **Bases de Datos Locales** | ❌ **NUNCA** (`.gitignore`) | `test.db`, `*.sqlite3`, dumps `*.sql` locales | Riesgo de fuga de datos reales y corrupción binaria en el historial de Git. |

---

### 3. Seguridad en Pruebas: ¿Subir los tests revela información a atacantes?

#### El Mito de la "Seguridad por Oscuridad" (*Security through Obscurity*)
Existe el temor infundado de que al subir las pruebas, los atacantes sabrán qué casos extremos se validan y dónde atacar. **Esto es una falacia de seguridad que contradice el Principio de Kerckhoffs.**
* Un sistema de software debe ser seguro por su **diseño arquitectónico, validación de entradas, sanitización y control estricto de accesos**, no porque su código o sus pruebas se mantengan en secreto.
* Los atacantes no esperan a leer tus pruebas: utilizan herramientas automatizadas de escaneo dinámico (Burp Suite, OWASP ZAP, SQLmap, nmap) que bombardean los endpoints públicos buscando vulnerabilidades.
* Si una prueba verifica que un endpoint no permite inyecciones SQL o accesos sin token JWT, aporta evidencia de que esa defensa funciona en el escenario probado. Y si la prueba demuestra una falla, la vulnerabilidad está en el código de producción expuesto a internet.

#### Los 3 Riesgos REALES que SÍ pueden ayudar a un atacante:
1. **Secretos Quemados (*Hardcoded Secrets*):** Dejar contraseñas reales de base de datos, credenciales de staging o tokens de APIs de pago (Stripe, AWS, SendGrid) dentro de los archivos de test creyendo que *"como es un test, no importa"*. Si el repositorio se filtra o es público, el atacante tiene acceso inmediato a la infraestructura.
2. **Fuga de PII en Fixtures:** Exportar registros reales de usuarios (nombres, correos, documentos, contraseñas hash) de una base de datos de producción para usarlos como "datos de prueba" en un fixture. Esto constituye una violación legal grave (GDPR, Habeas Data Ley 1581).
3. **Endpoints de Depuración Olvidados:** Rutas auxiliares creadas para facilitar las pruebas (ej. `/api/test/reset-db`, `/debug/impersonate-admin`) que quedan habilitadas y desprotegidas en los despliegues de producción.

#### Prácticas Obligatorias de Seguridad:
* **Generación Sintética:** Usar bibliotecas generadoras de datos ficticios como `Faker` o `factory_boy`.
* **Secretos en la Nube:** Almacenar tokens y credenciales exclusivamente en **GitHub Secrets** (`${{ secrets.API_KEY }}`) e inyectarlos como variables de entorno efímeras en el runner.
* **Aislamiento en Memoria:** Utilizar bases de datos efímeras en memoria (`sqlite:///:memory:`) o contenedores efímeros (*Testcontainers*) que se destruyen al finalizar la prueba.
* **Escaneo Continuo:** Integrar herramientas como `gitleaks` o `trufflehog` para impedir que se comiteen secretos por error.

---

### 4. ¿Qué tan recomendable es tener repositorios públicos en Git?

| Criterio | Repositorio Público | Repositorio Privado | Recomendación Profesional / SENA ADSO |
| :--- | :--- | :--- | :--- |
| **Portafolio y Empleabilidad** | ⭐⭐⭐⭐⭐ **Máxima visibilidad.** Evidencia irrefutable de dominio técnico: pirámide de pruebas, cobertura $\ge 80\%$ y CI/CD verde ante reclutadores. | ❌ **Invisible.** No permite demostrar habilidades a menos que se comparta acceso explícito bajo invitación. | **Proyectos formativos y de práctica deben ser públicos** para construir reputación profesional. |
| **Propiedad Intelectual (IP)** | ⚠️ **Código abierto al mundo.** Cualquiera puede clonar, bifurcar o aprender de la implementación. | 🔒 **Protección total.** Salvaguarda ventajas competitivas, algoritmos propietarios y modelos de negocio. | **Usa repositorios privados para empresas, clientes comerciales o proyectos con NDA.** |
| **Costos y Recursos CI/CD** | 🆓 **Minutos ilimitados y gratuitos** en GitHub Actions para proyectos públicos. | ⏱️ **Cuota limitada** (2.000 minutos/mes en plan gratuito compartidos entre todos tus repositorios privados). | Los repositorios públicos permiten correr suites pesadas (Playwright E2E) sin agotar cuota. |
| **Auditoría Comunitaria** | 👁️ **Ley de Linus:** *"Dado un número suficiente de ojos, todos los errores son superficiales"*. Reportes y parches de la comunidad. | 🛡️ **Auditoría cerrada.** La detección de bugs recae exclusivamente en el equipo interno. | **REGLA DE ORO: Desarrolla y prueba TODO repositorio privado como si fuera público mañana (cero secretos).** |

---

### 5. Tests para Git: Validando el Flujo de Trabajo (Hooks & Secret Scanning)

Así como probamos el código de la aplicación con PyTest o Jest, también debemos **testear el propio flujo de Git** antes de que el código salga de la máquina del desarrollador:

1. **Pre-commit Hooks (`pre-commit`):**
   * Se ejecutan en el área de preparación (*staging area*) al invocar `git commit`.
   * Si detectan espacios en blanco sobrantes, YAML mal formateado o si falla una prueba unitaria rápida, **Git aborta físicamente el commit**.
2. **Secret Scanning en Git (`gitleaks`):**
   * Hook estático de seguridad que inspecciona los diffs en stage buscando patrones de regex de tokens de GitHub, llaves privadas RSA, secretos de AWS y contraseñas.
   * Si un aprendiz intenta cometer un archivo `.env` o una constante `API_KEY = "sk_live_..."`, el commit es rechazado de inmediato.
3. **Commitlint (Conventional Commits):**
   * Prueba automática sobre el mensaje del commit para forzar el estándar (`feat:`, `fix:`, `test:`, `docs:`), permitiendo generar *Changelogs* y versionamiento semántico (*SemVer*) automático.
4. **Pruebas Locales de Workflows con `act`:**
   * La herramienta CLI `act` (de Nektos) permite ejecutar los flujos de GitHub Actions (`.github/workflows/ci.yml`) localmente dentro de contenedores Docker, verificando que el pipeline funcione antes de hacer `git push`.

#### Configuración Canónica: `.pre-commit-config.yaml`
Disponible en `recursos/codigo-ejemplo/.pre-commit-config.yaml`:
```yaml
repos:
  # Higiene de repositorio
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.6.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-json
      - id: check-added-large-files
        args: ['--maxkb=500']

  # Detección estricta de secretos en Git
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.4
    hooks:
      - id: gitleaks

  # Linter rápido Python
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.4.4
    hooks:
      - id: ruff
        args: [--fix]

  # Smoke test obligatorio antes del commit (< 2s)
  - repo: local
    hooks:
      - id: pytest-unit-fast
        name: pytest unit fast
        entry: pytest tests/unit -q --tb=line
        language: system
        types: [python]
        pass_filenames: false
```

---

---

## 🚀 Flujo de Trabajo: Git ➔ Pruebas ➔ Despliegue en VPS

El despliegue hacia nuestro servidor VPS no se realiza a ciegas. Sigue un flujo estricto gobernado por **Quality Gates (Compuertas de Calidad)**:

```
[Máquina Local]
  └── Pre-commit & Pre-push Hooks (Linters y tests unitarios rápidos < 5s)
        │ (git push origin main)
        ▼
[GitHub / GitLab CI]
  ├── 1. Linting & Formateo (ruff, eslint, black)
  ├── 2. Tests Unitarios y de Dominio (PyTest, Vitest, JUnit)
  ├── 3. Tests de Integración con DB efímera (Rollback / Testcontainers)
  ├── 4. Auditoría de Seguridad & SAST (pip-audit, npm audit, trivy)
  └── 5. Build de Contenedores Docker
        │
        ├── ❌ SI FALLA ALGÚN TEST: Abortar inmediatamente. El VPS no se toca.
        ▼
        ├── ✅ SI TODOS PASAN (Quality Gate verde): Disparar despliegue CD
[Servidor VPS]
  ├── Conexión segura SSH con llave privada (GitHub Secrets)
  ├── `git pull` & `docker compose up -d --build` (Nuevo contenedor)
  ├── 🧪 SMOKE TEST EN CALIENTE: `curl -f http://localhost:8000/health`
  │     ├── Exitoso: Conmutar tráfico Nginx (Zero Downtime).
  │     └── Fallido: 🚨 Auto-rollback a versión previa estable (`git checkout HEAD~1`).
```

---

## 📊 Taxonomía Integral de Pruebas Incluidas

### 1. Pruebas Funcionales (Comportamiento del Negocio)
* **Unitarias:** Lógica pura, cálculos matemáticos y validaciones aisladas con mocks/stubs (< 5 ms).
* **Integración:** Interacción entre endpoints REST y base de datos real con transacciones y rollback automático.
* **Contrato / API:** Validación de schemas OpenAPI / Pydantic v2 para garantizar coherencia entre frontend y backend.
* **Componentes / UI:** Renderizado de componentes en DOM virtual con eventos accesibles (`getByRole`).
* **End-to-End (E2E):** Automatización de flujos completos en navegadores reales headless con Playwright.
* **Regresión:** Ejecución sistemática tras cada cambio para evitar que funcionalidades previas se rompan.
* **Humo (Smoke Tests):** Verificación rápida y superficial post-despliegue en el VPS para comprobar que el servicio arrancó.

### 2. Pruebas No Funcionales: Rendimiento y Estrés del Servidor
* **Carga (Load Testing):** Comportamiento bajo volumen normal esperado (ej. 100-500 usuarios concurrentes, latencia p95 < 200 ms).
* **Estrés (Stress Testing):** Aumento progresivo de carga hasta hallar el punto de quiebre (*Breaking Point*), saturación de CPU o agotamiento del pool de conexiones PostgreSQL.
* **Pico (Spike Testing):** Ráfagas repentinas de tráfico (ej. de 10 a 2.000 usuarios en 5 segundos) y validación de auto-recuperación sin reinicio.
* **Resistencia (Soak / Endurance Testing):** Carga continua moderada durante 12-24 horas para detectar **fugas de memoria (*memory leaks*)** y llenado de disco en el VPS.
* **Concurrencia / Condición de Carrera:** Múltiples peticiones simultáneas sobre el mismo registro para validar bloqueos de base de datos (`SELECT ... FOR UPDATE`).

---

## 🗺️ Ruta Metodológica Paso a Paso para Pruebas Automatizadas en Cualquier Proyecto (Guía del Aprendiz)

Para avanzar con rapidez sin perder profundidad, el aprendiz debe aplicar un **orden de ejecución lógico** en cada proyecto. Comenzar probando la interfaz de usuario en el navegador es un error que produce lentitud y frustración; la metodología profesional inicia siempre en la base de la pirámide de pruebas (lógica pura y rápida) y escala progresivamente hasta los flujos de extremo a extremo.

### 🧭 Flujo Lógico Maestro de 7 Fases para Cualquier Proyecto

| Fase | Nivel de Prueba | Objetivo del Aprendiz | Herramienta | Tiempo Feedback | Condición de Pase |
|---|---|---|---|---|---|
| **1. Arnés (Harness)** | Configuración | Preparar entorno virtual, dependencias y estructura de carpetas `tests/` | `venv`, `npm`, `pom.xml` | < 1 min | Dependencias instaladas y configuradas |
| **2. Dominio (70%)** | Unitarias | Probar funciones puras, validaciones Pydantic/JPA, cálculos y modelos | PyTest, Vitest, JUnit 5 | **< 5 ms** | 100% asserts en verde sin IO ni red |
| **3. Integración (20%)** | Endpoints / DB | Validar contratos de API, status codes (201, 404, 422) y persistencia con rollback | `TestClient`, `test_client`, `MockMvc` | < 500 ms | Base de datos limpia y respuestas JSON válidas |
| **4. Componentes UI** | Frontend DOM | Renderizar componentes en DOM virtual, validar accesibilidad (`getByRole`) | React Testing Library + Vitest | < 200 ms | Componente interactivo y accesible |
| **5. E2E (10%)** | Cúspide Pirámide | Automatizar el camino dorado crítico (login -> CRUD -> verificación) en navegador | Playwright | 2 - 10 s | Flujo sin roturas visuales ni excepciones |
| **6. Cobertura & SAST** | Compuerta Local | Auditar líneas y ramas cubiertas (>=80%) y detectar vulnerabilidades OWASP | `pytest-cov`, `JaCoCo`, `qa_auditor` | < 5 s | Cobertura >= 80% y Score QA >= 80% |
| **7. CI/CD Gate** | Nube & Entrega | Automatizar la ejecución en cada `git push` impidiendo despliegues rotos al VPS | GitHub Actions | 1 - 3 min | Pipeline verde (Quality Gate superado) |

---

### 📦 Paso a Paso Detallado por Herramienta

```
         [ Flujo de Progresión Técnica del Aprendiz ]
 ┌────────────────────────────────────────────────────────┐
 │ 1. PyTest FastAPI / Flask  ──▶  Lógica de Negocio & API│
 │ 2. JUnit 5 + Mockito       ──▶  Backend Enterprise     │
 │ 3. Vitest + React TL       ──▶  Componentes de Interfaz│
 │ 4. Ciclo TDD / BDD         ──▶  Diseño guiado por tests│
 │ 5. Playwright E2E          ──▶  Navegación real de UI  │
 │ 6. pytest-cov / JaCoCo     ──▶  Compuerta de Cobertura │
 │ 7. GitHub Actions + SAST   ──▶  Entrega Continua Segura│
 └────────────────────────────────────────────────────────┘
```

#### 1. PyTest en FastAPI (Microservicios REST)
* **Paso 1: Entorno:** `pip install pytest pytest-cov httpx fastapi sqlalchemy pydantic`
* **Paso 2: Aislamiento (`conftest.py`):** Configurar motor SQLite en memoria y sobreescribir dependencias:
  ```python
  @pytest.fixture
  def client(db_session):
      app.dependency_overrides[get_db] = lambda: db_session
      yield TestClient(app)
      app.dependency_overrides.clear()
  ```
* **Paso 3: Caso de Prueba AAA (`test_productos.py`):**
  ```python
  def test_crear_producto(client):
      # Arrange & Act
      res = client.post("/productos/", json={"nombre": "Laptop", "precio": 1200.0, "stock": 5})
      # Assert
      assert res.status_code == 201
      assert res.json()["nombre"] == "Laptop"
  ```
* **Paso 4: Ejecución en terminal:** `pytest tests/ -v -s -x --tb=short`
* **Paso 5: Depuración:** Si responde 422, inspeccionar `res.json()['detail']` para ver el campo exacto rechazado por Pydantic.

#### 2. PyTest en Flask (Vistas Web y Jinja) — Proyecto Guia-Flask
El aprendiz prueba la aplicación web Flask real que construyó en la fase anterior (**Guia-Flask**). Nada se supone: cada comando parte de la raíz del proyecto y del entorno virtual activo.

* **Paso 1 — Obtener el proyecto:** Tener en el computador la carpeta de Guia-Flask (contiene `run.py`, `requirements.txt`, `app/` y `tests/test_routes.py`). Si falta, clonarla del repositorio indicado por el instructor (`git clone <URL>`).
* **Paso 2 — Abrir PowerShell en la raíz del proyecto:**
  ```powershell
  cd "C:\Users\TuUsuario\Guia-Flask"
  Get-ChildItem   # verificar que aparecen run.py, requirements.txt, app/ y tests/
  ```
* **Paso 3 — Crear el entorno virtual:** `python -m venv venv` (si `python` no se reconoce, instalar Python desde python.org marcando *Add Python to PATH*).
* **Paso 4 — Activar el entorno (PowerShell):** `.\venv\Scripts\activate` → el prompt debe mostrar `(venv)`. Si PowerShell bloquea el script: `Set-ExecutionPolicy -Scope Process Bypass`.
* **Paso 5 — Instalar dependencias de la aplicación:** `pip install -r requirements.txt`
* **Paso 6 — Instalar herramientas de prueba:** `pip install pytest pytest-cov`
* **Paso 7 — Levantar la app para verificar (opcional):** `python run.py` → abrir `http://127.0.0.1:5000` → detener con `Ctrl+C`.
* **Paso 8 — Ejecutar la suite completa:** `pytest` (lee `pytest.ini` → `testpaths = tests`). La última línea resume: `N passed` o `M failed`.
* **Paso 9 — Ejecutar el archivo de rutas:** `pytest tests/test_routes.py -v` (una sola prueba: `pytest tests/test_routes.py::test_health_check -v`).
* **Paso 10 — Medir cobertura:** `pytest --cov=services --cov=routers --cov=schemas --cov-report=term-missing --cov-fail-under=80` (umbral mínimo 80 % en la lógica del ejemplo).
* **Solución de errores:** `ModuleNotFoundError` → verificar carpeta raíz, entorno activo y dependencias instaladas en ese orden.
* **Conceptos al redactar pruebas:** la fixture aísla con `TESTING=True` + `sqlite:///:memory:`; el HTML se valida decodificado (`response.get_data(as_text=True)` y `follow_redirects=True`); las sesiones se simulan con `with client.session_transaction() as sess:`.

#### 3. Vitest + React Testing Library (Frontend React)
* **Paso 1: Entorno:** `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
* **Paso 2: Configuración:** En `vitest.config.js` definir `environment: 'jsdom'` y `setupFiles: './setupTests.js'`.
* **Paso 3: Redacción accesible:**
  ```jsx
  render(<Contador />);
  const btn = screen.getByRole("button", { name: /incrementar/i });
  fireEvent.click(btn);
  expect(screen.getByText(/contador: 1/i)).toBeInTheDocument();
  ```
* **Paso 4: Ejecución:** `npm test` (modo watch interactivo) o `npm run test:coverage`.
* **Paso 5: Depuración:** Ante renderizados asíncronos (`useEffect`), usar `await waitFor(() => expect(...))` o `screen.findByRole()`.

#### 4. JUnit 5 + Mockito (Backend Java / DAOs)
* **Paso 1: Dependencias Maven:** Añadir `junit-jupiter-engine` y `mockito-core` en `pom.xml`.
* **Paso 2: Clase de prueba:** Anotar con `@ExtendWith(MockitoExtension.class)` y `@DisplayName`.
* **Paso 3: Dobles de prueba:** Declarar `@Mock private Connection mockConn;` e inyectar en el DAO.
* **Paso 4: Comportamiento y Aserción:**
  ```java
  when(mockStmt.executeUpdate()).thenReturn(1);
  boolean ok = dao.crear(new Producto("Teclado", 50.0));
  assertTrue(ok);
  verify(mockStmt).executeUpdate();
  ```
* **Paso 5: Ejecución:** `mvn test` o `mvn test -Dtest=ProductoDAOTest`.

#### 5. Ciclo TDD (Test-Driven Development)
1. **Rojo (Red):** Escribir la prueba antes del código y verificar que falle por la razón esperada.
2. **Verde (Green):** Escribir el código mínimo para que pase (técnica *Fake It* permitida).
3. **Refactor:** Limpiar código duplicado y mejorar nombres manteniendo la suite en verde.
4. **Baby Steps:** Mantener ciclos de menos de 5 minutos por iteración.

#### 6. BDD con Behave (Gherkin)
* **Paso 1: Estructura:** `pip install behave requests; mkdir -p features/steps`
* **Paso 2: Característica (`features/inventario.feature`):**
  ```gherkin
  Scenario: Registrar producto válido
    Given que estoy autenticado como admin
    When envio POST /productos con nombre "Monitor" y precio 250
    Then la respuesta tiene status 201
  ```
* **Paso 3: Steps (`features/steps/inventario_steps.py`):** Implementar con `@given`, `@when`, `@then` guardando datos en `context`.
* **Paso 4: Ejecución:** `behave features/`

#### 7. Playwright (Pruebas End-to-End E2E)
Los aprendices ya conocen Flask y Jinja; por eso el punto de partida no es
aprender otro *frontend*, sino seguir la petición completa:

`ruta Flask -> render_template() -> HTML en el navegador -> acción del usuario -> nueva petición -> respuesta Jinja`.

Playwright observa y actúa sobre el navegador real. No reemplaza a PyTest ni al
`test_client`: PyTest comprueba la vista y el contrato del servidor sin abrir un
navegador; Playwright comprueba que una persona pueda completar el flujo desde
la interfaz.

**Mapa rápido de herramientas:**

| En la aplicación Flask/Jinja | En Playwright | Qué se verifica |
|---|---|---|
| `@app.get('/productos')` | `page.goto('/productos')` | La ruta carga y entrega una página navegable. |
| `render_template('productos.html', products=...)` | `page.getByRole(...)` / `page.getByTestId(...)` | El HTML renderizado contiene controles y datos visibles. |
| `<label for="nombre">` + `<input id="nombre">` | `page.getByLabel('Nombre')` | El campo puede ser localizado como lo percibe el usuario. |
| `<form method="post">` + `request.form` | `locator.fill()` + `locator.click()` | El usuario puede diligenciar y enviar el formulario. |
| `redirect(url_for(...))` | `expect(page).toHaveURL(...)` | El flujo termina en la URL esperada. |
| `flash()` y mensajes Jinja | `expect(page.getByRole('status'/'alert'))` | El éxito y el error son comunicados en pantalla. |

**Paso 1: Preparar el ejemplo Flask/Jinja.** Usa el ejemplo autocontenido de
[`recursos/codigo-ejemplo/flask_jinja_demo/`](recursos/codigo-ejemplo/flask_jinja_demo/).
La plantilla expone etiquetas accesibles y algunos `data-testid` como contrato
de prueba. Los identificadores de prueba describen una intención estable; no
dependas de `div:nth-child(2)` ni de la estructura visual.

**Paso 2: Instalar Playwright y el navegador.** Desde
`recursos/codigo-ejemplo/` ejecuta:

```powershell
npm install -D @playwright/test
npx playwright install chromium
$env:FLASK_SECRET_KEY = "<CLAVE_LOCAL_DE_PRUEBA>"
```

La variable es necesaria porque el ejemplo usa `flash()` y, por tanto, la
sesión firmada de Flask. Usa una clave local o efímera; nunca una credencial de
producción ni la guardes en Git.

**Paso 3: Configurar el servidor de Flask.** El archivo
[`playwright.flask.config.js`](recursos/codigo-ejemplo/playwright.flask.config.js)
define `baseURL`, captura de pantalla, vídeo, traza y `webServer`. Esta última
opción inicia Flask antes de los tests y lo detiene al terminar; por eso cada
spec puede escribir `page.goto('/productos')` sin repetir la URL completa.

**Paso 4: Leer el DOM con localizadores.** Prefiere, en este orden, lo que el
usuario percibe (`getByRole`, `getByLabel`, `getByText`) y luego un contrato
explícito (`getByTestId`). `page` representa una pestaña, `locator` representa
un elemento que Playwright vuelve a buscar cuando lo usa y `expect` espera hasta
que la condición web sea verdadera. Esta combinación reduce pruebas inestables.

**Paso 5: Probar un flujo completo.** En
[`tests/e2e/flask_jinja.spec.js`](recursos/codigo-ejemplo/tests/e2e/flask_jinja.spec.js)
se prueban tres caminos: render inicial, creación válida con `POST` y
`redirect`, y rechazo de un precio inválido. Observa que cada prueba afirma un
resultado visible, no solamente que el clic se ejecutó.

```javascript
test("crea un producto y sigue el redirect de Flask", async ({ page }) => {
    await page.goto("/productos");
    await page.getByLabel("Nombre").fill("Teclado");
    await page.getByLabel("Precio").fill("45");
    await page.getByRole("button", { name: "Guardar producto" }).click();

    await expect(page).toHaveURL(/\/productos$/);
    await expect(page.getByRole("status")).toContainText("Producto creado");
    await expect(page.getByTestId("producto-row")).toContainText("Teclado");
});
```

**Paso 6: Usar las demás herramientas cuando el caso lo requiera.** `browser`
es el motor; `context` aísla cookies, almacenamiento y permisos de cada
usuario; `page` es la pestaña; `locator` localiza; `expect` aserta con espera
automática; `request` prepara o consulta datos por HTTP sin pasar por la UI;
`page.route()` controla una petición de red cuando se necesita simular una
dependencia externa; `test` y sus *fixtures* organizan el ciclo de vida; y
`webServer` conecta el ejecutor con Flask. En una app con login, una fixture
puede crear la sesión de prueba una vez y cada `context` conserva el aislamiento
entre casos. No uses `request` para reemplazar el flujo que quieres demostrar:
úsalo para preparar datos o separar un caso de autenticación.

**Paso 7: Ejecutar, observar y diagnosticar.**

```powershell
npx playwright test --config=playwright.flask.config.js
npx playwright test --config=playwright.flask.config.js --headed
npx playwright test --config=playwright.flask.config.js --ui
npx playwright codegen http://127.0.0.1:5017/productos
npx playwright show-report
```

`codegen` ayuda a descubrir acciones y localizadores, pero el código generado
se revisa y se simplifica. `--headed` muestra el navegador; `--ui` permite
avanzar paso a paso; el informe y la traza permiten revisar DOM, consola,
peticiones y capturas. Evita `setTimeout`: espera el estado que importa con
`expect`. Si el fallo está en la regla, corrígelo en Flask; si está en la
plantilla o en el contrato de localización, corrígelo en Jinja/HTML; si el
flujo funciona pero la aserción es frágil, mejora el spec.

**Regla de separación:** prueba con `client.post()` las reglas del servidor,
validaciones y códigos HTTP; prueba con Playwright los caminos críticos que una
persona ejecuta en el navegador. Un mismo requisito puede tener ambas pruebas,
pero con responsabilidades diferentes.

#### 8. Medición de Cobertura (Coverage Gates)
* **Python:** `pytest --cov=services --cov=routers --cov=schemas --cov-report=html --cov-fail-under=80`
* **JavaScript:** `npm run test:coverage` (abrir `coverage/index.html`)
* **Java:** `mvn test jacoco:report` (abrir `target/site/jacoco/index.html`)
* **Regla de oro:** 80% en lógica de negocio es obligatorio. Auditar que cada línea cubierta contenga aserciones reales.

#### 9. Pipeline CI/CD en GitHub Actions
* Configurar `.github/workflows/ci.yml` con compuerta estricta:
  `Lint -> Unit Tests -> Integration Tests -> Coverage Check (>=80%) -> Docker Build`.
* Si un solo test falla, el runner detiene el workflow (`exit 1`) y el servidor VPS no sufre alteraciones.

#### 10. Auditoría Multidimensional con `qa_auditor`
* Ejecutar en `recursos/auditoria-seguridad/`:
  `python -m qa_auditor --target ..\codigo-ejemplo --url http://localhost:8000 --min-score 80`
* Detecta código generado con IA defectuoso: imports alucinados, funciones con `pass` o tests vacíos sin aserciones.

---

## 🛠️ Puntos de Entrada y Ejecución Local

* **Iniciar Servidor Web de la Guía:**
  ```powershell
  .\start-windows.ps1
  # Disponible en http://localhost:8035
  ```
  El script usa el servidor estático de Python y no descarga paquetes. Como alternativa
  rápida, abre `web/index.html` directamente en el navegador; la ruta de aprendizaje
  y sus simuladores funcionan sin red porque los recursos de la guía están versionados
  localmente.
* **Ejecutar Suite de Pruebas de la Guía:**
  ```powershell
  pytest tests/test_guide.py -v
  ```
* **Generar el documento DOCX de la guía:**
  ```powershell
  python generar_guia.py
  ```

---

## 🛡️ Auditoría Multidimensional con Score (%) — `qa_auditor`

Sistema (en `recursos/auditoria-seguridad/`) que mide el **índice global de
calidad en 0–100 %** de cualquier aplicación —incluidas las construidas con
inteligencia artificial— y **clarifica qué debilidades** tiene y cómo
corregirlas.

### ¿Qué mide? 9 dimensiones

| Dimensión | Peso | Ejemplo de hallazgo |
|---|---|---|
| **seguridad** (OWASP 2021) | ×2 | Secretos en código (A02), SQLi (A03), XSS (A03), CORS `*` (A05), deps sin fijar (A06), cabeceras ausentes en caliente |
| funcionalidad | ×1 | Sin schemas de validación, aserciones en producción |
| fiabilidad | ×1 | Sin handler global de errores, transacciones sin rollback |
| eficiencia | ×0.75 | Listados sin paginación, consultas sin índice |
| usabilidad | ×0.75 | HTML sin `lang="es-CO"`, imágenes sin `alt` |
| mantenibilidad | ×0.75 | Módulos > 250 líneas, sin tipado |
| portabilidad | ×0.5 | Config hardcodeada, deps sin anclar |
| compatibilidad | ×0.5 | Sin contrato OpenAPI, encoding no explícito |
| **ia** (código generado con IA) | ×1.25 | `TODO/NotImplementedError`, **imports alucinados**, funciones muertas, **pruebas sin aserciones** que pasan en verde siempre |

### Uso

```powershell
cd recursos/auditoria-seguridad

# Score estático de cualquier carpeta (la app, un servicio, un repo completo)
python -m qa_auditor --target ..\codigo-ejemplo

# + auditoría en caliente de cabeceras y cookies HTTP
python -m qa_auditor --target ..\codigo-ejemplo --url http://localhost:8000

# Salidas para CI + compuerta de calidad (exit code != 0 si score < umbral)
python -m qa_auditor --target ..\codigo-ejemplo `
  --json informe.json --html informe.html --min-score 80
```

El resultado final es un reporte con **% por dimensión, índice global
ponderado, índice de seguridad y ranking de debilidades `severity` +
evidencia `archivo:línea` + remedio** (5 de 5: qué, dónde, cuánto pesa,
cómo se corrige).

### Tests del sistema

```powershell
# Suite propia del auditor (28 tests)
pytest tests -v

# Root: guía + integración del auditor contra la app de ejemplo (16 tests)
pytest tests -v
```

---

## 📡 Framework de Observabilidad & Monitoreo Inteligente de Contenedores en Coolify

El ciclo de calidad no termina con el despliegue exitoso (`git push ➔ CI/CD`). Una vez la aplicación corre en un contenedor dentro de **Coolify**, es fundamental disponer de **observabilidad en tiempo de ejecución** para detectar anomalías, degradación de rendimiento y excepciones no capturadas.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SERVIDOR VPS (Gestionado por Coolify)                                       │
│                                                                             │
│  ┌────────────────────────┐         ┌────────────────────────────────────┐  │
│  │ Contenedor Flask (App) │         │ Agente AI Log Watcher & Triage     │  │
│  │ ├─ JSON Structured Logs│ stdout  │ ├─ Escucha /var/run/docker.sock    │  │
│  │ ├─ /metrics (Prometheus│───────▶ │ ├─ Recibe Webhook de Coolify       │  │
│  │ ├─ /healthz, /readyz   │         │ ├─ Deduplica con SHA-256 (Anti-Spam│  │
│  │ └─ Correlation ID      │         │ └─ Prompt RCA hacia LLM API        │  │
│  └────────────────────────┘         └──────────────────┬─────────────────┘  │
└────────────────────────────────────────────────────────┼────────────────────┘
                                                         │
                                      Diagnóstico & Fix  │
                                                         ▼
                                      ┌──────────────────────────────────────┐
                                      │ Canales de Alerta & Auto-Remediación │
                                      │ ├─ Telegram / Discord / Slack        │
                                      │ ├─ Correo Electrónico (Coolify SMTP) │
                                      │ └─ Issue / PR en GitHub con código   │
                                      └──────────────────────────────────────┘
```

---

### 1. Instrumentación de la Aplicación en Flask

Para que un contenedor pueda ser analizado de forma automatizada por la IA, el log no debe ser texto plano arbitrario, sino **JSON estructurado** con identificador de correlación (*Correlation ID*).

El módulo [`recursos/observabilidad/flask_observability.py`](recursos/observabilidad/flask_observability.py) suministra esta capa:

```python
from flask import Flask
from recursos.observabilidad.flask_observability import setup_observability

app = Flask(__name__)

# Check opcional para verificar conectividad con base de datos o Redis
def check_database():
    # Retorna True si la conexión está viva, False si está caída
    return True

# Activa logs JSON, X-Request-ID, /healthz, /readyz y /metrics
obs = setup_observability(app, service_name="catalogo-api", readiness_check=check_database)

@app.route("/productos")
def listar():
    app.logger.info("Consulta de catálogo ejecutada exitosamente")
    return {"productos": []}
```

#### Capacidades que habilita en el contenedor:
1. **Logs Estructurados en JSON:** Cada log emitido a `stdout` contiene `timestamp` ISO-8601, `level`, `service`, `message`, `source` (`archivo.py:linea`), `request_id` y `exception` completa si hubo un error.
2. **Correlation ID (`X-Request-ID`):** Asigna un UUID único a cada petición o propaga el existente, facilitando rastrear el viaje completo de una transacción entre microservicios.
3. **Probes de Salud para Coolify:**
   * `GET /healthz` (Liveness): Responde `200 OK` para confirmar que el servidor HTTP no está bloqueado.
   * `GET /readyz` (Readiness): Confirma que las dependencias críticas (PostgreSQL, Redis) están listas para recibir tráfico.
4. **Métricas en formato Prometheus:**
   * `GET /metrics`: Expone contadores de peticiones por método/endpoint/código HTTP (`http_requests_total`) y tiempos de respuesta acumulados (`http_request_duration_seconds_total`).

---

### 2. Cómo Estar Atento a los Logs en Coolify

En un servidor administrado con **Coolify**, existen tres niveles operativos para vigilar la salud de los contenedores:

#### Nivel A: Notificaciones Nativas de Coolify (Panel `Notifications`)
Desde el panel central de Coolify (en `Settings > Notifications`):
* **Canales soportados:** Email (SMTP/Resend), Discord, Telegram, Slack, Pushover y Webhook.
* **Eventos críticos recomendados:**
  * **Deployments ➔ `Deployment failure`:** Se dispara de inmediato si la construcción de la imagen Docker falla o el healthcheck inicial rechaza el contenedor.
  * **Resources ➔ `Restart limit reached`:** Alerta cuando un contenedor entra en bucle de reinicios (*crash-loop*) por haber agotado la memoria RAM (OOM) o por excepciones no capturadas al inicio.

#### Nivel B: Visor Web en Tiempo Real con Dozzle
Para evitar tener que abrir terminales SSH manuales en el VPS, se puede desplegar **Dozzle** como servicio Docker en Coolify montando el socket `/var/run/docker.sock:ro`.
* Permite buscar logs instantáneamente en caliente, filtrar por expresiones regulares (`ERROR`, `500`) y monitorear el consumo de memoria/CPU de cada contenedor en una interfaz limpia y ligera.

#### Nivel C: Inspección de Límites de Tamaño en Docker
Para evitar que los logs saturen el disco del VPS, definir siempre en `docker-compose.yml`:
```yaml
logging:
  driver: "json-file"
  options:
    max-size: "15m"
    max-file: "5"
```

---

### 3. Automatización del Proceso Usando Inteligencia Artificial (AI SRE / Auto-Triage)

El analizador automatizado [`recursos/observabilidad/ai_log_watcher.py`](recursos/observabilidad/ai_log_watcher.py) procesa los incidentes de Coolify en tiempo real siguiendo este flujo:

#### Paso 1: Ingesta del Evento
* **Vía Webhook de Coolify:** Coolify envía una petición HTTP `POST` a `/webhook/coolify` en el puerto `9050` ante fallos de despliegue o reinicios.
* **Vía Docker Socket Stream:** El demonio escucha los logs de contenedores etiquetados con `coolify.managed=true`.

#### Paso 2: Deduplicación con Fingerprinting SHA-256
Para evitar llamar repetitivamente a la IA cuando un fallo produce cientos de logs por segundo:
* Se normaliza el mensaje de error (eliminando fechas y UUIDs efímeros) y se genera un hash `SHA-256`.
* Si el mismo error ya fue analizado dentro de una ventana de 10 minutos, se silencia o agrupa el contador.

#### Paso 3: Análisis de Causa Raíz con LLM (RCA)
El log filtrado se envía a un modelo de lenguaje (Gemini / OpenAI / Endpoint local) con un prompt especializado que exige respuesta en JSON estricto:

```json
{
  "severity": "CRITICAL",
  "root_cause": "Agotamiento de memoria RAM (OOM Killer). El contenedor superó el límite asignado.",
  "impact": "El contenedor fue terminado forzosamente por el kernel de Linux.",
  "coolify_action": "En Coolify > Application > General, aumentar el 'Memory Limit' de 256MB a 512MB.",
  "code_fix": "Verificar consultas con carga completa en memoria y aplicar paginación LIMIT / OFFSET en SQLAlchemy."
}
```

#### Paso 4: Alerta Enriquecida en Discord / Telegram
El agente despacha una tarjeta con código de color (Rojo para CRITICAL, Naranja para HIGH) donde el desarrollador recibe:
1. Nombre del contenedor y evento exacto.
2. Diagnóstico técnico claro (Causa Raíz).
3. **Acción inmediata en Coolify** (qué botón o configuración tocar).
4. **Parche de código propuesto** listo para copiar y pegar.

---

### 4. Despliegue Rápido del Stack en Coolify

Para desplegar la aplicación Flask junto al visor Dozzle y el agente de IA en un servidor remoto, importar [`recursos/observabilidad/docker-compose.observability.yml`](recursos/observabilidad/docker-compose.observability.yml) como un nuevo servicio en Coolify. Este escenario es opcional y no hace parte de la ejecución local de la guía:

```bash
# Variables de entorno requeridas en Coolify:
LLM_API_KEY=<CLAVE_IA_AQUI>
DISCORD_WEBHOOK_URL=<WEBHOOK_DISCORD_AQUI>
```

---

## 📄 Consolidación del Portafolio de Evidencias

Al cierre de la ruta, la guía integra un registro local accesible desde
`#m-evidencias-sena`. Su fuente única es [`deliverables.registry.json`](deliverables.registry.json),
que también se publica como un recurso JavaScript local para que la web funcione
al abrirse sin servidor. Cada evidencia aparece en la estación donde se produce
y el cierre solo consolida lo ya diligenciado.

El registro es una adaptación didáctica: no es una certificación, no emite un
juicio institucional y no reemplaza el instrumento, el formato o la valoración
que defina el instructor. Para preparar la entrega, usa
[`docs/evidencias-template.md`](docs/evidencias-template.md), conserva los
resultados reproducibles y revisa los umbrales acordados antes de cargar el
paquete en el LMS.
