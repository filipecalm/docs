$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$gradlew = Join-Path $root "android\gradlew.bat"

if (-not (Test-Path $gradlew)) {
  Write-Host "Pasta android/ nao encontrada. Corre antes: npx expo prebuild" -ForegroundColor Yellow
  exit 1
}

Write-Host "SHA-1 (debug + release) - cola no Firebase Console > Configuracoes do projeto > App Android`n" -ForegroundColor Cyan
Push-Location (Join-Path $root "android")
& .\gradlew.bat signingReport 2>&1 | Select-String -Pattern "SHA1:|Variant:|Config:"
Pop-Location
