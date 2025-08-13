@echo off
echo Running Security Analysis on Vulnerable Web App...
echo.

echo === 1. .NET Code Analysis ===
echo Running built-in .NET analyzers...
cd VulnerableApp.API
dotnet build --verbosity normal > ..\analysis-results.txt 2>&1
cd ..

echo.
echo === 2. Package Vulnerability Scan ===
echo Checking for vulnerable packages...
cd VulnerableApp.API
dotnet list package --vulnerable >> ..\analysis-results.txt 2>&1
cd ..

echo.
echo === 3. Frontend Security Scan ===
echo Running npm audit...
cd VulnerableApp.Frontend
npm audit >> ..\analysis-results.txt 2>&1
cd ..

echo.
echo === Analysis Complete ===
echo Results saved to: analysis-results.txt
echo.
echo Key vulnerabilities found (by design):
echo - Hardcoded credentials
echo - SQL injection vulnerabilities
echo - Outdated packages with known CVEs
echo - XSS vulnerabilities in frontend
echo.
pause

