# SINTONIA Complete Setup Script for Windows
$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SINTONIA Complete Setup for Windows  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we are in the webapp directory
if (-not (Test-Path "docker-compose.yml")) {
    Write-Host "Error: Please run this script from the 'webapp' directory." -ForegroundColor Red
    exit 1
}

# 1. Setup Environment
Write-Host "[Step 1/6] Configuring environment..." -ForegroundColor Yellow
if (-not (Test-Path "backend\.env")) {
    $envContent = "DATABASE_URL=postgresql://root:secret@localhost:5433/sintonia"
    Set-Content -Path "backend\.env" -Value $envContent -Encoding Ascii
    Write-Host "  backend\.env created." -ForegroundColor Green
} else {
    Write-Host "  backend\.env already exists." -ForegroundColor Gray
}

# 2. Start Docker
Write-Host ""
Write-Host "[Step 2/6] Starting Docker containers..." -ForegroundColor Yellow
docker compose up -d --build
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Failed to start Docker containers." -ForegroundColor Red
    Write-Host "  Make sure Docker Desktop is running!" -ForegroundColor Red
    exit 1
}
Write-Host "  Docker containers started." -ForegroundColor Green

# Wait for DB to be ready
Write-Host ""
Write-Host "[Step 3/6] Waiting for Database to be ready..." -ForegroundColor Yellow
$retryCount = 0
$maxRetries = 30
$dbReady = $false

while (-not $dbReady -and $retryCount -lt $maxRetries) {
    Start-Sleep -Seconds 2
    $null = docker exec webapp-db-1 pg_isready -U root -d sintonia 2>$null
    if ($LASTEXITCODE -eq 0) {
        $dbReady = $true
    } else {
        $retryCount++
        Write-Host ("  ... still waiting ({0}/{1})" -f $retryCount, $maxRetries) -ForegroundColor Gray
    }
}

if (-not $dbReady) {
    Write-Host "  Database timed out after $maxRetries attempts." -ForegroundColor Red
    exit 1
}
Write-Host "  Database is ready." -ForegroundColor Green

# 3. Setup Database
Write-Host ""
Write-Host "[Step 4/6] Setting up Database..." -ForegroundColor Yellow
Push-Location backend

Write-Host "  Installing backend dependencies..." -ForegroundColor Gray
npm install --silent 2>$null

Write-Host "  Generating and applying migrations..." -ForegroundColor Gray
npx drizzle-kit generate
npx drizzle-kit migrate

# 4. Seed Database
Write-Host "  Seeding database with test data..." -ForegroundColor Gray
npm run db:seed

Pop-Location

# 5. Install Frontend Dependencies
Write-Host ""
Write-Host "[Step 5/6] Installing all dependencies..." -ForegroundColor Yellow
npm install --silent 2>$null
Write-Host "  All dependencies installed." -ForegroundColor Green

# 6. Start All Services
Write-Host ""
Write-Host "[Step 6/6] Starting all services..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SINTONIA Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services are starting on:" -ForegroundColor White
Write-Host "  * Backend API:      http://localhost:3000" -ForegroundColor White
Write-Host "  * Frontend Web:     http://localhost:5173  (Admin/Psicologo)" -ForegroundColor White
Write-Host "  * Frontend Mobile:  http://localhost:5174  (Pazienti)" -ForegroundColor White
Write-Host "  * Database:         localhost:5433" -ForegroundColor White
Write-Host ""
Write-Host "Test Credentials:" -ForegroundColor White
Write-Host "  * Admin:      alessio.delsorbo@gmail.com / password1" -ForegroundColor Gray
Write-Host "  * Psicologo:  l.bruno@pec.aslnapoli1centro.it / password123" -ForegroundColor Gray
Write-Host "  * Paziente:   chiara.conti@gmail.com / password123" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C to stop all services." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start frontends using concurrently
npm run dev:frontends
