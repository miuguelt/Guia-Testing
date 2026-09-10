# Auditoría de arranque de la Guía de Testing

## Hallazgos comprobados

1. `start-windows.ps1 -Status` dependía de `Get-NetTCPConnection`, un cmdlet que no
   está disponible en todas las instalaciones de PowerShell. En ese caso informaba
   `OFFLINE` aunque el servidor respondiera en el puerto configurado.
2. El punto de entrada raíz contenía una versión reducida y antigua de la guía. Abrir
   `index.html` podía mostrar cuatro secciones distintas de la entrada canónica declarada
   en `guide.manifest.json` (`web/index.html`).
3. `docker-compose.yml` usaba `expose: 80`, suficiente para la red interna de Compose,
   pero insuficiente para abrir la guía desde el navegador del equipo anfitrión.

## Correcciones aplicadas

- El estado y la prevención de instancias duplicadas usan una conexión TCP local con
  `System.Net.Sockets.TcpClient`, sin depender del módulo `NetTCPIP`.
- El script acepta `-Port`, detecta si ya está activa esta guía y rechaza de forma clara
  la colisión con otro servicio. `-Stop` solo intenta detener procesos Python que
  coinciden con el servidor HTTP de esta guía y su carpeta `web`.
- `index.html` redirige a `web/index.html`, que es la única entrada completa declarada.
- Compose publica `${GUIDE_HOST_PORT:-8035}:80`, con posibilidad de elegir otro puerto
  sin editar archivos.

## Verificación

- `pytest -q tests/test_startup.py`: 3 pruebas en verde.
- `pytest -q`: suite completa en verde.
- `node --check web/js/*.js`: archivos JavaScript sin errores sintácticos.
- Recorrido de los 20 hash de navegación de la guía en navegador local: todas las
  secciones existen, quedan activas y no generan errores de consola.
- Arranque repetido: la segunda ejecución reutiliza la instancia existente.
- Estado: informa `ONLINE` cuando la guía responde y `OFFLINE` cuando el puerto está libre.

## Opciones de mejora

### Próxima prioridad: humo automatizado en CI

Levantar el servidor estático en un trabajo de integración y verificar que `/index.html`,
los archivos JavaScript principales y el enlace ZIP devuelvan HTTP 200. Complementarlo
con un recorrido Playwright corto que abra la entrada, cambie a un módulo y confirme que
no hay errores de consola.

### Siguiente etapa: contrato de publicación

Validar en CI que cada archivo referenciado por `web/index.html` exista y que el manifiesto,
el registro de evidencias y la ruta publicada sigan siendo coherentes. Esto previene que
la aplicación “arranque” con módulos o recursos faltantes.

### Mejora opcional: servidor de desarrollo dedicado

Adoptar un servidor con recarga automática solo si la guía empieza a necesitar módulos,
transformación o rutas de desarrollo. Para una guía estática y sin dependencias de red,
Python y Nginx son actualmente opciones más simples y reproducibles.

### Operación en despliegue

Conservar el `HEALTHCHECK` de Nginx y añadir una prueba posterior al despliegue que valide
la respuesta HTTP pública, no solo que el contenedor esté en ejecución. En Coolify, el
puerto interno debe seguir siendo 80; `GUIDE_HOST_PORT` aplica al uso local con Compose.

