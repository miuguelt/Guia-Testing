"""Actividad 4.1 de reflexión inicial: el bug de 440 millones de dólares."""
import os

from .config import EJ_DIR
from .estilos import agregar_codigo, agregar_componentes, leer


def actividad_reflexion(doc):
    doc.add_heading("4.1 Reflexión inicial: el bug de 440 millones de dólares", level=2)
    _proposito(doc)
    _reto(doc)
    _pensamiento_inicial(doc)
    _cierre(doc)
    _componentes(doc)
    doc.add_page_break()


def _proposito(doc):
    doc.add_heading("Propósito", level=3)
    doc.add_paragraph(
        "Reconocer el costo humano, económico y reputacional de publicar "
        "software sin verificar su comportamiento, y valorar la prueba "
        "automatizada como una inversión y no como un costo."
    )


def _reto(doc):
    doc.add_heading("Reto", level=3)
    doc.add_paragraph(
        "Knight Capital, el 1 de agosto de 2012, ejecutó un algoritmo de "
        "trading con código de prueba no eliminado (SMBAT): tomó posiciones "
        "erróneas cada pocos segundos durante 45 minutos y perdió 440 "
        "millones de dólares. Un código de prueba de la propia campaña "
        "convirtió un sistema rentable en una ruleta. ¿Qué falló en las "
        "verificaciones previas al despliegue?"
    )


def _pensamiento_inicial(doc):
    doc.add_heading("Pensamiento inicial", level=3)
    for item in [
        "¿Qué tipo de defecto pudo detectar una prueba automatizada y por "
        "qué no existía?",
        "¿Quién tomó la decisión de desplegar y con qué evidencia?",
        "¿Qué se habría automatizado para detener el despliegue en cinco "
        "segundos?",
    ]:
        doc.add_paragraph(item, style="List Number")


def _cierre(doc):
    doc.add_heading("Cierre de la reflexión", level=3)
    doc.add_paragraph(
        "Cada equipo redacta una conclusión de máximo 120 palabras. Debe "
        "explicar, con evidencia del caso, por qué la calidad verificada "
        "cuesta menos que la calidad asumida. Los comandos que se muestran a "
        "continuación son un punto de partida del laboratorio."
    )
    ruta = "tests/conftest.py"
    if os.path.exists(os.path.join(EJ_DIR, ruta)):
        agregar_codigo(doc, leer(EJ_DIR, ruta)[:2000])
    else:
        agregar_codigo(doc, "# Ver recursos/codigo-ejemplo/tests/conftest.py")


def _componentes(doc):
    agregar_componentes(
        doc,
        [
            ("Ambiente requerido", "Aula con computador y proyector, o ambiente virtual colaborativo."),
            ("Estrategia o técnica didáctica activa", "Aprendizaje basado en problemas y conversación guiada."),
            ("Materiales de formación", "Caso impreso o digital y notas adhesivas."),
            ("Material de apoyo", "Guía web 5, módulo de reflexión del bug de 440 millones."),
            ("Evidencia de aprendizaje", "Respuesta argumentada al caso y matriz de pruebas del ecosistema."),
            ("Instrumento de evaluación", "Lista de chequeo de participación y argumentación."),
            ("Duración", "4 horas"),
        ],
    )
