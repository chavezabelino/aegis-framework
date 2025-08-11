#!/usr/bin/env tsx

/**
 * @aegisBlueprint: markdown-format
 * @version: 1.0.0
 * @mode: strict
 * @intent: Comprehensive markdown formatting with Prettier and markdownlint
 * @context: Constitutional compliance for documentation quality
 * @model: claude-3-5-sonnet
 * @hash: 1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

interface FormatResult {
  file: string;
  prettierSuccess: boolean;
  lintSuccess: boolean;
  issues: string[];
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

function formatWithPrettier(file: string): boolean {
  try {
    console.log(`🎨 Formatting ${file} with Prettier...`);
    execSync(`npx prettier --write "${file}"`, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Error formatting ${file} with Prettier:`, error);
    return false;
  }
}

function lintWithMarkdownlint(file: string): { success: boolean; issues: string[] } {
  try {
    console.log(`🔍 Linting ${file} with markdownlint...`);
    execSync(`npx markdownlint "${file}" --config .markdownlint.json --fix`, { stdio: 'inherit' });
    return { success: true, issues: [] };
  } catch (error: any) {
    if (error.status === 1) {
      // markdownlint found issues that couldn't be auto-fixed
      return { success: false, issues: [error.message || 'Linting issues found'] };
    }
    return { success: false, issues: [`Error running markdownlint: ${error.message}`] };
  }
}

function formatMarkdownFile(file: string): FormatResult {
  console.log(`\n📄 Processing ${file}...`);

  const prettierSuccess = formatWithPrettier(file);
  const lintResult = lintWithMarkdownlint(file);

  return {
    file,
    prettierSuccess,
    lintSuccess: lintResult.success,
    issues: lintResult.issues,
  };
}

function main(): void {
  console.log('🎨 Comprehensive Markdown Formatting');
  console.log('='.repeat(50));

  const files = findMarkdownFiles();
  console.log(`Found ${files.length} markdown files to process`);

  const results: FormatResult[] = [];
  let prettierSuccessCount = 0;
  let lintSuccessCount = 0;
  let totalIssues = 0;

  for (const file of files) {
    const result = formatMarkdownFile(file);
    results.push(result);

    if (result.prettierSuccess) prettierSuccessCount++;
    if (result.lintSuccess) lintSuccessCount++;
    totalIssues += result.issues.length;
  }

  // Summary
  console.log('\n📊 FORMATTING SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total files processed: ${files.length}`);
  console.log(`Prettier formatting successful: ${prettierSuccessCount}`);
  console.log(`Markdownlint successful: ${lintSuccessCount}`);
  console.log(`Total issues remaining: ${totalIssues}`);

  // Files with issues
  const filesWithIssues = results.filter(r => r.issues.length > 0);
  if (filesWithIssues.length > 0) {
    console.log('\n🚨 FILES WITH REMAINING ISSUES:');
    filesWithIssues.forEach(result => {
      console.log(`\n${result.file}:`);
      result.issues.forEach(issue => console.log(`  - ${issue}`));
    });
  }

  // Success message
  if (totalIssues === 0) {
    console.log('\n✅ All markdown files are now properly formatted!');
  } else {
    console.log(`\n⚠️  ${totalIssues} issues remain that require manual attention.`);
  }
}

// ES module entry point
main();
