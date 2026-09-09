"""Actividad 4.4 de transferencia: pipeline QA y auditoría del proyecto."""
from .estilos import agregar_componentes


def actividad_transferencia(doc):
    doc.add_heading("4.4 Transferencia: pipeline QA y auditoría del proyecto", level=2)
    _proposito(doc)
    _reto(doc)
    from .transferencia_cicd import cicd_y_git, cobertura, pre_commit_hooks
    from .transferencia_calidad import observabilidad, qa_auditor
    cobertura(doc)
    cicd_y_git(doc)
    pre_commit_hooks(doc)
    qa_auditor(doc)
    observabilidad(doc)
    _componentes(doc)
    doc.add_page_break()


def _proposito(doc):
    doc.add_heading("Propósito", level=3)
    doc.add_paragraph(
        "Integrar la calidad en el ciclo de vida del proyecto: compuertas en "
        "GitHub Actions, auditoría multidimensional del código (incluido el "
        "generado con IA) y observabilidad post-despliegue."
    )


def _reto(doc):
    doc.add_heading("Reto", level=3)
    doc.add_paragraph(
        "Convertir la suite de la actividad 4.3, de un conjunto de pruebas "
        "en el computador, a una compuerta de calidad que impide fusionar "
        "código defectuoso en la rama principal."
    )


def _componentes(doc):
    agregar_componentes(
        doc,
        [
            ("Ambiente requerido", "Aula de informática con repositorio remoto y plataforma virtual."),
            ("Estrategia o técnica didáctica activa", "Aprendizaje por proyectos, trabajo colaborativo y sustentación."),
            ("Materiales de formación", "Repositorio GitHub, GitHub Actions, qa_auditor y recursos de observabilidad."),
            ("Material de apoyo", "Guía web 5, ejemplo resuelto y acompañamiento del instructor."),
            ("Evidencia de aprendizaje", "Registro integral de evidencias y sustentación del pipeline."),
            ("Instrumento de evaluación", "Rúbrica analítica de producto y lista de chequeo de desempeño."),
            ("Duración", "10 horas"),
        ],
    )
