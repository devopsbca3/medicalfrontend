@echo off
echo ========================================
echo Medical Frontend - Build and Run
echo ========================================
echo.

cd /d d:\medicalfrontend

echo [1/3] Installing dependencies...
call npm install
if errorlevel 1 goto error

echo.
echo [2/3] Building React app...
call npm run build
if errorlevel 1 goto error

echo.
echo [3/3] Starting server on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
call npm start
goto end

:error
echo.
echo ERROR: Build failed!
echo Please check the error messages above
pause
exit /b 1

:end
pause
