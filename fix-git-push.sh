#!/bin/bash
# Git Push Resolution Script
# Run this to fix the push issue

echo "=========================================="
echo "Git Push Issue Resolution"
echo "=========================================="

cd "c:\Users\ASUS\smart-vaccine-system"

echo ""
echo "Step 1: Checking current status..."
git status

echo ""
echo "Step 2: Fetching latest from remote..."
git fetch origin

echo ""
echo "Step 3: Checking what's different..."
git log --oneline -5 main
echo "---"
git log --oneline -5 origin/main

echo ""
echo "Step 4: Pulling remote changes..."
git pull origin main --no-ff

echo ""
echo "Step 5: Pushing your commits..."
git push origin main -v

echo ""
echo "=========================================="
echo "Done!"
echo "=========================================="
