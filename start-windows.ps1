param(
    [switch]$Stop,
    [switch]$Status,
    [ValidateRange(1, 65535)]
    [int]$Port = 8035
)

$WebDir = Join-Path $PSScriptRoot "web"
$GuideUrl = "http://localhost:$Port/index.html"
$GuideProbeUrl = "http://127.0.0.1:$Port/index.html"

function Test-PortInUse {
    # Get-NetTCPConnection no está disponible en algunas instalaciones de
    # PowerShell. La conexión TCP local funciona sin depender del módulo NetTCPIP.
    $client = [System.Net.Sockets.TcpClient]::new()
    try {
        $connection = $client.ConnectAsync("127.0.0.1", $Port)
        return $connection.Wait(500) -and $client.Connected
    }
    catch {
        return $false
    }
    finally {
        $client.Dispose()
    }
}

function Test-GuideHttp {
    try {
        $response = Invoke-WebRequest -Uri $GuideProbeUrl -UseBasicParsing -TimeoutSec 2
        return $response.StatusCode -eq 200 -and
            $response.Content -match "Guía de Testing y QA" -and
            $response.Content -match "js/main\.js"
    }
    catch {
        return $false
    }
}

function Stop-GuideServer {
    $escapedWebDir = [Regex]::Escape($WebDir.TrimEnd("\"))
    $pattern = "(?i)-m\s+http\.server\s+$Port(\s|$)"
    $servers = @(
        Get-CimInstance Win32_Process -Filter "Name = 'python.exe'" -ErrorAction SilentlyContinue |
            Where-Object {
                $_.CommandLine -and
                $_.CommandLine -match $pattern -and
                $_.CommandLine -match $escapedWebDir
            }
    )

    if (-not $servers) {
        Write-Host "No se encontró una instancia de la guía en el puerto $Port." -ForegroundColor Yellow
        return
    }

    foreach ($server in $servers) {
        Stop-Process -Id $server.ProcessId -Force -ErrorAction Stop
    }
    Write-Host "Servidor de la guía detenido en el puerto $Port." -ForegroundColor Yellow
}

if ($Status) {
    if (Test-PortInUse) {
        if (Test-GuideHttp) {
            Write-Host "ONLINE - Guía disponible en $GuideUrl" -ForegroundColor Green
        }
        else {
            Write-Host "EN USO - El puerto $Port responde, pero no parece ser esta guía." -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "OFFLINE - Puerto $Port libre" -ForegroundColor Yellow
    }
    exit
}

if ($Stop) {
    Stop-GuideServer
    exit
}

if (Test-PortInUse) {
    if (Test-GuideHttp) {
        Write-Host "La guía ya está disponible en $GuideUrl" -ForegroundColor Green
        exit
    }
    throw "El puerto $Port ya está ocupado por otro servicio. Usa -Port con un puerto libre o detén el servicio que lo ocupa."
}

Write-Host "
  Guia Testing QA v3.0" -ForegroundColor Cyan
Write-Host "  $GuideUrl
" -ForegroundColor Green

# Primero intenta servir la guía con el servidor estático incluido en Python,
# sin descargar paquetes. Usa live-server como alternativa si Python no está disponible.
$Python = Get-Command python -ErrorAction SilentlyContinue
if ($Python) {
    & $Python.Source -m http.server $Port --directory $WebDir
    exit $LASTEXITCODE
}

Write-Warning "Python no está disponible; se usará live-server mediante npx y puede requerir internet."
& "npx" -y live-server $WebDir --port=$Port --no-browser
