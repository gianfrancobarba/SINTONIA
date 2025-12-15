Write-Host "🧹 Cleaning up SINTONIA containers..." -ForegroundColor Cyan

# Check if we are in the webapp directory
if (-not (Test-Path "docker-compose.yml")) {
    Write-Host "❌ Error: Please run this script from the 'webapp' directory." -ForegroundColor Red
    exit 1
}

# Run docker-compose down, passing any arguments manually if needed, 
# but for simplicity in PS wrapper we usually just run the command.
# To allow arguments would require param block, keep it simple for now or pass args.
# For simplicity, we just run the command. If args are needed, user runs docker-compose directly usually, 
# but let's try to pass 'em if we can, or just stick to basic down.
# Let's support passing args.

$dockerArgs = @("down") + $args

& docker-compose $dockerArgs

Write-Host "✅ Cleanup complete." -ForegroundColor Green
