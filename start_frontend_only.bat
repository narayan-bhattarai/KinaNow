@echo off
echo ==================================================
echo 💻 Starting KinaNow Frontend Only
echo ==================================================

cd frontend\kinanow-angular

if exist node_modules goto :RUN

echo [INFO] Node modules not found. Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed.
    exit /b 1
)

:RUN
echo [RUN] Launching Angular Dev Server...
echo The app will be available at http://localhost:4200
call npm start
