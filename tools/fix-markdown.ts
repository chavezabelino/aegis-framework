#!/usr/bin/env tsx

/**
 * @aegisBlueprint: markdown-fix
 * @version: 1.0.0
 * @mode: strict
 * @intent: Auto-fix common markdown linting issues
 * @context: Constitutional compliance for documentation quality
 * @model: claude-3-5-sonnet
 * @hash: 1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

function fixMarkdownFile(file: string): boolean {
  try {
    console.log(`Fixing ${file}...`);
    execSync(`npx markdownlint "${file}" --config .markdownlint.json --fix`, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Error fixing ${file}:`, error);
    return false;
  }
}

function findMarkdownFiles(): string[] {
  try {
    const output = execSync(
      'find . -name "*.md" -type f -not -path "./node_modules/*" -not -path "./dist/*" -not -path "./.git/*" -not -path "./website/node_modules/*" -not -path "./.aegis/*" -not -path "./coverage/*"',
      { encoding: 'utf8' }
    );
    return output.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error finding markdown files:', error);
    return [];
  }
}

function main(): void {
  console.log('🔧 Auto-fixing markdown files...');
  const files = findMarkdownFiles();

  let fixedCount = 0;
  for (const file of files) {
    if (fixMarkdownFile(file)) {
      fixedCount++;
    }
  }

  console.log(`\n✅ Fixed ${fixedCount} out of ${files.length} markdown files`);
}

// ES module entry point
main();
