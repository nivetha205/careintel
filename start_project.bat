@echo off
SETLOCAL EnableDelayedExpansion

echo [CareIntel AI] Starting Healthcare System...
echo [CareIntel AI] - Backend: FastAPI (Port 8000)
echo [CareIntel AI] - Frontend: Next.js (Port 3000)

:: Start Backend
cd backend
echo [CareIntel AI] Starting Backend service...
start "CareIntel Backend" cmd /k "python -m pip install -r requirements.txt && python main.py"

:: Start Frontend
cd ../frontend
echo [CareIntel AI] Starting Frontend service...
start "CareIntel Frontend" cmd /k "npm install --no-fund && npm run dev"

:: Launch browser after a short delay
echo [CareIntel AI] Opening Dashboard in browser...
timeout /t 5 /nobreak > nul
start http://localhost:3000

echo.
echo [CareIntel AI] Both servers are launching in separate windows.
echo [CareIntel AI] Please check the new windows for any startup logs.
echo.
pause
