/** Panel local para practicar el ciclo comprender–encargar–verificar–decidir. */
(function (global) {
    'use strict';

    const STORAGE_KEY = 'guia_testing_ai_practice_v1';
    const escapeHtml = (value) => String(value ?? '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

    const readProgress = () => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
        catch (error) { return {}; }
    };

    const saveProgress = (moduleId, checks) => {
        try {
            const progress = readProgress();
            progress[moduleId] = { checks, reviewedAt: new Date().toISOString() };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
            return true;
        } catch (error) {
            return false;
        }
    };

    const copyText = async (text) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return;
        }
        const helper = document.createElement('textarea');
        helper.value = text; helper.setAttribute('readonly', '');
        helper.style.position = 'fixed'; helper.style.opacity = '0';
        document.body.appendChild(helper); helper.select();
        document.execCommand('copy'); helper.remove();
    };

    const renderPanel = (moduleId, practice) => {
        const panel = document.createElement('section');
        panel.className = 'ai-guided-practice';
        panel.dataset.aiGuidedPractice = moduleId;
        panel.setAttribute('aria-labelledby', `ai-practice-title-${moduleId}`);
        panel.innerHTML = `
            <div class="ai-guided-heading">
                <div><span class="ai-guided-kicker">IA opcional · criterio humano obligatorio</span>
                    <h3 id="ai-practice-title-${moduleId}">Practica este módulo con ayuda de IA</h3>
                    <p>${escapeHtml(practice.goal)}</p>
                </div><span class="ai-guided-badge" aria-hidden="true">H+IA</span>
            </div>
            <ol class="ai-guided-cycle" aria-label="Ciclo de trabajo humano–IA">
                <li><span>1</span><strong>Comprender</strong><small>Formula la regla</small></li>
                <li><span>2</span><strong>Encargar</strong><small>Pide un borrador</small></li>
                <li><span>3</span><strong>Cuestionar</strong><small>Busca supuestos</small></li>
                <li><span>4</span><strong>Comprobar</strong><small>Ejecuta o contrasta</small></li>
                <li><span>5</span><strong>Decidir</strong><small>Acepta, corrige o rechaza</small></li>
            </ol>
            <div class="ai-guided-grid">
                <article class="ai-guided-prompt-card">
                    <div class="ai-guided-card-heading"><div><span>Instrucción lista para adaptar</span><h4>Trabaja un riesgo a la vez</h4></div>
                        <button type="button" class="btn btn-secondary ai-copy-prompt">Copiar instrucción</button></div>
                    <pre class="ai-guided-prompt" data-dbc="omitir"><code>${escapeHtml(practice.prompt)}</code></pre>
                    <p class="ai-guided-privacy"><strong>No pegues secretos ni datos personales.</strong> Sustitúyelos por marcadores como &lt;TU_TOKEN_AQUÍ&gt;. Este panel no envía tu texto a ningún servicio.</p>
                </article>
                <article class="ai-guided-review-card">
                    <span class="ai-guided-warning">Propuesta de la IA ≠ evidencia</span>
                    <dl class="ai-guided-review-list">
                        <div><dt>Qué debes comprobar</dt><dd>${escapeHtml(practice.verify)}</dd></div>
                        <div><dt>Qué no demuestra todavía</dt><dd>${escapeHtml(practice.cannotProve)}</dd></div>
                        <div><dt>Decisión humana</dt><dd>${escapeHtml(practice.humanDecision)}</dd></div>
                        <div><dt>Si algo sale mal</dt><dd>${escapeHtml(practice.recovery)}</dd></div>
                    </dl>
                </article>
            </div>
            <div class="ai-guided-checkpoint">
                <div><span class="ai-guided-kicker">Control antes de avanzar</span><h4>Demuestra que tú dirigiste el trabajo</h4>
                    <p>Puedes hacer esta práctica sin IA: responde las mismas preguntas y construye el borrador manualmente.</p></div>
                <div class="ai-guided-checks">
                    <label><input type="checkbox" value="existence"> Confirmé que archivos, funciones y reglas existen.</label>
                    <label><input type="checkbox" value="execution"> Ejecuté o contrasté la propuesta con evidencia observable.</label>
                    <label><input type="checkbox" value="decision"> Puedo explicar qué acepté, corregí o rechacé y por qué.</label>
                </div>
                <button type="button" class="btn btn-primary ai-confirm-review" disabled>Registrar revisión humana</button>
                <p class="ai-guided-status" role="status" aria-live="polite">Completa las tres comprobaciones.</p>
            </div>`;

        const copyButton = panel.querySelector('.ai-copy-prompt');
        const status = panel.querySelector('.ai-guided-status');
        const confirmButton = panel.querySelector('.ai-confirm-review');
        const checkboxes = [...panel.querySelectorAll('.ai-guided-checks input')];
        const stored = readProgress()[moduleId];
        if (stored && Array.isArray(stored.checks)) {
            checkboxes.forEach((box) => { box.checked = stored.checks.includes(box.value); });
        }
        const refresh = () => {
            const complete = checkboxes.every((box) => box.checked);
            confirmButton.disabled = !complete;
            status.textContent = complete ? 'Listo para registrar tu decisión.' : 'Completa las tres comprobaciones.';
        };
        checkboxes.forEach((box) => box.addEventListener('change', refresh));
        copyButton.addEventListener('click', async () => {
            try {
                await copyText(practice.prompt); copyButton.textContent = 'Instrucción copiada';
                status.textContent = 'Adáptala con contexto real y sin información sensible.';
            } catch (error) {
                status.textContent = 'No se pudo copiar automáticamente. Selecciona el texto de la instrucción.';
            }
        });
        confirmButton.addEventListener('click', () => {
            const checks = checkboxes.filter((box) => box.checked).map((box) => box.value);
            const persisted = saveProgress(moduleId, checks); panel.classList.add('is-reviewed');
            status.textContent = persisted
                ? 'Revisión humana registrada en este navegador. Conserva la evidencia en tu bitácora.'
                : 'Revisión completada. El navegador no permitió guardarla; consérvala en tu bitácora.';
            if (global.TestingSession) {
                global.TestingSession.recordSimulator('sim-ai-guided-practice', 1, 1, `${moduleId}: verificación y decisión humana registradas.`);
            }
        });
        refresh();
        return panel;
    };

    const init = () => {
        Object.entries(global.AI_GUIDED_PRACTICES || {}).forEach(([moduleId, practice]) => {
            const section = document.getElementById(moduleId);
            const host = section && (section.querySelector('.section-card') || section);
            if (!host || host.querySelector('[data-ai-guided-practice]')) return;
            const panel = renderPanel(moduleId, practice);
            const footer = host.querySelector('.module-footer');
            if (footer) host.insertBefore(panel, footer); else host.appendChild(panel);
        });
    };

    global.AIGuidedPractice = { init, renderPanel };
    document.addEventListener('DOMContentLoaded', init);
})(window);
