param(
    [int]$Port = 8081
)

$ErrorActionPreference = "Continue"

$listeners = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if (-not $listeners) {
    Write-Host "Porta $Port ja livre."
    exit 0
}

$pids = $listeners |
    Select-Object -ExpandProperty OwningProcess -Unique |
    Where-Object { $_ -and $_ -ne 0 }

$killed = $false
foreach ($procId in $pids) {
    $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
    if (-not $proc) { continue }
    if ($proc.ProcessName -ne "node") {
        Write-Host "Ignorado $($proc.ProcessName) (PID $procId) - nao e Metro local."
        continue
    }
    Write-Host "A parar $($proc.ProcessName) (PID $procId) na porta $Port..."
    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    $killed = $true
}

if (-not $killed) {
    Write-Host "Nenhum Metro local (node) na porta $Port."
    exit 1
}

Start-Sleep -Seconds 1

$conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($conn) {
    Write-Host "Porta $Port ainda ocupada." -ForegroundColor Red
    exit 1
}

Write-Host "Porta $Port livre." -ForegroundColor Green
exit 0
