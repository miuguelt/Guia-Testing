# Contrato de distribución responsiva

## Problema

La guía combinaba un menú lateral fijo de 280 px con un área principal de
`width: 100%` y margen lateral. En ciertos anchos el margen se sumaba al ancho
completo y el documento terminaba más ancho que la ventana. A la vez, varias
rejillas partían en dos o tres columnas y solo se apilaban con consultas
`max-width`; eso comprimía paneles y dejaba espacio útil mal aprovechado cuando
el menú lateral estaba activo.

## Decisión

La hoja `web/css/styles.css` usa Mobile First desde 320 px:

- el menú lateral inicia oculto y el botón de navegación cumple 42 px;
- `.main-wrapper` ocupa todo el ancho disponible;
- las rejillas de módulos comienzan en una columna;
- los hijos de Grid/Flex relevantes declaran `min-width: 0`;
- los bloques de código desplazan su contenido dentro de su propia caja.

### Ancho útil de los textos

Los contenedores de texto natural ocupan `width: 100%` del ancho interno de su
panel. No se aplica un `max-width` basado en caracteres (`ch`) a párrafos,
listas, avisos, introducciones, ayudas o citas: ese límite deja un vacío visual
cuando la tarjeta sí puede crecer. Los componentes que deben ser compactos por
semántica —como modales, controles específicos, sellos, hojas formales de
impresión y bloques de código— son excepciones explícitas y no representan la
regla general.

Las columnas se habilitan mediante `@container section-card` según el ancho
real del panel. El menú lateral solo se fija desde `85rem`; en ese estado el
área principal usa `width: calc(100% - var(--sidebar-width))` y el mismo margen
lateral, por lo que no se produce una suma de 100 % más 280 px.

El laboratorio de IA aplica el mismo contrato con contenedores `gema` y `lab`.
El formulario de evidencias apila campos y firmas en móvil, y el lienzo de
firma se adapta al ancho disponible.

## Prime

No hay dependencias ni selectores de PrimeNG, PrimeVue o PrimeReact en este
repositorio. La causa de la incidencia es CSS propio; no debe atribuirse a un
componente de Prime sin evidencia de una integración real.

## Aceptación y regresión

`tests/test_responsive_layout.py` comprueba el contrato base y sus umbrales.
La verificación renderizada cubre 320, 390, 768, 1440, 1920 y 2560 px; en la
guía cargada cada ancho mantiene `scrollWidth === clientWidth` y los paneles
solo forman columnas cuando el contenedor tiene capacidad.
