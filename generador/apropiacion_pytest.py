"""Bloques 4.3.1 y 4.3.2: PyTest sobre FastAPI y Flask."""
import os

from .config import EJ_DIR
from .estilos import agregar_codigo, agregar_pasos, leer


def pytest_fastapi(doc):
    doc.add_heading("4.3.1 PyTest: microservicio FastAPI", level=3)
    doc.add_paragraph(
        "Automatización de pruebas de endpoints REST con TestClient y base "
        "de datos aislada en memoria."
    )
    agregar_pasos(doc, "Paso a paso para pruebas automatizadas en FastAPI:", [
        {"num": 1, "titulo": "Entorno", "desc": "Instalar PyTest, el cliente de prueba HTTP y la herramienta de cobertura.", "cmd": "pip install pytest pytest-cov httpx fastapi sqlalchemy pydantic", "tip": "Usa httpx para que TestClient no requiera levantar un servidor de red real."},
        {"num": 2, "titulo": "Aislamiento (conftest.py)", "desc": "Crear fixtures con SQLite en memoria y dependency_overrides para inyectar una sesión limpia por cada prueba.", "cmd": "pytest tests/ -v", "tip": "Llama app.dependency_overrides.clear() al terminar cada prueba."},
        {"num": 3, "titulo": "Redacción AAA", "desc": "Escribir los casos de prueba con el patrón Arrange, Act, Assert validando códigos de respuesta y JSON.", "cmd": "pytest tests/test_productos.py -v", "tip": "Valida códigos de error como 404 y 422 además del caso exitoso 201."},
        {"num": 4, "titulo": "Ejecución en CLI", "desc": "Ejecutar la suite con banderas de diagnóstico rápido.", "cmd": "pytest tests/ -v -s -x --tb=short", "tip": "La bandera -x detiene la ejecución en el primer fallo para resolverlo de inmediato."},
        {"num": 5, "titulo": "Cobertura", "desc": "Verificar que la lógica alcance al menos el 80 % de cobertura.", "cmd": "pytest --cov=app --cov-report=term-missing", "tip": "Inspecciona response.json()['detail'] si un endpoint responde 422."},
    ])
    ruta = "tests/test_productos.py"
    if os.path.exists(os.path.join(EJ_DIR, ruta)):
        agregar_codigo(doc, leer(EJ_DIR, ruta)[:3500])


def pytest_flask(doc):
    doc.add_heading("4.3.2 PyTest: aplicación web Flask", level=3)
    doc.add_paragraph(
        "Automatización de las rutas, plantillas, formularios y sesiones de "
        "la aplicación web Flask que construiste en la guía anterior "
        "(Guía Flask). Todos los pasos se ejecutan en la carpeta raíz de ese "
        "proyecto: la que contiene run.py, requirements.txt, la carpeta app/ "
        "y la carpeta tests/ con test_routes.py. Si no tienes el proyecto en "
        "tu computador, clónalo desde el repositorio que indique tu "
        "instructor o pídelo como entrega de la fase anterior antes de "
        "continuar."
    )
    agregar_pasos(doc, "Paso a paso para preparar el proyecto y ejecutar las pruebas:", [
        {"num": 1, "titulo": "Abrir el terminal en la raíz del proyecto", "desc": "Abre PowerShell (menú inicio y escribe PowerShell) y navega hasta la carpeta del proyecto Flask. Reemplaza la ruta del ejemplo por la tuya.", "cmd": "cd \"C:\\Users\\TuUsuario\\Guia-Flask\"", "tip": "En PowerShell puedes arrastrar la carpeta sobre la ventana para pegar su ruta completa."},
        {"num": 2, "titulo": "Verificar el contenido del proyecto", "desc": "Lista los archivos de la carpeta para confirmar que estás en el lugar correcto.", "cmd": "Get-ChildItem", "tip": "Deben aparecer run.py, requirements.txt, la carpeta app/ y la carpeta tests/."},
        {"num": 3, "titulo": "Crear el entorno virtual", "desc": "Crea la carpeta venv que aísla Python y las librerías del proyecto para no mezclarlas con otros proyectos del sistema.", "cmd": "python -m venv venv", "tip": "Si PowerShell responde «python no se reconoce», instala Python desde python.org marcando la casilla Add Python to PATH y abre un terminal nuevo."},
        {"num": 4, "titulo": "Activar el entorno virtual", "desc": "Activa el entorno para que pip y pytest usen las librerías del proyecto.", "cmd": ".\\venv\\Scripts\\activate", "tip": "El prompt debe cambiar y mostrar (venv) al inicio. Si PowerShell bloquea el script por políticas de ejecución, ejecuta antes Set-ExecutionPolicy -Scope Process Bypass."},
        {"num": 5, "titulo": "Instalar las dependencias de la aplicación", "desc": "Instala Flask y sus extensiones leyendo la lista del archivo requirements.txt del proyecto.", "cmd": "pip install -r requirements.txt", "tip": "El comando debe ejecutarse en la raíz del proyecto; si aparece el error de archivo no encontrado, revisa la carpeta en la que estás."},
        {"num": 6, "titulo": "Instalar las herramientas de prueba", "desc": "Instala el ejecutor de pruebas y el medidor de cobertura.", "cmd": "pip install pytest pytest-cov", "tip": "pytest ejecuta las pruebas y pytest-cov mide el porcentaje de código cubierto."},
        {"num": 7, "titulo": "Levantar la aplicación para verificar (opcional)", "desc": "Arranca el servidor de desarrollo y abre http://127.0.0.1:5000 en el navegador. Para detenerlo vuelve al terminal y presiona Ctrl+C.", "cmd": "python run.py", "tip": "No es obligatorio para las pruebas (el test_client no usa red), pero confirma que el entorno quedó bien configurado."},
        {"num": 8, "titulo": "Ejecutar la suite completa", "desc": "Ejecuta todas las pruebas del proyecto. PyTest lee pytest.ini (testpaths = tests) y reporta cada prueba en pantalla.", "cmd": "pytest", "tip": "La última línea resume el resultado: N passed si todo pasó o M failed si algo falló; corrige los fallos de arriba hacia abajo."},
        {"num": 9, "titulo": "Ejecutar el archivo de rutas", "desc": "Corre solo las pruebas del archivo test_routes.py (rutas, plantillas y sesiones).", "cmd": "pytest tests/test_routes.py -v", "tip": "La bandera -v (verbose) muestra el nombre y el estado de cada prueba individual."},
        {"num": 10, "titulo": "Ejecutar una prueba puntual", "desc": "Corre un único caso de prueba usando el formato archivo::prueba.", "cmd": "pytest tests/test_routes.py::test_health_check -v", "tip": "El separador :: indica a PyTest exactamente qué prueba ejecutar dentro del archivo."},
        {"num": 11, "titulo": "Medir la cobertura", "desc": "Verifica el porcentaje de líneas ejecutadas por las pruebas en el paquete app y exige el umbral mínimo del 80 %.", "cmd": "pytest --cov=app --cov-report=term-missing --cov-fail-under=80", "tip": "--cov-report=term-missing agrega la columna Missing con las líneas que ninguna prueba ejecutó; si la cobertura baja del 80 %, la ejecución termina en error."},
    ])
    doc.add_paragraph(
        "Si un comando responde ModuleNotFoundError, revisa en este orden: "
        "¿estás en la raíz del proyecto?, ¿el entorno está activo (prompt con "
        "(venv))?, ¿instalaste requirements.txt y las herramientas de prueba?"
    )
