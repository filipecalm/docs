@echo off
setlocal
cd /d "%~dp0.."
if "%~1"=="" (
  echo.
  echo Uso:
  echo   scripts\set-google-web-client-id.cmd WEB_CLIENT_ID.apps.googleusercontent.com
  echo.
  echo Copia o ID em Firebase Console - Authentication - Google - Web SDK.
  echo.
  exit /b 1
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0set-google-web-client-id.ps1" -WebClientId "%~1"
exit /b %ERRORLEVEL%
