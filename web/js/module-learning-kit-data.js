/** Datos didacticos del kit de comprension. Los porcentajes son enfasis sugerido, no metricas del proyecto. */
(function (global) {
    'use strict';

    const commonFlow = [
        ['01', 'Ubica', 'Nombra la regla o riesgo que vas a estudiar.'],
        ['02', 'Decide', 'Elige una pregunta que pueda responderse con evidencia.'],
        ['03', 'Practica', 'Prueba un caso pequeño y observa la señal.'],
        ['04', 'Explica', 'Conserva el resultado y justifica tu siguiente paso.']
    ];

    const kits = {
        'm-reflexion': {
            focus: 'Riesgo antes que herramienta',
            metrics: [['Riesgo', 90], ['Barreras', 78], ['Evidencia', 66]],
            table: [['Una falla cuesta caro', 'El impacto guia la prioridad', 'Describe el riesgo antes del test'], ['Un cambio llega a produccion', 'Puede romper un comportamiento', 'Agrega regresion y revision'], ['El equipo crece', 'La memoria no puede ser individual', 'Deja una prueba reproducible']],
            scenario: ['Detectas un modo de prueba activo en una version candidata. ¿Qué haces primero?', ['Publicar y mirar los registros', 'Detener la salida, comprobar la configuracion y registrar el riesgo', 'Eliminar todos los tests'], 1, 'La primera barrera es detener la exposicion y obtener evidencia. Luego se corrige y se repite la verificacion.']
        },
        'm-piramide': {
            focus: 'Regla → caso → capa',
            metrics: [['Oráculo', 94], ['Casos borde', 86], ['Capa adecuada', 72]],
            table: [['Cantidad en el límite', 'Puede revelar validaciones incorrectas', 'Prueba frontera inferior y superior'], ['Permiso ausente', 'El flujo debe ser rechazado', 'Agrega caso de autorización'], ['La pantalla cambia', 'El selector puede volverse frágil', 'Usa intención del usuario']],
            scenario: ['La regla acepta de 1 a 5 equipos. ¿Qué conjunto descubre mejor los límites?', ['1, 2 y 3', '0, 1, 3, 5 y 6', 'Solo 5'], 1, 'Los límites y un representante de la partición válida dan más información que repetir valores del centro.']
        },
        'm-pytest-fastapi': {
            focus: 'Aislar la API y su contrato',
            metrics: [['Aislamiento', 91], ['Contrato HTTP', 88], ['Diagnóstico', 76]],
            table: [['Respuesta 422', 'La entrada no cumple el contrato', 'Lee el detalle antes de cambiar código'], ['Base de datos de prueba', 'Evita contaminar datos reales', 'Usa fixture y limpieza'], ['Endpoint CRUD', 'Debe validar estado y cuerpo', 'Aserta código y contenido']],
            scenario: ['Un caso recibe 422 aunque esperabas 201. ¿Cuál es el siguiente paso?', ['Cambiar 422 por 201', 'Inspeccionar el cuerpo de error y comparar el esquema enviado', 'Desactivar la validación'], 1, 'El contrato explica el rechazo. Inspeccionar el detalle conserva la causa y evita ocultar un defecto.']
        },
        'm-pytest-flask': {
            focus: 'Rutas, sesión y contexto',
            metrics: [['Contexto', 88], ['Respuesta web', 84], ['Aislamiento', 80]],
            table: [['Redirección inesperada', 'Puede faltar sesión o permiso', 'Aserta destino y estado'], ['Formulario inválido', 'La aplicación debe informar el error', 'Envía datos inválidos y verifica el mensaje'], ['Estado entre pruebas', 'Hay contaminación de datos', 'Crea y limpia por caso']],
            scenario: ['Un test pasa solo cuando se ejecuta después de otro. ¿Qué sospechas?', ['Un test dependiente del estado compartido', 'Que la cobertura es suficiente', 'Que debes agregar una espera fija'], 0, 'El orden no debe cambiar el resultado. Aísla los datos, la sesión y el contexto de la aplicación.']
        },
        'm-jest-react': {
            focus: 'La interfaz desde la intención',
            metrics: [['Comportamiento', 92], ['Accesibilidad', 82], ['Estado', 79]],
            table: [['La persona ve un error', 'El estado de la interfaz comunica una regla', 'Busca el mensaje con un rol o texto'], ['Un botón se deshabilita', 'Evita una acción duplicada', 'Aserta estado y efecto'], ['Un componente recibe datos', 'La vista depende de un contrato', 'Prueba carga, vacío y error']],
            scenario: ['¿Qué aserción representa mejor una prueba de un botón de guardar?', ['Que exista un div con una clase', 'Que la persona vea “Guardado” después de activar el botón', 'Que el componente tenga 100% de cobertura'], 1, 'Una aserción de usuario comprueba el resultado observable, no la forma interna del componente.']
        },
        'm-junit-jsp': {
            focus: 'Comportamiento Java con dobles',
            metrics: [['Contrato', 90], ['Dobles', 83], ['Excepciones', 77]],
            table: [['Servicio con dependencia externa', 'No conviene llamar al proveedor real', 'Usa un doble con una respuesta explícita'], ['DAO sin registro', 'Es una decisión observable', 'Aserta excepción o resultado esperado'], ['Prueba parametrizada', 'Una regla tiene varias entradas', 'Reutiliza el escenario con datos claros']],
            scenario: ['Un servicio debe rechazar una cantidad negativa. ¿Qué caso agrega más valor?', ['Verificar que el método se llama', 'Enviar -1 y comprobar la excepción y que no se guarda', 'Medir solo las líneas ejecutadas'], 1, 'El caso valida la regla y el efecto secundario: rechazar y no persistir.']
        },
        'm-tdd': {
            focus: 'Diseñar con rojo, verde y refactor',
            metrics: [['Contrato', 94], ['Retroalimentación', 86], ['Diseño', 74]],
            table: [['Rojo', 'La regla aún no está implementada', 'Escribe una aserción que falle por la razón correcta'], ['Verde', 'La implementación cumple el caso', 'No agregues alcance innecesario'], ['Refactor', 'La estructura puede mejorar sin cambiar conducta', 'Repite la suite después del ajuste']],
            scenario: ['Vas a crear una función para calcular un descuento. ¿Qué haces primero?', ['Implementar todos los casos', 'Escribir el caso mínimo y observar que falle', 'Subir cobertura sin definir el resultado'], 1, 'TDD empieza con un contrato pequeño y observable. El fallo inicial demuestra que la prueba sí puede detectar ausencia de conducta.']
        },
        'm-bdd': {
            focus: 'Hablar el mismo idioma del negocio',
            metrics: [['Criterio', 93], ['Ejemplo', 87], ['Automatización', 68]],
            table: [['Dado', 'Prepara el contexto', 'Declara usuario, datos y condición inicial'], ['Cuando', 'Describe la acción', 'Usa una acción que la persona reconoce'], ['Entonces', 'Expresa el resultado', 'Escribe una señal observable']],
            scenario: ['¿Cuál escenario comunica mejor una regla de acceso?', ['Dado un préstamo de 6 equipos, cuando valido su cantidad, entonces se rechaza', 'Dado botón azul, cuando hay clic, entonces se llama una función', 'Dado que todo funciona, entonces pasa'], 0, 'BDD conecta contexto, acción y resultado. El escenario debe poder leerlo una persona del negocio.']
        },
        'm-playwright': {
            focus: 'Recorrer un objetivo real',
            metrics: [['Flujo crítico', 92], ['Localizadores', 88], ['Diagnóstico', 81]],
            table: [['Localizador por texto', 'Puede cambiar con el contenido', 'Prefiere rol, etiqueta o intención'], ['Espera fija', 'Hace lento y frágil el test', 'Espera una señal observable'], ['Falla de navegador', 'No siempre es defecto de aplicación', 'Clasifica etapa, datos y evidencia']],
            scenario: ['La pantalla tarda más en cargar y el E2E falla con una espera fija. ¿Qué mejoras?', ['Aumentar la espera a 60 segundos', 'Esperar el estado o elemento que demuestra que el flujo puede continuar', 'Quitar la aserción'], 1, 'Una espera orientada a la señal se adapta al entorno y mantiene el objetivo del test.']
        },
        'm-cobertura': {
            focus: 'Leer cobertura con contexto',
            metrics: [['Riesgo', 91], ['Ramas', 86], ['Decisión', 78]],
            table: [['Línea ejecutada', 'No prueba que el resultado sea correcto', 'Revisa la aserción y el riesgo'], ['Rama no cubierta', 'Existe una decisión sin evidencia', 'Agrega el caso si importa al negocio'], ['Umbral acordado', 'Es un criterio de salida del equipo', 'Documenta por qué aplica']],
            scenario: ['La cobertura sube a 100 %, pero no hay un caso de autorización. ¿Qué concluyes?', ['Que el sistema está libre de defectos', 'Que falta evidencia de un riesgo aunque todas las líneas se ejecuten', 'Que debes quitar el caso'], 1, 'Cobertura indica ejecución, no correctitud. La autorización necesita un caso con una aserción útil.']
        },
        'm-cicd': {
            focus: 'Convertir calidad en compuerta',
            metrics: [['Repetibilidad', 93], ['Retroalimentación', 85], ['Trazabilidad', 80]],
            table: [['Cambio enviado', 'Activa una verificación reproducible', 'Ejecuta el flujo definido'], ['Suite roja', 'El resultado contradice el criterio', 'Detén la publicación y conserva el reporte'], ['Compuerta verde', 'Las verificaciones acordadas pasaron', 'Publica con una versión identificable']],
            scenario: ['Una suite falla en la integración continua, pero pasa en tu computador. ¿Qué haces?', ['Permitir el despliegue porque local pasó', 'Comparar ambiente, datos y reporte antes de decidir', 'Reintentar sin revisar'], 1, 'La diferencia es una señal de ambiente o de defecto. El reporte y las versiones ayudan a clasificarla.']
        },
        'm-observabilidad': {
            focus: 'Ver qué ocurrió después de probar',
            metrics: [['Señales', 90], ['Contexto', 84], ['Respuesta', 76]],
            table: [['Latencia p95', 'Muestra la cola de experiencias lentas', 'Relaciona versión y ruta'], ['Error 5xx', 'Puede afectar a muchas personas', 'Correlaciona registro y solicitud'], ['Traza incompleta', 'No permite seguir el recorrido', 'Agrega contexto sin secretos']],
            scenario: ['Aumentan los errores después de una versión. ¿Qué dato comparas primero?', ['Solo el promedio de latencia', 'Versión, ruta, hora y tipo de error en los registros', 'El color del tablero'], 1, 'La observabilidad une señal y contexto. Nunca registres tokens, contraseñas ni datos personales innecesarios.']
        },
        'm-ia-testing': {
            focus: 'IA como apoyo, humano como oráculo',
            metrics: [['Contexto', 93], ['Verificación', 91], ['Velocidad', 72]],
            table: [['Código sugerido', 'Puede inventar nombres o contratos', 'Comprueba archivos, imports y ejecución'], ['Test generado', 'Puede pasar aunque el código esté roto', 'Pregunta qué defecto detectaría'], ['Dato compartido', 'Puede incluir información sensible', 'Anonimiza y usa marcadores']],
            scenario: ['Un asistente genera diez tests que pasan sin leer requisitos. ¿Qué haces?', ['Aceptarlos por la cantidad', 'Revisar trazabilidad, aserciones y datos antes de ejecutarlos', 'Compartir secretos para darle más contexto'], 1, 'La IA acelera borradores; la persona conserva el criterio, la privacidad y la responsabilidad de verificar.']
        },
        'm-gema-testing': {
            focus: 'Convertir contexto en encargo verificable',
            metrics: [['Contexto', 94], ['Criterios', 90], ['Entrega', 79]],
            table: [['Riesgo declarado', 'La IA puede priorizar con sentido', 'Escribe qué no puede fallar'], ['Criterio de terminado', 'Evita una salida ambigua', 'Define evidencia y comando'], ['Salida generada', 'Es un borrador de trabajo', 'Ejecuta y registra lo que verificaste']],
            scenario: ['La instrucción QA no menciona el comando de pruebas. ¿La entregas?', ['Sí, la IA lo adivinará', 'No; completa el contexto y exige un criterio verificable', 'Eliminas la matriz'], 1, 'Un encargo útil tiene alcance, herramienta, evidencia y criterio de terminado explícitos.']
        },
        'm-herramientas-ia': {
            focus: 'Elegir por necesidad y control',
            metrics: [['Necesidad', 93], ['Privacidad', 88], ['Costo', 71]],
            table: [['Necesidad concreta', 'Cada herramienta tiene un alcance', 'Define la capa antes de elegir'], ['Plan o licencia', 'Puede cambiar disponibilidad', 'Confirma condiciones actuales'], ['Propuesta automática', 'No es autoridad final', 'Contrasta con la suite del proyecto']],
            scenario: ['Buscas cubrir una API pequeña sin entregar el repositorio completo. ¿Qué criterio priorizas?', ['La herramienta que produce más archivos', 'Alcance mínimo, privacidad y una tarea medible', 'La que tenga más colores'], 1, 'Elegir bien reduce exposición y permite comparar un resultado concreto con tu propia suite.']
        },
        'm-reto': {
            focus: 'Integrar la calidad en una entrega',
            metrics: [['Trazabilidad', 95], ['Automatización', 90], ['Comunicación', 82]],
            table: [['Requisito', 'Define qué debe demostrarse', 'Relaciona caso y evidencia'], ['Fallo', 'Es una oportunidad de diagnóstico', 'Conserva resultado y corrección'], ['Entrega final', 'Debe ser reproducible', 'Incluye comandos, límites y reportes']],
            scenario: ['Tu equipo tiene pruebas unitarias y E2E, pero no puede explicar qué riesgo cubre cada una. ¿Qué falta?', ['Más pruebas al azar', 'Una matriz de trazabilidad entre requisito, caso, evidencia y resultado', 'Un nuevo logotipo'], 1, 'La trazabilidad convierte una colección de tests en una decisión de calidad explicable.']
        }
    };

    const moduleInsights = {
        'm-reflexion': {
            moduleNumber: '01', visual: 'risk', visualLabel: 'Riesgo',
            eyebrow: 'FUNDAMENTO · DECISIÓN', headline: 'Detén el defecto antes de que escale',
            intro: 'Convierte una preocupación difusa en una barrera observable: impacto, probabilidad y una decisión que el equipo pueda revisar.',
            question: '¿Qué podría salir mal y qué control lo detiene?', signal: 'Una barrera definida', evidence: 'Registro de riesgo y decisión',
            flow: [['01', 'Observa', 'Nombra el riesgo que podría llegar a producción.'], ['02', 'Acota', 'Separa causa, impacto y barrera disponible.'], ['03', 'Detén', 'Elige un control que limite la exposición.'], ['04', 'Demuestra', 'Registra la señal y la decisión del equipo.']],
            special: { type: 'matrix', label: 'Mapa rápido de riesgo', title: 'Ubica el escenario en una matriz', prompt: 'Si un modo de prueba queda activo, valora su impacto y la probabilidad de exposición.', success: 'La prioridad nace de combinar impacto y probabilidad, no de adivinar una herramienta.' }
        },
        'm-piramide': {
            moduleNumber: '02', visual: 'layers', visualLabel: 'Capas',
            eyebrow: 'FUNDAMENTO · DISEÑO', headline: 'Elige la capa que responde tu pregunta',
            intro: 'La pirámide no impone porcentajes: relaciona riesgo, velocidad y alcance para decidir dónde una prueba entrega mejor evidencia.',
            question: '¿Qué capa puede responderlo con menos costo?', signal: 'Resultado esperado', evidence: 'Matriz de casos y capa',
            flow: [['01', 'Formula', 'Escribe la regla y el resultado correcto.'], ['02', 'Fronteras', 'Busca límites, particiones y permisos.'], ['03', 'Escoge', 'Asigna la capa que aporta la señal.'], ['04', 'Transfiere', 'Cambia el ejemplo por una regla propia.']],
            special: { type: 'choice', variant: 'layer', label: 'Selector de capa', title: 'Una regla acepta de 1 a 5 equipos', prompt: '¿Qué combinación entrega evidencia sobre límites y autorización?', options: ['Solo un recorrido completo con cantidad 3', 'Valores 0, 1, 3, 5, 6 y un caso sin permiso', 'Repetir cinco veces el valor 3'], answer: 1, success: 'La combinación cubre fronteras, partición válida y permiso. Después puedes distribuirla en la capa adecuada.' }
        },
        'm-pytest-fastapi': {
            moduleNumber: '05', visual: 'contract', visualLabel: 'Contrato',
            eyebrow: 'PRÁCTICA · API', headline: 'Lee el contrato antes de culpar al endpoint',
            intro: 'Aísla la API, prepara datos controlados y usa la respuesta HTTP como una señal que explica qué parte del contrato se cumplió o se rompió.',
            question: '¿Qué entrada, respuesta y estado deben coincidir?', signal: 'Código y cuerpo HTTP', evidence: 'Reporte de prueba con detalle',
            flow: [['01', 'Contrata', 'Define entrada, salida y estado esperado.'], ['02', 'Aísla', 'Prepara fixture y datos limpios.'], ['03', 'Solicita', 'Envía una petición mínima y reproducible.'], ['04', 'Compara', 'Lee el cuerpo, no solo el código.']],
            special: { type: 'choice', variant: 'contract', label: 'Inspector de contrato', title: 'El caso recibe 422 y esperabas 201', prompt: '¿Qué evidencia consultas primero?', options: ['Cambiar 422 por 201 en la aserción', 'Leer el detalle de validación y comparar el esquema enviado', 'Desactivar la validación para que pase'], answer: 1, success: 'El detalle de validación mantiene visible la causa y permite corregir el dato o el contrato con evidencia.' }
        },
        'm-pytest-flask': {
            moduleNumber: '06', visual: 'context', visualLabel: 'Contexto',
            eyebrow: 'PRÁCTICA · WEB', headline: 'Haz que cada ruta empiece y termine limpia',
            intro: 'Sesión, contexto y datos compartidos pueden disfrazar una falla. El objetivo es que cada prueba conserve el mismo resultado sin importar el orden.',
            question: '¿Qué estado debe aislarse para repetir el caso?', signal: 'Resultado independiente', evidence: 'Caso reproducible y limpio',
            flow: [['01', 'Prepara', 'Crea aplicación, cliente y datos de prueba.'], ['02', 'Actúa', 'Envía la ruta con la sesión necesaria.'], ['03', 'Observa', 'Compara destino, estado y mensaje.'], ['04', 'Limpia', 'Elimina contaminación antes del siguiente caso.']],
            special: { type: 'choice', variant: 'context', label: 'Detective de aislamiento', title: 'Una prueba solo pasa después de otra', prompt: '¿Qué hipótesis tiene más valor investigar?', options: ['Un test depende de sesión o datos compartidos', 'La cobertura ya es suficiente', 'Agregar una espera fija al final'], answer: 0, success: 'El orden no debe cambiar el resultado. Aísla sesión, base de datos y contexto antes de tocar la aserción.' }
        },
        'm-jest-react': {
            moduleNumber: '07', visual: 'interface', visualLabel: 'Interfaz',
            eyebrow: 'PRÁCTICA · INTERFAZ', headline: 'Prueba lo que la persona puede observar',
            intro: 'Un componente demuestra calidad cuando comunica estados y efectos comprensibles: carga, vacío, error, acción confirmada y accesibilidad.',
            question: '¿Qué señal ve la persona después de actuar?', signal: 'Estado visible y accesible', evidence: 'Aserción orientada a usuario',
            flow: [['01', 'Intenta', 'Define el objetivo que la persona reconoce.'], ['02', 'Renderiza', 'Prepara datos, carga o error.'], ['03', 'Actúa', 'Usa rol, etiqueta o intención.'], ['04', 'Confirma', 'Aserta el cambio que puede observarse.']],
            special: { type: 'choice', variant: 'interface', label: 'Señal de usuario', title: 'Elige la aserción que protege el comportamiento', prompt: '¿Cuál aserción conserva la intención de un botón de guardar?', options: ['Existe un div con una clase específica', 'La persona ve “Guardado” después de activar el botón', 'El componente tiene 100 % de cobertura'], answer: 1, success: 'La aserción protege el resultado visible y deja libertad para cambiar la estructura interna.' }
        },
        'm-junit-jsp': {
            moduleNumber: '08', visual: 'java', visualLabel: 'Unidad',
            eyebrow: 'PRÁCTICA · JAVA', headline: 'Aísla la unidad y conserva la regla',
            intro: 'JUnit ejecuta el caso y los dobles controlan las dependencias. La evidencia debe demostrar la regla y también que no ocurrió un efecto indebido.',
            question: '¿Qué pasa con la dependencia cuando la regla rechaza?', signal: 'Resultado y efecto secundario', evidence: 'Excepción y verificación del doble',
            flow: [['01', 'Define', 'Escribe la regla y la excepción esperada.'], ['02', 'Sustituye', 'Aísla DAO o proveedor externo.'], ['03', 'Ejecuta', 'Envía una entrada límite o inválida.'], ['04', 'Verifica', 'Confirma resultado y ausencia de guardado.']],
            special: { type: 'choice', variant: 'java', label: 'Decisión con dobles', title: 'Una cantidad negativa debe rechazarse', prompt: '¿Qué caso entrega la evidencia más completa?', options: ['Verificar únicamente que se llamó un método', 'Enviar -1, comprobar la excepción y confirmar que no se guarda', 'Medir solo las líneas ejecutadas'], answer: 1, success: 'La prueba conserva la regla y su efecto secundario: rechazar la entrada y no persistir información inválida.' }
        },
        'm-tdd': {
            moduleNumber: '03', visual: 'cycle', visualLabel: 'Ciclo',
            eyebrow: 'MÉTODO · DISEÑO', headline: 'Usa el fallo para diseñar mejor',
            intro: 'TDD convierte una regla en una conversación corta entre prueba e implementación: rojo, verde y refactor con una suite que vuelve a dar confianza.',
            question: '¿Qué aprendizaje te entrega el siguiente fallo?', signal: 'Fallo por la razón correcta', evidence: 'Suite repetida tras refactor',
            flow: [['01', 'Rojo', 'Escribe el caso mínimo y observa que falle.'], ['02', 'Verde', 'Implementa solo lo que el caso exige.'], ['03', 'Refactor', 'Mejora la estructura sin cambiar conducta.'], ['04', 'Repite', 'Ejecuta la suite y conserva el resultado.']],
            special: { type: 'sequence', variant: 'cycle', label: 'Secuencia TDD', title: 'Completa el ciclo en el orden correcto', prompt: 'Selecciona el siguiente paso. Si te equivocas, el ciclo te lo muestra.', sequence: ['Rojo', 'Verde', 'Refactor'], success: 'El ciclo evita diseñar a ciegas: cada cambio nace de una regla y termina con una verificación.' }
        },
        'm-bdd': {
            moduleNumber: '04', visual: 'language', visualLabel: 'Lenguaje',
            eyebrow: 'MÉTODO · NEGOCIO', headline: 'Escribe escenarios que negocio pueda revisar',
            intro: 'BDD empieza por descubrir y acordar reglas con ejemplos. Gherkin ayuda a expresarlos; las pruebas automatizadas comprueban los escenarios elegidos.',
            question: '¿Qué resultado podría reconocer alguien del negocio?', signal: 'Escenario comprensible', evidence: 'Feature y pasos trazables',
            flow: [['01', 'Descubre', 'Conversa sobre reglas, ejemplos y preguntas.'], ['02', 'Formula', 'Acuerda contexto, acción y resultado observable.'], ['03', 'Automatiza', 'Conecta los ejemplos con comprobaciones del sistema.'], ['04', 'Revisa', 'Mantén escenarios y reglas cuando el producto cambia.']],
            special: { type: 'choice', variant: 'language', label: 'Constructor Gherkin', title: 'Elige el escenario que comunica una regla de acceso', prompt: '¿Cuál mantiene contexto, acción y resultado observable?', options: ['Dado un préstamo de 6 equipos, cuando valido su cantidad, entonces se rechaza', 'Dado botón azul, cuando hay clic, entonces se llama una función', 'Dado que todo funciona, entonces pasa'], answer: 0, success: 'El escenario habla de una persona y un resultado. La implementación puede cambiar sin romper el lenguaje del negocio.' }
        },
        'm-playwright': {
            moduleNumber: '09', visual: 'browser', visualLabel: 'Recorrido',
            eyebrow: 'VERIFICAR · E2E', headline: 'Sigue una señal real del navegador',
            intro: 'Un recorrido E2E debe proteger un objetivo crítico. Localiza por intención, espera una señal observable y conserva la traza cuando algo se aparte del resultado.',
            question: '¿Qué demuestra que el flujo puede continuar?', signal: 'Elemento o estado observable', evidence: 'Traza, captura y resultado',
            flow: [['01', 'Objetivo', 'Nombra lo que la persona quiere lograr.'], ['02', 'Localiza', 'Encuentra el control por intención.'], ['03', 'Espera', 'Usa el estado que habilita el siguiente paso.'], ['04', 'Demuestra', 'Aserta el resultado y guarda la traza.']],
            special: { type: 'choice', variant: 'browser', label: 'Detector de espera', title: 'La pantalla tarda más y falla una espera fija', prompt: '¿Qué cambio conserva el objetivo del recorrido?', options: ['Aumentar la espera a 60 segundos', 'Esperar el estado o elemento que demuestra que se puede continuar', 'Quitar la aserción final'], answer: 1, success: 'La espera orientada a una señal se adapta al entorno y conserva el propósito del caso.' }
        },
        'm-cobertura': {
            moduleNumber: '10', visual: 'coverage', visualLabel: 'Cobertura',
            eyebrow: 'VERIFICAR · MÉTRICAS', headline: 'Lee cobertura junto al riesgo',
            intro: 'Una línea ejecutada no equivale a una regla demostrada. Usa ramas, aserciones y umbrales para descubrir qué decisiones todavía no tienen evidencia.',
            question: '¿Qué parte del riesgo quedó sin probar?', signal: 'Rama con aserción útil', evidence: 'Reporte interpretado',
            flow: [['01', 'Mide', 'Observa líneas y ramas ejecutadas.'], ['02', 'Pregunta', 'Relaciona la cifra con un riesgo real.'], ['03', 'Completa', 'Agrega el caso que falta.'], ['04', 'Decide', 'Explica el umbral y su límite.']],
            special: { type: 'choice', variant: 'coverage', label: 'Lectura de cobertura', title: 'La cobertura llega a 100 %', prompt: 'No existe un caso de autorización. ¿Qué concluyes?', options: ['El sistema está libre de defectos', 'Falta evidencia de un riesgo aunque las líneas se ejecuten', 'Hay que quitar el caso de autorización'], answer: 1, success: 'La cifra muestra ejecución, no corrección. La autorización necesita una entrada, una aserción y un resultado verificable.' }
        },
        'm-cicd': {
            moduleNumber: '11', visual: 'pipeline', visualLabel: 'Compuerta',
            eyebrow: 'VERIFICAR · ENTREGA', headline: 'Haz que la calidad viaje con cada cambio',
            intro: 'Una compuerta útil es repetible y explicable: ejecuta la suite, conserva el reporte y detiene la publicación cuando el resultado contradice el criterio.',
            question: '¿Qué información permite decidir si se publica?', signal: 'Suite y reporte identificables', evidence: 'Resultado de compuerta',
            flow: [['01', 'Entra', 'Recibe un cambio identificable.'], ['02', 'Verifica', 'Ejecuta lint, pruebas y cobertura acordada.'], ['03', 'Clasifica', 'Compara ambiente, datos y reporte.'], ['04', 'Publica', 'Solo avanza con una versión trazable.']],
            special: { type: 'sequence', variant: 'pipeline', label: 'Flujo de compuerta', title: 'Completa el orden mínimo antes de publicar', prompt: 'Selecciona cada estación del flujo.', sequence: ['Cambio', 'Suite', 'Reporte', 'Publicación'], success: 'La entrega queda asociada a una verificación reproducible y a una decisión que el equipo puede explicar.' }
        },
        'm-observabilidad': {
            moduleNumber: '12', visual: 'signals', visualLabel: 'Señales',
            eyebrow: 'VERIFICAR · OPERACIÓN', headline: 'Relaciona la señal con su contexto',
            intro: 'Métricas, registros y trazas cuentan una historia distinta. Une versión, ruta, hora y tipo de error para decidir si observas un defecto o un problema de ambiente.',
            question: '¿Qué contexto convierte un número en diagnóstico?', signal: 'Señal correlacionada', evidence: 'Registro sin secretos',
            flow: [['01', 'Señala', 'Observa latencia, error o traza incompleta.'], ['02', 'Contextualiza', 'Une versión, ruta y hora del evento.'], ['03', 'Correlaciona', 'Compara registros y solicitudes.'], ['04', 'Responde', 'Registra la causa probable y el siguiente paso.']],
            special: { type: 'choice', variant: 'signals', label: 'Radar de señales', title: 'Aumentan los errores después de una versión', prompt: '¿Qué conjunto comparas primero?', options: ['Solo el promedio de latencia', 'Versión, ruta, hora y tipo de error en los registros', 'El color del tablero'], answer: 1, success: 'La correlación une señal y contexto. Mantén fuera tokens, contraseñas y datos personales innecesarios.' }
        },
        'm-ia-testing': {
            moduleNumber: '13', visual: 'ai', visualLabel: 'Criterio',
            eyebrow: 'TRANSFERIR · IA', headline: 'Acelera el borrador sin ceder el criterio',
            intro: 'La IA puede proponer casos y código, pero la persona debe comprobar requisitos, imports, datos, ejecución y privacidad antes de aceptar una salida.',
            question: '¿Qué debes verificar antes de confiar?', signal: 'Trazabilidad comprobada', evidence: 'Bitácora humano–IA',
            flow: [['01', 'Contexto', 'Entrega alcance y datos mínimos.'], ['02', 'Propón', 'Usa la IA para crear un borrador.'], ['03', 'Ejecuta', 'Comprueba que el caso realmente corre.'], ['04', 'Revisa', 'Explica qué aceptas, cambias o descartas.']],
            special: { type: 'choice', variant: 'ai', label: 'Filtro de confianza', title: 'Un asistente genera diez pruebas que pasan', prompt: 'Todavía no has leído los requisitos. ¿Qué haces?', options: ['Aceptarlas por la cantidad', 'Revisar trazabilidad, aserciones y datos antes de ejecutarlas', 'Compartir secretos para darle más contexto'], answer: 1, success: 'La velocidad sirve cuando la salida puede explicarse y verificarse. La responsabilidad sigue siendo humana.' }
        },
        'm-gema-testing': {
            moduleNumber: '14', visual: 'prompt', visualLabel: 'Encargo',
            eyebrow: 'TRANSFERIR · IA', headline: 'Convierte el contexto en un encargo verificable',
            intro: 'Un buen encargo de QA declara riesgo, alcance, herramienta, criterio de terminado y evidencia esperada. Eso reduce respuestas ambiguas.',
            question: '¿Qué tendría que entregar la propuesta?', signal: 'Criterio de terminado', evidence: 'Encargo y resultado observado',
            flow: [['01', 'Delimita', 'Declara riesgo, archivos y restricciones.'], ['02', 'Pide', 'Formula una salida que pueda comprobarse.'], ['03', 'Ejecuta', 'Corre el comando y observa el resultado.'], ['04', 'Registra', 'Conserva alcance, límites y evidencia.']],
            special: { type: 'choice', variant: 'prompt', label: 'Constructor de encargo', title: 'La instrucción QA no menciona el comando de pruebas', prompt: '¿La entregas así?', options: ['Sí, la IA lo adivinará', 'No; completa contexto y exige un criterio verificable', 'Elimina la matriz para simplificar'], answer: 1, success: 'Alcance, comando, evidencia y criterio de terminado convierten una petición en trabajo que puede revisarse.' }
        },
        'm-herramientas-ia': {
            moduleNumber: '15', visual: 'tools', visualLabel: 'Selección',
            eyebrow: 'TRANSFERIR · HERRAMIENTAS', headline: 'Elige por necesidad, privacidad y control',
            intro: 'La herramienta correcta es la que resuelve una tarea medible con la menor exposición necesaria. Compara su alcance real con la suite del proyecto.',
            question: '¿Qué decisión reduce exposición y mantiene evidencia?', signal: 'Tarea medible', evidence: 'Comparación documentada',
            flow: [['01', 'Necesidad', 'Nombra la tarea que quieres resolver.'], ['02', 'Alcance', 'Revisa qué datos y archivos requiere.'], ['03', 'Contrasta', 'Compara salida, costo y condiciones.'], ['04', 'Controla', 'Verifica la propuesta con tu suite.']],
            special: { type: 'choice', variant: 'tools', label: 'Selector de herramienta', title: 'Quieres cubrir una API pequeña sin entregar el repositorio', prompt: '¿Qué criterio priorizas?', options: ['La herramienta que produce más archivos', 'Alcance mínimo, privacidad y una tarea medible', 'La que tenga más colores'], answer: 1, success: 'El criterio protege el contexto y permite comparar una salida concreta con una verificación propia.' }
        },
        'm-reto': {
            moduleNumber: '16', visual: 'evidence', visualLabel: 'Entrega',
            eyebrow: 'DESAFÍO · INTEGRACIÓN', headline: 'Cierra el ciclo con una evidencia que se pueda defender',
            intro: 'El reto integra requisito, caso, ejecución, diagnóstico y entrega. No basta con tener pruebas: debes explicar qué riesgo cubren y qué observaste.',
            question: '¿Qué hace reproducible una decisión de calidad?', signal: 'Trazabilidad completa', evidence: 'Registro Integral de Evidencias',
            flow: [['01', 'Traza', 'Relaciona requisito, riesgo y caso.'], ['02', 'Ejecuta', 'Conserva comando, versión y resultado.'], ['03', 'Corrige', 'Explica fallo, cambio y regresión.'], ['04', 'Entrega', 'Consolida evidencia y límites conocidos.']],
            special: { type: 'sequence', variant: 'evidence', label: 'Cadena de evidencia', title: 'Ordena la historia de una decisión de calidad', prompt: 'Selecciona la estación que sigue.', sequence: ['Requisito', 'Caso', 'Resultado', 'Evidencia'], success: 'La cadena permite defender qué se probó, qué ocurrió y qué decisión se tomó.' }
        }
    };

    Object.entries(moduleInsights).forEach(([moduleId, insight]) => {
        if (kits[moduleId]) Object.assign(kits[moduleId], insight);
    });

    Object.values(kits).forEach((kit) => { if (!kit.flow) kit.flow = commonFlow; });
    global.MODULE_LEARNING_KITS = kits;
})(window);
