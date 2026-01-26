@echo off
echo Building Order Service...
docker run --rm -v "%cd%":/app -w /app/services/order-service maven:3.9-eclipse-temurin-17 mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo Build Failed!
    exit /b 1
)
echo Build Success!
exit /b 0
