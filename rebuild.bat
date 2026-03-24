@echo off
echo Building React app...
call npm run build
if errorlevel 1 (
    echo Build failed!
    exit /b 1
)
echo Build completed successfully!
pause
