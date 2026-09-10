"""Ruta AA12-AA16 para documentar y entregar las pruebas del proyecto."""

from .estilos import agregar_codigo, agregar_pasos, tabla


def ruta_documentacion_pruebas(doc):
    """Añade la ruta de producción y cierre del Portafolio de Evidencias."""
    doc.add_heading("4.5 Ruta AA12 a AA16 para documentar las pruebas", level=2)
    doc.add_paragraph(
        "Esta ruta convierte cada prueba en un artefacto verificable. El aprendiz "
        "trabaja sobre una versión identificada del proyecto, conserva los "
        "resultados reales y relaciona requisito, riesgo, caso, ejecución, "
        "defecto y decisión. Las plantillas son una adaptación didáctica de "
        "ISO/IEC/IEEE 29119-3:2021; no declaran conformidad normativa. El "
        "instructor confirma el formato y el instrumento institucional aplicable."
    )
    tabla(
        doc,
        ["Código", "Actividad", "Producto mínimo", "Criterio de cierre"],
        [
            ["AA12", "Realizar plan de pruebas", "Plan, alcance, riesgos y estrategia", "Cada requisito en alcance tiene criterio y riesgo."],
            ["AA13", "Definir casos de prueba", "Matriz de casos y pruebas automatizadas", "Los casos cubren éxito, error, límites y permisos."],
            ["AA14", "Definir ambiente de prueba", "Ficha del ambiente y datos sintéticos", "Otra persona puede reproducir la preparación."],
            ["AA15", "Realizar pruebas", "Registro de ejecución, reportes y defectos", "Cada resultado tiene comando, evidencia y estado."],
            ["AA16", "Documentar las pruebas", "Informe final y Portafolio de Evidencias", "La entrega es trazable, legible y verificable."],
        ],
        ancho_cm=[1.4, 3.8, 6.2, 5.0],
    )
    doc.add_paragraph("")

    agregar_pasos(
        doc,
        "AA12 Realizar plan de pruebas",
        [
            {"num": 1, "titulo": "Identificar el objeto de prueba", "desc": "Registra el nombre del sistema, versión o compromiso de Git, alcance, responsables, fecha y componentes que serán evaluados."},
            {"num": 2, "titulo": "Reunir requisitos y criterios", "desc": "Copia cada requisito funcional y no funcional con un identificador estable y escribe qué condición observable significa que está cumplido."},
            {"num": 3, "titulo": "Analizar riesgos", "desc": "Valora probabilidad e impacto, prioriza los riesgos críticos y define la prueba o control que reducirá cada uno."},
            {"num": 4, "titulo": "Definir la estrategia", "desc": "Selecciona niveles, tipos, técnicas, herramientas, roles, datos, dependencias, restricciones y orden de ejecución. Declara qué queda fuera del alcance."},
            {"num": 5, "titulo": "Fijar criterios de entrada y salida", "desc": "Especifica qué debe estar listo para comenzar y qué condiciones permiten cerrar: resultados, defectos críticos, cobertura acordada y riesgos residuales. No uses un porcentaje como garantía universal."},
            {"num": 6, "titulo": "Construir la trazabilidad", "desc": "Relaciona requisito, riesgo, caso de prueba, archivo de prueba, ejecución, defecto y evidencia. Revisa que no haya requisitos sin prueba ni pruebas sin propósito."},
            {"num": 7, "titulo": "Revisar y versionar", "desc": "Solicita revisión del instructor o del equipo, corrige observaciones y guarda el documento como docs/pruebas/01-plan-pruebas-29119-3.md."},
        ],
    )

    agregar_pasos(
        doc,
        "AA13 Definir casos de prueba",
        [
            {"num": 1, "titulo": "Derivar casos de cada requisito", "desc": "Incluye el flujo exitoso, entradas inválidas, límites, permisos, estados, duplicación o conflicto cuando sean riesgos del proyecto."},
            {"num": 2, "titulo": "Asignar un identificador", "desc": "Usa una nomenclatura estable, por ejemplo CP-001, y clasifica prioridad, nivel de prueba, técnica y requisito cubierto."},
            {"num": 3, "titulo": "Describir el caso completo", "desc": "Diligencia precondiciones, datos sintéticos, pasos, resultado esperado, oráculo, limpieza y evidencia que debe conservarse."},
            {"num": 4, "titulo": "Elegir la forma de ejecución", "desc": "Indica si será manual, unitaria, integración, contrato, E2E o no funcional; ubica el archivo automatizado y el comando que lo ejecuta."},
            {"num": 5, "titulo": "Revisar la matriz", "desc": "Elimina duplicados, identifica casos bloqueados y confirma que las aserciones comprueban resultados y efectos, no solo que el código se ejecutó. Guarda docs/pruebas/02-casos-prueba.md."},
        ],
    )

    agregar_pasos(
        doc,
        "AA14 Definir ambiente de prueba",
        [
            {"num": 1, "titulo": "Especificar requisitos técnicos", "desc": "Registra sistema operativo, versiones de lenguaje y dependencias, navegador, base de datos, servicios, red y recursos necesarios."},
            {"num": 2, "titulo": "Preparar un ambiente aislado", "desc": "Usa un entorno virtual, contenedor o configuración reproducible. Nunca utilices datos reales ni guardes secretos en el repositorio."},
            {"num": 3, "titulo": "Registrar configuración segura", "desc": "Documenta nombres de variables, archivos de configuración y valores de ejemplo; conserva las credenciales fuera del código y del informe."},
            {"num": 4, "titulo": "Crear y reiniciar datos de prueba", "desc": "Define datos sintéticos, usuarios por rol, estados iniciales, semillas y procedimiento de limpieza o reversión."},
            {"num": 5, "titulo": "Ejecutar una comprobación de humo", "desc": "Verifica instalación, salud del servicio, acceso a dependencias y un caso básico antes de interpretar fallos funcionales."},
            {"num": 6, "titulo": "Guardar la ficha del ambiente", "desc": "Conserva versiones, fecha, responsable, limitaciones y resultado de la comprobación en docs/pruebas/03-ambiente-prueba.md."},
        ],
    )

    agregar_pasos(
        doc,
        "AA15 Realizar pruebas",
        [
            {"num": 1, "titulo": "Congelar la versión evaluada", "desc": "Anota rama, compromiso de Git, fecha y cambios pendientes. Si la versión cambia, abre una nueva ejecución o explica la diferencia."},
            {"num": 2, "titulo": "Ejecutar por niveles", "desc": "Corre primero las pruebas unitarias, luego integración o contrato y finalmente los recorridos E2E y no funcionales que estén en alcance."},
            {"num": 3, "titulo": "Registrar el resultado real", "desc": "Para cada caso escribe aprobado, fallido o bloqueado, comando, fecha, duración, salida relevante, resultado esperado y resultado observado."},
            {"num": 4, "titulo": "Separar ambiente y producto", "desc": "Si falla la preparación, corrige el ambiente y repite. Si el entorno está correcto y el observado contradice el oráculo, registra un defecto reproducible."},
            {"num": 5, "titulo": "Corregir y repetir", "desc": "Conserva la evidencia del fallo, la corrección, la prueba de confirmación y la regresión de los casos relacionados. No borres una ejecución fallida."},
            {"num": 6, "titulo": "Conservar resultados", "desc": "Guarda el registro en docs/pruebas/04-registro-ejecuciones.md y los reportes, capturas, trazas o videos seleccionados bajo test-results/."},
        ],
    )

    agregar_pasos(
        doc,
        "AA16 Documentar las pruebas",
        [
            {"num": 1, "titulo": "Consolidar las métricas", "desc": "Resume casos planificados, ejecutados, aprobados, fallidos y bloqueados; cobertura interpretada, defectos por severidad y resultados por nivel."},
            {"num": 2, "titulo": "Documentar hallazgos y ausencia de hallazgos", "desc": "Cada defecto debe tener pasos, esperado, observado, severidad, prioridad, estado, responsable y evidencia. Si no hay defectos, declara el alcance probado y sus límites."},
            {"num": 3, "titulo": "Cerrar contra los criterios", "desc": "Concluye si se cumplen los criterios de salida, qué riesgos permanecen, qué no se probó y qué recomendación corresponde al responsable de la entrega."},
            {"num": 4, "titulo": "Armar el Portafolio de Evidencias", "desc": "Relaciona cada artefacto con su criterio, instrumento, enlace relativo y resultado. Completa el registro local y la bitácora docs/ai-log.md si utilizaste una herramienta de IA."},
            {"num": 5, "titulo": "Revisar la entrega", "desc": "Comprueba enlaces, nombres, versión, ortografía, ausencia de secretos, reproducibilidad de comandos y correspondencia entre el informe y los archivos reales."},
            {"num": 6, "titulo": "Empaquetar y entregar", "desc": "Genera docs/pruebas/06-informe-final-pruebas.md, incluye código de pruebas y evidencias necesarias, excluye credenciales y temporales, y entrega el paquete por el canal definido por el instructor."},
        ],
    )

    doc.add_heading("Estructura mínima del Portafolio de Evidencias", level=3)
    agregar_codigo(
        doc,
        "docs/pruebas/\n"
        "├── 01-plan-pruebas-29119-3.md\n"
        "├── 02-casos-prueba.md\n"
        "├── 03-ambiente-prueba.md\n"
        "├── 04-registro-ejecuciones.md\n"
        "├── 05-registro-defectos.md\n"
        "├── 06-informe-final-pruebas.md\n"
        "└── 07-matriz-trazabilidad.csv\n"
        "tests/                  # código automatizado por nivel\n"
        "test-results/           # reportes y evidencias reproducibles\n"
        "docs/ai-log.md          # apoyo de IA, verificación y decisión humana"
    )
    doc.add_heading("Lista de verificación antes de entregar", level=3)
    for item in [
        "El plan declara alcance, riesgos, estrategia, criterios de entrada y salida, ambiente y límites.",
        "Cada requisito en alcance tiene al menos un caso y cada caso tiene un resultado esperado comprobable.",
        "El ambiente se puede preparar con datos sintéticos sin revelar secretos ni datos personales.",
        "La ejecución conserva comandos, versión, resultado, reportes y defectos; los fallos no fueron ocultados.",
        "El informe identifica riesgos residuales, elementos no probados y la relación entre evidencia y criterio.",
        "La entrega contiene archivos editables, enlaces relativos funcionales, nombres estables y el formato solicitado por el instructor.",
    ]:
        doc.add_paragraph(item, style="List Bullet")
