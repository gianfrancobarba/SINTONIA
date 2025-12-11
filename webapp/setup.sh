#!/bin/bash
set -e # Exit on error

echo "🚀 Starting SINTONIA Setup..."

# Check if we are in the webapp directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Please run this script from the 'webapp' directory."
    exit 1
fi

# 1. Setup Environment
echo "📝 Configuring environment..."
if [ ! -f backend/.env ]; then
    echo "DATABASE_URL=postgresql://root:secret@localhost:5433/sintonia" > backend/.env
    echo "✅ backend/.env created."
else
    echo "ℹ️ backend/.env already exists."
fi

# 2. Start Docker
echo "🐳 Starting Docker containers..."
# We need to make sure we are using the docker-compose from the current directory
if docker-compose up -d --build; then
    echo "✅ Docker containers started."
else
    echo "❌ Failed to start Docker containers."
    exit 1
fi

# Wait for DB to be healthy
echo "⏳ Waiting for Database to be ready..."
until docker exec webapp-db-1 pg_isready -U root -d sintonia > /dev/null 2>&1; do
  echo "Sleeping for 2 seconds..."
  sleep 2
done
echo "✅ Database is ready."

# 3. Setup Database
echo "🛠 Setting up Database..."
cd backend || exit
echo "📦 Installing backend dependencies..."
npm install

echo "🔄 Generating and applying migrations..."
npx drizzle-kit generate
npx drizzle-kit migrate

# 4. Seed Database
echo "🌱 Seeding database..."
npm run db:seed

cd ..

echo "----------------------------------------------------------------"
echo "✨ Setup Complete! SINTONIA is ready."
echo "   Backend: http://localhost:3000"
echo "   Frontend Web: http://localhost:5173"
echo "   Frontend Mobile: http://localhost:5174"
echo "   Database: localhost:5433"
echo "----------------------------------------------------------------"
