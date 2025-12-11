Write-Host "🚀 Starting SINTONIA Setup (Windows)..." -ForegroundColor Cyan

# Check if we are in the webapp directory
if (-not (Test-Path "docker-compose.yml")) {
    Write-Host "❌ Error: Please run this script from the 'webapp' directory." -ForegroundColor Red
    exit 1
}

# 1. Setup Environment
Write-Host "📝 Configuring environment..." -ForegroundColor Yellow
if (-not (Test-Path "backend/.env")) {
    Set-Content -Path "backend/.env" -Value "DATABASE_URL=postgresql://root:secret@localhost:5433/sintonia" -Encoding Ascii
    Write-Host "✅ backend/.env created." -ForegroundColor Green
} else {
    Write-Host "ℹ️ backend/.env already exists." -ForegroundColor Gray
}

# 2. Start Docker
Write-Host "🐳 Starting Docker containers..." -ForegroundColor Yellow
docker-compose up -d --build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start Docker containers." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Docker containers started." -ForegroundColor Green

# Wait for DB to be ready
Write-Host "⏳ Waiting for Database to be ready..." -ForegroundColor Yellow
$retryCount = 0
$maxRetries = 30
$dbReady = $false

while (-not $dbReady -and $retryCount -lt $maxRetries) {
    Start-Sleep -Seconds 2
    # Ensure container name matches your docker-compose project name
    # Using 'webapp-db-1' as standard default
    $res = docker exec webapp-db-1 pg_isready -U root -d sintonia 2>$null
    if ($LASTEXITCODE -eq 0) {
        $dbReady = $true
    } else {
        Write-Host "   ... still waiting ($retryCount/$maxRetries)" -ForegroundColor Gray
        $retryCount++
    }
}

if (-not $dbReady) {
    Write-Host "❌ Database timed out." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Database is ready." -ForegroundColor Green

# 3. Setup Database
Write-Host "🛠 Setting up Database..." -ForegroundColor Yellow
Set-Location backend

Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
# Using cmd /c to ensure npm runs correctly in PowerShell on some systems
cmd /c npm install

Write-Host "🔄 Generating and applying migrations..." -ForegroundColor Yellow
cmd /c npx drizzle-kit generate
cmd /c npx drizzle-kit migrate

# 4. Seed Database
Write-Host "🌱 Seeding database..." -ForegroundColor Yellow
cmd /c npm run db:seed

Set-Location ..

Write-Host "----------------------------------------------------------------" -ForegroundColor Cyan
Write-Host "✨ Setup Complete! SINTONIA is ready." -ForegroundColor Green
Write-Host "   Backend: http://localhost:3000"
Write-Host "   Frontend Web: http://localhost:5173"
Write-Host "   Frontend Mobile: http://localhost:5174"
Write-Host "   Database: localhost:5433"
Write-Host "----------------------------------------------------------------" -ForegroundColor Cyan
