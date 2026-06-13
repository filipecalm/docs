param(
    [string]$Environment = "production",
    [string]$EnvFile = ".env"
)

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot)

if (-not (Test-Path $EnvFile)) {
    Write-Error "Arquivo $EnvFile não encontrado."
    exit 1
}

Write-Host "EAS environment: $Environment | ficheiro: $EnvFile" -ForegroundColor Cyan
Write-Host "Isto envia variaveis EXPO_PUBLIC_* para o EAS. Backend: edita functions/.env e faz deploy das functions.`n" -ForegroundColor DarkGray

$secretVars = @(
    "GEMINI_API_KEY",
    "API_KEY"
)
$sensitiveVars = @(
    "EXPO_PUBLIC_FIREBASE_API_KEY",
    "EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY"
)
$plainVars = @(
    "EXPO_PUBLIC_BASE_URL",
    "EXPO_PUBLIC_API_URL",
    "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
    "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "EXPO_PUBLIC_FIREBASE_APP_ID",
    "EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID",
    "EXPO_PUBLIC_FIREBASE_APP_MESARUREMENT_ID",
    "EXPO_PUBLIC_ENABLE_DEV_MODE_PREMIUM",
    "EXPO_PUBLIC_STRIPE_PRICE_ID_MONTHLY",
    "EXPO_PUBLIC_STRIPE_PRICE_ID_YEARLY",
    "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID",
    "EAS_BUILD_NO_EXPO_GO_WARNING"
)

$lines = Get-Content $EnvFile

foreach ($line in $lines) {
    if ($line -match '^\s*#' -or $line.Trim() -eq '') { continue }

    if ($line -match '^\s*([^=]+?)\s*=\s*(.*)\s*$') {
        $name = $Matches[1].Trim()
        $value = $Matches[2].Trim().Trim([char]0x22)

        if ($secretVars -contains $name) {
            $visibility = "secret"
        } elseif ($sensitiveVars -contains $name) {
            $visibility = "sensitive"
        } elseif ($plainVars -contains $name) {
            $visibility = "plaintext"
        } else {
            $visibility = "sensitive"
        }

        Write-Host "Criando: $name ($visibility)..." -NoNewline

        $result = cmd /c "eas env:create --name $name --value `"$value`" --environment $Environment --visibility $visibility --type string --non-interactive --force 2>&1"

        if ($LASTEXITCODE -eq 0) {
            Write-Host " OK" -ForegroundColor Green
        } else {
            Write-Host " ERRO" -ForegroundColor Red
            Write-Host $result -ForegroundColor Yellow
        }
    }
}

Write-Host "`nPronto. Verifique em: https://expo.dev/accounts/filipecalm/projects/mobile/environment-variables" -ForegroundColor Cyan
