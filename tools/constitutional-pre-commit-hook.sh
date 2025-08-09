#!/bin/bash

# Pre-commit hook for constitutional compliance enforcement
# @aegisFrameworkVersion 2.0.0-alpha-dev
# @intent Prevent commits that violate constitutional principles
# @context Git hook that runs before each commit to enforce framework safety

set -e

echo "🏛️ Aegis Framework Constitutional Pre-Commit Check"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track validation status
VALIDATION_PASSED=true
WARNINGS=0
ERRORS=0

# Function to log with colors
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; ((WARNINGS++)); }
log_error() { echo -e "${RED}❌ $1${NC}"; ((ERRORS++)); VALIDATION_PASSED=false; }

log_info "Starting constitutional compliance validation..."

# 1. Check if constitutional files are being modified
log_info "Checking for constitutional modifications..."
CONSTITUTIONAL_FILES=$(git diff --cached --name-only | grep -E "(CONSTITUTION\.md|framework-core-v.*\.md|RemediationPlan\.schema\.ts)" || true)

if [ -n "$CONSTITUTIONAL_FILES" ]; then
    log_warning "Constitutional files being modified:"
    echo "$CONSTITUTIONAL_FILES" | while read file; do
        echo "   📄 $file"
    done
    
    # Check commit message format for constitutional changes
    COMMIT_MSG_FILE=".git/COMMIT_EDITMSG"
    if [ -f "$COMMIT_MSG_FILE" ]; then
        COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")
        if [[ ! "$COMMIT_MSG" =~ ^CONSTITUTIONAL: ]]; then
            log_error "Constitutional changes require commit message format: 'CONSTITUTIONAL: description'"
            log_info "Current commit message: $COMMIT_MSG"
        else
            log_success "Constitutional commit message format correct"
        fi
    fi
fi

# 2. Validate constitutional annotations in staged files
log_info "Validating constitutional annotations..."
STAGED_FILES=$(git diff --cached --name-only --diff-filter=AM | grep -E "\.(ts|js|md|yaml|yml)$" || true)

if [ -n "$STAGED_FILES" ]; then
    while IFS= read -r file; do
        if [ -f "$file" ]; then
            # Check for required annotations in framework files
            if [[ "$file" =~ ^(framework/|tools/|cli/) ]]; then
                if ! grep -q "@aegisFrameworkVersion" "$file" 2>/dev/null; then
                    log_error "Missing @aegisFrameworkVersion annotation in $file"
                fi
                if ! grep -q "@intent" "$file" 2>/dev/null; then
                    log_error "Missing @intent annotation in $file"
                fi
            fi
            
            # Check for blueprint references in generated code
            if [[ "$file" =~ \.(ts|js)$ ]] && grep -q "Generated.*AI" "$file" 2>/dev/null; then
                if ! grep -q "@aegisBlueprint" "$file" 2>/dev/null; then
                    log_warning "AI-generated file $file missing @aegisBlueprint annotation"
                fi
            fi
        fi
    done <<< "$STAGED_FILES"
fi

# 3. Run constitutional validation tools
log_info "Running constitutional validation tools..."

# Check if Node.js and npm are available
if ! command -v node &> /dev/null; then
    log_error "Node.js not found - required for constitutional validation"
elif ! command -v npm &> /dev/null; then
    log_error "npm not found - required for constitutional validation"
else
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        log_info "Installing dependencies for validation..."
        npm install --silent
    fi
    
    # Constitutional validation
    if [ -f "tools/validate-constitution.ts" ]; then
        log_info "Running constitutional validation..."
        if bun tools/validate-constitution.ts; then
            log_success "Constitutional validation passed"
        else
            log_error "Constitutional validation failed"
        fi
    else
        log_warning "Constitutional validation tool not found"
    fi
    
    # Template quality validation
    if [ -f "tools/validate-template-quality.ts" ]; then
        log_info "Running template quality validation..."
        if bun tools/validate-template-quality.ts; then
            log_success "Template quality validation passed"
        else
            log_error "Template quality validation failed"
        fi
    fi
    
    # Remediation plan validation (if plans exist)
    REMEDIATION_PLANS=$(git diff --cached --name-only | grep -E "remediation.*plan.*\.(yaml|yml|json)$" || true)
    if [ -n "$REMEDIATION_PLANS" ]; then
        log_info "Validating remediation plans..."
        echo "$REMEDIATION_PLANS" | while IFS= read -r plan; do
            if [ -f "$plan" ]; then
                log_info "Validating $plan..."
                if bun tools/validate-remediation-plan.ts "$plan"; then
                    log_success "Remediation plan $plan validated"
                else
                    log_error "Remediation plan $plan failed validation"
                fi
            fi
        done
    fi
    
    # Blueprint validation (if blueprints exist)
    BLUEPRINT_FILES=$(git diff --cached --name-only | grep -E "blueprint\.yaml$" || true)
    if [ -n "$BLUEPRINT_FILES" ]; then
        log_info "Validating blueprints..."
        echo "$BLUEPRINT_FILES" | while IFS= read -r blueprint; do
            if [ -f "$blueprint" ]; then
                log_info "Validating $blueprint..."
                if bun tools/validate-blueprint.ts "$blueprint"; then
                    log_success "Blueprint $blueprint validated"
                else
                    log_error "Blueprint $blueprint failed validation"
                fi
            fi
        done
    fi
fi

# 4. Check for evolution story requirements
log_info "Checking evolution story requirements..."
EVOLUTION_TRIGGERS=$(bun tools/detect-evolution-stories.ts 2>/dev/null | grep -E "(constitutional-violation|user-question)" || true)
if [ -n "$EVOLUTION_TRIGGERS" ]; then
    log_warning "Evolution story triggers detected:"
    echo "$EVOLUTION_TRIGGERS"
    log_info "Consider documenting these insights using: bun cli/generate-evolution-story.cjs"
fi

# 5. Intent enforcement check
log_info "Checking for agent drift patterns..."
STAGED_CONTENT=$(git diff --cached)
if echo "$STAGED_CONTENT" | grep -q "echo.*test" && echo "$STAGED_CONTENT" | grep -q "functional"; then
    log_warning "Potential agent drift detected: echo commands used for functional testing"
    log_info "Framework requires functional commands for testing intent"
fi

# 6. Version consistency check
log_info "Checking version consistency..."
if [ -f "VERSION" ]; then
    VERSION=$(cat VERSION)
    SPEC_FILE="framework/framework-core-v${VERSION}.md"
    if [ ! -f "$SPEC_FILE" ]; then
        log_error "Framework specification missing for version $VERSION: $SPEC_FILE"
    else
        log_success "Framework specification exists for version $VERSION"
    fi
else
    log_error "VERSION file missing"
fi

# 7. Final validation summary
echo ""
echo "🏛️ Constitutional Compliance Summary"
echo "====================================="
log_info "Warnings: $WARNINGS"
log_info "Errors: $ERRORS"

if [ "$VALIDATION_PASSED" = true ]; then
    log_success "All constitutional compliance checks passed"
    log_success "Commit approved by constitutional framework"
    exit 0
else
    echo ""
    log_error "Constitutional compliance violations detected"
    log_error "Commit blocked to protect framework integrity"
    echo ""
    echo "🔧 To fix these issues:"
    echo "   1. Address all constitutional violations listed above"
    echo "   2. Ensure all required annotations are present"
    echo "   3. Use proper commit message format for constitutional changes"
    echo "   4. Run validation tools manually to verify fixes"
    echo ""
    echo "📚 Documentation: docs/CONTRIBUTING.md"
    echo "🏛️ Constitution: CONSTITUTION.md"
    echo ""
    exit 1
fi
