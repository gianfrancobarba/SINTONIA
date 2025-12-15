#!/bin/bash
set -e # Exit on error

echo "🚀 Starting SINTONIA Complete Setup..."
echo "================================================================"

# Check if we are in the webapp directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Please run this script from the 'webapp' directory."
    exit 1
fi

# 1. Setup Environment
echo ""
echo "📝 Step 1/6: Configuring environment..."
if [ ! -f backend/.env ]; then
    echo "DATABASE_URL=postgresql://root:secret@localhost:5433/sintonia" > backend/.env
    echo "✅ backend/.env created."
else
    echo "ℹ️  backend/.env already exists."
fi

# 2. Start Docker
echo ""
echo "🐳 Step 2/6: Starting Docker containers..."
if docker compose up -d --build; then
    echo "✅ Docker containers started."
else
    echo "❌ Failed to start Docker containers."
    echo "   Make sure Docker Desktop is running!"
    exit 1
fi

# Wait for DB to be healthy
echo ""
echo "⏳ Step 3/6: Waiting for Database to be ready..."
retry_count=0
max_retries=30
until docker exec webapp-db-1 pg_isready -U root -d sintonia > /dev/null 2>&1; do
    retry_count=$((retry_count + 1))
    if [ $retry_count -ge $max_retries ]; then
        echo "❌ Database timed out after ${max_retries} attempts."
        exit 1
    fi
    echo "   ... still waiting (${retry_count}/${max_retries})"
    sleep 2
done
echo "✅ Database is ready."

# 3. Setup Database
echo ""
echo "🛠  Step 4/6: Setting up Database..."
cd backend || exit

echo "📦 Installing backend dependencies..."
npm install --silent

echo "🔄 Generating and applying migrations..."
npx drizzle-kit generate
npx drizzle-kit migrate

# 4. Seed Database
echo "🌱 Seeding database with test data..."
npm run db:seed

cd ..

# 5. Install Frontend Dependencies
echo ""
echo "📦 Step 5/6: Installing all dependencies..."
npm install --silent
echo "✅ All dependencies installed."

# 6. Start All Services
echo ""
echo "🚀 Step 6/6: Starting all services..."
echo "================================================================"
echo ""
echo "✨ SINTONIA Setup Complete!"
echo ""
echo "🌐 Services are starting on:"
echo "   • Backend API:      http://localhost:3000"
echo "   • Frontend Web:     http://localhost:5173  (Admin/Psicologo)"
echo "   • Frontend Mobile:  http://localhost:5174  (Pazienti)"
echo "   • Database:         localhost:5433"
echo ""
echo "📋 Test Credentials:"
echo "   • Admin:      alessio.delsorbo@gmail.com / password1"
echo "   • Psicologo:  l.bruno@pec.aslnapoli1centro.it / password123"
echo "   • Paziente:   chiara.conti@gmail.com / password123"
echo ""
echo "⚠️  Press Ctrl+C to stop all services."
echo "================================================================"
echo ""

# Start frontends using concurrently (will block and show logs)
npm run dev:frontends
