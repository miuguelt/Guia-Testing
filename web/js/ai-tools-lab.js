/**
 * Laboratorio de herramientas de IA para calidad de software.
 *
 * Las fichas no presentan un ranking: enseñan a elegir por capa, lenguaje,
 * privacidad y nivel de autonomía. Los enlaces apuntan a la documentación
 * oficial para comprobar disponibilidad, planes y requisitos antes de usarla.
 */
const AIToolsLab = (() => {
    const TOOLS = [
        { id: 'copilot', name: 'GitHub Copilot', icon: '◉', category: 'Asistente de código', fit: 'Buen punto de entrada para aprender a pedir, revisar y ejecutar pruebas en el IDE.', use: 'Usa /tests sobre un archivo o selección; exige que explique cada caso y ejecuta la suite.', practice: 'Pídele 3 casos para una función de validación y rechaza cualquier prueba sin una aserción significativa.', limit: 'Puede proponer imports, contratos o asserts que no existen. Tú revisas y decides.', prompt: 'Analiza este archivo y propón primero una matriz de casos. Después genera únicamente las pruebas que pueda ejecutar mi proyecto.', url: 'https://docs.github.com/en/copilot/how-tos/chat-with-copilot/get-started-with-chat-in-your-ide?tool=vscode' },
        { id: 'cursor', name: 'Cursor', icon: '⌁', category: 'Agente en el IDE', fit: 'Útil para explorar un repositorio y trabajar por etapas con distintos niveles de autonomía.', use: 'Empieza en modo de consulta para entender el proyecto; luego pide crear pruebas, ejecutarlas y mostrar el cambio.', practice: 'Compara el plan de solo lectura con el cambio propuesto. Acepta solo el diff que puedas explicar.', limit: 'La autonomía acelera el trabajo, pero puede tocar muchos archivos: usa ramas, diffs y una orden de ejecución controlada.', prompt: 'Primero inspecciona el repositorio sin modificarlo. Devuelve el plan de pruebas y espera mi aprobación antes de editar.', url: 'https://docs.cursor.com/en/get-started/quickstart' },
        { id: 'claude-code', name: 'Claude Code', icon: '◌', category: 'Asistente de código', fit: 'Agente de terminal para explicar un proyecto, trabajar con archivos y automatizar ciclos de verificación.', use: 'Comienza con una consulta de solo lectura; limita las herramientas permitidas y pide que ejecute la suite con resultados visibles.', practice: 'Pídele que encuentre la orden de pruebas del proyecto y que proponga un plan sin editar archivos.', limit: 'Su acceso al terminal exige límites claros: revisa permisos, comandos, diff y datos enviados antes de aceptar cambios.', prompt: 'Explica este proyecto sin editarlo. Identifica el ejecutor de pruebas, riesgos y un plan de verificación por etapas.', url: 'https://docs.anthropic.com/en/docs/claude-code/getting-started' },
        { id: 'gemini', name: 'Gemini Code Assist', icon: '✦', category: 'Asistente de código', fit: 'Alternativa para VS Code y JetBrains con ayuda contextual, generación de pruebas y depuración.', use: 'Selecciona una función y usa la acción de generar pruebas; pide que cite archivos y comandos reales.', practice: 'Haz que proponga pruebas unitarias para una función y luego pídele que encuentre un caso borde que falte.', limit: 'La disponibilidad, las ediciones y las integraciones cambian; valida siempre la salida y la política de datos de tu institución.', prompt: 'Genera pruebas unitarias para este código, pero antes enumera supuestos, dependencias y casos no cubiertos.', url: 'https://docs.cloud.google.com/gemini/docs/codeassist/overview?hl=en' },
        { id: 'amazon-q', name: 'Amazon Q Developer', icon: '↗', category: 'Asistente y revisión', fit: 'Conviene si el proyecto usa AWS o si quieres combinar generación de unitarias con revisión de código.', use: 'Solicita revisión del archivo, proyecto o cambios recientes; pide que clasifique severidad y sugiera pruebas.', practice: 'Entrega un diff pequeño y verifica si identifica riesgo, prueba faltante y comando de comprobación.', limit: 'Sus mejores ventajas aparecen en ecosistemas AWS; no sustituyen una suite local ni una revisión humana.', prompt: 'Revisa este cambio como QA. Señala defectos, requisitos sin prueba y genera un caso de regresión por cada hallazgo confirmado.', url: 'https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/start-review.html' },
        { id: 'qodo', name: 'Qodo', icon: '◇', category: 'Revisión y pruebas', fit: 'Adecuado para revisar solicitudes de cambio con contexto del repositorio, reglas y brechas de pruebas.', use: 'Úsalo después de que el aprendiz tenga una suite básica: compara el cambio con requisitos y reglas del equipo.', practice: 'Pide revisión de un cambio generado por IA y clasifica cada comentario como defecto, riesgo o ruido.', limit: 'La revisión automática es una señal adicional; el equipo debe confirmar el contrato y ejecutar las pruebas.', prompt: 'Revisa este cambio con foco en defectos, reglas del proyecto y cobertura de requisitos. Prioriza hallazgos accionables y explica la evidencia.', url: 'https://docs.qodo.ai/code-review' },
        { id: 'diffblue', name: 'Diffblue Cover', icon: '▣', category: 'Pruebas Java/Kotlin', fit: 'Especialista para generar pruebas unitarias de regresión en proyectos Java o Kotlin.', use: 'Úsalo cuando el proyecto compile, la suite existente esté en verde y haya muchas clases Java que cubrir.', practice: 'Selecciona una clase de servicio y compara la prueba generada con el comportamiento de negocio que realmente esperas.', limit: 'No es la mejor opción para Python, React o contratos nuevos sin especificar; puede capturar el comportamiento actual, incluso si está equivocado.', prompt: 'Genera pruebas de regresión para esta clase Java. Separa comportamiento observado de reglas de negocio y marca lo que debo revisar.', url: 'https://cover-docs.diffblue.com/get-started/what-is-diffblue-cover' },
        { id: 'mabl', name: 'mabl', icon: '▤', category: 'Navegador y API', fit: 'Opción para planear y autorizar pruebas de navegador o API con ayuda conversacional, incluso en entornos locales.', use: 'Describe el viaje del usuario, confirma el plan y ejecuta primero contra un ambiente de prueba sin datos reales.', practice: 'Crea el plan para iniciar sesión y registrar un producto; añade aserciones visibles y un escenario de error.', limit: 'Revisa costos, privacidad, dependencia del servicio y límites de migración antes de llevarlo a un proyecto formativo.', prompt: 'Planea una prueba de navegador para este requisito. Muestra primero pasos, datos, aserciones y riesgos; no la autorices sin mi confirmación.', url: 'https://docs.mabl.com/docs/mabl-cli/author-mabl-tests-from-your-ai-coding-agent.html' }
    ];
    const SCENARIOS = [
        { question: 'Tienes una función Java para la que necesitas muchas pruebas unitarias de regresión.', answer: 'diffblue', reason: 'Diffblue Cover está especializado en pruebas unitarias Java/Kotlin; aun así debes validar el comportamiento de negocio.' },
        { question: 'Quieres aprender a escribir pruebas para un archivo abierto en tu IDE y ejecutarlas localmente.', answer: 'copilot', reason: 'GitHub Copilot es un buen inicio: la orden /tests propone un borrador y el aprendiz lo verifica en su propio ejecutor.' },
        { question: 'Debes revisar un cambio generado por IA contra reglas del repositorio y requisitos del cambio.', answer: 'qodo', reason: 'Qodo se orienta a la revisión de cambios con contexto y reglas; complementa la revisión humana.' },
        { question: 'Quieres construir un flujo de navegador o API describiendo el recorrido en lenguaje natural.', answer: 'mabl', reason: 'mabl ofrece planificación y autoría conversacional para pruebas de navegador y API; confirma privacidad y costos.' }
    ];

    function createMountPoint() {
        const mount = document.createElement('div');
        mount.className = 'ai-tools-lab-mount';
        mount.dataset.toolsLabMount = 'true';
        mountLab(mount);
        return mount;
    }

    function mountLab(root) {
        if (!root || root.dataset.mounted === 'true') return;
        root.dataset.mounted = 'true';
        root.innerHTML = `
            <section class="tool-lab" aria-labelledby="tool-lab-title">
                <div class="tool-lab-intro"><span class="gema-eyebrow">Laboratorio de elección</span><h3 id="tool-lab-title">Herramientas IA para construir software de calidad</h3><p>No elijas por moda. Elige por el problema, la capa de pruebas, el lenguaje, la privacidad y el nivel de autonomía que puedas revisar.</p></div>
                <div class="tool-lab-filters" role="group" aria-label="Filtrar herramientas"><button type="button" class="tool-filter is-active" data-tool-filter="all">Todas</button><button type="button" class="tool-filter" data-tool-filter="assistants">Asistentes</button><button type="button" class="tool-filter" data-tool-filter="review">Revisión</button><button type="button" class="tool-filter" data-tool-filter="Pruebas Java/Kotlin">Especializada</button><button type="button" class="tool-filter" data-tool-filter="Navegador y API">Navegador/API</button></div>
                <div id="tool-lab-cards" class="tool-lab-grid"></div>
                <div class="tool-lab-practice">
                    <div><span class="gema-eyebrow">Reto de elección</span><h4>¿Qué herramienta encaja mejor?</h4><p>Justifica la elección por el problema y la capa, no por la marca.</p></div>
                    <label class="gema-field"><span>Situación</span><select class="sim-select" id="tool-scenario" title="Selecciona una situación de práctica"></select></label>
                    <label class="gema-field"><span>Tu elección</span><select class="sim-select" id="tool-answer" title="Selecciona una herramienta"><option value="">Selecciona una herramienta</option></select></label>
                    <button type="button" class="btn btn-primary" id="tool-check-answer">Comprobar elección</button>
                    <div id="tool-feedback" class="tool-feedback" role="status" aria-live="polite"></div>
                </div>
                <div class="tool-compare">
                    <div><span class="gema-eyebrow">Compara antes de decidir</span><h4>Dos caminos para la misma necesidad</h4></div>
                    <div class="tool-compare-selects"><label class="gema-field"><span>Opción A</span><select class="sim-select" id="tool-compare-a" title="Primera herramienta"></select></label><span class="tool-vs">vs.</span><label class="gema-field"><span>Opción B</span><select class="sim-select" id="tool-compare-b" title="Segunda herramienta"></select></label></div>
                    <div id="tool-compare-result" class="tool-compare-result"></div>
                </div>
                <p class="tool-lab-note">Práctica segura: usa repositorios de aprendizaje, datos ficticios y una rama de trabajo. Nunca pegues credenciales, datos personales ni secretos en un asistente.</p>
            </section>`;
        renderCards(root, 'all');
        populateSelects(root);
        root.querySelectorAll('[data-tool-filter]').forEach((button) => button.addEventListener('click', () => {
            root.querySelectorAll('[data-tool-filter]').forEach((item) => item.classList.remove('is-active'));
            button.classList.add('is-active');
            renderCards(root, button.dataset.toolFilter);
        }));
        root.querySelector('#tool-check-answer').addEventListener('click', () => checkScenario(root));
        root.querySelector('#tool-compare-a').addEventListener('change', () => renderComparison(root));
        root.querySelector('#tool-compare-b').addEventListener('change', () => renderComparison(root));
        renderComparison(root);
    }

    function renderCards(root, filter) {
        const grid = root.querySelector('#tool-lab-cards');
        grid.replaceChildren();
        TOOLS.filter((tool) => matchesFilter(tool, filter)).forEach((tool) => {
            const card = document.createElement('article');
            card.className = 'tool-lab-card';
            const icon = document.createElement('span'); icon.className = 'tool-card-icon'; icon.textContent = tool.icon;
            const title = document.createElement('h4'); title.textContent = tool.name;
            const tag = document.createElement('span'); tag.className = 'tool-card-tag'; tag.textContent = tool.category;
            const fit = document.createElement('p'); fit.className = 'tool-lab-fit'; fit.textContent = tool.fit;
            const use = document.createElement('p'); use.innerHTML = '<strong>Cómo manejarla:</strong> ' + tool.use;
            const limit = document.createElement('p'); limit.innerHTML = '<strong>Verifica:</strong> ' + tool.limit;
            const practice = document.createElement('p'); practice.innerHTML = '<strong>Ejercicio:</strong> ' + tool.practice;
            const actions = document.createElement('div'); actions.className = 'tool-lab-card-actions';
            const promptButton = document.createElement('button'); promptButton.type = 'button'; promptButton.className = 'btn btn-secondary btn-sm'; promptButton.textContent = 'Copiar encargo de práctica'; promptButton.addEventListener('click', () => copyToolPrompt(tool, root));
            const link = document.createElement('a'); link.className = 'tool-doc-link'; link.href = tool.url; link.target = '_blank'; link.rel = 'noopener'; link.textContent = 'Documentación oficial ↗';
            actions.append(promptButton, link);
            card.append(icon, title, tag, fit, use, practice, limit, actions);
            grid.appendChild(card);
        });
    }

    function matchesFilter(tool, filter) {
        if (filter === 'all' || tool.category === filter) return true;
        if (filter === 'assistants') return ['Asistente de código', 'Agente en el IDE', 'Agente en terminal'].includes(tool.category);
        if (filter === 'review') return ['Revisión y pruebas', 'Asistente y revisión'].includes(tool.category);
        return false;
    }

    function populateSelects(root) {
        const scenarioSelect = root.querySelector('#tool-scenario');
        SCENARIOS.forEach((scenario, index) => { const option = document.createElement('option'); option.value = String(index); option.textContent = scenario.question; scenarioSelect.appendChild(option); });
        ['tool-answer', 'tool-compare-a', 'tool-compare-b'].forEach((id) => {
            const select = root.querySelector('#' + id);
            TOOLS.forEach((tool) => { const option = document.createElement('option'); option.value = tool.id; option.textContent = tool.name; select.appendChild(option); });
        });
        root.querySelector('#tool-compare-a').value = 'copilot';
        root.querySelector('#tool-compare-b').value = 'cursor';
    }

    function checkScenario(root) {
        const scenario = SCENARIOS[Number(root.querySelector('#tool-scenario').value)];
        const answer = root.querySelector('#tool-answer').value;
        const feedback = root.querySelector('#tool-feedback');
        feedback.className = 'tool-feedback ' + (answer === scenario.answer ? 'is-correct' : 'is-wrong');
        feedback.textContent = answer === scenario.answer ? '✓ Correcto. ' + scenario.reason : 'Todavía no. ' + scenario.reason;
    }

    function renderComparison(root) {
        const first = TOOLS.find((tool) => tool.id === root.querySelector('#tool-compare-a').value) || TOOLS[0];
        const second = TOOLS.find((tool) => tool.id === root.querySelector('#tool-compare-b').value) || TOOLS[1];
        const result = root.querySelector('#tool-compare-result');
        result.replaceChildren();
        [['Para qué encaja', first.fit, second.fit], ['Cómo practicar', first.practice, second.practice], ['Riesgo a controlar', first.limit, second.limit]].forEach(([label, left, right]) => {
            const row = document.createElement('div'); row.className = 'tool-compare-row';
            const heading = document.createElement('strong'); heading.textContent = label;
            const leftCell = document.createElement('span'); leftCell.textContent = left;
            const rightCell = document.createElement('span'); rightCell.textContent = right;
            row.append(heading, leftCell, rightCell); result.appendChild(row);
        });
        const headers = document.createElement('div'); headers.className = 'tool-compare-headers'; headers.innerHTML = '<span></span><strong></strong><strong></strong>';
        headers.children[1].textContent = first.name; headers.children[2].textContent = second.name;
        result.prepend(headers);
    }

    async function copyToolPrompt(tool, root) {
        try {
            await navigator.clipboard.writeText(tool.prompt);
            root.querySelector('#tool-feedback').className = 'tool-feedback is-correct';
            root.querySelector('#tool-feedback').textContent = 'Encargo copiado. Pégalo en la herramienta y revisa su respuesta.';
        } catch (error) {
            root.querySelector('#tool-feedback').className = 'tool-feedback is-wrong';
            root.querySelector('#tool-feedback').textContent = 'No se pudo copiar automáticamente; usa el texto de la ficha como guía.';
        }
    }

    return { createMountPoint, mount: mountLab, tools: TOOLS };
})();

window.AIToolsLab = AIToolsLab;
