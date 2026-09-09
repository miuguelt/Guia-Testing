param(
    [string]$OutputPath = (Join-Path $PSScriptRoot "web\downloads\guia-testing-qa.zip")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ProjectRoot = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$SourceDir = Join-Path $ProjectRoot "recursos\codigo-ejemplo"
$RequestedOutput = if ([System.IO.Path]::IsPathRooted($OutputPath)) {
    $OutputPath
} else {
    Join-Path $ProjectRoot $OutputPath
}
$OutputFile = [System.IO.Path]::GetFullPath($RequestedOutput)
$TempDir = Join-Path ([System.IO.Path]::GetTempPath()) "guia-testing-export-$([guid]::NewGuid().ToString('N'))"
$ExcludedDirectories = @(
    ".git", ".venv", "venv", "node_modules", "__pycache__", ".pytest_cache",
    "target", "htmlcov", "coverage", "playwright-report", "test-results", ".nyc_output"
)

Write-Host "📦 Exportando proyecto guia-testing..." -ForegroundColor Green

if (-not (Test-Path $SourceDir)) {
    throw "No se encuentra recursos/codigo-ejemplo/."
}

try {
    New-Item -ItemType Directory -Path $TempDir -Force | Out-Null
    $OutputDirectory = Split-Path -Parent $OutputFile
    New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null

    Write-Host "   Copiando archivos del proyecto..." -ForegroundColor DarkGray
    Get-ChildItem -LiteralPath $SourceDir -Force |
        Where-Object {
            -not ($_.PSIsContainer -and $ExcludedDirectories -contains $_.Name)
        } |
        ForEach-Object {
            Copy-Item -LiteralPath $_.FullName -Destination $TempDir -Recurse -Force
        }

    Get-ChildItem -LiteralPath $TempDir -Force -Directory -Recurse |
        Where-Object { $ExcludedDirectories -contains $_.Name } |
        Sort-Object { $_.FullName.Length } -Descending |
        Remove-Item -Recurse -Force

    Get-ChildItem -LiteralPath $TempDir -Force -File -Recurse |
        Where-Object {
            $_.Name -in @(".coverage", "test.db") -or
            $_.Name -like ".env*" -or
            $_.Name -like "*.db" -or
            $_.Name -like "*.sqlite" -or
            $_.Name -like "*.sqlite3" -or
            $_.Name -like "*.pyc"
        } |
        Remove-Item -Force

    if (Test-Path -LiteralPath $OutputFile) {
        Remove-Item -LiteralPath $OutputFile -Force
    }

    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::CreateFromDirectory(
        $TempDir,
        $OutputFile,
        [System.IO.Compression.CompressionLevel]::Optimal,
        $false
    )

    $sizeKb = [math]::Round((Get-Item -LiteralPath $OutputFile).Length / 1KB)
    Write-Host "✅ Proyecto exportado: $OutputFile" -ForegroundColor Green
    Write-Host "   Tamaño: $sizeKb KB" -ForegroundColor DarkGray
} catch {
    Write-Error "No fue posible exportar el proyecto: $($_.Exception.Message)"
    exit 1
} finally {
    if (Test-Path -LiteralPath $TempDir) {
        Remove-Item -LiteralPath $TempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}
