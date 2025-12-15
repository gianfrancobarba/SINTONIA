#!/bin/bash
echo "🧹 Cleaning up SINTONIA containers..."

# Check if we are in the webapp directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Please run this script from the 'webapp' directory."
    exit 1
fi

# Run docker-compose down, passing any arguments (e.g., -v)
docker-compose down "$@"

echo "✅ Cleanup complete."
