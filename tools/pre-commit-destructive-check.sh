#!/bin/bash

# @aegisFrameworkVersion: 2.1.0
# @intent: Pre-commit hook to prevent destructive actions
# @context: Constitutional protection against framework-breaking commits

echo "🛡️ Pre-commit Destructive Action Check"
echo "======================================"

# Check for destructive patterns in staged files
DESTRUCTIVE_PATTERNS=(
    "rm -rf"
    "rm -r"
    "rm -f"
    "rm -rf ."
    "rm -rf /"
    "rm -rf node_modules"
    "rm -rf dist"
    "rm -rf .framework"
    "rm -rf .aegis"
    "rm -rf .vscode"
    "rm -rf .cursor"
    "rm CONSTITUTION.md"
    "rm VERSION"
    "rm package.json"
    "rm tsconfig.json"
    "rm README.md"
    "rm CHANGELOG.md"
    "rm CONTRIBUTING.md"
    "rm LICENSE"
)

# Check staged files for destructive patterns
STAGED_FILES=$(git diff --cached --name-only)

for file in $STAGED_FILES; do
    if [[ -f "$file" ]]; then
        content=$(git show ":$file")
        
        for pattern in "${DESTRUCTIVE_PATTERNS[@]}"; do
            if echo "$content" | grep -q "$pattern"; then
                echo "🚨 DESTRUCTIVE ACTION DETECTED in $file"
                echo "   Pattern: $pattern"
                echo "❌ Commit blocked - Framework protection activated"
                exit 1
            fi
        done
    fi
done

# Check for deletion of essential files
ESSENTIAL_FILES=(
    "CONSTITUTION.md"
    "VERSION"
    "package.json"
    "tsconfig.json"
    "README.md"
    "CHANGELOG.md"
    "CONTRIBUTING.md"
    "LICENSE"
)

for file in "${ESSENTIAL_FILES[@]}"; do
    if git diff --cached --name-status | grep -q "^D.*$file$"; then
        echo "🚨 ESSENTIAL FILE DELETION DETECTED: $file"
        echo "❌ Commit blocked - Constitutional violation"
        exit 1
    fi
done

# Check for deletion of essential directories
ESSENTIAL_DIRS=(
    "framework"
    "docs"
    "cli"
    "tools"
    "blueprints"
    "adapters"
    "tests"
    "examples"
    "templates"
    "scaffolds"
)

for dir in "${ESSENTIAL_DIRS[@]}"; do
    if git diff --cached --name-status | grep -q "^D.*$dir/"; then
        echo "🚨 ESSENTIAL DIRECTORY DELETION DETECTED: $dir/"
        echo "❌ Commit blocked - Framework integrity violation"
        exit 1
    fi
done

echo "✅ No destructive actions detected"
echo "✅ Commit allowed to proceed"
exit 0
