# Git Push Issue Resolution - PowerShell Script
# Run this in PowerShell to fix the push issue

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Git Push Issue Resolution" -ForegroundColor Cyan
Write-Host "=========================================`n" -ForegroundColor Cyan

Set-Location "c:\Users\ASUS\smart-vaccine-system"

Write-Host "Step 1: Checking current status..." -ForegroundColor Yellow
git status
Write-Host ""

Write-Host "Step 2: Fetching latest from remote..." -ForegroundColor Yellow
git fetch origin
Write-Host ""

Write-Host "Step 3: Checking what's different..." -ForegroundColor Yellow
Write-Host "Local commits:" -ForegroundColor Green
git log --oneline -5 main
Write-Host ""
Write-Host "Remote commits:" -ForegroundColor Green
git log --oneline -5 origin/main
Write-Host ""

Write-Host "Step 4: Pulling remote changes..." -ForegroundColor Yellow
git pull origin main --no-ff
Write-Host ""

Write-Host "Step 5: Pushing your commits..." -ForegroundColor Yellow
git push origin main -v
Write-Host ""

Write-Host "=========================================`n" -ForegroundColor Cyan
Write-Host "Done! Your commits should now be pushed." -ForegroundColor Green
Write-Host "=========================================`n" -ForegroundColor Cyan
