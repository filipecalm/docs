@echo off
setlocal
cd /d "%~dp0.."
if "%~1"=="" (
  echo.
  echo Uso:
  echo   scripts\set-cpanel-contact-secrets.cmd SENHA_CPANEL
  echo.
  echo Host/porta por defeito: mail.dietos.com.br:465
  echo Confirma em cPanel -^> Email Accounts -^> Connect Devices.
  echo.
  exit /b 1
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0set-cpanel-contact-secrets.ps1" -SmtpPassword "%~1"
exit /b %ERRORLEVEL%
