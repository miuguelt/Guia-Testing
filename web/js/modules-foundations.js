// Fundamentos antes de herramientas: datos para los bloques existentes.
window.MODULES["m-reflexion"].title = "Fundamentos: qué significa probar software";
window.MODULES["m-reflexion"].intro = "Probar es obtener información sobre un producto para comparar lo que hace con lo que necesita hacer. Empieza por una regla observable, distingue los conceptos y usa el resultado para decidir qué corregir o investigar.";
window.MODULES["m-reflexion"].blocks.unshift(
    {
        type: "comparison", title: "Las piezas con las que vas a trabajar",
        headers: ["Pieza", "Qué contiene", "Ejemplo"],
        rows: [
            ["Caso de prueba", "Precondiciones, entradas y resultado esperado para una comprobación.", "Con permiso y 10 equipos, solicitar 6 debe rechazarse sin cambiar existencias."],
            ["Escenario", "Situación o recorrido que expresa un comportamiento; puede dar origen a varios casos.", "Solicitar una cantidad fuera del rango permitido."],
            ["Procedimiento de prueba", "Pasos en orden para preparar, ejecutar, observar y limpiar.", "Abrir formulario, ingresar cantidad, enviar y consultar existencias."],
            ["Suite de pruebas", "Conjunto organizado de pruebas con un propósito.", "Pruebas de cantidades válidas, límites y tipos incorrectos."],
            ["Plan de pruebas", "Alcance, riesgos, estrategia, recursos, responsabilidades y criterios.", "Probar préstamos esta iteración; pagos quedan fuera del alcance."],
            ["Ambiente y datos de prueba", "Configuración y datos con los que se ejecuta de forma reproducible.", "Versión A, cuenta de prueba, 10 equipos sintéticos y limpieza al finalizar."],
            ["Evidencia", "Registro que permite revisar qué se hizo y qué ocurrió.", "Comando, versión, esperado, observado y salida conservada."]
        ]
    },
    {
        type: "comparison", title: "Vocabulario mínimo: de la necesidad al fallo",
        headers: ["Concepto", "Qué significa", "Ejemplo en préstamos"],
        rows: [
            ["Calidad", "Grado en que el producto satisface necesidades y requisitos en su contexto.", "Permite prestar equipos sin perder disponibilidad ni excluir a quien usa teclado."],
            ["QA · aseguramiento de calidad", "Actividades para mejorar los procesos con los que se produce calidad.", "Revisar requisitos, acordar criterios y analizar causas recurrentes."],
            ["Control de calidad y pruebas", "El control evalúa el producto; las pruebas aportan parte de esa información.", "Ejecutar casos sobre cantidades y revisar el resultado."],
            ["Error humano", "Decisión o acción equivocada de una persona.", "Interpretar que el máximo de equipos es 6."],
            ["Defecto", "Problema en un requisito, diseño, código u otro producto de trabajo.", "Escribir cantidad <= 6 cuando el máximo acordado es 5."],
            ["Fallo observable", "Comportamiento que incumple lo esperado al ejecutar.", "La aplicación confirma un préstamo de 6 equipos."],
            ["Oráculo", "Fuente que permite decidir qué resultado es correcto.", "Regla acordada: cantidades enteras entre 1 y 5."],
            ["Aserción", "Comprobación concreta contra ese oráculo.", "Para cantidad 6, afirmar que se rechaza."],
            ["Depuración", "Investigar la causa de un fallo y corregirla.", "Localizar el límite equivocado y cambiarlo; después repetir las pruebas."]
        ]
    },
    {
        type: "comparison", title: "Distinciones que evitan confusiones",
        headers: ["Distinción", "Primera idea", "Segunda idea"],
        rows: [
            ["Verificación / validación", "Verificación: ¿cumple las especificaciones acordadas?", "Validación: ¿resuelve la necesidad real en su contexto de uso?"],
            ["Pruebas estáticas / dinámicas", "Estáticas: revisar requisitos, código o diseño sin ejecutarlo.", "Dinámicas: ejecutar el producto y observar sus resultados."],
            ["Revisión humana / análisis estático", "Una persona busca ambigüedades, omisiones y problemas de diseño.", "Una herramienta detecta patrones concretos; sus hallazgos requieren interpretación."],
            ["Manual / automatizada", "Una persona ejecuta y observa; también explora y evalúa usabilidad.", "Un programa prepara, actúa y compara repetidamente."],
            ["Funcional / no funcional", "Qué hace: aceptar una cantidad y registrar un préstamo.", "Cómo lo hace: tiempo, accesibilidad, seguridad y recuperación."]
        ]
    },
    {
        type: "alert", variant: "info", title: "Requisito, historia y criterio de aceptación",
        body: "El requisito expresa una condición que debe cumplirse. La historia de usuario comunica quién necesita algo y para qué. El criterio de aceptación concreta cuándo se considera satisfecho. Ejemplo: «Como encargado quiero limitar los préstamos para distribuir equipos» necesita criterios como «6 se rechaza y no altera existencias». «Debe funcionar bien» no es un oráculo comprobable."
    },
    {
        type: "comparison", title: "Siete principios para interpretar las pruebas",
        headers: ["Principio", "Consecuencia práctica"],
        rows: [
            ["Revelan defectos; no demuestran su ausencia", "Una suite verde reduce incertidumbre dentro de su alcance."],
            ["Probarlo todo no es viable", "Selecciona casos por reglas, técnicas y riesgo."],
            ["Probar temprano ahorra correcciones posteriores", "Revisa ejemplos y requisitos antes de implementar; esto es parte de shift-left."],
            ["Los defectos suelen concentrarse", "Investiga componentes con fallos recurrentes sin abandonar los demás."],
            ["Las pruebas pierden eficacia si nunca evolucionan", "Revisa datos, escenarios y riesgos al cambiar el producto."],
            ["Dependen del contexto", "Un prototipo y un sistema de pagos necesitan estrategias distintas."],
            ["Ausencia de fallos conocidos no equivale a utilidad", "Un producto sin errores detectados puede resolver la necesidad equivocada."]
        ]
    },
    {
        type: "steps", title: "El proceso de pruebas dentro del desarrollo",
        steps: [
            { title: "Planificar y analizar", desc: "Define objetivo, alcance, requisitos, riesgos, recursos y criterios de entrada y salida. La base de prueba incluye historias, reglas, diseños, contratos y defectos conocidos." },
            { title: "Diseñar e implementar pruebas", desc: "Selecciona técnicas, entradas, resultados esperados, ambiente y datos. Convierte los casos elegidos en procedimientos manuales o pruebas automatizadas." },
            { title: "Ejecutar, comparar y registrar", desc: "Guarda versión, datos, esperado, observado y resultado. Distingue fallos del producto de errores de prueba o ambiente." },
            { title: "Controlar y cerrar", desc: "Durante todo el trabajo revisa progreso y riesgo. Al cerrar informa qué se probó, qué no, defectos abiertos y quién acepta el riesgo residual." }
        ]
    },
    {
        type: "alert", variant: "warning", title: "Práctica breve: explica la cadena causal",
        body: "Supón que alguien interpreta mal el máximo, escribe <= 6 y una solicitud de 6 se aprueba. Identifica error, defecto y fallo. Solución: interpretación → condición incorrecta → aprobación observable. Una solicitud de 3 no revelaría ese defecto. Transfiere la explicación a una regla de tu proyecto y guárdala con el plan ART-TEST-01."
    }
);
window.MODULES["m-piramide"].title = "Diseño de casos y niveles de prueba";
window.MODULES["m-piramide"].intro = "Antes de automatizar, decide qué riesgo quieres detectar y cómo reconocer el resultado correcto. Usa las técnicas de diseño para elegir casos; después selecciona el nivel de prueba y la herramienta.";
window.MODULES["m-piramide"].blocks.unshift(
    {
        type: "alert", variant: "info", title: "Contrato del caso conductor",
        body: "Caso ficticio: el préstamo acepta cantidades de tipo entero entre 1 y 5. Además exige permiso y suficientes equipos. Al rechazar no crea un préstamo ni cambia existencias. Al aceptar reserva la cantidad. Los ejemplos iniciales aíslan la cantidad; luego combinamos permiso y disponibilidad. Duración didáctica de diseño y prueba manual: 30–45 minutos."
    },
    {
        type: "comparison", title: "Técnicas de diseño: qué son y cómo se aplican",
        headers: ["Técnica", "Qué selecciona", "Ejemplo resuelto"],
        rows: [
            ["Particiones de equivalencia · caja negra", "Divide entradas que deberían recibir el mismo tratamiento y elige representantes.", "Enteros menores de 1, entre 1 y 5, mayores de 5 y tipos incorrectos. Representantes: -2, 3, 8 y texto."],
            ["Valores límite · caja negra", "Busca errores en fronteras y valores vecinos.", "Con tres valores por frontera: 0, 1, 2 y 4, 5, 6. Aquí se exige dominio entero."],
            ["Tabla de decisión · caja negra", "Combina condiciones para comprobar reglas conjuntas.", "Con cantidad válida: permiso sí/no × disponibilidad suficiente/insuficiente."],
            ["Transiciones de estado · caja negra", "Comprueba eventos permitidos y prohibidos según el estado anterior.", "Un préstamo devuelto no puede devolverse otra vez."],
            ["Sentencias y ramas · caja blanca", "Usa la estructura interna del código para orientar casos.", "Ejecutar tanto aceptar como rechazar en una condición; ver Cobertura."],
            ["Basadas en experiencia", "Usa fallos conocidos, listas de comprobación y exploración.", "Pegar espacios, enviar dos veces o recargar durante una solicitud."],
            ["Combinatoria por pares · ampliación", "Cubre pares de valores de varios factores con menos combinaciones.", "Navegador × rol × estado. No garantiza detectar interacciones de tres o más factores."]
        ]
    },
    {
        type: "comparison", title: "Tabla de decisión resuelta: permiso y disponibilidad",
        headers: ["Permiso", "Equipos suficientes", "Decisión", "Efecto esperado"],
        rows: [
            ["Sí", "Sí", "Aceptar", "Crear un préstamo y descontar la cantidad una sola vez."],
            ["Sí", "No", "Rechazar", "No crear; mantener disponibilidad."],
            ["No", "Sí", "Denegar", "No crear; mantener disponibilidad."],
            ["No", "No", "Denegar", "No crear; no revelar datos restringidos."]
        ]
    },
    {
        type: "comparison", title: "Modelo de estados resuelto",
        headers: ["Estado inicial", "Evento", "Estado final esperado", "Regla"],
        rows: [
            ["Solicitado", "Aprobar con permiso y disponibilidad", "Aprobado", "Reserva equipos una vez."],
            ["Solicitado", "Cancelar", "Cancelado", "No reserva equipos."],
            ["Aprobado", "Devolver", "Devuelto", "Libera solo la cantidad reservada."],
            ["Devuelto", "Devolver de nuevo", "Devuelto", "Rechaza repetición; no duplica existencias."],
            ["Cancelado", "Aprobar", "Cancelado", "Transición prohibida; informa rechazo."]
        ]
    },
    {
        type: "alert", variant: "info", title: "Ejercicio acompañado y solución razonada",
        body: "Con cantidad 3, permiso y solo 2 equipos, predice decisión y disponibilidad final. Solución: rechazar y conservar 2. Sin permiso tampoco debe cambiar nada. Ahora diseña por tu cuenta los casos para devolver dos veces: debes comprobar el mensaje y que las existencias no aumenten por segunda vez. Registra estas reglas como supuestos hasta validarlas con el responsable de tu proyecto."
    }
);
