#!/bin/bash

# GitHub Actions Cleanup Script
# Note: Manual deletion required through GitHub UI or GitHub CLI

echo "🧹 GitHub Actions Cleanup Guide"
echo "================================"

echo ""
echo "📋 Current Workflow Status:"
echo "- 42 failed runs (mostly ES module issues - now fixed)"
echo "- Multiple workflow files with different purposes"
echo ""

echo "🛠️ Cleanup Options:"
echo ""
echo "1. MANUAL CLEANUP (GitHub UI):"
echo "   → Go to Actions tab → Select failed runs → Delete individually"
echo "   → Time consuming but most reliable"
echo ""

echo "2. GITHUB CLI CLEANUP (Recommended):"
echo "   → Install: brew install gh"
echo "   → Login: gh auth login"
echo "   → List runs: gh run list --limit 50"
echo "   → Delete run: gh run delete <run-id>"
echo ""

echo "3. BULK CLEANUP SCRIPT:"
echo "   → Delete all failed runs older than 30 days"
echo ""

if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI found - running cleanup..."
    
    echo "📊 Current workflow runs:"
    gh run list --limit 10
    
    echo ""
    read -p "🗑️ Delete all failed runs? (y/N): " confirm
    
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
        echo "🧹 Deleting failed workflow runs..."
        
        # Get failed run IDs and delete them
        failed_runs=$(gh run list --status failure --json databaseId --jq '.[].databaseId')
        
        for run_id in $failed_runs; do
            echo "Deleting run: $run_id"
            gh run delete $run_id --confirm
        done
        
        echo "✅ Cleanup complete!"
    else
        echo "❌ Cleanup cancelled"
    fi
else
    echo "❌ GitHub CLI not found"
    echo "Install with: brew install gh"
    echo "Then run: gh auth login"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Review workflow necessity (see workflow-optimization.md)"
echo "2. Optimize remaining workflows"
echo "3. Set up proper CI/CD pipeline"
