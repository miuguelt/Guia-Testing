"""Bloques 4.4.1 y 4.4.2: cobertura, CI/CD con GitHub Actions y Git."""
import os

from .config import EJ_DIR
from .estilos import agregar_codigo, agregar_pasos, leer


def cobertura(doc):
    doc.add_heading("Cobertura de código y compuertas de calidad", level=3)
    doc.add_paragraph(
        "Umbral obligatorio ADSO: cobertura mayor o igual al 80 % en la "
        "lógica de negocio. Configuración cero-fricción: en pytest.ini definir "
        "addopts = -v --cov=app --cov-report=term-missing para escribir solamente "
        "pytest y obtener el reporte confiable. Comando directo: pytest --cov=app "
        "--cov-report=term-missing --cov-fail-under=80. La columna Missing revela "
        "exactamente los números de línea que ninguna prueba ha validado. En otros "
        "ecosistemas: npm run test:coverage y mvn test jacoco:report."
    )



def cicd_y_git(doc):
    doc.add_heading("CI/CD, Testing con GitHub Actions y versionamiento en Git", level=3)
    for item in [
        "Relación entre Testing y GitHub: GitHub es el orquestador y árbitro "
        "imparcial de la calidad. A través de GitHub Actions, las pruebas se "
        "ejecutan en ejecutores limpios e independientes por cada push y "
        "pull request. Las reglas de protección de rama impiden fusionar "
        "cambios a main si las pruebas fallan.",
        "¿Se deben subir las pruebas a Git? SÍ. Las pruebas son ciudadanos "
        "de primera clase (First-Class Citizens). Sin ellas en el "
        "repositorio, los ejecutores de CI/CD no tienen nada que ejecutar y "
        "no hay reproducibilidad ni trazabilidad con git bisect. NUNCA se "
        "suben: reportes efímeros (htmlcov/), cachés (.pytest_cache/) ni "
        "secretos (.env).",
        "Seguridad y atacantes: el mito de la 'seguridad por oscuridad' es "
        "falso. Ocultar las pruebas no protege la aplicación; los atacantes "
        "usan herramientas automáticas (Burp Suite, OWASP ZAP) para "
        "encontrar fallas. El riesgo real es subir credenciales quemadas o "
        "datos reales en fixtures: usa datos sintéticos con Faker y GitHub "
        "Secrets.",
        "Repositorios Públicos vs Privados: para aprendices, los "
        "repositorios públicos son la mejor vitrina de calidad y cobertura. "
        "Para empresas y software propietario con acuerdo de "
        "confidencialidad, se usan repositorios privados. Regla de oro: "
        "escribe y prueba todo proyecto como si fuera a ser público mañana.",
    ]:
        doc.add_paragraph(item, style="List Bullet")
    agregar_pasos(doc, "Paso a paso para el pipeline CI/CD:", [
        {"num": 1, "titulo": "Workflow YAML", "desc": "Definir .github/workflows/ci.yml con eventos de push y pull_request hacia main.", "cmd": "git push origin main", "tip": "Configura el caché de dependencias para acelerar el pipeline."},
        {"num": 2, "titulo": "Compuerta de calidad", "desc": "Encadenar linter, pruebas unitarias, integración y validación del umbral del 80 %.", "cmd": "pytest --cov=app --cov-fail-under=80", "tip": "Si una prueba falla, el despliegue al servidor VPS se cancela de inmediato."},
        {"num": 3, "titulo": "Prueba posterior al despliegue", "desc": "Ejecutar curl a /health después del despliegue con reversión automática en caso de caída.", "cmd": "curl -f http://localhost:8000/health", "tip": "Asegura cero tiempo de inactividad y recuperación automática."},
    ])
    ruta = ".github/workflows/ci.yml"
    if os.path.exists(os.path.join(EJ_DIR, ruta)):
        agregar_codigo(doc, leer(EJ_DIR, ruta)[:3400])


def pre_commit_hooks(doc):
    doc.add_heading(
        "4.4.1 Tests para Git: enganches de pre-commit y detección de "
        "secretos",
        level=4,
    )
    doc.add_paragraph(
        "Los enganches de pre-commit ejecutan validaciones en el computador "
        "local antes de permitir el commit. Con Gitleaks bloquean la subida "
        "accidental de llaves API y con PyTest ejecutan pruebas unitarias "
        "rápidas (menos de 2 segundos)."
    )
    ruta = ".pre-commit-config.yaml"
    if os.path.exists(os.path.join(EJ_DIR, ruta)):
        agregar_codigo(doc, leer(EJ_DIR, ruta)[:2200])
