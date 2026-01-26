@echo off
echo Rebuilding Payment Service...
docker run --rm -v "%cd%":/app -w /app maven:3.9-eclipse-temurin-17 mvn clean install -pl services/payment-service -am -DskipTests
if %errorlevel% neq 0 (
    echo Build Failed!
    pause
    exit /b 1
)

echo Restarting Payment Service...
docker-compose up -d --no-deps --build payment-service
echo Done.
pause
