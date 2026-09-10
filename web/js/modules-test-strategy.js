// Estrategia, diagnóstico y mantenimiento: complementos de la ruta básica.
window.MODULES["m-piramide"].blocks.push(
    {
        type: "comparison", title: "Nivel, tipo, técnica y método son ejes distintos",
        headers: ["Eje", "Pregunta", "Ejemplos"],
        rows: [
            ["Nivel / alcance", "¿Qué parte del sistema conecta la prueba?", "Unidad o componente; integración entre partes; sistema completo; aceptación de necesidades."],
            ["Tipo", "¿Qué cualidad comprueba?", "Funcionalidad, rendimiento, seguridad, accesibilidad o compatibilidad."],
            ["Técnica", "¿Cómo se eligen los casos?", "Particiones, límites, decisiones, estados y cobertura estructural."],
            ["Ejecución", "¿Quién realiza la comprobación?", "Manual, automatizada o una combinación."],
            ["Método de desarrollo", "¿Cómo se guía el trabajo?", "TDD, BDD o ATDD."],
            ["Ejemplo combinado", "Una prueba puede pertenecer a varios ejes.", "Prueba funcional automatizada de integración, diseñada por límites y acordada en BDD."]
        ]
    },
    {
        type: "comparison", title: "Escoge el alcance más útil para el riesgo",
        headers: ["Alcance", "Qué demuestra", "Qué no demuestra solo"],
        rows: [
            ["Unidad / componente", "La regla dentro de una función o componente bajo condiciones controladas.", "Que funcionan red, servidor o base de datos reales."],
            ["Integración", "Que dos o más partes colaboran: servicio–repositorio o API–persistencia.", "Todo el recorrido visible de una persona."],
            ["Contrato", "Que proveedor y consumidor respetan mensajes y condiciones acordadas.", "Todas las reglas internas ni toda la experiencia de usuario."],
            ["Sistema / E2E", "Comportamiento del conjunto y recorridos completos dentro del entorno elegido.", "Todas las combinaciones de datos y estados."],
            ["Aceptación", "Que se cumplen necesidades y criterios acordados con quien recibe el producto.", "Una aprobación automática sin evaluación del alcance."]
        ]
    },
    {
        type: "comparison", title: "Anatomía de una prueba: preparar–actuar–comprobar",
        headers: ["Parte", "Responsabilidad", "Caso CP-05"],
        rows: [
            ["Preparar / Arrange", "Datos, estado y dependencias conocidos.", "Usuario con permiso, 10 equipos y cantidad 6."],
            ["Actuar / Act", "Una acción relevante.", "Solicitar el préstamo."],
            ["Comprobar / Assert", "Resultado y efectos contra el oráculo.", "Rechazo, ningún préstamo creado y siguen disponibles 10 equipos."],
            ["Limpiar / teardown", "Dejar el entorno listo para la siguiente prueba.", "Eliminar los datos propios o revertir la transacción."]
        ]
    },
    {
        type: "comparison", title: "Fixtures y dobles de prueba sin confundirlos",
        headers: ["Concepto", "Para qué sirve", "Límite"],
        rows: [
            ["Fixture", "Prepara y limpia datos o recursos reproducibles.", "No es necesariamente un doble; puede crear una base de datos de prueba real."],
            ["Dummy", "Argumento obligatorio que no se usa en el caso.", "No aporta comportamiento."],
            ["Stub", "Devuelve respuestas preparadas de una dependencia.", "No demuestra que el servicio real responda así."],
            ["Spy", "Registra llamadas para verificarlas después.", "Verifica interacción, no necesariamente resultado de negocio."],
            ["Mock", "Doble con expectativas de interacción.", "Verificar demasiados detalles internos vuelve frágil la prueba."],
            ["Fake", "Implementación simplificada funcional, como un repositorio en memoria.", "Puede diferir del comportamiento de producción."]
        ]
    },
    {
        type: "alert", variant: "warning", title: "Aislamiento, determinismo y asincronía",
        body: "Cada prueba debe crear sus datos y poder ejecutarse sola o en otro orden. Controla reloj y aleatoriedad cuando afectan expectativas; usa datos sintéticos y limpia recursos. Para operaciones asíncronas espera una condición con plazo, no un tiempo fijo arbitrario. SQLite o un repositorio en memoria no demuestran compatibilidad completa con PostgreSQL; prueba también la integración real que dependa de sus funciones."
    },
    {
        type: "steps", title: "Pruebas manuales y exploratorias con evidencia",
        steps: [
            { title: "Ejecuta un caso documentado", desc: "CP-05: registra versión, ambiente, usuario de prueba, 10 equipos disponibles, cantidad 6, pasos y resultado esperado. Ejecuta la solicitud y anota el observado. Si el ambiente no está disponible, marca bloqueada." },
            { title: "Explora con una misión", desc: "Durante 15 minutos, intenta producir una solicitud incoherente mediante recarga, doble envío y navegación hacia atrás. La prueba exploratoria combina aprender, diseñar y ejecutar; no es hacer clic sin objetivo." },
            { title: "Conserva un informe de sesión", desc: "Anota misión, tiempo, datos, pasos útiles, hallazgos, dudas y lo no probado. Convierte los hallazgos repetibles en casos de regresión. Sin aplicativo disponible, practica el diseño y rotúlalo como diseño sin ejecutar." }
        ]
    },
    {
        type: "comparison", title: "Reporte de defecto resuelto y trazabilidad",
        headers: ["Campo", "Ejemplo ficticio"],
        rows: [
            ["Identificador y título", "DEF-01 · Se acepta una cantidad superior al máximo."],
            ["Versión y ambiente", "Versión de práctica A; navegador y sistema registrados por quien ejecuta."],
            ["Precondiciones y pasos", "Permiso activo, 10 equipos. Solicitar 6 y consultar préstamo y existencias."],
            ["Esperado / observado", "Esperado: rechazo y 10 disponibles. Observado hipotético: préstamo creado y 4 disponibles."],
            ["Severidad / prioridad", "Severidad: impacto del defecto, aquí incumplimiento de una regla. Prioridad: cuándo corregir, acordada según frecuencia, exposición y entrega."],
            ["Trazabilidad", "R-CANT → riesgo de préstamo excesivo → CP-05 → ejecución E-01 → DEF-01 → corrección → repetición."],
            ["Cierre", "Repetir CP-05 confirma la corrección; ejecutar casos relacionados busca regresiones. Conservar ambas evidencias."]
        ]
    },
    {
        type: "alert", variant: "success", title: "Cierra el diseño y elige tu siguiente paso",
        body: "Completa ART-TEST-01 con alcance, riesgo, casos, esperado y lo no probado. Prioriza por probabilidad e impacto; usa escalas justificadas, no cifras universales. Lee TDD y BDD para entender cómo se guía el desarrollo; después elige una variante: FastAPI, Flask, React o Java. No necesitas instalar las cuatro."
    }
);
window.MODULES["m-cobertura"].blocks.unshift(
    {
        type: "comparison", title: "Confianza: métricas que responden preguntas distintas",
        headers: ["Métrica", "Qué mide", "Cómo interpretarla"],
        rows: [
            ["Cobertura de requisitos", "Requisitos con pruebas y resultados vinculados / requisitos en alcance.", "Un requisito con solo caso feliz puede seguir dejando riesgos."],
            ["Cobertura de líneas", "Líneas ejecutables recorridas por las pruebas.", "Recorrer una línea no demuestra que su resultado se comprobó."],
            ["Cobertura de ramas", "Alternativas de decisiones recorridas.", "Complementa líneas; todavía exige aserciones relevantes."],
            ["Tasa de aprobación", "Pruebas aprobadas sobre el conjunto declarado.", "Informa por separado fallidas, omitidas y bloqueadas."],
            ["Mutación", "Cuántos cambios artificiales del código detectan las pruebas.", "Un mutante superviviente puede señalar una comprobación débil; revisa también equivalentes y casos no cubiertos."]
        ]
    },
    {
        type: "alert", variant: "warning", title: "Ejercicio: una línea cubierta con una prueba inútil",
        body: "Si ejecutas cantidad_valida(6) sin assert, recorres el código pero no compruebas el rechazo. Una mutación que cambie el máximo a 6 puede sobrevivir. Agrega assert cantidad_valida(6) is False: ahora detecta esa alteración. Es una demostración de mutación manual, no una medición completa de mutation testing."
    },
    {
        type: "comparison", title: "Regresión, humo, confirmación y pruebas intermitentes",
        headers: ["Concepto", "Uso y ejemplo"],
        rows: [
            ["Confirmación / retest", "Repetir el caso del defecto para comprobar su corrección."],
            ["Regresión", "Buscar efectos no deseados en comportamientos que antes funcionaban."],
            ["Humo / smoke", "Conjunto breve de comprobaciones críticas para saber si se puede continuar evaluando."],
            ["Sanity", "Etiqueta usada por equipos para una revisión focalizada; acuerda su alcance porque el uso varía."],
            ["Intermitente / flaky", "Alterna entre pasar y fallar sin cambios relevantes; investiga datos, orden, red, reloj y esperas."],
            ["Frágil / brittle", "Falla por cambios internos o visuales que conservan el comportamiento requerido."],
            ["Reintentos", "Pueden aportar diagnóstico; no resuelven la causa. Si aíslas una prueba, registra responsable, riesgo y fecha de revisión."]
        ]
    },
    {
        type: "comparison", title: "Base práctica de pruebas no funcionales",
        headers: ["Dimensión", "Práctica", "Qué registrar"],
        rows: [
            ["Accesibilidad", "Recorre préstamo y errores solo con teclado; revisa etiquetas, foco, mensajes y zoom. Complementa con lector de pantalla y análisis automático.", "Pasos, barreras y criterio aplicable. Un escáner no cubre toda la accesibilidad."],
            ["Seguridad", "En ambiente autorizado, intenta acceder a un préstamo de otro usuario o rol; comprueba denegación y ausencia de cambios.", "Actor, recurso, permiso esperado y observado. Autenticación identifica; autorización permite. UUID no sustituye permisos."],
            ["Rendimiento", "Carga: demanda prevista; estrés: superar capacidad; resistencia: sostenerla en el tiempo. Define escenario y calentamiento.", "Volumen, duración, percentiles como p95, tasa de errores, entorno y umbral acordado; el promedio solo puede ocultar lentitud."],
            ["Compatibilidad y usabilidad", "Prueba navegadores y dispositivos relevantes; observa si una persona comprende el formulario y los errores.", "Matriz de entornos y tarea observada; que algo sea accesible no garantiza que sea fácil de usar."],
            ["Recuperación y resiliencia", "Simula una dependencia no disponible en pruebas y verifica mensaje, recuperación y consistencia.", "Tiempo de recuperación, datos conservados y efectos duplicados. Reintentar no debe cobrar o reservar dos veces."]
        ]
    },
    {
        type: "comparison", title: "API, datos y concurrencia: contrato antes del código HTTP",
        headers: ["Situación", "Qué comprobar además del estado HTTP"],
        rows: [
            ["Éxito", "Esquema, tipos, contenido, persistencia y efecto exacto; volver a consultar el recurso."],
            ["Entrada inválida", "Mensaje útil y ningún cambio parcial. Elegir 400 o 422 según contrato."],
            ["Sin autenticación / sin permiso", "Diferenciar 401 y 403 según contrato, sin revelar datos de otros usuarios."],
            ["Recurso inexistente", "Respuesta prevista, por ejemplo 404, y ningún efecto lateral."],
            ["Conflicto o duplicación", "Estado consistente; 409 cuando así lo define el contrato. Una solicitud repetida no debe duplicar una operación crítica."],
            ["Concurrencia / idempotencia", "Dos solicitudes que compiten no dejan inventario negativo. Repetir la misma intención conserva el efecto acordado; comprueba transacciones y claves de idempotencia si aplican."]
        ]
    },
    {
        type: "steps", title: "Criterios de entrada, salida y riesgo residual",
        steps: [
            { title: "Antes de ejecutar", desc: "Comprueba que están disponibles versión, ambiente, datos, reglas y herramientas. Si falta una dependencia necesaria, registra bloqueo y responsable." },
            { title: "Antes de entregar", desc: "Define qué pruebas son obligatorias y qué defectos impiden avanzar. Ejemplo contextual: criterios críticos comprobados, ningún defecto crítico abierto y resultados de la revisión exacta disponibles." },
            { title: "Declara el riesgo que permanece", desc: "Resume probado/no probado, defectos abiertos, limitaciones del entorno y quién toma la decisión. Un 80 % de cobertura o una suite verde no reemplazan la aceptación de ese riesgo." }
        ]
    }
);
