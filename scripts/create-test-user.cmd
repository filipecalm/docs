@echo off
setlocal
cd /d "%~dp0.."
if "%~1"=="" (
  echo.
  echo Uso:
  echo   scripts\create-test-user.cmd --email teste@example.com
  echo   scripts\create-test-user.cmd teste@example.com [senha] [nome] [patient^|nutritionist]
  echo   npm run create:test-user -- --email teste@example.com --force
  echo.
  exit /b 1
)
node functions\scripts\create-test-user.cjs %*
exit /b %ERRORLEVEL%
