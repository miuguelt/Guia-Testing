// Estación 12/18: gestión de defectos. Contenido declarativo cargado antes del renderizador.
window.MODULES["m-defectos"] = {
    title: "Gestión de defectos: del hallazgo al cierre",
    badge: "Estación 12/18 · Defectos",
    intro: "Encontrar un defecto es solo la mitad del trabajo: la otra mitad es comunicarlo de forma que alguien pueda actuar, seguirlo hasta su corrección y conservar la evidencia de que quedó resuelto. Esta estación te da el ciclo de vida completo, una escala de severidad × prioridad honesta y una práctica real con GitHub Issues.",
    blocks: [
        {
            type: "definition",
            title: "Modelo mental: defecto, severidad y prioridad no son lo mismo",
            intro: "Tres palabras que se confunden constantemente; sepáralas antes de reportar.",
            pieces: [
                {
                    letter: "🐛", term: "Defecto", translation: "Problema en el producto de trabajo",
                    meaning: "Una condición incorrecta en requisito, diseño, código o configuración que puede manifestarse como fallo observable al ejecutar.",
                    analogy: "Como una pieza mal cortada en un mueble: está mal desde la fábrica, aunque no siempre se note al armarlo.",
                    example: "La comparación cantidad <= 6 cuando la regla acordada es máximo 5."
                },
                {
                    letter: "🌡️", term: "Severidad", translation: "Qué tan grave es el efecto",
                    meaning: "La magnitud del impacto del defecto cuando se manifiesta: qué tan dañino es, medido en el producto y en las personas afectadas.",
                    analogy: "Como la escala de un sismo: mide la fuerza del evento, no la rapidez con que llegan los socorros.",
                    example: "Aceptar préstamos de 6 equipos es de severidad alta: incumple la regla central del negocio."
                },
                {
                    letter: "📅", term: "Prioridad", translation: "Cuándo conviene corregirlo",
                    meaning: "El orden en que el equipo decide atender el defecto, ponderando severidad, frecuencia, exposición, costo de corrección y fechas de entrega.",
                    analogy: "Como decidir qué fila atiendes primero en una farmacia: no siempre es la persona más grave, sino quien necesita atención antes de que empeore.",
                    example: "Un typo en la portada (severidad baja) puede ser prioridad alta si la entrega es hoy; un borde visual raro (severidad baja) puede esperar."
                }
            ]
        },
        {
            type: "diagram", diagramType: "state-machine",
            title: "Ciclo de vida del defecto: los estados y sus transiciones",
            states: [
                { name: "Nuevo", desc: "Hallazgo registrado, aún pendiente de confirmar." },
                { name: "Abierto", desc: "Defecto confirmado, con severidad, prioridad y responsable." },
                { name: "Corregido", desc: "Cambio integrado y enlazado a un commit." },
                { name: "Retest", desc: "Confirmación del caso original y regresión relacionada." },
                { name: "Cerrado", desc: "La evidencia confirma la corrección." },
                { name: "Reabierto", desc: "El retest falla y devuelve el caso a Abierto con contexto." }
            ],
            body: "Nuevo -> Abierto -> Corregido -> Retest -> Cerrado. De Retest también puede volver a Abierto como Reabierto si persiste. Desde Abierto existen resoluciones alternativas que cierran sin corrección: Duplicado (ya reportado) o No es defecto (comportamiento correcto según el oráculo). Cada flecha es una decisión con responsable y fecha, no solo un cambio de etiqueta."
        },
        {
            type: "steps", title: "Qué ocurre en cada estado (y qué evidencia exige)",
            steps: [
                { title: "Nuevo", desc: "Alguien registra el hallazgo con comportamiento observado, pasos, esperado y entorno. Aún nadie lo validó: puede ser defecto, error de prueba o malentendido del requisito.", tip: "Un reporte de calidad acorta este estado: con reproducción clara, el análisis es rápido." },
                { title: "Abierto", desc: "Un responsable confirma que es un defecto real, le asigna severidad y prioridad, y lo programa. Si la investigación muestra que el comportamiento es correcto según el oráculo, se resuelve como No es defecto con explicación; si ya existía, como Duplicado enlazando al original.", pitfall: "Cerrar como «no es defecto» sin citar el oráculo deja al reportante sin aprendizaje y el malentendido reaparece." },
                { title: "Corregido", desc: "El cambio está implementado y disponible en la rama acordada, con commit que referencia el identificador del defecto (por ejemplo «Closes #12»). La corrección aún no está verificada por quien prueba.", tip: "Quien corrige no debería ser quien certifica el retest: el sesgo de confirmación es real." },
                { title: "Retest", desc: "Se repite el caso original (prueba de confirmación) y se ejecutan casos relacionados (regresión) para detectar efectos colaterales. Ambas evidencias se conservan: la corrección del caso aislado no basta.", command: "pytest tests/test_routes.py::test_rechaza_cantidad_superior -v" },
                { title: "Cerrado / Reabierto", desc: "Si el caso de confirmación y la regresión pasan, se cierra con evidencia enlazada. Si el fallo persiste o aparece uno nuevo en el mismo flujo, se reabre volviendo a Abierto con el contexto acumulado: qué se intentó, qué falló y qué se descarta.", pitfall: "Cerrar con «en mi máquina pasó» sin evidencia del entorno acordado convierte el ciclo en una lotería." }
            ]
        },
        {
            type: "case-study",
            title: "Caso Práctico Paso a Paso: Gestión Completa del Defecto DEF-01: De GitHub Issue a Commit y Retest",
            context: "Durante la ejecución del caso de prueba CP-05 (solicitud con cantidad = 6 y aprendiz activo), el sistema responde 201 Created y descuenta 6 unidades de inventario, violando la regla R-CANT. Se debe registrar el defecto DEF-01 en GitHub Issues, clasificar severidad y prioridad, aplicar el commit correctivo y certificar el cierre tras el retest.",
            preconditions: [
                "Requisito R-CANT: 'El aprendiz sólo puede solicitar entre 1 y 5 equipos por préstamo'.",
                "Caso de prueba CP-05 ejecutado manualmente o en suite con resultado fallido.",
                "Repositorio Git con plantilla de GitHub Issues activa y rama de corrección 'fix/def-01-rcant'."
            ],
            code: `### 🐛 Reporte de Defecto en GitHub Issues

**Título:** [Préstamos] Solicitud con 6 equipos se aprueba y descuenta inventario (viola R-CANT)
**ID:** DEF-01 | **Severidad:** Alta | **Prioridad:** Alta (Bloqueante de entrega)
**Trazabilidad:** Requisito R-CANT ➔ Caso de Prueba CP-05 ➔ Defecto DEF-01

**Pasos para reproducir:**
1. Iniciar sesión con rol Aprendiz (aprendiz@sena.edu.co).
2. Navegar a /prestamos/nuevo.
3. Seleccionar equipo 'Portátil Dell Latitude'.
4. Ingresar cantidad 6 (valor frontera inválido superior).
5. Hacer clic en 'Confirmar Solicitud'.

**Resultado Esperado (Oráculo):**
El sistema debe rechazar la solicitud con código 422 o mensaje 'La cantidad permitida es de 1 a 5 equipos' y NO crear registros en base de datos.

**Resultado Observado:**
El sistema responde HTTP 201 Created, genera la solicitud #849 por 6 equipos y descuenta el stock disponible de 10 a 4 unidades.

---
### 🛠️ Commit de Corrección y Cierre Automático:
git commit -m "fix(prestamos): valida cantidad maxima de 5 equipos segun R-CANT (Closes #1)"`,
            command: "pytest tests/test_routes.py::test_rechaza_cantidad_superior -v",
            oracle: "Al repetir CP-05 tras el fix, el sistema debe responder 422 Unprocessable Entity. El retest pasa a VERDE, el issue #1 pasa a estado 'Closed' y la suite de regresión completa (CP-01 a CP-06) pasa al 100%.",
            expectedVsObserved: [
                ["Ejecución de CP-05 antes del fix", "HTTP 201 Created (6 laptops descontadas)", "DEFECTO CONFIRMADO (Estado: Abierto)"],
                ["Retest de CP-05 tras commit de fix", "HTTP 422 Unprocessable Entity (Stock intacto)", "PASÓ (Estado: Cerrado con evidencia)"],
                ["Regresión completa (CP-01 a CP-06)", "6 pruebas ejecutadas, 6 pasadas en 0.12s", "CALIDAD CERTIFICADA (Listo para despliegue)"]
            ],
            decision: "El defecto DEF-01 queda cerrado formalmente con enlace al commit y al reporte de pytest. Se autoriza la reapertura únicamente si el retest en ambiente de staging detecta alguna regresión."
        },
        {
            type: "alert", variant: "warning", title: "Escala severidad × prioridad: matriz de ejemplo didáctico, no un estándar",
            body: "La matriz 3×3 que sigue es UN ejemplo didáctico para discutir, no una regla universal ni un inventario oficial de ISTQB: cada organización define sus propios niveles y criterios (las prácticas de gestión de configuración y defectos de ISTQB describen actividades, no números mágicos). Úsala para entrenar la conversación «grave no siempre es urgente y urgente no siempre es grave», y luego define la tuya con tu equipo."
        },
        {
            type: "comparison", title: "Matriz severidad × prioridad (ejemplo didáctico 3×3)",
            headers: ["Severidad ↓ / Prioridad →", "Alta (corregir ya)", "Media (esta iteración)", "Baja (backlog)"],
            rows: [
                ["Alta (bloquea o daña)", "Bloqueante: detiene entregas hasta corregir y retestar", "Crítico programado: entra primero en la planificación", "Crítico diferido: solo si hay riesgo residual aceptado por escrito"],
                ["Media (degrada sin destruir)", "Urgente inusual: visibilidad alta o entrega inminente", "Estándar: se corrige con ritmo normal del equipo", "Mejora encolada: se agrupa con otros ajustes"],
                ["Baja (cosmética o marginal)", "Casi nunca: exige justificación explícita", "Oportunidad: se aprovecha un cambio cercano", " backlog: se revisa en grooming y puede morir"] ,
            ]
        },
        {
            type: "steps", title: "Práctica: reporta un defecto real con GitHub Issues",
            intro: "Elige un fallo que hayas observado en tu aplicativo (o el de práctica) y llévalo por el flujo completo. Un issue bien escrito es la mitad de la corrección.",
            steps: [
                { title: "Crea el issue con un título que enuncie el comportamiento", desc: "El título dice qué hace el sistema, no qué siente quien reporta. Formato útil: «[Módulo] acción + resultado observado». Evita «error», «bug», «no sirve».", command: "Título: [Préstamos] La solicitud con 6 equipos se aprueba y descuenta inventario", tip: "Un buen título permite a otro humano decidir en 5 segundos si el issue le corresponde." },
                { title: "Escribe pasos, esperado y observado, y el entorno", desc: "Pasos numerados que cualquiera pueda seguir desde cero. Esperado: qué debería ocurrir según el oráculo (cita la regla). Observado: qué ocurrió de hecho, con mensajes exactos. Entorno: versión, rama, navegador o comando usado.", command: "1. Login con rol aprendiz 2. Ir a /prestamos/nuevo 3. Cantidad: 6, enviar", pitfall: "Omitir precondiciones (permiso, inventario disponible) reproduce reportes «irreproducibles» que en realidad eran incompletos." },
                { title: "Etiqueta la severidad y vincula la trazabilidad", desc: "Agrega etiqueta de severidad (ejemplo: severity-alta) según tu escala acordada, y enlaza la cadena de trazabilidad: requisito R-CANT → caso CP-05 → ejecución → este issue. La trazabilidad convierte un issue aislado en evidencia de gestión de calidad.", tip: "Conecta con la Estación de Diseño: CP-05 es el caso «permiso activo, 10 equipos, cantidad 6 → rechazo» y su defecto típico sería DEF-01." },
                { title: "Cierra con un commit que referencie el issue", desc: "La corrección se integra con un mensaje que GitHub reconoce: «fix: valida cantidad máxima de equipos (Closes #N)». Al fusionarse, el issue se cierra solo y queda el vínculo permanente entre código y defecto.", command: "git commit -m \"fix: valida cantidad máxima de 5 equipos (Closes #12)\"", pitfall: "Cerrar el issue a mano sin commit de referencia rompe la trazabilidad: nadie podrá saber qué cambio lo corrigió." }
            ]
        },
        {
            type: "comparison", title: "Métricas de defectos: señales con contexto, no metas universales",
            headers: ["Métrica", "Cómo se calcula (ejemplo)", "Qué puede señalar", "Advertencia de interpretación"],
            rows: [
                ["Densidad de defectos", "Defectos confirmados / tamaño (miles de líneas o puntos de historia).", "Módulos con calidad dudosa o falta de revisiones.", "Comparar densidades entre tecnologías o equipos sin normalizar es injusto y fomenta ocultar reportes."],
                ["Escape rate (tasa de escape)", "Defectos encontrados en producción / defectos totales del período.", "Qué tan bien filtran las pruebas antes del despliegue.", "Premiar «cero escapes» castiga reportar: si el incentivo es bajar la métrica, la gente deja de registrar defectos y la métrica muere."],
                ["Tiempo de ciclo del defecto", "De Abierto a Cerrado, en mediana por severidad.", "Cuellos de botella entre corrección y retest.", "La mediana esconde colas: revisa también el percentil 90 antes de declarar salud."],
                ["Reabiertos por corrección", "Defectos que vuelven a Abierto tras retest / corregidos.", "Correcciones apresuradas o retest superficial.", "Una cifra baja también puede significar retests débiles que no intentan romper la corrección."]
            ]
        },
        {
            type: "alert", variant: "danger", title: "Contraejemplo: el reporte que nadie puede usar",
            body: "«El módulo de préstamos no funciona. Lo probé todo y falla. Arreglenlo urgente.» Este reporte, demasiado frecuente, es un callejón sin salida: no dice qué entrada se usó, qué salida se esperaba, qué se observó ni en qué entorno. Ningún desarrollador puede reproducirlo, ningún tester puede confirmarlo y en la revisión semanal solo genera fricción. Comparado con un buen reporte, este retrasa la corrección horas o días. La regla mínima: si tu reporte no permite que otra persona reproduzca la diferencia entre esperado y observado, todavía no está listo para salir de tu cuaderno."
        },
        {
            type: "alert", variant: "info", title: "Conexión con la guía: sim-triage y la trazabilidad CP-05 → DEF-01",
            body: "Ya practicaste la mitad de este oficio en el simulador «Diagnóstico & Triage de Defectos» (sim-triage) de la estación de CI: allí clasificaste causa raíz, severidad y acción correctiva ante un fallo en pipeline. Y en la Estación 2 (Diseño) construiste la trazabilidad del defecto ejemplo: R-CANT (riesgo de préstamo excesivo) → CP-05 (caso con permiso activo, 10 equipos y cantidad 6) → DEF-01 («se acepta una cantidad superior al máximo»). Esta estación cierra el círculo: el issue de GitHub es donde esa cadena se vuelve pública, asignable y verificable. Si tu issue no enlaza al caso que lo detectó, tu proceso de pruebas y tu proceso de defectos viven en mundos separados."
        },
        {
            type: "alert", variant: "warning", title: "Recuperación: el defecto se reabre — qué registrar",
            body: "Un reabierto no es un fracaso ni un drama: es información. Cuando el retest falla, registra ANTES de devolverlo a Abierto: 1) Qué se ejecutó exactamente (comando, rama, datos) y qué se observó. 2) Qué intentó la corrección anterior y por qué no alcanzó (hipótesis, no acusaciones). 3) Qué queda descartado para no reintentar caminos muertos. 4) Si el alcance creció (el fallo resultó ser más profundo), valora dividir el issue y enlazar ambos. Un reabierto con este contexto cuesta una fracción del primero; un reabierto vacío («sigue fallando») reinicia el reloj desde cero y erosiona la confianza entre quien prueba y quien corrige."
        },
        {
            type: "alert", variant: "success", title: "Transferencia: aplica el workflow a un issue real de tu proyecto",
            body: "En tu aplicativo propio: 1) Abre un issue por un defecto real (no simulado) con título, pasos, esperado/observado, entorno y etiqueta de severidad. 2) Llévalo personalmente por Abierto → Corregido → Retest con evidencias, y ciérralo con un commit que diga «Closes #N». 3) Si durante el reto aparece un reabierto, regístralo con el protocolo de recuperación de arriba y compara el tiempo de ciclo con el primer defecto. Al final, responde por escrito: ¿qué cambió en tu forma de escribir el primer reporte después de haber hecho el retest tú mismo?"
        }
    ]
};
