"""Sección 6: ambientes de aprendizaje."""
from .estilos import tabla


def ambientes(doc):
    doc.add_heading("6. AMBIENTES DE APRENDIZAJE", level=1)
    doc.add_paragraph(
        "La guía se desarrolla en ambientes presenciales y virtuales con "
        "acceso al ecosistema de código y a la plataforma interactiva."
    )
    tabla(
        doc,
        ["Ambiente", "Recursos físicos", "Recursos tecnológicos", "Recursos digitales"],
        [
            [
                "Aula de informática / laboratorio de sistemas",
                "Computadores, tablero, video proyector.",
                "Python 3.11+, Node.js 20+, JDK 17, venv y gestores de paquetes.",
                "Plataforma interactiva de la guía (módulos y simuladores), repositorio GitHub y GitHub Actions.",
            ],
            [
                "Plataforma virtual de aprendizaje",
                "Puesto de trabajo con conexión a internet.",
                "Navegador web actualizado.",
                "Guía web, foros, entrega de evidencias y rúbricas.",
            ],
            [
                "Entorno de trabajo autónomo",
                "Computador propio.",
                "Python, Node.js, JDK y Docker (opcional).",
                "Recursos de la guía, videos y actividades de refuerzo.",
            ],
        ],
        ancho_cm=[3.4, 3.4, 4.2, 5.6],
    )
    doc.add_page_break()
