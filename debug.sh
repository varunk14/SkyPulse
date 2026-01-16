#!/bin/bash

echo "=========================================="
echo "🔍 SkyPulse Project Diagnostic Script"
echo "=========================================="
echo ""

# 1. Check .env.local
echo "1️⃣  Checking environment variables..."
if [ -f ".env.local" ]; then
  echo "✅ .env.local exists"
  cat .env.local
else
  echo "❌ .env.local missing!"
fi
echo ""

# 2. Test Amadeus Token
echo "2️⃣  Testing Amadeus API Token..."
API_KEY=$(grep "AMADEUS_API_KEY=" .env.local | cut -d'=' -f2)
API_SECRET=$(grep "AMADEUS_API_SECRET=" .env.local | cut -d'=' -f2)

TOKEN_RESPONSE=$(curl -s -X POST "https://test.api.amadeus.com/v1/security/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=${API_KEY}&client_secret=${API_SECRET}")

echo "Token Response:"
echo "$TOKEN_RESPONSE" | head -10
echo ""

# 3. Extract token and test airport search
echo "3️⃣  Testing Amadeus Airport Search..."
TOKEN=$(echo "$TOKEN_RESPONSE"s_token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo "✅ Got token: ${TOKEN:0:10}..."
  
  AIRPORT_RESPONSE=$(curl -s "https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=london&page[limit]=5" \
    -H "Authorization: Bearer ${TOKEN}")
  
  echo "Airport Search Response:"
  echo "$AIRPORT_RESPONSE" | head -20
else
  echo "❌ Failed to get token"
fi
echo ""

# 4. Check if local server is running
echo "4️⃣  Testing Local API..."
LOCAL_RESPONSE=$(curl -s "http://localhost:3000/api/airports/search?keyword=london" 2>/dev/null)

if [ -n "$LOCAL_RESPONSE" ]; then
  echo "Local API Response:"
  echo "$LOCAL_RESPONSE" | head -20
else
  echo "⚠️  Server not running or API failed"
fi
echo ""

# 5. Check build
echo "5️⃣  Checking Build..."
npm run build 2>&1 | tail -20

echo ""
echo "==============================ho "🏁 Done!"
echo "=========================================="
