#!/bin/bash

echo "🧹 Cleaning .DS_Store files..."
find . -name .DS_Store -print -delete

echo "📦 Adding .gitkeep to empty folders..."
find . -type d ! -path '*/\.*' | while read dir; do
  if [ -z "$(ls -A "$dir")" ]; then
    touch "$dir/.gitkeep"
    echo "  → .gitkeep added in $dir"
  fi
done

echo "📄 Ensuring .gitignore contains .DS_Store"
grep -qxF '.DS_Store' .gitignore || echo '.DS_Store' >> .gitignore

echo "✅ Done. You can now commit the changes:"
echo "   git add ."
echo "   git commit -m 'chore: cleanup .DS_Store and preserve empty dirs'"

