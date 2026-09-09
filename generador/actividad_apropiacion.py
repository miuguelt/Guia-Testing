"""Actividad 4.3 de apropiación: automatización con TDD y BDD."""
from .estilos import agregar_componentes


def actividad_apropiacion(doc):
    doc.add_heading("4.3 Apropiación: automatización de pruebas con TDD y BDD", level=2)
    _proposito(doc)
    _reto(doc)
    from .apropiacion_pytest import pytest_fastapi, pytest_flask
    from .apropiacion_react import vitest_react
    from .apropiacion_java import junit_mockito
    from .apropiacion_metodologias import bdd_gherkin, tdd
    from .apropiacion_e2e import playwright_e2e
    pytest_fastapi(doc)
    pytest_flask(doc)
    vitest_react(doc)
    junit_mockito(doc)
    tdd(doc)
    bdd_gherkin(doc)
    playwright_e2e(doc)
    _componentes(doc)
    doc.add_page_break()


def _proposito(doc):
    doc.add_heading("Propósito", level=3)
    doc.add_paragraph(
        "Automatizar las pruebas del caso transversal con las cuatro "
        "plataformas del ecosistema (PyTest, Vitest/Jest, JUnit 5 y "
        "Playwright), aplicando TDD y BDD, hasta alcanzar una cobertura "
        "mínima del 80 % en la lógica de negocio."
    )


def _reto(doc):
    doc.add_heading("Reto", level=3)
    doc.add_paragraph(
        "Redactar primero las pruebas y después la implementación (rojo, "
        "verde, refactor): la suite debe poder ejecutarse en un entorno "
        "limpio con un solo comando y fallar con diagnóstico claro."
    )


def _componentes(doc):
    agregar_componentes(
        doc,
        [
            ("Ambiente requerido", "Aula de informática con computador, navegador y acceso a internet."),
            ("Estrategia o técnica didáctica activa", "Taller guiado, TDD, revisión por pares y simulación."),
            ("Materiales de formación", "Ecosistema de código de ejemplo y guía web 5 con simuladores."),
            ("Material de apoyo", "Ejemplos resueltos y lista de validación del paso a paso."),
            ("Evidencia de aprendizaje", "Suite automatizada con cobertura ≥ 80 % y bitácora del ciclo TDD."),
            ("Instrumento de evaluación", "Rúbrica de pruebas automatizadas."),
            ("Duración", "20 horas"),
        ],
    )
