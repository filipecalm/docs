@echo off
setlocal
cd /d "%~dp0.."
if "%~1"=="" (
  echo.
  echo Uso:
  echo   scripts\set-contact-smtp-pass-only.cmd SUA_SENHA
  echo.
  echo Senha com # ou %% usa PowerShell:
  echo   powershell -NoProfile -ExecutionPolicy Bypass -File scripts\set-contact-smtp-pass-only.ps1 -SmtpPassword 'SUA_SENHA'
  echo.
  exit /b 1
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0set-contact-smtp-pass-only.ps1" -SmtpPassword "%~1"
exit /b %ERRORLEVEL%
