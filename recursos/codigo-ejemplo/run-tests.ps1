[CmdletBinding()]
param(
    [switch]$SkipJava,
    [switch]$SkipE2E,
    [switch]$Coverage
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ProjectRoot = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$Python = Join-Path $ProjectRoot ".venv\Scripts\python.exe"
$Failures = [System.Collections.Generic.List[string]]::new()

function Invoke-Check {
    param(
        [Parameter(Mandatory)] [string]$Name,
        [Parameter(Mandatory)] [scriptblock]$Command
    )

    Write-Host "`n▶ $Name" -ForegroundColor Cyan
    try {
        & $Command
        $ExitCode = if ($null -eq $LASTEXITCODE) { 0 } else { $LASTEXITCODE }
        if ($ExitCode -ne 0) {
            throw "El comando terminó con código $ExitCode."
        }
        Write-Host "✓ $Name" -ForegroundColor Green
    } catch {
        $Failures.Add($Name)
        Write-Host "✗ $($Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Test-CommandAvailable {
    param([Parameter(Mandatory)] [string]$Name)
    return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

Push-Location $ProjectRoot
try {
    if (-not (Test-Path -LiteralPath $Python)) {
        Write-Error "No existe .venv. Ejecuta .\setup-windows.ps1 y vuelve a intentarlo."
    }
    if (-not (Test-CommandAvailable "npm")) {
        Write-Error "No se encontró npm. Instala Node.js 20 o posterior y vuelve a intentarlo."
    }

    Invoke-Check "Python: unitarias e integración" {
        & $Python -m pytest tests -v
    }

    if ($Coverage) {
        Invoke-Check "Python: compuerta de cobertura (mínimo 80 %)" {
            & $Python -m pytest tests --cov=services --cov=routers --cov=schemas --cov-fail-under=80 --cov-report=term-missing
        }
    }

    Invoke-Check "Python: escenarios BDD con Behave" {
        & $Python -m behave -q
    }

    Invoke-Check "JavaScript: componentes React con Vitest" {
        & npm test
    }

    if ($SkipJava) {
        Write-Host "↷ Java omitido por solicitud (-SkipJava)." -ForegroundColor Yellow
    } elseif (Test-CommandAvailable "mvn") {
        Invoke-Check "Java: JUnit 5 y JaCoCo" {
            & mvn --batch-mode test jacoco:report
        }
    } else {
        $Failures.Add("Java: JUnit 5 y JaCoCo")
        Write-Host "✗ No se encontró Maven. Instala JDK 21 + Maven o usa -SkipJava." -ForegroundColor Red
    }

    if ($SkipE2E) {
        Write-Host "↷ E2E omitido por solicitud (-SkipE2E)." -ForegroundColor Yellow
    } else {
        if (-not $env:FLASK_SECRET_KEY) {
            $env:FLASK_SECRET_KEY = [guid]::NewGuid().ToString("N")
        }
        Invoke-Check "E2E: Flask/Jinja con Playwright" {
            & npm run e2e
        }
    }

    if ($Failures.Count -gt 0) {
        Write-Error ("La suite terminó con fallos: " + ($Failures -join "; "))
    }

    Write-Host "`n✅ Todas las verificaciones solicitadas terminaron correctamente." -ForegroundColor Green
} finally {
    Pop-Location
}
