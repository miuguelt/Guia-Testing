// Catálogo declarativo por tema; conserva el contenido existente.
Object.assign(window.MODULES, {
    "m-ia-testing": {
        title: "IA en Testing: genera más rápido, verifica siempre",
        badge: "Modulo 13 · IA",
        intro: "En este módulo aprenderás a usar IA para proponer pruebas y analizar resultados. La actividad termina cuando ejecutas, revisas y documentas lo que la IA sugirió; no cuando obtienes una respuesta bonita.",
        blocks: [
            {
                type: "alert", variant: "info",
                title: "Tu objetivo",
                body: "Usa la IA como copiloto para crear o revisar una prueba pequeña. Después ejecuta la suite, contrasta el resultado con el requisito y deja evidencia de tu decisión. La IA propone; tú aceptas, corriges o rechazas."
            },
            {
                type: "steps",
                title: "Actividad del módulo: una prueba asistida por IA",
                intro: "Trabaja con `recursos/codigo-ejemplo` o con un proyecto propio. Elige una sola función, endpoint o flujo para que puedas comprobar cada resultado.",
                steps: [
                    {
                        number: 1,
                        title: "Escoge un objetivo pequeño",
                        tag: "Preparar",
                        desc: "Define qué comportamiento quieres probar y cuál es la fuente de verdad: historia de usuario, README, contrato de API o código existente. Escribe también qué resultado debería hacer fallar la prueba.",
                        tip: "Un endpoint o una función es un mejor primer objetivo que todo el repositorio.",
                        pitfall: "Pedirle a la IA que pruebe la aplicación completa sin decir qué significa correcto."
                    },
                    {
                        number: 2,
                        title: "Pide una propuesta, no una respuesta final",
                        tag: "Consultar",
                        desc: "Usa uno de los prompts de este módulo para pedir un plan y luego el código de la prueba. Indica lenguaje, framework, comando de ejecución y casos feliz, borde y error. Retira secretos y datos personales antes de compartir contexto.",
                        tip: "Pide que cite los archivos reales que está usando y que explique por qué cada aserción detectaría una falla.",
                        pitfall: "Copiar el test generado sin revisar imports, datos, mocks ni aserciones."
                    },
                    {
                        number: 3,
                        title: "Ejecuta y cuestiona el resultado",
                        tag: "Verificar",
                        desc: "Corre el comando real del proyecto y revisa si la prueba falla cuando introduces un defecto controlado. Complementa la revisión con `qa_auditor` para detectar tests vacíos, secretos, imports dudosos y otros riesgos.",
                        tip: "Pregunta: ¿por qué este test fallaría si el código estuviera roto? Si no puedes responder, todavía no es evidencia.",
                        pitfall: "Cambiar la aplicación solo para que la prueba quede en verde."
                    },
                    {
                        number: 4,
                        title: "Guarda la evidencia y tu decisión",
                        tag: "Entregar",
                        desc: "Conserva el test revisado, el comando ejecutado, el resultado, los hallazgos del auditor y los riesgos pendientes. Registra en `docs/ai-log.md` qué propuso la IA, qué cambiaste y por qué.",
                        tip: "Tu entrega debe permitir que otra persona repita la verificación sin preguntarte qué ocurrió.",
                        pitfall: "Presentar solo el texto de la IA o una suite verde sin explicar qué escenarios cubre."
                    }
                ]
            },
            {
                type: "alert", variant: "success",
                title: "Sabes que terminaste cuando puedes mostrar",
                body: "Una prueba revisada y ejecutable · el comando y su resultado · una revisión de calidad con `qa_auditor` o una explicación de por qué no aplica · `docs/ai-log.md` con la decisión humana y los riesgos pendientes."
            },
            {
                type: "steps",
                title: "Práctica guiada: audita tu proyecto con qa_auditor",
                intro: "Esta es la herramienta de apoyo para la actividad anterior. Ejecuta los pasos sobre tu proyecto y usa el informe para decidir qué corregir o documentar.",
                steps: [
                    {
                        number: 1,
                        title: "Localizar y entender el auditor multidimensional",
                        tag: "Paso 1: Arquitectura",
                        desc: "El auditor reside en `recursos/auditoria-seguridad/` y evalúa 9 dimensiones ponderadas: seguridad (OWASP), funcionalidad, fiabilidad, mantenibilidad y riesgos específicos de código generado por IA.",
                        command: "cd recursos/auditoria-seguridad; python -m qa_auditor --help",
                        tip: "El auditor calcula un score global de 0 a 100% y un índice específico de seguridad.",
                        pitfall: "Modificar los pesos de las dimensiones sin comprender que la seguridad y el código IA tienen mayor ponderación por su impacto en producción."
                    },
                    {
                        number: 2,
                        title: "Ejecutar escaneo estático del código fuente",
                        tag: "Paso 2: Análisis Estático",
                        desc: "Ejecuta el auditor apuntando a la carpeta de tu aplicación para detectar secretos expuestos, SQL injection potencial, funciones muertas y módulos sobredimensionados.",
                        command: "python -m qa_auditor --target ../codigo-ejemplo",
                        tip: "El reporte muestra exactamente el archivo y número de línea de cada debilidad junto con su severidad (ALTA, MEDIA, BAJA) y el remedio sugerido.",
                        pitfall: "Ignorar las advertencias de imports alucinados en código sugerido por asistentes de IA."
                    },
                    {
                        number: 3,
                        title: "Auditoría dinámica en caliente contra el servidor en vivo",
                        tag: "Paso 3: Análisis Dinámico",
                        desc: "Levanta tu servicio web y agrega el parámetro `--url http://localhost:8000` para verificar cabeceras HTTP de seguridad (HSTS, CSP, X-Frame-Options) y cookies seguras.",
                        command: "python -m qa_auditor --target ../codigo-ejemplo --url http://localhost:8000",
                        tip: "Verificar cabeceras en caliente te alerta si tu API expone detalles técnicos del servidor o permite incrustación en iframes maliciosos (Clickjacking).",
                        pitfall: "Hacer auditorías de seguridad únicamente sobre el código estático sin comprobar cómo responde el servidor en tiempo de ejecución."
                    },
                    {
                        number: 4,
                        title: "Detectar código IA defectuoso (Tests Vacíos y TODOs)",
                        tag: "Paso 4: Auditoría de IA",
                        desc: "Revisa la sección 'ia' del informe: detecta tests que pasan en verde pero no tienen aserciones, funciones con `pass` o `NotImplementedError` y mocks ficticios.",
                        command: "python -m qa_auditor --target ../codigo-ejemplo --json informe.json",
                        tip: "Un test generado por IA suele incluir `assert True` o no incluir ningún `assert`. `qa_auditor` los marca como hallazgo crítico.",
                        pitfall: "Aceptar sugerencias de código de IA sin verificar que contengan lógica real y no plantillas vacías."
                    },
                    {
                        number: 5,
                        title: "Establecer la compuerta de calidad mínima (--min-score)",
                        tag: "Paso 5: Quality Gate",
                        desc: "Integra el auditor en tu terminal o CI exigiendo una calificación mínima (ej. 80%). Si el score no se alcanza, el comando devuelve código de salida distinto de 0.",
                        command: "python -m qa_auditor --target ../codigo-ejemplo --min-score 80 --html informe.html",
                        tip: "El archivo `informe.html` generado proporciona un panel visual completo para presentar ante instructores o comités de calidad.",
                        pitfall: "Dejar que el score caiga por debajo de 80% acumulando deuda técnica hasta el final de la formación."
                    }
                ]
            },
            {
                type: "code", lang: "text", file: "prompts/prompt_testing.txt",
                title: "Prompt estrategico: Generar tests unitarios",
                code: `Actua como un ingeniero QA senior experto en PyTest.

Contexto: Tengo una API FastAPI con este endpoint:

[PEGA TU CODIGO AQUI]

Genera tests unitarios con PyTest que cubran:
1. Caso feliz (status 200, estructura JSON correcta)
2. Caso borde (datos faltantes, tipos incorrectos)
3. Caso de error (404, 422, 500)
4. Inyeccion SQL (si aplica)
5. Autenticacion (si aplica: token valido, expirado, sin token)

Usa pytest fixtures, TestClient, y SQLite en memoria.
Asegura que cada test sea independiente (no compartan estado).
Incluye docstring explicando que prueba cada test.`
            },
            {
                type: "code", lang: "text", file: "prompts/prompt_bug.txt",
                title: "Prompt estrategico: Debuggear un test fallido",
                code: `Tengo un test que falla intermitentemente:

\`\`\`
[PEGA EL LOG DEL TEST AQUI]
\`\`\`

1. Analiza la causa raiz del fallo intermitente (flaky test)
2. Sugiere 3 formas de hacerlo deterministico
3. Cual es la mejor practica para evitar este tipo de tests?`
            },
            {
                type: "code", lang: "text", file: "prompts/prompt_sre_coolify.txt",
                title: "Prompt estrategico: Triaje de Logs y Crash en Coolify con IA (AI SRE)",
                code: `Actua como un Ingeniero Senior SRE especializado en Docker, Flask y Coolify.

Contexto del Incidente:
- Contenedor: catalogo-flask-api
- Evento Coolify: restart_limit_reached (Crash-loop)
- Ultimas 50 lineas de log:
[PEGA AQUI LOS LOGS DE COOLIFY / DOCKER]

Proporciona un diagnostico en JSON estructurado:
1. Severidad (CRITICAL, HIGH, MEDIUM, LOW)
2. Causa Raiz exacta del fallo (excepcion, memoria OOM, timeout de DB)
3. Impacto en el servicio
4. Accion inmediata en Coolify (aumentar Memory Limit, ajustar variables de entorno o reiniciar DB)
5. Parche de codigo sugerido para evitar que vuelva a ocurrir.`
            },
            {
                type: "code", lang: "text", file: "prompts/prompt_coverage.txt",
                title: "Prompt estrategico: Mejorar cobertura",
                code: `Tengo este reporte de cobertura:

[PEGA EL REPORTE AQUI - muestra las lineas no cubiertas]

Para cada archivo con cobertura < 80%:
1. Identifica las funciones/metodos no cubiertos
2. Sugiere casos de prueba especificos para cada uno
3. Prioriza por riesgo de negocio

Ademas, identifica:
- Codigo muerto (no cubierto ni ejecutable)
- Codigo defensivo innecesario
- Posibles bugs en lineas no cubiertas`
            },
            {
                type: "alert", variant: "warning",
                title: "⚠️ Las 3 reglas de oro para usar IA en Testing",
                body: "1. NUNCA confies en un test generado por IA sin revisarlo manualmente. La IA inventa asserts que siempre pasan. 2. LA IA alucina nombres de funciones, metodos y librerias que no existen. Verifica cada import. 3. SIEMPRE pregunta a la IA 'Por que este test pasaria si el codigo esta roto?' — si no sabe explicarlo, el test es inutil."
            },
            {
                type: "alert", variant: "info",
                title: "¿En que contextos usar IA en Testing?",
                body: "IDEAL: generar el primer borrador de tests para funciones nuevas, complementar casos borde (tabla de decision, particiones), redactar prompts para reportes de cobertura y analizar logs de tests flaky. PRUDENCIA: IA como autoridad final sobre correctitud de contratos o validaciones de negocio, y NUNCA en secretos/credenciales del proyecto. Workflow V.E.R.A.: revisar el resultado, ejecutar la suite y llevar la bitacora en docs/ai-log.md."
            },
            {
                type: "timeline",
                title: "Historia: la IA entra a la disciplina de prueba",
                items: [
                    { year: "2017", title: "Code completion y el test autogenerado", desc: "Kite y Tabnine sugieren codigo; Diffblue Cover (2017) lanza la primera generacion industrial de tests unitarios Java." },
                    { year: "2021", title: "Copilot escribe los primeros tests", desc: "GitHub Copilot (Codex/OpenAI) autocompleta en el editor; los equipos descubren que tambien propone tests — y que deben revisarlos." },
                    { year: "2022-2023", title: "LLM como QA assistant", desc: "ChatGPT y modelos generativos responden sobre reports de cobertura y logs flak; los prompts estructurados (como los de este modulo) se vuelven skill." },
                    { year: "2024", title: "Agentes de testing autosuficientes", desc: "Agentes (Devin, SWE-agent) corren la suite, corrigen tests rotos y abren el PR; la orquestacion y la evaluacion humana determinan que la calidad no se diluya." },
                    { year: "Hoy", title: "TDD con superpoderes", desc: "La mejor practica madura: IA para la 'red' y la velocidad, humano para el contrato: lo que se va a decir que tenga valor para el negocio." }
                ]
            }
        ]
    }
});
