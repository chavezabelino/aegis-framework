#!/bin/bash

# Aegis Framework Pre-commit Hook
# Constitutional enforcement for Article IX: Template and Documentation Quality Standards
#
# @aegisFrameworkVersion: 1.3.0
# @intent: Prevent constitutional violations before commit
# @constitutionalAuthority: Article IX, Section 4

echo "🏛️  Aegis Framework Constitutional Validation"
echo "============================================="

# Track validation results
VALIDATION_ERRORS=0

# 1. Constitutional compliance validation
echo ""
echo "📜 Validating constitutional compliance..."
if ! bun tools/validate-constitution.ts; then
    echo "❌ Constitutional compliance validation failed"
    VALIDATION_ERRORS=$((VALIDATION_ERRORS + 1))
else
    echo "✅ Constitutional compliance validated"
fi

# 2. Template quality validation (Article IX)
echo ""
echo "📝 Validating template quality (Article IX)..."
if ! bun tools/validate-template-quality.cjs; then
    echo "❌ Template quality validation failed"
    VALIDATION_ERRORS=$((VALIDATION_ERRORS + 1))
else
    echo "✅ Template quality validated"
fi

# 3. Output fidelity validation (Article IX)
echo ""
echo "🎯 Validating output fidelity (Article IX)..."
if ! bun tools/validate-output-fidelity.cjs; then
    echo "❌ Output fidelity validation failed"
    VALIDATION_ERRORS=$((VALIDATION_ERRORS + 1))
else
    echo "✅ Output fidelity validated"
fi

# 4. Blueprint validation for any blueprint changes
BLUEPRINT_FILES=$(git diff --cached --name-only | grep "blueprints/.*\.yaml$")
if [ -n "$BLUEPRINT_FILES" ]; then
    echo ""
    echo "📋 Validating blueprint changes..."
    for blueprint in $BLUEPRINT_FILES; do
        if ! bun tools/validate-blueprint.ts "$blueprint"; then
            echo "❌ Blueprint validation failed: $blueprint"
            VALIDATION_ERRORS=$((VALIDATION_ERRORS + 1))
        else
            echo "✅ Blueprint validated: $blueprint"
        fi
    done
fi

# 5. Check for constitutional annotations in framework files
FRAMEWORK_FILES=$(git diff --cached --name-only | grep "framework/.*\.(ts|js|md)$")
if [ -n "$FRAMEWORK_FILES" ]; then
    echo ""
    echo "🏛️  Checking constitutional annotations..."
    for file in $FRAMEWORK_FILES; do
        if [ -f "$file" ]; then
            if ! grep -q "@aegisFrameworkVersion" "$file"; then
                echo "❌ Missing @aegisFrameworkVersion annotation: $file"
                VALIDATION_ERRORS=$((VALIDATION_ERRORS + 1))
            fi
            if ! grep -q "@intent" "$file"; then
                echo "❌ Missing @intent annotation: $file"
                VALIDATION_ERRORS=$((VALIDATION_ERRORS + 1))
            fi
        fi
    done
    
    if [ $VALIDATION_ERRORS -eq 0 ]; then
        echo "✅ Constitutional annotations validated"
    fi
fi

# 6. Check for HTML entities in templates
TEMPLATE_FILES=$(git diff --cached --name-only | grep -E "\.(md|ejs|template)$")
if [ -n "$TEMPLATE_FILES" ]; then
    echo ""
    echo "🔤 Checking for HTML entities (Article IX violation)..."
    HTML_ENTITY_VIOLATIONS=0
    
    for file in $TEMPLATE_FILES; do
        if [ -f "$file" ]; then
            # Check for common HTML entities
            if grep -n "&#39;\|&apos;\|&quot;\|&ldquo;\|&rdquo;\|&lsquo;\|&rsquo;\|&mdash;\|&ndash;\|&amp;\|&lt;\|&gt;\|&nbsp;" "$file"; then
                echo "❌ HTML entities found in: $file"
                echo "   Article IX requires plain Unicode characters"
                HTML_ENTITY_VIOLATIONS=$((HTML_ENTITY_VIOLATIONS + 1))
            fi
        fi
    done
    
    if [ $HTML_ENTITY_VIOLATIONS -gt 0 ]; then
        VALIDATION_ERRORS=$((VALIDATION_ERRORS + HTML_ENTITY_VIOLATIONS))
        echo ""
        echo "💡 Suggestion: Replace HTML entities with plain Unicode characters:"
        echo "   &#39; → '"
        echo "   &quot; → \""
        echo "   &mdash; → —"
        echo "   &ndash; → –"
        echo "   etc."
    else
        echo "✅ No HTML entities detected"
    fi
fi

# Final validation summary
echo ""
echo "============================================="
if [ $VALIDATION_ERRORS -eq 0 ]; then
    echo "✅ All constitutional validations passed"
    echo "🚀 Commit approved"
    exit 0
else
    echo "❌ $VALIDATION_ERRORS constitutional violation(s) detected"
    echo ""
    echo "🏛️  CONSTITUTIONAL ENFORCEMENT"
    echo "   All violations must be resolved before commit."
    echo "   The Aegis Framework Constitution requires:"
    echo "   - Article IX: Template quality and encoding standards"
    echo "   - Blueprint primacy and traceability"
    echo "   - Mandatory annotations for framework files"
    echo ""
    echo "📚 Resources:"
    echo "   - Constitution: CONSTITUTION.md"
    echo "   - Template quality: npm run validate:templates"
    echo "   - Output fidelity: npm run validate:fidelity"
    echo "   - Full validation: npm run validate:all"
    echo ""
    exit 1
fi
