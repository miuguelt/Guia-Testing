"""Bloque 4.3.4: JUnit 5 con Mockito para el backend Java."""
import os

from .config import EJ_DIR
from .estilos import agregar_codigo, agregar_pasos, leer


def junit_mockito(doc):
    doc.add_heading("4.3.4 JUnit 5 & Mockito: backend Java", level=3)
    agregar_pasos(doc, "Paso a paso para pruebas automatizadas en Java:", [
        {"num": 1, "titulo": "pom.xml de Maven", "desc": "Agregar dependencias junit-jupiter-engine y mockito-core con alcance de prueba.", "cmd": "mvn dependency:resolve", "tip": "Asegura la compatibilidad con maven-surefire-plugin 3.x."},
        {"num": 2, "titulo": "Estructura de la clase", "desc": "Crear la clase de prueba en src/test/java/ con @ExtendWith(MockitoExtension.class).", "cmd": "mvn test-compile", "tip": "Usa @DisplayName para documentar la intención en español."},
        {"num": 3, "titulo": "Mocks y partes simuladas", "desc": "Crear dobles con @Mock y definir respuestas simuladas con when().thenReturn().", "cmd": "mvn test -Dtest=ProductoDAOTest", "tip": "Simula SQLException para verificar la recuperación ante fallos."},
        {"num": 4, "titulo": "Aserciones y verificación", "desc": "Validar resultados con assertEquals y verificar llamadas con verify(mockStmt).executeUpdate().", "cmd": "mvn test", "tip": "verify(mock, never()) garantiza que los métodos peligrosos no fueron invocados."},
        {"num": 5, "titulo": "Reporte JaCoCo", "desc": "Generar reporte de cobertura con JaCoCo.", "cmd": "mvn test jacoco:report", "tip": "Revisa target/site/jacoco/index.html en el navegador."},
    ])
    ruta = "tests/ProductoDAOTest.java"
    if os.path.exists(os.path.join(EJ_DIR, ruta)):
        agregar_codigo(doc, leer(EJ_DIR, ruta)[:3000])
