"""Secciones 9 y 10: control del documento y control de cambios."""
from .config import ELABORO, VERSION, fecha_es_co
from .estilos import tabla


def controles(doc):
    doc.add_heading("9. CONTROL DEL DOCUMENTO", level=1)
    tabla(
        doc,
        ["Rol", "Nombre", "Cargo", "Dependencia", "Fecha"],
        [
            ["Autor(es)", ELABORO, "Instructor", "Centro de formación / coordinación académica", fecha_es_co()],
            ["Revisó", "Por diligenciar", "Coordinador académico", "Centro de formación", "Por diligenciar"],
            ["Aprobó", "Por diligenciar", "Responsable del programa ADSO", "Centro de formación", "Por diligenciar"],
        ],
        ancho_cm=[2.4, 4.0, 3.6, 4.6, 2.6],
    )
    doc.add_paragraph("")
    doc.add_heading("10. CONTROL DE CAMBIOS", level=1)
    tabla(
        doc,
        ["Rol", "Nombre", "Cargo", "Dependencia", "Fecha", "Razón del cambio"],
        [
            [
                "Autor(es)",
                ELABORO,
                "Instructor",
                "Centro de formación",
                fecha_es_co(),
                f"Ajuste al formato institucional GFPI-F-135 (versión "
                f"{VERSION}): enseñanza por proyectos, secuencia "
                "reflexión-apropiación, evidencias y evaluación, ambientes, "
                "glosario y ortografía es-CO.",
            ],
        ],
        ancho_cm=[2.2, 3.6, 2.6, 3.2, 2.4, 4.6],
    )
