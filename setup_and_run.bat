@echo off
setlocal enableextensions

echo ==================================================
echo 🛠️ KinaNow Smart Setup ^& Launcher
echo ==================================================

REM --- 1. Check Java ---
java -version >NUL 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java is not installed or not in PATH. Please install Java 17+.
    pause
    exit /b 1
)
echo [OK] Java detected.

REM --- 2. Check Docker Daemon ---
echo [CHECK] Checking Docker usage...
docker info >NUL 2>&1
if %errorlevel% neq 0 goto :DOCKER_FAIL
echo [OK] Docker is running.
goto :CHECK_MAVEN

:DOCKER_FAIL
echo ==================================================
echo [ERROR] DOCKER IS NOT RUNNING!
echo.
echo Please open 'Docker Desktop' from your Start Menu.
echo Wait for the whale icon to stop animating.
echo Then press any key to try again...
echo ==================================================
pause
docker info >NUL 2>&1
if %errorlevel% neq 0 (
    echo [FATAL] Docker is still not reachable. Exiting.
    pause
    exit /b 1
)
echo [OK] Docker is running.

:CHECK_MAVEN
REM --- 3. Build with Maven ---
echo [CHECK] Checking for Maven...
call mvn -version >NUL 2>&1
if %errorlevel% equ 0 goto :BUILD_LOCAL

:BUILD_DOCKER
echo [INFO] Maven not found locally. Using Docker to build (Portable Mode)...
echo This might take a few minutes to download the Maven image...
docker run --rm -v "%cd%":/app -w /app maven:3.9-eclipse-temurin-17 mvn clean install -DskipTests
if %errorlevel% neq 0 goto :BUILD_FAIL
goto :Start_Infra

:BUILD_LOCAL
echo [OK] Maven found locally. Building project...
call mvn clean install -DskipTests
if %errorlevel% neq 0 goto :BUILD_FAIL
goto :Start_Infra

:BUILD_FAIL
echo [FATAL] Build failed. Check the logs above.
pause
exit /b 1

:Start_Infra
REM --- 4. Start Infrastructure ---
echo.
echo [INFRA] Starting Database ^& Message Broker...
docker-compose up -d

REM --- 5. Run Microservices ---
echo.
echo [RUN] Launching Services...

start "Config Server" java -jar config-server/target/config-server-1.0.0-SNAPSHOT.jar
timeout /t 10

start "API Gateway" java -jar gateway/target/gateway-1.0.0-SNAPSHOT.jar
start "Auth Service" java -jar services/auth-service/target/auth-service-1.0.0-SNAPSHOT.jar
start "Catalog Service" java -jar services/catalog-service/target/catalog-service-1.0.0-SNAPSHOT.jar
start "Cart Service" java -jar services/cart-service/target/cart-service-1.0.0-SNAPSHOT.jar
start "Order Service" java -jar services/order-service/target/order-service-1.0.0-SNAPSHOT.jar
start "Inventory Service" java -jar services/inventory-service/target/inventory-service-1.0.0-SNAPSHOT.jar

REM --- 6. Start Frontend ---
echo.
echo [FRONTEND] Starting Angular App...
cd frontend/kinanow-angular
if not exist node_modules (
    echo Installing dependencies...
    call npm install --legacy-peer-deps
)
call npm start

endlocal