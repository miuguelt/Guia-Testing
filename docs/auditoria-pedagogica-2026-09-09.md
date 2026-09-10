# Auditoría de la Guía Testing y estructura compartida de creación

Fecha de revisión: 9 de septiembre de 2026, Colombia.

## Dictamen

La guía tiene una base útil de automatización, código descargable, varias tecnologías, integración continua y evidencias distribuidas. Todavía no constituye una ruta suficientemente acompañada para que una persona sin experiencia decida qué probar, interprete los resultados y transfiera el proceso completo a su aplicativo.

La prioridad es completar el recorrido entre **requisito → caso → ejecución → defecto → corrección → regresión → evidencia**. Añadir más herramientas sin cerrar ese recorrido aumentaría la carga del principiante.

Se actualizaron las instrucciones de autoría de DevBrain. Este encargo entrega recomendaciones para la guía actual y cambios en el sistema de creación; no reescribe ni publica las 34 guías revisadas. Se conservaron los cambios locales que existían al comenzar.

## Alcance y método

- Se observó la publicación [test.enlinea.sbs](https://test.enlinea.sbs/) en el navegador: portada, pirámide, primera estación de evidencia y descarga; se inspeccionó visualmente la descarga.
- Se leyeron el manifiesto, registro de entregables, contenidos JavaScript, estructura HTML y documentación del paquete de la Guía Testing local.
- Se inventariaron 35 carpetas con nombre de guía: 34 con entrada web y una carpeta `guias_sena_word` fuera del análisis web. Hay 32 manifiestos y 31 registros de entregables en la raíz de las carpetas inventariadas. Su ausencia allí no demuestra ausencia de contenido o de otro mecanismo de evidencias.
- Se examinaron estructura, archivos de contenido enlazados y muestras de módulos de las demás guías; se profundizó en FastAPI, Flutter, Spring, Calidad, la serie 1–4 y los simuladores de Testing Universal, Documentación y Eventos.
- Se contrastaron recomendaciones técnicas con fuentes primarias. No se hizo revisión legal del contenido DIAN, ejecución de todas las suites, auditoría completa de accesibilidad ni prueba con aprendices reales.
- La apertura de otra guía mediante `file://` no estuvo disponible por la política del navegador; la comparación de las demás guías se apoya en fuentes locales, no en una inspección renderizada de todas ellas.

Comparación por cada guía: [inventario comentado de las 34 guías](comparacion-guias-2026-09-09.md).

Inventario reproducible: [inventory.json](../artifacts/pedagogical-audit/inventory.json). Las cifras de secciones HTML no miden extensión ni calidad: muchas guías generan el contenido con JavaScript.

**Diferencia entre publicación y archivos locales:** la página publicada de descarga muestra «Requisitos» e instrucciones agrupadas; el archivo local ya contiene «Prepara tu entorno», «Ejecuta las pruebas por tecnología» y «Verifica y conserva el resultado». Por ello, un hallazgo de la publicación no debe atribuirse automáticamente a la última versión local. Revisar procedencia y versión antes de desplegar.

## Lo que conviene conservar

1. **Proyecto de práctica descargable.** `recursos/codigo-ejemplo/README.md` relaciona preparación y comandos por herramienta. Es una base para reproducibilidad, aunque aún requiere una entrada más guiada.
2. **Variantes de tecnología.** PyTest, Vitest, JUnit y Playwright permiten conectar con distintos proyectos formativos. Deben funcionar como alternativas explicadas, no como cuatro instalaciones obligatorias.
3. **Evidencia distribuida.** `web/index.html` monta ART-TEST-01 en pirámide, ART-TEST-02 en FastAPI y ART-TEST-03 en Playwright. El cierre puede consolidar sin pedir todo por primera vez.
4. **Advertencia sobre cobertura.** La guía ya indica que ejecutar líneas sin buenas aserciones no demuestra calidad. Falta una práctica que permita comprobar esa limitación.
5. **IA con revisión humana.** Existe acompañamiento y bitácora; debe permanecer subordinado al criterio de prueba y tener una ruta equivalente sin proveedor de IA.

## Hallazgos prioritarios y criterio de cierre

| Prioridad | Hallazgo comprobado | Mejora propuesta | Cómo aceptar la mejora |
|---|---|---|---|
| Alta | La portada enumera tecnologías y módulos; la descarga aparece al final del menú | Una entrada «Empieza aquí»: producto de muestra, diagnóstico, preparación y ruta elegida | Un principiante obtiene su primera prueba sin recorrer los capítulos avanzados |
| Alta | ART-TEST-01 pide un plan y describe un resultado con quince casos; no muestra el plan diligenciado | Plan pequeño completamente resuelto, plantilla vacía y variante | El aprendiz puede producir y justificar casos a partir de una regla nueva |
| Alta | Los contenidos principales saltan de pirámide y herramientas a suites; particiones y tablas de decisión aparecen incidentalmente en IA | Enseñar requisitos, riesgo, oráculo y diseño de casos antes de automatizar | Hay ejercicios resueltos de equivalencia, límites, decisiones y estados |
| Alta | El menú presenta FastAPI, Flask, React y Java como sucesión; ART-TEST-02 está en FastAPI | Separar núcleo y rutas; hacer que cada ruta alimente la misma evidencia | Quien usa Java o React puede completar su evidencia sin realizar FastAPI |
| Alta | El módulo de pirámide presenta 70/20/10, menos de 5 ms y una garantía del 80 % de fallos como reglas | Etiquetar proporciones y tiempos como ejemplos contextualizados; retirar garantías sin evidencia | Cada umbral tiene propósito, condiciones y fuente o se elimina |
| Alta | El reto y el registro exigen defectos clasificados, pero falta un taller equivalente de diagnóstico y reporte | Un defecto reproducible completo, severidad frente a prioridad, corrección y repetición | Se registra esperado/observado, entorno, pasos, evidencia y resultado posterior |
| Media | Preparación y ejecución dan comandos, pero explican de manera irregular la salida y los errores | Comando + contexto + resultado + diagnóstico + recuperación | La guía permite resolver un error de ruta, dependencia o colección de pruebas |
| Media | Seguridad, rendimiento y accesibilidad se mencionan, pero no forman una secuencia práctica inicial de la misma profundidad | Talleres cortos basados en riesgo y ampliaciones delimitadas | Cada taller produce una observación real y reconoce qué no comprobó |
| Media | Cobertura y CI pueden parecer el cierre de la calidad | Informe de alcance, pruebas omitidas/bloqueadas y riesgo residual | Una ejecución verde no permite declarar probado lo que no se ejecutó |
| Media | Hay diferencias entre web publicada, fuente local y referencia a Testing Universal en README | Declarar qué versión y sitio se revisan, y comparar descarga con web al liberar | Mismo identificador de versión y comandos comprobados en ambas salidas |

Referencias locales de los primeros hallazgos: `web/index.html`, `web/js/modules-content.js` (m-reflexion, m-piramide), `web/js/modules-content-2.js`, `deliverables.registry.json` y `recursos/codigo-ejemplo/README.md`.

## Contenido que falta o necesita mayor profundidad

### Antes de escribir una prueba

Explicar con el mismo ejemplo qué es calidad, aseguramiento de calidad, prueba, defecto y fallo. Enseñar a revisar un requisito ambiguo y a preguntar por la regla que determina el resultado esperado. Separar prueba manual de automatizada y revisión estática de ejecución; ninguna reemplaza por sí sola a las otras.

Incorporar diseño por particiones de equivalencia, valores límite, tablas de decisión y transiciones de estados. Son técnicas recogidas en el [programa CTFL 4.0.1 de ISTQB](https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf). La recomendación pedagógica es practicarlas sobre pocas reglas explícitas antes de introducir más herramientas.

### Durante la ejecución

Mostrar una prueba manual completa y una primera automatizada: preparar datos, actuar y comprobar. Provocar un defecto sencillo, reconocer el fallo correcto, corregirlo y repetir. Explicar por separado: no se encontraron pruebas, dependencia ausente, aserción fallida, prueba omitida y fallo de infraestructura.

En API y base de datos, verificar respuesta, contenido y efecto persistido; incluir restricciones, duplicados, transacciones y permisos cuando correspondan al contrato. Mostrar qué queda sin demostrar cuando se usa SQLite o un doble de prueba.

En navegador, practicar carga, vacío, error, reintento, sesión y un recorrido real. Enseñar aislamiento de datos, localizadores por rol y esperas basadas en condiciones observables, coherente con las [buenas prácticas de Playwright](https://playwright.dev/docs/best-practices).

### Después de ejecutar

Enseñar a registrar y priorizar defectos, repetir el caso corregido y ejecutar regresión. Mostrar una prueba que pase pese a una implementación equivocada para discutir calidad de las aserciones. La cobertura debe relacionarse con requisitos y riesgos, no solo con líneas.

Cerrar con un informe que diga versión probada, entorno, alcance, resultados, casos bloqueados u omitidos, defectos abiertos y riesgo residual. El instructor o responsable decide la aceptación; el navegador no certifica competencia.

### Pruebas no funcionales proporcionales

Añadir una práctica de teclado y foco, una de autorización con dos usuarios sintéticos, una de rendimiento con carga y umbral acordados, una de compatibilidad pertinente al proyecto y una de recuperación en datos de prueba. No convertir pruebas de estrés sobre producción en actividad de principiante. Los límites y técnicas de evaluación deben ser explícitos; una comprobación preliminar no equivale a una evaluación completa de accesibilidad. Véase [W3C WAI: revisión inicial de accesibilidad](https://www.w3.org/WAI/test-evaluate/preliminary/).

### Precisión técnica y de fuentes

- Contrastar el tratamiento de ISO/IEC 25010 con la edición indicada. Existe [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html); la mención histórica a 2011 debe conservar su fecha y no presentarse como descripción de cualquier edición.
- Revisar el uso de IEEE 829 como etiqueta obligatoria del plan; la fuente actual consultada para documentación de pruebas es [ISO/IEC/IEEE 29119-3:2021](https://www.iso.org/standard/79429.html). Una plantilla didáctica no puede anunciar conformidad sin contrastar el estándar aplicable.
- Presentar la pirámide como una ayuda para equilibrar pruebas según costo, alcance y rapidez. La [explicación práctica de Ham Vocke](https://martinfowler.com/articles/practical-test-pyramid.html) puede servir como lectura complementaria; no atribuirle garantías porcentuales de defectos detectados.
- El ejemplo de Knight Capital debe distinguir el incidente documentado del pseudocódigo inventado para ilustrarlo. En la fuente local se rotula un `range(1000)` como bucle sin fin: ese comentario es incorrecto. Reescribir la explicación con atribución a la [fuente de la SEC](https://www.sec.gov/newsroom/press-releases/2013-222), sin simplificar la causalidad a «faltaron tests».

## Ejemplo de taller que debería tener la guía

Caso ficticio: una aplicación permite solicitar entre uno y cinco equipos. El dato es un entero y el usuario debe tener permiso. Primero se acuerda esa regla; después se seleccionan los casos.

| Caso | Entrada | Técnica | Resultado esperado |
|---|---|---|---|
| CP-01 | Cantidad 0, con permiso | Fuera del límite inferior | Rechazo; no crear solicitud |
| CP-02 | Cantidad 1, con permiso | Límite inferior válido | Crear una solicitud por una unidad |
| CP-03 | Cantidad 3, con permiso | Representante de la partición válida | Crear una solicitud por tres unidades |
| CP-04 | Cantidad 5, con permiso | Límite superior válido | Crear una solicitud por cinco unidades |
| CP-05 | Cantidad 6, con permiso | Fuera del límite superior | Rechazo; no crear solicitud |
| CP-06 | Cantidad 1, sin permiso | Autorización | Denegar; no crear solicitud |

Esta tabla es el inicio de la selección, no una suite exhaustiva. Añadir vacío, tipo incorrecto, disponibilidad y duplicación si las reglas del aplicativo lo requieren. Documentar precondiciones y pasos para cada caso; no asumir un código HTTP que el contrato no haya definido.

El taller muestra CP-05 ejecutado sobre una implementación defectuosa que acepta seis equipos, registra lo observado, añade una aserción, corrige el límite y repite CP-01 a CP-06. El aprendiz recibe otra regla —por ejemplo, reserva de espacios— y construye sus propios casos. El resultado final es la evidencia explicada, no una captura de una consola verde.

## Patrones aprovechables de otras guías

| Fuente examinada | Patrón aprovechable | Aplicación al estándar y límite |
|---|---|---|
| FastAPI, `js/content/modulos-02b-entorno.js` | Preparación con comandos, salida esperada y diagnóstico | Comprobación inicial y recuperación antes de programar; revalidar versiones, cifras y permisos |
| Spring, `web/js/learning-path.js` | Ejercicio, criterio y transferencia por módulo | Plantilla común orientada a producir; una longitud mínima de texto no demuestra comprensión |
| Flutter, `js/content/modulos-12-transferencia.js` | Reto conectado al backend y estados 200/409 explícitos | Reto nuevo sobre lo enseñado, con contrato y criterios; no copiar datos de identidad |
| Guía 1, `index.html` y `js/workshop.js` | Contexto, fuentes y caracterización del proceso | Caso conductor con origen de la información y supuestos visibles |
| Guía 2, `index.html` | Trazabilidad, RF/RNF, BDD y siglas explicadas | Requisito → criterio → caso → evidencia, con glosario cercano |
| Guías 3 y 4, `index.html` y manifiestos | Continuidad entre prototipo, validación y preparación del trabajo | Cada guía declara qué recibe y qué produce para la siguiente |
| Calidad, `js/data-exercises.js` | Pistas y explicación de respuestas incorrectas; ejercicio de límites | Retroalimentación razonada; revisar exactitud antes de copiar, especialmente afirmaciones sobre cobertura de caminos |
| Testing Universal, `js/content/modulos-data.js` | Mapa por tecnologías, dobles de prueba y selección por tipo de componente | Usarlo como mapa de alcance; desarrollar ejemplos y evitar recetas absolutas |

Son observaciones editoriales sobre fuentes concretas. No se midió aún si estas prácticas reducen errores o mejoran resultados de aprendices. Se incorporan como hipótesis verificables y estructura solicitada por el usuario, sin anunciar validación pedagógica global.

## Patrón que no se debe propagar

En seis guías se localizaron cadenas fijas que presentan éxito o métricas en `js/simulators/simulador-principal.js`: APIs modernas, Documentación, Eventos, Refactorización, RAG y Testing Universal. La inspección detallada de tres de esos motores confirmó una espera de 400 ms seguida de HTML prefijado.

En Testing Universal, por ejemplo, se muestran «Calidad de aserciones: 100%» y verificaciones V.E.R.A. superadas sin ejecutar una suite ni evaluar entradas. En Eventos se muestra una latencia fija de 12,4 ms. **Estos valores no son mediciones del aplicativo.** Deben rotularse como ilustraciones o reemplazarse por cálculos/comprobaciones reales con alcance explícito.

También se encontró un copiador de plantilla, `_projects/devbrain/scripts/guides/GuideTemplateAssets.ps1`, que intenta copiar `gamification.js` y `simulators.js` desde `Guia FastApi`. No se comprobó que sea el flujo activo. Queda como deuda de revisión del generador; no se ejecutó ni se modificó en este encargo. El flujo actualizado dirige al SDK y exige verificar pertinencia y comportamiento de las interacciones.

## Estructura general incorporada a DevBrain

**Bienvenida → diagnóstico → preparación → contexto → fundamentos → talleres → variante técnica → transferencia → consolidación → consulta.**

Cada módulo desarrolla: **objetivo → requisito previo → explicación → ejemplo resuelto → contraejemplo → práctica guiada → error y recuperación → práctica independiente → evidencia en el proyecto propio**.

Se modificaron:

1. `_core/knowledge_base/EDUCATIONAL_GUIDE_STANDARD.md`: versión 2.5.0, nueva sección de autonomía; interactividad proporcional; límites de evaluación y de funcionamiento sin conexión.
2. `_core/skills/educational-guide-builder/references/authoring-blueprint.md`: referencia reutilizable con estructura de guía, plantilla de módulo, perfil QA y revisión de preparación para publicar.
3. `_core/skills/educational-guide-builder/SKILL.md`: carga y aplica la referencia al crear; respeta el alcance de las revisiones.
4. `_core/knowledge_base/skills/educational-guide-builder.json`: contenido que recibe el cliente MCP, alineado con la habilidad local.
5. `_core/knowledge_base/workflows/educational-guide-evolution.json`: agrega comparación, comprobación de veracidad y revisión documentada de preparación.
6. `_core/knowledge_base/WEB_DESIGN_PATTERN_CATALOG.md`: registra patrones candidatos y el límite contra éxitos ficticios.

La estructura es común; el caso, las actividades y la interacción se adaptan al tema. No exige cuatro simuladores ni cuatro tecnologías para toda guía. Las guías existentes conservan su versión declarada hasta que realmente sean revisadas.

## Orden recomendado para mejorar la Guía Testing

1. **Recorrido básico:** preparación, glosario cercano, reglas del caso conductor, plan resuelto, primera prueba manual y automatizada con error recuperable.
2. **Transferencia:** variantes por tecnología, mismo contrato de evidencia, reporte de defecto completo e informe de cierre.
3. **Profundización:** persistencia, permisos, accesibilidad, rendimiento, compatibilidad, recuperación e integración continua con límites claros.
4. **Validación pedagógica:** una persona principiante realiza una tarea inédita sin ayuda del autor; registrar dónde se detiene, qué interpreta y qué evidencia produce. Ajustar antes de afirmar autonomía lograda.

## Verificación y límites del cierre

Los validadores existentes `Test-DevBrainEducationalGuide.ps1 -Strict` y `Test-GuideDeliverables.ps1 -Strict` aprobaron la Guía Testing local; el segundo encontró tres evidencias montadas. Esto confirma contratos estructurales, **no** que los ejemplos enseñen suficientemente ni que el aprendiz pueda realizar el trabajo sin ayuda. Es precisamente por eso que se añadió una revisión editorial explícita, sin fingir que el validador ya automatiza esos criterios.

El estado de preparación de la guía se registra en [GUIDE_READINESS_REVIEW.md](../GUIDE_READINESS_REVIEW.md). La sincronización y comprobaciones del sistema de autoría se registran en [validacion-autoria.md](../artifacts/pedagogical-audit/validacion-autoria.md).

Primera iteración aplicada: la portada ahora tiene una ruta básica y diagnóstico por intención; la pirámide incorpora un oráculo ficticio, una matriz de seis casos y una práctica de defecto; y se moderaron afirmaciones que podían leerse como garantías universales. Segunda iteración aplicada: la descarga incorpora una secuencia de diagnóstico con comandos para separar ubicación, versión, entorno, dependencias y defecto del producto antes de editar código. Tercera iteración aplicada: TEST-EV02 y TEST-EV03 dejaron de sugerir resultados prefijados y ahora exigen evidencia observada, alcance declarado, reproducción y regresión cuando hay un defecto. El ZIP se regeneró desde la fuente con su carpeta de paquete. Se validó la web local con las pruebas del proyecto, los validadores de contrato y comprobaciones de sintaxis. Pendientes: corregir los laboratorios señalados en las otras guías dentro de tareas autorizadas, ejecutar las prácticas desde entornos limpios de cada tecnología y validar aprendizaje con personas. Estos pendientes no se presentan como implementaciones terminadas.
