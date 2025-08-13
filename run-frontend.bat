@echo off
echo Starting Vulnerable Web App Frontend...
echo.
echo WARNING: This application contains intentional security vulnerabilities!
echo Only use for educational and security testing purposes.
echo.
cd VulnerableApp.Frontend
call npm install
call ng serve
pause



