# CORTEX MAP - Guia Testing & QA

**Proyecto:** Guia Testing | SENA ADSO
**Fase ADSO:** 5 - Evaluacion
**Version:** 1.0
**Ultima actualizacion:** Junio 2026

---

## 1. Estructura Critica

```
Guia Testing/
├── web/                          # Guia web interactiva (puerto 8035)
│   ├── index.html                # 12 modulos + simuladores + gamificacion
│   ├── css/styles.css            # Glassmorphism dark theme
│   └── js/
│       ├── modules-content.js    # 12 modulos con codigo real
│       ├── code-renderer.js      # Render con file headers
│       ├── simulators.js         # 3 simuladores activos
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

---

## 4. Sinergia con Otras Guias

Esta guia CONSUME el codigo de las 4 guias anteriores:
- Guia FastAPI -> tests/test_productos.py (PyTest + TestClient)
- Guia Flask -> tests/test_routes.py (PyTest + test_client)
- Guia React -> tests/Contador.test.jsx (Vitest + Testing Library)
- Guia JSP -> tests/ProductoDAOTest.java (JUnit 5 + Mockito)
- Todas -> tests/e2e/inventario.spec.js (Playwright)

---

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
