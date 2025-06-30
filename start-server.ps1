# Mental Health Tracker Server Startup Script
Write-Host "Starting Mental Health Tracker Server..." -ForegroundColor Green
Write-Host ""

# Set Node.js path
$env:PATH = "D:\Laptop related\softwares\nodejs;" + $env:PATH

# Check if Node.js is available
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: Node.js not found at D:\Laptop related\softwares\nodejs" -ForegroundColor Red
    Write-Host "Please update the path in this script to your Node.js installation" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

Write-Host "Starting server on http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server
npm start 