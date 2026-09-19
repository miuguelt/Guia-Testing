const APP = {
    currentPage: 'welcome',

    init() {
        this.initSidebar();
        this.initSearch();
        this.initProgressTracking();
        this.initCopyButtons();
        this.initProjectDownload();
        this.initParticles();
        this.initScrollAnimations();
        this.initRouting();
        this.initBreadcrumb();
        this.initBackToTop();
        this.initResetProgress();
        this.initPrintHandlers();
        GAMIFICATION.renderStats();
        GAMIFICATION.updateSidebarBadges();
        this.updateSidebarActive(this.currentPage);
    },

    initRouting() {
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.replace(/^#/, '');
            if (hash && hash !== this.currentPage) {
                this.navigateTo(hash, false);
            }
        });
        const initialHash = window.location.hash.replace(/^#/, '');
        if (initialHash && document.getElementById(initialHash)) {
            this.navigateTo(initialHash, false);
            // Algunos navegadores aplican el desplazamiento nativo del ancla
            // después de DOMContentLoaded. En móvil eso dejaba el título bajo
            // la cabecera fija, aun cuando navigateTo ya había vuelto al inicio.
            const resetInitialScroll = () => window.scrollTo({ top: 0, behavior: 'auto' });
            if (document.readyState === 'complete') {
                resetInitialScroll();
            } else {
                window.addEventListener('load', resetInitialScroll, { once: true });
            }
        }
    },

    initSidebar() {
        const toggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        if (toggle && sidebar) {
            toggle.addEventListener('click', () => {
                const abierto = sidebar.classList.toggle('open');
                toggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
            });
        }
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const target = item.getAttribute('href');
                if (target && target.startsWith('#')) {
                    this.navigateTo(target.substring(1));
                    if (window.innerWidth <= 1024) sidebar.classList.remove('open');
                }
            });
        });
    },

    navigateTo(pageId, updateHash = true) {
        document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
        const target = document.getElementById(pageId);
        if (target) {
            target.classList.add('active');
            // Los módulos se renderizan después de cargar el HTML y permanecen
            // ocultos hasta que entran en el viewport. Como el módulo estaba
            // oculto al registrarse en el IntersectionObserver, podía quedar
            // con opacity: 0 aunque su contenido ya existiera en el DOM.
            target.querySelectorAll('.section-card, .simulator-card, .concept-card')
                .forEach((element) => element.classList.add('animate-in'));
            this.currentPage = pageId;
            this.updateBreadcrumb(pageId);
            this.updateSidebarActive(pageId);
            this.announcePage(pageId);
            if (pageId === 'm-evidencias-sena' && window.DevBrainEvidence && typeof window.DevBrainEvidence.refrescarDossier === 'function') {
                window.DevBrainEvidence.refrescarDossier();
            }
            if (updateHash && window.location.hash !== '#' + pageId) {
                if (history.pushState) {
                    history.pushState(null, null, '#' + pageId);
                } else {
                    window.location.hash = pageId;
                }
            }
            window.scrollTo({ top: 0, behavior: updateHash ? 'smooth' : 'auto' });
        }
    },

    navigateToSimulator(simId, targetStation = 'm-simuladores') {
        this.navigateTo(targetStation);

        if (targetStation === 'm-simuladores') {
            const devSims = ['sim-bva', 'sim-tdd', 'sim-doubles', 'sim-e2e'];
            const execSims = ['sim-sequencer', 'sim-pyramid', 'sim-triage'];
            const allSims = ['sim-assertion', 'sim-quiz'];

            let targetTab = 'tab-dev-order';
            if (execSims.includes(simId)) targetTab = 'tab-exec-order';
            else if (allSims.includes(simId)) targetTab = 'tab-all-sims';

            const tabBtn = document.querySelector(`.sim-tab-btn[data-tab="${targetTab}"]`);
            if (tabBtn) tabBtn.click();

            setTimeout(() => {
                const containerClass = `.${simId}-container`;
                const container = document.querySelector(containerClass) || document.getElementById(simId);
                if (container) {
                    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    container.classList.add('sim-highlight-pulse');
                    setTimeout(() => container.classList.remove('sim-highlight-pulse'), 2500);
                }
            }, 180);
        } else {
            setTimeout(() => {
                const container = document.getElementById(simId) ||
                    document.querySelector(`.${simId}-container`) ||
                    document.querySelector('.interactive-challenge, .module-learning-kit, .code-card');
                if (container) {
                    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    container.classList.add('sim-highlight-pulse');
                    setTimeout(() => container.classList.remove('sim-highlight-pulse'), 2500);
                }
            }, 180);
        }
    },

    initPrintHandlers() {
        window.addEventListener('beforeprint', () => {
            document.body.classList.add('printing-dossier');
            if (window.DevBrainEvidence && typeof window.DevBrainEvidence.refrescarDossier === 'function') {
                window.DevBrainEvidence.refrescarDossier();
            }
        });
        window.addEventListener('afterprint', () => {
            document.body.classList.remove('printing-dossier');
        });
    },

    imprimirDossier() {
        this.navigateTo('m-evidencias-sena');
        if (window.DevBrainEvidence && typeof window.DevBrainEvidence.imprimir === 'function') {
            window.DevBrainEvidence.imprimir();
        } else {
            document.body.classList.add('printing-dossier');
            setTimeout(() => {
                window.print();
                setTimeout(() => {
                    document.body.classList.remove('printing-dossier');
                }, 500);
            }, 150);
        }
    },

    showToast(message, type = 'info') {
        let container = document.getElementById('app-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'app-toast-container';
            container.className = 'app-toast-container no-print';
            container.setAttribute('aria-live', 'polite');
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = `app-toast app-toast--${type} no-print`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('app-toast--fade-out');
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }, 3200);
    },

    updateSidebarActive(pageId) {
        document.querySelectorAll('.nav-item').forEach(item => {
            const href = item.getAttribute('href');
            if (href === '#' + pageId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    },

    pageLabels: {
        welcome: 'Inicio',
        'm-simuladores': 'Simuladores',
        'm-evidencias-sena': 'Registro de evidencias',
        descargar: 'Descargar Proyecto'
    },

    getPageTitle(pageId) {
        const modulo = (window.MODULES || {})[pageId];
        return (modulo && modulo.title) || this.pageLabels[pageId] || pageId;
    },

    initBreadcrumb() {
        const root = document.getElementById('breadcrumb-root');
        if (root) {
            root.addEventListener('click', (event) => {
                event.preventDefault();
                this.navigateTo('welcome');
            });
        }
    },

    updateBreadcrumb(pageId) {
        const breadcrumb = document.getElementById('breadcrumb-current');
        if (breadcrumb) {
            breadcrumb.textContent = this.getPageTitle(pageId);
        }
    },

    /** Actualiza el título del documento y lo anuncia en la región aria-live. */
    announcePage(pageId) {
        const titulo = this.getPageTitle(pageId);
        document.title = titulo + ' · Guía Testing QA';
        const announcer = document.getElementById('page-announcer');
        if (announcer) {
            announcer.textContent = '';
            announcer.textContent = 'Sección: ' + titulo;
        }
    },

    initSearch() {
        const searchInput = document.getElementById('sidebar-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                let visibles = 0;
                document.querySelectorAll('.nav-item').forEach(item => {
                    const text = item.textContent.toLowerCase();
                    const mostrar = text.includes(query);
                    item.style.display = mostrar ? '' : 'none';
                    if (mostrar) visibles++;
                });
                const nav = document.querySelector('.sidebar-nav');
                let vacio = document.getElementById('nav-empty-state');
                if (nav && visibles === 0) {
                    if (!vacio) {
                        vacio = document.createElement('div');
                        vacio.id = 'nav-empty-state';
                        vacio.className = 'nav-empty-state';
                        vacio.setAttribute('role', 'status');
                        vacio.style.padding = '0.75rem 1rem';
                        nav.appendChild(vacio);
                    }
                    vacio.textContent = 'Sin resultados para «' + e.target.value + '»';
                } else if (vacio) {
                    vacio.remove();
                }
            });
        }
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (searchInput) searchInput.focus();
            }
        });
    },

    initProgressTracking() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.mark-complete-btn');
            if (btn && !btn.disabled) {
                const moduleId = btn.getAttribute('data-module');
                if (moduleId) {
                    GAMIFICATION.markCompleted(moduleId);
                    btn.textContent = 'Módulo completado ✓';
                    btn.classList.add('completed');
                    btn.disabled = true;
                    this.checkVictory();
                }
            }
        });
    },

    checkVictory() {
        const totalModules = Object.keys(window.MODULES || {}).length;
        const completed = GAMIFICATION.completed.length;
        if (totalModules > 0 && completed >= totalModules) {
            setTimeout(() => this.showVictoryModal(), 500);
        }
    },

    showVictoryModal() {
        const modal = document.getElementById('victory-modal');
        if (modal) {
            document.getElementById('modal-modules').textContent = GAMIFICATION.completed.length;
            document.getElementById('modal-xp').textContent = GAMIFICATION.xp;
            document.getElementById('modal-level').textContent = GAMIFICATION.level;
            this.victoryTrigger = document.activeElement;
            modal.style.display = 'flex';
            const cerrar = document.getElementById('victory-modal-close');
            if (cerrar) cerrar.focus();
            if (!this.victoryListenersInit) {
                this.victoryListenersInit = true;
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && modal.style.display !== 'none') this.closeVictoryModal();
                });
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) this.closeVictoryModal();
                });
            }
        }
    },

    closeVictoryModal() {
        const modal = document.getElementById('victory-modal');
        if (modal) modal.style.display = 'none';
        if (this.victoryTrigger && this.victoryTrigger.focus) this.victoryTrigger.focus();
        this.victoryTrigger = null;
    },

    initBackToTop() {
        const btn = document.getElementById('back-to-top');
        if (!btn) return;
        const suave = !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.scrollY > window.innerHeight * 2);
        }, { passive: true });
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: suave ? 'smooth' : 'auto' }));
    },

    initResetProgress() {
        const btn = document.getElementById('reset-progress');
        if (!btn) return;
        btn.addEventListener('click', () => {
            if (!confirm('¿Reiniciar todo tu progreso? Se borrarán XP, insignias y módulos completados. Esta acción no se puede deshacer.')) return;
            const claves = [];
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && (k.startsWith('guia_testing_') || k.startsWith('fastapi_'))) claves.push(k);
            }
            claves.forEach(k => localStorage.removeItem(k));
            location.reload();
        });
    },
    initCopyButtons() {
        document.querySelectorAll('pre').forEach(pre => {
            if (!pre.querySelector('.copy-btn')) {
                const btn = document.createElement('button');
                btn.className = 'copy-btn';
                btn.textContent = 'Copiar';
                btn.onclick = () => {
                    const code = pre.querySelector('code') ? pre.querySelector('code').textContent : pre.textContent;
                    navigator.clipboard.writeText(code).then(() => {
                        btn.textContent = 'Copiado!';
                        setTimeout(() => btn.textContent = 'Copiar', 2000);
                    });
                };
                pre.style.position = 'relative';
                pre.appendChild(btn);
            }
        });
    },

    initParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 20 + 's';
            p.style.animationDuration = (15 + Math.random() * 10) + 's';
            container.appendChild(p);
        }
    },

    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('animate-in');
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.section-card, .simulator-card, .concept-card').forEach(el => observer.observe(el));
    },

    initProjectDownload() {
        const downloadUrl = resolveProjectDownloadUrl();
        const primaryLink = document.getElementById('download-project-link');
        const downloadLinks = primaryLink
            ? [primaryLink, ...document.querySelectorAll('a[href="downloads/guia-testing-qa.zip"]')]
            : [...document.querySelectorAll('a[href="downloads/guia-testing-qa.zip"]')];
        [...new Set(downloadLinks)].forEach((link) => {
            link.href = downloadUrl;
            link.setAttribute('download', 'guia-testing-qa.zip');
        });
    }
};

window.APP = APP;
document.addEventListener('DOMContentLoaded', () => APP.init());

/**
 * Builds the ZIP URL from the resolved main.js path. This keeps the download
 * working when the static guide is served from a repository subdirectory.
 */
function resolveProjectDownloadUrl() {
    const fallback = 'downloads/guia-testing-qa.zip';
    const mainScript = Array.from(document.scripts).find((script) => /\/js\/main\.js(?:[?#]|$)/.test(script.src));
    if (!mainScript || !mainScript.src) return fallback;
    return new URL('../downloads/guia-testing-qa.zip', mainScript.src).href;
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    setTimeout(() => document.getElementById(tabName).classList.add("active"), 10);
    evt.currentTarget.className += " active";
}
