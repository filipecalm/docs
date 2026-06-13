@echo off
setlocal
cd /d "%~dp0.."
if "%~1"=="" (
  echo.
  echo Uso: scripts\register-google-sha1.cmd SHA-1_DO_EAS
  echo.
  echo Copia o SHA1 Fingerprint em: eas credentials - Keystore - production
  echo Nao precisas da Play Console.
  echo.
  exit /b 1
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup-firebase-android-google.ps1" -Sha1 "%~1"
exit /b %ERRORLEVEL%
