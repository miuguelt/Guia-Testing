"""Sección 5: evidencias de aprendizaje y evaluación formativa."""
from .estilos import tabla


def evidencias(doc):
    doc.add_heading(
        "5. PLANTEAMIENTO DE EVIDENCIAS DE APRENDIZAJE PARA LA EVALUACIÓN",
        level=1,
    )
    doc.add_paragraph(
        "La evaluación es formativa: la retroalimentación debe señalar "
        "evidencia, criterio afectado y acción de mejora. El juicio final "
        "considera conocimiento, desempeño y producto; completar una "
        "actividad interactiva no reemplaza la verificación del entregable."
    )
    _matriz(doc)
    _criterios(doc)
    _rubrica(doc)
    _reglas_entrega(doc)
    doc.add_page_break()


def _matriz(doc):
    tabla(
        doc,
        [
            "Fase del proyecto formativo",
            "Actividad de aprendizaje",
            "Evidencias de aprendizaje",
            "Criterios de evaluación",
            "Técnicas e instrumentos",
        ],
        [
            [
                "Evaluación",
                "4.2 Contextualización",
                "Conocimiento: cuestionario y explicación de la pirámide de pruebas.",
                "Diferencia pruebas unitarias, de integración y end-to-end, y justifica sus proporciones.",
                "Cuestionario y preguntas de comprensión.",
            ],
            [
                "Evaluación",
                "4.3 Apropiación",
                "Desempeño: construcción y ejecución de la suite automatizada con TDD.",
                "Aplica el ciclo rojo, verde, refactor y mide la cobertura con ≥ 80 %.",
                "Observación directa y rúbrica de pruebas automatizadas.",
            ],
            [
                "Evaluación",
                "4.4 Transferencia",
                "Producto: registro integral de evidencias con plan de pruebas y pipeline.",
                "El informe es trazable, verificable y útil para la entrega del proyecto.",
                "Rúbrica analítica de producto y sustentación.",
            ],
        ],
        ancho_cm=[2.6, 2.8, 3.8, 3.6, 3.4],
    )
    doc.add_paragraph("")


def _criterios(doc):
    doc.add_heading("5.1 Criterios de evaluación aplicados", level=2)
    for item in [
        "Identifica los tipos de prueba de acuerdo con la pirámide de "
        "testing y sus criterios de aceptación.",
        "Ejecuta pruebas automatizadas unitarias, de integración y "
        "end-to-end siguiendo una metodología establecida.",
        "Aplica el ciclo TDD y la especificación BDD en funcionalidades del "
        "proyecto formativo.",
        "Integra la calidad en el pipeline CI/CD y en las reglas de "
        "protección de la rama principal.",
        "Documenta el plan de pruebas (IEEE 829) y sustenta los hallazgos "
        "con evidencia real.",
        "Detecta ausencia de niveles de cobertura y usa auditorías "
        "estáticas para identificar vulnerabilidades.",
    ]:
        doc.add_paragraph(item, style="List Number")


def _rubrica(doc):
    doc.add_heading("5.2 Rúbrica analítica de aceptación", level=2)
    doc.add_paragraph(
        "Para cada criterio el instructor registra: Cumple, Cumple "
        "parcialmente o Aún no cumple, acompañado de una observación "
        "verificable y una acción de mejora."
    )
    tabla(
        doc,
        ["Criterio", "Indicador observable", "Carácter"],
        [
            ["Plan de pruebas (IEEE 829)", "Alcance, estrategia y matriz de casos definidos antes de codificar la suite.", "Esencial"],
            ["Cobertura ≥ 80 %", "La lógica de negocio alcanza el umbral y el reporte lo demuestra.", "Esencial"],
            ["TDD rojo, verde, refactor", "Las pruebas se escribieron antes que la implementación y hay bitácora del ciclo.", "Esencial"],
            ["Pipeline CI/CD", "La compuerta de bloqueo funciona en un repositorio real y se evidencia con una captura.", "Esencial"],
            ["Pruebas end-to-end", "Los caminos dorados se ejecutan en navegador real y quedan trazas de los fallos.", "Esencial"],
            ["Calidad y seguridad", "La auditoría detecta anomalías del código y no hay secretos en el repositorio.", "Esencial"],
            ["Comunicación", "El registro integral es claro, legible y puede explicarse con vocabulario técnico.", "Complementario"],
            ["Uso ético de la IA", "Registra el apoyo de herramientas de IA y verifica con evidencia cada resultado.", "Complementario"],
        ],
        ancho_cm=[4.6, 9.2, 2.6],
    )
    doc.add_paragraph("")


def _reglas_entrega(doc):
    doc.add_heading("5.3 Reglas de entrega", level=2)
    for item in [
        "Usar nombres de archivo estables: G05a_ApellidoNombre_Artefacto_vNN.",
        "Entregar archivos editables y una versión de consulta cuando aplique.",
        "Citar fuentes, diferenciar el contenido propio y registrar el apoyo "
        "de herramientas de IA.",
        "No incluir datos personales, credenciales ni información sensible "
        "sin autorización.",
        "Aplicar la retroalimentación y conservar el historial de versiones.",
    ]:
        doc.add_paragraph(item, style="List Bullet")
