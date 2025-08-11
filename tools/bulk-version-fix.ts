/**
 * @aegisBlueprint: bulk-version-fix
 * @version: 2.5.0
 * @mode: strict
 * @intent: Automated bulk correction of version inconsistencies across the entire codebase
 * @context: Emergency response to massive version drift that overwhelmed manual correction processes
 * @model: claude-3-5-sonnet
 * @hash: 8f7e6d5c4b3a2918f7e6d5c4b3a2918f7e6d5c4b3a2918f7e6d5c4b3a2918f7e6d5c4b3a291
 */

import { glob } from 'glob';
import { promises as fs } from 'node:fs';
import { resolve } from 'node:path';

const CURRENT_VERSION = '2.5.0';

interface VersionFix {
  file: string;
  changes: Array<{
    line: number;
    oldVersion: string;
    newVersion: string;
    context: string;
  }>;
}

async function getCurrentVersion(): Promise<string> {
  try {
    const versionContent = await fs.readFile('VERSION', 'utf-8');
    return versionContent.trim();
  } catch (error) {
    console.error('Failed to read VERSION file:', error);
    process.exit(1);
  }
}

async function findFilesToFix(): Promise<string[]> {
  const patterns = [
    '**/*.{md,ts,tsx,js,jsx,json,yaml,yml,txt}',
    '!node_modules/**',
    '!.git/**',
    '!dist/**',
    '!build/**',
    '!coverage/**',
    '!website/node_modules/**',
    '!packages/*/node_modules/**',
    '!website/build/**', // Exclude built website assets
    '!*.min.js',
    '!*.bundle.js'
  ];

  const files = await glob(patterns, { ignore: patterns.slice(1) });
  return files;
}

function findVersionPatterns(content: string): Array<{ match: string; version: string; index: number }> {
  const patterns = [
    /@aegisFrameworkVersion:\s*([0-9]+\.[0-9]+\.[0-9]+(?:-[a-z]+)?)/g,
    /"version":\s*"([0-9]+\.[0-9]+\.[0-9]+(?:-[a-z]+)?)"/g,
    /version:\s*"([0-9]+\.[0-9]+\.[0-9]+(?:-[a-z]+)?)"/g,
    /v([0-9]+\.[0-9]+\.[0-9]+(?:-[a-z]+)?)/g,
    /version\s*=\s*"([0-9]+\.[0-9]+\.[0-9]+(?:-[a-z]+)?)"/g,
    /@version\s*([0-9]+\.[0-9]+\.[0-9]+(?:-[a-z]+)?)/g,
    // Additional patterns for development and spec versions
    /2\.5\.0-dev/g,
    /2\.5\.0-spec/g,
    /2\.5\.0-release/g,
    /2\.5\.0-feature/g,
    /2\.5\.01/g
  ];

  const matches: Array<{ match: string; version: string; index: number }> = [];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      let version: string;
      let matchText: string;
      
      // Handle different pattern types
      if (pattern.source.includes('2\\.5\\.0-')) {
        // Direct version replacement patterns
        version = match[0];
        matchText = match[0];
      } else {
        // Standard patterns with capture groups
        version = match[1];
        matchText = match[0];
      }
      
      if (version !== CURRENT_VERSION) {
        matches.push({
          match: matchText,
          version,
          index: match.index
        });
      }
    }
  }

  return matches;
}

async function fixFile(file: string): Promise<VersionFix | null> {
  try {
    const content = await fs.readFile(file, 'utf-8');
    const matches = findVersionPatterns(content);
    
    if (matches.length === 0) {
      return null;
    }

    let newContent = content;
    const changes: Array<{ line: number; oldVersion: string; newVersion: string; context: string }> = [];

    // Sort matches by index in reverse order to avoid offset issues
    const sortedMatches = matches.sort((a, b) => b.index - a.index);

    for (const match of sortedMatches) {
      const oldVersion = match.version;
      const newMatch = match.match.replace(oldVersion, CURRENT_VERSION);
      
      // Calculate line number
      const beforeMatch = content.substring(0, match.index);
      const lineNumber = beforeMatch.split('\n').length;

      // Replace in content
      newContent = newContent.substring(0, match.index) + 
                   newMatch + 
                   newContent.substring(match.index + match.match.length);

      changes.push({
        line: lineNumber,
        oldVersion,
        newVersion: CURRENT_VERSION,
        context: match.match.substring(0, 50) + '...'
      });
    }

    if (changes.length > 0) {
      await fs.writeFile(file, newContent, 'utf-8');
      return { file, changes };
    }

    return null;
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
    return null;
  }
}

async function main() {
  console.log('🔧 Bulk Version Fix Tool');
  console.log('========================\n');

  const actualVersion = await getCurrentVersion();
  if (actualVersion !== CURRENT_VERSION) {
    console.log(`⚠️  Warning: VERSION file contains ${actualVersion}, but script expects ${CURRENT_VERSION}`);
    console.log('   Proceeding with VERSION file content...\n');
  }

  console.log(`📋 Target version: ${CURRENT_VERSION}`);
  console.log('🔍 Scanning files for version inconsistencies...\n');

  const files = await findFilesToFix();
  console.log(`📁 Found ${files.length} files to check\n`);

  const fixes: VersionFix[] = [];
  let processedCount = 0;

  for (const file of files) {
    processedCount++;
    if (processedCount % 50 === 0) {
      console.log(`   Processed ${processedCount}/${files.length} files...`);
    }

    const fix = await fixFile(file);
    if (fix) {
      fixes.push(fix);
    }
  }

  console.log(`\n✅ Processing complete!\n`);

  // Summary
  const totalFilesFixed = fixes.length;
  const totalChanges = fixes.reduce((sum, fix) => sum + fix.changes.length, 0);

  console.log('📊 Summary:');
  console.log(`   Files processed: ${files.length}`);
  console.log(`   Files fixed: ${totalFilesFixed}`);
  console.log(`   Total version changes: ${totalChanges}\n`);

  if (fixes.length > 0) {
    console.log('📝 Files with changes:');
    fixes.forEach(fix => {
      console.log(`   ${fix.file} (${fix.changes.length} changes)`);
    });

    console.log('\n🔍 Sample changes:');
    const sampleFixes = fixes.slice(0, 5);
    sampleFixes.forEach(fix => {
      console.log(`   ${fix.file}:`);
      fix.changes.slice(0, 3).forEach(change => {
        console.log(`     Line ${change.line}: ${change.oldVersion} → ${change.newVersion}`);
      });
      if (fix.changes.length > 3) {
        console.log(`     ... and ${fix.changes.length - 3} more changes`);
      }
    });
  } else {
    console.log('✅ No version inconsistencies found!');
  }

  console.log('\n🚀 Next steps:');
  console.log('   1. Run "npm run aegis:compliance" to verify fixes');
  console.log('   2. Commit changes with "git add . && git commit -m \'fix: Bulk version consistency update\'"');
  console.log('   3. Consider implementing pre-commit hooks to prevent future drift');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Bulk version fix failed:', error);
    process.exit(1);
  });
}

export { main as bulkVersionFix };
