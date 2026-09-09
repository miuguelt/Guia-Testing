"""Bloques 4.3.5 y 4.3.6: TDD (rojo-verde-refactor) y BDD con Gherkin."""
from .estilos import agregar_pasos


def tdd(doc):
    doc.add_heading("4.3.5 Metodología TDD: ciclo rojo, verde, refactor", level=3)
    doc.add_paragraph(
        "El ciclo fundamental de TDD consiste en 3 pasos iterativos cortos "
        "(menos de 5 minutos):"
    )
    for item in [
        "ROJO: escribir una prueba unitaria pequeña que falle antes de "
        "escribir el código de producción.",
        "VERDE: escribir la implementación mínima para hacer pasar la prueba.",
        "REFACTOR: limpiar el código y eliminar la duplicación manteniendo "
        "la prueba en verde.",
    ]:
        doc.add_paragraph(item, style="List Number")


def bdd_gherkin(doc):
    doc.add_heading("4.3.6 BDD con Behave y Gherkin", level=3)
    doc.add_paragraph(
        "La especificación por comportamiento conecta al equipo de negocio "
        "con el equipo técnico: cada escenario se lee como una historia que "
        "se escribe con la estructura Dado, Cuando, Entonces."
    )
    agregar_pasos(doc, "Paso a paso para BDD:", [
        {"num": 1, "titulo": "Instalación", "desc": "Instalar behave y crear las carpetas features/ y features/steps/.", "cmd": "pip install behave requests", "tip": "Gherkin conecta al equipo de negocio con el equipo técnico."},
        {"num": 2, "titulo": "Escenario", "desc": "Redactar el archivo .feature con estructura Given, When, Then.", "cmd": "behave features/", "tip": "Usa Scenario Outline para probar tablas de combinaciones."},
        {"num": 3, "titulo": "Pasos en Python", "desc": "Implementar las funciones con @given, @when, @then pasando datos por context.", "cmd": "behave", "tip": "context.response almacena las respuestas entre los pasos."},
    ])
