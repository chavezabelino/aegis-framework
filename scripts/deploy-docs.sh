#!/bin/bash

# Deploy Docusaurus documentation to GitHub Pages
# Run this script from the project root

set -e

echo "🚀 Deploying Aegis Framework Documentation to GitHub Pages"
echo "=========================================================="

# Update framework data first
echo "📊 Updating framework data..."
node tools/framework-capability-mapper.ts
node framework/registry/blueprint-registry.ts discover
node tools/update-framework-dashboard.ts

# Navigate to website directory
cd website

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci
fi

# Build the site
echo "🏗️ Building documentation site..."
npm run build

# Deploy to GitHub Pages
echo "🚀 Deploying to GitHub Pages..."
npm run deploy

echo "✅ Documentation deployed successfully!"
echo "🌐 Your site will be available at: https://your-username.github.io/aegis-framework/"
echo ""
echo "📝 Next steps:"
echo "1. Update the GitHub repository settings to enable GitHub Pages"
echo "2. Set the source to 'gh-pages' branch"
echo "3. Update docusaurus.config.ts with your actual GitHub username"
