"""Sección 4: formulación de las actividades de aprendizaje (secuencia SENA)."""
from .estilos import tabla


def formulacion_actividades(doc):
    doc.add_heading("4. FORMULACIÓN DE LAS ACTIVIDADES DE APRENDIZAJE", level=1)
    doc.add_paragraph(
        "Las actividades siguen la secuencia SENA de reflexión, "
        "contextualización, apropiación y transferencia. El aprendiz debe "
        "conservar versiones, fuentes y retroalimentación en su registro de "
        "evidencias."
    )
    tabla(
        doc,
        ["Actividad", "Fase de la secuencia", "Duración", "Evidencia esperada"],
        [
            ["4.1 El bug de 440 millones", "Reflexión inicial", "4 horas", "Respuesta argumentada al caso"],
            ["4.2 Pirámide de pruebas y flujo de 7 fases", "Contextualización", "6 horas", "Cuestionario y tabla de fases"],
            ["4.3 PyTest, Vitest, JUnit 5 y Playwright con TDD/BDD", "Apropiación", "20 horas", "Suite automatizada y cobertura ≥ 80 %"],
            ["4.4 Pipeline QA y auditoría del proyecto", "Transferencia", "10 horas", "Registro integral de evidencias"],
        ],
        ancho_cm=[7.2, 3.4, 1.9, 4.0],
    )
    doc.add_paragraph("")
    from .actividad_reflexion import actividad_reflexion
    from .actividad_contextualizacion import actividad_contextualizacion
    from .actividad_apropiacion import actividad_apropiacion
    from .actividad_transferencia import actividad_transferencia
    from .actividad_documentacion import ruta_documentacion_pruebas
    actividad_reflexion(doc)
    actividad_contextualizacion(doc)
    actividad_apropiacion(doc)
    actividad_transferencia(doc)
    ruta_documentacion_pruebas(doc)
