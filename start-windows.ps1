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
  SENA ADSO - Guia Testing v1.0" -ForegroundColor Cyan
Write-Host "  http://localhost:$Port
" -ForegroundColor Green

# live-server con recarga automática nativa (WebSocket en puerto $Port)
& "npx" -y live-server $WebDir --port=$Port --no-browser
