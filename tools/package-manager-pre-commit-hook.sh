#!/usr/bin/env bash

# Package Manager Consistency Pre-Commit Hook
# @aegisFrameworkVersion 2.4.0
# @intent Prevent package manager drift from being committed
# @context Constitutional enforcement at commit time

echo "🔍 Checking package manager consistency..."

# Run package manager validation
if ! bun tools/validate-package-manager-consistency.ts; then
    echo ""
    echo "🚨 COMMIT BLOCKED: Package manager inconsistency detected!"
    echo ""
    echo "The Aegis Framework constitutional requirements mandate:"
    echo "  ✅ Development commands use Bun"
    echo "  ✅ Distribution commands use NPM"
    echo "  ❌ No hybrid npm/node/bun mixing"
    echo ""
    echo "🔧 Auto-fix available:"
    echo "   bun tools/fix-package-manager-consistency.ts"
    echo ""
    echo "Or manually review and fix the issues above."
    echo "Then re-attempt your commit."
    exit 1
fi

echo "✅ Package manager consistency validated"
