@echo off
echo Rebuilding Auth Service (Portable Mode)...
docker run --rm -v "%cd%":/app -w /app maven:3.9-eclipse-temurin-17 mvn -B clean install -pl services/auth-service -am -DskipTests
if %errorlevel% neq 0 (
    echo Build Failed!
    pause
    exit /b 1
)
echo.
echo Build Successful!
echo Please close the currently running 'Auth Service' window (Java process).
echo Then restart it by running:
echo java -jar services/auth-service/target/auth-service-1.0.0-SNAPSHOT.jar
echo.
pause
