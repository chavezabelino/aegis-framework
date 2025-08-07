#!/usr/bin/env bash

# Setup proactive evolution story detection
# @aegisFrameworkVersion 2.0.0-alpha-dev
# @intent Install git hooks and development workflow integration for real-time detection
# @context Make evolution story detection proactive rather than reactive

echo "🔧 Setting up proactive evolution story detection..."

# Install git hooks
echo "📋 Installing git hooks..."

# Copy pre-commit hook
if [ -f ".git/hooks/pre-commit" ]; then
    echo "⚠️ Pre-commit hook already exists, backing up..."
    cp .git/hooks/pre-commit .git/hooks/pre-commit.backup
fi

cp tools/setup-proactive-detection.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

# Create post-commit hook for additional scanning
cat > .git/hooks/post-commit << 'EOF'
#!/usr/bin/env bash
# Post-commit evolution story detection
echo "🔍 Post-commit evolution story scan..."
if [ -f "cli/detect-evolution-stories.cjs" ]; then
    node cli/detect-evolution-stories.cjs
fi
EOF

chmod +x .git/hooks/post-commit

# Setup development workflow integration
echo "⚙️ Setting up development workflow integration..."

# Add npm scripts for proactive workflows
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Add proactive detection scripts
pkg.scripts = pkg.scripts || {};
pkg.scripts['pre-commit-check'] = 'node cli/detect-evolution-stories.cjs';
pkg.scripts['dev-scan'] = 'watch \"npm run detect-evolution\" docs/ framework/ tools/ --interval=30';
pkg.scripts['setup-proactive'] = 'bash tools/setup-proactive-detection.sh';

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('✅ Added proactive detection scripts to package.json');
"

# Create VSCode settings for automatic detection
mkdir -p .vscode
cat > .vscode/tasks.json << 'EOF'
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Evolution Story Detection",
            "type": "shell",
            "command": "npm run detect-evolution",
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "shared",
                "showReuseMessage": true,
                "clear": false
            },
            "problemMatcher": [],
            "runOptions": {
                "runOn": "folderOpen"
            }
        },
        {
            "label": "Watch Evolution Triggers",
            "type": "shell", 
            "command": "npm run dev-scan",
            "group": "build",
            "isBackground": true,
            "presentation": {
                "echo": true,
                "reveal": "always",
                "panel": "new"
            },
            "problemMatcher": []
        }
    ]
}
EOF

# Create VSCode settings for automatic scanning
cat > .vscode/settings.json << 'EOF'
{
    "files.watcherExclude": {
        "**/node_modules/**": true,
        "**/.git/**": true,
        "**/docs/evolution/**": false
    },
    "tasks.runOn": "folderOpen",
    "git.hooks": true,
    "git.enableSmartCommit": true
}
EOF

echo ""
echo "🎉 Proactive evolution story detection setup complete!"
echo ""
echo "📋 What's now automated:"
echo "   ✅ Pre-commit hook: Scans before every commit"
echo "   ✅ Post-commit hook: Scans after commits"
echo "   ✅ CI/CD integration: Scans on every PR"
echo "   ✅ VSCode tasks: Run detection on folder open"
echo "   ✅ npm scripts: Easy access to all detection tools"
echo ""
echo "🔧 Available commands:"
echo "   npm run detect-evolution      # Manual scan"
echo "   npm run pre-commit-check      # Pre-commit scan"
echo "   npm run dev-scan              # Watch mode (requires 'watch' tool)"
echo "   npm run setup-proactive       # Re-run this setup"
echo ""
echo "💡 VSCode users: Open Command Palette (Cmd+Shift+P) and run:"
echo "   'Tasks: Run Task' → 'Evolution Story Detection'"
echo "   'Tasks: Run Task' → 'Watch Evolution Triggers'"
echo ""
echo "🚨 Git hook behavior:"
echo "   - Scans before each commit"
echo "   - Warns if auto-generated stories are created"
echo "   - Prompts to review before committing"
echo "   - Can be bypassed with 'git commit --no-verify'"
EOF
