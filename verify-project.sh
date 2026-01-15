#!/bin/bash

# ==============================================
# FLIGHT SEARCH PROJECT VERIFICATION SCRIPT
# ==============================================
# 
# Run this script from your project root directory:
# chmod +x verify-project.sh
# ./verify-project.sh
#
# ==============================================

echo ""
echo "🔍 FLIGHT SEARCH ENGINE - PROJECT VERIFICATION"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

pass() {
    echo -e "${GREEN}✅ PASS:${NC} $1"
    ((PASS_COUNT++))
}

fail() {
    echo -e "${RED}❌ FAIL:${NC} $1"
    ((FAIL_COUNT++))
}

warn() {
    echo -e "${YELLOW}⚠️ WARN:${NC} $1"
    ((WARN_COUNT++))
}

section() {
    echo ""
    echo -e "${BLUE}📋 $1${NC}"
    echo "----------------------------------------"
}

# ==============================================
# SECTION 1: PROJECT ROOT FILES
# ==============================================
section "PROJECT ROOT FILES"

[ -f "package.json" ] && pass "package.json exists" || fail "package.json missing"
[ -f "tsconfig.json" ] && pass "tsconfig.json exists" || fail "tsconfig.json missing"
[ -f "tailwind.config.ts" ] || [ -f "tailwind.config.js" ] && pass "tailwind.config exists" || fail "tailwind.config missing"
[ -f "next.config.js" ] || [ -f "next.config.mjs" ] || [ -f "next.config.ts" ] && pass "next.config exists" || warn "next.config not found (may use defaults)"
[ -f ".env.local" ] && pass ".env.local exists" || fail ".env.local missing (API keys needed!)"

# ==============================================
# SECTION 2: DIRECTORY STRUCTURE
# ==============================================
section "DIRECTORY STRUCTURE"

[ -d "src" ] && pass "src/ directory exists" || fail "src/ directory missing"
[ -d "src/app" ] && pass "src/app/ (Next.js App Router) exists" || fail "src/app/ missing"
[ -d "src/components" ] && pass "src/components/ exists" || fail "src/components/ missing"
[ -d "src/components/ui" ] && pass "src/components/ui/ (shadcn) exists" || warn "src/components/ui/ missing (shadcn components)"

# ==============================================
# SECTION 3: KEY SOURCE FILES
# ==============================================
section "KEY SOURCE FILES"

# App files
[ -f "src/app/layout.tsx" ] && pass "src/app/layout.tsx exists" || fail "layout.tsx missing"
[ -f "src/app/page.tsx" ] && pass "src/app/page.tsx exists" || fail "page.tsx missing"
[ -f "src/app/globals.css" ] && pass "src/app/globals.css exists" || fail "globals.css missing"

# API routes
[ -f "src/app/api/flights/search/route.ts" ] && pass "Flight search API route exists" || fail "Flight search API missing"
[ -f "src/app/api/airports/search/route.ts" ] && pass "Airport search API route exists" || fail "Airport search API missing"

# Store
[ -f "src/store/searchStore.ts" ] || [ -f "src/store/useStore.ts" ] || [ -f "src/store/store.ts" ] && pass "Zustand store exists" || fail "Zustand store missing"

# Amadeus client
[ -f "src/lib/amadeus.ts" ] && pass "Amadeus API client exists" || fail "Amadeus client missing"

# ==============================================
# SECTION 4: COMPONENT FILES
# ==============================================
section "COMPONENT FILES"

# Search components
SEARCH_COMPONENTS=("SearchForm" "AirportSelect" "DatePicker" "PassengerSelect")
for comp in "${SEARCH_COMPONENTS[@]}"; do
    found=$(find src -name "${comp}.tsx" 2>/dev/null | head -1)
    [ -n "$found" ] && pass "${comp}.tsx found" || warn "${comp}.tsx not found"
done

# Results components
RESULTS_COMPONENTS=("FlightList" "FlightCard")
for comp in "${RESULTS_COMPONENTS[@]}"; do
    found=$(find src -name "${comp}.tsx" 2>/dev/null | head -1)
    [ -n "$found" ] && pass "${comp}.tsx found" || fail "${comp}.tsx missing"
done

# Filter components
FILTER_COMPONENTS=("FilterPanel" "StopsFilter" "PriceRangeFilter" "AirlineFilter" "TimeFilter" "DurationFilter")
for comp in "${FILTER_COMPONENTS[@]}"; do
    found=$(find src -name "${comp}.tsx" 2>/dev/null | head -1)
    [ -n "$found" ] && pass "${comp}.tsx found" || warn "${comp}.tsx not found"
done

# Graph
found=$(find src -name "*Graph*.tsx" -o -name "*Chart*.tsx" 2>/dev/null | head -1)
[ -n "$found" ] && pass "Price graph component found" || fail "Price graph component missing"

# ==============================================
# SECTION 5: DEPENDENCIES CHECK
# ==============================================
section "DEPENDENCIES"

check_dep() {
    if grep -q "\"$1\"" package.json 2>/dev/null; then
        pass "$1 is installed"
    else
        fail "$1 is NOT installed"
    fi
}

check_dep "@tanstack/react-query"
check_dep "zustand"
check_dep "axios"
check_dep "date-fns"
check_dep "recharts"
check_dep "lucide-react"

# Check for shadcn (indirect check)
if [ -d "src/components/ui" ] && [ "$(ls -A src/components/ui 2>/dev/null)" ]; then
    pass "shadcn/ui components installed"
else
    fail "shadcn/ui components missing"
fi

# ==============================================
# SECTION 6: ENVIRONMENT VARIABLES
# ==============================================
section "ENVIRONMENT VARIABLES"

if [ -f ".env.local" ]; then
    grep -q "AMADEUS_API_KEY" .env.local && pass "AMADEUS_API_KEY is set" || fail "AMADEUS_API_KEY missing in .env.local"
    grep -q "AMADEUS_API_SECRET" .env.local && pass "AMADEUS_API_SECRET is set" || fail "AMADEUS_API_SECRET missing in .env.local"
else
    fail ".env.local file not found"
fi

# ==============================================
# SECTION 7: BUILD TEST
# ==============================================
section "BUILD TEST"

echo "Running TypeScript check..."
if npx tsc --noEmit 2>/dev/null; then
    pass "TypeScript compiles without errors"
else
    warn "TypeScript has some type errors (check with: npx tsc --noEmit)"
fi

echo "Checking if app can be built..."
if npm run build --dry-run 2>/dev/null | grep -q "error"; then
    fail "Build may have errors"
else
    pass "Build command available"
fi

# ==============================================
# SECTION 8: CODE QUALITY INDICATORS
# ==============================================
section "CODE QUALITY"

# Check for TypeScript usage
TS_FILES=$(find src -name "*.tsx" -o -name "*.ts" 2>/dev/null | wc -l)
[ "$TS_FILES" -gt 10 ] && pass "Using TypeScript ($TS_FILES files)" || warn "Limited TypeScript files ($TS_FILES)"

# Check for types folder
[ -d "src/types" ] && pass "Types directory exists" || warn "No types directory"

# Check for hooks folder
[ -d "src/hooks" ] && pass "Hooks directory exists" || warn "No hooks directory"

# ==============================================
# SUMMARY
# ==============================================
echo ""
echo "================================================"
echo "📊 VERIFICATION SUMMARY"
echo "================================================"
echo -e "${GREEN}✅ Passed: $PASS_COUNT${NC}"
echo -e "${RED}❌ Failed: $FAIL_COUNT${NC}"
echo -e "${YELLOW}⚠️ Warnings: $WARN_COUNT${NC}"
echo ""

TOTAL=$((PASS_COUNT + FAIL_COUNT + WARN_COUNT))
SCORE=$((PASS_COUNT * 100 / TOTAL))

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}🏆 SCORE: $SCORE% - Project structure looks complete!${NC}"
elif [ $FAIL_COUNT -le 3 ]; then
    echo -e "${YELLOW}✅ SCORE: $SCORE% - Minor issues to fix${NC}"
else
    echo -e "${RED}⚠️ SCORE: $SCORE% - Several critical items missing${NC}"
fi

echo ""
echo "Next steps:"
echo "1. Fix any FAIL items above"
echo "2. Run: npm run dev"
echo "3. Test in browser"
echo "4. Run Lighthouse audit"
echo ""
