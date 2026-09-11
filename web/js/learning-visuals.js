/**
 * Recursos visuales y simuladores de aprendizaje.
 *
 * Estos componentes no ejecutan pruebas reales ni se conectan a un proyecto:
 * convierten conceptos abstractos en modelos manipulables para que el aprendiz
 * pueda formar una imagen mental antes de usar Playwright u otra herramienta.
 */
(function (global) {
    'use strict';

    const escapeHtml = (value) => String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    const create = (tag, className, text) => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    };

    const LearningVisuals = {
        bloqueDefinicion(block) {
            const section = create('section', 'learning-definition');
            if (block.title) section.appendChild(create('h4', 'learning-block-title', block.title));
            if (block.intro) section.appendChild(create('p', 'learning-block-intro', block.intro));

            const grid = create('div', 'definition-pieces');
            (block.pieces || []).forEach((piece) => {
                const card = create('article', 'definition-piece');
                const heading = create('div', 'definition-piece-heading');
                heading.appendChild(create('span', 'definition-letter', piece.letter || '•'));
                const headingText = create('div');
                headingText.appendChild(create('h5', 'definition-term', piece.term));
                if (piece.translation) headingText.appendChild(create('span', 'definition-translation', piece.translation));
                heading.appendChild(headingText);
                card.appendChild(heading);
                if (piece.meaning) {
                    card.appendChild(create('span', 'definition-label', 'En palabras sencillas'));
                    card.appendChild(create('p', 'definition-text', piece.meaning));
                }
                if (piece.analogy) {
                    card.appendChild(create('span', 'definition-label analogy-label', 'Analogía'));
                    card.appendChild(create('p', 'definition-text', piece.analogy));
                }
                if (piece.example) {
                    card.appendChild(create('span', 'definition-label example-label', 'En una prueba'));
                    card.appendChild(create('p', 'definition-text', piece.example));
                }
                grid.appendChild(card);
            });
            section.appendChild(grid);
            return section;
        },

        bloqueMapaMental(block) {
            const figure = create('figure', 'mental-map-figure');
            if (block.title) figure.appendChild(create('figcaption', 'learning-block-title', block.title));
            if (block.body) figure.appendChild(create('p', 'learning-block-intro', block.body));

            const nodes = (block.nodes || []).slice(0, 4);
            const center = block.center || 'Resultado observable';
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 1000 360');
            svg.setAttribute('role', 'img');
            svg.setAttribute('aria-label', block.accessibleText || 'Mapa mental del recorrido de una prueba E2E');
            const positions = [
                { x: 80, y: 42, lineX: 280, lineY: 96 },
                { x: 640, y: 42, lineX: 720, lineY: 96 },
                { x: 80, y: 244, lineX: 280, lineY: 264 },
                { x: 640, y: 244, lineX: 720, lineY: 264 }
            ];
            const lineMarkup = nodes.map((_, index) => {
                const position = positions[index];
                return `<path class="mental-map-link" d="M ${position.lineX} ${position.lineY} L 500 180" />`;
            }).join('');
            const nodeMarkup = nodes.map((node, index) => {
                const position = positions[index];
                const title = escapeHtml(node.title || 'Paso');
                const detail = escapeHtml(node.detail || '');
                return `<g class="mental-map-node">
                    <rect x="${position.x}" y="${position.y}" width="280" height="74" rx="14"></rect>
                    <text x="${position.x + 18}" y="${position.y + 27}" class="mental-map-node-title">${title}</text>
                    <text x="${position.x + 18}" y="${position.y + 51}" class="mental-map-node-detail">${detail}</text>
                </g>`;
            }).join('');
            svg.innerHTML = `${lineMarkup}
                <g class="mental-map-center">
                    <circle cx="500" cy="180" r="82"></circle>
                    <text x="500" y="174" text-anchor="middle">${escapeHtml(center)}</text>
                    <text x="500" y="198" text-anchor="middle" class="mental-map-center-subtitle">E2E</text>
                </g>${nodeMarkup}`;
            figure.appendChild(svg);

            const mobileList = create('div', 'mental-map-mobile');
            mobileList.appendChild(create('strong', 'mental-map-mobile-center', center));
            nodes.forEach((node) => {
                const item = create('article', 'mental-map-mobile-item');
                item.appendChild(create('h5', null, node.title));
                item.appendChild(create('p', null, node.detail));
                mobileList.appendChild(item);
            });
            figure.appendChild(mobileList);
            return figure;
        },

        bloqueGlosario(block) {
            const section = create('section', 'learning-glossary');
            if (block.title) section.appendChild(create('h4', 'learning-block-title', block.title));
            if (block.intro) section.appendChild(create('p', 'learning-block-intro', block.intro));

            const label = create('label', 'glossary-search-label', 'Busca una palabra o idea');
            const input = create('input', 'glossary-search');
            input.type = 'search';
            input.placeholder = 'Ejemplo: locator, DOM, flaky...';
            input.setAttribute('aria-label', 'Busca una palabra o idea del glosario');
            label.appendChild(input);
            section.appendChild(label);

            const count = create('p', 'glossary-count');
            count.setAttribute('aria-live', 'polite');
            section.appendChild(count);
            const list = create('div', 'glossary-list');
            section.appendChild(list);

            const draw = () => {
                const query = input.value.trim().toLowerCase();
                const entries = (block.entries || []).filter((entry) => {
                    const searchable = [entry.term, entry.alias, entry.meaning, entry.analogy, entry.example].join(' ').toLowerCase();
                    return !query || searchable.includes(query);
                });
                count.textContent = `${entries.length} concepto${entries.length === 1 ? '' : 's'} visible${entries.length === 1 ? '' : 's'}`;
                list.replaceChildren();
                if (!entries.length) {
                    list.appendChild(create('p', 'glossary-empty', 'No encontré esa palabra. Prueba con “aserción”, “navegador” o “espera”.'));
                    return;
                }
                entries.forEach((entry, index) => {
                    const details = create('details', 'glossary-entry');
                    if (index === 0 && !query) details.open = true;
                    const summary = create('summary');
                    summary.appendChild(create('strong', null, entry.term));
                    if (entry.alias) summary.appendChild(create('span', 'glossary-alias', entry.alias));
                    details.appendChild(summary);
                    const body = create('div', 'glossary-entry-body');
                    body.appendChild(create('p', null, entry.meaning));
                    body.appendChild(create('p', 'glossary-analogy', `Analogía: ${entry.analogy}`));
                    if (entry.example) body.appendChild(create('p', 'glossary-example', `Ejemplo: ${entry.example}`));
                    details.appendChild(body);
                    list.appendChild(details);
                });
            };
            input.addEventListener('input', draw);
            draw();
            return section;
        },

        renderE2EJourney(container) {
            if (!container || container.dataset.rendered === 'true') return;
            container.dataset.rendered = 'true';
            const stages = [
                { icon: '👤', title: 'Persona', detail: 'Decide qué quiere lograr.' },
                { icon: '🌐', title: 'Navegador', detail: 'Abre la aplicación como Chromium.' },
                { icon: '🎯', title: 'Localizador', detail: 'Encuentra el control correcto.' },
                { icon: '🖱️', title: 'Acción', detail: 'Escribe, hace clic o navega.' },
                { icon: '🔌', title: 'Sistema', detail: 'Procesa la petición y responde.' },
                { icon: '✅', title: 'Aserción', detail: 'Comprueba un resultado visible.' }
            ];
            let execution = 0;
            container.className = 'sim-e2e-container';
            container.innerHTML = `
                <div class="e2e-simulator">
                    <div class="e2e-simulator-heading">
                        <span class="sim-icon">🧭</span>
                        <div>
                            <h3>Simulador: recorre una prueba E2E</h3>
                            <p>No abre un navegador real: representa el recorrido para que puedas ver dónde aparece cada concepto.</p>
                        </div>
                    </div>
                    <div class="e2e-controls">
                        <label>Escenario
                            <select class="sim-select" id="e2e-scenario">
                                <option value="happy">Crear un producto válido</option>
                                <option value="invalid">Rechazar un precio inválido</option>
                                <option value="design-change">Cambió la maquetación de la pantalla</option>
                            </select>
                        </label>
                        <label>Localizador para el campo Precio
                            <select class="sim-select" id="e2e-selector">
                                <option value="robust">getByLabel("Precio") — intención del usuario</option>
                                <option value="fragile">div &gt; form &gt; input:nth-child(2) — posición</option>
                            </select>
                        </label>
                    </div>
                    <div class="e2e-actions">
                        <button type="button" class="btn btn-primary" id="e2e-run">▶ Ejecutar recorrido</button>
                        <span class="e2e-hint">Pregunta: ¿el test verifica el resultado o solo hace clic?</span>
                    </div>
                    <ol class="e2e-stages" aria-label="Etapas del recorrido E2E"></ol>
                    <div class="e2e-result" role="status" aria-live="polite">Elige un escenario y ejecuta el recorrido.</div>
                    <p class="e2e-simulator-note"><strong>Lectura:</strong> un E2E pasa cuando la persona logra el objetivo y la aserción comprueba una señal observable. Si falla, clasifica la etapa antes de cambiar código.</p>
                </div>
            `;
            const scenarioSelect = container.querySelector('#e2e-scenario');
            const selectorSelect = container.querySelector('#e2e-selector');
            const runButton = container.querySelector('#e2e-run');
            const stageList = container.querySelector('.e2e-stages');
            const result = container.querySelector('.e2e-result');

            const renderStages = (statuses) => {
                stageList.replaceChildren();
                stages.forEach((stage, index) => {
                    const item = create('li', `e2e-stage e2e-stage-${statuses[index]}`);
                    item.dataset.stage = String(index);
                    item.appendChild(create('span', 'e2e-stage-icon', stage.icon));
                    const text = create('span', 'e2e-stage-copy');
                    text.appendChild(create('strong', null, stage.title));
                    text.appendChild(create('small', null, stage.detail));
                    item.appendChild(text);
                    item.appendChild(create('span', 'e2e-stage-state', statuses[index] === 'pending' ? 'Pendiente' : statuses[index] === 'active' ? 'En curso' : statuses[index] === 'pass' ? 'Listo' : 'Falla'));
                    stageList.appendChild(item);
                });
            };

            const completeRun = (passed, scenario, selector) => {
                runButton.disabled = false;
                result.className = `e2e-result ${passed ? 'is-success' : 'is-failure'}`;
                if (passed) {
                    const message = scenario === 'invalid'
                        ? 'Pasa: la aplicación rechazó el precio y mostró el error esperado. Un rechazo correcto también es un resultado exitoso.'
                        : 'Pasa: el recorrido llegó al objetivo y la aserción encontró una señal visible.';
                    result.textContent = message;
                    if (global.GAMIFICATION) global.GAMIFICATION.addXP(25, 'Simulador E2E completado');
                } else {
                    result.textContent = selector === 'fragile'
                        ? 'Falla en el localizador: el selector dependía de la posición del elemento. Prefiere getByRole o getByLabel.'
                        : 'Falla: revisa la etapa marcada y formula una aserción observable antes de modificar el código.';
                }
                if (global.TestingSession) {
                    global.TestingSession.recordSimulator('sim-e2e', passed ? 1 : 0, 1, result.textContent);
                }
                if (typeof window !== 'undefined' && window.SIMULATORS && typeof window.SIMULATORS.updateCompletionCounter === 'function') {
                    window.SIMULATORS.updateCompletionCounter();
                }
            };

            runButton.addEventListener('click', () => {
                execution += 1;
                const currentExecution = execution;
                const scenario = scenarioSelect.value;
                const selector = selectorSelect.value;
                const statuses = stages.map(() => 'pending');
                const failAt = scenario === 'design-change' && selector === 'fragile' ? 2 : -1;
                runButton.disabled = true;
                result.className = 'e2e-result is-running';
                result.textContent = 'Ejecutando paso a paso…';
                renderStages(statuses);

                stages.forEach((_, index) => {
                    window.setTimeout(() => {
                        if (currentExecution !== execution) return;
                        if (failAt >= 0 && index > failAt) return;
                        statuses[index] = index === failAt ? 'fail' : 'pass';
                        renderStages(statuses);
                        if (index === failAt) {
                            completeRun(false, scenario, selector);
                        } else if (index === stages.length - 1) {
                            completeRun(true, scenario, selector);
                        }
                    }, index * 260);
                });
            });
            renderStages(stages.map(() => 'pending'));
        },

        init() {
            document.querySelectorAll('.sim-e2e-container').forEach((container) => this.renderE2EJourney(container));
        }
    };

    global.LearningVisuals = LearningVisuals;
    document.addEventListener('DOMContentLoaded', () => LearningVisuals.init());
})(window);
