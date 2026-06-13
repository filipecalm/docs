#Requires -RunAsAdministrator
$ErrorActionPreference = "Stop"

$lockFile = "C:\ProgramData\chocolatey\lib\baff6ea79cd1d94b1e7e4d48cf43a0027cecd5df"
if (Test-Path $lockFile) {
    Write-Host "Removing stale Chocolatey lock: $lockFile"
    Remove-Item $lockFile -Force
}

if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
    throw "Chocolatey not found. Install from https://chocolatey.org/install"
}

choco install watchman -y

$watchman = Get-Command watchman -ErrorAction SilentlyContinue
if (-not $watchman) {
    throw "watchman not on PATH. Close and reopen the terminal, then run: watchman version"
}

watchman version
Write-Host ""
Write-Host "Done. From the project root, restart Metro:"
Write-Host "  npx expo start --clear"
