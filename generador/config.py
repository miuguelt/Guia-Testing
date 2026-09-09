"""Datos de contexto de la adaptación didáctica (validar antes de entregar)."""
import os
from datetime import date

from docx.shared import RGBColor

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EJ_DIR = os.path.join(BASE_DIR, "recursos", "codigo-ejemplo")

REGIONAL = "Regional por diligenciar"
CENTRO = "Centro de formación por diligenciar"
PROGRAMA = "Análisis y Desarrollo de Software"
CODIGO_PROGRAMA = "228118"
PROYECTO_FORMATIVO = (
    "Construcción de software a la medida para gestionar inventario y calidad "
    "del sistema de información del proyecto formativo."
)
FASE_PROYECTO = "Evaluación"
ACTIVIDAD_PROYECTO = (
    "Verificar la calidad y funcionalidad de los entregables del sistema de "
    "información mediante pruebas automatizadas."
)
COMPETENCIA = (
    "Verificar los entregables del desarrollo de software de acuerdo con las "
    "especificaciones del diseño (código 220501098)."
)
RESULTADOS_APRENDIZAJE = [
    "Diseñar y ejecutar el plan de pruebas de software verificando el "
    "cumplimiento de los requisitos funcionales y no funcionales.",
    "Implementar y automatizar las pruebas unitarias, de integración y "
    "end-to-end del sistema de información según el plan de pruebas y los "
    "umbrales de cobertura establecidos (articulación).",
]
DURACION_TOTAL = "40 horas (10 de teoría y 30 de práctica)"
MODALIDAD = "Presencial apoyada en plataforma virtual"
VERSION = "3.0.0"
ELABORO = "Instructor — SENA ADSO"

FUENTE_NORMAL = "Calibri"
FUENTE_CODIGO = "Consolas"
GRIS = RGBColor(0x59, 0x59, 0x59)
AZUL = RGBColor(0x1F, 0x38, 0x64)
AZUL_CLARO = "D9E2F3"
GRIS_CLARO = "EDEDED"

MESES = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
]


def fecha_es_co(d=None):
    d = d or date.today()
    return f"{d.day} de {MESES[d.month - 1]} de {d.year}"
