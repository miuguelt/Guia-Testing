param(
    [switch]$Stop,
    [switch]$Status
)

$Port = 8035
$WebDir = Join-Path $PSScriptRoot "web"

if ($Status) {
    $conn = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($conn) { Write-Host "ONLINE - Puerto $Port en uso" -ForegroundColor Green }
    else { Write-Host "OFFLINE - Puerto $Port libre" -ForegroundColor Yellow }
    exit
}

if ($Stop) {
    Get-Process -Name node,livereload -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "Servidor detenido." -ForegroundColor Yellow
    exit
}

Write-Host "
  Guia Testing QA v3.0" -ForegroundColor Cyan
Write-Host "  http://localhost:$Port
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
