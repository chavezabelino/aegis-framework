#!/bin/bash

# Fix markdown linting issues in specific files only
# Targets the files with the highest error counts

set -e

echo "🔧 Fixing markdown issues in specific files..."

# Define the target files
TARGET_FILES=(
    "CONSTITUTION.md"
    "CONTRIBUTING.md"
    ".github/workflows/aegis-governance.yml"
    "docs/aegis/governance/consumer-setup.md"
    "docs/aegis/governance/markdown-quality.md"
    "docs/aegis/governance/profiles.md"
    "docs/quality-gates.md"
)

# Function to fix fenced code blocks without language (MD040)
fix_fenced_code_blocks() {
    echo "  Fixing fenced code blocks without language (MD040)..."
    for file in "${TARGET_FILES[@]}"; do
        if [[ -f "$file" ]]; then
            echo "    Processing $file"
            sed -i '' 's/^```$/```text/g' "$file"
        fi
    done
}

# Function to fix proper names capitalization (MD044)
fix_proper_names() {
    echo "  Fixing proper names capitalization (MD044)..."
    for file in "${TARGET_FILES[@]}"; do
        if [[ -f "$file" ]]; then
            echo "    Processing $file"
            sed -i '' 's/\bjson\b/JSON/g' "$file"
            sed -i '' 's/\byaml\b/YAML/g' "$file"
            sed -i '' 's/\bjavascript\b/JavaScript/g' "$file"
            sed -i '' 's/\btypescript\b/TypeScript/g' "$file"
            sed -i '' 's/\bmarkdown\b/Markdown/g' "$file"
            sed -i '' 's/\bblueprint\b/Blueprint/g' "$file"
            sed -i '' 's/\bgithub\b/GitHub/g' "$file"
            sed -i '' 's/\bconstitutional\b/Constitutional/g' "$file"
            sed -i '' 's/\baegis\b/Aegis/g' "$file"
            sed -i '' 's/\bcli\b/CLI/g' "$file"
        fi
    done
}

# Function to fix trailing spaces (MD009)
fix_trailing_spaces() {
    echo "  Fixing trailing spaces (MD009)..."
    for file in "${TARGET_FILES[@]}"; do
        if [[ -f "$file" ]]; then
            echo "    Processing $file"
            sed -i '' 's/[[:space:]]*$//' "$file"
        fi
    done
}

# Function to fix emphasis style (MD049) - only underscore to asterisk
fix_emphasis_style() {
    echo "  Fixing emphasis style (MD049)..."
    for file in "${TARGET_FILES[@]}"; do
        if [[ -f "$file" ]]; then
            echo "    Processing $file"
            # Only fix underscore to asterisk, not the reverse
            sed -i '' 's/\([^*]\)_\([^_]*\)_\([^*]\)/\1*\2*\3/g' "$file"
            sed -i '' 's/^_\([^_]*\)_$/*\1*/g' "$file"
        fi
    done
}

# Function to fix headings without blank lines (MD022)
fix_headings_blank_lines() {
    echo "  Fixing headings without blank lines (MD022)..."
    for file in "${TARGET_FILES[@]}"; do
        if [[ -f "$file" ]]; then
            echo "    Processing $file"
            # Add blank line before headings that don't have one
            sed -i '' 's/^\([^#\n]\)/\n\1/' "$file"
            # Add blank line after headings that don't have one
            sed -i '' 's/^\(#.*\)$/\1\n/' "$file"
        fi
    done
}

# Function to fix lists without blank lines (MD032)
fix_lists_blank_lines() {
    echo "  Fixing lists without blank lines (MD032)..."
    for file in "${TARGET_FILES[@]}"; do
        if [[ -f "$file" ]]; then
            echo "    Processing $file"
            # Add blank line before lists that don't have one
            sed -i '' 's/^\([^-\n]\)/\n\1/' "$file"
            # Add blank line after lists that don't have one
            sed -i '' 's/^\(-.*\)$/\1\n/' "$file"
        fi
    done
}

# Run all fixes
fix_fenced_code_blocks
fix_proper_names
fix_trailing_spaces
fix_emphasis_style
fix_headings_blank_lines
fix_lists_blank_lines

echo "✅ Markdown fixes for specific files completed!"
echo "📁 Files processed:"
for file in "${TARGET_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (not found)"
    fi
done
