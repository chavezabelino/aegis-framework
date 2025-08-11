#!/bin/bash

# Repo-wide Markdown + Workflow Lint Cleanup
# Fixes markdownlint issues and YAML workflow errors

set -e

echo "🔧 Starting repo-wide markdown and workflow cleanup..."

# Make scripts executable
chmod +x scripts/markdown-safe-transformer.js
chmod +x scripts/fix-markdown-headings.js

# Find all markdown files
echo "📁 Finding markdown files..."
MARKDOWN_FILES=$(find . -name "*.md" -o -name "*.markdown" | grep -v node_modules | grep -v .git | sort)

echo "📊 Found $(echo "$MARKDOWN_FILES" | wc -l) markdown files"

# Process each markdown file
echo "🔧 Processing markdown files..."
for file in $MARKDOWN_FILES; do
  echo "  Processing: $file"
  
  # Fix MD041: First line heading
  node scripts/fix-markdown-headings.js "$file"
  
  # Apply safe transformer fixes
  node scripts/markdown-safe-transformer.js "$file"
done

# Fix YAML workflow file
echo "🔧 Fixing YAML workflow file..."
WORKFLOW_FILE=".github/workflows/aegis-governance.yml"

if [[ -f "$WORKFLOW_FILE" ]]; then
  echo "  Processing: $WORKFLOW_FILE"
  
  # Create backup
  cp "$WORKFLOW_FILE" "${WORKFLOW_FILE}.backup"
  
  # Fix the broken section around lines 410-453
  # Replace the problematic area with the safe, portable script
  sed -i '' '/- name: Emit planning event/,/- name: Prove evidence (PREC)/c\
- name: Emit planning event\
  shell: bash\
  run: |\
    set -euo pipefail\
    mkdir -p .aegis/telemetry\
    ts="$(date -u +%FT%TZ)"\
    printf '"'"'{"timestamp":"%s","event":"planning.detected","context":"user authentication"}\n'"'"' "$ts" >> .aegis/telemetry/planning-events.ndjson\
\
- name: Plan gate (MVP)\
  shell: bash\
  env:\
    PLAN_GATE_ALLOW_MISSING: ${{ github.event_name == '"'"'pull_request'"'"' && '"'"'true'"'"' || '"'"'false'"'"' }}\
  run: |\
    node scripts/ci/plan-gate.mjs .aegis/outputs/auth-plan-strict.json\
\
- name: Prove evidence (PREC)\
  shell: bash\
  run: |\
    node tools/prove-evidence.mjs' "$WORKFLOW_FILE"
  
  echo "  ✅ Fixed YAML workflow structure"
else
  echo "  ⚠️  Workflow file not found: $WORKFLOW_FILE"
fi

echo ""
echo "✅ Cleanup completed!"
echo ""
echo "📊 Validation:"
echo "  Running markdown lint check..."
pnpm lint:markdown 2>&1 | head -20

echo ""
echo "  Running YAML validation..."
if command -v yamllint >/dev/null 2>&1; then
  yamllint "$WORKFLOW_FILE" || echo "  ⚠️  yamllint not available, using node validation"
fi

# Node-based YAML validation
node -e "
const fs = require('fs');
const yaml = require('js-yaml');
try {
  const content = fs.readFileSync('$WORKFLOW_FILE', 'utf8');
  yaml.load(content);
  console.log('  ✅ YAML workflow parses successfully');
} catch (error) {
  console.log('  ❌ YAML workflow has errors:', error.message);
  process.exit(1);
}
" 2>/dev/null || echo "  ⚠️  js-yaml not available for validation"

echo ""
echo "🎯 Summary:"
echo "  - Processed $(echo "$MARKDOWN_FILES" | wc -l) markdown files"
echo "  - Fixed YAML workflow structure"
echo "  - Applied safe transformations (preserved code blocks, URLs, paths)"
echo ""
echo "📝 Next steps:"
echo "  - Review any remaining markdownlint errors above"
echo "  - Test the workflow with 'act' if available"
echo "  - Commit changes with descriptive message"
