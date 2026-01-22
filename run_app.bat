@echo off
echo ==========================================
echo 🚀 KinaNow E-Commerce Platform Launcher
echo ==========================================

echo [1/8] Starting Infrastructure (Docker)...
docker-compose up -d
if %errorlevel% neq 0 (
    echo ⚠️ Docker failed to start! Ensure Docker Desktop is running.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/8] Building Maven Projects...
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo ⚠️ Maven build failed! Ensure Maven is installed and in PATH.
    pause
    exit /b %errorlevel%
)

echo.
echo [3/8] Starting Config Server...
start "Config Server" java -jar config-server/target/config-server-1.0.0-SNAPSHOT.jar

echo.
echo [4/8] Starting Discovery/Gateway...
timeout /t 10
start "API Gateway" java -jar gateway/target/gateway-1.0.0-SNAPSHOT.jar

echo.
echo [5/8] Starting Auth Service...
start "Auth Service" java -jar services/auth-service/target/auth-service-1.0.0-SNAPSHOT.jar

echo.
echo [6/8] Starting Catalog Service...
start "Catalog Service" java -jar services/catalog-service/target/catalog-service-1.0.0-SNAPSHOT.jar

echo.
echo [7/8] Starting Cart Service...
start "Cart Service" java -jar services/cart-service/target/cart-service-1.0.0-SNAPSHOT.jar

echo.
echo [8/8] Starting Order Service...
start "Order Service" java -jar services/order-service/target/order-service-1.0.0-SNAPSHOT.jar

echo.
echo ==========================================
echo ✅ Backend Services Launching in background windows...
echo ==========================================
echo.
echo Now starting Frontend...
cd frontend/kinanow-angular
npm install
npm start
