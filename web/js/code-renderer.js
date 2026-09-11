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

    /**
     * Diagrama.
     *
     * Los datos traen `diagramType` y una descripción en prosa, no una figura.
     * Se pinta la descripción rotulada en lugar de inventar un dibujo: un
     * diagrama falso confunde más que un texto claro.
     */
    bloqueDiagrama(bloque) {
        const figura = this.crear('figure', 'diagram-card');
        figura.dataset.diagrama = bloque.diagramType || '';
        if (bloque.title) figura.appendChild(this.crear('figcaption', 'diagram-title', bloque.title));
        if (bloque.body) figura.appendChild(this.crear('p', 'diagram-body', bloque.body));
        return figura;
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
        'm-reflexion', 'm-piramide', 'm-tdd', 'm-bdd',
        'm-pytest-fastapi', 'm-pytest-flask', 'm-jest-react', 'm-junit-jsp', 'm-playwright', 'm-cobertura', 'm-cicd',
        'm-observabilidad', 'm-ia-testing', 'm-gema-testing',
        'm-herramientas-ia', 'm-reto'
    ],

    bloque(bloque) {
        switch (bloque.type) {
            case 'code': return this.bloqueCodigo(bloque);
            case 'alert': return this.bloqueAviso(bloque);
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
        bloques.forEach((b) => destino.appendChild(this.bloque(b)));

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
