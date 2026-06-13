param([switch]$ElevatedOnce)

$ErrorActionPreference = "Continue"

$principal = New-Object Security.Principal.WindowsPrincipal(
    [Security.Principal.WindowsIdentity]::GetCurrent()
)
$isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    if ($ElevatedOnce) {
        Write-Host "Erro: apos UAC o processo ainda nao e administrador. Nao vou voltar a pedir UAC (evita loop)." -ForegroundColor Red
        Write-Host "Abre PowerShell manualmente: Executar como administrador, e corre:" -ForegroundColor Yellow
        Write-Host "  Set-Service -Name WslService -StartupType Automatic -ErrorAction SilentlyContinue" -ForegroundColor Gray
        Write-Host "  Start-Service WslService -ErrorAction SilentlyContinue" -ForegroundColor Gray
        exit 1
    }
    $scriptPath = if ($PSCommandPath) { $PSCommandPath } else { $MyInvocation.MyCommand.Path }
    if (-not $scriptPath) {
        Write-Host "Nao foi possivel localizar o caminho do script." -ForegroundColor Red
        exit 1
    }
    Write-Host "A pedir UAC uma unica vez..." -ForegroundColor Yellow
    try {
        $proc = Start-Process -FilePath "powershell.exe" -Verb RunAs -Wait -PassThru `
            -ArgumentList @(
                "-NoProfile",
                "-ExecutionPolicy", "Bypass",
                "-File",
                $scriptPath,
                "-ElevatedOnce"
            )
        if ($null -ne $proc.ExitCode) { exit $proc.ExitCode }
        exit 0
    } catch {
        Write-Host "UAC cancelado ou falha: $_" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Servicos WSL (Windows 11: WslService; versoes antigas: LxssManager):`n" -ForegroundColor Cyan

foreach ($name in @("WslService", "LxssManager")) {
    $s = Get-Service -Name $name -ErrorAction SilentlyContinue
    if (-not $s) {
        Write-Host "  [$name] nao existe nesta instalacao." -ForegroundColor DarkGray
        continue
    }
    Write-Host "  [$name] estado: $($s.Status) | startup: $($s.StartType)" -ForegroundColor Yellow
    try {
        Set-Service -Name $name -StartupType Automatic -ErrorAction Stop
        Write-Host "  [$name] StartupType = Automatic" -ForegroundColor Green
    } catch {
        Write-Host "  [$name] Set-Service: $_" -ForegroundColor Red
    }
    try {
        $s2 = Get-Service -Name $name
        if ($s2.Status -ne "Running") {
            Start-Service -Name $name -ErrorAction Stop
            Write-Host "  [$name] iniciado." -ForegroundColor Green
        } else {
            Write-Host "  [$name] ja em execucao." -ForegroundColor Green
        }
    } catch {
        Write-Host "  [$name] Start-Service: $_" -ForegroundColor Red
    }
}

Write-Host "`nFecha esta janela, abre um terminal normal e testa: wsl -l -v" -ForegroundColor Cyan
