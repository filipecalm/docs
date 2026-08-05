#Requires -RunAsAdministrator
$ErrorActionPreference = 'Stop'

$nvmeDisk = Get-Disk | Where-Object { $_.FriendlyName -like '*NX-512*' } | Select-Object -First 1
if (-not $nvmeDisk) { throw 'Disco NX-512 nao encontrado.' }

$cPart = Get-Partition -DiskNumber $nvmeDisk.Number | Where-Object { $_.DriveLetter -eq 'C' }
if (-not $cPart) { throw 'Particao C: nao esta no NX-512. Abortando.' }

$existingEfi = Get-Partition -DiskNumber $nvmeDisk.Number | Where-Object {
  $_.GptType -eq '{c12a7328-f81f-11d2-ba4b-00a0c93ec93b}'
}
if ($existingEfi) {
  Write-Host 'EFI ja existe no NX-512. So vou recriar o BCD.'
  $letter = 'S'
  if ($existingEfi.DriveLetter) {
    $letter = $existingEfi.DriveLetter
  } else {
    Set-Partition -DiskNumber $nvmeDisk.Number -PartitionNumber $existingEfi.PartitionNumber -NewDriveLetter $letter
  }
  bcdboot C:\Windows /s "${letter}:" /f UEFI
  if (-not $existingEfi.DriveLetter) {
    Remove-PartitionAccessPath -DiskNumber $nvmeDisk.Number -PartitionNumber $existingEfi.PartitionNumber -AccessPath "${letter}:\"
  }
  Write-Host 'Pronto. No BIOS, boot pelo NX-512 (NVMe). Pode tirar o P3-512.'
  exit 0
}

$efiSize = 300MB
$newSize = $cPart.Size - $efiSize
Write-Host "Encolhendo C: em 300MB (de $($cPart.Size) para $newSize)..."
Resize-Partition -DriveLetter C -Size $newSize

Write-Host 'Criando particao EFI FAT32...'
$efi = New-Partition -DiskNumber $nvmeDisk.Number -Size $efiSize -GptType '{c12a7328-f81f-11d2-ba4b-00a0c93ec93b}'
Format-Volume -Partition $efi -FileSystem FAT32 -NewFileSystemLabel 'SYSTEM' -Confirm:$false | Out-Null
Set-Partition -DiskNumber $nvmeDisk.Number -PartitionNumber $efi.PartitionNumber -NewDriveLetter S

Write-Host 'Gravando boot files com bcdboot...'
bcdboot C:\Windows /s S: /f UEFI
if ($LASTEXITCODE -ne 0) { throw "bcdboot falhou com codigo $LASTEXITCODE" }

Remove-PartitionAccessPath -DiskNumber $nvmeDisk.Number -PartitionNumber $efi.PartitionNumber -AccessPath 'S:\'

Write-Host ''
Write-Host 'OK. EFI agora esta no proprio NX-512.'
Write-Host '1) Reinicie e entre no BIOS/UEFI'
Write-Host '2) Coloque NX-512 2280 como primeiro boot device'
Write-Host '3) Desligue, remova o P3-512 se quiser, e ligue de novo'
Write-Host 'O Windows em C: deve subir sozinho.'
