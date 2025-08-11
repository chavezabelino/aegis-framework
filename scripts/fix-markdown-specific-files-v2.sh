#!/bin/bash

# Fix remaining markdown linting issues in specific files - Version 2
# Targets the remaining issues after the first round of fixes

set -e

echo "🔧 Fixing remaining markdown issues in specific files..."

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

# Function to fix multiple consecutive blank lines (MD012)
fix_multiple_blanks() {
    echo "  Fixing multiple consecutive blank lines (MD012)..."
    for file in "${TARGET_FILES[@]}"; do
        if [[ -f "$file" ]]; then
            echo "    Processing $file"
            # Replace multiple blank lines with single blank lines
            sed -i '' '/^$/N;/^\n$/D' "$file"
        fi
    done
}

# Function to fix first line heading issues (MD041)
fix_first_line_heading() {
    echo "  Fixing first line heading issues (MD041)..."
    for file in "${TARGET_FILES[@]}"; do
        if [[ -f "$file" ]]; then
            echo "    Processing $file"
            # Add # to files that start with content instead of heading
            if [[ ! $(head -1 "$file") =~ ^# ]]; then
                # For CONSTITUTION.md, move the version line after the heading
                if [[ "$file" == "CONSTITUTION.md" ]]; then
                    # Create a temporary file with proper structure
                    echo "# AI Agent Development Governance Charter" > temp_file.md
                    echo "" >> temp_file.md
                    echo "Constitution-Version: 2.5.1" >> temp_file.md
                    echo "" >> temp_file.md
                    tail -n +2 "$file" >> temp_file.md
                    mv temp_file.md "$file"
                else
                    # For other files, just add a heading
                    echo "# $(basename "$file" .md | tr '[:lower:]' '[:upper:]' | tr '-' ' ')" > temp_file.md
                    echo "" >> temp_file.md
                    cat "$file" >> temp_file.md
                    mv temp_file.md "$file"
                fi
            fi
        fi
    done
}

# Function to fix remaining proper names (MD044)
fix_remaining_proper_names() {
    echo "  Fixing remaining proper names (MD044)..."
    for file in "${TARGET_FILES[@]}"; do
        if [[ -f "$file" ]]; then
            echo "    Processing $file"
            sed -i '' 's/\btelemetry\b/Telemetry/g' "$file"
            sed -i '' 's/\bblueprint\b/Blueprint/g' "$file"
            sed -i '' 's/\bconstitutional\b/Constitutional/g' "$file"
            sed -i '' 's/\baegis\b/Aegis/g' "$file"
            sed -i '' 's/\bgithub\b/GitHub/g' "$file"
            sed -i '' 's/\bjson\b/JSON/g' "$file"
            sed -i '' 's/\byaml\b/YAML/g' "$file"
            sed -i '' 's/\bmarkdown\b/Markdown/g' "$file"
            sed -i '' 's/\bcli\b/CLI/g' "$file"
        fi
    done
}

# Function to fix line length issues (MD013) - basic approach
fix_line_length() {
    echo "  Fixing line length issues (MD013)..."
    for file in "${TARGET_FILES[@]}"; do
        if [[ -f "$file" ]]; then
            echo "    Processing $file"
            # This is a basic approach - break very long lines at word boundaries
            # More sophisticated line breaking would require a more complex script
            awk 'length > 120 { 
                if (length > 200) {
                    # For very long lines, try to break at word boundaries
                    gsub(/([^ ]{80,})/, "&\n  ", $0)
                }
                print $0
            } length <= 120 { print $0 }' "$file" > temp_file.md
            mv temp_file.md "$file"
        fi
    done
}

# Run all fixes
fix_multiple_blanks
fix_first_line_heading
fix_remaining_proper_names
fix_line_length

echo "✅ Markdown fixes v2 for specific files completed!"
echo "📁 Files processed:"
for file in "${TARGET_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (not found)"
    fi
done
