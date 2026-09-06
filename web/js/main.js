const APP = {
    currentPage: 'welcome',

    init() {
        this.initSidebar();
        this.initSearch();
        this.initProgressTracking();
        this.initCopyButtons();
        this.initParticles();
        this.initScrollAnimations();
        this.initRouting();
        GAMIFICATION.renderStats();
        GAMIFICATION.updateSidebarBadges();
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
        }
    },

    initSidebar() {
        const toggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        if (toggle && sidebar) {
            toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
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
            this.currentPage = pageId;
            this.updateBreadcrumb(pageId);
            this.updateSidebarActive(pageId);
            if (updateHash && window.location.hash !== '#' + pageId) {
                if (history.pushState) {
                    history.pushState(null, null, '#' + pageId);
                } else {
                    window.location.hash = pageId;
                }
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
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

    updateBreadcrumb(pageId) {
        const breadcrumb = document.getElementById('breadcrumb-current');
        if (breadcrumb) {
            const names = {
                'welcome': 'Inicio',
                'm-reflexion': 'Reflexión',
                'm-piramide': 'Pirámide de Testing',
                'm-pytest-fastapi': 'PyTest FastAPI',
                'm-pytest-flask': 'PyTest Flask',
                'm-jest-react': 'Jest React',
                'm-junit-jsp': 'JUnit JSP',
                'm-tdd': 'TDD',
                'm-bdd': 'BDD',
                'm-playwright': 'Playwright E2E',
                'm-cobertura': 'Cobertura',
                'm-cicd': 'CI/CD',
                'm-observabilidad': 'Observabilidad Coolify',
                'm-reto': 'Reto Final',
                'm-ia-testing': 'IA en Testing',
                'm-simuladores': 'Simuladores',
                'descargar': 'Descargar Proyecto'
            };
            breadcrumb.textContent = names[pageId] || pageId;
        }
    },

    initSearch() {
        const searchInput = document.getElementById('sidebar-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                document.querySelectorAll('.nav-item').forEach(item => {
                    const text = item.textContent.toLowerCase();
                    item.style.display = text.includes(query) ? '' : 'none';
                });
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
            modal.style.display = 'flex';
            if (window.confetti) {
                confetti({ particleCount: 300, spread: 160, origin: { y: 0.5 } });
                setTimeout(() => confetti({ particleCount: 200, spread: 120, origin: { y: 0.6 } }), 500);
                setTimeout(() => confetti({ particleCount: 100, spread: 80, origin: { y: 0.7 } }), 1000);
            }
        }
    },

    closeVictoryModal() {
        const modal = document.getElementById('victory-modal');
        if (modal) modal.style.display = 'none';
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
    }
};

window.APP = APP;
document.addEventListener('DOMContentLoaded', () => APP.init());

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
