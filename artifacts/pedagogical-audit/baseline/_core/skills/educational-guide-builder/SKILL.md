---
name: educational-guide-builder
description: Diseñar, implementar, revisar y evolucionar guías web educativas completas para formación SENA y proyectos ADSO. Usar cuando una tarea incluya guía, aprendiz, instructor, resultado de aprendizaje, proyecto formativo, producto entregable, evidencia, rúbrica, portal didáctico o una web que deba enseñar y organizar una entrega verificable.
---

# Educational Guide Builder

Construir una experiencia que permita al aprendiz comprender, practicar, producir evidencia y transferirla al proyecto. La guía no es un temario ni un simulador aislado.

## Flujo obligatorio

1. Consultar el contexto de la tarea y leer la fuente curricular disponible. Separar texto oficial, adaptación didáctica, ejemplo ficticio, supuesto y pregunta pendiente.
2. Crear o actualizar `guide.manifest.json` antes del contenido. Incluir programa, competencia, resultado de aprendizaje, fase, actividad, reto, producto, secuencia SENA, evidencias, criterios, instrumentos, duración declarada, fuentes y límites.
3. Crear `deliverables.registry.json` cuando exista un producto final, validable contra `_core/knowledge_base/schemas/deliverables.registry.schema.json`. Registrar cada artefacto con `purpose`, `inputs`, `instructions`, `example`, `fields`, `checklist`, `criterion`, `instrument`, `evidence`, `nextStep`, `evidenceType`, `aiAssist` y `station`. Declarar además el bloque `submission`: qué se carga, con qué nomenclatura, dónde, qué se califica y el mapa `tipo de evidencia → artefactos → criterio → instrumento`.
4. Diseñar la ruta `reflexión → contextualización → apropiación → transferencia` y la experiencia visible `orientar → ejemplo → practicar → evidencia → transferir`.
5. **Distribuir las evidencias, no acumularlas.** Cada artefacto declara `station.sectionId` y la sección correspondiente monta `data-db-evidence="<id>"` después de su teoría, su ejemplo resuelto y su ejercicio. El cierre monta `data-db-evidence-dossier` y solo consolida: ninguna evidencia puede aparecer allí por primera vez. La mecánica la pinta `DevBrainEvidence` (paquete `devbrain-evidence.js` + `.css`) o `DevBrainSDK.evidence`; no se escribe un motor de formularios por guía. Publicar la copia cargable con `Publish-GuideEvidenceRegistry.ps1 -Path <guía> -Apply` para que las estaciones funcionen con `file://`. Contrato completo en la sección 11 del estándar y en `rule.evidence-per-station`.
6. Para cada artefacto, explicar qué es, para qué sirve, cómo se construye, cómo se ve un buen resultado, cómo se comprueba y cómo llega a la siguiente guía.
7. Si el formato es web, combinar esta skill con `skill.web-learning-design-coach` y `skill.build-high-quality-web`. Integrar `devbrain-learner-sdk` para gamificación (XP, niveles, toasts, persistencia) y arquitectura SPA.
8. Aplicar el **Protocolo V.E.R.A.** (Verificar existencia, Ejecutar TDD, Revisar calidad/seguridad, Atribuir en bitácora) al tamaño de cada evidencia mediante `aiAssist`, no como un capítulo aparte sobre IA. Incorporar además al menos 4 simuladores interactivos en vivo (Visual/Arquitectura, Editor/Sandbox, Debugging/Bug Hunter y Security/Assertion Validator).
9. Preferir constructores locales, tablas copiables, plantillas y exportaciones Markdown/CSV cuando ayuden a producir evidencia. Etiquetar siempre lo que la herramienta comprueba y lo que no puede demostrar.
10. Nunca inventar códigos SENA, competencias, nombres institucionales, horas oficiales, datos de usuarios o certificaciones. Marcar como “por confirmar con instructor” aquello que no tenga fuente.
11. Validar con:

   ```powershell
   & 'C:\Users\Miguel\Documents\Aplicaciones\_infrastructure\devbraind\scripts\Test-DevBrainEducationalGuide.ps1' -Path '<guia>' -Strict
   & 'C:\Users\Miguel\Documents\Aplicaciones\_infrastructure\devbraind\scripts\Test-GuideDeliverables.ps1' -Path '<guia>' -Strict
   & 'C:\Users\Miguel\Documents\Aplicaciones\_core\skills\build-high-quality-web\scripts\Test-WebQuality.ps1' -Path '<guia>' -FailOn Error
   ```

12. Hacer un recorrido de primera vez: localizar propósito, entender siglas, completar una actividad, recuperar un error, producir el artefacto y reconocer qué queda pendiente de validación humana.
13. Registrar la iteración en `GUIDE_ITERATION_LOG.md` y el aprendizaje de diseño en `WEB-DESIGN-LEARNING.md`. Promover patrones globales solo con evidencia repetida o aprobación explícita.

## Gates de liberación

- **Curricular:** la alineación tiene fuente o está marcada como adaptación.
- **Proyecto:** cada actividad incrementa el producto auténtico.
- **Entregable:** cada artefacto tiene explicación, ejemplo, plantilla, criterio, instrumento, evidencia y transferencia.
- **Distribución:** cada evidencia se pide en su sección, el cierre solo consolida y el protocolo de carga está declarado.
- **Pedagógico:** existen reflexión, contextualización, apropiación, transferencia y retroalimentación accionable.
- **Web:** pasan estáticos, responsive, teclado, foco, zoom, estados y revisión visual.
- **Seguridad:** no hay secretos en navegador, datos sensibles ni certificados engañosos.
- **Humano:** la validación con personas y la decisión del instructor siguen siendo externas a la automatización.

## Recursos

- Contrato de artefactos: `references/deliverable-contract.md`.
- Esquema del registro: `_core/knowledge_base/schemas/deliverables.registry.schema.json`.
- Regla de distribución: `_core/knowledge_base/rules/evidence-per-station.json`.
- Estándar canónico: `_core/knowledge_base/EDUCATIONAL_GUIDE_STANDARD.md`.
- Skill de aprendizaje web: `_core/skills/web-learning-design-coach/SKILL.md`.
- Skill de calidad web: `_core/skills/build-high-quality-web/SKILL.md`.
