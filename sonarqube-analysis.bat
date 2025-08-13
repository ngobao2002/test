@echo off
echo Running SonarQube Analysis on Vulnerable Web App...
echo.
echo Make sure SonarQube server is running at http://localhost:9000
echo.

REM Install SonarQube scanner if not installed
dotnet tool install --global dotnet-sonarscanner

REM Begin SonarQube analysis
dotnet sonarscanner begin /k:"VulnerableWebApp" /d:sonar.host.url="http://localhost:9000" /d:sonar.login="admin" /d:sonar.password="admin"

REM Build the solution
dotnet build VulnerableApp.sln

REM End SonarQube analysis
dotnet sonarscanner end /d:sonar.login="admin" /d:sonar.password="admin"

echo.
echo Analysis complete! Check results at http://localhost:9000
pause



