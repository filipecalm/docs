@echo off
setlocal
cd /d "%~dp0.."
if "%~1"=="" (
  echo.
  echo Uso:
  echo   scripts\set-titan-contact-secrets.cmd SENHA_TITAN
  echo.
  echo Senha com # ou %% — nao uses CMD/npm. Usa:
  echo   powershell -NoProfile -ExecutionPolicy Bypass -File scripts\set-titan-contact-secrets.ps1 -SmtpPassword 'SUA_SENHA'
  echo.
  exit /b 1
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0set-titan-contact-secrets.ps1" -SmtpPassword "%~1"
exit /b %ERRORLEVEL%
