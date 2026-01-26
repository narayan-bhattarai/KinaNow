@echo off
echo Rebuilding Auth Service...
docker run --rm -v "%cd%":/app -w /app maven:3.9-eclipse-temurin-17 mvn clean install -pl services/auth-service -am -DskipTests
if %errorlevel% neq 0 (
    echo Build Failed!
    pause
    exit /b 1
)

echo Restarting Auth Service container...
docker-compose up -d --no-deps --build auth-service
echo Done.
pause
