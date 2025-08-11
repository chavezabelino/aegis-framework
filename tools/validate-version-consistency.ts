#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.5.0
 * @intent: Validate version consistency across all framework files
 * @context: Constitutional compliance requirement for version documentation drift prevention
 * @mode: strict
 */

import { ValidationReport, ValidationIssue } from './compliance/validation-contract.ts';
import { resolve } from 'node:path';
import { promises as fs } from 'node:fs';
import { glob } from 'glob';

interface VersionInconsistency {
  file: string;
  line: number;
  expected: string;
  found: string;
  context: string;
}

async function findVersionInconsistencies(): Promise<VersionInconsistency[]> {
  const currentVersion = '2.5.0';
  const inconsistencies: VersionInconsistency[] = [];
  
  // Get all markdown and TypeScript files
  const files = await glob('**/*.{md,ts,tsx,js,jsx,json,yaml,yml}', {
    ignore: ['node_modules/**', '.git/**', 'dist/**', 'build/**', 'coverage/**', 'website/node_modules/**', 'packages/*/node_modules/**']
  });

  for (const file of files) {
    try {
      const content = await fs.readFile(file, 'utf-8');
      const lines = content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNumber = i + 1;
        
        // Check for version patterns
        const versionPatterns = [
          /@aegisFrameworkVersion:\s*([0-9]+\.[0-9]+\.[0-9]+(?:-[a-z]+)?)/g,
          /"version":\s*"([0-9]+\.[0-9]+\.[0-9]+(?:-[a-z]+)?)"/g,
          /version:\s*"([0-9]+\.[0-9]+\.[0-9]+(?:-[a-z]+)?)"/g,
          /v([0-9]+\.[0-9]+\.[0-9]+(?:-[a-z]+)?)/g
        ];
        
        for (const pattern of versionPatterns) {
          let match;
          while ((match = pattern.exec(line)) !== null) {
            const foundVersion = match[1];
            if (foundVersion !== currentVersion) {
              inconsistencies.push({
                file,
                line: lineNumber,
                expected: currentVersion,
                found: foundVersion,
                context: line.trim()
              });
            }
          }
        }
      }
    } catch (error) {
      // Skip files that can't be read
      continue;
    }
  }
  
  return inconsistencies;
}

async function main() {
  const claimId = 'version-consistency';
  const title = 'Intelligence features prevent version documentation drift';
  const json = process.argv.includes('--json');

  const issues: ValidationIssue[] = [];
  let status: ValidationReport['status'] = 'pass';
  let summary = 'No version drift detected.';

  try {
    const inconsistencies = await findVersionInconsistencies();
    
    if (inconsistencies.length > 0) {
      status = 'fail';
      summary = `Detected ${inconsistencies.length} version inconsistencies across ${new Set(inconsistencies.map(i => i.file)).size} files.`;
      
      // Group by file for better reporting
      const fileGroups = inconsistencies.reduce((acc, inc) => {
        if (!acc[inc.file]) acc[inc.file] = [];
        acc[inc.file].push(inc);
        return acc;
      }, {} as Record<string, VersionInconsistency[]>);
      
      // Create issues for each file with multiple inconsistencies
      for (const [file, fileIncs] of Object.entries(fileGroups)) {
        const criticalFiles = ['VERSION', 'CHANGELOG.md', 'package.json', 'CONSTITUTION.md'];
        const isCritical = criticalFiles.some(cf => file.includes(cf));
        
        issues.push({
          code: isCritical ? 'CRITICAL_VERSION_DRIFT' : 'VERSION_DRIFT',
          message: `${file}: ${fileIncs.length} version inconsistency${fileIncs.length > 1 ? 'ies' : ''}`,
          path: [file],
          hint: isCritical 
            ? 'Critical file - must be fixed immediately'
            : `Expected: 2.5.0, found: ${fileIncs.map(i => i.found).join(', ')}`
        });
      }
    }
  } catch (e) {
    status = 'error';
    issues.push({
      code: 'RUNTIME_ERROR',
      message: e instanceof Error ? e.message : 'Unknown error running validator.'
    });
    summary = 'Validator crashed.';
  }

  const report: ValidationReport = {
    claimId,
    title,
    status,
    summary,
    issues,
    evidence: ['Automated validation', 'Pre-commit integration', 'Auto-fix capability']
  };

  if (json) {
    process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  } else {
    console.log(`[${status.toUpperCase()}] ${claimId} — ${title}`);
    if (issues.length) {
      for (const i of issues) console.log(` - (${i.code}) ${i.message}${i.hint ? ` | hint: ${i.hint}` : ''}`);
    } else {
      console.log(' - No issues.');
    }
  }

  if (status === 'pass') process.exit(0);
  else if (status === 'fail') process.exit(1);
  else process.exit(2);
}

main().catch((e) => {
  console.error('Validator crashed:', e);
  process.exit(2);
});
