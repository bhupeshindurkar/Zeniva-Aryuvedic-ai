@echo off
title ZENIVA AI Assistant Server
echo ==========================================
echo       Starting ZENIVA AI Assistant...
echo ==========================================

cd /d "%~dp0"

if exist ".venv-1\Scripts\python.exe" (
    start http://127.0.0.1:5000
    .venv-1\Scripts\python.exe app.py
) else if exist "venv\Scripts\python.exe" (
    start http://127.0.0.1:5000
    venv\Scripts\python.exe app.py
) else (
    start http://127.0.0.1:5000
    python app.py
)

pause
