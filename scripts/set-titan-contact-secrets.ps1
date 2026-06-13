param(
  [Parameter(Mandatory = $true)]
  [string]$SmtpPassword,
  [string]$SmtpHost = "smtp.titan.email",
  [string]$SmtpPort = "465",
  [string]$SmtpUser = "admin@dietos.com.br",
  [string]$FromEmail = "admin@dietos.com.br"
)

$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)
. (Join-Path $PSScriptRoot "Write-FirebaseSecretFile.ps1")

function Set-FbSecret([string]$Name, [string]$Value) {
  $tmp = Join-Path $env:TEMP "fb-secret-$Name.txt"
  Write-FirebaseSecretFile -Path $tmp -Value $Value
  firebase functions:secrets:set $Name --data-file $tmp
  if ($LASTEXITCODE -ne 0) { throw "firebase secrets:set $Name failed" }
  Remove-Item $tmp -Force -ErrorAction SilentlyContinue
  Write-Host "+ $Name"
}

Set-FbSecret "CONTACT_SMTP_HOST" $SmtpHost
Set-FbSecret "CONTACT_SMTP_PORT" $SmtpPort
Set-FbSecret "CONTACT_SMTP_USER" $SmtpUser
Set-FbSecret "CONTACT_SMTP_PASS" $SmtpPassword
Set-FbSecret "CONTACT_FROM_EMAIL" $FromEmail

Write-Host ""
Write-Host "Secrets SMTP (Titan) atualizados: $SmtpUser @ ${SmtpHost}:$SmtpPort"
Write-Host "Agora: npm run deploy:functions"
