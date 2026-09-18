# Ampliación de fundamentos, TDD y BDD

Fecha: 2026-09-10. Aprendiz: persona que conoce variables, funciones y terminal,
pero necesita aprender a decidir qué probar y cómo interpretar el resultado.
Resultado: convertir una regla en casos manuales, un ciclo TDD verificable,
escenarios BDD y evidencia enlazada con el riesgo que permanece.

Caso ficticio: préstamo de equipos. Cantidad entera entre 1 y 5, permiso y
disponibilidad. El laboratorio ejecutable comprueba solamente cantidad; los
casos de autorización, persistencia y concurrencia se diseñan para transferencia.

Ruta: fundamentos → diseño → TDD → BDD → una variante técnica → E2E →
cobertura y mantenimiento → CI → cierre. IA y operación son ampliaciones.
Se conservan los identificadores de las 18 estaciones y sus evidencias; la versión 3.7.0 incorpora priorización por riesgo y gestión de defectos.
Estimación didáctica del taller TDD/BDD: 60–90 minutos, incluida recuperación;
no se agregan horas oficiales ni se suman todas las variantes obligatoriamente.

Se reutilizan bloques declarativos, tablas, pasos, glosario, código del SDK,
laboratorios existentes y el registro de evidencias. Se conserva DESIGN.md.
No se cambia la arquitectura de navegación ni el motor de progreso en esta
revisión editorial. Los módulos nuevos contienen datos de enseñanza.

Criterios observables:

- Dado un principiante, al abrir TDD o BDD encuentra definición, propósito,
  prerrequisitos, ejemplo, contraejemplo, práctica y recuperación.
- Dado el laboratorio, la primera aserción falla con la implementación inicial;
  el caso límite rechaza la solución constante y la suite final pasa.
- Dado el archivo Gherkin, Behave resuelve todos sus pasos y verifica seis casos
  usando la función real del laboratorio, sin servidor ni credenciales.
- Dado el contenido ampliado, las tablas y el código conservan acceso a su
  texto en 320, 390, 768, 1440, 1920 y 2560 px y a 200 % de zoom.

Validación humana con un aprendiz: pendiente. La lectura funciona sin conexión;
instalar pytest y Behave por primera vez requiere paquetes disponibles.

## Acompañamiento humano–IA distribuido · v3.6

Fecha: 2026-09-10. La IA se presenta como asistente opcional, no como oráculo ni
como evidencia. Cada una de las 18 estaciones aplica el mismo contrato:
comprender → encargar → cuestionar → comprobar → decidir. La instrucción cambia
según el resultado y el riesgo del módulo; no se reutiliza un prompt genérico.

Tesis visual: laboratorio técnico, progresivo, verificable y sobrio. El panel
aparece después de la explicación y la práctica del módulo, antes de completarlo.
Separa visualmente borrador, comprobación, límite de la evidencia, recuperación y
decisión humana. Es usable sin IA y no realiza solicitudes de red.

Estados previstos: pendiente, tres comprobaciones parciales, listo para registrar,
revisión registrada y error de almacenamiento local. En vista estrecha, la ruta y
las tarjetas pasan a una columna; los controles conservan objetivos táctiles y
foco visible. Vistas de referencia: 320, 390, 768 y 1440 px.

Criterios observables:

- Dado cualquier módulo, existe una práctica específica con qué verificar, qué no
  demuestra la IA, la decisión humana y una ruta de recuperación.
- Dadas menos de tres comprobaciones, el registro permanece deshabilitado.
- Dadas las tres comprobaciones, el aprendiz puede registrar su revisión local y
  recibe confirmación visible.
- Dado un contexto sin IA, las mismas preguntas permiten realizar la práctica a
  mano; ningún avance exige una cuenta externa ni compartir datos.

La comprensión real y la transferencia a un proyecto del aprendiz siguen siendo
hipótesis pendientes de observación con personas, no resultados de estas pruebas.
