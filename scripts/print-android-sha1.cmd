@echo off
cd /d "%~dp0.."
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0print-android-sha1.ps1"
exit /b %ERRORLEVEL%
