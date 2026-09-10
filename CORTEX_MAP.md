# CORTEX MAP - Guia Testing & QA

**Proyecto:** Guia Testing | SENA ADSO
**Fase ADSO:** 5 - Evaluacion
**Version:** 1.0
**Ultima actualizacion:** Septiembre 2026

---

## 1. Estructura Critica

```
Guia Testing/
├── web/                          # Guia web interactiva (puerto 8035)
│   ├── index.html                # 16 modulos + simuladores + evidencias
│   ├── css/styles.css            # Glassmorphism dark theme
│   └── js/
│       ├── modules-content.js    # Modulos base con codigo real
│       ├── code-renderer.js      # Render con file headers
│       ├── simulators.js         # 4 simuladores QA
│       ├── gamification.js       # XP y niveles (testing_xp)
│       └── main.js               # Navegacion y logica
├── recursos/
│   └── codigo-ejemplo/
│       ├── tests/
│       │   ├── conftest.py        # Fixtures pytest
│       │   ├── test_productos.py  # Tests FastAPI
│       │   ├── Contador.test.jsx  # Tests React
│       │   ├── ProductoDAOTest.java # Tests JSP
│       │   └── e2e/inventario.spec.js # Playwright
│       ├── .github/workflows/ci.yml # Pipeline CI/CD
│       ├── requirements.txt       # Dependencias Python
│       └── package.json           # Dependencias Node
├── tests/                        # Tests de la guia misma
│   ├── conftest.py
│   └── test_guide.py             # 10+ tests de estructura
├── .devbrain/                    # Automatizacion
├── generar_guia.py               # Generador DOCX
├── start-windows.ps1             # Servidor web (puerto 8035)
├── pytest.ini
└── README.md
```

---

## 2. Puntos de Entrada

| Archivo | Proposito | Comando |
|---------|-----------|---------|
| start-windows.ps1 | Servir guia web | .\start-windows.ps1 |
| generar_guia.py | Generar DOCX | python generar_guia.py |
| tests/test_guide.py | Tests de estructura | pytest |

---

## 3. Puertos y Servicios

| Servicio | Puerto | Descripcion |
|----------|--------|-------------|
| Guia Web | 8035 | Guia interactiva HTML/CSS/JS |

## 3.1 Contrato de distribución responsiva

- `web/css/styles.css` parte de una composición Mobile First desde 320 px:
  menú lateral oculto, contenido de ancho completo y rejillas apiladas.
- Todo texto natural de la web ocupa el `100%` del ancho interno disponible:
  `.content`, párrafos, listas, citas, avisos, introducciones y ayudas no deben
  heredar límites tipográficos como `70ch` o `78ch` que creen huecos laterales.
  Los únicos límites válidos son excepciones semánticas documentadas como
  modales, controles compactos, sellos, hojas imprimibles y código con scroll
  interno.
- Las rejillas de módulos se expanden mediante `@container` cuando el panel
  tiene holgura real; no se deben reintroducir columnas rígidas como estado
  base ni reemplazarlas por correcciones tardías con `max-width`.
- A partir de `85rem` se muestra el menú lateral. En ese estado
  `.main-wrapper` usa `width: calc(100% - var(--sidebar-width))` junto con su
  margen para evitar desbordar el documento.
- El código conserva el desplazamiento horizontal dentro de su bloque; la
  página completa debe mantener `scrollWidth === clientWidth`.
- `tests/test_responsive_layout.py` protege este contrato y documenta la
  ausencia de PrimeNG, PrimeVue y PrimeReact en este repositorio.

---

## 4. Sinergia con Otras Guias

Esta guia CONSUME el codigo de las 4 guias anteriores:
- Guia FastAPI -> tests/test_productos.py (PyTest + TestClient)
- Guia Flask -> tests/test_routes.py (PyTest + test_client)
- Guia React -> tests/Contador.test.jsx (Vitest + Testing Library)
- Guia JSP -> tests/ProductoDAOTest.java (JUnit 5 + Mockito)
- Todas -> tests/e2e/inventario.spec.js (Playwright)

---

## 5. Estándar Oficial del Registro Integral de Evidencias SENA (GFPI-F-023 Versión 03)
> **Directriz SSoT Permanente ("Deseo Canónico de Diseño e Impresión"):**  
> Cuando se genere o regenere el módulo de evidencias SENA en esta guía (o guías hermanas), se debe **priorizar estrictamente el diseño institucional GFPI-F-023 Versión 03** (origen SIGA - Formato Registro Integral de Evidencias y Juicio de Evaluación), garantizando:

1. **Membrete Oficial SIGA:**
   - Tabla con borde institucional verde `#39a900` de 2px, logotipo SVG del SENA centrado, subtítulos del Sistema Integrado de Gestión y Autocontrol (SIGA).
   - Celda lateral derecha de control documental con: Código Formato (`GFPI-F-023`), Versión (`03`), Ficha, Fecha de emisión y Badge de estado dinámico.

2. **Panel de Control y Firma Digital (Solo Pantalla):**
   - Formulario reactivo para diligenciamiento de datos del aprendiz (nombre, documento, ficha, centro, regional, instructor, observaciones).
   - Lienzo interactivo (Canvas HTML5 de 360x120) de **firma digital** con soporte táctil (Pointer Events), mouse, limpieza de trazo, carga de archivo de imagen (PNG/JPG) y persistencia en `localStorage` (`sena_apprentice_signature`).
   - Barra de acciones: `🖨️ Imprimir / Guardar en PDF`, `💾 Descargar Evidencia en JSON`, `📥 Descargar en Markdown (.md)`, `🔄 Recargar Estado Real`, `⚡ Ejecutar Todas las Pruebas (CI)`.

3. **Estructura Taxativa de la Hoja Imprimible (`.sena-evidence-sheet`):**
   - **Sección 1:** Datos Generales del Aprendiz y Proceso Formativo (Competencia 220501100, RAPs 1..4).
   - **Sección 2:** Registro Taxativo de Evidencias Técnicas Realizadas (EV-01, EV-02, EV-03) con badges de estado y botones directos de navegación `Ir a ... ➔`.
   - **Sección 3:** Desempeño en Simuladores Interactivos (Pirámide de Cohn, Assertion Validator, Quiz QA, Secuenciador de Fases) y Matriz de 9 Suites de Prueba Automatizadas.
   - **Sección 4:** Rúbrica de Criterios SENA con caja destacada de **Juicio de Evaluación Final del Instructor** (`APROBADO (A)` vs `NO APROBADO / EN FORMACIÓN (NA)`), observaciones editables y Declaración de Autenticidad y Veracidad.
   - **Sección 5:** Espacio Institucional de Firmas en dos columnas (Aprendiz con estampa digital / Instructor con sello).

4. **Reglas de Impresión y Exportación a PDF (`@media print`):**
   - Supresión completa de elementos ajenos (`.no-print`, header, footer, barras de progreso, botones de acción).
   - Hoja blanca centrada a tamaño carta (`size: letter portrait; margin: 1.2cm 1.4cm`).
   - Mantenimiento exacto de bordes, fondos de cabecera `#f1f5f9` y badges institucionales (`-webkit-print-color-adjust: exact !important`).
   - Prevención de saltos de página dentro de filas de tablas (`page-break-inside: avoid;`).

5. **Cálculo Verídico y Ponderación Real de la Sesión:**
   - Fórmula: $\text{Score} = \text{Módulos}(20\%) + \text{Simuladores}(30\%) + \text{Test Checks}(30\%) + \text{Entregables SSoT}(20\%)$.
   - Condición de Aprobación: $\text{Score} \ge 70\%$, mínimo 5 suites de prueba aprobadas y mínimo 2 simuladores aprobados.

---

## Ruta ADSO
- **Fase**: 5 de 5
- **Antecesora**: Guia FastApi (Fase 4) — Puerto 8025
- **Sucesora**: Ninguna (guia final)
- **Dominio compartido**: Multi-guia (Finca, Inventario, Blog)
- **Puerto guia web**: 8035
- **Puerto API**: N/A (guia de testing)
- **Stack**: Python 3.12+, PyTest, Vitest, JUnit 5, Playwright, GitHub Actions

---

*Documento vivo: Actualizar conforme evoluciona el proyecto.*
