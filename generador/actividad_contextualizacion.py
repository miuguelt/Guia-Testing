"""Actividad 4.2 de contextualización: pirámide de pruebas y 7 fases."""
from .estilos import agregar_componentes, tabla


def actividad_contextualizacion(doc):
    doc.add_heading(
        "4.2 Contextualización: pirámide de pruebas y Flujo Lógico Maestro "
        "de 7 Fases",
        level=2,
    )
    _proposito(doc)
    _reto(doc)
    _piramide(doc)
    _procedimiento(doc)
    _componentes(doc)
    doc.add_page_break()


def _proposito(doc):
    doc.add_heading("Propósito", level=3)
    doc.add_paragraph(
        "Construir el vocabulario y el modelo mental para decidir qué "
        "probar, con qué herramienta y en qué momento, según la pirámide de "
        "pruebas (70 % unitarias, 20 % integración, 10 % end-to-end)."
    )


def _reto(doc):
    doc.add_heading("Reto", level=3)
    doc.add_paragraph(
        "Explicar con un ejemplo real por qué una prueba end-to-end no "
        "reemplaza una prueba unitaria, y qué costos asume un equipo que "
        "invierte la proporción."
    )


def _piramide(doc):
    doc.add_heading("Pirámide de pruebas", level=3)
    doc.add_paragraph(
        "Para avanzar rápidamente en cualquier proyecto de software, el "
        "aprendiz debe abordar las pruebas de la base a la cúspide: 70 % "
        "unitarias, 20 % de integración y 10 % end-to-end."
    )
    tabla(
        doc,
        ["Fase", "Nivel", "Herramientas", "Objetivo técnico"],
        [
            ["1. Arnés", "Configuración", "venv, npm, pom.xml", "Aislar dependencias y armar el directorio tests/"],
            ["2. Dominio (70 %)", "Unitarias", "PyTest, Vitest, JUnit 5", "Lógica pura, cálculos y modelos en menos de 5 ms"],
            ["3. Integración (20 %)", "API y BD", "TestClient, MockMvc", "Endpoints HTTP y base de datos de prueba limpia"],
            ["4. Componentes", "Frontend UI", "React Testing Library", "DOM virtual y accesibilidad con getByRole"],
            ["5. E2E (10 %)", "Cúspide", "Playwright", "Caminos dorados en navegador real headless"],
            ["6. Cobertura", "Calidad", "pytest-cov, JaCoCo, qa_auditor", "Validar cobertura ≥ 80 % y OWASP SAST"],
            ["7. CI/CD", "Automatización", "GitHub Actions", "Compuerta de calidad en cada push antes de tocar el VPS"],
        ],
        ancho_cm=[3.4, 3.0, 4.4, 5.6],
    )


def _procedimiento(doc):
    doc.add_heading("Procedimiento", level=3)
    for item in [
        "Clasificar diez ejemplos de prueba como unitaria, de integración o "
        "end-to-end.",
        "Justificar los porcentajes de la pirámide en términos de velocidad y "
        "confiabilidad.",
        "Asociar cada una de las 7 fases con su herramienta y su objetivo.",
        "Completar el simulador de la pirámide de la guía web.",
    ]:
        doc.add_paragraph(item, style="List Number")


def _componentes(doc):
    agregar_componentes(
        doc,
        [
            ("Ambiente requerido", "Aula de informática con navegador y guía web interactiva."),
            ("Estrategia o técnica didáctica activa", "Exposición dialogada y aprendizaje colaborativo."),
            ("Materiales de formación", "Tabla de fases, fichas de conceptos y ejemplos del caso transversal."),
            ("Material de apoyo", "Guía web 5, sección «Pirámide de pruebas» y simulador."),
            ("Evidencia de aprendizaje", "Cuestionario de conceptos y tabla de fases resuelta."),
            ("Instrumento de evaluación", "Cuestionario y lista de chequeo del modelo."),
            ("Duración", "6 horas"),
        ],
    )
