$ErrorActionPreference = "Stop"

$ProjectRoot = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$VenvPython = Join-Path $ProjectRoot ".venv\Scripts\python.exe"

Write-Host "Preparando el proyecto de práctica..." -ForegroundColor Cyan
& python -m venv (Join-Path $ProjectRoot ".venv")
& $VenvPython -m pip install --upgrade pip
& $VenvPython -m pip install -r (Join-Path $ProjectRoot "requirements.txt")
& npm ci --prefix $ProjectRoot
& npx --prefix $ProjectRoot playwright install chromium

Write-Host "Listo. Activa el entorno con .\.venv\Scripts\Activate.ps1." -ForegroundColor Green
Write-Host "Antes de ejecutar E2E define FLASK_SECRET_KEY en esta ventana." -ForegroundColor Yellow
