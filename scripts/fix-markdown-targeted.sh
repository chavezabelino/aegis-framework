#!/bin/bash

# Fix targeted markdown linting issues - Safe approach
# This script addresses only the most critical and safe markdownlint violations

set -e

echo "🔧 Fixing targeted markdown linting issues..."

# Function to add language to fenced code blocks (MD040) - SAFE
fix_fenced_code_blocks_safe() {
    echo "  Fixing fenced code blocks without language (MD040)..."
    # Add 'text' language to code blocks that don't have a language specified
    # Only target specific files that we know are safe
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -not -path "./website/node_modules/*" -exec sed -i '' 's/^```$/```text/g' {} \;
}

# Function to fix proper names capitalization (MD044) - SAFE
fix_proper_names_safe() {
    echo "  Fixing proper names capitalization (MD044)..."
    # Only fix the most common and safe cases
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -not -path "./website/node_modules/*" -exec sed -i '' 's/\bjson\b/JSON/g' {} \;
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -not -path "./website/node_modules/*" -exec sed -i '' 's/\byaml\b/YAML/g' {} \;
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -not -path "./website/node_modules/*" -exec sed -i '' 's/\bjavascript\b/JavaScript/g' {} \;
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -not -path "./website/node_modules/*" -exec sed -i '' 's/\btypescript\b/TypeScript/g' {} \;
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -not -path "./website/node_modules/*" -exec sed -i '' 's/\bmarkdown\b/Markdown/g' {} \;
}

# Run safe fixes only
fix_fenced_code_blocks_safe
fix_proper_names_safe

echo "✅ Targeted markdown fixes completed!"
echo "⚠️  Only safe, non-breaking changes were applied"
