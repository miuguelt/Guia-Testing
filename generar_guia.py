"""
Generador de la adaptación didáctica de la Guía de Aprendizaje SENA —
Testing & QA (DOCX), con enseñanza por proyectos.

Punto de entrada; el contenido vive en el paquete generador/ (una
capacidad por archivo). Los datos de contexto se editan en
generador/config.py. Los fragmentos de código se leen de
recursos/codigo-ejemplo/ (SSoT).
"""
import json
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


def sincronizar_registro_web():
    """Publica el registro único que consume la guía web y el documento."""
    registro_path = os.path.join(BASE_DIR, "deliverables.registry.json")
    web_registro_path = os.path.join(BASE_DIR, "web", "deliverables.registry.json")
    js_registro_path = os.path.join(BASE_DIR, "web", "js", "deliverables-registry.js")
    with open(registro_path, "r", encoding="utf-8") as archivo:
        registro = json.load(archivo)
    contenido = json.dumps(registro, ensure_ascii=False, indent=2) + "\n"
    with open(web_registro_path, "w", encoding="utf-8", newline="\n") as archivo:
        archivo.write(contenido)
    with open(js_registro_path, "w", encoding="utf-8", newline="\n") as archivo:
        archivo.write("// Registro derivado de deliverables.registry.json. No editar manualmente.\n")
        archivo.write("window.GUIDE_DELIVERABLES = ")
        archivo.write(contenido.rstrip())
        archivo.write(";\n")


def generar():
    sincronizar_registro_web()
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
