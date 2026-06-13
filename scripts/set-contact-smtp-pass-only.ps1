param(
  [Parameter(Mandatory = $true)]
  [string]$SmtpPassword
)

$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)
. (Join-Path $PSScriptRoot "Write-FirebaseSecretFile.ps1")

$tmp = Join-Path $env:TEMP "fb-secret-CONTACT_SMTP_PASS.txt"
Write-FirebaseSecretFile -Path $tmp -Value $SmtpPassword
firebase functions:secrets:set CONTACT_SMTP_PASS --data-file $tmp
if ($LASTEXITCODE -ne 0) { throw "firebase secrets:set CONTACT_SMTP_PASS failed" }
Remove-Item $tmp -Force -ErrorAction SilentlyContinue
Write-Host "OK: CONTACT_SMTP_PASS (sem BOM UTF-8). Corre: npm run deploy:functions"
