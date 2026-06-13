@echo off
setlocal
cd /d "%~dp0.."

echo.
echo Deploy do site dietos.com.br (pasta hosting/) na Vercel
echo.
echo Se o dominio JA esta noutro projeto Vercel, nao corras isto.
echo Em vez disso, copia hosting\vercel.json para a raiz desse projeto
echo (ou junta o bloco rewrites) e faz redeploy la.
echo.

where vercel >nul 2>&1
if errorlevel 1 (
  echo Vercel CLI nao encontrado. Instala: npm i -g vercel
  echo.
  echo Ou no dashboard Vercel:
  echo   1. Projeto do dietos.com.br -^> Settings -^> General -^> Root Directory = hosting
  echo   2. Redeploy
  exit /b 1
)

cd hosting
vercel --prod
exit /b %ERRORLEVEL%
