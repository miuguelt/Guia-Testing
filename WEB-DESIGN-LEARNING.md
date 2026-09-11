# Aprendizajes de diseño y autoría

## 2026-09-09 · Revisión editorial comparada

- Audiencia: principiante que necesita probar una aplicación propia, con conocimientos de desarrollo heterogéneos.
- Resultado buscado: justificar casos, ejecutar, interpretar fallos, repetir y producir evidencia transferible.
- Se preservaron publicación, contenido y cambios locales previos; las modificaciones se concentraron en el sistema de autoría compartido y los informes.
- Patrones candidatos: preparación con comprobación y recuperación (FastAPI); ejercicio con criterio y transferencia (Spring/Flutter); trazabilidad entre requisitos y productos (serie 1–4).
- Límite observado: ejemplos descritos sin resolver y simuladores con éxito prefijado pueden aparentar comprensión o ejecución que no ocurrió.
- Evidencia: `docs/auditoria-pedagogica-2026-09-09.md`, `artifacts/pedagogical-audit/inventory.json`, recorrido de portada/pirámide/descarga publicado y lectura de fuentes locales.
- Los patrones se registraron como candidatos en el catálogo. El usuario pidió incorporar las mejoras al proceso; esto autoriza el cambio del estándar, pero no demuestra eficacia pedagógica.
- Primera iteración aplicada en la web local: ruta de inicio y diagnóstico en portada; caso resuelto y práctica guiada en la pirámide; lenguaje de alcance moderado en pirámide y reflexión.
- Segunda iteración aplicada: el panel de descarga ahora ofrece una ruta de recuperación para distinguir carpeta, versión, entorno, dependencia y defecto antes de cambiar código.
- Tercera iteración aplicada: las evidencias de automatización y E2E ahora piden resultados observados, alcance explícito y regresión reproducible; el paquete ZIP se regeneró desde la fuente.
- Verificación pendiente: uso con un principiante real, nueva autoría completa siguiendo la plantilla y publicación posterior cuando corresponda.


## 2026-09-10 · Fundamentos antes de herramientas

Se aplicaron los patrones de trazabilidad de decisiones y separación entre
lectura, práctica y transferencia del catálogo existente. La evidencia técnica
está en docs/revision-fundamentos-tdd-bdd-2026-09-10.md. Se conservó DESIGN.md.

Un ejemplo único conecta límite, caso manual, TDD y BDD. Reproducir sus fallos
desde el contenido visible evita prometer un ciclo que el aprendiz no puede
ejecutar. Separar datos por tema permite ampliar explicaciones sin agregar otro
motor de interfaz. La ventaja pedagógica es una hipótesis: no se promovieron
reglas globales ni se afirmó comprensión sin una sesión con aprendices.

## 2026-09-10 · IA como borrador sometido a evidencia

Un panel repetido solo es útil si conserva un modelo mental estable y cambia el
trabajo cognitivo de cada estación. Por eso se mantuvo una ruta de cinco pasos y
se escribieron 16 encargos distintos. Mostrar “qué no demuestra todavía” junto a
“qué debes comprobar” reduce la tentación de equiparar una respuesta plausible
con una ejecución real.

El bloqueo del registro hasta completar existencia, contraste y explicación hace
visible la mediación humana sin fingir que tres casillas certifican competencia.
La alternativa manual conserva accesibilidad pedagógica para quien no use IA. La
eficacia del patrón sigue pendiente de una prueba con aprendices; no se propone
como regla global fuera de esta guía.
