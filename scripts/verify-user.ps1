param(
  [Parameter(Mandatory = $true, Position = 0)]
  [string]$EmailOrUid
)

$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)

node (Join-Path $PSScriptRoot "..\functions\scripts\verify-user.cjs") $EmailOrUid
exit $LASTEXITCODE
