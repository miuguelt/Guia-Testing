const SIMULATORS = {
    init() {
        document.addEventListener("DOMContentLoaded", () => {
            setTimeout(() => {
                this.renderPyramidBuilder();
                this.renderAssertionValidator();
                this.renderQuiz();
                this.renderPhaseSequencer();
            }, 200);
        });
    },

    renderPyramidBuilder() {
        const container = document.querySelector(".sim-pyramid-container");
        if (!container) return;
        container.innerHTML = `
            <p style="color:var(--text-muted);margin-bottom:1rem;">Arrastra los tipos de test al nivel correcto de la piramide:</p>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem;" id="pyramid-items">
                <div class="draggable" draggable="true" data-type="unit" data-correct="bottom" style="padding:0.5rem 1rem;background:var(--glass-bg);border-radius:8px;cursor:grab;">Unit Test</div>
                <div class="draggable" draggable="true" data-type="integration" data-correct="middle" style="padding:0.5rem 1rem;background:var(--glass-bg);border-radius:8px;cursor:grab;">Integration</div>
                <div class="draggable" draggable="true" data-type="e2e" data-correct="top" style="padding:0.5rem 1rem;background:var(--glass-bg);border-radius:8px;cursor:grab;">E2E</div>
            </div>
            <div id="pyramid" style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;">
                <div data-level="top" style="width:120px;height:50px;background:rgba(244,63,94,0.2);border:2px dashed rgba(244,63,94,0.5);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:0.8rem;color:var(--text-muted);">E2E (10%)</div>
                <div data-level="middle" style="width:240px;height:50px;background:rgba(245,158,11,0.2);border:2px dashed rgba(245,158,11,0.5);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:0.8rem;color:var(--text-muted);">Integration (20%)</div>
                <div data-level="bottom" style="width:360px;height:50px;background:rgba(16,185,129,0.2);border:2px dashed rgba(16,185,129,0.5);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:0.8rem;color:var(--text-muted);">Unit (70%)</div>
            </div>
            <div id="pyramid-result" style="margin-top:1rem;"></div>
        `;
        const draggables = container.querySelectorAll(".draggable");
        const slots = container.querySelectorAll("[data-level]");
        const solvedSlots = new Set();
        draggables.forEach(d => {
            d.addEventListener("dragstart", e => e.dataTransfer.setData("type", d.dataset.type));
        });
        slots.forEach(slot => {
            slot.addEventListener("dragover", e => e.preventDefault());
            slot.addEventListener("drop", e => {
                e.preventDefault();
                const type = e.dataTransfer.getData("type");
                const dragged = container.querySelector(`[data-type="${type}"]`);
                if (!dragged) return;
                const correct = dragged.dataset.correct === slot.dataset.level;
                if (correct) {
                    slot.style.background = "rgba(16,185,129,0.4)";
                    slot.textContent = `${dragged.textContent} Correcto!`;
                    solvedSlots.add(slot.dataset.level);
                    if (window.GAMIFICATION) GAMIFICATION.addXP(50, "Pyramid Builder correcto");
                    if (solvedSlots.size === 3) {
                        const resultEl = container.querySelector("#pyramid-result");
                        if (resultEl) {
                            resultEl.innerHTML = '<div style="color:#10b981;font-weight:600;padding:0.5rem;background:rgba(16,185,129,0.15);border-radius:6px;">🎉 ¡Pirámide balanceada! 70% Unit, 20% Integration, 10% E2E.</div>';
                        }
                        if (window.TestingSession) {
                            window.TestingSession.recordSimulator('sim-pyramid', 50, 50, 'Pirámide de Cohn balanceada: Unit (70%), Integration (20%), E2E (10%)');
                        }
                    }
                } else {
                    slot.style.background = "rgba(244,63,94,0.4)";
                    slot.textContent = "Incorrecto - intenta de nuevo";
                    setTimeout(() => { slot.style.background = ""; slot.textContent = slot.dataset.level === "top" ? "E2E (10%)" : slot.dataset.level === "middle" ? "Integration (20%)" : "Unit (70%)"; }, 1500);
                }
            });
        });
    },

    renderAssertionValidator() {
        const container = document.querySelector(".sim-assertion-container");
        if (!container) return;
        const tests = [
            { code: "assert 2 + 2 == 4", passes: true },
            { code: 'assert "hola" in "hola mundo"', passes: true },
            { code: "assert 10 > 20", passes: false },
            { code: "assert [1,2,3].length == 3", passes: false, lang: "js" },
            { code: "assert len([1,2,3]) == 3", passes: true },
            { code: "assert None is not False", passes: true },
            { code: "assert 0 == False", passes: true },
            { code: "assert [] == False", passes: false },
        ];
        let score = 0;
        let current = 0;
        container.innerHTML = `
            <p style="color:var(--text-muted);margin-bottom:1rem;">Adivina si el assertion PASA o FALLA:</p>
            <div id="assert-code" style="font-family:'JetBrains Mono',monospace;background:rgba(0,0,0,0.3);padding:1rem;border-radius:8px;margin-bottom:1rem;font-size:0.95rem;"></div>
            <div style="display:flex;gap:0.5rem;">
                <button type="button" class="btn btn-primary" id="assert-pass">&#10004; Pasa</button>
                <button type="button" class="btn btn-secondary" id="assert-fail">&#10006; Falla</button>
            </div>
            <div id="assert-feedback" style="margin-top:1rem;"></div>
            <div style="margin-top:1rem;color:var(--text-muted);">Aciertos: <span id="assert-score">0</span>/${tests.length}</div>
        `;
        const codeEl = container.querySelector("#assert-code");
        const feedbackEl = container.querySelector("#assert-feedback");
        const scoreEl = container.querySelector("#assert-score");
        const showTest = () => {
            if (current >= tests.length) {
                feedbackEl.innerHTML = `<div style="color:#10b981;">Completado! ${score}/${tests.length} aciertos.</div>`;
                if (window.GAMIFICATION) GAMIFICATION.addXP(75, "Assertion Validator completado");
                if (window.TestingSession) {
                    window.TestingSession.recordSimulator('sim-assertion', score, tests.length, `${score} de ${tests.length} aserciones acertadas.`);
                }
                return;
            }
            codeEl.textContent = tests[current].code;
            feedbackEl.textContent = "";
        };
        const check = (guessedPass) => {
            const actual = tests[current].passes;
            if (guessedPass === actual) {
                feedbackEl.innerHTML = `<span style="color:#10b981;">Correcto!</span>`;
                score++;
            } else {
                feedbackEl.innerHTML = `<span style="color:#f43f5e;">Incorrecto. Resultado: ${actual ? "PASA" : "FALLA"}</span>`;
            }
            scoreEl.textContent = score;
            current++;
            setTimeout(showTest, 1200);
        };
        container.querySelector("#assert-pass").addEventListener("click", () => check(true));
        container.querySelector("#assert-fail").addEventListener("click", () => check(false));
        showTest();
    },

    renderQuiz() {
        const container = document.querySelector(".sim-quiz-container");
        if (!container) return;
        const questions = [
            { q: "Que porcentaje de tests deben ser unitarios segun la piramide de Cohn?", opts: ["10%","20%","70%","100%"], correct: 2 },
            { q: "Que hace el ciclo TDD?", opts: ["Test-Code-Deploy","Rojo-Verde-Refactor","Plan-Do-Check","Given-When-Then"], correct: 1 },
            { q: "Cual herramienta mide cobertura en Python?", opts: ["jest","pytest-cov","JaCoCo","SonarQube"], correct: 1 },
            { q: "Playwright se usa para?", opts: ["Tests unitarios","Tests E2E en navegador","Cobertura","CI/CD"], correct: 1 },
            { q: "Gherkin usa que estructura?", opts: ["if-then-else","Given-When-Then","try-catch","for-while"], correct: 1 },
            { q: "Cobertura del 100% significa?", opts: ["0 bugs","Codigo perfecto","Codigo ejecutado","Todo probado"], correct: 2 },
            { q: "GitHub Actions define pipelines en?", opts: ["YAML","JSON","XML","TOML"], correct: 0 },
            { q: "Mockito se usa con?", opts: ["Python","JavaScript","Java","Rust"], correct: 2 },
        ];
        let idx = 0, score = 0;
        container.innerHTML = `<div id="quiz-content"></div><div id="quiz-score" style="margin-top:1rem;"></div>`;
        const content = container.querySelector("#quiz-content");
        const showQ = () => {
            if (idx >= questions.length) {
                content.innerHTML = `<div style="color:#10b981;">Quiz completado! ${score}/${questions.length} correctas.</div>`;
                if (window.GAMIFICATION) GAMIFICATION.addXP(75, "Quiz completado");
                if (window.TestingSession) {
                    window.TestingSession.recordSimulator('sim-quiz', score, questions.length, `${score} de ${questions.length} preguntas correctas.`);
                }
                if (typeof confetti !== "undefined") confetti({ particleCount: 100, spread: 70 });
                return;
            }
            const q = questions[idx];
            content.innerHTML = `
                <div style="margin-bottom:1rem;font-weight:600;">${idx+1}. ${q.q}</div>
                <div style="display:grid;gap:0.5rem;">
                    ${q.opts.map((o,i) => `<button type="button" class="btn btn-secondary quiz-opt" data-i="${i}" style="text-align:left;">${o}</button>`).join("")}
                </div>
                <div id="quiz-feedback" style="margin-top:1rem;"></div>
            `;
            content.querySelectorAll(".quiz-opt").forEach(btn => {
                btn.addEventListener("click", () => {
                    const i = parseInt(btn.dataset.i);
                    const fb = content.querySelector("#quiz-feedback");
                    if (i === q.correct) { fb.innerHTML = "<span style='color:#10b981;'>Correcto!</span>"; score++; }
                    else { fb.innerHTML = `<span style='color:#f43f5e;'>Incorrecto. Respuesta: ${q.opts[q.correct]}</span>`; }
                    container.querySelector("#quiz-score").textContent = `${score}/${questions.length} aciertos`;
                    idx++;
                    setTimeout(showQ, 1500);
                });
            });
        };
        showQ();
    },

    renderPhaseSequencer() {
        const container = document.querySelector(".sim-sequencer-container");
        if (!container) return;

        const phases = [
            {
                id: 1,
                order: 1,
                title: "Pruebas Unitarias de Lógica Pura",
                tool: "PyTest / Vitest / JUnit 5",
                icon: "⚡",
                tag: "Base Pirámide (70%)",
                desc: "Valida funciones y clases aisladas en milisegundos sin llamadas de red ni base de datos.",
                rationale: "Fase 1: Se ejecuta primero porque es instantánea, barata y detecta defectos lógicos en el origen."
            },
            {
                id: 2,
                order: 2,
                title: "TDD: Ciclo Rojo-Verde-Refactor",
                tool: "PyTest / Jest TDD Mode",
                icon: "🔴🟢",
                tag: "Diseño Guiado",
                desc: "Escribir la prueba que falla antes del código de producción y refactorizar con seguridad.",
                rationale: "Fase 2: Guía el diseño de nuevas funciones y contratos unitarios garantizando especificación viva."
            },
            {
                id: 3,
                order: 3,
                title: "Pruebas de Integración y Mocks",
                tool: "FastAPI TestClient / Mockito",
                icon: "🔌",
                tag: "Capa Media (20%)",
                desc: "Valida interacción entre módulos, endpoints HTTP y dobles de prueba sin servicios externos reales.",
                rationale: "Fase 3: Una vez aislada la lógica, se prueba la comunicación entre componentes y clientes de API."
            },
            {
                id: 4,
                order: 4,
                title: "BDD: Especificaciones de Comportamiento",
                tool: "Behave / Gherkin",
                icon: "📖",
                tag: "Criterios de Negocio",
                desc: "Escenarios Given-When-Then comprensibles por negocio y ejecutados sobre el sistema.",
                rationale: "Fase 4: Conecta los contratos de integración con los criterios de aceptación y lenguaje ubicuo del usuario."
            },
            {
                id: 5,
                order: 5,
                title: "Pruebas End-to-End (E2E) en Navegador",
                tool: "Playwright",
                icon: "🎭",
                tag: "Cúspide Pirámide (10%)",
                desc: "Navegación real headless/headful, aserciones web y flujos críticos completos con auto-waiting.",
                rationale: "Fase 5: Cúspide de la pirámide; valida la experiencia integral de usuario sólo tras asegurar la base técnica."
            },
            {
                id: 6,
                order: 6,
                title: "Auditoría de Cobertura y Quality Gate",
                tool: "pytest-cov / JaCoCo",
                icon: "📊",
                tag: "Filtro de Calidad",
                desc: "Mide cobertura de ramas y sentencias bloqueando entregas si es inferior al umbral (>= 80%).",
                rationale: "Fase 6: Semáforo de calidad que audita el conjunto de tests y previene regresiones antes de publicar."
            },
            {
                id: 7,
                order: 7,
                title: "Pipeline CI/CD Automatizado",
                tool: "GitHub Actions",
                icon: "🚀",
                tag: "Automatización Continua",
                desc: "Ejecución desatendida en la nube en cada commit y pull request para proteger la rama principal.",
                rationale: "Fase 7: Automatización total que ejecuta de forma desatendida las 6 fases previas en cada cambio de código."
            }
        ];

        let currentSlots = Array(7).fill(null);
        let pool = [...phases].sort(() => Math.random() - 0.5);

        const render = () => {
            container.innerHTML = `
                <div class="sim-sequencer-wrapper">
                    <p style="color:var(--text-muted);margin-bottom:1rem;font-size:0.95rem;">
                        <strong>Misión del Aprendiz:</strong> Haz clic en las fases de la bolsa para colocarlas en el orden lógico maestro de ejecución QA (desde el Paso 1 de base unitaria hasta el Paso 7 en CI/CD).
                    </p>

                    <div style="margin-bottom:1.25rem;">
                        <span style="font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--accent-primary);">
                            Fases Disponibles (Haz clic para enviar al siguiente paso libre):
                        </span>
                        <div class="sim-sequencer-pool" id="seq-pool" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:0.75rem;margin-top:0.5rem;">
                            ${pool.map(p => `
                                <div class="sim-phase-card" data-id="${p.id}" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.75rem 1rem;cursor:pointer;transition:all 0.2s ease;">
                                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.25rem;">
                                        <span style="font-size:1.1rem;">${p.icon}</span>
                                        <span style="font-size:0.7rem;background:rgba(56,189,248,0.15);color:#38bdf8;padding:2px 8px;border-radius:12px;font-weight:600;">${p.tool}</span>
                                    </div>
                                    <div style="font-weight:600;font-size:0.88rem;color:var(--text-primary);margin-bottom:0.25rem;">${p.title}</div>
                                    <div style="font-size:0.75rem;color:var(--text-muted);line-height:1.4;">${p.desc}</div>
                                </div>
                            `).join("")}
                            ${pool.length === 0 ? '<div style="color:var(--text-muted);font-style:italic;font-size:0.85rem;padding:0.5rem;">Todas las fases han sido colocadas en el pipeline.</div>' : ''}
                        </div>
                    </div>

                    <div style="margin-bottom:1.5rem;">
                        <span style="font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#10b981;">
                            Tu Pipeline de Ejecución (Haz clic en una fase asignada para regresarla a la bolsa):
                        </span>
                        <div class="sim-sequencer-slots" id="seq-slots" style="display:flex;flex-direction:column;gap:0.6rem;margin-top:0.5rem;">
                            ${currentSlots.map((item, idx) => `
                                <div class="sim-slot" data-index="${idx}" style="display:flex;align-items:center;gap:1rem;background:rgba(15,23,42,0.6);border:1px dashed ${item ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.15)'};border-radius:8px;padding:0.6rem 1rem;min-height:54px;cursor:${item ? 'pointer' : 'default'};transition:all 0.2s ease;">
                                    <div style="width:32px;height:32px;border-radius:50%;background:${item ? 'var(--accent-primary, #38bdf8)' : 'rgba(255,255,255,0.1)'};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;flex-shrink:0;">
                                        ${idx + 1}
                                    </div>
                                    <div style="flex:1;">
                                        ${item ? `
                                            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.25rem;">
                                                <span style="font-weight:600;font-size:0.9rem;color:var(--text-primary);">${item.icon} ${item.title}</span>
                                                <span style="font-size:0.75rem;color:#38bdf8;font-family:'JetBrains Mono',monospace;">${item.tool}</span>
                                            </div>
                                            <div style="font-size:0.75rem;color:var(--text-muted);">${item.tag} &bull; Haz clic para retirar</div>
                                        ` : `
                                            <span style="font-size:0.85rem;color:var(--text-muted);font-style:italic;">Paso ${idx + 1} vacío — Selecciona una fase arriba</span>
                                        `}
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    </div>

                    <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
                        <button type="button" class="btn btn-primary" id="btn-validate-seq" style="padding:0.6rem 1.5rem;">
                            &#10004; Validar Orden del Pipeline
                        </button>
                        <button type="button" class="btn btn-secondary" id="btn-reset-seq" style="padding:0.6rem 1.2rem;">
                            &#8634; Reiniciar / Mezclar
                        </button>
                    </div>

                    <div id="seq-feedback" style="margin-top:1.25rem;"></div>
                </div>
            `;

            container.querySelectorAll(".sim-phase-card").forEach(card => {
                card.addEventListener("click", () => {
                    const id = parseInt(card.dataset.id);
                    const phase = pool.find(p => p.id === id);
                    if (!phase) return;

                    const emptyIdx = currentSlots.findIndex(s => s === null);
                    if (emptyIdx === -1) return;

                    currentSlots[emptyIdx] = phase;
                    pool = pool.filter(p => p.id !== id);
                    render();
                });
            });

            container.querySelectorAll(".sim-slot").forEach(slotEl => {
                slotEl.addEventListener("click", () => {
                    const idx = parseInt(slotEl.dataset.index);
                    const phase = currentSlots[idx];
                    if (!phase) return;

                    pool.push(phase);
                    currentSlots[idx] = null;
                    render();
                });
            });

            const validateBtn = container.querySelector("#btn-validate-seq");
            const resetBtn = container.querySelector("#btn-reset-seq");
            const feedbackEl = container.querySelector("#seq-feedback");

            if (resetBtn) {
                resetBtn.addEventListener("click", () => {
                    currentSlots = Array(7).fill(null);
                    pool = [...phases].sort(() => Math.random() - 0.5);
                    render();
                });
            }

            if (validateBtn) {
                validateBtn.addEventListener("click", () => {
                    const filledCount = currentSlots.filter(s => s !== null).length;
                    if (filledCount < 7) {
                        feedbackEl.innerHTML = `
                            <div style="background:rgba(245,158,11,0.15);border-left:4px solid #f59e0b;padding:0.75rem 1rem;border-radius:4px;color:#fcd34d;">
                                ⚠️ Faltan fases por asignar: has colocado ${filledCount} de 7. Asigna todos los pasos antes de validar.
                            </div>
                        `;
                        return;
                    }

                    let correctCount = 0;
                    const results = currentSlots.map((item, idx) => {
                        const isCorrect = item.order === (idx + 1);
                        if (isCorrect) correctCount++;
                        return { item, expected: phases.find(p => p.order === idx + 1), isCorrect };
                    });

                    if (correctCount === 7) {
                        feedbackEl.innerHTML = `
                            <div style="background:rgba(16,185,129,0.15);border:1px solid #10b981;padding:1.25rem;border-radius:8px;margin-bottom:1rem;">
                                <div style="font-size:1.15rem;font-weight:700;color:#34d399;margin-bottom:0.5rem;">
                                    🎉 ¡Excelente! Has ordenado el Pipeline Maestro al 100% (7/7)
                                </div>
                                <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:1rem;">
                                    Dominas la progresión lógica de pruebas: desde la velocidad y aislamiento de la base unitaria hasta la orquestación desatendida en la nube con CI/CD.
                                </p>
                                <div style="display:grid;gap:0.5rem;font-size:0.83rem;">
                                    ${phases.map(p => `
                                        <div style="padding:0.4rem 0.6rem;background:rgba(0,0,0,0.2);border-radius:4px;color:#a7f3d0;">
                                            <strong>${p.icon} Paso ${p.order}:</strong> ${p.rationale}
                                        </div>
                                    `).join("")}
                                </div>
                            </div>
                        `;
                        if (window.GAMIFICATION) {
                            window.GAMIFICATION.addXP(100, "Secuenciador de Fases completado (7/7)");
                        }
                        if (window.TestingSession) {
                            window.TestingSession.recordSimulator('sim-sequencer', 7, 7, 'Pipeline Maestro ordenado al 100% (7/7 fases).');
                        }
                        if (typeof confetti !== "undefined") {
                            confetti({ particleCount: 120, spread: 80 });
                        }
                    } else {
                        if (window.TestingSession) {
                            window.TestingSession.recordSimulator('sim-sequencer', correctCount, 7, `${correctCount} de 7 fases en posición correcta.`);
                        }
                        feedbackEl.innerHTML = `
                            <div style="background:rgba(239,68,68,0.12);border:1px solid #ef4444;padding:1.25rem;border-radius:8px;margin-bottom:1rem;">
                                <div style="font-size:1.1rem;font-weight:700;color:#f87171;margin-bottom:0.5rem;">
                                    ⚠️ ${correctCount} de 7 fases en posición correcta. Revisa las discrepancias:
                                </div>
                                <div style="display:grid;gap:0.4rem;font-size:0.84rem;margin-top:0.75rem;">
                                    ${results.map((r, i) => `
                                        <div style="display:flex;align-items:center;justify-content:space-between;padding:0.4rem 0.6rem;background:rgba(0,0,0,0.25);border-radius:4px;border-left:3px solid ${r.isCorrect ? '#10b981' : '#ef4444'};">
                                            <span><strong>Paso ${i + 1}:</strong> ${r.item.title}</span>
                                            <span style="color:${r.isCorrect ? '#34d399' : '#f87171'};font-weight:600;">
                                                ${r.isCorrect ? '✔ Correcto' : `✖ Debería ser: ${r.expected.title}`}
                                            </span>
                                        </div>
                                    `).join("")}
                                </div>
                                <p style="font-size:0.8rem;color:var(--text-muted);margin-top:0.75rem;">
                                    💡 <em>Consejo: Recuerda que la base de la pirámide (unitarias y TDD) va primero por velocidad y aislamiento, luego integración con mocks, BDD con negocio, E2E en navegador, auditoría de cobertura como semáforo y finalmente CI/CD en la nube.</em>
                                </p>
                            </div>
                        `;
                    }
                });
            }
        };

        render();
    }
};

SIMULATORS.init();
