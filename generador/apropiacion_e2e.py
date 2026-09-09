"""Bloque 4.3.7: Playwright y pruebas end-to-end en navegador real."""
import os

from .config import EJ_DIR
from .estilos import agregar_codigo, agregar_pasos, leer


def playwright_e2e(doc):
    doc.add_heading("4.3.7 Playwright: pruebas end-to-end en navegador real", level=3)
    agregar_pasos(doc, "Paso a paso para pruebas E2E con Playwright:", [
        {"num": 1, "titulo": "Instalación", "desc": "Instalar Playwright y descargar los navegadores headless.", "cmd": "npm install -D @playwright/test && npx playwright install chromium", "tip": "chromium headless es suficiente para pruebas locales rápidas."},
        {"num": 2, "titulo": "Configuración", "desc": "Establecer baseURL y captura de trazas en playwright.config.js.", "cmd": "npx playwright test", "tip": "trace: 'on-first-retry' guarda capturas paso a paso en caso de fallo."},
        {"num": 3, "titulo": "Selectores data-testid", "desc": "Interactuar mediante page.fill('[data-testid=...]') y aserciones web-first con auto-espera.", "cmd": "npx playwright test --ui", "tip": "data-testid protege las pruebas ante cambios de diseño visual."},
        {"num": 4, "titulo": "Diagnóstico", "desc": "Inspeccionar reportes visuales con Trace Viewer.", "cmd": "npx playwright show-report", "tip": "Evita las esperas fijas con setTimeout; confía en el auto-waiting."},
    ])
    ruta = "tests/e2e/inventario.spec.js"
    if os.path.exists(os.path.join(EJ_DIR, ruta)):
        agregar_codigo(doc, leer(EJ_DIR, ruta)[:2600])
