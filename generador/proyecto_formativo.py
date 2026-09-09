"""Sección 3: proyecto formativo y énfasis en enseñanza por proyectos."""
from .estilos import tabla


def proyecto_formativo(doc):
    doc.add_heading("3. PROYECTO FORMATIVO Y ENSEÑANZA POR PROYECTOS", level=1)
    doc.add_paragraph(
        "La guía se desarrolla con la estrategia de aprendizaje por "
        "proyectos: todo ejercicio de prueba nace de un entregable real del "
        "proyecto formativo y termina como evidencia verificable. El aprendiz "
        "trabaja sobre el sistema de información del caso transversal y debe "
        "sostener sus afirmaciones con ejecuciones reales (capturas de "
        "comando y reportes generados por las herramientas)."
    )
    tabla(
        doc,
        ["Fase del proyecto", "Etapa del proyecto", "Entregable", "Criterio de éxito"],
        [
            [
                "Evaluación",
                "Plan de pruebas",
                "Plan de pruebas IEEE 829 (ART-TEST-01)",
                "Define alcance, estrategia y matriz de casos de prueba.",
            ],
            [
                "Evaluación",
                "Automatización",
                "Suite de pruebas automatizadas (ART-TEST-02)",
                "Pruebas unitarias, de integración y E2E con cobertura ≥ 80 %.",
            ],
            [
                "Evaluación",
                "Reporte y trazabilidad",
                "Automatización E2E y registro de defectos (ART-TEST-03)",
                "Ejecuta flujos Playwright y clasifica defectos con evidencia.",
            ],
        ],
        ancho_cm=[2.6, 3.2, 5.4, 5.4],
    )
    doc.add_page_break()
