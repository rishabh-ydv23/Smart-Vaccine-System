@echo off
REM Git Push Issue Resolution - Batch Script
REM Run this to fix the push issue

echo.
echo ==========================================
echo Git Push Issue Resolution
echo ==========================================
echo.

cd /d "c:\Users\ASUS\smart-vaccine-system"

echo Step 1: Checking current status...
git status
echo.

echo Step 2: Fetching latest from remote...
git fetch origin
echo.

echo Step 3: Checking remote changes...
echo Local commits:
git log --oneline -5 main
echo.
echo Remote commits:
git log --oneline -5 origin/main
echo.

echo Step 4: Pulling remote changes...
git pull origin main --no-ff
echo.

echo Step 5: Pushing your commits...
git push origin main -v
echo.

echo ==========================================
echo Done! Check if push was successful.
echo ==========================================
echo.
pause
