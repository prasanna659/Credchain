@echo off
REM Credchain Quick Start for Windows
REM This script opens 3 terminals for local testing

title Credchain Local Testing - Setup

echo.
echo ================================================================================
echo   Credchain Local Testing Setup
echo ================================================================================
echo.
echo This script will open 3 terminal windows for you:
echo   1. Hardhat Node (Local Blockchain on port 8545)
echo   2. FastAPI Backend (port 8000)
echo   3. Vite Frontend (port 5173)
echo.
echo Prerequisites: Node.js, Python 3.8+, npm, git
echo.

REM Check if we're in the right directory
if not exist "contracts\package.json" (
    echo Error: Not in Credchain root directory
    echo Please run this script from: d:\projects\mainprojects\Nexes\
    pause
    exit /b 1
)

REM Check prerequisites
echo Checking prerequisites...
node --version > nul 2>&1
if errorlevel 1 (
    echo Error: Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

python --version > nul 2>&1
if errorlevel 1 (
    echo Error: Python not found. Please install Python 3.8+ first.
    pause
    exit /b 1
)

echo All prerequisites found!
echo.

REM Install dependencies if needed
echo Checking dependencies...
if not exist "contracts\node_modules" (
    echo Installing contract dependencies...
    cd contracts
    call npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

if not exist "backend\venv" (
    echo Creating Python virtual environment...
    cd backend
    python -m venv venv
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
    cd ..
)

echo.
echo ================================================================================
echo   Starting Services
echo ================================================================================
echo.

REM Create .env if it doesn't exist
if not exist "backend\.env" (
    echo Creating backend\.env from template...
    copy "backend\.env.example" "backend\.env"
    echo.
    echo NOTE: Update contract addresses in backend\.env after deployment!
)

echo.
echo 📋 IMPORTANT: 3 NEW TERMINAL WINDOWS WILL OPEN
echo.
echo    TERMINAL 1 - Hardhat Node (Blockchain)
echo       - Local blockchain on http://127.0.0.1:8545
echo       - Keep this running during testing
echo.
echo    TERMINAL 2 - FastAPI Backend
echo       - REST API on http://127.0.0.1:8000
echo       - API docs at http://127.0.0.1:8000/docs
echo.
echo    TERMINAL 3 - Vite Frontend
echo       - Web UI on http://127.0.0.1:5173
echo       - Open this in your browser
echo.

pause

REM Open Terminal 1: Hardhat Node
echo Opening Terminal 1 (Hardhat Node)...
start "Credchain - Hardhat Node" cmd /k "cd /d "%cd%\contracts" && npm run node"

REM Wait for blockchain to start
timeout /t 8 /nobreak

REM Open Terminal 2: Backend
echo Opening Terminal 2 (Backend API)...
start "Credchain - Backend" cmd /k "cd /d "%cd%\backend" && python -m uvicorn app.main:app --reload --port 8000"

REM Wait for backend to start
timeout /t 5 /nobreak

REM Open Terminal 3: Frontend
echo Opening Terminal 3 (Frontend)...
start "Credchain - Frontend" cmd /k "cd /d "%cd%\frontend" && npm run dev"

echo.
echo ================================================================================
echo   Services Started!
echo ================================================================================
echo.
echo ✅ All 3 services should now be running in separate terminals
echo.
echo Next steps:
echo   1. Wait for Hardhat Node to display "Started HTTP and WebSocket JSON-RPC server"
echo   2. In any terminal, run: npm run deploy:local (to deploy contracts)
echo   3. Update backend\.env with contract addresses
echo   4. Open http://localhost:5173 in your browser
echo   5. Select your role (Issuer / Student / Employer)
echo.
echo 📖 If you need detailed testing guide:
echo    See: TESTING.md
echo.
echo Press Enter to close this window (services will continue running)...
pause
