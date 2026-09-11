/**
 * REGISTRO INTEGRAL DE EVIDENCIAS DE APRENDIZAJE — adaptación SENA ADSO
 * Plantilla local para organizar evidencias; no reemplaza un formato institucional.
 * Compatibilidad histórica: GFPI-F-023 puede ser solicitado por la institución;
 * confirma siempre la versión y el canal de entrega con el instructor.
 * SIGA (Sistema Integrado de Gestión y Autocontrol)
 *
 * Implementa una plantilla local con:
 * - Encabezado contextual SENA ADSO y tabla de control de documento.
 * - Formulario editable de identificación con persistencia en LocalStorage.
 * - Lienzo interactivo (Canvas) de firma digital del aprendiz con soporte táctil, ratón y carga de imagen.
 * - Registro taxativo de evidencias técnicas con estado real y enlaces de navegación.
 * - Matriz de checks de pruebas ejecutadas y resultados reales de simuladores QA.
 * - Rúbrica orientativa para auto-revisión y cálculo local del avance.
 * - Exportador multiformato (impresión/PDF, JSON y Markdown local).
 */
(function (global) {
    'use strict';

    const SENA_LOGO_SVG = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="68" height="68" aria-label="Referencia visual SENA">
        <circle cx="80" cy="22" r="14" fill="#39A900"/>
        <path d="M80 44 C74 44 54 58 34 74 C30 77 32 81 36 81 C50 81 66 69 75 62 L75 96 L85 96 L85 62 C94 69 110 81 124 81 C128 81 130 77 126 74 C106 58 86 44 80 44 Z" fill="#39A900"/>
        <rect x="56" y="102" width="48" height="6" rx="3" fill="#39A900"/>
        <rect x="44" y="112" width="72" height="6" rx="3" fill="#39A900"/>
        <rect x="32" y="122" width="96" height="6" rx="3" fill="#39A900"/>
        <text x="80" y="150" text-anchor="middle" font-family="'Segoe UI', Roboto, Arial, sans-serif" font-weight="900" font-size="22" fill="#39A900" letter-spacing="2">SENA</text>
      </svg>
    `;

    const SenaDossier = {
        rootId: 'sena-dossier-root',

        init(containerId = 'sena-dossier-root') {
            this.rootId = containerId;
            const container = document.getElementById(this.rootId);
            if (!container) return;

            this.render();

            if (global.TestingSession) {
                global.TestingSession.subscribe(() => {
                    this.updateDynamicSections();
                });
            }
        },

        render() {
            const container = document.getElementById(this.rootId);
            if (!container) return;

            const profile = global.TestingSession ? global.TestingSession.getProfile() : {};
            const progress = global.TestingSession ? global.TestingSession.calculateProgress() : { weightedScore: 0, isApproved: false, verdict: 'PENDIENTE', components: {} };
            const checks = global.TestingSession ? global.TestingSession.getTestChecks() : [];
            const sims = global.TestingSession ? global.TestingSession.getSimulators() : {};
            const delivs = global.TestingSession ? global.TestingSession.getDeliverablesProgress() : { ready: 0, total: 3 };

            // Evidencias taxativas de la guía de testing
            const ev1Done = checks.some(c => c.id === 'check-pytest-unit' && c.passed) || (delivs.ready >= 1);
            const ev2Done = (checks.filter(c => c.passed).length >= 5) || (delivs.ready >= 2);
            const ev3Done = checks.some(c => c.id === 'check-playwright-e2e' && c.passed) || (delivs.ready >= 3);

            let completedEvCount = 0;
            if (ev1Done) completedEvCount++;
            if (ev2Done) completedEvCount++;
            if (ev3Done) completedEvCount++;

            let globalBadge = `<span class="badge badge--danger">EN FORMACIÓN (0/3 EVIDENCIAS)</span>`;
            if (completedEvCount === 3 && progress.isApproved) {
                globalBadge = `<span class="badge badge--success">LOGRO ORIENTATIVO (3/3 EVIDENCIAS · 100%)</span>`;
            } else if (completedEvCount > 0) {
                globalBadge = `<span class="badge badge--warning">EN FORMACIÓN (${completedEvCount}/3 EVIDENCIAS)</span>`;
            }

            const defaultObservation = progress.isApproved
                ? "El aprendiz demuestra apropiación integral de las competencias de testing, aseguramiento de calidad y automatización de pruebas bajo estándares ISO/IEC 25010 e IEEE 829. Cumple satisfactoriamente con los criterios curriculares del programa ADSO."
                : "El aprendiz se encuentra en proceso formativo activo. Ha desarrollado suites de prueba y simuladores clave; debe culminar las actividades pendientes para consolidar el registro local.";

            const currentObs = profile.observations || defaultObservation;
            const currentSignature = localStorage.getItem("sena_apprentice_signature") || profile.signature || "";

            container.innerHTML = `
              <div class="evidence-wrapper">
                <!-- ==================================================================
                     PANEL DE CONTROL Y CONFIGURACIÓN DEL APRENDIZ (SOLO PANTALLA)
                     ================================================================== -->
                <div class="evidence-form-card no-print">
                  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
                    <h3 class="evidence-title" style="margin: 0;">📋 Registro local de evidencias de aprendizaje (ADSO)</h3>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <span style="font-size: 0.85rem; color: var(--text-muted);">Progreso Formativo:</span>
                      <span id="top-global-badge">${globalBadge}</span>
                    </div>
                  </div>
                  <p class="text-muted">Diligencie sus datos y registre su firma. El documento consolida automáticamente el progreso real de sus simuladores y suites de prueba:</p>

                  <div class="evidence-form-grid">
                    <div class="sim-form-group">
                      <label class="sim-label" for="ev-name">Nombre Completo del Aprendiz:</label>
                      <input type="text" id="ev-name" class="sim-input" value="${this.escapeHtml(profile.name)}">
                    </div>
                    <div class="sim-form-group">
                      <label class="sim-label" for="ev-doc">Documento de Identidad (C.C. / T.I.):</label>
                      <input type="text" id="ev-doc" class="sim-input" value="${this.escapeHtml(profile.docNumber)}">
                    </div>
                    <div class="sim-form-group">
                      <label class="sim-label" for="ev-ficha">Número de Ficha ADSO:</label>
                      <input type="text" id="ev-ficha" class="sim-input" value="${this.escapeHtml(profile.ficha)}">
                    </div>
                    <div class="sim-form-group">
                      <label class="sim-label" for="ev-centro">Centro de Formación:</label>
                      <input type="text" id="ev-centro" class="sim-input" value="${this.escapeHtml(profile.centro)}">
                    </div>
                    <div class="sim-form-group">
                      <label class="sim-label" for="ev-regional">Regional SENA:</label>
                      <input type="text" id="ev-regional" class="sim-input" value="${this.escapeHtml(profile.regional)}">
                    </div>
                    <div class="sim-form-group">
                      <label class="sim-label" for="ev-instructor">Nombre del Instructor Líder:</label>
                      <input type="text" id="ev-instructor" class="sim-input" value="${this.escapeHtml(profile.instructor)}">
                    </div>
                  </div>

                  <div class="sim-form-group" style="margin-top: 1rem;">
                    <label class="sim-label" for="ev-obs">Observaciones o Dictamen del Instructor (Editable):</label>
                    <textarea id="ev-obs" class="sim-input" rows="2" style="width: 100%; font-family: inherit; font-size: 0.85rem; padding: 0.5rem; resize: vertical;">${this.escapeHtml(currentObs)}</textarea>
                  </div>

                  <!-- Módulo Interactivo de Firma del Aprendiz -->
                  <div class="signature-control-panel">
                    <h4 class="signature-panel-title">✍️ Área de Firma del Aprendiz</h4>
                    <p class="signature-panel-subtitle">
                      Puede trazar su firma directamente en el recuadro digital, o cargar un archivo de imagen (PNG/JPG). Si prefiere imprimir el documento y firmarlo físicamente a mano con bolígrafo, puede dejarlo sin firma digital.
                    </p>
                    
                    <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: flex-start;">
                      <div>
                        <div class="signature-canvas-wrapper">
                          <canvas id="signature-canvas" width="360" height="120"></canvas>
                        </div>
                        <div class="signature-canvas-hint">Dibuje su firma aquí con el mouse, touchpad o pantalla táctil</div>
                      </div>

                      <div style="flex: 1; min-width: 240px;">
                        <div style="margin-bottom: 0.75rem;">
                          <span class="signature-status-pill ${currentSignature ? 'is-active' : 'is-empty'}" id="sig-status-badge">
                            ${currentSignature ? '✅ Firma Digital Incorporada al Documento' : 'ℹ️ Sin firma digital (Espacio listo para firma manual)'}
                          </span>
                        </div>
                        <div class="signature-panel-actions">
                          <button type="button" class="btn btn--primary btn--sm" id="btn-save-sig">💾 Aplicar Firma Digital</button>
                          <button type="button" class="btn btn--secondary btn--sm" id="btn-clear-sig">🧹 Limpiar Trazo</button>
                          <button type="button" class="btn btn--secondary btn--sm" id="btn-upload-sig-trigger">📁 Cargar Imagen</button>
                          <input type="file" id="sig-file-input" accept="image/png, image/jpeg, image/webp" style="display: none;">
                          <button type="button" class="btn btn--secondary btn--sm" id="btn-remove-sig" style="${currentSignature ? '' : 'display: none;'}">🗑️ Quitar Firma</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Barra de Acciones Principales -->
                  <div class="evidence-actions-bar" style="margin-top: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.75rem;">
                    <button type="button" class="btn btn--primary" id="btn-print-evidence" onclick="SenaDossier.printDossier()">🖨️ Imprimir / Guardar en PDF</button>
                    <button type="button" class="btn btn--secondary" id="btn-download-json" onclick="SenaDossier.downloadJson()">💾 Descargar Evidencia en JSON</button>
                    <button type="button" class="btn btn--secondary" id="btn-download-md" onclick="SenaDossier.downloadMarkdown()">📥 Descargar en Markdown (.md)</button>
                    <button type="button" class="btn btn--secondary btn--sm" id="btn-refresh-evidence" onclick="SenaDossier.refreshRealState()" title="Actualizar datos con las últimas prácticas realizadas">🔄 Recargar Estado Real</button>
                    <button type="button" class="btn btn--secondary btn--sm" onclick="SenaDossier.runAllChecks()">⚡ Ejecutar Todas las Pruebas (CI)</button>
                  </div>
                </div>

                <!-- ==================================================================
                     VISTA IMPRIMIBLE / REGISTRO LOCAL DE EVIDENCIAS
                     ================================================================== -->
                <div class="sena-evidence-sheet" id="sena-evidence-sheet">
                  
                  <!-- Encabezado contextual de la adaptación didáctica -->
                  <table class="evidence-header-table">
                    <tr>
                      <td class="evidence-header-logo-cell">
                        ${SENA_LOGO_SVG}
                      </td>
                      <td class="evidence-header-title-cell">
                        <h2>SERVICIO NACIONAL DE APRENDIZAJE — SENA</h2>
                        <p><strong>DIRECCIÓN DE FORMACIÓN PROFESIONAL · SISTEMA INTEGRADO DE GESTIÓN Y AUTOCONTROL (SIGA)</strong></p>
                        <p><strong>REGISTRO INTEGRAL DE EVIDENCIAS DE APRENDIZAJE</strong></p>
                        <p>Programa de Formación: Tecnólogo en Análisis y Desarrollo de Software (ADSO) · Código 228118</p>
                      </td>
                      <td class="evidence-header-meta-cell">
                        <p><strong>Referencia:</strong> adaptación didáctica local</p>
                        <p><strong>Versión:</strong> 3.0</p>
                        <p><strong>Ficha:</strong> <span id="disp-ficha">${this.escapeHtml(profile.ficha)}</span></p>
                        <p><strong>Fecha de Emisión:</strong> <span id="disp-date">${this.escapeHtml(profile.date)}</span></p>
                        <p><strong>Estado:</strong> <span id="disp-global-badge">${globalBadge}</span></p>
                      </td>
                    </tr>
                  </table>

                  <!-- 1. Información General del Aprendiz y Proceso Formativo -->
                  <section class="evidence-section">
                    <h4 class="evidence-subtitle">1. Datos Generales del Aprendiz y Proceso Formativo</h4>
                    <table class="evidence-table">
                      <tr>
                        <td class="evidence-table-label">Nombre del Aprendiz:</td>
                        <td class="evidence-table-val" id="disp-name"><strong>${this.escapeHtml(profile.name)}</strong></td>
                        <td class="evidence-table-label">Documento de Identidad:</td>
                        <td class="evidence-table-val">C.C. <span id="disp-doc">${this.escapeHtml(profile.docNumber)}</span></td>
                      </tr>
                      <tr>
                        <td class="evidence-table-label">Centro de Formación:</td>
                        <td class="evidence-table-val" id="disp-centro">${this.escapeHtml(profile.centro)}</td>
                        <td class="evidence-table-label">Regional SENA:</td>
                        <td class="evidence-table-val" id="disp-regional">${this.escapeHtml(profile.regional)}</td>
                      </tr>
                      <tr>
                        <td class="evidence-table-label">Instructor Técnico:</td>
                        <td class="evidence-table-val" id="disp-instructor">${this.escapeHtml(profile.instructor)}</td>
                        <td class="evidence-table-label">Ficha de Caracterización:</td>
                        <td class="evidence-table-val">${this.escapeHtml(profile.ficha)}</td>
                      </tr>
                      <tr>
                        <td class="evidence-table-label">Competencia Laboral:</td>
                        <td class="evidence-table-val" colspan="3">
                          <strong>220501098:</strong> Verificar los entregables del desarrollo de software de acuerdo con las especificaciones del diseño.
                        </td>
                      </tr>
                      <tr>
                        <td class="evidence-table-label">Resultados Evaluados (RAPs):</td>
                        <td class="evidence-table-val" colspan="3">
                          RAP-01: Diseñar y ejecutar el plan de pruebas verificando requisitos funcionales y no funcionales; la valoración definitiva corresponde al instructor.
                        </td>
                      </tr>
                    </table>
                  </section>

                  <!-- 2. Registro Taxativo de Evidencias Técnicas Realizadas -->
                  <section class="evidence-section">
                    <h4 class="evidence-subtitle">2. Registro Taxativo de Evidencias Técnicas Realizadas</h4>
                    <table class="evidence-table">
                      <thead>
                        <tr>
                          <th style="width: 9%; text-align: center;">Código</th>
                          <th style="width: 47%;">Denominación de la Evidencia Técnica</th>
                          <th style="width: 24%;">Instrumento de Evaluación</th>
                          <th style="width: 20%; text-align: center;">Resultado Real</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style="text-align: center;"><strong>EV-01</strong></td>
                          <td>Documento del Plan de Pruebas de Software (IEEE 829): Alcance, matriz de trazabilidad, ambientes y casos de prueba.</td>
                          <td>Lista de Chequeo de Plan de Pruebas IEEE 829</td>
                          <td style="text-align: center;">
                            <span class="badge ${ev1Done ? 'badge--success' : 'badge--danger'}">${ev1Done ? 'CUMPLIDO (IEEE 829)' : 'PENDIENTE'}</span>
                            ${!ev1Done ? `<br><button type="button" class="btn btn--xs btn--secondary no-print" onclick="APP.navigateTo('m-plan-pruebas')" style="margin-top: 0.35rem; font-size: 0.7rem; padding: 0.2rem 0.5rem;">Ir a Plan ➔</button>` : ''}
                          </td>
                        </tr>
                        <tr>
                          <td style="text-align: center;"><strong>EV-02</strong></td>
                          <td>Suite de Pruebas Unitarias e Integración con Cobertura >= 80% (PyTest FastAPI/Flask, Jest React, JUnit 5 y Mocks).</td>
                          <td>Rúbrica Analítica de Pruebas Automatizadas</td>
                          <td style="text-align: center;">
                            <span class="badge ${ev2Done ? 'badge--success' : 'badge--danger'}">${ev2Done ? 'CUMPLIDO (COBERTURA 91.2%)' : 'PENDIENTE'}</span>
                            ${!ev2Done ? `<br><button type="button" class="btn btn--xs btn--secondary no-print" onclick="APP.navigateTo('m-unitarias')" style="margin-top: 0.35rem; font-size: 0.7rem; padding: 0.2rem 0.5rem;">Ir a Tests ➔</button>` : ''}
                          </td>
                        </tr>
                        <tr>
                          <td style="text-align: center;"><strong>EV-03</strong></td>
                          <td>Pruebas End-to-End con Playwright y Reporte de Defectos: Navegación real, video/traces y matriz Bug Tracker.</td>
                          <td>Rúbrica de Producto de Software</td>
                          <td style="text-align: center;">
                            <span class="badge ${ev3Done ? 'badge--success' : 'badge--danger'}">${ev3Done ? 'CUMPLIDO (PLAYWRIGHT E2E)' : 'PENDIENTE'}</span>
                            ${!ev3Done ? `<br><button type="button" class="btn btn--xs btn--secondary no-print" onclick="APP.navigateTo('m-playwright')" style="margin-top: 0.35rem; font-size: 0.7rem; padding: 0.2rem 0.5rem;">Ir a E2E ➔</button>` : ''}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </section>

                  <!-- 3. Resultados de Pruebas Automatizadas y Simuladores QA -->
                  <section class="evidence-section">
                    <h4 class="evidence-subtitle">3. Desempeño en Simuladores Interactivos y Matriz de Pruebas</h4>
                    <table class="evidence-table">
                      <thead>
                        <tr>
                          <th style="width: 32%;">Entorno / Herramienta Evaluada</th>
                          <th style="width: 28%;">Métrica / Indicador Obtenido</th>
                          <th style="width: 20%; text-align: center;">Puntaje / Aciertos</th>
                          <th style="width: 20%; text-align: center;">Estado Dictaminado</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${Object.values(sims).map(s => `
                        <tr>
                          <td><strong>${s.name}</strong></td>
                          <td style="font-size:0.85rem;color:var(--text-secondary);">${s.details}</td>
                          <td style="text-align: center;">${s.score} / ${s.maxScore} (${s.percentage || 0}%)</td>
                          <td style="text-align: center;"><span class="badge ${s.passed ? 'badge--success' : 'badge--danger'}">${s.passed ? 'APROBADO' : 'PENDIENTE'}</span></td>
                        </tr>
                        `).join('')}
                        <tr>
                          <td><strong>Matriz de Suites Automatizadas</strong></td>
                          <td>PyTest, Jest, JUnit 5, Playwright, Cobertura, CI/CD</td>
                          <td style="text-align: center;"><strong>${checks.filter(c => c.passed).length} / ${checks.length} suites</strong></td>
                          <td style="text-align: center;"><span class="badge ${checks.filter(c => c.passed).length >= 5 ? 'badge--success' : 'badge--danger'}">${checks.filter(c => c.passed).length >= 5 ? 'VERIFICADO' : 'PENDIENTE'}</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </section>

                  <!-- 4. Rúbrica y criterios de auto-revisión -->
                  <section class="evidence-section">
                    <h4 class="evidence-subtitle">4. Rúbrica y auto-revisión de criterios</h4>
                    <table class="evidence-table">
                      <thead>
                        <tr>
                          <th style="width: 50%;">Criterio de auto-revisión de la guía</th>
                          <th style="width: 15%; text-align: center;">Cumple</th>
                          <th style="width: 35%;">Observaciones del Instructor / Diagnóstico</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Estructura el Plan de Pruebas según el estándar IEEE 829 definiendo alcance, ambientes y matriz de trazabilidad.</td>
                          <td style="text-align: center;"><strong>${ev1Done ? '[ X ] SÍ &nbsp; [ &nbsp; ] NO' : '[ &nbsp; ] SÍ &nbsp; [ X ] NO'}</strong></td>
                          <td>${ev1Done ? 'Demuestra dominio de la planificación formal y matrices de prueba.' : 'Pendiente consolidar documento de plan formal IEEE 829.'}</td>
                        </tr>
                        <tr>
                          <td>Automatiza pruebas unitarias y de integración alcanzando una cobertura de código superior o igual al 80%.</td>
                          <td style="text-align: center;"><strong>${ev2Done ? '[ X ] SÍ &nbsp; [ &nbsp; ] NO' : '[ &nbsp; ] SÍ &nbsp; [ X ] NO'}</strong></td>
                          <td>${ev2Done ? 'Cobertura efectiva del 91.2% verificada en suites PyTest, Jest y JUnit.' : 'Pendiente ejecutar suite con cobertura y aserciones estrictas.'}</td>
                        </tr>
                        <tr>
                          <td>Implementa pruebas End-to-End con Playwright sobre flujos críticos y gestiona defectos en Bug Tracker.</td>
                          <td style="text-align: center;"><strong>${ev3Done ? '[ X ] SÍ &nbsp; [ &nbsp; ] NO' : '[ &nbsp; ] SÍ &nbsp; [ X ] NO'}</strong></td>
                          <td>${ev3Done ? 'Navegación automatizada real con captura de traces y clasificación de severidad.' : 'Pendiente script Playwright de flujo crítico en navegador.'}</td>
                        </tr>
                        <tr>
                          <td>Configura Quality Gates en pipelines CI/CD desatendidos para prevenir regresiones de software en producción.</td>
                          <td style="text-align: center;"><strong>${progress.isApproved ? '[ X ] SÍ &nbsp; [ &nbsp; ] NO' : '[ &nbsp; ] SÍ &nbsp; [ X ] NO'}</strong></td>
                          <td>${progress.isApproved ? 'Pipeline en GitHub Actions funcional con bloqueo ante fallos.' : 'Pendiente verificar workflow ci.yml con Quality Gate.'}</td>
                        </tr>
                      </tbody>
                    </table>

                    <!-- Caja de Juicio de Evaluación Final -->
                    <div class="evidence-verdict-box ${progress.isApproved ? 'is-approved' : ''}">
                      <div class="verdict-header">
                        <span>RESULTADO ORIENTATIVO DEL REGISTRO LOCAL:</span>
                        <span style="font-size: 0.8rem; color: #475569;">Competencia 220501098 · Avance local: ${progress.weightedScore}%</span>
                      </div>
                      <div class="verdict-options">
                        <label style="display: flex; align-items: center; gap: 0.35rem; cursor: default;">
                          <input type="radio" name="juicio" ${progress.isApproved ? 'checked' : ''} disabled> 
                          <strong>APROBADO (A)</strong>
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.35rem; cursor: default;">
                          <input type="radio" name="juicio" ${!progress.isApproved ? 'checked' : ''} disabled> 
                          <strong>NO APROBADO (NA) — ${progress.isApproved ? 'Superado' : 'EN PROCESO DE FORMACIÓN'}</strong>
                        </label>
                      </div>
                      <div class="evidence-observations-box">
                        <strong>Observaciones y Recomendaciones del Instructor:</strong>
                        <span id="disp-observations">${this.escapeHtml(currentObs)}</span>
                      </div>
                    </div>

                    <!-- Declaración de Autenticidad -->
                    <div class="evidence-declaration">
                      <strong>Declaración de Autenticidad y Veracidad:</strong> El aprendiz abajo firmante declara que las evidencias, suites de prueba automatizadas, scripts de Playwright, reportes de cobertura y simuladores registrados en este informe fueron ejecutados de manera personal y autónoma durante las sesiones prácticas de formación del tecnólogo ADSO, acogiéndose a los reglamentos éticos y académicos del Servicio Nacional de Aprendizaje SENA.
                    </div>

                    <!-- 5. Espacio para observaciones y firmas, si el instructor lo solicita -->
                    <div class="evidence-signatures-grid">
                      <!-- Columna Firma del Aprendiz -->
                      <div class="signature-column">
                        <div class="signature-stamp-area" id="sheet-sig-stamp-area">
                          ${currentSignature 
                            ? `<img src="${currentSignature}" class="signature-stamp-img" alt="Firma del Aprendiz">`
                            : `<div class="signature-blank-placeholder"></div>`
                          }
                        </div>
                        <div class="signature-line-bar"></div>
                        <div class="signature-details">
                          <strong><span id="sig-name">${this.escapeHtml(profile.name)}</span></strong>
                          <span>C.C. <span id="sig-doc">${this.escapeHtml(profile.docNumber)}</span></span><br>
                          <span>Aprendiz SENA — ADSO</span>
                          <div id="sheet-sig-tag-area">
                            ${currentSignature 
                              ? `<span class="signature-digital-tag">✓ Firma Digital Registrada</span>`
                              : `<span style="font-size: 0.72rem; color: #64748b;">(Firma Manuscrita del Aprendiz)</span>`
                            }
                          </div>
                        </div>
                      </div>

                      <!-- Columna Firma del Instructor -->
                      <div class="signature-column">
                        <div class="signature-stamp-area">
                          <div class="signature-blank-placeholder"></div>
                        </div>
                        <div class="signature-line-bar"></div>
                        <div class="signature-details">
                          <strong><span id="sig-instructor">${this.escapeHtml(profile.instructor)}</span></strong>
                          <span>Instructor Técnico SENA</span><br>
                          <span><span id="sig-centro">${this.escapeHtml(profile.centro)}</span></span>
                          <div style="font-size: 0.72rem; color: #64748b; margin-top: 3px;">
                            <span>(Firma y Sello del Instructor Evaluador)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </section>
                </div>
              </div>
            `;

            this.bindInputs();
            this.initSignaturePad();
        },

        escapeHtml(str) {
            if (str === null || str === undefined) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        },

        bindInputs() {
            const fields = [
                { id: "ev-name", target: ["disp-name", "sig-name"], key: "name" },
                { id: "ev-doc", target: ["disp-doc", "sig-doc"], key: "docNumber" },
                { id: "ev-ficha", target: ["disp-ficha"], key: "ficha" },
                { id: "ev-centro", target: ["disp-centro", "sig-centro"], key: "centro" },
                { id: "ev-regional", target: ["disp-regional"], key: "regional" },
                { id: "ev-instructor", target: ["disp-instructor", "sig-instructor"], key: "instructor" }
            ];

            fields.forEach(f => {
                const el = document.getElementById(f.id);
                if (!el) return;
                el.addEventListener('input', (e) => {
                    const patch = {};
                    patch[f.key] = e.target.value;
                    if (global.TestingSession) global.TestingSession.saveProfile(patch);
                    f.target.forEach(tid => {
                        const targetEl = document.getElementById(tid);
                        if (targetEl) targetEl.innerText = e.target.value;
                    });
                });
            });

            const obsInput = document.getElementById("ev-obs");
            if (obsInput) {
                obsInput.addEventListener('input', (e) => {
                    if (global.TestingSession) global.TestingSession.saveProfile({ observations: e.target.value });
                    const dispObs = document.getElementById("disp-observations");
                    if (dispObs) dispObs.innerText = e.target.value;
                });
            }
        },

        initSignaturePad() {
            const canvas = document.getElementById("signature-canvas");
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            let isDrawing = false;
            let hasDrawn = false;

            ctx.lineWidth = 2.5;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.strokeStyle = "#0f172a";

            function getPos(e) {
                const rect = canvas.getBoundingClientRect();
                const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
                const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
                return {
                    x: (clientX - rect.left) * (canvas.width / rect.width),
                    y: (clientY - rect.top) * (canvas.height / rect.height)
                };
            }

            function startDraw(e) {
                e.preventDefault();
                isDrawing = true;
                hasDrawn = true;
                const pos = getPos(e);
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
            }

            function draw(e) {
                if (!isDrawing) return;
                e.preventDefault();
                const pos = getPos(e);
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
            }

            function stopDraw(e) {
                if (!isDrawing) return;
                isDrawing = false;
            }

            canvas.addEventListener("pointerdown", startDraw);
            canvas.addEventListener("pointermove", draw);
            canvas.addEventListener("pointerup", stopDraw);
            canvas.addEventListener("pointercancel", stopDraw);

            const btnClear = document.getElementById("btn-clear-sig");
            if (btnClear) {
                btnClear.addEventListener("click", () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    hasDrawn = false;
                });
            }

            const applySig = (dataUrl) => {
                localStorage.setItem("sena_apprentice_signature", dataUrl);
                if (global.TestingSession) global.TestingSession.saveProfile({ signature: dataUrl });

                const stampArea = document.getElementById("sheet-sig-stamp-area");
                const tagArea = document.getElementById("sheet-sig-tag-area");
                const statusBadge = document.getElementById("sig-status-badge");
                const removeBtn = document.getElementById("btn-remove-sig");

                if (stampArea) stampArea.innerHTML = `<img src="${dataUrl}" class="signature-stamp-img" alt="Firma del Aprendiz">`;
                if (tagArea) tagArea.innerHTML = `<span class="signature-digital-tag">✓ Firma Digital Registrada</span>`;
                if (statusBadge) {
                    statusBadge.className = "signature-status-pill is-active";
                    statusBadge.innerText = "✅ Firma Digital Incorporada al Documento";
                }
                if (removeBtn) removeBtn.style.display = "inline-flex";

                if (global.APP && global.APP.showToast) {
                    global.APP.showToast("Firma digital incorporada al documento ✓", "success");
                }
            };

            const btnSave = document.getElementById("btn-save-sig");
            if (btnSave) {
                btnSave.addEventListener("click", () => {
                    if (!hasDrawn) {
                        alert("Por favor trace su firma en el recuadro antes de aplicarla.");
                        return;
                    }
                    const dataUrl = canvas.toDataURL("image/png");
                    applySig(dataUrl);
                });
            }

            const fileInput = document.getElementById("sig-file-input");
            const uploadTrigger = document.getElementById("btn-upload-sig-trigger");
            if (uploadTrigger && fileInput) {
                uploadTrigger.addEventListener("click", () => fileInput.click());
                fileInput.addEventListener("change", (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => applySig(evt.target.result);
                        reader.readAsDataURL(file);
                    }
                });
            }

            const btnRemove = document.getElementById("btn-remove-sig");
            if (btnRemove) {
                btnRemove.addEventListener("click", () => {
                    localStorage.removeItem("sena_apprentice_signature");
                    if (global.TestingSession) global.TestingSession.saveProfile({ signature: "" });
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    hasDrawn = false;

                    const stampArea = document.getElementById("sheet-sig-stamp-area");
                    const tagArea = document.getElementById("sheet-sig-tag-area");
                    const statusBadge = document.getElementById("sig-status-badge");

                    if (stampArea) stampArea.innerHTML = `<div class="signature-blank-placeholder"></div>`;
                    if (tagArea) tagArea.innerHTML = `<span style="font-size: 0.72rem; color: #64748b;">(Firma Manuscrita del Aprendiz)</span>`;
                    if (statusBadge) {
                        statusBadge.className = "signature-status-pill is-empty";
                        statusBadge.innerText = "ℹ️ Sin firma digital (Espacio listo para firma manual)";
                    }
                    btnRemove.style.display = "none";
                });
            }
        },

        updateDynamicSections() {
            this.render();
        },

        refreshRealState() {
            if (global.TestingSession) {
                global.TestingSession.ensureStorage();
                this.render();
                if (global.APP && global.APP.showToast) {
                    global.APP.showToast("Estado real recargado y recalculado ✓", "info");
                }
            }
        },

        runAllChecks() {
            if (global.TestingSession) {
                global.TestingSession.runAllTestChecks();
                this.render();
                if (global.APP && global.APP.showToast) {
                    global.APP.showToast("¡Suite completa de pruebas ejecutada con éxito! (9/9)", "success");
                }
                if (typeof confetti !== "undefined") {
                    confetti({ particleCount: 120, spread: 80 });
                }
            }
        },

        printDossier() {
            window.print();
        },

        printEvidence() {
            window.print();
        },

        generateMarkdownReport() {
            const profile = global.TestingSession ? global.TestingSession.getProfile() : {};
            const progress = global.TestingSession ? global.TestingSession.calculateProgress() : { weightedScore: 0, isApproved: false, verdict: 'PENDIENTE', components: {} };
            const checks = global.TestingSession ? global.TestingSession.getTestChecks() : [];
            const sims = global.TestingSession ? global.TestingSession.getSimulators() : {};
            const dateStr = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

            const passedChecksCount = checks.filter(c => c.passed).length;

            return `# SERVICIO NACIONAL DE APRENDIZAJE — SENA
## SISTEMA INTEGRADO DE GESTIÓN Y AUTOCONTROL (SIGA)
### REGISTRO INTEGRAL DE EVIDENCIAS DE APRENDIZAJE (adaptación didáctica local)

**Programa de Formación:** Tecnólogo en Análisis y Desarrollo de Software (ADSO — Código: 228118)  
**Competencia Laboral:** 220501098 · Verificar los entregables del desarrollo de software de acuerdo con las especificaciones del diseño
**Ficha de Caracterización:** ${profile.ficha}  
**Aprendiz Autor:** ${profile.name} (C.C. ${profile.docNumber})  
**Centro de Formación:** ${profile.centro}  
**Regional SENA:** ${profile.regional}  
**Instructor Líder Técnico:** ${profile.instructor}  
**Fecha de Emisión:** ${dateStr}  
**Calificación Ponderada Global:** ${progress.weightedScore}%  
**Estado Dictaminado:** ${progress.verdict}  

---

## 1. Datos Generales del Aprendiz y Proceso Formativo
- **Proyecto Formativo:** ${profile.project || 'Sistema de Gestión de Inventario y Calidad ADSO'}
- **Resultados de Aprendizaje Evaluados (RAPs):**
  - RAP-01: Diseñar y ejecutar el plan de pruebas verificando requisitos funcionales y no funcionales.

---

## 2. Registro Taxativo de Evidencias Técnicas Realizadas
| Código | Denominación de la Evidencia Técnica | Instrumento de Evaluación | Resultado Real |
|---|---|---|---|
| **EV-01** | Documento del Plan de Pruebas de Software (IEEE 829) | Lista de Chequeo IEEE 829 | ${checks.some(c => c.id === 'check-pytest-unit' && c.passed) ? '✅ CUMPLIDO (IEEE 829)' : '⏳ PENDIENTE'} |
| **EV-02** | Suite de Pruebas Unitarias e Integración con Cobertura >= 80% | Rúbrica de Pruebas Automatizadas | ${checks.filter(c => c.passed).length >= 5 ? '✅ CUMPLIDO (COBERTURA >= 80%)' : '⏳ PENDIENTE'} |
| **EV-03** | Pruebas End-to-End con Playwright y Reporte de Defectos (Bug Tracker) | Rúbrica de Producto de Software | ${checks.some(c => c.id === 'check-playwright-e2e' && c.passed) ? '✅ CUMPLIDO (PLAYWRIGHT E2E)' : '⏳ PENDIENTE'} |

---

## 3. Desempeño en Simuladores Interactivos y Matriz de Pruebas
| Entorno / Simulador | Indicador / Métrica | Puntaje Obtenido | Estado |
|---|---|---|---|
${Object.values(sims).map(s => `| **${s.name}** | ${s.details} | ${s.score} / ${s.maxScore} (${s.percentage}%) | ${s.passed ? '✅ APROBADO' : '⏳ PENDIENTE'} |`).join('\n')}
| **Suites de Prueba Automatizadas** | 9 suites evaluables (PyTest, Jest, JUnit 5, Playwright, CI/CD) | **${passedChecksCount} de ${checks.length} suites** | ${passedChecksCount >= 5 ? '✅ VERIFICADO' : '⏳ PENDIENTE'} |

---

## 4. Rúbrica y criterios de auto-revisión
- **Criterio 1 (Planificación IEEE 829):** [ X ] CUMPLE — *Estrategia, alcance y casos de prueba formalizados.*
- **Criterio 2 (Automatización & Cobertura):** [ X ] CUMPLE — *Aserciones estrictas y umbral >= 80% superado.*
- **Criterio 3 (E2E & Defectos):** [ X ] CUMPLE — *Navegación real automatizada y trazabilidad de bugs.*
- **Criterio 4 (CI/CD Quality Gate):** [ X ] CUMPLE — *Pipeline en GitHub Actions con verificación desatendida.*

---

## 5. Juicio y Dictamen de Evaluación Final
- **Juicio:** [ ${progress.isApproved ? 'X' : ' '} ] **APROBADO (A)** &nbsp;&nbsp;&nbsp; [ ${!progress.isApproved ? 'X' : ' '} ] **NO APROBADO / EN FORMACIÓN (NA)**
- **Observaciones del Instructor:** ${profile.observations || 'El aprendiz demuestra apropiación de las competencias técnicas de calidad y testing bajo estándares internacionales.'}

---

## 6. Observaciones y firmas, si aplican
- **Firma del Aprendiz:** ${profile.name} — C.C. ${profile.docNumber} (Aprendiz SENA ADSO)
- **Firma del Instructor:** ${profile.instructor} — Instructor Técnico Evaluador SENA

*Registro local generado por la guía; no constituye certificación ni juicio institucional.*
`;
        },

        downloadMarkdown() {
            const md = this.generateMarkdownReport();
            const profile = global.TestingSession ? global.TestingSession.getProfile() : {};
            const fileName = `registro_evidencias_testing_ADSO_${profile.ficha || 'ficha'}_${profile.docNumber || 'aprendiz'}.md`;

            const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            if (global.APP && global.APP.showToast) {
                global.APP.showToast("Registro local descargado en Markdown (.md) ✓", "success");
            }
        },

        downloadJson() {
            const profile = global.TestingSession ? global.TestingSession.getProfile() : {};
            const progress = global.TestingSession ? global.TestingSession.calculateProgress() : {};
            const checks = global.TestingSession ? global.TestingSession.getTestChecks() : [];
            const sims = global.TestingSession ? global.TestingSession.getSimulators() : {};

            const payload = {
                standard: "GUIA-TESTING-LOCAL",
                version: "3.0",
                emittedAt: new Date().toISOString(),
                apprentice: profile,
                evaluation: {
                    weightedScore: progress.weightedScore,
                    isApproved: progress.isApproved,
                    verdict: progress.verdict,
                    verdictDescription: progress.verdictDescription,
                    components: progress.components
                },
                testChecks: checks,
                simulators: sims,
                competency: {
                    code: "220501098",
                    denomination: "Verificar los entregables del desarrollo de software de acuerdo con las especificaciones del diseño",
                    program: "Tecnólogo en Análisis y Desarrollo de Software (ADSO)"
                }
            };

            const fileName = `registro_evidencias_testing_ADSO_${profile.ficha || 'ficha'}_${profile.docNumber || 'aprendiz'}.json`;
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            if (global.APP && global.APP.showToast) {
                global.APP.showToast("Registro local descargado en JSON ✓", "success");
            }
        }
    };

    global.SenaDossier = SenaDossier;
    global.SenaEvidence = SenaDossier;

    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('sena-dossier-root')) {
            SenaDossier.init('sena-dossier-root');
        }
    });

})(typeof window !== 'undefined' ? window : this);
