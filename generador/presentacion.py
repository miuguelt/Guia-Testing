"""Sección 2: presentación, producto integrador y ruta de aprendizaje."""


def presentacion(doc):
    doc.add_heading("2. PRESENTACIÓN", level=1)
    doc.add_paragraph(
        "El desarrollo de software no termina cuando el código compila: "
        "termina cuando el sistema demuestra que hace lo que debe hacer y "
        "resiste las condiciones reales de uso. Esta guía cierra el ciclo del "
        "proyecto formativo entregando al aprendiz la caja de herramientas "
        "para VERIFICAR: pruebas unitarias, de integración y end-to-end, "
        "gestión de la cobertura, automatización en CI/CD y auditoría de la "
        "calidad."
    )
    doc.add_paragraph(
        "La calidad no es una fase final ni una responsabilidad de un "
        "especialista: es una práctica de equipo. Un defecto detectado en "
        "diseño cuesta una fracción de lo que cuesta en producción; los casos "
        "reales demuestran que una sola omisión puede hacer que un sistema "
        "funcione bien en el laboratorio y colapse en la operación."
    )
    doc.add_paragraph(
        "El caso transversal es el sistema de información de control de "
        "acceso y de inventario de equipos y elementos de almacén. Sobre ese "
        "entorno se trabajan los artefactos de las plataformas PyTest "
        "(FastAPI y Flask), Vitest/Jest (React), JUnit 5 & Mockito (Java) y "
        "Playwright (E2E), de modo que las mismas piezas que se probaron en "
        "las guías anteriores se validan ahora de forma automatizada."
    )
    doc.add_heading("Pregunta orientadora", level=2)
    doc.add_paragraph(
        "¿Cómo garantizar que el software construido entrega el valor "
        "esperado y que un defecto no detectado no lo derribe en producción? "
        "El caso de Knight Capital (2012) perdió 440 millones de dólares en "
        "45 minutos por código de prueba sin eliminar."
    )
    doc.add_heading("2.1 Producto integrador", level=2)
    doc.add_paragraph(
        "Registro integral de evidencias del plan de pruebas: plan de "
        "pruebas IEEE 829, suite automatizada con cobertura superior o igual "
        "al 80 % en la lógica de negocio, pipeline de CI/CD funcional y "
        "bitácora V.E.R.A. (Verificar en documentos, Ejecutar con TDD, "
        "Revisar calidad y seguridad, Atribuir en bitácora)."
    )
    doc.add_heading("2.2 Conocimientos previos", level=2)
    for item in [
        "Fundamentos de programación en al menos un lenguaje del ecosistema "
        "(Python, JavaScript o Java).",
        "Conceptos de HTTP, APIs REST y bases de datos.",
        "Uso básico de Git y repositorios remotos.",
        "Estructura de proyectos web y de microservicios.",
    ]:
        doc.add_paragraph(item, style="List Bullet")
    doc.add_heading("2.3 Ruta de aprendizaje", level=2)
    for item in [
        "Reflexionar sobre el costo de los defectos no detectados.",
        "Comprender la pirámide de pruebas y el flujo lógico de 7 fases.",
        "Escribir pruebas unitarias con TDD y validar cobertura.",
        "Probar APIs, componentes y flujos completos (E2E).",
        "Integrar la calidad en el pipeline CI/CD y en Git.",
        "Auditar la calidad y la seguridad antes de desplegar.",
    ]:
        doc.add_paragraph(item, style="List Bullet")
    doc.add_heading("Uso responsable de las herramientas de apoyo (incluida la IA)", level=2)
    doc.add_paragraph(
        "Las herramientas de IA pueden recuperar la competencia y los "
        "resultados oficiales, proponer listas de chequeo, detectar vacíos "
        "entre actividad-evidencia-criterio y generar pruebas de referencia. "
        "No sustituyen la ejecución real de la suite ni la verificación "
        "humana de los resultados. Esta guía incorpora además el sistema "
        "qa_auditor, que detecta anomalías del código generado con IA: "
        "pruebas vacías, imports alucinados y vulnerabilidades OWASP."
    )
    doc.add_page_break()
