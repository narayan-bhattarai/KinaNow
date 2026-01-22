@echo off
echo ==================================================
echo 🧹 KinaNow Cleanup Tool
echo ==================================================
echo.
echo [1/3] Killing running Java processes (releasing file locks)...
taskkill /F /IM java.exe
if %errorlevel% neq 0 (
    echo (No Java processes were running or access denied)
) else (
    echo [OK] Java processes killed.
)

echo.
echo [2/3] Stopping Docker containers...
docker-compose down

echo.
echo [3/3] Deleting target directories (optional manual clean)...
rmdir /s /q config-server\target 2>NUL
rmdir /s /q gateway\target 2>NUL
rmdir /s /q services\auth-service\target 2>NUL
rmdir /s /q services\cart-service\target 2>NUL
rmdir /s /q services\catalog-service\target 2>NUL
rmdir /s /q services\order-service\target 2>NUL

echo.
echo ==================================================
echo ✅ Cleanup Complete.
echo You can now run 'setup_and_run.bat' again safely.
echo ==================================================
pause
