"""
Generador de la Guía de Aprendizaje SENA — Testing & QA (DOCX).
Formato institucional GFPI-F-135 (Proceso de Gestión de Formación
Profesional Integral) con enseñanza por proyectos.

Punto de entrada; el contenido vive en el paquete generador/ (una
capacidad por archivo). Los datos institucionales se editan en
generador/config.py. Los fragmentos de código se leen de
recursos/codigo-ejemplo/ (SSoT).
"""
import os

from docx import Document

from generador.actividades import formulacion_actividades
from generador.ambientes import ambientes
from generador.bibliografia import bibliografia
from generador.config import BASE_DIR
from generador.controles import controles
from generador.estilos import agregar_campo_pagina, configurar_estilos
from generador.evidencias import evidencias
from generador.glosario import glosario
from generador.identificacion import identificacion
from generador.portada import portada
from generador.presentacion import presentacion
from generador.proyecto_formativo import proyecto_formativo


def generar():
    doc = Document()
    configurar_estilos(doc)
    agregar_campo_pagina(doc)
    portada(doc)
    identificacion(doc)
    presentacion(doc)
    proyecto_formativo(doc)
    formulacion_actividades(doc)
    evidencias(doc)
    ambientes(doc)
    glosario(doc)
    bibliografia(doc)
    controles(doc)
    ruta = os.path.join(BASE_DIR, "Guia_Aprendizaje_Testing.docx")
    doc.save(ruta)
    print(f"Documento generado: {ruta}")
    return ruta


if __name__ == "__main__":
    generar()
