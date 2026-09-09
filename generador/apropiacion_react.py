"""Bloque 4.3.3: Vitest para componentes React."""
import os

from .config import EJ_DIR
from .estilos import agregar_codigo, agregar_pasos, leer


def vitest_react(doc):
    doc.add_heading("4.3.3 Vitest: componentes React", level=3)
    agregar_pasos(doc, "Paso a paso para pruebas automatizadas en React:", [
        {"num": 1, "titulo": "Dependencias", "desc": "Instalar Vitest, React Testing Library y jsdom.", "cmd": "npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom", "tip": "jsdom emula el DOM del navegador en Node.js de forma rápida."},
        {"num": 2, "titulo": "Configuración", "desc": "Configurar environment: 'jsdom' y setupFiles en vitest.config.js.", "cmd": "npm test", "tip": "jest-dom agrega aserciones como .toBeInTheDocument() y .toBeDisabled()."},
        {"num": 3, "titulo": "Accesibilidad", "desc": "Renderizar el componente y buscar elementos mediante screen.getByRole.", "cmd": "npm test -- Contador.test.jsx", "tip": "Busca botones por su texto visible, no por selectores de clase CSS."},
        {"num": 4, "titulo": "Eventos", "desc": "Simular clics con fireEvent o user-event y verificar cambios de estado.", "cmd": "npm run test:watch", "tip": "Ante actualizaciones asíncronas, usa waitFor(() => expect(...))."},
        {"num": 5, "titulo": "Cobertura del frontend", "desc": "Generar reporte de cobertura V8 para componentes.", "cmd": "npm run test:coverage", "tip": "Asegúrate de probar los estados de cargando, error y éxito."},
    ])
    ruta = "tests/Contador.test.jsx"
    if os.path.exists(os.path.join(EJ_DIR, ruta)):
        agregar_codigo(doc, leer(EJ_DIR, ruta))
