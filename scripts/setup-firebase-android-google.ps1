param(
  [string[]]$Sha1 = @(
    "5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25"
  ),
  [string]$PackageName = "com.filipecalm.mobile",
  [string]$AppName = "DietOS"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$debugSha = "5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25"
$shaToRegister = [System.Collections.Generic.List[string]]::new()
foreach ($item in $Sha1) {
  foreach ($part in ($item -split ",")) {
    $t = $part.Trim()
    if ($t) { $shaToRegister.Add($t) }
  }
}
if (-not ($shaToRegister | Where-Object { ($_ -replace ":", "").ToLower() -eq ($debugSha -replace ":", "").ToLower() })) {
  $shaToRegister.Add($debugSha)
}

function Invoke-FirebaseJson {
  param([Parameter(Mandatory)][string[]]$Args)
  $tmp = [System.IO.Path]::GetTempFileName()
  try {
    $argStr = ($Args + @("--json")) -join " "
    cmd /c "firebase $argStr > `"$tmp`" 2>nul"
    if ($LASTEXITCODE -ne 0) {
      throw "firebase $argStr (exit $LASTEXITCODE)"
    }
    $raw = Get-Content -Path $tmp -Raw -Encoding UTF8
    if ([string]::IsNullOrWhiteSpace($raw)) {
      throw "firebase JSON vazio: $argStr"
    }
    return $raw | ConvertFrom-Json
  } finally {
    Remove-Item $tmp -Force -ErrorAction SilentlyContinue
  }
}

function Invoke-FirebaseShaCreate {
  param([string]$AppId, [string]$Sha)
  $sha = $Sha.Trim()
  cmd /c "firebase apps:android:sha:create $AppId `"$sha`" 2>nul"
  if ($LASTEXITCODE -eq 0) { return $true }
  if ($LASTEXITCODE -eq 2) { return $false }
  throw "firebase apps:android:sha:create (exit $LASTEXITCODE) SHA=$sha"
}

$apps = Invoke-FirebaseJson -Args @("apps:list", "ANDROID")
$appId = $apps.result | Where-Object { $_.packageName -eq $PackageName } | Select-Object -ExpandProperty appId -First 1

if (-not $appId) {
  Write-Host "A criar app Android no Firebase ($PackageName)..." -ForegroundColor Cyan
  $created = Invoke-FirebaseJson -Args @("apps:create", "ANDROID", $AppName, "--package-name", $PackageName)
  $appId = $created.result.appId
  Write-Host "+ App ID: $appId"
}

$shaList = Invoke-FirebaseJson -Args @("apps:android:sha:list", $appId)
foreach ($oneSha in $shaToRegister) {
  $normalized = ($oneSha -replace ":", "").ToLower()
  $hasSha = $shaList.result | Where-Object { $_.shaHash -eq $normalized }
  if ($hasSha) {
    Write-Host "SHA-1 ja registado: $oneSha"
    continue
  }
  Write-Host "A registar SHA-1 $oneSha ..." -ForegroundColor Cyan
  $added = Invoke-FirebaseShaCreate -AppId $appId -Sha $oneSha
  if ($added) {
    Write-Host "+ SHA-1 registado"
  } else {
    Write-Host "SHA-1 ignorado (ja existia no Firebase): $oneSha"
  }
  $shaList = Invoke-FirebaseJson -Args @("apps:android:sha:list", $appId)
}

$outFile = Join-Path $root "google-services.json"
if (Test-Path $outFile) { Remove-Item $outFile -Force }
cmd /c "firebase apps:sdkconfig ANDROID $appId --out `"$outFile`" 2>nul"
if ($LASTEXITCODE -ne 0) { throw "firebase apps:sdkconfig (exit $LASTEXITCODE)" }

$androidAppFile = Join-Path $root "android\app\google-services.json"
if (Test-Path (Join-Path $root "android\app")) {
  Copy-Item $outFile $androidAppFile -Force
  Write-Host "+ android\app\google-services.json"
}

Write-Host "+ $outFile"
Write-Host ""
Write-Host "Pronto. Seguinte: npm run build:android" -ForegroundColor Cyan
