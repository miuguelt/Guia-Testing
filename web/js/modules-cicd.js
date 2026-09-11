// Catálogo declarativo por tema; conserva el contenido existente.
Object.assign(window.MODULES, {
    "m-cicd": {
        title: "CI/CD con GitHub Actions",
        badge: "Modulo 11",
        intro: "Automatiza: cada push ejecuta tests, cada merge a main despliega. Pipeline completo.",
        blocks: [
            {
                type: "tools",
                title: "Herramientas del pipeline y sus contextos",
                stack: [
                    {
                        icon: "🚀", name: "GitHub Actions", tag: "CI/CD",
                        role: "Workflows YAML que corren lint, tests, cobertura y deploy como respuesta a push y PR en GitHub.",
                        when: "Quality Gate por cada push/merge y despliegue automatizado a VPS con smoke test y rollback."
                    },
                    {
                        icon: "📈", name: "k6", tag: "Rendimiento",
                        role: "Pruebas de carga/estres como codigo JS (Grafana/Load Impact): VUs por etapas, thresholds y resultados JSON.",
                        when: "Antes de produccion: load (trafico esperado), spike (picos), soak (horas) y estres (punto de quiebre)."
                    },
                    {
                        icon: "🔧", name: "Git + .gitignore", tag: "Versionamiento",
                        role: "El codigo de pruebas es ciudadano de primera clase (first-class): se versiona con el codigo de produccion.",
                        when: "Todo lo que se ejecuta en la nube: tests, fixtures y pipelines. Los reportes, cache y `.env` quedan fuera del repo."
                    },
                    {
                        icon: "🛡️", name: "pre-commit + Gitleaks", tag: "Git Testing & Seguridad",
                        role: "Hooks locales que ejecutan linters, escaneo de secretos y pruebas unitarias rápidas antes de permitir el commit.",
                        when: "En la máquina del desarrollador antes de que el código o credenciales salgan hacia el repositorio remoto."
                    }
                ]
            },
            {
                type: "steps",
                title: "Paso a Paso del Aprendiz: De Cero a un Pipeline CI/CD en GitHub Actions",
                intro: "Construye primero la integración continua (CI) y entiende cómo una entrega continua (CD) se conecta después del Quality Gate.",
                steps: [
                    {
                        number: 1,
                        title: "Crear el archivo de workflow en .github/workflows/ci.yml",
                        tag: "Paso 1: Definición",
                        desc: "Crea la carpeta `.github/workflows` en la raíz del repositorio y define el archivo `ci.yml` con la sintaxis estándar de GitHub Actions.",
                        command: "New-Item -ItemType Directory -Force .github/workflows; New-Item -ItemType File -Force .github/workflows/ci.yml",
                        tip: "Usa nombres descriptivos para cada trabajo (`python-tests`, `javascript-tests`, `java-tests`, `e2e-tests`) para que GitHub muestre qué falló a simple vista.",
                        pitfall: "Cometer errores de indentación en el YAML (espacios vs tabs), lo que hace que GitHub Actions rechace el workflow sin ejecutarlo."
                    },
                    {
                        number: 2,
                        title: "Configurar disparadores automáticos (Triggers)",
                        tag: "Paso 2: Disparadores",
                        desc: "Define `on: [push, pull_request]` apuntando a las ramas `main` y `develop` para que cada commit y solicitud de cambio sea evaluado antes de integrarse.",
                        command: "git push origin develop",
                        tip: "Configura la protección de ramas en los ajustes de GitHub para prohibir 'Merge' si el pipeline de CI no está completamente verde.",
                        pitfall: "Permitir merges directos a `main` sin pasar por la compuerta de GitHub Actions."
                    },
                    {
                        number: 3,
                        title: "Configurar la matriz de entornos y dependencias cacheadas",
                        tag: "Paso 3: Matriz de Ejecución",
                        desc: "Usa actions oficiales (`actions/setup-python@v5`, `actions/setup-node@v4`, `actions/setup-java@v4`) activando la opción `cache: 'pip'` o `cache: 'npm'`.",
                        command: "git add .github/workflows/ci.yml; git commit -m 'ci: setup pipeline'; git push origin develop",
                        tip: "El caché de dependencias acelera el tiempo de ejecución del pipeline de 3 minutos a menos de 30 segundos por corrida.",
                        pitfall: "Descargar paquetes desde cero en cada ejecución de CI consumiendo minutos innecesarios de la cuota de GitHub."
                    },
                    {
                        number: 4,
                        title: "Establecer la compuerta de fallo rápido (Fail-Fast)",
                        tag: "Paso 4: Quality Gate",
                        desc: "El workflow del ejemplo ejecuta PyTest y Behave, Vitest con cobertura, JUnit 5 con JaCoCo y Playwright. El job `quality-gate` depende de los cuatro y falla si alguno falla o queda omitido.",
                        command: "python -m pytest tests --cov=services --cov=routers --cov=schemas --cov-fail-under=80",
                        tip: "La cobertura no reemplaza los asserts: primero comprueba comportamiento, luego usa el porcentaje para localizar código sin escenarios.",
                        pitfall: "Configurar `continue-on-error: true` en pasos críticos de pruebas, lo que permite que el pipeline se marque en verde aunque los tests hayan fallado."
                    },
                    {
                        number: 5,
                        title: "Conectar CD después del Quality Gate",
                        tag: "Paso 5: Despliegue & Rollback",
                        desc: "El paquete implementa CI; el CD se agrega como un job posterior con `needs: quality-gate`, un entorno protegido y secretos del proveedor. Después del despliegue se ejecuta un smoke test contra `https://<TU_DOMINIO>/`.",
                        command: "curl -f https://<TU_DOMINIO>/",
                        tip: "Si el smoke test falla, detén la promoción y conserva la versión estable; el rollback debe ser una operación controlada del proveedor.",
                        pitfall: "Guardar claves SSH en el YAML, desplegar sin aprobación o llamar al servidor antes de que el Quality Gate termine."
                    }
                ]
            },
            {
                type: "code", lang: "yaml", file: ".github/workflows/ci.yml",
                title: "ci.yml - Quality Gate multi-lenguaje del proyecto",
                code: `name: CI - Quality Gate multi-lenguaje

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

permissions:
  contents: read

jobs:
  python-tests:
    name: Python \${{ matrix.python-version }} · PyTest + Behave
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        python-version: ["3.11", "3.12"]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: \${{ matrix.python-version }}
          cache: pip
          cache-dependency-path: requirements.txt
      - run: python -m pip install -r requirements.txt
      - run: python -m pytest tests --cov=services --cov=routers --cov=schemas --cov-fail-under=80
      - run: python -m behave -q

  javascript-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm
          cache-dependency-path: package-lock.json
      - run: npm ci
      - run: npm run test:coverage

  java-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: "21"
      - run: mvn --batch-mode test jacoco:report

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [python-tests, javascript-tests]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: python -m pip install -r requirements.txt
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: export FLASK_SECRET_KEY=\"$(python -c 'import secrets; print(secrets.token_hex(32))')\"; npm run e2e

  quality-gate:
    runs-on: ubuntu-latest
    if: \${{ always() }}
    needs: [python-tests, javascript-tests, java-tests, e2e-tests]
    steps:
      - if: \${{ needs.python-tests.result != 'success' || needs.javascript-tests.result != 'success' || needs.java-tests.result != 'success' || needs.e2e-tests.result != 'success' }}
        run: exit 1
      - run: echo "Quality Gate aprobado"`
            },
            {
                type: "alert", variant: "info",
                title: "🐙 Relación Simbiótica: Testing y GitHub como Quality Gate en la Nube",
                body: "GitHub permite ejecutar comprobaciones fuera de la máquina del programador y reducir el 'en mi máquina sí funciona'. Con GitHub Actions, eventos como push o pull request pueden iniciar runners independientes que clonan el repositorio, instalan dependencias y ejecutan la suite (PyTest, Jest, JUnit, Playwright). Si el repositorio configura reglas de protección y marca esos checks como obligatorios, GitHub bloquea la fusión mientras no cumplan; sin esa configuración, un pipeline fallido por sí solo no protege la rama. También puede mostrar anotaciones en el Pull Request, badges, artefactos como videos y trazas, y compuertas de cobertura conectadas a servicios como Codecov."
            },
            {
                type: "comparison",
                title: "¿Se deben subir los tests a Git? La Regla SSoT y el Control de Artefactos",
                headers: ["Elemento de QA / Testing", "¿Se sube a Git?", "Archivos / Ejemplos", "Justificación Técnica (SSoT y CI/CD)"],
                rows: [
                    ["Código de Pruebas", "✅ SÍ (Obligatorio)", "tests/test_*.py, *.spec.js, *Test.java", "Ciudadano de primera clase. Sin ellos, el runner de GitHub Actions no tiene nada que ejecutar y no hay Quality Gate."],
                    ["Fixtures y Datos Sintéticos", "✅ SÍ (cuando la suite los necesita)", "conftest.py, fábricas Faker, mocks", "Favorecen resultados repetibles cuando controlan estado, semillas, reloj y dependencias; por sí solos no eliminan toda variación."],
                    ["Configuraciones de Testing", "✅ SÍ (Obligatorio)", "pytest.ini, vitest.config.js, playwright.config.js", "Define cómo se descubren los casos, flags de ejecución, timeouts y umbrales de cobertura obligatorios."],
                    ["Pipelines CI y Hooks de Git", "✅ SÍ (Obligatorio)", ".github/workflows/ci.yml, .pre-commit-config.yaml", "Formaliza el contrato de calidad que todos los colaboradores y runners deben cumplir obligatoriamente."],
                    ["Secretos y Credenciales Reales", "❌ NUNCA (.gitignore)", ".env, .env.local, id_rsa, *.pem, API keys", "Vulnerabilidad crítica. Un secreto comiteado queda en el historial de Git para siempre, incluso si se borra luego."],
                    ["Reportes y Cobertura Efímera", "❌ NUNCA (.gitignore)", "htmlcov/, .coverage, coverage/, playwright-report/", "Son resultados temporales derivados. Generan ruido masivo, ensucian el árbol y provocan conflictos de merge."],
                    ["Cachés de Frameworks y Compilación", "❌ NUNCA (.gitignore)", ".pytest_cache/, __pycache__/, node_modules/, .nyc_output/", "Archivos generados dependientes del SO local; el entorno de CI debe crearlos limpios."],
                    ["Bases de Datos Locales", "❌ NUNCA (.gitignore)", "test.db, dev.sqlite3, dumps *.sql locales", "Riesgo de fuga de datos reales y corrupción binaria en el historial del repositorio Git."]
                ]
            },
            {
                type: "alert", variant: "danger",
                title: "🔒 Seguridad en Pruebas: ¿Subir los tests revela información a los atacantes?",
                body: "EL MITO DE LA SEGURIDAD POR OSCURIDAD: Ocultar los tests pensando que 'los atacantes sabrán cómo atacarnos o qué validaciones tenemos' es una falacia que viola el Principio de Kerckhoffs. Un software debe ser seguro por su arquitectura, validación de entradas, sanitización y control de accesos, NO por mantener el código o las pruebas en secreto. Los atacantes modernos usan herramientas automatizadas (Burp Suite, OWASP ZAP, SQLmap) que descubren fallas de seguridad en segundos sin necesidad de leer tus pruebas. Si una prueba demuestra que un endpoint no valida permisos o que un parámetro es vulnerable a inyección SQL, la vulnerabilidad está en el código de producción expuesto a internet, no en el test.\n\nLOS 3 RIESGOS REALES QUE SÍ PUEDEN AYUDAR A UN ATACANTE:\n1. Secretos quemados (Hardcoded Secrets): Dejar credenciales reales de staging o producción ('<CONTRASEÑA_REAL>', claves de Stripe o AWS) en los tests pensando que 'solo es un archivo de prueba'. Si el repositorio se filtra o es público, el atacante tiene acceso directo.\n2. Fuga de PII en fixtures: Exportar tablas reales de clientes con correos, nombres o teléfonos para usarlos como datos de test (grave violación de normativas GDPR y Habeas Data).\n3. Endpoints de depuración huérfanos: Rutas como '/api/dev/reset-database' o '/admin/bypass-auth' probadas en tests pero que quedaron activas y desprotegidas en producción.\n\nSOLUCIÓN: Usa siempre generadores de datos sintéticos (Faker), inyecta credenciales efímeras mediante GitHub Secrets y simula servicios externos con Mocks y Stubs."
            },
            {
                type: "comparison",
                title: "🌐 Repositorios Públicos vs. Privados en Git: ¿Qué tan recomendable es hacer público tu código?",
                headers: ["Criterio de Evaluación", "Repositorio Público", "Repositorio Privado", "Recomendación para el Aprendiz / Desarrollador"],
                rows: [
                    ["Portafolio y Empleabilidad", "⭐⭐⭐⭐⭐ Máxima visibilidad: Demuestra a reclutadores código limpio, pruebas con >=80% de cobertura y CI/CD verde.", "❌ Invisible para reclutadores sin invitación o acceso explícito.", "Haz públicos solo los proyectos de práctica que no contengan información sensible; la decisión no sustituye la valoración de competencias."],
                    ["Propiedad Intelectual (IP)", "⚠️ Código accesible para todos. Cualquiera puede clonar, bifurcar o aprender de tu software.", "🔒 Protegido. Ideal para ventajas comerciales, patentes y modelos de negocio propietarios.", "Usa repositorios privados para empresas, clientes con NDA o sistemas comerciales cerrados."],
                    ["Costos en GitHub Actions", "🆓 Ilimitado y gratuito: Runners públicos de GitHub con alta disponibilidad sin costo.", "⏱️ Minutos limitados (2.000 min/mes en plan gratuito compartidos entre todos tus repos).", "Los repos públicos son ideales para ejecutar suites completas de pruebas unitarias, integración y E2E sin agotar cuota."],
                    ["Auditoría Comunitaria", "👁️ Ley de Linus: 'Con suficientes ojos, todos los errores son superficiales'. La comunidad puede reportar fallos.", "🛡️ Auditoría restringida exclusivamente al equipo interno.", "REGLA DE ORO: Desarrolla y prueba TODO proyecto privado con los estándares de un repositorio público (cero secretos)."]
                ]
            },
            {
                type: "alert", variant: "warning",
                title: "🧪 Tests para Git: Validando el propio flujo de trabajo (Hooks y Secret Scanning)",
                body: "Así como testeamos la lógica con PyTest o Jest, debemos 'testear Git' para garantizar que ningún commit rompa el estándar antes de salir de la máquina local:\n• Pre-commit Hooks: Scripts que se ejecutan automáticamente en el staging area al escribir 'git commit'. Si un test unitario rápido o un linter falla, Git aborta el commit físicamente.\n• Secret Scanning (Gitleaks / detect-secrets): Test estático que analiza cada línea añadida buscando patrones regex de API keys de AWS, tokens de GitHub o contraseñas, impidiendo que entren al historial.\n• Commitlint (Conventional Commits): Valida que los mensajes de commit sigan el estándar ('feat:', 'fix:', 'test:'), facilitando el versionado semántico automático.\n• Pruebas de CI en local con 'act': Permite ejecutar tus workflows de GitHub Actions en contenedores Docker locales para testear el pipeline YAML antes de hacer 'git push'."
            },
            {
                type: "code", lang: "yaml", file: ".pre-commit-config.yaml",
                title: ".pre-commit-config.yaml - Testing de Git y Escaneo de Secretos con Gitleaks y PyTest",
                code: `# Quality Gate Local en Git: higiene, escaneo de secretos y pruebas unitarias
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.6.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-json
      - id: check-added-large-files
        args: ['--maxkb=500']

  # Detección estricta de secretos antes de comitear
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.4
    hooks:
      - id: gitleaks

  # Linter de código Python
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.4.4
    hooks:
      - id: ruff
        args: [--fix]

  # Smoke test local: pruebas unitarias rápidas obligatorias (< 2s)
  - repo: local
    hooks:
      - id: pytest-unit-fast
        name: pytest unit fast
        entry: pytest tests/unit -q --tb=line
        language: system
        types: [python]
        pass_filenames: false`
            },
            {
                type: "code", lang: "yaml", file: ".github/workflows/deploy-vps.yml",
                title: "deploy-vps.yml - Quality Gate y Despliegue Automatizado a VPS",
                code: `name: CD - Deploy to VPS
on:
  push:
    branches: [main]

jobs:
  # 1. QUALITY GATE: Ningún despliegue ocurre si los tests fallan
  test-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Python
        uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install -r requirements.txt && pytest --cov=app --cov-fail-under=80

  # 2. DESPLIEGUE A VPS: Condicionado a que test-gate esté 100% verde
  deploy-vps:
    needs: [test-gate]
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH to VPS
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: \${{ secrets.VPS_HOST }}
          username: \${{ secrets.VPS_USER }}
          key: \${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/qualitymesh-app
            git pull origin main
            docker compose up -d --build --remove-orphans
            
            # 3. SMOKE TEST EN VIVO EN EL VPS POST-DEPLOY
            echo "Ejecutando Smoke Test post-deploy..."
            for i in {1..10}; do
              if curl -f http://127.0.0.1:8000/health; then
                echo "✅ Smoke Test exitoso: VPS saludable"
                exit 0
              fi
              echo "Esperando que el servicio inicie ($i/10)..."
              sleep 3
            done
            
            # 4. ROLLBACK AUTOMÁTICO SI EL SMOKE TEST FALLA
            echo "🚨 SMOKE TEST FALLÓ: Ejecutando rollback a versión anterior"
            git checkout HEAD~1
            docker compose up -d --build
            exit 1`
            },
            {
                type: "code", lang: "javascript", file: "tests/stress/test_servidor_k6.js",
                title: "test_servidor_k6.js - Prueba de Carga y Estrés de Servidor con k6",
                code: `import http from "k6/http";
import { check, sleep } from "k6";

// Configuración de etapas de estrés (Ramping VUs)
export const options = {
  stages: [
    { duration: "30s", target: 50 },   // Carga normal: 50 usuarios
    { duration: "1m",  target: 200 },  // Estrés: 200 usuarios concurrentes
    { duration: "30s", target: 500 },  // Pico (Spike): 500 usuarios (breaking point)
    { duration: "30s", target: 0 },    // Recuperación / Ramping down
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],     // Errores HTTP deben ser menores a 1%
    http_req_duration: ["p(95)<250"],   // 95% de peticiones deben tardar < 250ms
  },
};

export default function () {
  const res = http.get("http://127.0.0.1:8000/productos/");
  check(res, {
    "status es 200": (r) => r.status === 200,
    "tiempo respuesta < 250ms": (r) => r.timings.duration < 250,
  });
  sleep(1);
}`
            },
            {
                type: "diagram", diagramType: "pipeline",
                title: "Flujo CI/CD",
                body: "Push -&gt; Lint -&gt; Tests Unit -&gt; Build -&gt; Tests E2E -&gt; Deploy Staging -&gt; Approval -&gt; Deploy Prod"
            },
            {
                type: "timeline",
                title: "Historia: de la construccion continua al Quality Gate",
                items: [
                    { year: "1991", title: "Grady Booch acuna 'continuous integration'", desc: "El termino nace como practica de construir e integrar en cada cambio para descubrir fallos temprano; Kent Beck la eleva a disciplina XP en 1997." },
                    { year: "2005", title: "Git y la automatizacion global", desc: "Linus Torvalds crea Git; los repositorios distribuidos permiten hooks, clones remotos y la integracion en la nube (Hudson 2005/Jenkins 2011)." },
                    { year: "2011", title: "Travis CI y la era as-a-service", desc: "Github comunitario adopta CI en la nube para pull requests; nace el badge verde que decide si el PR es mergeable." },
                    { year: "2017", title: "k6: rendimiento como codigo", desc: "Load Impact libera k6: JS, etapas y thresholds; Grafana lo adquiere en 2021 y las pruebas de carga entran al pipeline." },
                    { year: "2019", title: "GitHub Actions: pipelines nativos", desc: "Actions sale de beta: workflows YAML, reutilizables y marketplace; el guard de tests se vuelve la puerta hacia el VPS." }
                ]
            }
        ]
    }
});
