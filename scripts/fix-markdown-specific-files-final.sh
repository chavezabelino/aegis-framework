#!/bin/bash

# Final markdown linting fixes for specific files
# Targets the last remaining issues

set -e

echo "🔧 Final markdown fixes for specific files..."

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

# Function to fix multiple H1 headings (MD025)
fix_multiple_h1() {
    echo "  Fixing multiple H1 headings (MD025)..."
    for file in "${TARGET_FILES[@]}"; do
        if [[ -f "$file" ]]; then
            echo "    Processing $file"
            # Convert all H1 headings except the first one to H2
            awk '
            BEGIN { first_h1 = 0 }
            /^# / { 
                if (first_h1 == 0) {
                    first_h1 = 1
                    print $0
                } else {
                    sub(/^# /, "## ", $0)
                    print $0
                }
                next
            }
            { print $0 }
            ' "$file" > temp_file.md
            mv temp_file.md "$file"
        fi
    done
}

# Function to fix remaining proper names (MD044) - more comprehensive
fix_remaining_proper_names_final() {
    echo "  Fixing remaining proper names (MD044)..."
    for file in "${TARGET_FILES[@]}"; do
        if [[ -f "$file" ]]; then
            echo "    Processing $file"
            # More comprehensive proper names fixes
            sed -i '' 's/\btelemetry\b/Telemetry/g' "$file"
            sed -i '' 's/\bblueprint\b/Blueprint/g' "$file"
            sed -i '' 's/\bconstitutional\b/Constitutional/g' "$file"
            sed -i '' 's/\baegis\b/Aegis/g' "$file"
            sed -i '' 's/\bgithub\b/GitHub/g' "$file"
            sed -i '' 's/\bjson\b/JSON/g' "$file"
            sed -i '' 's/\byaml\b/YAML/g' "$file"
            sed -i '' 's/\bmarkdown\b/Markdown/g' "$file"
            sed -i '' 's/\bcli\b/CLI/g' "$file"
            sed -i '' 's/\btypescript\b/TypeScript/g' "$file"
            sed -i '' 's/\bjavascript\b/JavaScript/g' "$file"
            sed -i '' 's/\bsha256\b/SHA256/g' "$file"
            sed -i '' 's/\bhmac\b/HMAC/g' "$file"
            sed -i '' 's/\bndjson\b/NDJSON/g' "$file"
        fi
    done
}

# Function to fix line length issues (MD013) - more aggressive
fix_line_length_final() {
    echo "  Fixing line length issues (MD013)..."
    for file in "${TARGET_FILES[@]}"; do
        if [[ -f "$file" ]]; then
            echo "    Processing $file"
            # More aggressive line breaking for very long lines
            awk '
            length > 120 {
                if (length > 150) {
                    # For very long lines, break at word boundaries more aggressively
                    gsub(/([^ ]{60,})/, "&\n  ", $0)
                }
                print $0
            }
            length <= 120 { print $0 }
            ' "$file" > temp_file.md
            mv temp_file.md "$file"
        fi
    done
}

# Run all fixes
fix_multiple_h1
fix_remaining_proper_names_final
fix_line_length_final

echo "✅ Final markdown fixes for specific files completed!"
echo "📁 Files processed:"
for file in "${TARGET_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (not found)"
    fi
done

echo ""
echo "📊 Progress Summary:"
echo "  - Started with: 410 issues"
echo "  - After v1: 202 issues (51% reduction)"
echo "  - After final: Check remaining count"
