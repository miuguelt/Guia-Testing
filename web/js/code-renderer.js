/**
 * Renderizador de módulos de la Guía Testing.
 *
 * El HTML declara una sección vacía por módulo —`<section id="m-tdd">` con un
 * `.section-card` dentro— y todo el contenido vive en `window.MODULES`, que
 * componen `modules-content.js` y `modules-content-2.js`.
 *
 * Este archivo era antes una copia literal del renderizador de la guía FastAPI:
 * conservaba su cabecera, leía una variable `MODULES_CONTENT` que en esta guía
 * nunca existió y buscaba contenedores `#code-<modulo>` que el HTML tampoco
 * tiene. El resultado era que las trece secciones de módulo quedaban en blanco.
 * El fallo estaba oculto detrás de un error de sintaxis anterior en
 * `modules-content.js`, que abortaba la carga antes de llegar hasta aquí.
 *
     * Tipos de bloque soportados: code · alert · comparison · diagram ·
     * tools · timeline · steps · ai-coach · tool-lab.
 */

const CodeRenderer = {

    /** Mapa de variantes de aviso a las clases que ya define css/styles.css. */
    VARIANTES: { info: 'info', warning: 'warning', success: 'success', note: 'info', important: 'warning' },

    decodificar(texto) {
        if (typeof texto !== 'string' || !texto.includes('&')) return texto;
        const temp = document.createElement('textarea');
        temp.innerHTML = texto;
        return temp.value;
    },

    crear(tag, clase, texto) {
        const el = document.createElement(tag);
        if (clase) el.className = clase;
        if (texto !== undefined) el.textContent = this.decodificar(texto);
        return el;
    },

    /**
     * Bloque de código.
     *
     * Lo construye el módulo compartido `DevBrainCode`: resalta la sintaxis sin
     * conexión, numera las líneas y marca dónde empieza y termina cada función.
     * El respaldo solo actúa si el módulo no cargó: sin resaltado, pero con el
     * código legible y con la sangría intacta.
     */
    bloqueCodigo(bloque) {
        const envoltura = this.crear('div', 'code-block-wrapper');
        if (bloque.title) envoltura.appendChild(this.crear('p', 'block-caption', bloque.title));

        if (window.DevBrainCode) {
            envoltura.appendChild(DevBrainCode.bloque({
                texto: bloque.code,
                titulo: bloque.file,
                lenguaje: bloque.lang
            }));
            return envoltura;
        }

        const pre = this.crear('pre', 'code-block');
        const code = this.crear('code', 'language-' + (bloque.lang || 'text'), bloque.code || '');
        pre.appendChild(code);
        envoltura.appendChild(pre);
        return envoltura;
    },

    /** Aviso con título y cuerpo. El borde de color no es el único canal: hay título. */
    bloqueAviso(bloque) {
        const variante = this.VARIANTES[bloque.variant] || 'info';
        const caja = this.crear('div', 'alert-box ' + variante);
        if (bloque.title) caja.appendChild(this.crear('h4', null, bloque.title));
        if (bloque.body) caja.appendChild(this.crear('p', null, bloque.body));
        return caja;
    },

    /** Tabla comparativa, con desplazamiento horizontal propio si no cabe. */
    bloqueComparativa(bloque) {
        const seccion = this.crear('div', 'comparison-wrapper');
        if (bloque.title) seccion.appendChild(this.crear('h4', null, bloque.title));

        const envoltura = this.crear('div', 'table-scroll');
        const tabla = this.crear('table', 'comparison-table');

        const thead = document.createElement('thead');
        const filaCabecera = document.createElement('tr');
        (bloque.headers || []).forEach((h) => filaCabecera.appendChild(this.crear('th', null, h)));
        thead.appendChild(filaCabecera);
        tabla.appendChild(thead);

        const tbody = document.createElement('tbody');
        (bloque.rows || []).forEach((fila) => {
            const tr = document.createElement('tr');
            fila.forEach((celda) => tr.appendChild(this.crear('td', null, celda)));
            tbody.appendChild(tr);
        });
        tabla.appendChild(tbody);

        envoltura.appendChild(tabla);
        seccion.appendChild(envoltura);
        return seccion;
    },

    /** Diagrama accesible: soporta máquina de estados, pirámide visual, pipeline, mapa de calor y cadena causal. */
    bloqueDiagrama(bloque) {
        const figura = this.crear('figure', 'diagram-card');
        figura.dataset.diagrama = bloque.diagramType || '';
        if (bloque.title) figura.appendChild(this.crear('figcaption', 'diagram-title', bloque.title));

        if (bloque.diagramType === 'state-machine' && Array.isArray(bloque.states)) {
            const estados = this.crear('ol', 'state-machine-flow');
            const principal = bloque.states.filter((estado) => estado.name !== 'Reabierto');
            principal.forEach((estado, index) => {
                const nodo = this.crear('li', 'state-machine-state');
                nodo.appendChild(this.crear('strong', 'state-machine-name', estado.name));
                if (estado.desc) nodo.appendChild(this.crear('span', 'state-machine-description', estado.desc));
                estados.appendChild(nodo);
                if (index < principal.length - 1) {
                    const flecha = this.crear('span', 'state-machine-arrow', '→');
                    flecha.setAttribute('aria-hidden', 'true');
                    estados.appendChild(flecha);
                }
            });
            figura.appendChild(estados);

            const reabierto = bloque.states.find((estado) => estado.name === 'Reabierto');
            if (reabierto) {
                const rama = this.crear('div', 'state-machine-branch');
                rama.appendChild(this.crear('strong', 'state-machine-name', '↩ Retest → Reabierto → Abierto'));
                if (reabierto.desc) rama.appendChild(this.crear('span', 'state-machine-description', reabierto.desc));
                figura.appendChild(rama);
            }
        } else if (bloque.diagramType === 'pyramid') {
            figura.appendChild(this.renderPiramideVisual(bloque));
        } else if (bloque.diagramType === 'pipeline') {
            figura.appendChild(this.renderPipelineVisual(bloque));
        } else if (bloque.diagramType === 'risk-matrix') {
            figura.appendChild(this.renderMatrizRiesgoVisual(bloque));
        } else if (bloque.diagramType === 'causal-chain') {
            figura.appendChild(this.renderCadenaCausalVisual(bloque));
        } else if (bloque.diagramType === 'architecture') {
            figura.appendChild(this.renderArquitecturaVisual(bloque));
        } else if (bloque.diagramType === 'state-machine') {
            figura.appendChild(this.renderStateMachineVisual(bloque));
        }

        if (bloque.body) figura.appendChild(this.crear('p', 'diagram-body', bloque.body));
        return figura;
    },

    /** Renderizado de pirámide visual */
    renderPiramideVisual(bloque) {
        const wrapper = this.crear('div', 'pyramid-container');
        const niveles = bloque.tiers || [
            { id: 'e2e', name: 'Pruebas End-to-End (E2E)', pct: '10%', speed: 'Lenta (~minutos)', cost: 'Alto costo', tools: 'Playwright, Cypress', desc: 'Recorridos de usuario reales en navegador, validando integración completa y DOM visible.' },
            { id: 'integration', name: 'Pruebas de Integración / Contrato', pct: '20%', speed: 'Media (~segundos)', cost: 'Costo moderado', tools: 'TestClient, Flask Client, MockMvc', desc: 'Interacción entre servicios, APIs, repositorios y persistencia efímera.' },
            { id: 'unit', name: 'Pruebas Unitarias de Lógica Pura', pct: '70%', speed: 'Muy rápida (~ms)', cost: 'Bajo costo', tools: 'PyTest, Vitest, JUnit 5', desc: 'Reglas de negocio, cálculos, validaciones frontera y funciones aisladas.' }
        ];
        niveles.forEach((lvl) => {
            const row = this.crear('div', `pyramid-tier tier-${lvl.id}`);
            const header = this.crear('div', 'pyramid-tier-header');
            header.appendChild(this.crear('span', 'pyramid-tier-badge', lvl.pct));
            header.appendChild(this.crear('strong', 'pyramid-tier-title', lvl.name));
            header.appendChild(this.crear('span', 'pyramid-tier-tools', lvl.tools));
            row.appendChild(header);

            const details = this.crear('div', 'pyramid-tier-details');
            details.appendChild(this.crear('span', 'pyramid-tier-metric', `⚡ ${lvl.speed}`));
            details.appendChild(this.crear('span', 'pyramid-tier-metric', `💰 ${lvl.cost}`));
            details.appendChild(this.crear('p', 'pyramid-tier-desc', lvl.desc));
            row.appendChild(details);
            wrapper.appendChild(row);
        });
        return wrapper;
    },

    /** Renderizado de pipeline CI/CD visual */
    renderPipelineVisual(bloque) {
        const wrapper = this.crear('div', 'pipeline-flow-container');
        const stages = bloque.stages || [
            { icon: '🚀', name: '1. Disparador', desc: 'Push o PR en develop/main' },
            { icon: '🛡️', name: '2. Linters & Seguridad', desc: 'Flake8, ESLint, Gitleaks' },
            { icon: '🧪', name: '3. Tests en Paralelo', desc: 'PyTest, Vitest, JUnit 5' },
            { icon: '🚦', name: '4. Quality Gate', desc: 'Cobertura ≥ 80% y 0 fallos' },
            { icon: '📦', name: '5. Despliegue & Smoke', desc: 'Docker + Smoke Test HTTP 200' }
        ];
        const flow = this.crear('ol', 'pipeline-steps-flow');
        stages.forEach((stg, i) => {
            const item = this.crear('li', 'pipeline-step-node');
            item.appendChild(this.crear('span', 'pipeline-step-icon', stg.icon));
            const body = this.crear('div', 'pipeline-step-info');
            body.appendChild(this.crear('strong', 'pipeline-step-name', stg.name));
            body.appendChild(this.crear('span', 'pipeline-step-desc', stg.desc));
            item.appendChild(body);
            flow.appendChild(item);
            if (i < stages.length - 1) {
                const arrow = this.crear('span', 'pipeline-arrow', '➔');
                arrow.setAttribute('aria-hidden', 'true');
                flow.appendChild(arrow);
            }
        });
        wrapper.appendChild(flow);
        return wrapper;
    },

    /** Renderizado de matriz de riesgos 2D (mapa de calor) */
    renderMatrizRiesgoVisual(bloque) {
        const wrapper = this.crear('div', 'risk-matrix-container');
        const grid = this.crear('div', 'risk-heatmap-grid');

        const headerRow = this.crear('div', 'risk-heatmap-header-row');
        headerRow.appendChild(this.crear('div', 'risk-corner-cell', 'Impacto ↓ / Prob →'));
        ['1 Raro', '2 Improb.', '3 Posible', '4 Probable', '5 Casi seguro'].forEach(p => {
            headerRow.appendChild(this.crear('div', 'risk-col-label', p));
        });
        grid.appendChild(headerRow);

        const rowsData = [
            { impact: 5, label: '5 Crítico', zones: ['med', 'med', 'high', 'high', 'high'] },
            { impact: 4, label: '4 Grave', zones: ['low', 'med', 'med', 'high', 'high'] },
            { impact: 3, label: '3 Moderado', zones: ['low', 'low', 'med', 'med', 'high'] },
            { impact: 2, label: '2 Menor', zones: ['low', 'low', 'low', 'med', 'med'] },
            { impact: 1, label: '1 Trivial', zones: ['low', 'low', 'low', 'low', 'low'] }
        ];

        const defaultRisks = bloque.risks || [
            { p: 4, i: 4, tag: 'R-01: Cantidad > 5' },
            { p: 3, i: 5, tag: 'R-02: Sin permiso' },
            { p: 2, i: 5, tag: 'R-03: Doble reserva' },
            { p: 1, i: 1, tag: 'R-04: Typo visual' }
        ];

        rowsData.forEach(r => {
            const rowEl = this.crear('div', 'risk-heatmap-row');
            rowEl.appendChild(this.crear('div', 'risk-row-label', r.label));
            r.zones.forEach((zone, pIdx) => {
                const prob = pIdx + 1;
                const cell = this.crear('div', `risk-cell risk-zone-${zone}`);
                cell.setAttribute('title', `Probabilidad ${prob} × Impacto ${r.impact}: Zona ${zone.toUpperCase()}`);

                const matching = defaultRisks.filter(rk => rk.p === prob && rk.i === r.impact);
                matching.forEach(rk => {
                    const badge = this.crear('span', 'risk-marker-badge', rk.tag);
                    cell.appendChild(badge);
                });
                rowEl.appendChild(cell);
            });
            grid.appendChild(rowEl);
        });
        wrapper.appendChild(grid);

        const legend = this.crear('div', 'risk-matrix-legend');
        legend.innerHTML = `
            <span class="legend-item"><span class="legend-color zone-high"></span> <strong>Zona Alta / Crítica:</strong> Bloquea entrega; caso prioritario obligatorio</span>
            <span class="legend-item"><span class="legend-color zone-med"></span> <strong>Zona Media:</strong> Mitigar en la iteración o cubrir con casos frontera</span>
            <span class="legend-item"><span class="legend-color zone-low"></span> <strong>Zona Baja:</strong> Caso representativo; riesgo residual aceptado</span>
        `;
        wrapper.appendChild(legend);
        return wrapper;
    },

    /** Renderizado de cadena causal de calidad */
    renderCadenaCausalVisual(bloque) {
        const wrapper = this.crear('div', 'causal-chain-container');
        const links = bloque.links || [
            { icon: '👤', stage: 'Error Humano', desc: 'Equivocación de diseño o interpretación', example: 'Desarrollador interpreta que el límite es <= 6.' },
            { icon: '⚙️', stage: 'Defecto (Bug)', desc: 'Imperfección física en código o configuración', example: 'Escribe if cantidad <= 6 en la validación.' },
            { icon: '💥', stage: 'Fallo Observable', desc: 'Comportamiento incorrecto en ejecución', example: 'La app aprueba el préstamo de 6 laptops.' },
            { icon: '🚨', stage: 'Incidente / Daño', desc: 'Impacto real en negocio o usuarios', example: 'Faltan equipos para la clase presencial programada.' }
        ];
        const chain = this.crear('div', 'causal-chain-flow');
        links.forEach((link, idx) => {
            const card = this.crear('article', 'causal-link-card');
            const top = this.crear('div', 'causal-link-top');
            top.appendChild(this.crear('span', 'causal-link-icon', link.icon));
            top.appendChild(this.crear('strong', 'causal-link-stage', link.stage));
            card.appendChild(top);
            card.appendChild(this.crear('span', 'causal-link-desc', link.desc));
            const exBox = this.crear('div', 'causal-link-example');
            exBox.appendChild(this.crear('span', 'causal-link-label', 'Ejemplo en Préstamos:'));
            exBox.appendChild(this.crear('p', 'causal-link-text', link.example));
            card.appendChild(exBox);
            chain.appendChild(card);
            if (idx < links.length - 1) {
                const arrow = this.crear('span', 'causal-arrow', '➔');
                arrow.setAttribute('aria-hidden', 'true');
                chain.appendChild(arrow);
            }
        });
        wrapper.appendChild(chain);
        return wrapper;
    },

    /** Renderizado de diagrama de arquitectura de pruebas */
    renderArquitecturaVisual(bloque) {
        const wrapper = this.crear('div', 'arch-diagram-container');
        const nodes = bloque.nodes || [
            { title: '🧪 Runner de Pruebas', detail: 'PyTest / Vitest / JUnit 5 orquesta ejecución' },
            { title: '🎯 Componente Bajo Prueba (SUT)', detail: 'Servicio / Router / Endpoint / Componente UI' },
            { title: '🧩 Dobles de Prueba (Mocks / Stubs)', detail: 'Aíslan red, servicios externos o cálculo lento' },
            { title: '💾 Base de Datos de Prueba Aislada', detail: 'SQLite en memoria / H2 / Fixture efímera' }
        ];
        const grid = this.crear('div', 'arch-nodes-grid');
        nodes.forEach(n => {
            const card = this.crear('div', 'arch-node-card');
            card.appendChild(this.crear('strong', 'arch-node-title', n.title));
            card.appendChild(this.crear('p', 'arch-node-detail', n.detail));
            grid.appendChild(card);
        });
        wrapper.appendChild(grid);
        return wrapper;
    },

    /** Renderizado de máquina de estados de defectos */
    renderStateMachineVisual(bloque) {
        const wrapper = this.crear('div', 'state-machine-container');
        const states = bloque.states || [];
        const flow = this.crear('div', 'state-machine-flow');
        states.forEach((st, i) => {
            const node = this.crear('div', 'state-machine-node');
            node.appendChild(this.crear('strong', 'state-node-title', st.name));
            node.appendChild(this.crear('span', 'state-node-desc', st.desc));
            flow.appendChild(node);
            if (i < states.length - 1) {
                const arrow = this.crear('span', 'state-arrow', '➔');
                arrow.setAttribute('aria-hidden', 'true');
                flow.appendChild(arrow);
            }
        });
        wrapper.appendChild(flow);
        return wrapper;
    },

    /** Renderizado de Caso Práctico Paso a Paso */
    bloqueCasoPractico(bloque) {
        const card = this.crear('article', 'case-study-card glass-panel');
        const header = this.crear('div', 'case-study-header');
        header.appendChild(this.crear('span', 'case-study-badge', '🧪 CASO PRÁCTICO PASO A PASO'));
        if (bloque.title) header.appendChild(this.crear('h4', 'case-study-title', bloque.title));
        card.appendChild(header);

        if (bloque.context) {
            const ctx = this.crear('div', 'case-study-context');
            ctx.appendChild(this.crear('strong', 'case-study-subheading', '📋 Contexto & Regla de Negocio:'));
            ctx.appendChild(this.crear('p', null, bloque.context));
            card.appendChild(ctx);
        }

        if (bloque.preconditions) {
            const pre = this.crear('div', 'case-study-preconditions');
            pre.appendChild(this.crear('strong', 'case-study-subheading', '⚙️ Precondiciones & Datos de Entrada:'));
            if (Array.isArray(bloque.preconditions)) {
                const ul = this.crear('ul', 'case-study-list');
                bloque.preconditions.forEach(p => ul.appendChild(this.crear('li', null, p)));
                pre.appendChild(ul);
            } else {
                pre.appendChild(this.crear('p', null, bloque.preconditions));
            }
            card.appendChild(pre);
        }

        if (bloque.code) {
            card.appendChild(this.bloqueCodigo({
                file: bloque.codeFile || 'caso_practico_test.py',
                lang: bloque.codeLang || 'python',
                code: bloque.code,
                title: bloque.codeTitle || 'Prueba automatizada ejecutable del caso'
            }));
        }

        if (bloque.command) {
            const cmdBox = this.crear('div', 'step-command-box');
            cmdBox.appendChild(this.crear('span', 'step-command-label', 'Comando de ejecución:'));
            const pre = this.crear('pre', 'step-command-code');
            pre.setAttribute('data-dbc', 'omitir');
            pre.appendChild(this.crear('code', 'language-powershell', bloque.command));
            cmdBox.appendChild(pre);
            card.appendChild(cmdBox);
        }

        if (bloque.oracle) {
            const orc = this.crear('div', 'case-study-oracle alert-box info');
            orc.appendChild(this.crear('strong', null, '🎯 El Oráculo de Prueba: '));
            orc.appendChild(this.crear('span', null, bloque.oracle));
            card.appendChild(orc);
        }

        if (bloque.expectedVsObserved) {
            const comp = this.crear('div', 'case-study-contrast');
            comp.appendChild(this.crear('strong', 'case-study-subheading', '🔍 Comprobación de Resultados:'));
            card.appendChild(comp);
            card.appendChild(this.bloqueComparativa({
                headers: ['Aspecto', 'Resultado Esperado (Oráculo)', 'Fallo Observable si hay Defecto'],
                rows: bloque.expectedVsObserved
            }));
        }

        if (bloque.decision) {
            const dec = this.crear('div', 'case-study-decision alert-box success');
            dec.appendChild(this.crear('strong', null, '💡 Toma de Decisión de Calidad (QA): '));
            dec.appendChild(this.crear('span', null, bloque.decision));
            card.appendChild(dec);
        }

        return card;
    },

    /** Dimensiones reales de las imágenes locales, para reservar espacio (CLS). */
    IMAGE_DIMS: {
        'img/bdd-three-amigos.jpg': [1376, 768],
        'img/double-loop-testing.jpg': [1376, 768],
        'img/tdd-cycle.jpg': [1376, 768],
        'img/test-pyramid-pipeline.jpg': [1376, 768]
    },

    /**
     * Infografía o ilustración conceptual generada para facilitar la comprensión.
     */
    bloqueImagen(bloque) {
        const figura = this.crear('figure', 'concept-image-card');
        if (bloque.title) figura.appendChild(this.crear('figcaption', 'concept-image-title', bloque.title));

        const img = document.createElement('img');
        img.src = bloque.src;
        img.alt = bloque.alt || bloque.title || 'Infografía conceptual de testing';
        img.className = 'concept-image';
        img.loading = 'lazy';
        img.decoding = 'async';
        const dims = this.IMAGE_DIMS[bloque.src];
        if (dims) {
            img.width = dims[0];
            img.height = dims[1];
        }
        figura.appendChild(img);

        if (bloque.caption) {
            figura.appendChild(this.crear('p', 'concept-image-caption', bloque.caption));
        }
        return figura;
    },

    /**
     * Tarjetas de herramientas (tipo `tools`).
     *
     * Cada tarjeta responde a las dos preguntas que el aprendiz se hace al
     * empezar una herramienta nueva: ¿para qué sirve? y ¿cuándo usarla?
     */
    bloqueHerramientas(bloque) {
        const seccion = this.crear('div', 'tool-section');
        if (bloque.title) seccion.appendChild(this.crear('h4', 'tool-section-title', bloque.title));
        const cuadricula = this.crear('div', 'tool-grid');
        (bloque.stack || []).forEach((h) => {
            const tarjeta = this.crear('article', 'tool-card');
            if (h.icon) tarjeta.appendChild(this.crear('span', 'tool-card-icon', h.icon));
            if (h.name) tarjeta.appendChild(this.crear('h5', 'tool-card-name', h.name));
            if (h.tag) tarjeta.appendChild(this.crear('span', 'tool-card-tag', h.tag));
            if (h.role) {
                tarjeta.appendChild(this.crear('span', 'tool-card-label', '¿Para qué sirve?'));
                tarjeta.appendChild(this.crear('p', 'tool-card-text', h.role));
            }
            if (h.when) {
                tarjeta.appendChild(this.crear('span', 'tool-card-label when', '¿En qué contextos se usa?'));
                tarjeta.appendChild(this.crear('p', 'tool-card-text', h.when));
            }
            cuadricula.appendChild(tarjeta);
        });
        seccion.appendChild(cuadricula);
        return seccion;
    },

    /** Línea de tiempo (tipo `timeline`): historia del tema en hitos fechados. */
    bloqueHistoria(bloque) {
        const seccion = this.crear('div', 'timeline-section');
        if (bloque.title) seccion.appendChild(this.crear('h4', 'timeline-title', bloque.title));
        const linea = this.crear('div', 'timeline');
        (bloque.items || []).forEach((h) => {
            const item = this.crear('div', 'timeline-item');
            if (h.year) item.appendChild(this.crear('span', 'timeline-year', h.year));
            const cuerpo = this.crear('div', 'timeline-body');
            if (h.title) cuerpo.appendChild(this.crear('h5', 'timeline-item-title', h.title));
            if (h.desc) cuerpo.appendChild(this.crear('p', 'timeline-item-desc', h.desc));
            item.appendChild(cuerpo);
            linea.appendChild(item);
        });
        seccion.appendChild(linea);
        return seccion;
    },

    /** Paso a paso interactivo (tipo `steps`): secuencia didáctica para alcanzar pruebas automatizadas. */
    bloquePasos(bloque) {
        const seccion = this.crear('div', 'steps-section');
        if (bloque.title) seccion.appendChild(this.crear('h4', 'steps-section-title', bloque.title));
        if (bloque.intro) seccion.appendChild(this.crear('p', 'steps-section-intro', bloque.intro));

        const contenedor = this.crear('div', 'steps-container');
        (bloque.steps || []).forEach((paso, idx) => {
            const tarjeta = this.crear('article', 'step-card');
            const cabecera = this.crear('div', 'step-header');

            const num = this.crear('span', 'step-number', String(paso.number || (idx + 1)));
            cabecera.appendChild(num);

            const info = this.crear('div', 'step-header-info');
            if (paso.title) info.appendChild(this.crear('h5', 'step-title', paso.title));
            if (paso.tag) info.appendChild(this.crear('span', 'step-tag', paso.tag));
            cabecera.appendChild(info);

            tarjeta.appendChild(cabecera);

            if (paso.desc) tarjeta.appendChild(this.crear('p', 'step-desc', paso.desc));

            if (paso.command) {
                const cmdBox = this.crear('div', 'step-command-box');
                const cmdLabel = this.crear('span', 'step-command-label', 'Comando en terminal:');
                const pre = this.crear('pre', 'step-command-code');
                pre.setAttribute('data-dbc', 'omitir');
                const code = this.crear('code', 'language-powershell', paso.command);
                pre.appendChild(code);
                cmdBox.appendChild(cmdLabel);
                cmdBox.appendChild(pre);
                tarjeta.appendChild(cmdBox);
            }

            if (paso.file && paso.code) {
                tarjeta.appendChild(this.bloqueCodigo({
                    file: paso.file,
                    lang: paso.lang || 'text',
                    code: paso.code,
                    title: paso.codeTitle || null
                }));
            }

            if (paso.tip) {
                const tipBox = this.crear('div', 'step-tip');
                tipBox.appendChild(this.crear('strong', null, '💡 Regla de oro: '));
                tipBox.appendChild(this.crear('span', null, paso.tip));
                tarjeta.appendChild(tipBox);
            }

            if (paso.pitfall) {
                const pitBox = this.crear('div', 'step-pitfall');
                pitBox.appendChild(this.crear('strong', null, '⚠️ Error común: '));
                pitBox.appendChild(this.crear('span', null, paso.pitfall));
                tarjeta.appendChild(pitBox);
            }

            contenedor.appendChild(tarjeta);
        });

        seccion.appendChild(contenedor);
        return seccion;
    },

    /** Bloque didáctico que descompone una palabra técnica en piezas pequeñas. */
    bloqueDefinicion(bloque) {
        return window.LearningVisuals
            ? window.LearningVisuals.bloqueDefinicion(bloque)
            : this.crear('p', 'alert-box warning', 'El modelo mental no pudo cargarse.');
    },

    /** Mapa visual accesible para relacionar etapas, herramientas y resultados. */
    bloqueMapaMental(bloque) {
        return window.LearningVisuals
            ? window.LearningVisuals.bloqueMapaMental(bloque)
            : this.crear('p', 'alert-box warning', bloque.body || 'El mapa visual no pudo cargarse.');
    },

    /** Glosario filtrable con definición, analogía y ejemplo de uso. */
    bloqueGlosario(bloque) {
        return window.LearningVisuals
            ? window.LearningVisuals.bloqueGlosario(bloque)
            : this.crear('p', 'alert-box warning', 'El glosario no pudo cargarse.');
    },

    /** Dimensiones reales de las imágenes locales, para reservar espacio (CLS). */
    IMAGE_DIMS: {
        'img/bdd-three-amigos.jpg': [1376, 768],
        'img/double-loop-testing.jpg': [1376, 768],
        'img/tdd-cycle.jpg': [1376, 768],
        'img/test-pyramid-pipeline.jpg': [1376, 768]
    },

    /**
     * Infografía o ilustración conceptual generada para facilitar la comprensión.
     */
    bloqueImagen(bloque) {
        const figura = this.crear('figure', 'concept-image-card');
        if (bloque.title) figura.appendChild(this.crear('figcaption', 'concept-image-title', bloque.title));

        const img = document.createElement('img');
        img.src = bloque.src;
        img.alt = bloque.alt || bloque.title || 'Infografía conceptual de testing';
        img.className = 'concept-image';
        img.loading = 'lazy';
        img.decoding = 'async';
        const dims = this.IMAGE_DIMS[bloque.src];
        if (dims) {
            img.width = dims[0];
            img.height = dims[1];
        }
        figura.appendChild(img);

        if (bloque.caption) {
            figura.appendChild(this.crear('p', 'concept-image-caption', bloque.caption));
        }
        return figura;
    },

    /**
     * Tarjetas de herramientas (tipo `tools`).
     *
     * Cada tarjeta responde a las dos preguntas que el aprendiz se hace al
     * empezar una herramienta nueva: ¿para qué sirve? y ¿cuándo usarla?
     */
    bloqueHerramientas(bloque) {
        const seccion = this.crear('div', 'tool-section');
        if (bloque.title) seccion.appendChild(this.crear('h4', 'tool-section-title', bloque.title));
        const cuadricula = this.crear('div', 'tool-grid');
        (bloque.stack || []).forEach((h) => {
            const tarjeta = this.crear('article', 'tool-card');
            if (h.icon) tarjeta.appendChild(this.crear('span', 'tool-card-icon', h.icon));
            if (h.name) tarjeta.appendChild(this.crear('h5', 'tool-card-name', h.name));
            if (h.tag) tarjeta.appendChild(this.crear('span', 'tool-card-tag', h.tag));
            if (h.role) {
                tarjeta.appendChild(this.crear('span', 'tool-card-label', '¿Para qué sirve?'));
                tarjeta.appendChild(this.crear('p', 'tool-card-text', h.role));
            }
            if (h.when) {
                tarjeta.appendChild(this.crear('span', 'tool-card-label when', '¿En qué contextos se usa?'));
                tarjeta.appendChild(this.crear('p', 'tool-card-text', h.when));
            }
            cuadricula.appendChild(tarjeta);
        });
        seccion.appendChild(cuadricula);
        return seccion;
    },

    /** Línea de tiempo (tipo `timeline`): historia del tema en hitos fechados. */
    bloqueHistoria(bloque) {
        const seccion = this.crear('div', 'timeline-section');
        if (bloque.title) seccion.appendChild(this.crear('h4', 'timeline-title', bloque.title));
        const linea = this.crear('div', 'timeline');
        (bloque.items || []).forEach((h) => {
            const item = this.crear('div', 'timeline-item');
            if (h.year) item.appendChild(this.crear('span', 'timeline-year', h.year));
            const cuerpo = this.crear('div', 'timeline-body');
            if (h.title) cuerpo.appendChild(this.crear('h5', 'timeline-item-title', h.title));
            if (h.desc) cuerpo.appendChild(this.crear('p', 'timeline-item-desc', h.desc));
            item.appendChild(cuerpo);
            linea.appendChild(item);
        });
        seccion.appendChild(linea);
        return seccion;
    },

    /** Paso a paso interactivo (tipo `steps`): secuencia didáctica para alcanzar pruebas automatizadas. */
    bloquePasos(bloque) {
        const seccion = this.crear('div', 'steps-section');
        if (bloque.title) seccion.appendChild(this.crear('h4', 'steps-section-title', bloque.title));
        if (bloque.intro) seccion.appendChild(this.crear('p', 'steps-section-intro', bloque.intro));

        const contenedor = this.crear('div', 'steps-container');
        (bloque.steps || []).forEach((paso, idx) => {
            const tarjeta = this.crear('article', 'step-card');
            const cabecera = this.crear('div', 'step-header');

            const num = this.crear('span', 'step-number', String(paso.number || (idx + 1)));
            cabecera.appendChild(num);

            const info = this.crear('div', 'step-header-info');
            if (paso.title) info.appendChild(this.crear('h5', 'step-title', paso.title));
            if (paso.tag) info.appendChild(this.crear('span', 'step-tag', paso.tag));
            cabecera.appendChild(info);

            tarjeta.appendChild(cabecera);

            if (paso.desc) tarjeta.appendChild(this.crear('p', 'step-desc', paso.desc));

            if (paso.command) {
                const cmdBox = this.crear('div', 'step-command-box');
                const cmdLabel = this.crear('span', 'step-command-label', 'Comando en terminal:');
                const pre = this.crear('pre', 'step-command-code');
                pre.setAttribute('data-dbc', 'omitir');
                const code = this.crear('code', 'language-powershell', paso.command);
                pre.appendChild(code);
                cmdBox.appendChild(cmdLabel);
                cmdBox.appendChild(pre);
                tarjeta.appendChild(cmdBox);
            }

            if (paso.file && paso.code) {
                tarjeta.appendChild(this.bloqueCodigo({
                    file: paso.file,
                    lang: paso.lang || 'text',
                    code: paso.code,
                    title: paso.codeTitle || null
                }));
            }

            if (paso.tip) {
                const tipBox = this.crear('div', 'step-tip');
                tipBox.appendChild(this.crear('strong', null, '💡 Regla de oro: '));
                tipBox.appendChild(this.crear('span', null, paso.tip));
                tarjeta.appendChild(tipBox);
            }

            if (paso.pitfall) {
                const pitBox = this.crear('div', 'step-pitfall');
                pitBox.appendChild(this.crear('strong', null, '⚠️ Error común: '));
                pitBox.appendChild(this.crear('span', null, paso.pitfall));
                tarjeta.appendChild(pitBox);
            }

            contenedor.appendChild(tarjeta);
        });

        seccion.appendChild(contenedor);
        return seccion;
    },

    /** Bloque didáctico que descompone una palabra técnica en piezas pequeñas. */
    bloqueDefinicion(bloque) {
        return window.LearningVisuals
            ? window.LearningVisuals.bloqueDefinicion(bloque)
            : this.crear('p', 'alert-box warning', 'El modelo mental no pudo cargarse.');
    },

    /** Mapa visual accesible para relacionar etapas, herramientas y resultados. */
    bloqueMapaMental(bloque) {
        return window.LearningVisuals
            ? window.LearningVisuals.bloqueMapaMental(bloque)
            : this.crear('p', 'alert-box warning', bloque.body || 'El mapa visual no pudo cargarse.');
    },

    /** Glosario filtrable con definición, analogía y ejemplo de uso. */
    bloqueGlosario(bloque) {
        return window.LearningVisuals
            ? window.LearningVisuals.bloqueGlosario(bloque)
            : this.crear('p', 'alert-box warning', 'El glosario no pudo cargarse.');
    },

    /**
     * Pie del módulo: botón "Marcar como completado" (XP y progreso) y
     * navegación secuencial al siguiente módulo.
     */
    pieModulo(moduleId) {
        const pie = this.crear('div', 'module-footer');
        const boton = this.crear('button', 'btn mark-complete-btn', 'Marcar módulo como completado');
        boton.setAttribute('data-module', moduleId);
        boton.setAttribute('type', 'button');
        if (window.GAMIFICATION && window.GAMIFICATION.completed.includes(moduleId)) {
            boton.textContent = 'Módulo completado ✓';
            boton.classList.add('completed');
            boton.disabled = true;
        } else {
            boton.onclick = () => {
                if (window.GAMIFICATION) {
                    window.GAMIFICATION.markCompleted(moduleId);
                    boton.textContent = 'Módulo completado ✓';
                    boton.classList.add('completed');
                    boton.disabled = true;
                    if (window.APP) window.APP.checkVictory();
                }
            };
        }
        pie.appendChild(boton);

        const siguiente = this.MODULE_ORDER[this.MODULE_ORDER.indexOf(moduleId) + 1];
        if (siguiente && window.MODULES[siguiente]) {
            const btnNext = this.crear('button', 'btn btn-next', 'Siguiente módulo →');
            btnNext.setAttribute('type', 'button');
            btnNext.onclick = () => window.APP && window.APP.navigateTo(siguiente);
            pie.appendChild(btnNext);
        }
        return pie;
    },

    /** Orden didáctico de los módulos, en la secuencia que se enseña. */
    MODULE_ORDER: [
        'm-reflexion', 'm-piramide', 'm-riesgo', 'm-tdd', 'm-bdd',
        'm-pytest-fastapi', 'm-pytest-flask', 'm-jest-react', 'm-junit-jsp',
        'm-playwright', 'm-cobertura', 'm-defectos', 'm-cicd',
        'm-observabilidad', 'm-ia-testing', 'm-gema-testing',
        'm-herramientas-ia', 'm-reto'
    ],

    bloque(bloque) {
        switch (bloque.type) {
            case 'code': return this.bloqueCodigo(bloque);
            case 'alert': return this.bloqueAviso(bloque);
            case 'case-study': return this.bloqueCasoPractico(bloque);
            case 'comparison': return this.bloqueComparativa(bloque);
            case 'diagram': return this.bloqueDiagrama(bloque);
            case 'image': return this.bloqueImagen(bloque);
            case 'tools': return this.bloqueHerramientas(bloque);
            case 'timeline': return this.bloqueHistoria(bloque);
            case 'steps': return this.bloquePasos(bloque);
            case 'definition': return this.bloqueDefinicion(bloque);
            case 'mental-map': return this.bloqueMapaMental(bloque);
            case 'glossary': return this.bloqueGlosario(bloque);
            case 'ai-coach':
                return window.AITestingCoach
                    ? window.AITestingCoach.createMountPoint()
                    : this.crear('p', 'alert-box warning', 'El constructor de Gema QA no pudo cargarse.');
            case 'tool-lab':
                return window.AIToolsLab
                    ? window.AIToolsLab.createMountPoint()
                    : this.crear('p', 'alert-box warning', 'El laboratorio de herramientas IA no pudo cargarse.');
            default: return this.crear('p', null, bloque.body || '');
        }
    },

    /** Pinta un módulo dentro de su sección. Devuelve cuántos bloques colocó. */
    renderModule(moduleId) {
        const datos = (window.MODULES || {})[moduleId];
        if (!datos) return 0;

        const seccion = document.getElementById(moduleId);
        if (!seccion) return 0;

        const destino = seccion.querySelector('.section-card') || seccion;
        if (destino.dataset.pintado === 'si') return 0;
        destino.replaceChildren();
        if (datos.badge) destino.appendChild(this.crear('span', 'module-badge', datos.badge));
        if (datos.title) destino.appendChild(this.crear('h2', 'module-title', datos.title));
        if (datos.intro) destino.appendChild(this.crear('p', 'module-intro', datos.intro));

        const bloques = datos.blocks || datos.codeBlocks || [];

        // Índice colapsable de la estación: anclas a los bloques con título.
        // El componente usa estilos compartidos para no crear CSS dinámico por
        // cada estación y mantener una sola fuente visual.
        const entradasToc = [];
        bloques.forEach((b, i) => {
            const titulo = b.title || b.caption;
            if (titulo) entradasToc.push({ id: moduleId + '-b' + i, titulo });
        });
        if (entradasToc.length >= 3) {
            const toc = document.createElement('details');
            toc.className = 'module-toc';
            toc.setAttribute('aria-label', 'Índice de la estación');
            const sumario = document.createElement('summary');
            sumario.textContent = 'Contenido de la estación';
            toc.appendChild(sumario);
            const lista = document.createElement('ul');
            entradasToc.forEach((e) => {
                const li = document.createElement('li');
                const enlace = document.createElement('a');
                enlace.href = '#' + e.id;
                enlace.textContent = e.titulo;
                li.appendChild(enlace);
                lista.appendChild(li);
            });
            toc.appendChild(lista);
            destino.appendChild(toc);
        }

        bloques.forEach((b, i) => {
            const el = this.bloque(b);
            if (el && el.nodeType === 1 && !el.id) el.id = moduleId + '-b' + i;
            destino.appendChild(el);
        });

        destino.dataset.pintado = 'si';

        // Pie del módulo: marcar como completado + siguiente módulo.
        // Cada render además adopta los bloques de código recién pintados.
        const pie = this.pieModulo(moduleId);
        if (pie.hasChildNodes()) destino.appendChild(pie);
        if (window.DevBrainCode) DevBrainCode.mejorarDocumento(destino);
        return bloques.length;
    },

    /** Pinta todos los módulos declarados. */
    renderAll() {
        const modulos = Object.keys(window.MODULES || {});
        let total = 0;
        modulos.forEach((id) => { total += this.renderModule(id); });

        // Adopta también los `<pre>` que la guía escribe directamente en su HTML.
        if (window.DevBrainCode) DevBrainCode.mejorarDocumento();
        return { modulos: modulos.length, bloques: total };
    }
};

window.CodeRenderer = CodeRenderer;

document.addEventListener('DOMContentLoaded', () => {
    CodeRenderer.renderAll();
});
