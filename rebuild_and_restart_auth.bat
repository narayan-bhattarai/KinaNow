@echo off
echo Stopping Auth Service...
wmic process where "commandline like '%%auth-service%%' and name='java.exe'" call terminate
timeout /t 5 >NUL

echo Rebuilding Auth Service...
docker run --rm -v "%cd%":/app -w /app maven:3.9-eclipse-temurin-17 mvn -B clean install -pl services/auth-service -am -DskipTests
if %errorlevel% neq 0 (
    echo Build Failed!
    exit /b 1
)

echo Restarting Auth Service...
start "Auth Service" java -jar services/auth-service/target/auth-service-1.0.0-SNAPSHOT.jar
echo Done.
