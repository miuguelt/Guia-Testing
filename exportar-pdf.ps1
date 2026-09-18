param(
    [string]$OutputFile = (Join-Path $PSScriptRoot "registro_evidencias_sena.pdf"),
    [string]$InputHtml = "",
    [int]$Port = 8080
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "📄 Estandarización de Exportación a PDF (SENA QA)..." -ForegroundColor Green

# 1. Resolver ejecutable de navegador compatible con headless print-to-pdf
$BrowserPath = $null
$BrowserCandidates = @(
    (Join-Path ${env:ProgramFiles(x86)} "Microsoft\Edge\Application\msedge.exe"),
    (Join-Path $env:ProgramFiles "Microsoft\Edge\Application\msedge.exe"),
    (Join-Path $env:ProgramFiles "Google\Chrome\Application\chrome.exe"),
    (Join-Path ${env:ProgramFiles(x86)} "Google\Chrome\Application\chrome.exe"),
    (Get-Command msedge.exe -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source -ErrorAction SilentlyContinue),
    (Get-Command chrome.exe -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source -ErrorAction SilentlyContinue)
)

foreach ($candidate in $BrowserCandidates) {
    if ($candidate -and (Test-Path -LiteralPath $candidate)) {
        $BrowserPath = $candidate
        break
    }
}

if (-not $BrowserPath) {
    Write-Warning "No se encontró Microsoft Edge ni Google Chrome para la generación desatendida de PDF."
    Write-Host "Para generar el PDF manualmente:" -ForegroundColor Cyan
    Write-Host "1. Abre la guía en tu navegador: http://localhost:$Port/#m-evidencias-sena"
    Write-Host "2. Haz clic en '🖨️ Imprimir PDF' en la barra superior o presiona Ctrl+P."
    Write-Host "3. Selecciona 'Guardar como PDF' en tamaño Carta."
    exit 0
}

Write-Host "   Navegador detectado: $BrowserPath" -ForegroundColor DarkGray

# 2. Determinar la URL / Archivo objetivo
$TargetUri = ""
$ServerProcess = $null

try {
    if ($InputHtml -and (Test-Path -LiteralPath $InputHtml)) {
        $TargetUri = ([System.Uri](Resolve-Path -LiteralPath $InputHtml).Path).AbsoluteUri
        Write-Host "   Procesando archivo HTML exportado: $InputHtml" -ForegroundColor DarkGray
    } else {
        # Verificar si el servidor local ya está respondiendo
        $ServerActive = $false
        try {
            $tcp = New-Object System.Net.Sockets.TcpClient
            $asyncResult = $tcp.BeginConnect("127.0.0.1", $Port, $null, $null)
            $waitSuccess = $asyncResult.AsyncWaitHandle.WaitOne(300, $false)
            if ($waitSuccess -and $tcp.Connected) {
                $ServerActive = $true
                $tcp.EndConnect($asyncResult)
            }
            $tcp.Close()
        } catch {
            $ServerActive = $false
        }

        if (-not $ServerActive) {
            Write-Host "   Iniciando servidor local temporal en puerto $Port..." -ForegroundColor DarkGray
            $WebDir = Join-Path $PSScriptRoot "web"
            $ServerProcess = Start-Process -FilePath "python" -ArgumentList "-m", "http.server", "$Port", "--directory", "$WebDir" -PassThru -WindowStyle Hidden
            Start-Sleep -Milliseconds 800
        }

        $TargetUri = "http://127.0.0.1:$Port/#m-evidencias-sena"
    }

    $ResolvedOut = if ([System.IO.Path]::IsPathRooted($OutputFile)) {
        $OutputFile
    } else {
        Join-Path $PSScriptRoot $OutputFile
    }
    $ResolvedOut = [System.IO.Path]::GetFullPath($ResolvedOut)
    $OutDir = Split-Path -Parent $ResolvedOut
    if ($OutDir -and -not (Test-Path -LiteralPath $OutDir)) {
        New-Item -ItemType Directory -Path $OutDir -Force | Out-Null
    }

    Write-Host "   Generando PDF estandarizado en: $ResolvedOut..." -ForegroundColor Cyan

    $ProcessArgs = @(
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        "--print-to-pdf-no-header",
        "--virtual-time-budget=3000",
        "--run-all-compositor-stages-before-draw",
        "--print-to-pdf=`"$ResolvedOut`"",
        "`"$TargetUri`""
    )

    $PrintProcess = Start-Process -FilePath $BrowserPath -ArgumentList $ProcessArgs -PassThru -Wait -NoNewWindow
    if ($PrintProcess.ExitCode -eq 0 -and (Test-Path -LiteralPath $ResolvedOut)) {
        $FileSize = (Get-Item -LiteralPath $ResolvedOut).Length
        Write-Host "✅ PDF generado con éxito: $ResolvedOut ($([math]::Round($FileSize / 1KB, 1)) KB)" -ForegroundColor Green
    } else {
        Write-Warning "El proceso del navegador finalizó con código $($PrintProcess.ExitCode), pero verifique si se creó el archivo."
    }
}
finally {
    if ($ServerProcess -and -not $ServerProcess.HasExited) {
        Stop-Process -Id $ServerProcess.Id -Force -ErrorAction SilentlyContinue
    }
}
