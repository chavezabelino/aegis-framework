#!/bin/bash

# Aegis Planning Optimization Demo
# This script demonstrates the complete planning optimization system

set -e  # Exit on any error

echo "🚀 Aegis Planning Optimization Demo"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must run from project root directory"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Show CLI help
print_step "Step 1: CLI Help"
npm run aegis:planning help
echo ""

# Step 2: Auto plan detection examples
print_step "Step 2: Auto Plan Detection Examples"
echo ""

print_step "Example 1: Simple feature addition"
npm run aegis:planning auto "Add user authentication to the app"
echo ""

print_step "Example 2: Bug fix"
npm run aegis:planning auto "Fix the login button not working"
echo ""

print_step "Example 3: Refactoring"
npm run aegis:planning auto "Refactor the authentication system to use JWT"
echo ""

print_step "Example 4: Complex feature"
npm run aegis:planning auto "Add a new database schema for user profiles with migration"
echo ""

# Step 3: Create test plans
print_step "Step 3: Creating Test Plans"
echo ""

# Create MVP plan
cat > demo-plan-mvp.md << 'EOF'
<!--
@aegisBlueprint: planning-optimization
@version: 1.0.0
@mode: lean
@intent: Demo MVP plan for user authentication
@context: Testing planning optimization system
-->

# Minimum Viable Plan (MVP-Fix) Template

## 1) Contracts
- [ ] Unauthenticated users are redirected to login page (observable behavior)
- [ ] Login form validates input and shows errors (user-facing)
- [ ] Successful login redirects to dashboard (behavioral contract)
Notes: Keep to observable behavior.

## 2) Changes (≤ 2 files)
- File: `src/middleware/auth.ts` — add authentication middleware with redirect logic
- File: `src/pages/login.tsx` — create login page with form and redirect handling

## 3) Tests
- E2E: test unauthenticated user redirects to login (accepts `/login` or `/(auth)/login`)
- E2E: test successful login redirects to dashboard
- Component: assert login form has proper ARIA labels and roles

## 4) Risks & Rollback
- Risk: Middleware might affect other routes
- Rollback: revert `src/middleware/auth.ts` and `src/pages/login.tsx`

## 5) Done When
- [ ] Contracts pass locally
- [ ] Redirects accept `/login` **or** `/(auth)/login`
- [ ] plan-gate passes
EOF

# Create Surgical plan
cat > demo-plan-surgical.md << 'EOF'
<!--
@aegisBlueprint: planning-optimization
@version: 1.0.0
@mode: strict
@intent: Demo surgical plan for authentication refactoring
@context: Testing planning optimization system
-->

# Surgical Refactor Plan - Authentication System

## 1) Contracts
- [ ] Authentication still works for existing users (observable behavior)
- [ ] Login/logout functionality preserved (user-facing)
- [ ] Session management continues to work (behavioral contract)
- [ ] No breaking changes to existing API endpoints (observable behavior)

## 2) Changes (≤ 5 files)
- File: `src/middleware/auth.ts` — refactor to use JWT tokens
- File: `src/lib/auth.ts` — create authentication utilities
- File: `src/components/AuthProvider.tsx` — create authentication context
- File: `src/hooks/useAuth.ts` — create authentication hook
- File: `src/api/auth.ts` — update authentication API endpoints

## 3) Tests
- E2E: test existing authentication flows still work
- E2E: test new JWT-based authentication
- Component: assert authentication state management
- API: test authentication endpoints

## 4) Risks & Rollback
- Risk: JWT implementation might have security issues
- Risk: Multiple files increase complexity
- Rollback: revert all 5 files if issues arise

## 5) Done When
- [ ] All contracts pass locally
- [ ] Authentication state management works correctly
- [ ] plan-gate passes for surgical plan
EOF

print_success "Created demo plans: demo-plan-mvp.md and demo-plan-surgical.md"

# Step 4: Validate plans
print_step "Step 4: Plan Validation"
echo ""

print_step "Validating MVP plan"
npm run aegis:planning validate MVP-Fix demo-plan-mvp.md 2
echo ""

print_step "Validating Surgical plan"
npm run aegis:planning validate Surgical-Refactor demo-plan-surgical.md 5
echo ""

# Step 5: Compare plans
print_step "Step 5: Plan Comparison"
echo ""

print_step "Comparing MVP vs Surgical plans"
npm run aegis:planning compare demo-plan-mvp.md demo-plan-surgical.md MVP-Fix Surgical-Refactor 2 5
echo ""

# Step 6: Generate plan templates
print_step "Step 6: Plan Template Generation"
echo ""

print_step "Generating MVP plan template"
npm run aegis:planning generate MVP-Fix "Fix the search functionality"
echo ""

# Step 7: Show MCP server status
print_step "Step 7: MCP Server Status"
echo ""

print_warning "MCP server would be started here for IDE integration"
print_warning "Run 'npm run mcp:start' to start the MCP server"
echo ""

# Step 8: Show IDE integration
print_step "Step 8: IDE Integration"
echo ""

print_success "IDE Configuration Files Created:"
echo "  - .cursor/settings.json (Cursor configuration)"
echo "  - .vscode/settings.json (VS Code configuration)"
echo ""

print_success "Available MCP Tools:"
echo "  - aegis_plan_auto_detect (Auto plan detection)"
echo "  - aegis_plan_validate (Plan validation)"
echo "  - aegis_plan_compare (Plan comparison)"
echo "  - aegis_plan_generate (Plan generation)"
echo ""

# Step 9: Show usage examples
print_step "Step 9: Usage Examples"
echo ""

print_success "Vibe Coding Examples:"
echo "  User: 'Add user authentication'"
echo "  AI automatically: Detects MVP-Fix, generates plan, validates, implements"
echo ""
echo "  User: 'Fix the search not working'"
echo "  AI automatically: Detects MVP-Fix, focuses on observable behavior"
echo ""
echo "  User: 'Refactor auth to use JWT'"
echo "  AI automatically: Detects Surgical-Refactor, preserves contracts"
echo ""

# Step 10: Cleanup
print_step "Step 10: Cleanup"
echo ""

rm -f demo-plan-mvp.md demo-plan-surgical.md
print_success "Cleaned up demo files"

# Final summary
echo ""
echo "🎉 Demo Complete!"
echo "================"
echo ""
print_success "Planning Optimization System Features:"
echo "  ✅ Auto plan detection and classification"
echo "  ✅ Plan validation against constraints"
echo "  ✅ Plan comparison and optimization"
echo "  ✅ Template generation for different plan classes"
echo "  ✅ MCP server for IDE integration"
echo "  ✅ Universal compatibility (Cursor, VS Code, JetBrains)"
echo "  ✅ Frictionless 'vibe coding' experience"
echo ""
print_success "Next Steps:"
echo "  1. Configure your IDE with MCP server"
echo "  2. Use 'npm run vibe' for quick plan analysis"
echo "  3. Use 'npm run aegis:planning' for advanced features"
echo "  4. Just prompt naturally with your AI agent!"
echo ""
print_success "The planning optimization system is ready for production use! 🚀"
