@echo off
setlocal
cd /d "%~dp0.."
if "%~1"=="" (
  echo.
  echo Uso:
  echo   scripts\verify-user.cmd user@example.com
  echo   scripts\verify-user.cmd UID_DO_FIREBASE
  echo   npm run verify:user -- user@example.com
  echo.
  echo Requer GOOGLE_APPLICATION_CREDENTIALS ou gcloud application-default login.
  echo.
  exit /b 1
)
node functions\scripts\verify-user.cjs %*
exit /b %ERRORLEVEL%
