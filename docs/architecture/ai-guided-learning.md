# Acompañamiento humano–IA distribuido

## Decisión

La IA se integra en las 18 estaciones como una práctica breve y repetible, no como
una respuesta automática ni como un capítulo aislado. Cada módulo conserva su
contenido técnico y añade un recorrido con cinco momentos:

1. **Comprender:** el aprendiz formula la regla o el riesgo con sus palabras.
2. **Encargar:** usa una instrucción delimitada para obtener un borrador de la IA.
3. **Cuestionar:** identifica supuestos, archivos inventados, aserciones débiles o
   información que la IA no puede conocer.
4. **Comprobar:** ejecuta una acción observable o contrasta la propuesta con el
   requisito, el código y la documentación del proyecto.
5. **Decidir:** acepta, corrige o rechaza la propuesta y registra la razón.

La implementación se separa en datos por módulo, un componente de interfaz y una
hoja de estilos. El componente no llama proveedores externos ni solicita claves;
genera texto copiable y guarda únicamente el estado local de la práctica.

## Criterios de aceptación BDD

### Escenario: un aprendiz recibe ayuda situada en cualquier módulo

- **Dado** que el aprendiz abre una de las 18 estaciones de la ruta,
- **cuando** termina de leer su modelo mental,
- **entonces** encuentra una práctica humano–IA específica para ese tema,
- **y** puede copiar una instrucción con contexto, tarea, restricciones y salida.

### Escenario: la propuesta de IA no se confunde con evidencia

- **Dado** que la IA entrega una respuesta plausible,
- **cuando** el aprendiz revisa la práctica,
- **entonces** ve qué debe comprobar, qué no puede concluir todavía y qué decisión
  humana debe registrar antes de avanzar.

### Escenario: la práctica funciona sin proveedor ni conexión

- **Dado** que la guía se abre localmente sin una cuenta de IA,
- **cuando** el aprendiz usa el panel,
- **entonces** puede leer la instrucción, completar el control manual y continuar;
- **y** la guía no envía código, datos personales ni credenciales a un servicio.

### Escenario: el aprendiz recupera un error común

- **Dado** que una salida inventa un archivo, una función o una dependencia,
- **cuando** el aprendiz consulta la ruta de recuperación,
- **entonces** recibe una comprobación concreta antes de modificar código.

## Dirección de dependencias

`index.html` carga `ai-guided-practice-data.js` antes de
`ai-guided-practice.js`. El componente lee `window.AI_GUIDED_PRACTICES`, se monta
en las secciones ya renderizadas por `CodeRenderer` y registra la interacción en
`TestingSession` cuando el aprendiz confirma la revisión. No modifica el motor de
evidencias ni emite juicios de aprobación.
