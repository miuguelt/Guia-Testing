/** Capa visual e interactiva específica para cada módulo de la guía. */
(function (global) {
    'use strict';

    const moduleOrder = [
        'm-reflexion', 'm-piramide', 'm-tdd', 'm-bdd',
        'm-pytest-fastapi', 'm-pytest-flask', 'm-jest-react', 'm-junit-jsp', 'm-playwright',
        'm-cobertura', 'm-cicd', 'm-observabilidad', 'm-ia-testing',
        'm-gema-testing', 'm-herramientas-ia', 'm-reto'
    ];
    const phases = [
        ['01', 'Comprender', 'Riesgo, propósito y lenguaje común', ['m-reflexion', 'm-piramide']],
        ['02', 'Practicar', 'Herramientas, capas y ciclos', ['m-tdd', 'm-bdd', 'm-pytest-fastapi', 'm-pytest-flask', 'm-jest-react', 'm-junit-jsp']],
        ['03', 'Verificar', 'Flujos, métricas y operación', ['m-playwright', 'm-cobertura', 'm-cicd', 'm-observabilidad']],
        ['04', 'Transferir', 'IA responsable y reto integrador', ['m-ia-testing', 'm-gema-testing', 'm-herramientas-ia', 'm-reto']]
    ];
    const symbols = {
        risk: '◎', layers: '△', contract: '{}', context: '◌', interface: '◫', java: '☕',
        cycle: '↻', language: '≋', browser: '▣', coverage: '▥', pipeline: '→', signals: '⌁',
        ai: '✦', prompt: '⌘', tools: '⚙', evidence: '✓'
    };
    const visualPresets = {
        risk: { kind: 'path', title: 'Del riesgo a la barrera', description: 'Una decisión de calidad empieza por el daño que quieres evitar y termina en un control que puedas revisar.' },
        layers: { kind: 'pyramid', title: 'La pregunta decide la capa', description: 'Usa la capa que responda la pregunta con el menor costo y la evidencia suficiente para ese riesgo.' },
        contract: { kind: 'path', title: 'Entrada → operación → respuesta', description: 'Un contrato de API se comprueba siguiendo la información desde lo que envías hasta lo que la aplicación devuelve.' },
        context: { kind: 'path', title: 'Qué debe quedar aislado', description: 'El aislamiento se reconoce cuando el caso conserva su resultado aunque cambie el orden de ejecución.' },
        interface: { kind: 'states', title: 'La interfaz comunica estados', description: 'La prueba sigue la experiencia: qué aparece, qué puede hacer la persona y qué confirma el resultado.' },
        java: { kind: 'triptych', title: 'Regla, dependencia y efecto', description: 'Aislar una unidad no significa ignorar sus efectos: también debes comprobar qué dependencia se usó y qué no se guardó.' },
        cycle: { kind: 'loop', title: 'Rojo → verde → refactor', description: 'El fallo inicial orienta el diseño; la suite se repite después de cada cambio para conservar la regla.' },
        language: { kind: 'triptych', title: 'Dado → cuando → entonces', description: 'Un escenario comprensible conecta la condición inicial, la acción y el resultado que negocio puede reconocer.' },
        browser: { kind: 'path', title: 'Objetivo → señal → evidencia', description: 'Un recorrido E2E protege un objetivo de la persona y conserva la señal que explica el resultado.' },
        coverage: { kind: 'triptych', title: 'Ejecutado no significa demostrado', description: 'La cobertura muestra por dónde pasó la suite; el riesgo y la aserción explican qué quedó realmente comprobado.' },
        pipeline: { kind: 'path', title: 'Cambio → suite → decisión', description: 'La entrega avanza solo cuando el cambio tiene una ejecución identificable y un resultado que el equipo puede interpretar.' },
        signals: { kind: 'triptych', title: 'Señal + contexto = diagnóstico', description: 'Un número aislado alerta; la versión, la ruta y el momento ayudan a formular una causa probable.' },
        ai: { kind: 'path', title: 'Borrador → revisión → decisión', description: 'La IA puede acelerar la propuesta, pero la persona conserva la responsabilidad de ejecutar, comprobar y explicar.' },
        prompt: { kind: 'path', title: 'Contexto → encargo → criterio', description: 'Un encargo útil declara qué se necesita, sobre qué alcance y cómo se reconocerá una salida suficiente.' },
        tools: { kind: 'triptych', title: 'Necesidad, alcance y control', description: 'La herramienta se elige por una tarea medible y por la menor exposición necesaria, no por la cantidad de archivos que produzca.' },
        evidence: { kind: 'path', title: 'Requisito → caso → evidencia', description: 'La trazabilidad convierte una ejecución en una decisión defendible: qué se quería comprobar, qué ocurrió y qué se conserva.' }
    };
    const triptychPresets = {
        java: [['Unidad', 'La regla se ejecuta aislada'], ['Doble', 'La dependencia responde de forma controlada'], ['Efecto', 'El resultado y la ausencia de guardado quedan comprobados']],
        language: [['Dado', 'Condición y datos iniciales'], ['Cuando', 'Acción con intención de negocio'], ['Entonces', 'Resultado observable']],
        coverage: [['Ejecutado', 'La línea o rama fue recorrida'], ['Faltante', 'Existe un riesgo sin caso'], ['Decisión', 'El equipo explica el alcance']],
        signals: [['Señal', 'Latencia, error o traza'], ['Contexto', 'Versión, ruta y momento'], ['Diagnóstico', 'Causa probable y siguiente paso']],
        tools: [['Necesidad', 'Tarea concreta que debe resolverse'], ['Alcance', 'Datos y archivos indispensables'], ['Control', 'Verificación con la suite propia']]
    };
    const pathPresets = {
        risk: [['Riesgo', 'Nombra el daño que quieres evitar'], ['Impacto', 'Describe a quién y qué afecta'], ['Barrera', 'Elige el control que limita la exposición'], ['Decisión', 'Registra por qué el cambio puede avanzar']],
        contract: [['Entrada', 'Dato y formato que recibe la API'], ['Validación', 'Regla que acepta o rechaza'], ['Respuesta', 'Código y cuerpo que devuelve'], ['Persistencia', 'Efecto que queda o no queda guardado']],
        context: [['Sesión', 'Identidad y permisos del caso'], ['Datos', 'Punto de partida controlado'], ['Orden', 'Resultado independiente de otros tests'], ['Limpieza', 'Estado listo para el siguiente caso']],
        browser: [['Objetivo', 'Resultado que la persona quiere lograr'], ['Localizador', 'Control encontrado por intención'], ['Estado', 'Señal que habilita el paso siguiente'], ['Traza', 'Evidencia para explicar una falla']],
        pipeline: [['Cambio', 'Versión identificable que entra al flujo'], ['Ambiente', 'Dependencias y datos con que se ejecuta'], ['Reporte', 'Resultado que se puede leer y conservar'], ['Compuerta', 'Criterio para publicar o detener']],
        ai: [['Contexto', 'Requisito y alcance mínimo'], ['Borrador', 'Propuesta que aún no es evidencia'], ['Prueba', 'Ejecución real del caso generado'], ['Revisión', 'Decisión humana sobre lo que se acepta']],
        prompt: [['Alcance', 'Archivos, riesgo y límites'], ['Restricciones', 'Datos que no deben exponerse'], ['Comando', 'Forma concreta de comprobar la salida'], ['Criterio', 'Condición para considerar terminado el encargo']],
        evidence: [['Requisito', 'Regla que debe demostrarse'], ['Caso', 'Entrada y resultado esperado'], ['Resultado', 'Lo que realmente ocurrió'], ['Evidencia', 'Registro que permite revisar la decisión']]
    };
    const statePreset = [
        ['Carga', 'La interfaz informa que está trabajando.'],
        ['Vacío', 'Explica qué falta y qué puede hacer la persona.'],
        ['Error', 'Describe el problema y ofrece una recuperación.'],
        ['Confirmado', 'Muestra el efecto que la persona esperaba.']
    ];

    const escapeHtml = (value) => String(value ?? '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    const make = (tag, className, text) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    };
    const safeClass = (value) => String(value || 'choice').replace(/[^a-z0-9_-]/gi, '');
    const getKit = (moduleId) => {
        const catalog = global.MODULE_LEARNING_KITS || {};
        if (catalog[moduleId]) return catalog[moduleId];
        const title = global.MODULES && global.MODULES[moduleId] && global.MODULES[moduleId].title;
        return {
            moduleNumber: '--', visual: 'signals', visualLabel: 'Señal', focus: title || 'Concepto central',
            eyebrow: 'RUTA · MÓDULO', headline: title || 'Conecta la regla con una evidencia',
            intro: 'Relaciona el concepto con una señal observable y deja una razón para tu siguiente paso.',
            question: '¿Qué puedes observar?', signal: 'Resultado visible', evidence: 'Nota de aprendizaje',
            flow: [['01', 'Ubica', 'Nombra la regla o riesgo.'], ['02', 'Decide', 'Elige una pregunta comprobable.'], ['03', 'Practica', 'Observa una señal.'], ['04', 'Explica', 'Conserva la decisión.']],
            metrics: [['Entender', 90], ['Practicar', 80], ['Explicar', 70]],
            table: [['Regla', 'Define lo correcto', 'Escribe un oráculo observable']],
            scenario: ['¿Qué haces antes de terminar?', ['Pasar de largo', 'Relacionar regla y resultado', 'Cambiar de herramienta'], 1, 'La evidencia conecta regla, observación y decisión.'],
            special: { type: 'choice', label: 'Chequeo de señal', title: 'Conecta la regla con un resultado', prompt: '¿Qué opción deja evidencia?', options: ['Ignorarla', 'Relacionarla con un resultado observable', 'Cambiar de herramienta'], answer: 1, success: 'Una decisión útil puede explicarse y repetirse.' }
        };
    };
    const awardSuccess = (container, moduleId, message, xp = 10) => {
        if (container.dataset.awarded === 'true') return;
        container.dataset.awarded = 'true';
        if (global.TestingSession) global.TestingSession.recordSimulator('sim-module-special', 1, 1, `${moduleId}: ${message}`);
        if (global.GAMIFICATION) global.GAMIFICATION.addXP(xp, `Laboratorio del módulo: ${moduleId}`);
    };

    const ModuleLearningKit = {
        renderFlowDiagram(kit, moduleId) {
            const steps = (kit.flow || []).slice(0, 4);
            const first = steps[0] || ['01', 'Ubica', 'Nombra la idea central.'];
            return `<section class="learning-kit-visual learning-kit-flow" aria-labelledby="kit-flow-title-${moduleId}">
                <div class="learning-kit-visual-heading"><div><span class="learning-kit-overline">Ruta de pensamiento</span><h4 id="kit-flow-title-${moduleId}" class="learning-kit-visual-title">Explora el recorrido del módulo</h4></div><span class="learning-kit-flow-count">1 / ${steps.length}</span></div>
                <div class="learning-kit-flow-steps" role="tablist" aria-label="Pasos del recorrido del módulo">
                    ${steps.map((step, index) => `<button type="button" class="learning-kit-step${index === 0 ? ' is-active' : ''}" role="tab" aria-selected="${index === 0 ? 'true' : 'false'}" data-step="${index}"><span class="learning-kit-step-number">${escapeHtml(step[0])}</span><span>${escapeHtml(step[1])}</span></button>`).join('')}
                </div>
                <div class="learning-kit-flow-rail" aria-hidden="true"><span></span></div>
                <div class="learning-kit-flow-detail" role="status" aria-live="polite" aria-label="${escapeHtml(`${first[1]}. ${first[2]}`)}"><strong>${escapeHtml(first[1])}</strong><p>${escapeHtml(first[2])}</p></div>
            </section>`;
        },

        renderSemanticVisual(kit, moduleId) {
            const preset = visualPresets[kit.visual] || visualPresets.evidence;
            const titleId = `kit-model-title-${moduleId}`;
            const steps = (kit.flow || []).slice(0, 4);
            const node = (label, detail, index) => `<div class="learning-kit-model-node" role="listitem"><span class="learning-kit-model-index">${escapeHtml(index)}</span><strong>${escapeHtml(label)}</strong><p>${escapeHtml(detail)}</p></div>`;
            let body = '';

            if (preset.kind === 'pyramid') {
                const layers = [
                    ['03', 'Recorrido E2E', '¿La persona logra su objetivo?'],
                    ['02', 'Integración', '¿Los componentes conversan?'],
                    ['01', 'Unidad', '¿La regla funciona aislada?']
                ];
                body = `<div class="learning-kit-model-pyramid" role="list" aria-label="Capas de prueba">${layers.map(([index, label, detail]) => `<div class="learning-kit-model-layer" role="listitem"><span>${index}</span><strong>${label}</strong><small>${detail}</small></div>`).join('')}</div><p class="learning-kit-model-note">La forma ayuda a conversar sobre costo, velocidad y alcance; no impone porcentajes universales.</p>`;
            } else if (preset.kind === 'loop') {
                const loopSteps = steps.slice(0, 3);
                body = `<div class="learning-kit-model-loop" role="list" aria-label="Ciclo TDD">${loopSteps.map(([index, label, detail]) => node(label, detail, index)).join('')}<span class="learning-kit-loop-return" aria-hidden="true">↻ Repite la suite</span></div>`;
            } else if (preset.kind === 'states') {
                body = `<div class="learning-kit-model-states" role="list" aria-label="Estados que la interfaz debe comunicar">${statePreset.map(([label, detail], index) => node(label, detail, `0${index + 1}`)).join('')}</div>`;
            } else if (preset.kind === 'triptych') {
                const items = triptychPresets[kit.visual] || steps.slice(0, 3).map(([index, label, detail]) => [label, detail]);
                body = `<div class="learning-kit-model-triptych" role="list">${items.map(([label, detail], index) => node(label, detail, `0${index + 1}`)).join('')}</div>`;
            } else {
                const items = pathPresets[kit.visual] || steps.map(([index, label, detail]) => [label, detail]);
                body = `<div class="learning-kit-model-track" role="list" aria-label="Relación central del módulo">${items.map(([label, detail], index) => `${node(label, detail, `0${index + 1}`)}${index < items.length - 1 ? '<span class="learning-kit-model-arrow" aria-hidden="true">→</span>' : ''}`).join('')}</div>`;
            }

            return `<figure class="learning-kit-visual learning-kit-model learning-kit-model--${escapeHtml(preset.kind)}" aria-labelledby="${titleId}"><div class="learning-kit-visual-heading"><div><span class="learning-kit-overline">Modelo visual</span><h4 id="${titleId}" class="learning-kit-visual-title">${escapeHtml(preset.title)}</h4></div><span class="learning-kit-chart-unit">${escapeHtml(kit.visualLabel || 'Idea')}</span></div><p class="learning-kit-caption">${escapeHtml(preset.description)}</p>${body}<div class="learning-kit-model-callout"><span>Señal que debes observar</span><strong>${escapeHtml(kit.signal || 'Resultado observable')}</strong></div></figure>`;
        },

        bindFlow(section, kit) {
            const steps = (kit.flow || []).slice(0, 4);
            const detail = section.querySelector('.learning-kit-flow-detail');
            const count = section.querySelector('.learning-kit-flow-count');
            section.querySelectorAll('.learning-kit-step').forEach((button, index) => {
                button.addEventListener('click', () => {
                    const step = steps[index] || steps[0];
                    section.querySelectorAll('.learning-kit-step').forEach((item, itemIndex) => {
                        const active = itemIndex === index;
                        item.classList.toggle('is-active', active); item.setAttribute('aria-selected', String(active));
                    });
                    if (count) count.textContent = `${index + 1} / ${steps.length}`;
                    if (detail && step) { detail.innerHTML = `<strong>${escapeHtml(step[1])}</strong><p>${escapeHtml(step[2])}</p>`; detail.setAttribute('aria-label', `${step[1]}. ${step[2]}`); }
                });
            });
        },

        renderFocusChart(kit, moduleId) {
            const titleId = `kit-chart-title-${moduleId}`;
            const bars = (kit.metrics || []).map(([label, value], index) => {
                const size = Math.max(0, Math.min(100, Number(value) || 0));
                return `<div class="learning-kit-bar-row"><span class="learning-kit-bar-index">0${index + 1}</span><span class="learning-kit-bar-label">${escapeHtml(label)}</span><span class="learning-kit-bar-track"><span class="learning-kit-bar" style="--bar-size:${size}%"></span></span><span class="learning-kit-bar-value tabular-nums">${size}</span></div>`;
            }).join('');
            return `<figure class="learning-kit-visual learning-kit-chart"><div class="learning-kit-visual-heading"><div><span class="learning-kit-overline">Gráfico de énfasis</span><figcaption id="${titleId}" class="learning-kit-visual-title">Dónde poner la atención</figcaption></div><span class="learning-kit-chart-unit">0–100</span></div><p class="learning-kit-caption">Prioridad didáctica sugerida; no es una medición de cobertura.</p><div class="learning-kit-bars" role="img" aria-labelledby="${titleId}">${bars}</div><div class="learning-kit-chart-footer"><span><i class="learning-kit-chart-dot"></i>Más atención</span><span>Menos atención <i class="learning-kit-chart-dot is-muted"></i></span></div></figure>`;
        },

        renderDecisionTable(kit) {
            const table = make('div', 'learning-kit-table table-responsive');
            table.innerHTML = '<div class="learning-kit-visual-heading"><div><span class="learning-kit-overline">Tabla de lectura</span><h4 class="learning-kit-visual-title">Señal, interpretación y acción</h4></div><span class="learning-kit-table-count">3 señales</span></div><table class="table learning-kit-decision-table"><thead><tr><th scope="col">Señal</th><th scope="col">Qué significa</th><th scope="col">Qué haces</th></tr></thead><tbody></tbody></table>';
            const body = table.querySelector('tbody');
            (kit.table || []).forEach((row) => {
                const tr = make('tr');
                row.forEach((cell, index) => {
                    const td = make(index === 0 ? 'th' : 'td', index === 0 ? 'learning-kit-row-signal' : null, cell);
                    if (index === 0) td.setAttribute('scope', 'row');
                    tr.appendChild(td);
                });
                body.appendChild(tr);
            });
            return table;
        },

        renderDecisionSimulator(moduleId, kit) {
            const section = make('section', 'learning-kit-simulator');
            section.setAttribute('aria-labelledby', `kit-sim-title-${moduleId}`);
            const scenario = kit.scenario || ['', [], 0, ''];
            section.innerHTML = `<div class="learning-kit-simulator-heading"><span class="learning-kit-simulator-kicker">Decisión guiada · +15 XP</span><h4 id="kit-sim-title-${moduleId}">Ahora decide como tester</h4><p>${escapeHtml(scenario[0])}</p></div><div class="learning-kit-choices" role="group" aria-label="Opciones de decisión">${(scenario[1] || []).map((choice, index) => `<button type="button" class="learning-kit-choice" data-option="${index}"><span class="learning-kit-choice-letter">${String.fromCharCode(65 + index)}</span>${escapeHtml(choice)}</button>`).join('')}</div><div class="learning-kit-feedback" role="status" aria-live="polite">Elige una respuesta para ver el razonamiento.</div><button type="button" class="btn btn-secondary learning-kit-reset">Intentar de nuevo</button>`;
            const feedback = section.querySelector('.learning-kit-feedback');
            const choices = [...section.querySelectorAll('.learning-kit-choice')];
            const reset = section.querySelector('.learning-kit-reset');
            const showFeedback = (selected) => {
                const correct = selected === Number(scenario[2]);
                section.classList.toggle('is-correct', correct); section.classList.toggle('is-incorrect', !correct);
                feedback.textContent = correct ? `Decisión acertada. ${scenario[3]}` : `Todavía no. ${scenario[3]}`;
                choices.forEach((button, index) => { button.disabled = true; button.classList.toggle('is-answer', index === Number(scenario[2])); button.classList.toggle('is-selected', index === selected); });
                if (global.TestingSession) global.TestingSession.recordSimulator('sim-module-decisions', correct ? 1 : 0, 1, `${moduleId}: ${correct ? 'decisión acertada' : 'decisión por revisar'}.`);
                if (correct && global.GAMIFICATION) global.GAMIFICATION.addXP(15, `Decisión QA: ${moduleId}`);
            };
            choices.forEach((button) => button.addEventListener('click', () => showFeedback(Number(button.dataset.option))));
            reset.addEventListener('click', () => { section.classList.remove('is-correct', 'is-incorrect'); feedback.textContent = 'Elige una respuesta para ver el razonamiento.'; choices.forEach((button) => { button.disabled = false; button.classList.remove('is-answer', 'is-selected'); }); });
            return section;
        },

        renderSpecialLab(moduleId, kit) {
            const special = kit.special;
            if (!special) return make('div', 'learning-kit-empty', 'Este módulo no tiene un laboratorio adicional.');
            const section = make('section', `learning-kit-special learning-kit-special--${safeClass(special.variant || special.type)}`);
            const symbol = symbols[kit.visual] || '✦';
            if (special.type === 'matrix') {
                section.innerHTML = `<div class="learning-kit-special-heading"><span class="learning-kit-special-symbol" aria-hidden="true">${symbol}</span><div><span class="learning-kit-overline">${escapeHtml(special.label)}</span><h4>${escapeHtml(special.title)}</h4><p>${escapeHtml(special.prompt)}</p></div></div><div class="learning-kit-matrix-grid"><label>Impacto<select data-risk="impact" title="Selecciona el impacto del riesgo"><option value="1">Bajo</option><option value="2">Medio</option><option value="3">Alto</option></select></label><label>Probabilidad<select data-risk="likelihood" title="Selecciona la probabilidad del riesgo"><option value="1">Baja</option><option value="2">Media</option><option value="3">Alta</option></select></label><div class="learning-kit-matrix-result" role="status" aria-live="polite"><strong>Prioridad baja</strong><span>Selecciona los valores para leer la señal.</span></div></div>`;
                const update = () => {
                    const score = Number(section.querySelector('[data-risk="impact"]').value) * Number(section.querySelector('[data-risk="likelihood"]').value);
                    const label = score >= 7 ? 'Prioridad crítica' : score >= 4 ? 'Prioridad alta' : 'Prioridad baja';
                    const result = section.querySelector('.learning-kit-matrix-result');
                    result.innerHTML = `<strong>${label}</strong><span>${score >= 4 ? 'Define una barrera y deja registro antes de continuar.' : 'Mantén vigilancia y acuerda qué señal observar.'}</span>`;
                    if (score >= 7) { section.classList.add('is-complete'); awardSuccess(section, moduleId, special.success); }
                };
                section.querySelectorAll('select').forEach((select) => select.addEventListener('change', update));
                return section;
            }
            section.innerHTML = `<div class="learning-kit-special-heading"><span class="learning-kit-special-symbol" aria-hidden="true">${symbol}</span><div><span class="learning-kit-overline">${escapeHtml(special.label)}</span><h4>${escapeHtml(special.title)}</h4><p>${escapeHtml(special.prompt)}</p></div></div><div class="learning-kit-special-options" role="group" aria-label="Opciones del laboratorio"></div><div class="learning-kit-special-feedback" role="status" aria-live="polite">La señal aparecerá aquí cuando tomes una decisión.</div>`;
            const options = section.querySelector('.learning-kit-special-options');
            if (special.type === 'sequence') {
                const sequence = special.sequence || [];
                let current = 0;
                options.innerHTML = sequence.map((item, index) => `<button type="button" class="learning-kit-special-option" data-special-option="${index}"><span>${index + 1}</span>${escapeHtml(item)}</button>`).join('');
                const feedback = section.querySelector('.learning-kit-special-feedback');
                options.querySelectorAll('[data-special-option]').forEach((button) => button.addEventListener('click', () => {
                    const selected = Number(button.dataset.specialOption);
                    if (selected !== current) { feedback.textContent = `Aún no. Busca el paso ${current + 1} de la secuencia.`; section.classList.add('has-error'); setTimeout(() => section.classList.remove('has-error'), 350); return; }
                    button.disabled = true; button.classList.add('is-picked'); current += 1;
                    if (current === sequence.length) { feedback.textContent = special.success; section.classList.add('is-complete'); awardSuccess(section, moduleId, special.success); } else feedback.textContent = `Bien. Ahora busca el paso ${current + 1}.`;
                }));
            } else {
                options.innerHTML = (special.options || []).map((option, index) => `<button type="button" class="learning-kit-special-option" data-special-option="${index}"><span>${String.fromCharCode(65 + index)}</span>${escapeHtml(option)}</button>`).join('');
                const feedback = section.querySelector('.learning-kit-special-feedback');
                options.querySelectorAll('[data-special-option]').forEach((button) => button.addEventListener('click', () => {
                    const selected = Number(button.dataset.specialOption); const correct = selected === Number(special.answer);
                    section.classList.toggle('is-complete', correct); section.classList.toggle('has-error', !correct);
                    feedback.textContent = correct ? special.success : 'Todavía no. Revisa la señal que el caso necesita y vuelve a intentarlo.';
                    options.querySelectorAll('[data-special-option]').forEach((item, index) => { item.disabled = true; item.classList.toggle('is-answer', index === Number(special.answer)); item.classList.toggle('is-selected', index === selected); });
                    if (correct) awardSuccess(section, moduleId, special.success);
                }));
            }
            return section;
        },

        renderModule(moduleId) {
            const target = document.getElementById(moduleId);
            const kit = getKit(moduleId);
            if (!target || target.querySelector('[data-learning-kit]')) return;
            const host = target.querySelector('.section-card') || target;
            const section = make('section', 'learning-kit');
            section.dataset.learningKit = 'true'; section.dataset.visual = kit.visual || 'signals';
            section.setAttribute('aria-labelledby', `learning-kit-title-${moduleId}`);
            const icon = symbols[kit.visual] || '✦';
            const phase = phases.find((item) => item[3].includes(moduleId));
            const phaseLabel = phase ? `${phase[0]} · ${phase[1]}` : 'Ruta de aprendizaje';
            section.innerHTML = `<div class="learning-kit-hero"><div class="learning-kit-heading"><div><span class="learning-kit-kicker">${escapeHtml(phaseLabel)} · ${escapeHtml(kit.focus || kit.eyebrow || 'Criterio de calidad')}</span><h3 id="learning-kit-title-${moduleId}">Objetivo: ${escapeHtml(kit.headline || 'Conecta la idea con una evidencia')}</h3><p class="learning-kit-intro">Al terminar, podrás responder la pregunta con una señal observable y explicar qué evidencia conservas.</p></div><div class="learning-kit-mark" aria-hidden="true"><span>${icon}</span><small>${escapeHtml(kit.visualLabel || 'Señal')}</small></div></div><div class="learning-kit-goal-strip"><div><span>Pregunta de trabajo</span><strong>${escapeHtml(kit.question || '¿Qué puedes observar?')}</strong></div><div><span>Entrega de este módulo</span><strong>${escapeHtml(kit.evidence || 'Nota de aprendizaje')}</strong></div></div></div><div class="learning-kit-grid"></div>`;
            const grid = section.querySelector('.learning-kit-grid');
            grid.insertAdjacentHTML('beforeend', this.renderFlowDiagram(kit, moduleId));
            grid.insertAdjacentHTML('beforeend', this.renderSemanticVisual(kit, moduleId));
            grid.appendChild(this.renderSpecialLab(moduleId, kit));
            this.bindFlow(grid.querySelector('.learning-kit-flow'), kit);
            const moduleIntro = host.querySelector('.module-intro');
            if (moduleIntro) moduleIntro.insertAdjacentElement('afterend', section);
            else host.appendChild(section);
        },

        renderGuideMap() {
            const welcome = document.getElementById('welcome');
            const anchor = document.getElementById('inicio-ruta');
            if (!welcome || !anchor || welcome.querySelector('[data-guide-map]')) return;
            const section = make('section', 'guide-map section-card glass-panel');
            section.dataset.guideMap = 'true'; section.setAttribute('aria-labelledby', 'guide-map-title');
            section.innerHTML = `<div class="guide-map-heading"><span class="learning-kit-kicker">Mapa de la ruta · 16 módulos</span><h2 id="guide-map-title">De la pregunta al juicio de calidad</h2><p>Recorre las cuatro estaciones. Cada etapa agrega una forma distinta de pensar, practicar y demostrar.</p></div><div class="guide-map-phases"></div><div class="guide-map-legend" aria-label="Leyenda de la ruta"><span><i class="guide-map-dot"></i>Concepto</span><span><i class="guide-map-dot is-practice"></i>Práctica</span><span><i class="guide-map-dot is-transfer"></i>Transferencia</span></div>`;
            const phasesHost = section.querySelector('.guide-map-phases');
            phases.forEach(([number, title, detail, ids]) => {
                const phase = make('article', 'guide-map-phase');
                phase.innerHTML = `<div class="guide-map-phase-head"><span class="guide-map-number">${number}</span><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(detail)}</p></div></div><div class="guide-map-modules"></div>`;
                const modulesHost = phase.querySelector('.guide-map-modules');
                ids.forEach((id) => {
                    const link = make('a', 'guide-map-module', (global.MODULES && global.MODULES[id] && global.MODULES[id].title) || id);
                    link.href = `#${id}`; link.addEventListener('click', (event) => { event.preventDefault(); if (global.APP) global.APP.navigateTo(id); });
                    modulesHost.appendChild(link);
                });
                phasesHost.appendChild(phase);
            });
            anchor.parentNode.insertBefore(section, anchor);
        },

        init() { moduleOrder.forEach((moduleId) => this.renderModule(moduleId)); this.renderGuideMap(); }
    };

    global.ModuleLearningKit = ModuleLearningKit;
    document.addEventListener('DOMContentLoaded', () => ModuleLearningKit.init());
})(window);
