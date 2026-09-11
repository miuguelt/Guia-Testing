const SIMULATORS = {
    init() {
        document.addEventListener("DOMContentLoaded", () => {
            setTimeout(() => {
                this.setupPerspectiveTabs();
                this.renderBVAAnalyzer();
                this.renderTDDStudio();
                this.renderTestDoublesLab();
                this.renderPyramidBuilder();
                this.renderAssertionValidator();
                this.renderQuiz();
                this.renderPhaseSequencer();
                this.renderBugTriage();
                this.updateCompletionCounter();
            }, 200);
        });
    },

    setupPerspectiveTabs() {
        const tabBtns = document.querySelectorAll(".sim-tab-btn");
        const tabContents = document.querySelectorAll(".sim-tab-content");
        if (!tabBtns.length || !tabContents.length) return;

        tabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const targetId = btn.dataset.tab;
                tabBtns.forEach(b => b.classList.remove("active"));
                tabContents.forEach(c => {
                    c.classList.remove("active");
                    c.style.display = "none";
                });

                btn.classList.add("active");
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add("active");
                    targetContent.style.display = "block";
                }
                this.updateCompletionCounter();
            });
        });
    },

    updateCompletionCounter() {
        const counterEl = document.getElementById("sim-completed-counter");
        if (!counterEl || !window.TestingSession) return;
        try {
            const sims = window.TestingSession.getSimulators();
            const keys = ['sim-bva', 'sim-tdd', 'sim-doubles', 'sim-e2e', 'sim-sequencer', 'sim-pyramid', 'sim-triage', 'sim-quiz'];
            const completed = keys.filter(k => sims[k] && (sims[k].completed || sims[k].passed)).length;
            counterEl.textContent = String(completed);
        } catch (e) {
            console.warn('Error al actualizar contador de simuladores', e);
        }
    },

    renderBVAAnalyzer() {
        const container = document.querySelector(".sim-bva-container");
        if (!container) return;

        const testCases = [
            { id: 'c1', input: 0, expected: 'RECHAZADO', partition: 'Inválida menor (< 1)', bvaRole: 'Límite inferior inválido (min - 1)', explanation: 'Frontera externa inferior: no se puede solicitar una cantidad de cero equipos.' },
            { id: 'c2', input: 1, expected: 'ACEPTADO', partition: 'Válida (1 a 5)', bvaRole: 'Límite inferior exacto (min)', explanation: 'Frontera exacta: es la primera cantidad permitida por la regla.' },
            { id: 'c3', input: 2, expected: 'ACEPTADO', partition: 'Válida (1 a 5)', bvaRole: 'Interior inmediato (min + 1)', explanation: 'Punto interno adyacente que confirma el comportamiento dentro del rango.' },
            { id: 'c4', input: 4, expected: 'ACEPTADO', partition: 'Válida (1 a 5)', bvaRole: 'Interior inmediato (max - 1)', explanation: 'Punto interno adyacente a la frontera superior.' },
            { id: 'c5', input: 5, expected: 'ACEPTADO', partition: 'Válida (1 a 5)', bvaRole: 'Límite superior exacto (max)', explanation: 'Frontera exacta: es la cantidad máxima permitida.' },
            { id: 'c6', input: 6, expected: 'RECHAZADO', partition: 'Inválida mayor (> 5)', bvaRole: 'Límite superior inválido (max + 1)', explanation: 'Frontera externa superior: supera el máximo permitido por solicitud.' }
        ];

        let testedCases = new Set();

        const render = () => {
            container.innerHTML = `
                <div class="bva-ruler-container">
                    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.75rem;">
                        <div>
                            <strong style="color:var(--text-primary);font-size:0.95rem;">📐 Regla de Negocio:</strong>
                            <span style="color:var(--text-secondary);font-size:0.88rem;margin-left:0.5rem;">"La cantidad de equipos debe ser un entero entre 1 y 5, inclusive."</span>
                        </div>
                        <span style="font-size:0.75rem;background:rgba(56,189,248,0.15);color:#38bdf8;padding:3px 10px;border-radius:12px;font-weight:600;">Caja Negra Formal</span>
                    </div>

                    <!-- Representación gráfica de la recta numérica y particiones -->
                    <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:0.25rem;">Visualización de Clases de Equivalencia y Puntos de Frontera:</div>
                    <div class="bva-partitions-bar">
                        <div class="bva-part-invalid-low" title="Partición Inválida Menor">
                            <span>🚫 Inválida menor<br><small>&lt; 1 equipo</small></span>
                        </div>
                        <div class="bva-part-valid" title="Partición Válida">
                            <span>✅ Rango válido<br><small>1 a 5 equipos</small></span>
                        </div>
                        <div class="bva-part-invalid-high" title="Partición Inválida Mayor">
                            <span>🚫 Inválida mayor<br><small>&gt; 5 equipos</small></span>
                        </div>
                    </div>

                    <!-- Input interactivo de prueba libre -->
                    <div style="background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:0.75rem 1rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:1rem;">
                        <label style="font-size:0.85rem;color:var(--text-secondary);display:flex;align-items:center;gap:0.5rem;">
                            <strong>Probar una cantidad de equipos:</strong>
                            <input type="number" id="bva-custom-input" placeholder="Ej.: 5" style="background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:0.4rem 0.6rem;border-radius:6px;width:90px;font-size:0.9rem;">
                        </label>
                        <button type="button" class="btn btn-sm btn-primary" id="btn-eval-bva-custom">Evaluar con la regla</button>
                        <div id="bva-custom-result" style="font-size:0.85rem;font-weight:600;"></div>
                    </div>

                    <!-- Tabla formal de valores límite -->
                    <div style="overflow-x:auto;">
                        <table class="bva-table">
                            <thead>
                                <tr>
                                    <th>Valor</th>
                                    <th>Rol en Frontera (BVA)</th>
                                    <th>Partición de Equivalencia</th>
                                    <th>Resultado Esperado</th>
                                    <th>Estado de Prueba</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${testCases.map(tc => {
                                    const isTested = testedCases.has(tc.id);
                                    return `
                                        <tr style="background:${isTested ? 'rgba(16,185,129,0.06)' : 'transparent'};">
                                            <td><strong style="font-family:'JetBrains Mono',monospace;font-size:0.95rem;color:#38bdf8;">${tc.input}</strong></td>
                                            <td style="font-size:0.82rem;">${tc.bvaRole}</td>
                                            <td style="font-size:0.82rem;color:var(--text-muted);">${tc.partition}</td>
                                            <td>
                                                <span style="font-size:0.76rem;font-weight:700;padding:2px 8px;border-radius:4px;background:${tc.expected === 'ACEPTADO' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'};color:${tc.expected === 'ACEPTADO' ? '#34d399' : '#f87171'};">
                                                    ${tc.expected}
                                                </span>
                                            </td>
                                            <td>
                                                ${isTested
                                                    ? '<span style="color:#10b981;font-size:0.82rem;font-weight:600;">✔ Probado</span>'
                                                    : '<span style="color:var(--text-muted);font-size:0.82rem;">Pendiente</span>'}
                                            </td>
                                            <td>
                                                <button type="button" class="btn btn-sm btn-secondary btn-run-case" data-id="${tc.id}" style="padding:3px 10px;font-size:0.78rem;">
                                                    ${isTested ? 'Re-evaluar' : 'Ejecutar Test'}
                                                </button>
                                            </td>
                                        </tr>
                                    `;
                                }).join("")}
                            </tbody>
                        </table>
                    </div>

                    <div style="margin-top:1rem;display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap;">
                        <button type="button" class="btn btn-primary" id="btn-run-all-bva" style="padding:0.55rem 1.2rem;font-size:0.85rem;">
                            ⚡ Ejecutar Suite Completa BVA (6 Casos)
                        </button>
                        <button type="button" class="btn btn-secondary" id="btn-reset-bva" style="padding:0.55rem 1rem;font-size:0.85rem;">
                            ↺ Reiniciar
                        </button>
                        <span style="font-size:0.85rem;color:var(--text-muted);margin-left:auto;">
                            Casos de frontera probados: <strong>${testedCases.size} de ${testCases.length}</strong>
                        </span>
                    </div>

                    <div id="bva-feedback" style="margin-top:1rem;"></div>
                </div>
            `;

            // Event listeners
            const customInput = container.querySelector("#bva-custom-input");
            const customBtn = container.querySelector("#btn-eval-bva-custom");
            const customResult = container.querySelector("#bva-custom-result");

            const evalQuantity = (quantity) => {
                if (!Number.isInteger(quantity)) return { valid: false, isAdmitted: false, text: "Ingresa un número entero" };
                const isAdmitted = quantity >= 1 && quantity <= 5;
                return {
                    valid: true,
                    isAdmitted,
                    text: isAdmitted
                        ? `✅ ${quantity} equipos: ACEPTADO (rango válido [1..5])`
                        : `🚫 ${quantity} equipos: RECHAZADO (fuera del rango [1..5])`
                };
            };

            if (customBtn && customInput) {
                customBtn.addEventListener("click", () => {
                    const val = Number(customInput.value);
                    const res = evalQuantity(val);
                    if (customResult) {
                        customResult.innerHTML = `<span style="color:${res.isAdmitted ? '#34d399' : '#f87171'};">${res.text}</span>`;
                    }
                });
            }

            container.querySelectorAll(".btn-run-case").forEach(btn => {
                btn.addEventListener("click", () => {
                    const id = btn.dataset.id;
                    testedCases.add(id);
                    render();
                    checkCompletion();
                });
            });

            const runAllBtn = container.querySelector("#btn-run-all-bva");
            if (runAllBtn) {
                runAllBtn.addEventListener("click", () => {
                    testCases.forEach(tc => testedCases.add(tc.id));
                    render();
                    checkCompletion();
                });
            }

            const resetBtn = container.querySelector("#btn-reset-bva");
            if (resetBtn) {
                resetBtn.addEventListener("click", () => {
                    testedCases.clear();
                    render();
                });
            }
        };

        const checkCompletion = () => {
            const feedbackEl = container.querySelector("#bva-feedback");
            if (testedCases.size === testCases.length) {
                if (feedbackEl) {
                    feedbackEl.innerHTML = `
                        <div style="background:rgba(16,185,129,0.15);border:1px solid #10b981;border-radius:8px;padding:1rem;">
                            <div style="font-size:1.05rem;font-weight:700;color:#34d399;margin-bottom:0.5rem;">
                                🎉 ¡Análisis de Valores Límite Completo (6/6 Casos Dominados)!
                            </div>
                            <p style="font-size:0.86rem;color:var(--text-secondary);margin-bottom:0.75rem;">
                                Probaste las fronteras de la regla con <code>0, 1, 2, 4, 5 y 6</code>. Estos casos ayudan a revelar comparaciones inclusivas o exclusivas equivocadas. No demuestran permisos, disponibilidad ni persistencia: esos riesgos necesitan casos adicionales.
                            </p>
                        </div>
                    `;
                }
                if (window.GAMIFICATION) {
                    window.GAMIFICATION.addXP(75, "Partición de Equivalencia & BVA completado");
                }
                if (window.TestingSession) {
                    window.TestingSession.recordSimulator('sim-bva', 6, 6, 'Particiones y fronteras de cantidad (0, 1, 2, 4, 5, 6) simuladas.');
                }
                SIMULATORS.updateCompletionCounter();
                if (typeof confetti !== "undefined") confetti({ particleCount: 70, spread: 60 });
            }
        };

        render();
    },

    renderTDDStudio() {
        const container = document.querySelector(".sim-tdd-container");
        if (!container) return;

        let currentPhase = 1; // 1: Red, 2: Green, 3: Refactor
        let suitePassed = false;

        const render = () => {
            container.innerHTML = `
                <div class="tdd-studio-card">
                    <!-- Stepper visual del ciclo TDD -->
                    <div class="tdd-cycle-stepper">
                        <div class="tdd-step-pill is-red ${currentPhase === 1 ? 'active' : ''}">
                            <span style="font-size:1rem;">🔴</span> 1. Rojo (Red): Test que Falla
                        </div>
                        <div class="tdd-step-pill is-green ${currentPhase === 2 ? 'active' : ''}">
                            <span style="font-size:1rem;">🟢</span> 2. Verde (Green): Código Mínimo
                        </div>
                        <div class="tdd-step-pill is-refactor ${currentPhase === 3 ? 'active' : ''}">
                            <span style="font-size:1rem;">🔵</span> 3. Refactor: Limpieza Segura
                        </div>
                    </div>

                    <div style="font-size:0.86rem;color:var(--text-secondary);margin-bottom:1rem;">
                        ${currentPhase === 1
                            ? '<strong>Misión Fase 1:</strong> En TDD, la prueba se escribe <em>antes</em> del código de producción. Ejecuta PyTest y observa cómo falla porque la función aún no existe.'
                            : currentPhase === 2
                            ? '<strong>Misión Fase 2:</strong> Escribe solo el código estrictamente necesario para hacer que la prueba pase. No inventes abstracciones prematuras.'
                            : '<strong>Misión Fase 3:</strong> Mejora el diseño y elimina duplicación extrayendo constantes limpias, verificando que las pruebas se mantengan en verde.'}
                    </div>

                    <!-- Dos paneles: Archivo de Prueba vs Archivo de Producción -->
                    <div class="tdd-editor-grid">
                        <div class="tdd-code-pane">
                            <div class="tdd-pane-header">
                                <span>📄 tests/test_transporte.py (Suite PyTest)</span>
                                <span style="color:#38bdf8;">Solo Lectura</span>
                            </div>
                            <pre style="margin:0;padding:0.75rem;color:#e2e8f0;background:transparent;overflow-x:auto;"><code>${
currentPhase === 1 ? `# Prueba que define el nuevo requerimiento:
# Los estudiantes reciben 50% de descuento en la tarifa base (5000)
from transporte import calcular_tarifa

def test_estudiante_recibe_descuento_cincuenta_porciento():
    tarifa = calcular_tarifa(edad=20, es_estudiante=True)
    assert tarifa == 2500` :
currentPhase === 2 ? `from transporte import calcular_tarifa

def test_estudiante_recibe_descuento_cincuenta_porciento():
    assert calcular_tarifa(20, es_estudiante=True) == 2500

def test_tarifa_regular_sin_estudiante():
    assert calcular_tarifa(30, es_estudiante=False) == 5000` :
`# Suite completa con validación de regresión
from transporte import calcular_tarifa

def test_estudiante_recibe_descuento_cincuenta_porciento():
    assert calcular_tarifa(20, es_estudiante=True) == 2500

def test_tarifa_regular_sin_estudiante():
    assert calcular_tarifa(30, es_estudiante=False) == 5000

def test_adulto_mayor_viaja_gratis():
    assert calcular_tarifa(70, es_estudiante=False) == 0`}</code></pre>
                        </div>

                        <div class="tdd-code-pane">
                            <div class="tdd-pane-header">
                                <span>🐍 app/transporte.py (Código de Producción)</span>
                                <span style="color:#10b981;">Código Activo</span>
                            </div>
                            <pre style="margin:0;padding:0.75rem;color:#e2e8f0;background:transparent;overflow-x:auto;"><code>${
currentPhase === 1 ? `# El archivo aún está vacío o la función no existe
# ¿Qué debe pasar al correr la prueba? Un fallo limpio.

# (Aún no implementado)` :
currentPhase === 2 ? `# Implementación MÍNIMA que hace pasar la prueba
def calcular_tarifa(edad, es_estudiante=False):
    if es_estudiante:
        return 2500
    return 5000` :
`# Código Refactorizado: Constantes limpias y lógica clara
TARIFA_BASE = 5000
DESCUENTO_ESTUDIANTE = 0.50

def calcular_tarifa(edad, es_estudiante=False):
    if edad >= 65:
        return 0  # Beneficio adulto mayor
    if es_estudiante:
        return int(TARIFA_BASE * (1 - DESCUENTO_ESTUDIANTE))
    return TARIFA_BASE`}</code></pre>
                        </div>
                    </div>

                    <!-- Consola de salida de PyTest -->
                    <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.25rem;">
                        Terminal de Ejecución PyTest:
                    </div>
                    <div class="tdd-console-output" id="tdd-terminal">
                        ${currentPhase === 1
                            ? 'Estado: Listo para ejecutar la prueba inicial en fase ROJA.\nHaz clic en "▶ Ejecutar PyTest (Esperar Fallo)" para verificar el fallo.'
                            : currentPhase === 2
                            ? 'Fase ROJA superada con éxito. Ahora ejecuta PyTest para confirmar que el código mínimo pasa a VERDE.'
                            : 'Fase VERDE superada. Ejecuta la suite refactorizada para confirmar que ambas pruebas siguen pasando.'}
                    </div>

                    <!-- Botones de acción del ciclo -->
                    <div style="margin-top:1rem;display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
                        ${currentPhase === 1 ? `
                            <button type="button" class="btn btn-primary" id="btn-tdd-run-red" style="background:#ef4444;border-color:#ef4444;color:#fff;">
                                🔴 Ejecutar PyTest (Ver Fallo Rojo)
                            </button>
                        ` : currentPhase === 2 ? `
                            <button type="button" class="btn btn-primary" id="btn-tdd-run-green" style="background:#10b981;border-color:#10b981;color:#fff;">
                                🟢 Ejecutar PyTest (Hacer Pasar a Verde)
                            </button>
                        ` : `
                            <button type="button" class="btn btn-primary" id="btn-tdd-run-refactor" style="background:#0284c7;border-color:#0284c7;color:#fff;">
                                🔵 Ejecutar Suite Refactorizada
                            </button>
                        `}
                        <button type="button" class="btn btn-secondary" id="btn-tdd-reset">
                            ↺ Reiniciar Ciclo TDD
                        </button>
                    </div>

                    <div id="tdd-completion-box" style="margin-top:1rem;"></div>
                </div>
            `;

            const terminal = container.querySelector("#tdd-terminal");
            const redBtn = container.querySelector("#btn-tdd-run-red");
            const greenBtn = container.querySelector("#btn-tdd-run-green");
            const refactorBtn = container.querySelector("#btn-tdd-run-refactor");
            const resetBtn = container.querySelector("#btn-tdd-reset");

            if (redBtn) {
                redBtn.addEventListener("click", () => {
                    terminal.innerHTML = `<span style="color:#f87171;">============================= test session starts ==============================
rootdir: /app, configfile: pytest.ini
collected 1 item

tests/test_transporte.py <strong style="color:#ef4444;">F</strong>                                             [100%]

=================================== FAILURES ===================================
_________________ test_estudiante_recibe_descuento_cincuenta_porciento _________________
ImportError: cannot import name 'calcular_tarifa' from 'transporte'
E   NameError: name 'calcular_tarifa' is not defined

=========================== 1 failed in 0.03s ==============================</span>
<span style="color:#38bdf8;">\n✔ ¡FASE ROJA CONFIRMADA! La prueba falló legítimamente por ausencia de código. Avanzando a Fase Verde...</span>`;
                    setTimeout(() => {
                        currentPhase = 2;
                        render();
                    }, 1600);
                });
            }

            if (greenBtn) {
                greenBtn.addEventListener("click", () => {
                    terminal.innerHTML = `<span style="color:#34d399;">============================= test session starts ==============================
rootdir: /app, configfile: pytest.ini
collected 2 items

tests/test_transporte.py <strong style="color:#10b981;">..</strong>                                            [100%]

============================== 2 passed in 0.02s ===============================</span>
<span style="color:#38bdf8;">\n✔ ¡FASE VERDE LOGRADA! El código mínimo satisfizo el contrato de la prueba. Avanzando a Refactor...</span>`;
                    setTimeout(() => {
                        currentPhase = 3;
                        render();
                    }, 1600);
                });
            }

            if (refactorBtn) {
                refactorBtn.addEventListener("click", () => {
                    suitePassed = true;
                    terminal.innerHTML = `<span style="color:#34d399;">============================= test session starts ==============================
rootdir: /app, configfile: pytest.ini
collected 3 items

tests/test_transporte.py <strong style="color:#10b981;">...</strong>                                           [100%]

============================== 3 passed in 0.02s ===============================</span>
<span style="color:#6ee7b7;font-weight:700;">\n🎉 ¡CICLO TDD COMPLETO Y REFACTORIZADO! Código limpio y suite en verde sin regresiones.</span>`;

                    const compBox = container.querySelector("#tdd-completion-box");
                    if (compBox) {
                        compBox.innerHTML = `
                            <div style="background:rgba(16,185,129,0.15);border:1px solid #10b981;border-radius:8px;padding:1rem;">
                                <div style="font-weight:700;color:#34d399;font-size:1rem;margin-bottom:0.4rem;">
                                    🏆 ¡Ciclo TDD Dominado! (Rojo ➔ Verde ➔ Refactor)
                                </div>
                                <p style="font-size:0.85rem;color:var(--text-secondary);margin:0;">
                                    Has experimentado la disciplina clave del desarrollo guiado por pruebas: nunca escribir código sin una prueba previa que falle, implementar solo lo necesario y refactorizar con la red de seguridad de tus tests automatizados.
                                </p>
                            </div>
                        `;
                    }
                    if (window.GAMIFICATION) {
                        window.GAMIFICATION.addXP(100, "Ciclo TDD completado (Rojo-Verde-Refactor)");
                    }
                    if (window.TestingSession) {
                        window.TestingSession.recordSimulator('sim-tdd', 3, 3, 'Ciclo Rojo-Verde-Refactor implementado con 3 pruebas pasando.');
                    }
                    SIMULATORS.updateCompletionCounter();
                    if (typeof confetti !== "undefined") confetti({ particleCount: 80, spread: 70 });
                });
            }

            if (resetBtn) {
                resetBtn.addEventListener("click", () => {
                    currentPhase = 1;
                    suitePassed = false;
                    render();
                });
            }
        };

        render();
    },

    renderTestDoublesLab() {
        const container = document.querySelector(".sim-doubles-container");
        if (!container) return;

        const scenarios = [
            {
                id: 1,
                title: "Cobro de Tarjeta de Crédito con Pasarela Stripe",
                context: "No queremos debitar dinero real ni depender de que el servidor de Stripe esté en línea durante cada ejecución de la suite de pruebas.",
                options: [
                    { name: "Sin Doble (Llamar a Stripe real)", correct: false, note: "Peligroso: consume saldo real y la prueba falla si se cae internet." },
                    { name: "Stub (Respuesta fija simulada)", correct: true, note: "¡Correcto! Un Stub devuelve una respuesta estática predeterminada {'status': 'success', 'id': 'ch_123'} en 2ms." },
                    { name: "Dummy (Objeto de relleno)", correct: false, note: "Insuficiente: el método de cobro sí necesita devolver datos para continuar el flujo." }
                ],
                selected: null
            },
            {
                id: 2,
                title: "Envío de Correo Electrónico de Bienvenida",
                context: "El registro de usuario envía un email por SMTP. Queremos verificar que el sistema intentó enviar el correo con el email y asunto correctos sin enviar emails reales.",
                options: [
                    { name: "Spy / Mock (Verificar invocación)", correct: true, note: "¡Correcto! El Mock/Spy registra si la función send_mail() fue llamada exactamente 1 vez y con qué argumentos." },
                    { name: "Fake (Servidor SMTP simulado)", correct: false, note: "Demasiado complejo: no necesitamos un servidor de correo entero, solo comprobar la llamada." },
                    { name: "Sin Doble (Enviar correo real)", correct: false, note: "Inadecuado: satura el servidor de correo y es muy lento." }
                ],
                selected: null
            },
            {
                id: 3,
                title: "Persistencia de Datos en Repositorio de Usuarios",
                context: "Para ejecutar pruebas unitarias ultra-rápidas en memoria (< 50ms) sin depender de instalar o levantar PostgreSQL ni hacer migraciones.",
                options: [
                    { name: "Dummy (Valor nulo)", correct: false, note: "No sirve: el sistema necesita guardar y recuperar el usuario más adelante." },
                    { name: "Stub (Respuesta dura fija)", correct: false, note: "Limitado: si agregas dos usuarios, un stub siempre devuelve el mismo objeto fijo." },
                    { name: "Fake (Repositorio en memoria con un dict/array)", correct: true, note: "¡Correcto! Un Fake tiene una implementación funcional real pero ligera (como un diccionario en memoria) perfecta para pruebas rápidas." }
                ],
                selected: null
            },
            {
                id: 4,
                title: "Función de Validación de Rango: calcular_iva(monto)",
                context: "Función matemática pura sin base de datos, sin red y sin efectos secundarios.",
                options: [
                    { name: "Mock de la función", correct: false, note: "Antipatrón: si mockeas la función pura, estás probando el mock en lugar de probar tu código." },
                    { name: "Sin Doble (Probar directamente el código real)", correct: true, note: "¡Correcto! Las funciones puras de lógica de negocio se prueban directamente sin ningún doble de prueba." },
                    { name: "Stub de retorno", correct: false, note: "Innecesario: la función se ejecuta en microsegundos y no tiene dependencias." }
                ],
                selected: null
            }
        ];

        let completed = false;

        const render = () => {
            const answeredCount = scenarios.filter(s => s.selected !== null).length;
            const correctCount = scenarios.filter(s => s.selected && s.selected.correct).length;

            container.innerHTML = `
                <div style="background:rgba(15,23,42,0.7);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:1.25rem;">
                    <p style="color:var(--text-muted);font-size:0.88rem;margin-bottom:1rem;">
                        <strong>Misión del Aprendiz:</strong> Selecciona el doble de prueba apropiado (Mock, Stub, Fake o Sin Doble) para aislar cada dependencia y comparar la ganancia en aislamiento y velocidad.
                    </p>

                    <div class="doubles-card-grid">
                        ${scenarios.map((s, idx) => `
                            <div class="doubles-card" style="border-left:4px solid ${s.selected ? (s.selected.correct ? '#10b981' : '#ef4444') : '#38bdf8'};">
                                <div style="font-size:0.75rem;font-weight:700;color:#38bdf8;text-transform:uppercase;margin-bottom:0.25rem;">
                                    Caso ${idx + 1}
                                </div>
                                <div style="font-weight:600;font-size:0.9rem;color:var(--text-primary);margin-bottom:0.4rem;">
                                    ${s.title}
                                </div>
                                <div style="font-size:0.78rem;color:var(--text-muted);line-height:1.4;margin-bottom:0.75rem;">
                                    ${s.context}
                                </div>

                                <div style="display:grid;gap:0.4rem;">
                                    ${s.options.map((opt, optIdx) => {
                                        const isChosen = s.selected && s.selected.name === opt.name;
                                        return `
                                            <button type="button" class="btn btn-sm btn-opt-double" data-scenario="${s.id}" data-opt="${optIdx}" style="text-align:left;font-size:0.76rem;padding:0.4rem 0.6rem;background:${isChosen ? (opt.correct ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)') : 'rgba(255,255,255,0.04)'};border:1px solid ${isChosen ? (opt.correct ? '#10b981' : '#ef4444') : 'rgba(255,255,255,0.1)'};color:${isChosen ? '#fff' : 'var(--text-secondary)'};border-radius:6px;">
                                                ${opt.name}
                                            </button>
                                        `;
                                    }).join("")}
                                </div>

                                ${s.selected ? `
                                    <div style="margin-top:0.6rem;padding:0.4rem 0.6rem;border-radius:6px;background:${s.selected.correct ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)'};font-size:0.75rem;color:${s.selected.correct ? '#6ee7b7' : '#fca5a5'};">
                                        ${s.selected.note}
                                    </div>
                                ` : ''}
                            </div>
                        `).join("")}
                    </div>

                    <!-- Comparativa de Velocidad & Aislamiento -->
                    <div style="margin-top:1.25rem;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:1rem;">
                        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;font-size:0.85rem;">
                            <strong>⚡ Impacto de los Dobles en la Velocidad de las Pruebas:</strong>
                            <span style="color:#38bdf8;font-weight:600;">Progreso: ${correctCount} de ${scenarios.length} correctos</span>
                        </div>
                        <div class="doubles-speed-bar" style="margin-top:0.75rem;">
                            <span style="width:130px;color:var(--text-muted);">Sin Mocks (I/O real):</span>
                            <div class="speed-meter"><div class="speed-fill" style="width:95%;background:#ef4444;"></div></div>
                            <span style="width:70px;color:#f87171;font-weight:600;">~ 4,800 ms</span>
                        </div>
                        <div class="doubles-speed-bar">
                            <span style="width:130px;color:var(--text-muted);">Con Dobles (Memoria):</span>
                            <div class="speed-meter"><div class="speed-fill" style="width:5%;background:#10b981;"></div></div>
                            <span style="width:70px;color:#34d399;font-weight:600;">~ 18 ms</span>
                        </div>
                    </div>

                    <div id="doubles-feedback" style="margin-top:1rem;"></div>
                </div>
            `;

            container.querySelectorAll(".btn-opt-double").forEach(btn => {
                btn.addEventListener("click", () => {
                    const scenarioId = parseInt(btn.dataset.scenario);
                    const optIdx = parseInt(btn.dataset.opt);
                    const targetScenario = scenarios.find(s => s.id === scenarioId);
                    if (targetScenario) {
                        targetScenario.selected = targetScenario.options[optIdx];
                        render();
                        checkAll();
                    }
                });
            });
        };

        const checkAll = () => {
            const correctCount = scenarios.filter(s => s.selected && s.selected.correct).length;
            const feedbackEl = container.querySelector("#doubles-feedback");
            if (correctCount === scenarios.length && feedbackEl) {
                feedbackEl.innerHTML = `
                    <div style="background:rgba(16,185,129,0.15);border:1px solid #10b981;border-radius:8px;padding:1rem;">
                        <div style="font-weight:700;color:#34d399;font-size:1rem;margin-bottom:0.4rem;">
                            🎉 ¡Excelente! Dominas la Taxonomía de Dobles de Prueba (4/4)
                        </div>
                        <p style="font-size:0.85rem;color:var(--text-secondary);margin:0;">
                            Entendiste cuándo simular y cuándo no: los <strong>Stubs</strong> entregan respuestas fijas, los <strong>Mocks/Spies</strong> verifican que los contratos se cumplan sin llamar servicios externos, los <strong>Fakes</strong> permiten probar lógica con persistencia simulada ultrarrápida, y las <strong>funciones puras</strong> jamás deben aislarse con dobles.
                        </p>
                    </div>
                `;
                if (window.GAMIFICATION) {
                    window.GAMIFICATION.addXP(80, "Laboratorio de Dobles de Prueba completado");
                }
                if (window.TestingSession) {
                    window.TestingSession.recordSimulator('sim-doubles', 4, 4, '4 escenarios de dobles de prueba resueltos (Mock, Stub, Fake, Sin Doble).');
                }
                SIMULATORS.updateCompletionCounter();
                if (typeof confetti !== "undefined") confetti({ particleCount: 70, spread: 60 });
            }
        };

        render();
    },

    renderBugTriage() {
        const container = document.querySelector(".sim-triage-container");
        if (!container) return;

        let triageData = {
            rootCause: null,
            severity: null,
            priority: null,
            action: null
        };

        const render = () => {
            container.innerHTML = `
                <div style="background:rgba(15,23,42,0.8);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:1.25rem;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;flex-wrap:wrap;gap:0.5rem;">
                        <div>
                            <strong style="color:var(--text-primary);font-size:0.95rem;">🚨 Incidente en CI/CD: Pipeline bloqueado en Stage de Integración</strong>
                            <div style="font-size:0.8rem;color:var(--text-muted);">Un commit activó la suite y arrojó el siguiente reporte de fallo:</div>
                        </div>
                        <span class="triage-badge" style="background:rgba(239,68,68,0.2);color:#f87171;border:1px solid #ef4444;">Fallo Activo</span>
                    </div>

                    <!-- Consola del Error en CI -->
                    <div class="triage-console">
[RUNNER] pytest tests/api/test_checkout.py -v
FAILED tests/api/test_checkout.py::test_checkout_pago_con_tarjeta_expirada
----------------------------- Captured Traceback -----------------------------
AssertionError: assert 500 == 422
 + where 500 = &lt;Response [500 Internal Server Error]&gt;.status_code
Stacktrace:
 File "app/services/payment_service.py", line 47, in procesar_pago
   exp_date = payload['card_details']['expiration']
 KeyError: 'expiration'  # &lt;-- Clave no validada previa al procesamiento
                    </div>

                    <!-- Panel de Clasificación del Defecto -->
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;margin-bottom:1rem;">
                        <div>
                            <label style="font-size:0.8rem;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:0.4rem;">
                                1. Diagnóstico de Causa Raíz:
                            </label>
                            <select class="sim-select" id="triage-root-cause" style="width:100%;">
                                <option value="">-- Selecciona Causa --</option>
                                <option value="network" ${triageData.rootCause === 'network' ? 'selected' : ''}>Problema de red transitorio (Flaky test)</option>
                                <option value="logic" ${triageData.rootCause === 'logic' ? 'selected' : ''}>Defecto en código: KeyError no capturado (retorna 500 en vez de 422)</option>
                                <option value="test_bug" ${triageData.rootCause === 'test_bug' ? 'selected' : ''}>La prueba está mal escrita y debe borrarse</option>
                            </select>
                        </div>

                        <div>
                            <label style="font-size:0.8rem;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:0.4rem;">
                                2. Nivel de Severidad (Impacto):
                            </label>
                            <select class="sim-select" id="triage-severity" style="width:100%;">
                                <option value="">-- Selecciona Severidad --</option>
                                <option value="low" ${triageData.severity === 'low' ? 'selected' : ''}>Baja (Detalle cosmético)</option>
                                <option value="medium" ${triageData.severity === 'medium' ? 'selected' : ''}>Media (Funcionalidad secundaria degradada)</option>
                                <option value="high" ${triageData.severity === 'high' ? 'selected' : ''}>Alta / Crítica (Crash del servidor 500 en endpoint clave)</option>
                            </select>
                        </div>

                        <div>
                            <label style="font-size:0.8rem;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:0.4rem;">
                                3. Acción Correctiva QA:
                            </label>
                            <select class="sim-select" id="triage-action" style="width:100%;">
                                <option value="">-- Selecciona Acción --</option>
                                <option value="ignore" ${triageData.action === 'ignore' ? 'selected' : ''}>Desactivar el test con @pytest.mark.skip</option>
                                <option value="bug_to_test" ${triageData.action === 'bug_to_test' ? 'selected' : ''}>Registrar defecto con pasos y exigir validación de schema 422</option>
                                <option value="change_assert" ${triageData.action === 'change_assert' ? 'selected' : ''}>Cambiar assert a 500 para que el pipeline se ponga verde</option>
                            </select>
                        </div>
                    </div>

                    <button type="button" class="btn btn-primary" id="btn-submit-triage" style="padding:0.55rem 1.4rem;">
                        ✔ Validar Dictamen de Triage
                    </button>

                    <div id="triage-feedback" style="margin-top:1rem;"></div>
                </div>
            `;

            const rootSelect = container.querySelector("#triage-root-cause");
            const sevSelect = container.querySelector("#triage-severity");
            const actSelect = container.querySelector("#triage-action");
            const submitBtn = container.querySelector("#btn-submit-triage");
            const feedbackEl = container.querySelector("#triage-feedback");

            if (submitBtn) {
                submitBtn.addEventListener("click", () => {
                    triageData.rootCause = rootSelect.value;
                    triageData.severity = sevSelect.value;
                    triageData.action = actSelect.value;

                    const isRootOk = triageData.rootCause === 'logic';
                    const isSevOk = triageData.severity === 'high';
                    const isActOk = triageData.action === 'bug_to_test';

                    if (isRootOk && isSevOk && isActOk) {
                        feedbackEl.innerHTML = `
                            <div style="background:rgba(16,185,129,0.15);border:1px solid #10b981;border-radius:8px;padding:1rem;">
                                <div style="font-weight:700;color:#34d399;font-size:1rem;margin-bottom:0.4rem;">
                                    🎉 ¡Dictamen de Triage Correcto (100%)!
                                </div>
                                <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:0.5rem;">
                                    Clasificaste con precisión profesional:
                                </p>
                                <ul style="font-size:0.82rem;color:#a7f3d0;line-height:1.6;margin-left:1.25rem;">
                                    <li><strong>Causa Raíz:</strong> Un <code>KeyError</code> no controlado en FastAPI/Flask tumba el proceso arrojando 500 en lugar de un 422 Unprocessable Entity bien estructurado.</li>
                                    <li><strong>Severidad:</strong> Alta, pues un cliente que envíe un JSON malformado puede causar inestabilidad en el servidor.</li>
                                    <li><strong>Acción Ética QA:</strong> Jamás modificar el assert ni apagar el test con skip; se documenta el bug para que desarrollo agregue la validación Pydantic / Marshmallow.</li>
                                </ul>
                            </div>
                        `;
                        if (window.GAMIFICATION) {
                            window.GAMIFICATION.addXP(80, "Diagnóstico & Triage de Defectos completado");
                        }
                        if (window.TestingSession) {
                            window.TestingSession.recordSimulator('sim-triage', 4, 4, 'Triage de defecto en CI completado: Causa Lógica, Severidad Alta, Bug-to-Test.');
                        }
                        SIMULATORS.updateCompletionCounter();
                        if (typeof confetti !== "undefined") confetti({ particleCount: 70, spread: 60 });
                    } else {
                        let errors = [];
                        if (!isRootOk) errors.push("Causa raíz incorrecta: no es red ni test defectuoso; el traceback muestra un KeyError real en el servicio.");
                        if (!isSevOk) errors.push("Severidad incorrecta: un código HTTP 500 no capturado en producción es de severidad Alta/Crítica.");
                        if (!isActOk) errors.push("Acción incorrecta: nunca se apaga un test ni se acomoda el assert a 500; se exige corregir el defecto.");

                        feedbackEl.innerHTML = `
                            <div style="background:rgba(239,68,68,0.12);border:1px solid #ef4444;border-radius:8px;padding:1rem;">
                                <div style="font-weight:700;color:#f87171;font-size:0.95rem;margin-bottom:0.3rem;">
                                    ⚠️ Revisa tu análisis de calidad:
                                </div>
                                <ul style="font-size:0.82rem;color:#fca5a5;line-height:1.5;margin-left:1.25rem;">
                                    ${errors.map(e => `<li>${e}</li>`).join("")}
                                </ul>
                            </div>
                        `;
                        if (window.TestingSession) {
                            window.TestingSession.recordSimulator('sim-triage', 1, 4, 'Intento de triage en revisión.');
                        }
                    }
                });
            }
        };

        render();
    },


    renderPyramidBuilder() {
        const container = document.querySelector(".sim-pyramid-container");
        if (!container) return;
        container.innerHTML = `
            <p style="color:var(--text-muted);margin-bottom:1rem;">Arrastra cada tipo de prueba a la capa que normalmente ofrece la retroalimentación adecuada. La forma no impone porcentajes universales.</p>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem;" id="pyramid-items">
                <div class="draggable" draggable="true" data-type="unit" data-correct="bottom" style="padding:0.5rem 1rem;background:var(--glass-bg);border-radius:8px;cursor:grab;">Unit Test</div>
                <div class="draggable" draggable="true" data-type="integration" data-correct="middle" style="padding:0.5rem 1rem;background:var(--glass-bg);border-radius:8px;cursor:grab;">Integration</div>
                <div class="draggable" draggable="true" data-type="e2e" data-correct="top" style="padding:0.5rem 1rem;background:var(--glass-bg);border-radius:8px;cursor:grab;">E2E</div>
            </div>
            <div id="pyramid" style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;">
                <div data-level="top" style="width:120px;height:50px;background:rgba(244,63,94,0.2);border:2px dashed rgba(244,63,94,0.5);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:0.8rem;color:var(--text-muted);">Pocos E2E críticos</div>
                <div data-level="middle" style="width:240px;height:50px;background:rgba(245,158,11,0.2);border:2px dashed rgba(245,158,11,0.5);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:0.8rem;color:var(--text-muted);">Integración y contrato</div>
                <div data-level="bottom" style="width:360px;height:50px;background:rgba(16,185,129,0.2);border:2px dashed rgba(16,185,129,0.5);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:0.8rem;color:var(--text-muted);">Base rápida de unidad</div>
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
                            resultEl.innerHTML = '<div style="color:#10b981;font-weight:600;padding:0.5rem;background:rgba(16,185,129,0.15);border-radius:6px;">Capas ubicadas. Ahora justifica la mezcla según riesgos, arquitectura y tiempo de retroalimentación.</div>';
                        }
                        if (window.TestingSession) {
                            window.TestingSession.recordSimulator('sim-pyramid', 50, 50, 'Capas ubicadas; la proporción queda por justificar según el contexto.');
                        }
                        SIMULATORS.updateCompletionCounter();
                    }
                } else {
                    slot.style.background = "rgba(244,63,94,0.4)";
                    slot.textContent = "Incorrecto - intenta de nuevo";
                    setTimeout(() => { slot.style.background = ""; slot.textContent = slot.dataset.level === "top" ? "Pocos E2E críticos" : slot.dataset.level === "middle" ? "Integración y contrato" : "Base rápida de unidad"; }, 1500);
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
                SIMULATORS.updateCompletionCounter();
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
            { q: "¿Qué criterio orienta la mezcla de niveles de prueba?", opts: ["Un porcentaje universal", "El riesgo, la arquitectura y la retroalimentación", "La cantidad de archivos", "La herramienta más nueva"], correct: 1 },
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
                SIMULATORS.updateCompletionCounter();
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
                title: "Preparar entorno y datos reproducibles",
                tool: "Versiones / dependencias / datos",
                icon: "🧰",
                tag: "Preparación",
                desc: "Fija versión, dependencias, configuración no sensible y datos controlados antes de comparar resultados.",
                rationale: "Paso 1: sin un punto de partida identificable, un fallo puede pertenecer al entorno y no al producto."
            },
            {
                id: 2,
                order: 2,
                title: "Comprobaciones estáticas",
                tool: "Sintaxis / formato / análisis",
                icon: "🔎",
                tag: "Retroalimentación temprana",
                desc: "Detecta errores de sintaxis, formato y patrones conocidos sin ejecutar el comportamiento completo.",
                rationale: "Paso 2: son comprobaciones rápidas; sus hallazgos orientan, pero no sustituyen pruebas dinámicas."
            },
            {
                id: 3,
                order: 3,
                title: "Pruebas unitarias de lógica",
                tool: "pytest / Vitest / JUnit 5",
                icon: "⚡",
                tag: "Reglas aisladas",
                desc: "Comprueba reglas pequeñas con entradas controladas y sin operaciones pesadas de entrada o salida.",
                rationale: "Paso 3: una base rápida detecta contradicciones de lógica antes de llegar a conexiones más costosas."
            },
            {
                id: 4,
                order: 4,
                title: "Pruebas de integración y contrato",
                tool: "API / base de datos / adaptadores",
                icon: "🔌",
                tag: "Conexiones reales o controladas",
                desc: "Comprueba que componentes, contratos y persistencia producen el resultado y el efecto esperado.",
                rationale: "Paso 4: después de la lógica aislada se revisan las fronteras donde los componentes intercambian información."
            },
            {
                id: 5,
                order: 5,
                title: "Recorridos E2E críticos",
                tool: "Playwright",
                icon: "🎭",
                tag: "Objetivos de usuario",
                desc: "Recorre en navegador los pocos objetivos completos cuyo riesgo justifica mayor costo y mantenimiento.",
                rationale: "Paso 5: confirma conexiones visibles del flujo; no repite en navegador cada detalle ya cubierto abajo."
            },
            {
                id: 6,
                order: 6,
                title: "Comprobaciones según el riesgo",
                tool: "Accesibilidad / seguridad / rendimiento",
                icon: "🛡️",
                tag: "Calidad no funcional",
                desc: "Ejecuta las comprobaciones no funcionales pertinentes con entorno, métrica y umbral contextualizados.",
                rationale: "Paso 6: el dominio decide qué riesgos requieren una medición especializada antes de avanzar."
            },
            {
                id: 7,
                order: 7,
                title: "Compuerta: evidencia y decisión",
                tool: "Pipeline CI/CD Automatizado",
                icon: "🚀",
                tag: "Publicar o detener",
                desc: "Consolida resultados, conserva artefactos y aplica los criterios acordados para publicar, advertir o detener.",
                rationale: "Paso 7: la automatización informa; una persona o política responsable acepta el riesgo residual."
            }
        ];

        let currentSlots = Array(7).fill(null);
        let pool = [...phases].sort(() => Math.random() - 0.5);

        const render = () => {
            container.innerHTML = `
                <div class="sim-sequencer-wrapper">
                    <p style="color:var(--text-muted);margin-bottom:1rem;font-size:0.95rem;">
                        <strong>Misión del aprendiz:</strong> ordena una ejecución típica de integración continua para obtener retroalimentación temprana y terminar con una decisión sustentada. El orden puede ajustarse si el riesgo o la arquitectura lo justifican.
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
                        SIMULATORS.updateCompletionCounter();
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
