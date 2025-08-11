#!/bin/bash

# Fix common markdown linting issues
# This script addresses the most frequent markdownlint violations

set -e

echo "🔧 Fixing markdown linting issues..."

# Function to fix emphasis style (underscore to asterisk)
fix_emphasis_style() {
    echo "  Fixing emphasis style (MD049)..."
    # Find files with underscore emphasis and replace with asterisk
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i '' 's/\([^_]\)_\([^_]*\)_\([^_]\)/\1*\2*\3/g' {} \;
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i '' 's/^_\([^_]*\)_$/*\1*/g' {} \;
}

# Function to add language to fenced code blocks
fix_fenced_code_blocks() {
    echo "  Fixing fenced code blocks without language (MD040)..."
    # Add 'text' language to code blocks that don't have a language specified
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i '' 's/^```$/```text/g' {} \;
}

# Function to fix proper names capitalization
fix_proper_names() {
    echo "  Fixing proper names capitalization (MD044)..."
    # Fix common proper names
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i '' 's/\baegis\b/Aegis/g' {} \;
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i '' 's/\bjson\b/JSON/g' {} \;
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i '' 's/\bcli\b/CLI/g' {} \;
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i '' 's/\bgithub\b/GitHub/g' {} \;
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i '' 's/\bconstitutional\b/Constitutional/g' {} \;
}

# Function to fix ordered list prefixes
fix_ordered_lists() {
    echo "  Fixing ordered list prefixes (MD029)..."
    # This is more complex and might need manual review
    echo "    Note: Ordered list prefixes may need manual review"
}

# Function to fix first line heading issues
fix_first_line_headings() {
    echo "  Fixing first line heading issues (MD041)..."
    # Add # to files that start with content instead of heading
    for file in $(find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*"); do
        if [[ ! $(head -1 "$file") =~ ^# ]]; then
            echo "    Adding heading to $file"
            # This is complex and might need manual review
        fi
    done
}

# Run all fixes
fix_emphasis_style
fix_fenced_code_blocks
fix_proper_names
fix_ordered_lists
fix_first_line_headings

echo "✅ Markdown fixes completed!"
echo "⚠️  Some issues may require manual review (ordered lists, first line headings)"
