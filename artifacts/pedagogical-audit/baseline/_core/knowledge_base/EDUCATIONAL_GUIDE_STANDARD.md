# Estándar DevBrain para guías educativas

**Identificador:** `devbrain.educational-guide`  
**Versión:** 2.4.0  
**Fecha:** 2026-08-27  
**Estado:** canónico para guías nuevas o intervenidas por IA

## 1. Propósito

Una guía DevBrain debe ayudar al aprendiz a producir una evidencia transferible a un proyecto. No es un temario, una colección de tarjetas ni una interfaz con muchos simuladores. Su calidad se demuestra por la trazabilidad entre contexto, resultado de aprendizaje, actividad, evidencia, criterio e instrumento.

Para formación SENA se conserva la lógica del formato GFPI-F-135: identificación, presentación, actividades de aprendizaje, evidencias, criterios, instrumentos, glosario, referentes y control de cambios. En una web estos elementos pueden distribuirse en una experiencia interactiva, pero no desaparecer.

## 2. Contrato mínimo de una guía

Cada guía debe incluir `guide.manifest.json` validable con:

- programa, código, competencia y resultado(s) de aprendizaje verificables;
- fase y actividad del proyecto formativo, o justificación explícita cuando no apliquen;
- reto auténtico, usuario/organización, necesidad y producto final;
- actividades de reflexión, contextualización, apropiación y transferencia;
- evidencias de conocimiento, desempeño y producto;
- criterio observable e instrumento para cada evidencia principal;
- duración total y tiempos por actividad;
- fuentes, versión, control de cambios y supuestos;
- requisitos web de accesibilidad, responsive, privacidad y seguridad cuando el formato sea web.

No se inventan códigos curriculares, resultados de aprendizaje, nombres de proyecto ni autoridad institucional. Toda alineación debe señalar la fuente utilizada y distinguir texto oficial de adaptación didáctica.

## 3. Diseño pedagógico por proyectos

### 3.1 Reto y producto

El reto parte de una situación auténtica del entorno productivo o social. El producto final debe poder incorporarse al proyecto del aprendiz: diagnóstico, modelo, prototipo, backlog, informe, código, prueba o manual. Cada actividad genera un incremento de ese producto.

### 3.2 Secuencia de aprendizaje

1. **Reflexión:** activa experiencia previa y revela el problema; no inicia con una definición extensa.
2. **Contextualización:** conecta el reto con el resultado, los criterios, el entorno y los saberes necesarios.
3. **Apropiación:** combina explicación breve, modelado, práctica guiada, retroalimentación y revisión.
4. **Transferencia:** el aprendiz aplica lo aprendido a su proyecto, toma decisiones y sustenta la evidencia.

La IA acompaña con preguntas, pistas, contraste y retroalimentación. No resuelve por completo la evidencia ni suplanta al aprendiz.

### 3.3 Evidencia y evaluación

Una lección no se completa por abrirla, conversar o acumular puntos. Se completa cuando existe una evidencia mínima registrada y contrastada con un criterio. La guía debe mostrar:

- qué se entrega;
- dónde se incorpora al producto final;
- qué criterio se observa;
- cómo se comprueba;
- qué hacer si todavía no cumple.

La autoevaluación y la retroalimentación de IA apoyan el proceso, pero no equivalen a juicio evaluativo del instructor. Una web no puede emitir un certificado oficial del SENA; solo puede generar una constancia claramente no oficial del recorrido o del trabajo realizado.

**Dónde se pide cada evidencia lo fija la sección 11.** No basta con declararlas: deben pedirse donde se producen.

## 4. Experiencia web educativa

La primera vista explica el reto, el resultado esperado, el producto y el siguiente paso. La navegación representa el avance del proyecto, no solo capítulos. Son obligatorios:

- español colombiano claro y lenguaje inclusivo sin infantilizar;
- HTML semántico, teclado completo, foco visible y objetivo WCAG 2.2 AA;
- diseño mobile-first desde 320 px y soporte verificado hasta 2560 px;
- texto completo sin `text-overflow: ellipsis` en contenido;
- tablas y código con desplazamiento horizontal dentro del bloque, nunca de la página;
- dos medidas de ancho: la prosa conserva su medida de lectura (~78 caracteres) y el código, las tablas, los diagramas y las comparativas ocupan el ancho disponible, porque no se leen renglón a renglón;
- estados de carga, vacío, error, éxito y modo sin conexión cuando apliquen;
- persistencia mínima, explicada y sin credenciales ni datos sensibles;
- IA opcional y degradación útil: el aprendizaje central funciona sin depender de un proveedor.

Nunca se expone una clave de proveedor en el navegador ni se persiste en `localStorage`. La IA remota se consume mediante un proxy autorizado o se reemplaza por contenido local verificable.

### 4.1 Presentación del código

Un listado que el aprendiz no puede leer no enseña nada, por correcto que sea el código. Hasta agosto de 2026 las guías del ecosistema mostraban el mismo fragmento de cuatro maneras —Prism desde CDN, highlight.js desde CDN, un renderizador propio sin resaltador y texto gris sin nada—, y tres de ellas envolvían las líneas largas, lo que borra la sangría: la única señal de qué está dentro de qué.

El contrato completo vive en la regla `rule.code-presentation`. Lo que no admite excepción:

- **Fuente única.** Todo listado se pinta con el módulo compartido `DevBrainSDK.code`, o con `window.DevBrainCode` en las guías que no cargan el SDK completo. No se añade un resaltador nuevo.
- **Sin CDN.** El resaltado funciona sin conexión. Un aula sin internet debe ver el código igual que una con internet.
- **La sangría no se toca.** `white-space: pre` y desplazamiento dentro del bloque. El ajuste de línea es un interruptor que activa el aprendiz, no el comportamiento por omisión. Un `<pre>` que es consola de simulador se marca `data-dbc="omitir"`.
- **Los límites se ven.** Número de línea, rieles que marcan apertura y cierre de cada función, método o clase, e índice de ámbitos cuando hay dos o más.
- **El color nunca es el único canal**, y todo token supera 4.5:1 de contraste en tema claro y oscuro.
- **Copiar entrega el código exacto**: ni números de línea, ni rótulos, ni cabecera.

Gate bloqueante: `Test-DevBrainCodePresentation.ps1 -Path <guía> -FailOnViolations`.

## 5. Calidad técnica proporcional

La arquitectura depende del producto. No son obligatorios Docker, un backend, cinco simuladores, 300 líneas de README ni una tecnología específica. Sí son obligatorios:

- estructura mantenible y fuente única para contenido repetido;
- build y lint exitosos cuando existan;
- validación de HTML/código embebido;
- pruebas de las interacciones críticas proporcionales al riesgo;
- evidencia de responsive y accesibilidad antes de publicar;
- ausencia de secretos y afirmaciones institucionales engañosas.

El runtime local respeta la política Windows nativa de DevBrain. Docker solo puede documentarse para producción remota cuando el proyecto lo requiera; nunca es requisito de desarrollo local.

## 6. Gates de liberación

| Gate | Condición de aprobación |
|---|---|
| Curricular | Competencia, RAP, criterios y fuentes son trazables |
| Proyecto | Cada actividad incrementa un producto auténtico |
| Evidencia | Conocimiento, desempeño y producto tienen criterios e instrumentos |
| Distribución | Cada evidencia se pide en su sección, el cierre solo consolida y el protocolo de carga está declarado (sección 11) |
| Pedagógico | Están cubiertas las cuatro fases y existe retroalimentación accionable |
| Aprendiz cero | Ningún paso supone un saber no enseñado; todo prerrequisito se enseña o se declara (sección 8) |
| Caja de herramientas | Cada módulo tiene teoría, ejemplo resuelto, ejercicio guiado, interactividad y estación de evidencia (sección 12) |
| Construcción con IA | La guía enseña a dirigir la IA con encargo, verificación y decisión humana, no a copiar salidas (sección 13) |
| Contenido | Conceptos, datos, ejemplos y referencias fueron revisados |
| Web | Build, accesibilidad, responsive, teclado y estados fueron verificados |
| Código | Todo listado usa el módulo compartido, sin CDN, con la sangría intacta y los límites de función visibles |
| Seguridad | No hay claves en cliente, secretos persistidos ni certificaciones engañosas |
| Evolución | La iteración quedó registrada con evidencia y candidatos de mejora |

Los gates pedagógicos, de distribución de evidencia, de aprendiz cero y de seguridad son bloqueantes. Una excepción requiere justificación, responsable y fecha de revisión.

## 7. Ciclo de mejora continua

Cada intervención de IA sobre una guía registra una entrada local y otra central con: intención, cambio, evidencia de validación, retroalimentación recibida, resultado y reglas candidatas. El registro se realiza con `Register-DevBrainGuideIteration.ps1`.

El estándar no se modifica automáticamente con una sola opinión. Una regla candidata se promueve cuando cumple al menos una condición:

1. aprobación explícita de un instructor o del usuario responsable; o
2. resultado positivo repetido en dos iteraciones o dos guías, sin regresión observada.

La promoción actualiza SemVer, este documento, el validador si aplica, el manifiesto de runtime y el catálogo PostgreSQL mediante el flujo canónico de sincronización. Así cada interacción alimenta el aprendizaje, pero una respuesta aislada no puede degradar el estándar.

## 8. Aprendiz cero: nada se da por sabido

La guía se escribe para quien ve el tema por primera vez. Cada paso debe poder ejecutarlo una persona que nunca ha abierto la herramienta, sin buscar nada por fuera. La auditoría de recorrido de primera vez busca en cada instrucción el saber implícito que la sostiene; los cinco huecos que más abandonos causan, y que toda guía técnica debe cubrir o declarar:

1. **La terminal:** cómo se abre, qué significa el prompt, dónde se escribe el comando y cómo se reconoce que terminó bien o mal.
2. **El editor:** cuál se usa, cómo se instala, cómo se abre una carpeta y cómo se guarda un archivo.
3. **Git:** si cualquier criterio de aceptación menciona `git status`, commits o un repositorio, la guía enseña la instalación, `git init`, `git add`, `git commit` y `.gitignore` antes de exigirlos. Un `.zip` descargable no sustituye esta enseñanza: el primer `git init` lo hace el aprendiz con la guía al lado.
4. **Archivos comprimidos y rutas:** descomprimir un `.zip`, distinguir carpeta de archivo, y qué significa `cd` a una ruta con espacios.
5. **Formato de las evidencias:** si se entrega Markdown, la guía enseña la sintaxis mínima (títulos, listas, código) en el momento en que se pide el primer documento.

Todo lo que la guía no enseña porque pertenece a una estación anterior se declara en la portada como prerrequisito verificable: nombre del saber, dónde se adquirió y cómo comprobar que se tiene. «Se asume que sabe» es una frase prohibida; se reemplaza por «compruebe que…» con el comando o la acción de verificación.

Los números que la guía muestra deben ser verdaderos y estar sincronizados con el contenido: cantidad de módulos, de ejercicios, XP total, horas y conteos de bloques de código. Un contador desactualizado le enseña al aprendiz que el documento miente, y deja de confiar en los pasos que sí importan.

## 9. Enseñanzas Canónicas de Análisis de Requisitos y Elicitación (Cerebro Autónomo DevBrain)

Para guías de Análisis y Especificación de Software (Guías 1 a 4), la IA de DevBrain debe asegurar siempre la siguiente secuencia pedagógica obligatoria:

1. **Recolección e Elicitación Completa (Guía 1):**
   - Nunca asumir requisitos sin técnicas de campo (Entrevistas Semiestructuradas, Encuestas, Observación Directa, Análisis Documental, JAD).
   - Aplicar el **Principio de Triangulación:** Conciliar lo que el usuario *dice*, lo que *hace* y lo que se *documenta*.
   - Mapear cada hallazgo de recolección a sus correspondientes candidatos a Requerimientos Funcionales (RF).

2. **Especificación e Ingeniería de Contexto (Guía 2):**
   - Diferenciar explícitamente Requisitos Funcionales (RF) vs No Funcionales (RNF).
   - Aplicar Priorización **MoSCoW** (*Must, Should, Could, Won't*) y mantener una **Matriz de Trazabilidad**.
   - Redactar Historias de Usuario con Criterios de Aceptación verificables en sintaxis **BDD** (*Given / When / Then*).

3. **Prototipado de Interfaz como Validación (Guía 3):**
   - Tratar el prototipo estático como la *firma del contrato visual* antes de programar backend/DB.
   - Demostrar el mapeo bidireccional entre cada componente UI (botones, formularios, tablas) y su Requisito Funcional (RF).

4. **Planificación Ágil y Criterios de Calidad (Guía 4):**
   - Aplicar los filtros **DoR (Definition of Ready)** antes de meter un RF al Sprint y **DoD (Definition of Done)** antes de liberarlo.
   - Estimar capacidad, priorizar el Sprint Backlog y gestionar flujo en tablero Kanban.

5. **Coherencia y Navegación Inter-Guías:**
   - Toda guía de una serie pedagógica debe incluir barras de navegación secuencial que conecten la estación anterior con la siguiente, manteniendo la continuidad del Proyecto Formativo.

## 10. Arquitectura de Guías de Alto Nivel: Simuladores en Vivo, Protocolo V.E.R.A. y DevBrain Learner SDK

Para garantizar que toda guía producida por DevBrain alcance el estándar interactivo y profesional de máxima categoría, se formalizan las siguientes especificaciones canónicas:

1. **Protocolo V.E.R.A. (Copiloto Cognitivo y Anti-Alucinación):**
   - **V (Verificar Existencia):** Todo método, librería y parámetro sugerido por la IA debe contrastarse contra la documentación oficial vigente antes de su adopción.
   - **E (Ejecutar TDD):** Es obligatorio escribir primero la prueba automatizada que falle sin el código y pase con él.
   - **R (Revisar Calidad y Seguridad):** Chequear vulnerabilidades (OWASP), linters (`ruff`, `mypy`, `bandit`, `eslint`), tipado estricto y modularidad.
   - **A (Atribuir en Bitácora):** Registrar en `docs/ai-log.md` los prompts utilizados, el modelo, la validación realizada y la decisión humana final.
   - *Regla de Descarte:* Si el asistente alucina dos veces en un problema, suspender el prompting y escribir el código consultando la documentación oficial.

2. **Capa Interactiva y Simuladores en Vivo (Mínimo 4 Motores por Guía):**
   - *Simulador Visual/Arquitectura:* Modelador interactivo (ciclo de vida de peticiones HTTP, pipeline de estados, drag & drop de componentes o mapa conceptual).
   - *Laboratorio de Código/Editor en Vivo:* Split-pane donde modificar parámetros (JSON de contexto, consultas ORM/SQL, payloads) y observar el resultado renderizado en tiempo real.
   - *Modo Debugging / Bug Hunter:* Retos interactivos con código roto para identificar la causa raíz, seleccionar la solución correcta y verificar la corrección.
   - *Security / Assertion Validator:* Comparación interactiva lado a lado de código vulnerable vs seguro (ej. SQL Injection vs Consultas Parametrizadas).

3. **Gamificación y Persistencia Canónica:**
   - Implementar el motor de gamificación mediante `devbrain-learner-sdk` (o IIFE bundle `DevBrainSDK.createApp`).
   - Sistema de XP progresivo por módulo (+25 a +250 XP), 4 niveles de maestría (Novato → Aprendiz → Desarrollador → Maestro), Toasts animados, persistencia desacoplada en `localStorage` y Victory Modal con confetti al completar el 100 %.

4. **Diseño Web, Accesibilidad y Usabilidad:**
   - Dark Mode con temática Glassmorphism y Design Tokens (`tokens.css`).
   - Responsive Mobile-First real desde 320 px hasta 2560 px.
   - Prohibido `text-overflow: ellipsis` en bloques de contenido explicativo; usar ajuste tipográfico fluido (`clamp()` o `FitText`).
   - Cobertura obligatoria de los 4 estados UI (`Loading`, `Success`, `Error`, `Empty`).

## 11. Evidencia distribuida y consolidación final

Hasta agosto de 2026 las guías del ecosistema declaraban bien sus evidencias y las pedían mal. La Guía 3 es el caso ejemplar: enumeraba sus diez artefactos en la sección 03, antes de haber enseñado nada, y volvía a enumerarlos completos en el cierre. Entre esos dos muros había teoría, simuladores y quizes que no pedían nada. El resultado medido en el recorrido de primera vez es siempre el mismo: el aprendiz estudia, se entretiene, llega al final sin nada producido y descubre allí una deuda de diez piezas. Esa concentración final no es un problema de redacción sino de secuencia, y es la causa más frecuente de entregas incompletas.

El contrato de abajo corrige la secuencia. Es bloqueante para guías nuevas y para cualquier guía intervenida.

### 11.1 Una estación por evidencia, en la sección donde se produce

Cada evidencia se pide en la sección que acaba de enseñar a producirla, mediante un punto de montaje `data-db-evidence="<id>"` que el módulo `DevBrainEvidence` convierte en estación. La sección que aloja una estación debe contener, antes de ella y en este orden:

1. la teoría mínima necesaria para entender qué se pide y por qué;
2. un ejemplo resuelto del caso demostrativo, no una descripción del ejemplo;
3. un ejercicio o práctica guiada sobre ese ejemplo;
4. la estación, que aplica lo anterior al proyecto propio del aprendiz.

Una estación sin esos cuatro elementos es un formulario huérfano: pide un producto que la guía no enseñó a hacer.

### 11.2 Prohibida la factura final

**Ninguna evidencia puede aparecer por primera vez en el cierre.** La sección de consolidación no pide trabajo nuevo: recoge lo producido, muestra qué falta, enlaza de vuelta a la estación correspondiente y explica la carga. Si el cierre enumera un artefacto que ninguna sección pidió, la guía incumple y `Test-GuideDeliverables.ps1` lo reporta como error.

### 11.3 Estado visible, y sus límites

Cada estación muestra tres estados: `pendiente`, `borrador` y `lista`. `lista` significa que los campos obligatorios están diligenciados y que el aprendiz contrastó su trabajo con el criterio declarado. **No existe un estado `verificada`**: la web no emite juicio evaluativo, y fingirlo sería el peor daño que una guía SENA puede hacer. Todo texto de estado debe decir de qué habla.

### 11.4 Consolidación, Medición de Desempeño y Dossier Institucional SENA

Toda guía culmina obligatoriamente con la herramienta estandarizada de medición de desempeño y consolidación de evidencias, generando de forma precisa y perfecta el **Dossier Integral de Evidencias SENA (ADSO)** institucional para sustentar la entrega y calificar en la plataforma LMS (Territorium / Zajuna / SofiaPlus):

1. **Datos de Identificación del Aprendiz**: Formulario interactivo reactivo (Nombre, Documento, Ficha, Centro de Formación, Regional, Instructor Técnico Líder) persistido en `localStorage` y sincronizado en tiempo real con la hoja formal de entrega.
2. **Acciones de Exportación para la Plataforma**:
   - `🖨️ Imprimir / Guardar Dossier en PDF`: Exportación institucional gobernada por `@media print` optimizado en blanco y negro formal, ocultando botones, formularios y navegación de la guía, lista para subir a la plataforma.
   - `💾 Descargar Evidencia en JSON`: Expediente digital estructurado con metadatos institucionales, datos del aprendiz, competencia, RAP, evidencias completadas y marca temporal ISO.
   - `📄 Descargar el paquete completo (.md)`: Respaldo editable para trazabilidad en repositorios Git.
3. **Hoja Formal Imprimible del SENA (`.sena-dossier-sheet`)**:
   - Encabezado con escudo verde SENA (`#39a900`), "SERVICIO NACIONAL DE APRENDIZAJE — SENA", Dirección de Formación Profesional, programa (ADSO) y el título/competencia de la guía.
   - Metadata lateral: Ficha, Fecha de emisión (en formato colombiano `es-CO`) y Badge de Estado `EVIDENCIA CONSOLIDADA`.
   - **Sección 1. Datos Generales del Aprendiz**: Tabla formal de 2x2 filas con Nombre, Documento, Centro, Regional e Instructor Técnico.
   - **Sección 2. Registro de Evidencias Técnicas Realizadas**: Tabla estructurada con `Código` (EV-01, EV-02... o los códigos de artefacto), `Denominación de la Evidencia`, `Instrumento de Evaluación` (Lista de Chequeo, Rúbrica, Prueba Objetiva) y `Resultado` (Badges: `CUMPLIDO`, `APROBADO`, `OPERATIVO`, etc.).
   - **Sección 3. Rúbrica y Juicio de Evaluación del Instructor**: Criterios de evaluación SENA según la guía, columnas `Cumple` (`[ X ] SÍ   [   ] NO`), `Observaciones del Instructor`, recuadro de `JUICIO DE EVALUACIÓN FINAL` (`APROBADO [A]` / `NO APROBADO [NA]`) y firmas formales del Aprendiz y del Instructor SENA.
   - Bitácora Humano–IA y protocolo de entrega declarado en el bloque `submission` de `deliverables.registry.json`.

Todo se ejecuta en el navegador sin red, sin servidor y sin servicios de terceros: una guía debe funcionar desde un USB en cualquier ambiente de aprendizaje SENA.

### 11.5 La IA de 2026 se enseña por estación, no en un capítulo aparte

Cada estación declara `aiAssist` con tres partes: el encargo listo para pegar en el asistente que el aprendiz ya use, qué debe verificarse antes de aceptar la respuesta, y qué queda registrado en la bitácora humano–IA. La guía no llama a ningún proveedor y no expone claves; entrega el encargo y exige la verificación.

Lo evaluable no es la salida del modelo sino la cadena **encargo → verificación → decisión humana**, que es el V.E.R.A. de la sección 10 aplicado al tamaño de una evidencia. La bitácora se acumula sola a lo largo del recorrido y se entrega como una evidencia más: en 2026 la pregunta no es si se usó IA, sino qué se le pidió, contra qué se contrastó y quién decidió.

### 11.6 Contrato del registro

`deliverables.registry.json` valida contra `_core/knowledge_base/schemas/deliverables.registry.schema.json`. Además de los campos de la versión 1 (`purpose`, `inputs`, `instructions`, `example`, `criterion`, `instrument`, `evidence`, `nextStep`), cada artefacto declara:

| Campo | Qué fija |
|---|---|
| `station.sectionId` | El `id` real de la sección donde se pide. Debe existir en el HTML |
| `station.order` | El orden en el recorrido, que manda sobre el orden del archivo |
| `station.phase` | Reflexión, contextualización, apropiación o transferencia |
| `station.minutes` | Tiempo estimado, para que el aprendiz pueda planear |
| `evidenceType` | Conocimiento, desempeño o producto |
| `fields` | Campos de la plantilla con etiqueta, tipo, ayuda y obligatoriedad |
| `checklist` | Autochequeo observable contra el criterio |
| `aiAssist` | Encargo, verificación y registro según 11.5 |
| `upload.fileName` | El archivo que produce la estación |

Un registro v1 sigue cargando: sus `templateFields` se convierten en campos y los huecos se muestran en la página como pendientes. No se rellenan con texto inventado.

### 11.7 Gate

```powershell
& '_infrastructure\devbraind\scripts\Test-GuideDeliverables.ps1' -Path '<guía>' -Strict
```

Bloquea la liberación cuando una evidencia no tiene estación, cuando la sección declarada no existe, cuando el cierre concentra evidencias que nadie pidió antes, cuando falta el bloque `submission` o cuando falta la consolidación.





## 12. Caja de herramientas mínima por módulo

Cada módulo es una unidad de aprendizaje completa, no un capítulo de lectura. Antes de su estación de evidencia, y en este orden, el módulo ofrece:

1. **Teoría mínima accionable:** solo lo necesario para entender qué se va a construir y por qué, en prosa corta con vocabulario definido en el glosario.
2. **Ejemplo resuelto:** un caso demostrativo construido paso a paso hasta el final, con la salida esperada visible. No se describe un ejemplo: se muestra resuelto.
3. **Interactividad sobre el concepto difícil:** cada concepto abstracto del módulo tiene al menos una herramienta que lo hace manipulable: simulador, laboratorio de parámetros, quiz de predicción, bug hunter con código roto o comparador interactivo. El criterio para construirla no es decorativo: existe porque el concepto no se entiende leyendo.
4. **Ejercicio guiado:** reproduce el ejemplo sobre una variante, con pasos numerados, criterios de aceptación observables y una pista plegada que orienta sin resolver.
5. **Reto opcional:** extensión sin guía para quien termina antes, claramente marcada como no evaluable.
6. **Estación de evidencia** según la sección 11, con su `aiAssist`.

Un módulo sin estación solo es admisible cuando no produce artefacto propio (portadas, contexto puro) y así se justifica en el manifiesto. Los simuladores de la sección 10 se distribuyen por categoría: ninguna guía técnica se libera sin al menos un laboratorio de código, un bug hunter y un comparador de seguridad o de decisiones, además del simulador visual.

## 13. Estrategia de construcción con IA

La guía enseña a construir software en la era de la IA: el aprendiz dirige, verifica y responde por el resultado. Esto no es un capítulo aparte sino una práctica por módulo, y la guía la modela explícitamente:

1. **Estructura mental antes que código:** cada módulo nombra el modelo mental que construye (árbol de widgets, ciclo de una petición, máquina de estados de una pantalla). La IA genera código; la estructura mental la forma el recorrido teoría → ejemplo → laboratorio → ejercicio → evidencia.
2. **Encargo por capas:** la guía enseña a pedir a la IA en el orden de la arquitectura —contrato, modelo, persistencia, servicio, interfaz— verificando cada capa antes de pedir la siguiente, y a darle contexto incremental (lo ya construido y sus decisiones) en vez de un prompt gigante.
3. **Verificación siempre:** toda salida de IA pasa por el V.E.R.A. de la sección 10 antes de aceptarse. La guía lista las alucinaciones frecuentes del stack, con la forma incorrecta y la correcta.
4. **Rechazo razonado:** el aprendiz aprende a rechazar propuestas de la IA —sobre-ingeniería, dependencias innecesarias, patrones de moda— y a registrar la razón del rechazo en la bitácora.
5. **Escalabilidad desde el primer archivo:** la guía muestra la estructura de carpetas que aguanta el crecimiento real del producto, y enseña a pedirle a la IA código que respete esa estructura, no código que la rompa.
6. **Bitácora como evidencia:** `docs/ai-log.md` registra encargo, verificación, aceptación o rechazo y razón. Se entrega como una evidencia más; en 2026 la pregunta no es si se usó IA, sino qué se le pidió, contra qué se contrastó y quién decidió.
