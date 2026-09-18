/** Instrucciones humano–IA situadas en los 18 módulos de la ruta. */
(function (global) {
    'use strict';

    global.AI_GUIDED_PRACTICES = {
        'm-reflexion': {
            goal: 'Explicar con precisión qué riesgo se quiere investigar antes de elegir una herramienta.',
            prompt: `Estoy aprendiendo pruebas de software. Analiza la siguiente regla o necesidad sin escribir código todavía:\n\n[REGLA O NECESIDAD DEL PROYECTO]\n\n1. Separa necesidad, requisito observable, error humano posible, defecto y fallo visible.\n2. Propón tres preguntas que debo aclarar con una persona responsable.\n3. Indica qué información falta y no la inventes.\n4. Devuelve una tabla: concepto | ejemplo | evidencia que lo confirmaría.`,
            verify: 'Contrasta cada afirmación con la regla original y confirma con una persona del proyecto las preguntas abiertas.',
            cannotProve: 'La respuesta no demuestra que el requisito sea correcto ni que el producto funcione.',
            humanDecision: 'Corrige el vocabulario y conserva solamente las relaciones que puedas explicar con un ejemplo propio.',
            recovery: 'Si mezcla defecto con fallo, pídele que ubique primero la acción humana, luego el problema introducido y finalmente el comportamiento observado.'
        },
        'm-piramide': {
            goal: 'Convertir una regla en casos representativos y escoger la capa de prueba por riesgo.',
            prompt: `Actúa como acompañante de diseño de pruebas. Regla observable:\n\n[REGLA DEL PROYECTO]\n\nAntes de proponer herramientas, identifica el oráculo. Después crea una matriz con: ID, riesgo, precondición, entrada, resultado esperado, técnica y capa sugerida. Incluye particiones válidas e inválidas, fronteras y una combinación de permiso o estado. Explica por qué cada caso aporta información y marca los supuestos como preguntas.`,
            verify: 'Recalcula los límites, revisa que cada resultado esperado nazca del oráculo y elimina casos repetidos que no agreguen información.',
            cannotProve: 'Una matriz no ejecutada no demuestra que el sistema cumpla la regla ni fija una proporción universal de pruebas.',
            humanDecision: 'Prioriza los casos por impacto y probabilidad, y justifica cuáles automatizarás primero.',
            recovery: 'Si propone muchos casos similares, pide que agrupe por particiones y explique qué defecto distinto podría revelar cada representante.'
        },
        'm-riesgo': {
            goal: 'Construir una matriz de riesgo con criterios observables y justificar qué se cubre y qué se acepta sin probar.',
            prompt: `Actúa como facilitador de análisis de riesgos para este aplicativo:\n\n[DESCRIPCIÓN DEL APLICATIVO, SUS USUARIOS Y 3 COMPONENTES CLAVE]\n\nPor cada riesgo que propongas, entrega: modo de falla, causa probable, efecto visible y detección actual (FMEA ligero). Después puntúa probabilidad e impacto en una escala 1–5, pero obligatorio: escribe el criterio observable que justifica cada nivel. Rotula la escala como ejemplo didáctico y señala qué criterios cambiarían en un dominio de mayor criticidad. Cierra proponiendo qué riesgos de zona alta tendrían caso de prueba y cuáles aceptarías como riesgo residual, con la razón de cada aceptación.`,
            verify: 'Discute cada puntaje con tu equipo o instructor: si nadie puede argumentar en contra del número con el criterio escrito, la escala todavía no discrimina.',
            cannotProve: 'La matriz no demuestra que el software funcione ni que los riesgos sean los correctos: solo ordena decisiones bajo los supuestos declarados.',
            humanDecision: 'Tú aceptas o rechazas el riesgo residual y eliges qué zona alta se cubre primero; esa aceptación queda escrita en tu plan de pruebas.',
            recovery: 'Si todo queda en zona alta, pídele que ordene los riesgos relativamente de mayor a menor y reescriba los criterios de cada nivel con ejemplos de tu dominio.'
        },
        'm-tdd': {
            goal: 'Usar la IA para preparar un ciclo rojo–verde–refactor pequeño y observable.',
            prompt: `Trabajaremos con TDD sobre este contrato y este código:\n\n[CONTRATO]\n[CÓDIGO RELEVANTE]\n\nVerifica primero que los nombres citados existan. Propón una sola prueba mínima que falle por ausencia del comportamiento, el comando exacto para ejecutarla y el mensaje de fallo esperado. No escribas la implementación hasta que yo comparta la salida roja. Después sugiere el cambio mínimo y una refactorización separada.`,
            verify: 'Ejecuta cada etapa, confirma que el primer fallo ocurre por la razón esperada y repite toda la suite después de refactorizar.',
            cannotProve: 'Código generado y una salida verde inventada no demuestran que se haya seguido TDD.',
            humanDecision: 'Decide si el caso expresa el contrato y si la refactorización conserva el comportamiento.',
            recovery: 'Si la prueba pasa de inmediato, revisa si el comportamiento ya existía, si la aserción es débil o si se ejecutó el archivo equivocado.'
        },
        'm-bdd': {
            goal: 'Descubrir reglas con ejemplos antes de automatizar escenarios.',
            prompt: `Ayúdame a preparar una conversación BDD, no a saltar directamente a Gherkin. Necesidad:\n\n[NECESIDAD Y ACTORES]\n\nEntrega: reglas candidatas, ejemplos que deberían aceptarse o rechazarse, preguntas abiertas para negocio y contradicciones posibles. Solo después redacta un escenario Dado–Cuando–Entonces con resultado observable y sin detalles de interfaz. Señala qué parte requiere confirmación humana.`,
            verify: 'Pide a quien conoce el proceso que confirme ejemplos y términos; luego ejecuta los pasos y comprueba que llaman el comportamiento real.',
            cannotProve: 'Un archivo .feature legible no demuestra por sí solo colaboración ni ejecución.',
            humanDecision: 'Acepta únicamente escenarios que el negocio pueda comprender y mantener cuando cambie la regla.',
            recovery: 'Si aparece “todo funciona”, reemplázalo por un estado inicial, una acción concreta y una consecuencia observable.'
        },
        'm-pytest-fastapi': {
            goal: 'Comprobar contrato HTTP, contenido de respuesta y efecto persistido de una API.',
            prompt: `Revisa estos archivos reales de una API FastAPI:\n\n[RUTA, ESQUEMA Y PRUEBAS ACTUALES]\n\nCita los nombres que sí existen. Propón primero una matriz para éxito, validación, acceso denegado, inexistencia y conflicto. Después genera una prueba pytest para un solo riesgo con preparación aislada, petición, aserciones de estado y cuerpo, y comprobación del efecto en datos. Incluye el comando de ejecución.`,
            verify: 'Ejecuta la prueba, lee el cuerpo de error y consulta el estado persistido; un código HTTP aislado es insuficiente.',
            cannotProve: 'TestClient no demuestra por sí solo compatibilidad de producción, concurrencia ni políticas reales de la base de datos.',
            humanDecision: 'Define qué casos pertenecen a unidad, integración o contrato y qué entorno autorizado necesitas.',
            recovery: 'Ante 422, compara el esquema y el cuerpo enviado antes de cambiar la expectativa o desactivar validaciones.'
        },
        'm-pytest-flask': {
            goal: 'Diseñar pruebas repetibles de rutas Flask sin contaminación de sesión o datos.',
            prompt: `Inspecciona esta fábrica de aplicación, ruta Flask y pruebas existentes:\n\n[ARCHIVOS RELEVANTES]\n\nIdentifica contexto, sesión, datos y efectos secundarios. Propón una fixture mínima y un caso que pueda ejecutarse en cualquier orden. Explica la limpieza necesaria, la aserción visible y el comando exacto. No inventes extensiones ni configuración.`,
            verify: 'Ejecuta el caso solo, en la suite y con orden alterado; confirma que la limpieza deja el mismo punto de partida.',
            cannotProve: 'Un cliente de prueba aislado no comprueba el navegador ni todos los detalles del servidor desplegado.',
            humanDecision: 'Decide qué estado debe reemplazarse, cuál debe ser real y cómo evitar dependencias entre pruebas.',
            recovery: 'Si solo pasa después de otra prueba, inspecciona sesión, variables globales y registros compartidos antes de agregar esperas.'
        },
        'm-jest-react': {
            goal: 'Probar estados de interfaz desde lo que una persona puede percibir y operar.',
            prompt: `Analiza este componente React y su requisito visible:\n\n[COMPONENTE]\n[REQUISITO]\n\nEnumera carga, vacío, error, éxito y estado deshabilitado que sean pertinentes. Propón una prueba con Testing Library que localice por rol o etiqueta, realice una acción y compruebe el resultado observable. Evita clases CSS y detalles internos. Incluye una revisión de teclado y nombre accesible.`,
            verify: 'Ejecuta la prueba, navega con teclado y confirma que la aserción falla si eliminas temporalmente el comportamiento protegido.',
            cannotProve: 'Una prueba de componente no certifica usabilidad, accesibilidad completa ni integración con el servicio real.',
            humanDecision: 'Elige la señal que representa el objetivo de la persona y descarta aserciones acopladas a implementación.',
            recovery: 'Si no encuentra el control, inspecciona su rol, etiqueta y estado visible antes de agregar un selector de prueba.'
        },
        'm-junit-jsp': {
            goal: 'Aislar una regla Java y comprobar resultado y efectos secundarios.',
            prompt: `Revisa esta clase Java, su contrato y sus dependencias:\n\n[CÓDIGO Y PRUEBAS]\n\nPropón un caso JUnit 5 para una entrada límite. Indica qué dependencia sustituir con un doble, qué resultado o excepción esperar y qué interacción no debe ocurrir. Usa únicamente métodos y constructores presentes. Incluye el comando Maven para el caso.`,
            verify: 'Compila, ejecuta el caso y confirma tanto el resultado como la ausencia o presencia justificada de interacciones.',
            cannotProve: 'Un doble de repositorio no demuestra que la consulta, transacción o esquema real funcionen.',
            humanDecision: 'Decide si el doble aísla una dependencia o está copiando lógica que debería comprobarse en integración.',
            recovery: 'Si Mockito informa una llamada inesperada, compara el flujo real con el contrato antes de relajar la verificación.'
        },
        'm-playwright': {
            goal: 'Proteger un recorrido crítico con señales estables del navegador.',
            prompt: `Diseña un solo recorrido Playwright para este objetivo de usuario:\n\n[OBJETIVO, RUTA Y ESTADOS VISIBLES]\n\nPropón precondiciones, datos ficticios, localizadores por rol o etiqueta, acciones, aserción final y limpieza. Reemplaza esperas fijas por señales observables. Incluye comando, traza al reintentar y lo que queda fuera del alcance.`,
            verify: 'Ejecuta en el navegador definido, revisa la traza y provoca una falla controlada para confirmar que la aserción protege el objetivo.',
            cannotProve: 'Un recorrido exitoso no cubre todos los navegadores, datos, permisos, fallos de red ni riesgos de seguridad.',
            humanDecision: 'Conserva solo recorridos críticos cuyo costo de mantenimiento se justifique por el riesgo.',
            recovery: 'Si es intermitente, investiga señal de espera, datos compartidos, red y orden antes de aumentar el tiempo fijo.'
        },
        'm-cobertura': {
            goal: 'Interpretar cobertura como señal de exploración, no como sinónimo de calidad.',
            prompt: `Interpreta este reporte de cobertura junto con los riesgos del módulo:\n\n[REPORTE]\n[RIESGOS Y REQUISITOS]\n\nRelaciona líneas o ramas no recorridas con decisiones del negocio. Propón máximo tres casos priorizados y explica qué defecto podría revelar cada uno. No declares un umbral universal ni asumas que 100 % significa ausencia de defectos.`,
            verify: 'Lee las líneas y ramas reales, agrega un caso por riesgo y comprueba que la prueba falla al introducir una mutación pertinente.',
            cannotProve: 'El porcentaje no mide por sí solo calidad de aserciones, cobertura de requisitos, seguridad ni utilidad.',
            humanDecision: 'Justifica un umbral contextual o decide no usarlo si no orienta una decisión útil.',
            recovery: 'Si la IA solo recomienda subir el porcentaje, exige relación requisito → riesgo → caso → aserción.'
        },
        'm-defectos': {
            goal: 'Redactar un reporte de defecto accionable y llevarlo por el ciclo completo hasta el cierre con evidencia.',
            prompt: `Revisa este borrador de issue que escribí sobre mi aplicativo:\n\n[TÍTULO Y CUERPO DEL ISSUE, CON PASOS, ESPERADO, OBSERVADO Y ENTORNO]\n\nEvalúalo con el ciclo de vida Nuevo → Abierto → Corregido → Retest → Cerrado: 1) ¿Permite a otra persona reproducir la diferencia entre esperado y observado? Señala lo que falte. 2) ¿La severidad se justifica por impacto y la prioridad por momento, sin confundirlas? 3) ¿La trazabilidad enlaza requisito → caso → defecto? 4) Propón el título y los pasos corregidos, y el mensaje de commit que cerraría el issue referenciándolo (Closes #N). No inventes datos de entorno: marca cada hueco como pregunta pendiente.`,
            verify: 'Ejecuta tú mismo los pasos del issue corregido en tu entorno, confirma el comportamiento observado y solo entonces publícalo; verifica que el commit de cierre exista tras la corrección.',
            cannotProve: 'Un issue bien redactado no demuestra que el defecto exista ni que la corrección funcione: solo hace verificables ambas cosas.',
            humanDecision: 'Decides si el comportamiento reportado es realmente un defecto según el oráculo (la regla acordada) y cuándo aceptas el cierre tras el retest.',
            recovery: 'Si el borrador dice «no funciona» sin reproducción, pídele que reescriba el issue con precondiciones, pasos numerados, esperado citando la regla y observado con mensajes exactos.'
        },
        'm-cicd': {
            goal: 'Crear una compuerta reproducible que conserve evidencia por cambio.',
            prompt: `Revisa este flujo de integración continua y los comandos que ya funcionan localmente:\n\n[ARCHIVO DE CI]\n[COMANDOS LOCALES]\n\nPropón el cambio mínimo para ejecutar comprobaciones estáticas, pruebas rápidas, integración y recorridos críticos en un orden de retroalimentación razonable. Explica caché, artefactos, fallos, datos sensibles y condición de bloqueo. No inventes secretos ni nombres de tareas.`,
            verify: 'Valida la sintaxis, ejecuta localmente los comandos equivalentes y revisa el registro de una ejecución real asociada a un cambio.',
            cannotProve: 'Un archivo YAML correcto no demuestra que los permisos, servicios o pruebas funcionen en el proveedor.',
            humanDecision: 'Define qué fallo bloquea la entrega, qué puede advertir y quién acepta una excepción temporal.',
            recovery: 'Si falla solo en CI, compara versión, carpeta, variables presentes y servicios antes de cambiar las pruebas.'
        },
        'm-observabilidad': {
            goal: 'Usar señales de operación para formular hipótesis sin exponer información sensible.',
            prompt: `Analiza estas señales sanitizadas de un entorno autorizado:\n\n[VERSIÓN, HORA, RUTA, MÉTRICA, REGISTRO O TRAZA]\n\nSepara hecho observado, hipótesis y dato faltante. Propón comprobaciones en orden de menor riesgo y una condición para detener o revertir. No inventes causa raíz y no solicites tokens, datos personales ni credenciales.`,
            verify: 'Correlaciona versión, ruta y hora en fuentes reales; reproduce cuando sea seguro y distingue producto, datos, infraestructura y prueba.',
            cannotProve: 'Una explicación plausible no es causa raíz hasta que una comprobación descarte alternativas.',
            humanDecision: 'Elige la acción reversible con evidencia suficiente y registra riesgos y responsable.',
            recovery: 'Si afirma una causa exacta sin prueba, pídele evidencia que la confirmaría y una hipótesis competidora.'
        },
        'm-ia-testing': {
            goal: 'Auditar una prueba generada por IA y decidir si aporta evidencia.',
            prompt: `Audita esta prueba propuesta por una IA frente al requisito y al código real:\n\n[REQUISITO]\n[CÓDIGO]\n[PRUEBA]\n\nRevisa existencia de imports, preparación, datos, aserciones, efectos secundarios, aislamiento y riesgo cubierto. Explica por qué fallaría si el comportamiento estuviera roto. Devuelve: conservar, corregir o rechazar, con una razón verificable.`,
            verify: 'Comprueba rutas e imports, ejecuta la prueba y realiza una mutación controlada para confirmar que puede detectar un defecto pertinente.',
            cannotProve: 'Que la prueba compile o pase no significa que proteja el requisito.',
            humanDecision: 'Acepta, corrige o rechaza cada propuesta y deja la razón en la bitácora humano–IA.',
            recovery: 'Si contiene assert True, datos irreales o funciones inexistentes, detén la integración y vuelve al requisito y al archivo real.'
        },
        'm-gema-testing': {
            goal: 'Convertir el contexto del proyecto en un encargo pequeño y verificable.',
            prompt: `Ayúdame a mejorar esta instrucción de trabajo QA:\n\n[INSTRUCCIÓN GENERADA]\n\nComprueba que declare objetivo, archivos reales, riesgo, restricciones, datos permitidos, salida esperada, comando y criterio de terminado. Haz preguntas por cualquier hueco; no lo rellenes por intuición. Divide el trabajo en cambios pequeños con una verificación después de cada uno.`,
            verify: 'Compara la instrucción con el repositorio y confirma que cada resultado pedido pueda observarse mediante un comando o revisión.',
            cannotProve: 'Una instrucción detallada no demuestra que la tarea se haya ejecutado ni que el resultado sea correcto.',
            humanDecision: 'Aprueba el alcance antes de pedir código y detén cualquier expansión que no responda al riesgo elegido.',
            recovery: 'Si el encargo crece demasiado, reduce a un requisito, un archivo principal y una condición de éxito.'
        },
        'm-herramientas-ia': {
            goal: 'Elegir una herramienta por necesidad, privacidad, costo de cambio y capacidad de verificación.',
            prompt: `Compara opciones para esta tarea de pruebas sin asumir que la más autónoma es mejor:\n\n[TAREA, LENGUAJE, CAPA, RESTRICCIONES Y DATOS]\n\nCriterios: acceso requerido, privacidad, funcionamiento local, costo, formato de salida, integración, posibilidad de revisión y dependencia del proveedor. Marca la información que puede haber cambiado y debe verificarse en documentación oficial.`,
            verify: 'Confirma condiciones vigentes en fuentes oficiales y prueba una tarea pequeña con datos ficticios antes de ampliar acceso.',
            cannotProve: 'Una demostración comercial o lista de funciones no prueba utilidad, seguridad ni compatibilidad con tu proyecto.',
            humanDecision: 'Escoge la opción con el menor acceso necesario y conserva una ruta para cambiar de proveedor.',
            recovery: 'Si dos opciones parecen iguales, compara una misma tarea, el resultado ejecutable y el esfuerzo de revisión humana.'
        },
        'm-reto': {
            goal: 'Integrar requisito, riesgo, prueba, resultado y decisión en una evidencia defendible.',
            prompt: `Revisa mi cierre de calidad como una persona evaluadora crítica:\n\n[REQUISITO, MATRIZ, PRUEBAS, RESULTADOS Y DEFECTOS]\n\nConstruye una tabla de trazabilidad requisito → riesgo → caso → resultado observado → evidencia → riesgo residual. Señala contradicciones, afirmaciones sin respaldo y trabajo no ejecutado. Propón preguntas para mi defensa; no asignes aprobación ni juicio institucional.`,
            verify: 'Abre cada evidencia, reproduce al menos un caso crítico y confirma que la conclusión no exceda el alcance ejecutado.',
            cannotProve: 'La IA no puede emitir el juicio del instructor ni certificar competencia o ausencia de defectos.',
            humanDecision: 'Explica qué puede avanzar, qué se detiene, qué queda pendiente y quién acepta el riesgo residual.',
            recovery: 'Si la conclusión dice “todo está bien”, reemplázala por probado, no probado, defectos abiertos, límites y siguiente decisión.'
        }
    };
})(window);

