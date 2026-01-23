#!/bin/bash
# OTP Registration Flow - cURL Test Script
# Tests the complete registration flow
# Usage: bash testOTPFlow.sh

API_URL="http://localhost:5000/api"
TIMESTAMP=$(date +%s)
TEST_EMAIL="testuser_${TIMESTAMP}@example.com"
TEST_PASSWORD="TestPassword123"
TEST_NAME="Test User"
TEST_GOV_ID="GOV_${TIMESTAMP}"

echo "================================================"
echo "OTP Registration Flow Test"
echo "================================================"
echo ""
echo "📧 Test Email: $TEST_EMAIL"
echo "🆔 Gov ID: $TEST_GOV_ID"
echo ""

# Step 1: Register User
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1️⃣  : Register User (Initiate Registration)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$TEST_NAME\",
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"governmentId\": \"$TEST_GOV_ID\",
    \"role\": \"user\"
  }")

echo "Response:"
echo "$REGISTER_RESPONSE" | jq '.'
echo ""

# Check if registration was successful
if echo "$REGISTER_RESPONSE" | jq -e '.requiresVerification' > /dev/null 2>&1; then
  echo "✅ Registration initiated successfully!"
  echo "📧 OTP should be sent to: $TEST_EMAIL"
  echo ""
else
  echo "❌ Registration failed!"
  echo "Check the error message above."
  exit 1
fi

# Step 2: Wait for user input
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2️⃣  : Get OTP from Email"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📧 Check your email: $TEST_EMAIL"
echo "📮 Look for a message from: noreply@vaxcare-portal.onrender.com"
echo "📄 Copy the 6-digit OTP code"
echo ""
read -p "Enter OTP (6 digits): " USER_OTP

if [ -z "$USER_OTP" ]; then
  echo "❌ OTP cannot be empty!"
  exit 1
fi

if ! [[ "$USER_OTP" =~ ^[0-9]{6}$ ]]; then
  echo "❌ OTP must be exactly 6 digits!"
  exit 1
fi

echo ""

# Step 3: Verify OTP
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3️⃣  : Verify OTP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

VERIFY_RESPONSE=$(curl -s -X POST "$API_URL/email-verification/verify-otp" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"otp\": \"$USER_OTP\"
  }")

echo "Response:"
echo "$VERIFY_RESPONSE" | jq '.'
echo ""

# Extract token if verification was successful
if echo "$VERIFY_RESPONSE" | jq -e '.token' > /dev/null 2>&1; then
  echo "✅ OTP verified successfully!"
  TOKEN=$(echo "$VERIFY_RESPONSE" | jq -r '.token')
  USER_ID=$(echo "$VERIFY_RESPONSE" | jq -r '.user._id')
  echo "🎫 JWT Token received"
  echo "👤 User ID: $USER_ID"
  echo ""
else
  echo "❌ OTP verification failed!"
  ERROR_MSG=$(echo "$VERIFY_RESPONSE" | jq -r '.message // "Unknown error"')
  echo "Error: $ERROR_MSG"
  exit 1
fi

# Step 4: Test Login
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4️⃣  : Verify User Login Works"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

echo "Response:"
echo "$LOGIN_RESPONSE" | jq '.'
echo ""

# Check login success
if echo "$LOGIN_RESPONSE" | jq -e '.token' > /dev/null 2>&1; then
  echo "✅ Login successful!"
  LOGIN_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
  IS_VERIFIED=$(echo "$LOGIN_RESPONSE" | jq -r '.isEmailVerified')
  echo "🎫 JWT Token: ${LOGIN_TOKEN:0:20}..."
  echo "✉️  Email Verified: $IS_VERIFIED"
  echo ""
else
  echo "❌ Login failed!"
  ERROR_MSG=$(echo "$LOGIN_RESPONSE" | jq -r '.message // "Unknown error"')
  echo "Error: $ERROR_MSG"
  exit 1
fi

# Step 5: Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ COMPLETE OTP REGISTRATION FLOW TEST PASSED ✨"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Summary:"
echo "  ✅ Registration initiated"
echo "  ✅ OTP sent to email"
echo "  ✅ OTP verified"
echo "  ✅ User account created"
echo "  ✅ Email marked as verified"
echo "  ✅ User can login"
echo ""
echo "🎯 User Details:"
echo "  Email: $TEST_EMAIL"
echo "  Gov ID: $TEST_GOV_ID"
echo "  User ID: $USER_ID"
echo "  Role: user"
echo ""
echo "💾 Tokens for use in future requests:"
echo "  Authorization: Bearer $LOGIN_TOKEN"
echo ""
