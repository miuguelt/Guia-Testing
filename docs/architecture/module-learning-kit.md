# Kit de comprensión por módulo

## Propósito

Los 16 módulos comparten una orientación breve, pero no un panel de métricas
genérico. Cada kit convierte el tema del módulo en una ruta de pensamiento
propia: pregunta de trabajo, señal observable, evidencia que se conserva,
cuatro pasos seleccionables, un modelo visual semántico y un micro-laboratorio
de transferencia.

## Decisión

El kit se implementa como un vertical slice independiente y se monta después
de `CodeRenderer`, sin modificar el contenido pedagógico específico de cada
módulo. La separación permite ajustar datos, comportamiento y estilos sin
crear dependencias entre los módulos.

- `web/js/module-learning-kit-data.js`: foco, señales, escenario, recorrido y
  laboratorio específico de cada módulo.
- `web/js/module-learning-kit.js`: orientación breve, recorrido seleccionable,
  modelos visuales por concepto, un micro-laboratorio y el mapa general de la
  ruta.
- `web/css/module-learning-kit.css`: composición responsive, variantes de
  color por tema, estados de interacción y reglas de impresión.

Las decisiones acertadas se registran en `TestingSession` como
`sim-module-decisions`. Los micro-laboratorios se
registran por separado como `sim-module-special`, de modo que la nueva práctica
no sobrescribe el simulador existente. Cada acierto otorga XP una sola vez por
montaje del laboratorio.

La portada usa un mapa HTML de cuatro estaciones. Los modelos visuales de los
módulos permanecen en HTML/CSS para que expliquen una relación concreta, sean
accesibles y no dependan de una imagen plana o decorativa.

## Contrato de carga

`CodeRenderer` reemplaza el contenido dinámico de las tarjetas. Por eso los
scripts de datos y comportamiento del kit deben cargarse después de
`code-renderer.js` en `web/index.html`. El kit se inserta después del título y
la introducción propios del módulo; así orienta la lectura sin convertirse en
un segundo encabezado. El comportamiento es idempotente: omite un módulo si
ya tiene un kit y no duplica el mapa de inicio.

## Verificación

`tests/test_learning_kit.py` valida presencia, cobertura de los 16 módulos,
contenido específico, accesibilidad básica, el modelo visual semántico y el
registro separado del laboratorio. La revisión visual también comprueba la
portada, el mapa de ruta, el recorrido seleccionable y las variantes de riesgo,
secuencia y decisión en navegador. La suite completa de Python debe seguir en
verde después de cualquier cambio transversal.
