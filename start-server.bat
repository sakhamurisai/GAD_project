@echo off
echo Starting Mental Health Tracker Server...
echo.

REM Set Node.js path
set PATH=D:\Laptop related\softwares\nodejs;%PATH%

REM Check if Node.js is available
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found at D:\Laptop related\softwares\nodejs
    echo Please update the path in this batch file to your Node.js installation
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

echo Starting server on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

REM Start the server
npm start

pause 