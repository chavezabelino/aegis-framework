#!/bin/bash

# Aegis Framework Git Hooks Setup
# Install constitutional enforcement pre-commit hook
#
# @aegisFrameworkVersion: 1.3.0
# @intent: Setup constitutional enforcement in git workflow
# @constitutionalAuthority: Article IX, Section 4

echo "🏛️  Setting up Aegis Framework Constitutional Enforcement"
echo "========================================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    echo "   Please run this script from the root of your Aegis Framework repository"
    exit 1
fi

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Copy the pre-commit hook
echo "📝 Installing pre-commit hook..."
cp tools/pre-commit-hook.sh .git/hooks/pre-commit

# Make it executable
chmod +x .git/hooks/pre-commit

echo "✅ Pre-commit hook installed successfully"
echo ""
echo "🎯 Constitutional enforcement is now active"
echo "   All commits will be validated against:"
echo "   - Article IX: Template and Documentation Quality Standards"
echo "   - Blueprint schema compliance"
echo "   - Constitutional annotations"
echo "   - HTML entity prohibition"
echo ""
echo "📚 Available validation commands:"
echo "   npm run validate:all       # Complete constitutional validation"
echo "   npm run validate:templates # Template quality only"
echo "   npm run validate:fidelity  # Output fidelity only"
echo "   npm run validate           # Basic constitutional compliance"
echo ""
echo "🚀 Framework constitutional governance is ready!"
