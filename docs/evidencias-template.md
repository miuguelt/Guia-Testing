# Registro de evidencia — plantilla de trabajo

Esta plantilla acompaña el registro local de la guía. Diligencia una copia por
artefacto y conserva los archivos fuente, resultados de ejecución y decisiones
en el repositorio. El instructor define el instrumento, el canal de entrega y
los criterios institucionales aplicables.

## Ruta AA12 a AA16

Usa esta secuencia para que la evidencia no sea solo una descripción de lo que
hiciste, sino un conjunto de archivos que otra persona pueda revisar y repetir.
La estructura es una adaptación didáctica de ISO/IEC/IEEE 29119-3:2021 y no
declara conformidad normativa; valida el formato institucional con el instructor:

| Código | Actividad | Archivo principal | Evidencia que debe quedar |
| --- | --- | --- | --- |
| AA12 | Realizar plan de pruebas | `docs/pruebas/01-plan-pruebas-29119-3.md` | Alcance, requisitos, riesgos, estrategia, criterios de entrada y salida y trazabilidad. |
| AA13 | Definir casos de prueba | `docs/pruebas/02-casos-prueba.md` | Casos válidos, inválidos, límites, permisos, datos, pasos, oráculo y archivo automatizado. |
| AA14 | Definir ambiente de prueba | `docs/pruebas/03-ambiente-prueba.md` | Versiones, dependencias, configuración segura, datos sintéticos, limpieza y comprobación de humo. |
| AA15 | Realizar pruebas | `docs/pruebas/04-registro-ejecuciones.md` | Compromiso evaluado, comando, resultado esperado y observado, reportes, defectos y regresión. |
| AA16 | Documentar las pruebas | `docs/pruebas/06-informe-final-pruebas.md` | Resumen, criterios de salida, cobertura interpretada, riesgo residual, no probado y recomendación. |

Conserva además `docs/pruebas/05-registro-defectos.md`,
`docs/pruebas/07-matriz-trazabilidad.csv`, el código en `tests/`, los resultados
seleccionados en `test-results/` y `docs/ai-log.md` cuando corresponda. No
incluyas credenciales, datos personales reales, archivos temporales ni reportes
que no puedas explicar.

## Identificación

- Artefacto: `ART-TEST-__`
- Aprendiz: `<NOMBRE_COMPLETO>`
- Ficha: `<NÚMERO_DE_FICHA>`
- Fecha: `<AAAA-MM-DD>`
- Repositorio o commit: `<URL_O_COMMIT>`

## Propósito y entradas

- Propósito: `<QUÉ_SE_DESEA_DEMOSTRAR>`
- Entradas utilizadas: `<REQUISITOS_CÓDIGO_DATOS_Y_HERRAMIENTAS>`

## Desarrollo

Describe qué hiciste, qué comandos ejecutaste y qué decisiones tomaste. Incluye
enlaces relativos a los archivos del repositorio y no pegues secretos, tokens ni
datos personales reales.

```text
Comando:
Resultado:
Archivo o enlace de evidencia:
```

## Resultado y criterio

- Resultado observado: `<RESULTADO_REPRODUCIBLE>`
- Criterio relacionado: `<CRITERIO_DEL_REGISTRO>`
- Instrumento para revisión: `<INSTRUMENTO_DEFINIDO_POR_EL_INSTRUCTOR>`
- Lista de verificación: `<ITEMS_COMPLETADOS_Y_PENDIENTES>`

## Revisión y siguiente paso

- Revisión V.E.R.A.: `<VERIFICAR_EJECUTAR_REVISAR_ATRIBUIR>`
- Observaciones o defectos: `<HALLAZGOS>`
- Siguiente paso: `<NEXT_STEP>`

## Cierre de entrega

- Criterios de salida verificados: `<SÍ_NO_Y_EVIDENCIA>`
- Requisitos sin prueba o con prueba bloqueada: `<LISTA_O_NINGUNO>`
- Riesgo residual aceptado por: `<RESPONSABLE_Y_FECHA>`
- Enlace al informe final: `<RUTA_RELATIVA>`
