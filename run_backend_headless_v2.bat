@echo off
echo [RUN] Launching KinaNow Backend Services (Headless V2)...

echo [1/2] Starting Docker Infrastructure...
docker-compose up -d

echo [2/2] Launching Java Services...
echo Logs will be written to *.log files.

start /B "Config Server" java -jar config-server/target/config-server-1.0.0-SNAPSHOT.jar > config-server.log 2>&1
timeout /t 15 >NUL

start /B "Gateway" java -jar gateway/target/gateway-1.0.0-SNAPSHOT.jar > gateway.log 2>&1
start /B "Auth Service" java -jar services/auth-service/target/auth-service-1.0.0-SNAPSHOT.jar > auth-service.log 2>&1
start /B "Catalog Service" java -jar services/catalog-service/target/catalog-service-1.0.0-SNAPSHOT.jar > catalog-service.log 2>&1
start /B "Cart Service" java -jar services/cart-service/target/cart-service-1.0.0-SNAPSHOT.jar > cart-service.log 2>&1
start /B "Order Service" java -jar services/order-service/target/order-service-1.0.0-SNAPSHOT.jar > order-service.log 2>&1
start /B "Inventory Service" java -jar services/inventory-service/target/inventory-service-1.0.0-SNAPSHOT.jar > inventory-service.log 2>&1
start /B "Payment Service" java -jar services/payment-service/target/payment-service-1.0.0-SNAPSHOT.jar > payment-service.log 2>&1
start /B "Notification Service" java -jar services/notification-service/target/notification-service-1.0.0-SNAPSHOT.jar > notification-service.log 2>&1

echo [OK] All backend services handled over to OS background processes.
exit /b 0
