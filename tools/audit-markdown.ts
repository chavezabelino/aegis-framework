#!/usr/bin/env tsx

/**
 * @aegisBlueprint: markdown-audit
 * @version: 1.0.0
 * @mode: strict
 * @intent: Comprehensive markdown file audit and linting
 * @context: Constitutional compliance for documentation quality
 * @model: claude-3-5-sonnet
 * @hash: 1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface AuditResult {
  file: string;
  issues: string[];
  errorCount: number;
  warningCount: number;
}

interface AuditSummary {
  totalFiles: number;
  filesWithIssues: number;
  totalErrors: number;
  totalWarnings: number;
  results: AuditResult[];
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

function runMarkdownLint(file: string): AuditResult {
  try {
    const output = execSync(`npx markdownlint "${file}" --config .markdownlint.json --json`, { encoding: 'utf8' });
    const issues = JSON.parse(output);

    if (!issues[file]) {
      return { file, issues: [], errorCount: 0, warningCount: 0 };
    }

    const fileIssues = issues[file];
    const errorCount = fileIssues.filter((issue: any) => issue.errorLevel === 'error').length;
    const warningCount = fileIssues.filter((issue: any) => issue.errorLevel === 'warning').length;

    return {
      file,
      issues: fileIssues.map(
        (issue: any) =>
          `${issue.lineNumber}:${issue.columnNumber} ${issue.ruleNames.join('/')} ${issue.ruleDescription}`
      ),
      errorCount,
      warningCount,
    };
  } catch (error: any) {
    if (error.status === 1) {
      // markdownlint found issues
      const output = error.stdout || '';
      const issues = output.trim().split('\n').filter(Boolean);
      return {
        file,
        issues,
        errorCount: issues.length,
        warningCount: 0,
      };
    }
    return { file, issues: [`Error running markdownlint: ${error.message}`], errorCount: 1, warningCount: 0 };
  }
}

function auditAllMarkdown(): AuditSummary {
  console.log('🔍 Scanning for markdown files...');
  const files = findMarkdownFiles();
  console.log(`Found ${files.length} markdown files`);

  const results: AuditResult[] = [];
  let totalErrors = 0;
  let totalWarnings = 0;
  let filesWithIssues = 0;

  for (const file of files) {
    console.log(`Checking ${file}...`);
    const result = runMarkdownLint(file);
    results.push(result);

    if (result.errorCount > 0 || result.warningCount > 0) {
      filesWithIssues++;
      totalErrors += result.errorCount;
      totalWarnings += result.warningCount;
    }
  }

  return {
    totalFiles: files.length,
    filesWithIssues,
    totalErrors,
    totalWarnings,
    results,
  };
}

function generateReport(summary: AuditSummary): void {
  const report = {
    timestamp: new Date().toISOString(),
    summary,
    details: summary.results.filter(r => r.errorCount > 0 || r.warningCount > 0),
  };

  writeFileSync('.aegis/markdown-audit-report.json', JSON.stringify(report, null, 2));

  console.log('\n📊 MARKDOWN AUDIT REPORT');
  console.log('='.repeat(50));
  console.log(`Total files scanned: ${summary.totalFiles}`);
  console.log(`Files with issues: ${summary.filesWithIssues}`);
  console.log(`Total errors: ${summary.totalErrors}`);
  console.log(`Total warnings: ${summary.totalWarnings}`);

  if (summary.filesWithIssues > 0) {
    console.log('\n🚨 FILES WITH ISSUES:');
    summary.results
      .filter(r => r.errorCount > 0 || r.warningCount > 0)
      .forEach(result => {
        console.log(`\n${result.file}:`);
        result.issues.forEach(issue => console.log(`  - ${issue}`));
      });
  }
}

function main(): void {
  const summary = auditAllMarkdown();
  generateReport(summary);

  if (summary.totalErrors > 0) {
    console.log('\n❌ Audit failed: Found markdown linting errors');
    process.exit(1);
  } else {
    console.log('\n✅ All markdown files pass linting checks');
  }
}

// ES module entry point
main();
