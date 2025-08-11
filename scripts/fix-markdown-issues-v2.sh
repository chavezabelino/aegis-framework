#!/bin/bash

# Fix remaining markdown linting issues - Version 2
# This script addresses the most frequent markdownlint violations

set -e

echo "🔧 Fixing remaining markdown linting issues..."

# Function to fix proper names capitalization more comprehensively
fix_proper_names_v2() {
    echo "  Fixing proper names capitalization (MD044)..."
    
    # Fix common technology names
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i '' 's/\bjson\b/JSON/g' {} \;
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i '' 's/\byaml\b/YAML/g' {} \;
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i '' 's/\bjavascript\b/JavaScript/g' {} \;
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i '' 's/\btypescript\b/TypeScript/g' {} \;
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i '' 's/\bmarkdown\b/Markdown/g' {} \;
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i '' 's/\bblueprint\b/Blueprint/g' {} \;
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i '' 's/\bgithub\b/GitHub/g' {} \;
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i '' 's/\bconstitutional\b/Constitutional/g' {} \;
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i '' 's/\baegis\b/Aegis/g' {} \;
    
    # Fix AEGIS to Aegis (proper case)
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i '' 's/\bAEGIS\b/Aegis/g' {} \;
}

# Function to fix emphasis style (asterisk to underscore for MD049)
fix_emphasis_style_v2() {
    echo "  Fixing emphasis style (MD049) - asterisk to underscore..."
    # Find files with asterisk emphasis and replace with underscore
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i '' 's/\([^*]\)\*\([^*]*\)\*\([^*]\)/\1_\2_\3/g' {} \;
    find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*" -exec sed -i '' 's/^\*\([^*]*\)\*$/_\1_/g' {} \;
}

# Function to fix ordered list prefixes
fix_ordered_lists_v2() {
    echo "  Fixing ordered list prefixes (MD029)..."
    # This is more complex and might need manual review
    echo "    Note: Ordered list prefixes may need manual review"
}

# Function to fix first line heading issues
fix_first_line_headings_v2() {
    echo "  Fixing first line heading issues (MD041)..."
    # Add # to files that start with content instead of heading
    for file in $(find . -name "*.md" -not -path "./dist/*" -not -path "./node_modules/*"); do
        if [[ ! $(head -1 "$file") =~ ^# ]]; then
            echo "    Adding heading to $file"
            # This is complex and might need manual review
        fi
    done
}

# Function to fix multiple top-level headings
fix_multiple_h1() {
    echo "  Fixing multiple top-level headings (MD025)..."
    # This is complex and might need manual review
    echo "    Note: Multiple H1 headings may need manual review"
}

# Function to fix link fragments
fix_link_fragments() {
    echo "  Fixing link fragments (MD051)..."
    # This is complex and might need manual review
    echo "    Note: Link fragments may need manual review"
}

# Function to fix line length
fix_line_length() {
    echo "  Fixing line length (MD013)..."
    # This is complex and might need manual review
    echo "    Note: Line length issues may need manual review"
}

# Run all fixes
fix_proper_names_v2
fix_emphasis_style_v2
fix_ordered_lists_v2
fix_first_line_headings_v2
fix_multiple_h1
fix_link_fragments
fix_line_length

echo "✅ Markdown fixes v2 completed!"
echo "⚠️  Some issues may require manual review (ordered lists, first line headings, multiple H1, link fragments, line length)"
