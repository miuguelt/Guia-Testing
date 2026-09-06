param(
    [string]$OutputPath = "$env:TEMP\guia-testing.zip"
)

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$SourceDir = Join-Path $ProjectRoot "recursos\codigo-ejemplo"
$TempDir = Join-Path $env:TEMP "guia-testing-export"

Write-Host "📦 Exportando proyecto guia-testing..." -ForegroundColor Green

if (-not (Test-Path $SourceDir)) {
    Write-Host "❌ No se encuentra recursos/codigo-ejemplo/" -ForegroundColor Red
    exit 1
}

if (Test-Path $TempDir) { Remove-Item -Path $TempDir -Recurse -Force }
New-Item -ItemType Directory -Path $TempDir -Force | Out-Null

Write-Host "   Copiando archivos del proyecto..." -ForegroundColor DarkGray
Copy-Item -Path "$SourceDir\*" -Destination $TempDir -Recurse -Force

$exclude = @("node_modules\*", "__pycache__\*", "target\*", ".env")
foreach ($pattern in $exclude) {
    Get-ChildItem -Path $TempDir -Filter $pattern -Recurse -ErrorAction SilentlyContinue |
        Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
}

if (Test-Path $OutputPath) { Remove-Item -Path $OutputPath -Force }
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($TempDir, $OutputPath)

Remove-Item -Path $TempDir -Recurse -Force

Write-Host "✅ Proyecto exportado: $OutputPath" -ForegroundColor Green
Write-Host "   Tamaño: $( [math]::Round((Get-Item $OutputPath).Length / 1KB) ) KB" -ForegroundColor DarkGray
