function Write-FirebaseSecretFile {
  param([string]$Path, [string]$Value)
  $utf8NoBom = New-Object System.Text.UTF8Encoding $false
  [System.IO.File]::WriteAllText($Path, $Value, $utf8NoBom)
}
