# Revisión de fundamentos, TDD y BDD

Fecha: 2026-09-10. Alcance: guía web, orden pedagógico y laboratorio descargable.
El documento Word no forma parte de esta revisión.

## Resultado de la revisión

La guía ya presentaba herramientas, fragmentos de automatización y simuladores.
Faltaba conectar con suficiente detalle necesidad, regla, caso, ejecución,
diagnóstico y evidencia. TDD saltaba a una solución completa y BDD empezaba por
Gherkin con pasos que no coincidían con el ejemplo mostrado.

Se amplió el núcleo teórico y se añadió un taller reproducible con una sola
regla ficticia. No se declara que todas las especialidades del testing queden
agotadas ni que una revisión técnica demuestre comprensión por un aprendiz.

## Mapa de conceptos y práctica

| Base revisada | Dónde se enseña ahora | Aplicación observable |
|---|---|---|
| Calidad, QA y control de calidad | Fundamentos | Distinguir mejora de proceso y evaluación del producto |
| Error, defecto, fallo y depuración | Fundamentos | Explicar interpretación → condición incorrecta → préstamo inválido |
| Requisito, historia y aceptación | Fundamentos / BDD | Transformar una necesidad en una consecuencia comprobable |
| Caso, escenario, procedimiento, suite y plan | Fundamentos | Reconocer qué contiene cada pieza |
| Oráculo y aserción | Fundamentos / TDD | Comparar cantidad 6 con la regla acordada |
| Verificación y validación | Fundamentos | Separar especificación y necesidad de uso |
| Pruebas estáticas, dinámicas, manuales y automatizadas | Fundamentos | Elegir revisión o ejecución según la pregunta |
| Principios y proceso de pruebas | Fundamentos | Planificar, analizar, diseñar, ejecutar, controlar y cerrar |
| Particiones y valores límite | Diseño y niveles | Elegir representantes y vecinos de las fronteras |
| Decisiones y estados | Diseño y niveles | Resolver permisos/disponibilidad y devolución repetida |
| Caja negra, caja blanca y experiencia | Diseño y niveles | Justificar de dónde salen los casos |
| Nivel, tipo, técnica y método | Diseño y niveles | Clasificar una prueba en varios ejes sin confundirlos |
| Unidad, integración, contrato, sistema, E2E y aceptación | Diseño y niveles | Declarar qué atraviesa la prueba y qué no demuestra |
| Preparar–actuar–comprobar, fixtures y limpieza | Diseño y niveles | Construir una prueba repetible con efectos verificados |
| Dummy, stub, spy, mock y fake | Diseño y niveles | Justificar qué dependencia se sustituye |
| Aislamiento, datos y asincronía | Diseño y niveles | Evitar dependencia del orden y esperas arbitrarias |
| Prueba manual y exploración | Diseño y niveles | Caso guiado y misión de 15 minutos con registro |
| Defectos, severidad, prioridad y trazabilidad | Diseño y niveles | Reporte diligenciado y enlace requisito → defecto → corrección |
| TDD y refactorización | TDD | Dos etapas rojas, verdes y suite final de 13 pruebas |
| BDD, tres amigos y documentación viva | BDD | Descubrir, formular y automatizar ejemplos |
| Gherkin, esquema, ejemplos, etiquetas y pasos | BDD | Seis escenarios que llaman la función real |
| TDD, BDD, ATDD y E2E | BDD | Comparación de propósito y alcance |
| Cobertura de requisitos, líneas y ramas | Cobertura | Identificar qué mide cada porcentaje |
| Mutación | Cobertura / taller | Un límite incorrecto es detectado por una aserción |
| Confirmación, regresión, humo e intermitencia | Cobertura | Repetir el defecto y comprobar efectos relacionados |
| Accesibilidad, seguridad y rendimiento | Cobertura | Procedimientos, contexto, métricas y límites |
| Compatibilidad, usabilidad y recuperación | Cobertura | Matriz de entornos y observación de resultados |
| API, persistencia, concurrencia e idempotencia | Cobertura / transferencia BDD | Comprobar respuesta, datos y efectos, no solo HTTP |
| Entrada, salida y riesgo residual | Cobertura / reto | Informar probado/no probado y decisión responsable |
| CI, observabilidad e IA | Módulos existentes | Conservar resultados y tratar IA como ayuda verificable |

## Ruta y coherencia

Menú, botones secuenciales y mapa presentan Fundamentos → Diseño y niveles →
TDD → BDD → variantes técnicas → E2E → Cobertura → CI. La portada distingue
alternativas técnicas y ampliaciones. Los identificadores y el progreso previo
se conservan. Los talleres alimentan ART-TEST-01 y ART-TEST-02; E2E y defectos
se vinculan con ART-TEST-03.

Se eliminó la promesa de cobertura completa por usar TDD y la atribución de
un umbral universal del 80 % a ADSO. El reto pide justificar alcance y umbral
con el instructor y escoger una tecnología. Se distinguieron intermitencia
(flaky) y fragilidad (brittle).

TDD y BDD comparten R-CANT. El laboratorio comprueba solamente cantidad;
permiso, existencias, persistencia y concurrencia se plantean explícitamente
para transferencia. No se presentan como capacidades implementadas.

## Evidencia técnica

- Python 3.11.15, pytest 8.3.3, Behave 1.3.3 y Chromium 153.0.8010.12.
- Suite de la guía: 72 pruebas aprobadas.
- Las pruebas del taller cargan los ejemplos desde los scripts publicados.
  Reproducen rojo, verde, fallo del límite, solución final y refactorización.
- Extracción del ZIP a una carpeta limpia: archivos idénticos a los ejemplos;
  13 pruebas pytest y 6 escenarios / 18 pasos Behave aprobados.
- Mutación del máximo a 4: Behave informa 5 escenarios aprobados y 1 fallido.
- Navegador: 30 combinaciones de las cinco secciones ampliadas con anchos
  320, 390, 768, 1440, 1920 y 2560 px; sin desbordamiento de página.
- Inspección visual de introducciones, tablas y código en capturas de escritorio
  y móvil. Navegación Diseño → TDD → BDD comprobada, incluida tecla Enter.
- TDD con escala CSS 200 %: sin desbordamiento de página. Zoom nativo del
  navegador y lectores de pantalla requieren revisión manual adicional.
- Entrada HTTP existente: 16 módulos cargados, sin errores de página ni
  respuestas HTTP fallidas. También se verificó apertura directa sin servidor.
- Contrato educativo estricto y presentación de código: aprobados.
- Calidad web estática: 0 errores; advertencias de tamaños tipográficos heredados.
- Modularidad: 0 errores; advertencias de archivos grandes heredados.
  Se extrajeron seis catálogos de un archivo sobredimensionado; sus objetos
  cargados antes y después resultaron idénticos.
- Contrato de evidencias: tres estaciones y consolidación aprobadas usando
  copias exactas del HTML web, manifiesto y registro en una carpeta plana.
  El validador espera index.html y manifiesto juntos y no resuelve la entrada
  web/ del manifiesto; invocarlo directamente en la raíz produce falsos faltantes.
- Verificación rápida DevBrain: sintaxis y modularidad aprobadas, con avisos
  del detector de posibles secretos en material previo. Los dos ejemplos web
  señalados usan delimitadores de plantilla; las otras dos coincidencias
  están en datos de prueba del auditor. No son evidencia de una revisión de
  seguridad completa. La suite real se ejecutó por separado.
- Codebase Memory actualizado después de separar los catálogos.

Los archivos de medición y capturas de esta sesión se conservan localmente en
.codex/reviews/. No se utilizaron porcentajes de cobertura como prueba de
corrección del contenido educativo.

## Fuentes consultadas

- [Cucumber: BDD](https://cucumber.io/docs/bdd/): colaboración y prácticas.
- [Cucumber: Gherkin](https://cucumber.io/docs/gherkin/reference/): estructura de escenarios.
- [Martin Fowler: TDD](https://martinfowler.com/bliki/TestDrivenDevelopment.html): ciclos de desarrollo.
- [Martin Fowler: dobles de prueba](https://martinfowler.com/articles/mocksArentStubs.html): distinciones entre dobles.
- [pytest: parametrización](https://docs.pytest.org/en/stable/how-to/parametrize.html): múltiples datos por comprobación.
- [ISTQB CTFL](https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/): referencia para revisar amplitud de fundamentos.

Consulta: 10 de septiembre de 2026. Tablas, datos y talleres son elaboración
didáctica propia; no se reproducen temarios oficiales ni se emite certificación.

## Límites y siguiente validación

La base conceptual se amplió; la validación con un principiante real y la
valoración del instructor siguen pendientes. Tampoco se declara auditoría
integral WCAG, medición de aprendizaje, rendimiento en producción ni ejecución
de todas las variantes de infraestructura.

Pruebas basadas en propiedades, fuzzing, sistemas distribuidos y estrategias
avanzadas de carga pueden desarrollarse como ampliaciones. No son requisitos
para terminar este primer ciclo de diseño, TDD, BDD y evidencia.
