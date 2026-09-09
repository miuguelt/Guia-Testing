"""Sección 7: glosario de términos."""
from .estilos import tabla


def glosario(doc):
    doc.add_heading("7. GLOSARIO DE TÉRMINOS", level=1)
    tabla(
        doc,
        ["Término", "Definición"],
        [
            ["Bug", "Error en el comportamiento del software detectado en ejecución."],
            ["Cobertura de código", "Porcentaje de líneas o ramas ejecutadas por la suite de pruebas."],
            ["Calidad de software", "Grado de cumplimiento de los requisitos funcionales y de atributos (ISO/IEC 25010)."],
            ["CI/CD", "Integración y entrega continua: automatización del build, las pruebas y el despliegue."],
            ["Prueba unitaria", "Prueba aislada de la lógica pura sin dependencias externas, rápida y determinista."],
            ["Prueba de integración", "Prueba que valida la interacción de módulos, APIs y base de datos."],
            ["Prueba end-to-end (E2E)", "Prueba del flujo completo del usuario en navegador o red real."],
            ["Pirámide de pruebas", "Modelo que prioriza base amplia de pruebas unitarias sobre integración y E2E."],
            ["Plan de pruebas IEEE 829", "Documento que define alcance, estrategia y matriz de casos de prueba."],
            ["Quality Gate", "Compuerta de calidad que bloquea la fusión o el despliegue cuando la evidencia falla."],
            ["TDD", "Desarrollo guiado por pruebas: se escribe primero la prueba que falla antes de la implementación."],
            ["BDD", "Comportamiento guiado por historias: especificación con formato Dado, Cuando, Entonces."],
            ["Protocolo V.E.R.A.", "Verificar en documentos, Ejecutar con TDD, Revisar calidad y seguridad, Atribuir en bitácora."],
            ["Dato sintético", "Dato artificial generado con Faker para no exponer información real en las pruebas."],
            ["Trazabilidad", "Capacidad de rastrear un defecto desde la evidencia hasta el código que lo causó."],
        ],
        ancho_cm=[4.6, 11.8],
    )
    doc.add_page_break()
