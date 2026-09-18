// Estación 3/18: priorización por riesgo. Contenido declarativo cargado antes del renderizador.
window.MODULES["m-riesgo"] = {
    title: "Decidir qué probar: priorización por riesgo",
    badge: "Estación 3/18 · Diseño",
    intro: "No puedes probar todo, y tampoco necesitas hacerlo. El criterio profesional para decidir qué probar primero —y qué dejar sin probar— es el riesgo: la combinación de cuán probable es que algo falle y cuánto daño causaría si falla. Esta estación te da una matriz sencilla y honesta para sostener esa decisión.",
    blocks: [
        {
            type: "definition",
            title: "Modelo mental: riesgo, probabilidad e impacto",
            intro: "Comprende las tres piezas antes de puntuar cualquier cosa.",
            pieces: [
                {
                    letter: "⚠️", term: "Riesgo", translation: "Posible problema con consecuencia",
                    meaning: "Una situación que aún no ocurre pero que podría ocurrir y causar un efecto indeseable en personas, datos, dinero o confianza.",
                    analogy: "Como cruzar una calle mirando los dos lados: no esperas que un carro te vaya a golpear, pero evalúas la posibilidad antes de decidir.",
                    example: "Aceptar una cantidad de 6 equipos cuando el máximo es 5: aún no ha pasado, pero si el código lo permite, un préstamo indebido se materializa."
                },
                {
                    letter: "🎲", term: "Probabilidad", translation: "Qué tan seguido podría ocurrir",
                    meaning: "Estimación de cuán frecuente o cuán probable es que el escenario de fallo se active, basada en datos, cambios recientes o experiencia del dominio.",
                    analogy: "Como el pronóstico del clima: no garantiza que lloverá, pero ordena si llevas paraguas.",
                    example: "Una validación nueva escrita ayer tiene más probabilidad de defecto que una regla que lleva dos años sin cambios en producción."
                },
                {
                    letter: "💥", term: "Impacto", translation: "Qué tan grave sería si ocurre",
                    meaning: "La magnitud del daño si el fallo llega a producirse: desde un texto mal alineado hasta pérdida de datos o dinero.",
                    analogy: "Como la diferencia entre derramar agua en la mesa y derramarla sobre un equipo eléctrico encendido.",
                    example: "Un préstamo sin permiso afecta inventario y confianza; un typo en un rótulo solo afecta la presentación."
                }
            ]
        },
        {
            type: "alert", variant: "info", title: "Por qué no se puede probar todo",
            body: "Probar exhaustivamente cualquier sistema no trivial es imposible: las combinaciones de entradas, estados, tiempos y entornos crecen sin límite. Los principios de pruebas de ISTQB (2023) lo enuncian directamente: las pruebas exhaustivas son imposibles, y los defectos tienden a concentrarse. La consecuencia práctica no es rendirse, sino elegir con criterio: cubre primero lo que combina alta probabilidad con alto impacto, y acepta explícitamente el riesgo residual que decides no cubrir. Decir «no lo probé y esto es lo que asumo» es una decisión profesional; decir «no lo probé porque no alcanzó el tiempo» sin evaluarlo no lo es."
        },
        {
            type: "alert", variant: "warning", title: "Escala de ejemplo didáctico — define la tuya",
            body: "Las puntuaciones 1 a 5 que usa esta estación son UNA escala de ejemplo didáctico, no un estándar. Los umbrales que separan «alto» de «medio» dependen del dominio: un 3 en una app de préstamos de equipos no equivale a un 3 en un sistema de pagos. En tu proyecto, acuerda criterios observables por nivel con tu equipo y docéncialos, o ajusta la escala y justifícala en tu plan de pruebas."
        },
        {
            type: "comparison", title: "Escala de probabilidad 1–5 (ejemplo didáctico con criterios observables)",
            headers: ["Nivel", "Nombre", "Criterio observable de ejemplo"],
            rows: [
                ["1", "Raro", "Requiere una falla simultánea en varias capas; nunca se ha observado algo similar."],
                ["2", "Improbable", "Solo ocurre con datos o tiempos muy específicos; el escenario es difícil de activar."],
                ["3", "Posible", "Puede ocurrir con entradas válidas normales o tras un cambio reciente en el código."],
                ["4", "Probable", "Ocurre con frecuencia en condiciones reales o el componente cambia constantemente."],
                ["5", "Casi seguro", "Ocurre en cada ejecución o el camino afectado se ejecuta siempre sin validación."]
            ]
        },
        {
            type: "comparison", title: "Escala de impacto 1–5 (ejemplo didáctico con criterios observables)",
            headers: ["Nivel", "Nombre", "Criterio observable de ejemplo"],
            rows: [
                ["1", "Trivial", "Detalle cosmético sin efecto en la tarea; nadie se ve impedido."],
                ["2", "Menor", "Molestia o retraso pequeño; existe una vía alternativa para completar la tarea."],
                ["3", "Moderado", "La tarea falla para algunas personas o requiere trabajo manual para recuperarse."],
                ["4", "Grave", "Pérdida de datos recuperables, inventario incorrecto o incumplimiento de una regla de negocio visible."],
                ["5", "Crítico", "Pérdida de datos irreversible, dinero, seguridad o caída total del servicio."]
            ]
        },
        {
            type: "comparison", title: "Matriz probabilidad × impacto (ejemplo didáctico): cómo se lee",
            headers: ["Impacto ↓ / Probabilidad →", "1 Raro", "3 Posible", "5 Casi seguro"],
            rows: [
                ["5 Crítico", "MEDIA: vigílala", "ALTA: probar antes de entregar", "ALTA: bloquea la entrega"],
                ["3 Moderado", "BAJA: caso representativo", "MEDIA: cubre fronteras", "ALTA: prioriza"],
                ["1 Trivial", "BAJA: decide si vale la pena", "BAJA: representante", "MEDIA: agilidad de ejecución"]
            ]
        },
        {
            type: "diagram",
            diagramType: "risk-matrix",
            title: "Diagrama Visual: Mapa de Calor 2D de Riesgo (Probabilidad × Impacto)",
            risks: [
                { p: 4, i: 4, tag: "R-01: Cantidad > 5 (P4, I4)" },
                { p: 3, i: 5, tag: "R-02: Sin permiso (P3, I5)" },
                { p: 2, i: 5, tag: "R-03: Doble reserva (P2, I5)" },
                { p: 2, i: 4, tag: "R-04: Caída BD (P2, I4)" },
                { p: 1, i: 1, tag: "R-05: Typo rótulo (P1, I1)" }
            ],
            body: "La matriz clasifica los riesgos en tres zonas operativas: la Zona Alta exige pruebas automatizadas bloqueantes antes del release; la Zona Media requiere casos representativos y monitoreo; la Zona Baja representa riesgo residual aceptado conscientemente."
        },
        {
            type: "case-study",
            title: "Caso Práctico Paso a Paso: FMEA Ligero y Selección de Pruebas Críticas",
            context: "En el sprint de cierre del sistema de préstamos, el equipo solo dispone de 8 horas de testing. Hay 25 posibles casos de prueba identificados. Se aplica FMEA ligero para priorizar qué probar primero y qué aplazar con justificación.",
            preconditions: [
                "Escala didáctica: Probabilidad (1 a 5) e Impacto (1 a 5).",
                "Fórmula de severidad de riesgo: Nivel de Riesgo = P × I.",
                "Criterio de corte: Riesgo >= 12 entra en la suite de CI obligatoria; Riesgo < 6 se aplaza."
            ],
            code: `# evaluador_riesgos.py
RIESGOS = [
    {"id": "R-01", "nombre": "Cantidad > 5 aceptada", "p": 4, "i": 4},
    {"id": "R-02", "nombre": "Préstamo sin permiso", "p": 3, "i": 5},
    {"id": "R-03", "nombre": "Doble reserva concurrente", "p": 2, "i": 5},
    {"id": "R-04", "nombre": "Caída de servicio", "p": 2, "i": 4},
    {"id": "R-05", "nombre": "Desalineación visual de botón", "p": 1, "i": 1},
]

for r in RIESGOS:
    score = r["p"] * r["i"]
    prioridad = "ALTA (Probar ya)" if score >= 12 else ("MEDIA (Sprint)" if score >= 6 else "BAJA (Backlog)")
    r["score"] = score
    r["prioridad"] = prioridad

# Ordenar por score descendente
priorizados = sorted(RIESGOS, key=lambda x: x["score"], reverse=True)
for p in priorizados:
    print(f"[{p['prioridad']}] {p['id']}: {p['nombre']} (Score: {p['score']})")`,
            command: "python evaluador_riesgos.py",
            oracle: "R-01 (score 16) y R-02 (score 15) deben encabezar el plan de pruebas automatizadas, consumiendo el 70% del tiempo de testing.",
            expectedVsObserved: [
                ["R-01 Cantidad > 5 (Score 16)", "Zona Alta · Test automatizado unitario + frontera", "Fallo si se omite por 'ser una simple validación'"],
                ["R-02 Sin Permiso (Score 15)", "Zona Alta · Test de integración de seguridad y roles", "Fallo si se deja manual para el final"],
                ["R-03 Concurrencia (Score 10)", "Zona Media-Alta · Test de carga o transacción BD", "Monitorear en staging"],
                ["R-05 Botón visual (Score 1)", "Zona Baja · Riesgo residual aceptado por escrito", "Fallo si el equipo gasta 4 horas alineando CSS"]
            ],
            decision: "Se aprueba el plan de entrega que contiene pruebas automáticas para R-01 y R-02. El riesgo R-05 se documenta en el informe de cierre ART-TEST-01 como riesgo residual conocido que no impide el despliegue."
        },
        {
            type: "alert", variant: "info", title: "FMEA ligero: mirar el modo, la causa, el efecto y la detección",
            body: "El Análisis de Modos de Falla y Efectos (FMEA, norma IEC 60812) propone preguntarse cuatro cosas por cada riesgo, sin necesidad de la tabla completa ni de coeficientes: MODO: ¿de qué forma falla el comportamiento? CAUSA: ¿qué condición o decisión lo provocaría? EFECTO: ¿qué daño visible produce? DETECCIÓN: ¿qué prueba, revisión o control lo descubriría antes de que escale? Si la detección actual es «ninguna», ese riesgo sube de prioridad aunque su probabilidad parezca baja: es invisible hasta que duele."
        },
        {
            type: "comparison", title: "Ejemplo resuelto: riesgos del préstamo de equipos puntuados (escala didáctica de ejemplo)",
            headers: ["Riesgo", "Modo · causa · efecto", "P", "I", "Zona", "Por qué esos números"],
            rows: [
                ["Cantidad inválida aceptada", "La validación acepta 6 o más · comparación mal escrita · préstamo excede el máximo", "4", "4", "ALTA", "El código de validación es nuevo y cambia seguido (P alta); incumple la regla central y descuenta inventario real (I alto)."],
                ["Préstamo sin permiso", "Se omite la verificación de rol · ruta sin control de autorización · entrega a quien no debe recibir", "3", "5", "ALTA", "Requiere activarlo a propósito o un descuido de ruta (P media); afecta confianza e inventario, posible incumplimiento grave (I crítico)."],
                ["Concurrencia: doble reserva", "Dos solicitudes simultáneas leen el mismo disponible · sin transacción · inventario negativo o sobre-reserva", "2", "5", "MEDIA-ALTA", "Exige simultaneidad exacta, raro de reproducir manualmente (P baja); deja el inventario inconsistente (I crítico). Poca detección sin pruebas de concurrencia."],
                ["Caída del servicio", "Dependencia externa cae o el proceso se detiene · sin manejo de errores · nadie puede prestar ni devolver", "2", "4", "MEDIA", "El entorno del SENA es estable pero no redundante (P baja-media); bloquea toda la operación temporalmente (I grave)."]
            ]
        },
        {
            type: "alert", variant: "danger", title: "Contraejemplo: priorizar por «lo fácil de probar»",
            body: "Un equipo ordena su semana así: primero los casos de cantidad porque son rápidos de escribir, después el contraste de colores de la interfaz porque «ya está el inspector a mano», y dejan para «si queda tiempo» el préstamo sin permiso, porque montar usuarios con roles distintos toma trabajo. Resultado: la suite queda verde y bonita mientras el riesgo más dañino sigue sin evidencia. La facilidad de probar no correlaciona con el daño potencial; es una variable de esfuerzo, no de riesgo. Úsala para ordenar dentro de la misma zona de la matriz, nunca para elegir la zona."
        },
        {
            type: "comparison", title: "Criterio de «suficiente»: cobertura de riesgo vs cobertura de código",
            headers: ["Pregunta", "Cobertura de riesgo", "Cobertura de código (ver Estación 11)"],
            rows: [
                ["¿Qué mide?", "Qué riesgos identificados tienen al menos un caso con aserción y resultado registrado.", "Qué líneas y ramas del código ejecutaron las pruebas."],
                ["¿Cuándo es útil?", "Para decidir si puedes entregar y qué riesgo residual aceptas.", "Para localizar código sin ejercitar y guiar casos adicionales."],
                ["¿Qué NO demuestra?", "Que el software esté libre de defectos ni que los riesgos sean los correctos si la lista era mala.", "Que los resultados comprobados sean correctos ni que los riesgos importantes estén cubiertos."],
                ["Criterio de suficiente (ejemplo)", "Todos los riesgos de zona ALTA tienen caso ejecutado y evidencia; los de MEDIA tienen al menos caso de frontera; los de BAJA están aceptados explícitamente.", "Un umbral contextual acordado — por ejemplo el 80 % usado en esta guía como umbral didáctico de ejemplo, no una exigencia universal —, siempre subordinado a la cobertura de riesgo."]
            ]
        },
        {
            type: "steps", title: "Práctica guiada: matriz de riesgo del proyecto del reto",
            intro: "Rellena una matriz en blanco con 5 riesgos reales del aplicativo que estás construyendo en el reto. No inventes riesgos genéricos: sal del código y de las conversaciones con tu equipo.",
            steps: [
                { title: "Lista 5 riesgos en modo FMEA ligero", desc: "Por cada uno escribe: modo (cómo falla), causa probable, efecto visible y detección actual. Si la detección es «ninguna», márcalo.", command: "Plantilla: MODO | CAUSA | EFECTO | DETECCIÓN ACTUAL", tip: "Busca los riesgos donde interactúan dos cosas: rol × recurso, dos solicitudes a la vez, red × guardado. Ahí suelen vivir los defectos caros." },
                { title: "Puntúa probabilidad e impacto con criterios observables", desc: "Usa la escala 1–5 de ejemplo de esta estación o la que tu equipo acuerde, pero escribe junto a cada número POR QUÉ ese nivel. Un número sin justificación no se puede discutir.", command: "R01: P=__ porque… | I=__ porque…", pitfall: "Puntuar todo desde el miedo o desde lo que te contaron: base cada nivel en algo observable — frecuencia de cambios del componente, datos reales del dominio, historial de fallos." },
                { title: "Ubica cada riesgo en la matriz y decide cobertura", desc: "Traza la zona (baja/media/alta) y escribe qué caso de prueba cubriría cada riesgo de zona alta. Para los de zona baja, decide conscientemente si merecen caso representativo o aceptación explícita.", command: "Matriz 5×5 en papel, hoja de cálculo o tu herramienta de gestión.", tip: "Conserva la matriz: es la entrada de tu plan de pruebas (ART-TEST-01) y la evidencia de que tus decisiones de diseño tienen razón, no capricho." }
            ]
        },
        {
            type: "alert", variant: "warning", title: "Recuperación: si todo queda «alto», la escala no discrimina",
            body: "Síntoma: puntúas diez riesgos y nueve quedan en P=4, I=5. Diagnóstico: estás usando la escala como termómetro de miedo, no de riesgo; o los criterios por nivel son tan amplios que cualquier cosa calza en «alto». Recuperación: 1) Revisa los criterios observables de cada nivel y agrégales ejemplos de tu dominio. 2) Fuerza comparación relativa: ordena los riesgos de mayor a menor y asigna los niveles después de ordenar, no antes. 3) Si aun así todo sigue alto, tu sistema probablemente sí es riesgoso: en ese caso el hallazgo es que necesitas controles (revisiones, límites, monitoreo), no que la escala está mal — pero ahora puedes demostrarlo, no solo sentirlo."
        },
        {
            type: "alert", variant: "success", title: "Transferencia: lleva la matriz a tu aplicativo propio",
            body: "Toma el aplicativo que estás desarrollando en tu proyecto formativo y: 1) Elabora su matriz probabilidad × impacto con al menos 8 riesgos reales. 2) Elige 3 decisiones de prueba que hoy tomas por intuición (qué módulo probar primero, qué flujo dejar manual, qué caso omitir) y reescríbelas justificadas con la zona de la matriz que las sostiene. 3) Entrégaselas a un compañero: si no puede discutir tus números con los criterios que escribiste, la escala todavía no es tuya. Puedes practicar el criterio de selección antes de la matriz en el simulador «Diseña antes de automatizar» (sim-diseno) de esta estación."
        }
    ]
};
