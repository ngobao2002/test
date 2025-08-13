@echo off
echo Starting Vulnerable Web App Backend (.NET 9)...
echo.
echo WARNING: This application contains intentional security vulnerabilities!
echo Only use for educational and security testing purposes.
echo.

echo Checking .NET version...
dotnet --version

echo.
echo Building and running the application...
cd VulnerableApp.API
dotnet restore
dotnet build
dotnet run
pause
