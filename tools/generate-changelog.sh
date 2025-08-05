#!/bin/bash

# Aegis Framework Changelog Generator
# Usage: ./generate-changelog.sh <version> <description>

VERSION=$1
DESCRIPTION=$2

if [ -z "$VERSION" ]; then
    echo "Usage: ./generate-changelog.sh <version> <description>"
    echo "Example: ./generate-changelog.sh 1.0.1-alpha 'Added multi-agent support'"
    exit 1
fi

DATE=$(date +%Y-%m-%d)
CHANGELOG_FILE="CHANGELOG.md"

echo "Generating changelog entry for version $VERSION..."

# Create the changelog entry
ENTRY="## [$VERSION] - $DATE

### Added
- $DESCRIPTION

### Changed
- Updated framework version references
- Enhanced documentation for new features

### Infrastructure
- Version bump to $VERSION
- Updated agent manifest and instructions
"

# Backup existing changelog
cp "$CHANGELOG_FILE" "$CHANGELOG_FILE.backup"

# Insert new entry after the header
{
    head -n 6 "$CHANGELOG_FILE"  # Keep header and introduction
    echo ""
    echo "$ENTRY"
    tail -n +7 "$CHANGELOG_FILE"  # Rest of the file
} > "$CHANGELOG_FILE.tmp"

mv "$CHANGELOG_FILE.tmp" "$CHANGELOG_FILE"

echo "✅ Changelog updated with version $VERSION"
echo "📁 Backup saved as $CHANGELOG_FILE.backup"
echo ""
echo "Preview of new entry:"
echo "===================="
echo "$ENTRY"
