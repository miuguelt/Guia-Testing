# Web Design Pattern Catalog

Curated memory for topic-focused and educational web experiences. These entries are seeded from the validated Guías ADSO 1–4 and remain subject to re-verification in each new context.

## Status model

- `verified-in-series`: observed and validated across the guide series, but not a universal rule.
- `candidate`: promising observation awaiting reuse and evidence in another context.
- `verified-global`: supported by repeated evidence across unrelated contexts.
- `deprecated`: do not reuse without an explicit exception and a new validation plan.

## Verified-in-series patterns

### `progressive-route-from-evidence-to-transfer`

- **Problem:** The learner sees isolated explanations and cannot turn them into a project artifact.
- **Pattern:** Make the route visible and progressive: `orientar → ejemplo → adaptar → aplicar → contrastar → transferir`; for the four-guide series, continue through `prototipar → validar → planear → construir`.
- **Learner benefit:** Reduces hidden prerequisites and makes the next action observable.
- **Evidence:** `_projects/guia 1 Descubrimiento del Negocio y Modelado de Procesos/WEB-DESIGN-BRIEF.md`; `_projects/guia 2 Ingeniería de Contexto (Requisitos Funcionales y Arquitectura)/WEB-DESIGN-BRIEF.md`; Guías 3–4 `guide.manifest.json` learning sequences.
- **Boundary:** Do not force a linear route when the product task is exploratory; show branching choices and their consequences.
- **Adoption:** 4 guides · last verified 2026-08-10.

### `example-template-application-transfer`

- **Problem:** Definitions do not teach a learner how to perform the method.
- **Pattern:** Pair each important technique with a worked example, a reusable template, a focused practice action, expected evidence and transfer to the learner's project.
- **Learner benefit:** Converts explanation into a repeatable procedure.
- **Evidence:** Guía 1 design brief and iteration log; Guía 2 design brief and iteration log.
- **Boundary:** Examples must be labeled fictional or illustrative and must not impersonate real evidence.
- **Adoption:** 2 guides · last verified 2026-08-10.

### `traceability-visible-across-artifacts`

- **Problem:** The learner jumps from a need to a screen, table or task without justification.
- **Pattern:** Keep source, interpretation, candidate, criterion, test and next artifact visible as a chain. In Guías 1–4 the chain evolves from evidence to context, requirements, UI, validation, DoR/DoD and Sprint work.
- **Learner benefit:** Teaches decisions that can be defended and revised.
- **Evidence:** Guía 1 and 2 manifests; Guía 3 checkpoint G3-C2; Guía 4 checkpoints G4-C1–G4-C3.
- **Boundary:** A trace link is not proof that a decision is approved; preserve open questions and validation authority.
- **Adoption:** 4 guides · last verified 2026-08-10.

### `read-act-transfer-zones`

- **Problem:** Reading, practice and generated output compete for attention in one undifferentiated layout.
- **Pattern:** Separate the page into readable explanation/instrument zones and action/simulator zones, while keeping their handoff explicit.
- **Learner benefit:** Clarifies whether the learner is understanding, practicing or producing evidence.
- **Evidence:** Guía 3 and Guía 4 `WEB-DESIGN-BRIEF.md` component and direction notes.
- **Boundary:** Keep one visual system and shared navigation; do not create unrelated mini-apps.
- **Adoption:** 2 guides · last verified 2026-08-07.

### `states-are-instruction`

- **Problem:** A happy-path demo teaches an unrealistic and fragile workflow.
- **Pattern:** Treat empty, loading, error, retry, success, disabled, permission, offline, capacity and destructive states as part of the lesson, with a reasoned message and recovery action.
- **Learner benefit:** Teaches how real software behaves and how to diagnose it.
- **Evidence:** Guía 3 and Guía 4 `WEB-DESIGN-BRIEF.md` state inventories; Guía 4 `guide.manifest.json` checkpoints.
- **Boundary:** Do not use fake failures that misrepresent a real API contract.
- **Adoption:** 2 guides plus global web quality gates · last verified 2026-08-07.

### `local-copyable-evidence-with-boundaries`

- **Problem:** A learner cannot take the result to their own project, or mistakes a demo for official evidence.
- **Pattern:** Generate a local, copyable artifact; label fictional data, privacy limits, assumptions and non-official status; show what must be validated by an instructor, user or stakeholder.
- **Learner benefit:** Supports transfer without fabricating authority or requiring secrets.
- **Evidence:** Guías 1–4 manifests and briefs; all declare local/offline generation and non-official or fictional boundaries where applicable.
- **Boundary:** Do not store personal data or claim that navigation, XP or a generated package proves competence.
- **Adoption:** 4 guides · last verified 2026-08-10.

### `component-reason-criterion-test`

- **Problem:** A polished UI element has no defensible purpose.
- **Pattern:** For each important component, state the requirement or learning purpose, the observable quality/acceptance criterion and the test or evidence that checks it.
- **Learner benefit:** Connects visual decisions to software engineering practice.
- **Evidence:** Guía 3 `GUIDE_ITERATION_LOG.md`; Guía 3 checkpoint G3-C2.
- **Boundary:** Do not invent a requirement after the component exists; keep an open question if the source is missing.
- **Adoption:** 1 guide · candidate for cross-series reuse · last verified 2026-08-07.

### `commitment-needs-visible-readiness`

- **Problem:** A full board or attractive prototype is mistaken for ready-to-build work.
- **Pattern:** Require visible actor, value, criterion, prototype, dependency, estimate, test and DoR/DoD evidence before commitment or release.
- **Learner benefit:** Teaches that progress is verified value, not activity volume.
- **Evidence:** Guía 4 `WEB-DESIGN-BRIEF.md`; Guía 4 `GUIDE_ITERATION_LOG.md`; checkpoints G4-C1–G4-C3.
- **Boundary:** Adjust the readiness checklist to the team's method; DoR/DoD are decision aids, not official certification.
- **Adoption:** 1 guide · candidate for cross-series reuse · last verified 2026-08-07.

## Patterns for code-bearing technical documentation

Seeded from `_projects/guia-jsp` (component inventory) and verified with
measurement in `_projects/guia-fastapi` (2026-08-22).

### `copyable-code-with-destination`

- **Problem:** The learner must retype a listing, or pastes it into the wrong file because the page never said where it belongs.
- **Pattern:** Every code block carries a header with its language, the **destination file path**, and a copy button. Copy degrades in three steps: Clipboard API, `execCommand` fallback, and -- if both fail -- select the code so `Ctrl+C` works immediately. Confirm success both visually and through an `aria-live` region.
- **Learner benefit:** Turns reading into transfer. Removes the most frequent source of "it does not work": the right code in the wrong place.
- **Evidence:** `_projects/guia-jsp/web/css/modules/code-blocks.css` (`code-copy-btn`, `code-file-path`, `code-lang-badge`); `_projects/guia-fastapi` -- 74 of 74 blocks measured, copy chain verified with a spy on `navigator.clipboard`.
- **Boundary:** The path must be real and match the project structure the guide teaches. A decorative filename is worse than none. Do not promise a clipboard the context cannot deliver: always ship the degraded path.
- **Adoption:** 2 guides - last verified 2026-08-22.

### `dual-theme-is-accessibility`

- **Problem:** A dark-only interface is unreadable on a classroom projector with the lights on, and excludes learners who need a light background.
- **Pattern:** Ship two complete themes. Follow `prefers-color-scheme` on first visit, persist an explicit choice afterwards, and keep following the system while no choice exists. Recalibrate **every** state color per theme instead of reusing one palette: greens and ambers tuned for a dark surface collapse to about 2:1 on white.
- **Learner benefit:** The guide is legible in the room where it is actually used.
- **Evidence:** `_projects/guia-jsp/web/css/modules/base.css` (`[data-theme="dark"]` token overrides); `_projects/guia-fastapi/css/tokens.css` -- 2315 text nodes audited per theme, 0 AA failures, worst ratio 5.19:1 dark and 5.08:1 light.
- **Boundary:** A theme toggle is not a license to skip the contrast audit; it doubles it. Vendored SDK tokens may only cover one theme -- extend, do not overwrite.
- **Adoption:** 2 guides - last verified 2026-08-22.

### `device-surface-keeps-its-own-palette`

- **Problem:** A mock phone, terminal or console embedded in a themed page keeps its dark surface but inherits the page text tokens. In light theme it renders dark text on a dark surface.
- **Pattern:** Any surface representing **another device** gets its own palette tokens that do not invert with the theme. Only the frame adapts, so it does not clash with the page.
- **Learner benefit:** The simulated screen stays readable in both themes.
- **Evidence:** `_projects/guia-fastapi` -- 41 nodes at 2.41-2.47:1 in light theme before the fix (`phone__title`, `phone__widget`, `phone__desc`).
- **Boundary:** Applies to surfaces that deliberately do not follow the theme. A normal card must follow it.
- **Adoption:** 1 project - candidate for reuse wherever a device or terminal mock exists - last verified 2026-08-22.

### `search-respects-progressive-unlock`

- **Problem:** Adding content search to a guide with progressive unlocking silently defeats the pedagogical rule.
- **Pattern:** Search the whole corpus and report **where** a hit lives, but for a locked module show only its title and phase -- never the excerpt -- and route the click to the same lock notice the sidebar uses.
- **Learner benefit:** Orientation without shortcutting the route.
- **Evidence:** `_projects/guia-fastapi/js/search.js`; verified with accent-insensitive queries across locked and unlocked modules.
- **Boundary:** Only where progressive unlocking is a deliberate rule. In reference documentation, hiding excerpts is hostile.
- **Adoption:** 1 project - candidate - last verified 2026-08-22.

### `theme-switch-without-transition`

- **Problem:** Toggling a theme fires every element color transition at once: a page-wide flicker that communicates nothing and disturbs motion-sensitive users.
- **Pattern:** Suspend transitions while the tokens swap (a class on the root element, removed on the next tick). Animate interaction with a control, never a repaint of the whole page.
- **Learner benefit:** The theme change is instant and calm.
- **Evidence:** `_projects/guia-fastapi/css/enhancements.css` and `js/enhancements.js`.
- **Boundary:** Do not extend the suppression beyond the swap; interaction transitions are useful.
- **Adoption:** 1 project - candidate - last verified 2026-08-22.

### `separate-listing-from-lesson`

- **Problem:** Long source listings embedded in the pedagogical structure make both harder to review, and push content files past the modularity budget.
- **Pattern:** Keep source listings in their own modules keyed by destination, and let the lesson reference them. The source of the taught system is then reviewable as code, not as embedded data.
- **Learner benefit:** Indirect, through maintenance: the listing the learner copies stays correct because it can be reviewed on its own.
- **Evidence:** `_projects/guia-fastapi/js/content/codigo/`; `_projects/guia-jsp/web/src/pages/*/sections/`.
- **Boundary:** Do not split a listing across files, and do not duplicate it elsewhere in the repository. One listing, one home.
- **Adoption:** 2 projects - last verified 2026-08-22.

### `adopt-selectively-from-an-admired-system`

- **Problem:** A mature interface in the ecosystem is copied wholesale, importing its decorative choices along with its useful ones.
- **Pattern:** Inventory the source system components, then decide **per component** with a written reason, and record the rejections next to the adoptions in `WEB-DESIGN-LEARNING.md`.
- **Learner benefit:** Indirect: the product keeps a deliberate art direction instead of accumulating borrowed decoration.
- **Evidence:** `_projects/guia-fastapi/WEB-DESIGN-LEARNING.md` -- 5 patterns adopted, 3 rejected (hero gradient, celebration particles, scroll-in animation), 1 deferred, each with its reason.
- **Boundary:** The rejection list is the valuable half. An adoption table without rejections means the inventory was not really examined.
- **Adoption:** 1 project - candidate - last verified 2026-08-22.

### `pedagogical-glassmorphic-sidebar-hub` (DevBrain Favorite Standard for Educational Guides)

- **Problem:** Technical and educational guides with extensive content (>8 modules) often overwhelm learners when using plain horizontal navbars or basic flat lists, resulting in lost context, lack of progress visibility, clumsy mobile navigation, and slow discovery.
- **Pattern:** Coordinated two-piece layout: Glassmorphic persistent left sidebar (290px, `backdrop-filter: blur(16px)`) paired with a sticky glassmorphic top-header. Essential anatomy:
  1. **Brand & Identity Header:** Institutional badge + guide title + subtitle + version pill.
  2. **Gamification & Progress Panel:** Learner level + accumulated XP points + dynamic gradient progress bar.
  3. **Instant Search (Ctrl+K / Cmd+K):** Keyboard-accessible quick filter input that opens drawer on mobile and highlights matching modules in real time.
  4. **Pedagogical Phase Grouping:** Grouped under uppercase section headers (`.nav-section-title`) reflecting learning stages (e.g., Fundamentos, Marco Normativo, Riesgos, Práctica).
  5. **Rich Nav-Items:** Accessible thematic emoji/icon + fluid multi-line title (zero ellipsis clipping) + numerical index badge (0..N) + microinteraction scale (1.1x) + active state illumination (`scrollIntoView` nearest).
  6. **Anchored Sticky Footer:** High-priority CTA directing straight to the official evidence delivery section (`Formato de Evidencias`).
  7. **Coordinated Sticky Top-Header:** Dynamic breadcrumb synchronization with current module title, quick utility modal triggers (diagnóstico, glosario), global XP badge, and light/dark theme switch.
  8. **Mobile-First Responsive Drawer:** Breakpoint at 1024px converting sidebar into off-canvas drawer with backdrop blur (`rgba(0,0,0,0.65)`), accessible hamburger button with 3-bar to 'X' CSS morphing, `Escape` key dismiss, and auto-close upon selecting an item.
- **Learner benefit:** Radical reduction of cognitive overload; clear orientation on current location within the learning path; continuous feedback of progression through gamification; rapid switching between theory, practice, and evidence.
- **Evidence:** `_projects/guia-legal-software-dian` (diseño original, rated 93/100 A+) y `_projects/guia-calidad` (migración exitosa en runtime port 8150, 11/11 tests pasando); registrado canónicamente en DevBrain Decision #20.
- **Boundary:** When exceeding 12 items, wrap phases into collapsible accordions with local state memory to prevent vertical scroll fatigue. Ensure WCAG 2.2 AA contrast in both themes.
- **Adoption:** 2 guías interactivas ADSO · `verified-in-series` · última verificación 2026-09-05. Canonical favorite baseline for new and refactored interactive guides in the DevBrain ecosystem.


## Candidate observations

- Keep inter-guide navigation consistent so a learner can see the previous input and next handoff. Validate in a non-guide learning portal before promoting.
- Use different visual directions for different cognitive jobs (for example, editorial reading versus blueprint prototyping) while preserving shared interaction conventions. Validate with a first-time learner walkthrough.
- Reading progress **within** a long module, separate from the global module-completion bar. Observed useful in `guia-fastapi`; confirm with learners whether two progress indicators help or compete.
- Reading/focus mode that hides chrome while studying a long listing (`guia-jsp` `focus-toggle-btn`). Deferred in `guia-fastapi` to avoid duplicating interface state; evaluate before promoting.

---

## 🎨 Catálogo Maestro: 40 Estilos de Diseño Frontend & Design DNA

Motor de diseño transversal para interfaces profesionales con **Google Stitch (`stitch.withgoogle.com`)**, **Google AI Studio Apps**, **Tailwind CSS**, **shadcn/ui** y sistemas de diseño modernos.

### 🏛️ Bloque 1: 20 Estilos Principales de Diseño Frontend

1. **Minimalismo (Minimalism)**:
   - *Definición:* Espacio negativo generoso, paleta monocromática neutra, líneas finas de 1px y tipografía grotesca ligera.
   - *Snippet:* `ESTILO: Minimalista extremo, máximo espacio negativo, paleta blanco/gris pizarra (#f8fafc, #0f172a), líneas sutiles de 1px (#e2e8f0), tipografía Inter ligera, cero sombras pesadas.`
   - *Ideal para:* Portafolios, lectores, notas, plataformas de alta gama.

2. **Glasmorfismo (Glassmorphism)**:
   - *Definición:* Vidrio esmerilado translúcido (`backdrop-blur-md/lg`), fondos `rgba(255,255,255,0.08)` o `rgba(15,23,42,0.65)`, bordes iluminados `1px solid rgba(255,255,255,0.15)`.
   - *Snippet:* `ESTILO: Glassmorphism refinado, tarjetas translúcidas semi-esmeriladas (backdrop-blur-xl con rgba(30,41,59,0.7)), bordes sutiles iluminados (border-white/10), acentos degradados suaves.`
   - *Ideal para:* Dashboards de analítica, fintech premium, reproductores de audio, Web3.

3. **Brutalismo (Brutalism)**:
   - *Definición:* Estética cruda y directa, tipografías gigantes en mayúsculas, colores primarios puros y bordes angulares sin redondeo (`rounded-none`).
   - *Snippet:* `ESTILO: Brutalismo digital puro, tipografías gigantescas y pesadas (Black/Bold), colores de alto contraste (amarillo ácido, negro profundo, blanco), bordes angulares sin redondeo, micro-bordes negros gruesos.`
   - *Ideal para:* Marcas urbanas, revistas de contracultura, agencias experimentales.

4. **Neomorfismo (Neumorphism)**:
   - *Definición:* Elementos extruidos suavemente desde el fondo mediante doble sombra suave (`box-shadow` dual: luz superior y sombra profunda) y bajorrelieve (`inset shadow`).
   - *Snippet:* `ESTILO: Neumorphism suave, elementos extruidos del fondo mediante doble sombra suave, botones táctiles con estados presionados (inset shadow), bordes ultra redondeados (rounded-2xl).`
   - *Ideal para:* Domótica, IoT, controles de audio, mandos virtuales.

5. **Skeuomorfismo (Skeuomorphism)**:
   - *Definición:* Emulación realista de texturas físicas (metal cepillado, cuero cosido, perillas y biseles con iluminación direccional).
   - *Snippet:* `ESTILO: Skeuomorfismo moderno, detalles táctiles realistas inspirados en hardware físico (perillas giratorias, texturas metálicas cepilladas, reflejos de luz direccional, bordes biselados con profundidad 3D).`
   - *Ideal para:* Mezcladores de audio, sintetizadores, editores fotográficos.

6. **Material Design 3 (Material You)**:
   - *Definición:* Capas de papel digital inteligente, elevaciones de sombras estandarizadas (0dp a 24dp), Floating Action Button (FAB) y paletas tonales dinámicas.
   - *Snippet:* `ESTILO: Material Design 3 (Material You), superficies en capas con elevación de sombras estandarizada (elevation-1 a 4), Floating Action Button (FAB) destacado, chips de selección, paleta tonal armónica.`
   - *Ideal para:* Ecosistemas Google Workspace, apps empresariales Android/Web, suites de productividad.

7. **Flat Design**:
   - *Definición:* Diseño 2D sin gradientes ni sombras complejas. Colores sólidos vivos, iconografía geométrica y botones planos de bloque.
   - *Snippet:* `ESTILO: Flat Design 2D limpio, cero gradientes ni sombras complejas, colores sólidos vivos y contrastados, iconografía geométrica simplificada, botones rectangulares sólidos con tipografía sans-serif nítida.`
   - *Ideal para:* Aplicaciones educativas, herramientas infantiles, paneles de configuración ligera.

8. **Fluent Design**:
   - *Definición:* Lenguaje de Microsoft con 5 pilares: luz (Reveal Highlight), profundidad, movimiento, material acrílico y escala.
   - *Snippet:* `ESTILO: Fluent Design System, transparencias acrílicas multicapa, efecto de luz direccional en hover (Reveal Highlight), profundidad sutil en capas, paleta neutra moderna con acentos azul Windows/Cian.`
   - *Ideal para:* Suites ofimáticas, herramientas de desarrollo en Windows/Web, dashboards corporativos.

9. **Cyberpunk**:
   - *Definición:* Estética futurista de alta tecnología con fondos oscuros (`#0a0a0f`), resplandores de neón cian/magenta, esquinas en bisel poligonal y líneas de escaneo.
   - *Snippet:* `ESTILO: Cyberpunk Sci-Fi de alto contraste, fondo ultra oscuro (#0a0a0f), resplandor neón (cyan #00f0ff y magenta #ff0055), esquinas cortadas en bisel poligonal, detalles de rejilla luminosa y badges tipo HUD cibernético.`
   - *Ideal para:* Esports, videojuegos, comunidades cripto, herramientas de hacking ético.

10. **Retro / Vintage**:
    - *Definición:* Tonos cálidos (sepia, mostaza, terracota, oliva), marcos finos dobles, texturas de papel envejecido y tipografía editorial con serifa clásica.
    - *Snippet:* `ESTILO: Retro Vintage cálido, paleta clásica en tonos crema (#fefae0), mostaza (#dda15e), terracota (#bc6c25) y verde oliva (#283618), marcos finos dobles, tipografía con serifa editorial clásica y etiquetas decorativas.`
    - *Ideal para:* Cafeterías artesanales, tiendas de vinilos, cervecerías gourmet, blogs de autor.

11. **Y2K Aesthetic**:
    - *Definición:* Nostalgia de finales de los 90 y principios de los 2000: brillos cromados, degradados chicle rosado/celeste, destellos de estrellas (✦) y formas infladas.
    - *Snippet:* `ESTILO: Y2K Aesthetic nostálgico, gradientes rosa chicle (#ff70a6) y azul pastel brillante, destellos de estrellas (✦), formas curvas infladas con reflejos brillantes tipo burbuja, tipografía redondeada y lúdica.`
    - *Ideal para:* Redes sociales juveniles, tiendas de moda Gen-Z, plataformas de música pop.

12. **Memphis Design**:
    - *Definición:* Movimiento posmoderno ochentero con patrones geométricos repetitivos (triángulos, zigzags, puntos dispersos) y paletas multicolores vivas.
    - *Snippet:* `ESTILO: Memphis Design ochentero, composiciones geométricas asimétricas con triángulos, zigzags y puntos dispersos, paleta multicolor viva (coral, menta, amarillo canario, violeta), patrones gráficos alegres.`
    - *Ideal para:* Herramientas creativas, eventos, educación interactiva, diseño lúdico.

13. **Bento Grid (Apple / Vercel Style)**:
    - *Definición:* Distribución modular asimétrica de tarjetas rectangulares (1x1, 2x1, 2x2) con `rounded-2xl`, bordes sutiles y micro-gráficos contextuales.
    - *Snippet:* `ESTILO: Bento Grid modular contemporáneo (estilo Apple/Vercel), rejilla asimétrica de tarjetas rectangulares redondeadas (rounded-2xl), bordes finos sutiles (border-slate-800), micro-gráficos y KPIs contextuales integrados en cada bloque.`
    - *Ideal para:* Landing pages de SaaS, dashboards ejecutivos, páginas de features.

14. **Editorial / Magazine**:
    - *Definición:* Inspirado en revistas de alta costura y periódicos de prestigio. Titulares serifados monumentales, maquetación en múltiples columnas y líneas finas.
    - *Snippet:* `ESTILO: Editorial Magazine refinado, tipografía serifada de gran escala para titulares (Playfair/Bodoni), maquetación en 3 columnas asimétricas tipo revista impresa, paleta sobria marfil/negro con acento borgoña, líneas divisorias finas.`
    - *Ideal para:* Publicaciones digitales, blogs de arquitectura, revistas de moda, newsletters.

15. **Organic / Natural (Biofílico)**:
    - *Definición:* Formas onduladas fluidas, paleta de colores tierra (verde salvia, arcilla, lino) y atmósfera serena inspirada en la botánica.
    - *Snippet:* `ESTILO: Orgánico y Natural (Biofílico), formas curvas y fluidas tipo pétalo, paleta de colores tierra y naturaleza (verde salvia #84a98c, arcilla terracota #cb997e, fondo lino crema #f8f7f4), atmósfera relajante y cálida.`
    - *Ideal para:* Aplicaciones de meditación, bienestar, productos ecológicos, botánica.

16. **Futurista (Sci-Fi / HUD UI)**:
    - *Definición:* Telemetría de grado aeroespacial, anillos circulares de porcentaje tipo radar, rejillas de datos monoespaciadas y acentos en cian y ámbar de alerta.
    - *Snippet:* `ESTILO: Futurista Sci-Fi HUD, telemetría técnica con coordenadas, anillos circulares de porcentaje tipo radar, rejillas de datos con tipografía monoespaciada (JetBrains Mono), fondo negro puro con acentos en cian (#00d2ff) y ámbar de alerta.`
    - *Ideal para:* Centros de operaciones SOC, monitoreo de satélites, IoT industrial.

17. **Dashboard SaaS B2B**:
    - *Definición:* Máxima densidad de información, 4 tarjetas métricas KPI con deltas porcentuales, tabla interactiva con filtros en vivo y sidebar colapsable.
    - *Snippet:* `ESTILO: Dashboard SaaS profesional de alta productividad, 4 tarjetas métricas con deltas de crecimiento, tabla de datos con filtros en tiempo real y paginación, barra lateral estructurada, paleta Slate/Indigo con badges de estado codificados por color.`
    - *Ideal para:* CRM, ERP, analítica financiera, administración de sistemas.

18. **Dark UI (Modo Oscuro Puro)**:
    - *Definición:* Fondos oscuros profundos (Slate 950 `#0b0f19`, Zinc 950 o Negro OLED) con contrastes calibrados para reducir la fatiga visual y acentos luminosos.
    - *Snippet:* `ESTILO: Dark Mode premium calibrado, fondo ultra oscuro Slate 950 (#0b0f19), tarjetas en Slate 900 con bordes finos (#1e293b), alto contraste visual en tipografías, acentos en violeta/esmeralda luminoso, cero reflejos molestos.`
    - *Ideal para:* Herramientas de código, editores de video/audio, trading nocturno.

19. **Aurora / Gradient UI**:
    - *Definición:* Fondos con halos luminosos difusos multicapa (`filter: blur(80px)`) en tonos violeta, cian y magenta que crean profundidad cósmica.
    - *Snippet:* `ESTILO: Aurora Gradient UI, fondos con halos luminosos difusos multicapa (degradados suaves en tonos violeta, azul cobalto y magenta), tarjetas translúcidas que capturan la luz de fondo, sensación de profundidad espacial y elegancia cósmica.`
    - *Ideal para:* Aplicaciones de IA generativa, suites creativas, apps de música.

20. **Motion / Interactive UI**:
    - *Definición:* Microanimaciones elásticas, respuestas táctiles inmediatas en hover (`scale-105`), barras de progreso dinámicas y transiciones continuas de vista.
    - *Snippet:* `ESTILO: Motion-Driven Interactive UI, componentes con microinteracciones visuales evidentes (estados hover reactivos con brillo suave, transiciones fluidas de pestaña, badges pulsantes, barras de progreso dinámicas con resorte elástico).`
    - *Ideal para:* PWA móviles, aplicaciones de hábitos, onboarding interactivo.

---

### 🚀 Bloque 2: 20 Estilos Adicionales y Emergentes

21. **Liquid UI**: Curvas asimétricas de aspecto líquido, separadores de sección con olas dinámicas en gradientes azul océano y violeta suave.
22. **Claymorphism**: Tarjetas y botones con volumen 3D de arcilla/plastilina digital (sombras interiores y exteriores dobles), paleta pastel suave, bordes `rounded-3xl`.
23. **Pixel Art UI**: Estética retro de 8/16 bits, tipografía tipográfica bitmap (Press Start 2P), bordes segmentados sólidos y paleta indexada.
24. **Terminal / Hacker CLI UI**: Fondo negro consola (`#0d1117`), texto en verde fósforo (`#22c55e`), tipografía monospace estricta, prompt `user@sys:~$` y cajas de logs.
25. **Kinetic Typography**: Titulares gigantes con fuentes grotescas extra-pesadas (Bebas Neue/Druk), textos en marquesinas horizontales donde las letras construyen la estructura.
26. **Maximalismo**: Explosión de colores saturados sin restricciones, elementos y stickers superpuestos, patrones contrastantes y gran energía festiva.
27. **Hand-Drawn UI (Excalidraw Style)**: Trazos de boceto imperfectos a mano alzada, flechas y subrayados garabateados, tarjetas con aspecto de notas adhesivas.
28. **Monochromatic UI**: Gama estricta de un solo color maestro (ej. Azul Cobalto desde tono 50 hasta 950), logrando jerarquía mediante matices y opacidades.
29. **3D UI (Isométrico)**: Widgets con iconos 3D renderizados con reflejos suaves (Spline/Blender), tarjetas flotantes con sombras de profundidad de campo.
30. **AI / Generative UI**: Área central conversacional fluida con tarjetas interactivas de acción rápida generadas al vuelo, chips neuronales pulsantes y atajos inteligentes.
31. **Liquid Glass UI**: Transparencias ultra-claras con refracción de luz realista, bordes con destellos cromados especulares finos y `backdrop-blur-2xl`.
32. **Paper UI**: Tarjetas con estética de hojas de papel de archivo con sombras de pliegue natural, pestañas de carpetas superiores y textura suave de fibra de papel.
33. **Gradient Mesh UI**: Fondos con mallas complejas de degradados fluidos multidireccionales (fucsia, violeta profundo, cian, naranja eléctrico).
34. **Frosted Ice UI**: Vidrio escarchado con desenfoque denso blanquecino, bordes en blanco hielo cristalino (`#e0f2fe`) y paleta azul glacial.
35. **Neo-Brutalism (Gumroad Style)**: Bordes negros sólidos y gruesos de 3px, sombras duras desplazadas sin difuminar (`shadow-[4px_4px_0px_#000]`), colores de alto impacto.
36. **Scroll-Based Design (Scrollytelling)**: Paneles secuenciales de alto impacto con indicador visual de progreso de lectura y tarjetas apilables con fijación vertical.
37. **Microinteractions UI**: Checkmarks animados con rebote de éxito, toggles con física elástica, badges pulsantes en tiempo real y tooltips enriquecidos.
38. **Data Visualization UI**: Gráficos de líneas suavizadas con gradientes bajo la curva, tablas interactivas con sparklines integradas en cada fila y filtros facetados.
39. **Voice UI**: Esfera luminosa central pulsante reactiva a la voz, visualizador de ondas sonoras (*waveform*), transcripción en tiempo real y botón de micrófono flotante.
40. **Adaptive UI**: Layout modular con conmutador de densidad visual (Modo Compacto / Normal / Expandido), soporte de alto contraste accesible y tarjetas reconfigurables.

---

### 🔀 Matriz de Fusión de Estilos

| Fusión Recomendada | Estilos Base | Propósito y Resultado Visual |
| :--- | :--- | :--- |
| **Bento + Glassmorphism** | Bento Grid (13) + Glassmorphism (2) | Rejilla asimétrica modular con tarjetas de vidrio esmerilado translúcido y luces difusas. Ideal para SaaS de IA. |
| **Dark UI + Terminal** | Dark UI (18) + Terminal CLI (24) | Fondo negro profundo con tipografías monoespaciadas y logs en verde/cian. Ideal para plataformas DevOps y Ciberseguridad. |
| **Neo-Brutalism + Microinteractions** | Neo-Brutalism (35) + Microinteractions (37) | Bordes negros gruesos y sombras sólidas con rebotes elásticos y feedback interactivo vivo. Ideal para apps de creadores. |
| **SaaS Dashboard + Data Viz** | Dashboard SaaS (17) + Data Visualization (38) | Panel de productividad denso con gráficos interactivos y sparklines en tablas. Ideal para Fintech y BI. |
| **Minimalismo + Editorial** | Minimalismo (1) + Editorial Magazine (14) | Mucho espacio negativo con tipografía serifada imponente y maquetación en columnas. Ideal para marcas premium y blogs. |
| **Aurora + AI Generative** | Aurora UI (19) + AI Generative UI (30) | Fondo con luces cósmicas difusas y chat inteligente que genera tarjetas al vuelo. Ideal para Copilotos de IA. |

---

### 🛡️ Los 4 Estados de Interfaz Obligatorios

Toda pantalla, vista o componente interactivo debe implementar y validar explícitamente:
1. **Empty State:** Ilustración o icono descriptivo + mensaje de estado claro + botón de llamado a la acción primario (*CTA*).
2. **Loading Skeleton State:** Skeletons animados con pulsación de gradiente (`animate-pulse`) respetando la geometría del componente final.
3. **Success Feedback State:** Notificación Toast flotante accesible (`aria-live="polite"`) con confirmación clara de la operación realizada.
4. **Error Alert & Retry State:** Banner o alerta accesible inline/modal con explicación del problema y botón visible de reintento.

---

## Maintenance

Every new web project should create or update `WEB-DESIGN-LEARNING.md`. Promote only evidence-backed patterns; record deprecations with their reason. This catalog is operational memory, not a license to copy a design wholesale.
