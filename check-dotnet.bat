@echo off
echo Checking .NET Installation and Compatibility...
echo.

echo === .NET Version Information ===
dotnet --version
echo.

echo === .NET SDK List ===
dotnet --list-sdks
echo.

echo === .NET Runtime List ===
dotnet --list-runtimes
echo.

echo === Project Compatibility Check ===
cd VulnerableApp.API
echo Checking project file...
type VulnerableApp.API.csproj | findstr "TargetFramework"
echo.

echo Testing restore...
dotnet restore --verbosity quiet
if %ERRORLEVEL% EQU 0 (
    echo ✅ Package restore successful!
) else (
    echo ❌ Package restore failed!
)
echo.

echo Testing build...
dotnet build --verbosity quiet
if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful!
    echo.
    echo Your project is ready to run with .NET 9!
) else (
    echo ❌ Build failed!
    echo.
    echo Please check the error messages above.
)

echo.
pause



