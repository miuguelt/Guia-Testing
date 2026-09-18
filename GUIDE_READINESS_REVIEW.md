# Revisión de preparación de la Guía Testing

Fecha: 2026-09-09. Alcance: auditoría editorial, actualización del sistema de autoría y primera iteración verificable de la web local; no es una publicación del sitio.

| Dimensión | Estado | Evidencia y acción pendiente |
|---|---|---|
| Orientación | Parcial, mejorada | La portada ahora ofrece una ruta básica de cinco pasos y tres entradas según la necesidad; falta probarla con un principiante |
| Prerrequisitos | Parcial, mejorado | La descarga incluye un diagnóstico en cuatro pasos con comandos de ubicación, versión, entorno, dependencias y clasificación del fallo; falta probarlo con un principiante |
| Ejemplo y práctica | Parcial, mejorada | Pirámide incluye un oráculo ficticio, seis casos resueltos y una práctica guiada; falta repetir el patrón en más módulos |
| Variantes | Pendiente | ART-TEST-02 se monta en FastAPI; falta ruta equivalente de evidencia para otras tecnologías |
| Distribución de evidencias | Cumple, alcance estructural | Test-GuideDeliverables: 3 artefactos y 3 estaciones; no prueba calidad de la enseñanza |
| Contrato de la guía | Cumple, alcance estructural | Test-DevBrainEducationalGuide -Strict: passed, estándar declarado 2.5.0 |
| Reproducibilidad | Parcial | 50 pruebas automatizadas, validadores estructurales y comprobación sintáctica pasaron en el árbol actual; falta extracción limpia |
| Veracidad de afirmaciones | Parcial, mejorada | Se rotularon el oráculo, la proporción 70/20/10 y el caso Knight Capital como referencias didácticas; queda una revisión editorial completa |
| Recuperación y defectos | Parcial, mejorado | La práctica guiada, la descarga y TEST-EV03 separan errores de entorno de defectos del producto y exigen repetir tras corregir; falta probar el flujo con un aprendiz |
| Accesibilidad | Pendiente | Inspección visual de descarga publicada; sin auditoría completa de teclado, zoom, tamaños o axe en esta tarea |
| Transferencia | Parcial | La portada y la pirámide piden llevar la matriz al aplicativo propio; faltan ejemplos completos por tecnología |
| Evaluación humana | Pendiente | No participó un aprendiz real ni se emitió juicio del instructor |

Resultado: guía con recursos útiles y contrato estructural válido; no declarar preparación pedagógica completa. Véase [el informe](docs/auditoria-pedagogica-2026-09-09.md).


## Actualización del 10 de septiembre: fundamentos, TDD y BDD

La [revisión de contenidos](docs/revision-fundamentos-tdd-bdd-2026-09-10.md)
registra la ampliación del núcleo, la ruta reordenada y el taller compartido.
TDD/BDD cuentan con definiciones, contraejemplos, ejecución, recuperación y
transferencia. La descarga se probó tras extracción limpia: 13 pruebas y seis
escenarios. La suite de la guía tiene 72 pruebas aprobadas. Las cinco secciones
ampliadas se comprobaron a seis anchos y TDD a escala CSS 200 %.

Continúan pendientes la validación con un aprendiz, la valoración del instructor,
lectores de pantalla, zoom nativo y una auditoría completa de accesibilidad.
Los procedimientos no funcionales enseñan qué comprobar; no certifican que el
aplicativo del aprendiz haya pasado esas pruebas.

## Actualización del 10 de septiembre: mediación humana con IA

Las 18 estaciones incluyen ahora una práctica situada de IA con un ciclo único:
comprender, encargar, cuestionar, comprobar y decidir. Cada panel distingue la
propuesta de la evidencia, declara qué no se ha demostrado, ofrece recuperación y
exige tres verificaciones antes de registrar la revisión humana. La ruta también
puede completarse sin IA y advierte que no deben copiarse secretos ni datos
personales.

Se corrigieron reglas presentadas antes como universales: los porcentajes de la
pirámide y el 80 % de cobertura quedan como ejemplos contextuales; TDD y BDD se
separan de las fases de ejecución de CI; la protección de ramas depende de checks
obligatorios realmente configurados. El caso de límites conserva la cantidad
entera ficticia de 1 a 5 en explicación y simulador.

La interacción del módulo TDD fue recorrida en navegador: el registro empieza
bloqueado, se habilita con las tres comprobaciones y muestra confirmación. La
auditoría automatizada y la suite final se registran en el log de iteración. Sigue
pendiente observar a un aprendiz real, evaluar la calidad de sus explicaciones y
confirmar transferencia en un proyecto propio.

## Actualización de la versión 3.7.0: riesgo, defectos y orientación

La versión 3.7.0 consolida 18 estaciones en la secuencia web. Incorpora una
estación de priorización por riesgo con matriz probabilidad × impacto y FMEA
ligero, y una estación de gestión de defectos con ciclo Nuevo → Abierto →
Corregido → Retest → Cerrado/Reabierto. Ambas incluyen ejemplo resuelto,
contraejemplo, recuperación, transferencia y práctica humano–IA con verificación
del aprendiz.

También se añadió un laboratorio guiado de k6, un control ejecutable de
accesibilidad sobre la demo Flask, complejidad ciclomática para
`cantidad_valida`, el simulador de diseño de casos y un índice navegable por
estación. La interfaz incluye orientación por teclado, estado de búsqueda sin
resultados, botón para volver arriba, modal de cierre accesible y reinicio
explícito del progreso.

Resultado de esta iteración: contrato estructural y suite automatizada
actualizados; la validación con un aprendiz real, instructor y lector de pantalla
sigue siendo una actividad humana pendiente y no se presenta como aprobada por
esta revisión.
