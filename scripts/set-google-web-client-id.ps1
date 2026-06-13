param(
  [Parameter(Mandatory = $true)]
  [string]$WebClientId
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$WebClientId = $WebClientId.Trim()
if ($WebClientId -notmatch '\.apps\.googleusercontent\.com$') {
  Write-Warning "O ID costuma terminar em .apps.googleusercontent.com (Firebase → Google → Web SDK)."
}

node (Join-Path $PSScriptRoot "set-google-web-client-id.mjs") $WebClientId
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$environments = @("production", "preview", "development")
foreach ($envName in $environments) {
  Write-Host "EAS env ($envName): EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID..." -NoNewline
  $result = cmd /c "eas env:create --name EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID --value `"$WebClientId`" --environment $envName --visibility plaintext --type string --non-interactive --force 2>&1"
  if ($LASTEXITCODE -eq 0) {
    Write-Host " OK" -ForegroundColor Green
  } else {
    Write-Host " ERRO" -ForegroundColor Red
    Write-Host $result -ForegroundColor Yellow
  }
}

Write-Host ""
Write-Host "Pronto. Reinicia o Metro (npx expo start -c) ou faz novo build EAS." -ForegroundColor Cyan
