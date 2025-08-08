#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.4.0
 * @intent: Comprehensive version consistency validation to prevent documentation drift
 * @context: Automated prevention of version mismatch issues across all framework files
 * @mode: strict
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface VersionCheck {
  file: string;
  expectedVersion: string;
  foundVersion: string | null;
  status: 'match' | 'mismatch' | 'missing' | 'error';
  line?: number;
  context?: string;
}

interface VersionConsistencyResult {
  overallStatus: 'pass' | 'fail' | 'warning';
  currentVersion: string;
  checks: VersionCheck[];
  violations: VersionCheck[];
  recommendations: string[];
  criticalFiles: string[];
}

class VersionConsistencyValidator {
  private projectRoot: string;
  private currentVersion: string;
  private criticalFiles: string[] = [
    'VERSION',
    'README.md',
    'CHANGELOG.md',
    'docs/roadmap/current-state.md',
    'docs/roadmap/README.md',
    'docs/releases/README.md',
    'package.json',
    'framework/framework-core-v2.2.0.md'
  ];

  private comprehensiveFiles: string[] = [
    ...this.criticalFiles,
    'docs/roadmap/strategic-vision.md',
    'docs/roadmap/immediate-horizon.md',
    'docs/roadmap/planning-horizon.md',
    'docs/roadmap/feature-configurability-roadmap.md',
    'docs/roadmap/memory-governance-roadmap.md',
    'docs/implementation/feature-configurability-implementation-summary.md',
    'docs/implementation/v2.0.1-complete-implementation-summary.md',
    'docs/releases/v2.1.0-summary.md',
    'framework/framework-core-v2.1.0.md',
    'framework/generated/instructions/current/cursor-ready.md',
    'framework/generated/instructions/current/github-copilot-ready.md'
  ];

  private versionPatterns: RegExp[] = [
    /@aegisFrameworkVersion:\s*([0-9]+\.[0-9]+\.[0-9]+)/,
    /@aegisFrameworkVersion\s*([0-9]+\.[0-9]+\.[0-9]+)/,
    /v([0-9]+\.[0-9]+\.[0-9]+)/,
    /version:\s*["']([0-9]+\.[0-9]+\.[0-9]+)["']/i,
    /"version":\s*["']([0-9]+\.[0-9]+\.[0-9]+)["']/,
    /Current Version.*v([0-9]+\.[0-9]+\.[0-9]+)/i,
    /Version.*v([0-9]+\.[0-9]+\.[0-9]+)/i,
    /Aegis Framework v([0-9]+\.[0-9]+\.[0-9]+)/i,
    /framework.*version.*([0-9]+\.[0-9]+\.[0-9]+)/i,
    /npm install.*@([0-9]+\.[0-9]+\.[0-9]+)/,
    /currently.*v([0-9]+\.[0-9]+\.[0-9]+)/i,
    /release.*v([0-9]+\.[0-9]+\.[0-9]+)/i
  ];

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.currentVersion = this.getCurrentVersion();
  }

  /**
   * Get current version from VERSION file
   */
  private getCurrentVersion(): string {
    try {
      const versionPath = path.join(this.projectRoot, 'VERSION');
      const version = fs.readFileSync(versionPath, 'utf8').trim();
      return version;
    } catch (error) {
      console.error('Failed to read VERSION file:', error);
      process.exit(1);
    }
  }

  /**
   * Validate version consistency across all files
   */
  async validateAll(): Promise<VersionConsistencyResult> {
    console.log('🔍 Validating Version Consistency...\n');
    console.log(`📋 Current Version: ${this.currentVersion}\n`);

    const checks: VersionCheck[] = [];
    const violations: VersionCheck[] = [];

    // Check critical files first
    for (const file of this.criticalFiles) {
      const check = this.validateFile(file);
      checks.push(check);
      if (check.status !== 'match') {
        violations.push(check);
      }
    }

    // Check all TypeScript and Markdown files for version annotations
    const allFiles = this.getAllFiles();
    for (const file of allFiles) {
      if (!this.criticalFiles.includes(file)) {
        const check = this.validateFile(file);
        if (check.status !== 'match') {
          checks.push(check);
          violations.push(check);
        }
      }
    }

    const result: VersionConsistencyResult = {
      overallStatus: violations.length === 0 ? 'pass' : violations.length <= 2 ? 'warning' : 'fail',
      currentVersion: this.currentVersion,
      checks,
      violations,
      recommendations: this.generateRecommendations(violations),
      criticalFiles: this.criticalFiles
    };

    this.displayResults(result);
    return result;
  }

  /**
   * Validate version in a specific file
   */
  private validateFile(filePath: string): VersionCheck {
    const fullPath = path.join(this.projectRoot, filePath);
    
    if (!fs.existsSync(fullPath)) {
      return {
        file: filePath,
        expectedVersion: this.currentVersion,
        foundVersion: null,
        status: 'error',
        context: 'File does not exist'
      };
    }

    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      
      // Check for version patterns
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (const pattern of this.versionPatterns) {
          const match = line.match(pattern);
          if (match) {
            const foundVersion = match[1];
            const status = foundVersion === this.currentVersion ? 'match' : 'mismatch';
            
            return {
              file: filePath,
              expectedVersion: this.currentVersion,
              foundVersion,
              status,
              line: i + 1,
              context: line.trim()
            };
          }
        }
      }

      // No version found
      return {
        file: filePath,
        expectedVersion: this.currentVersion,
        foundVersion: null,
        status: 'missing',
        context: 'No version reference found'
      };

    } catch (error) {
      return {
        file: filePath,
        expectedVersion: this.currentVersion,
        foundVersion: null,
        status: 'error',
        context: `Failed to read file: ${error}`
      };
    }
  }

  /**
   * Get all TypeScript and Markdown files
   */
  private getAllFiles(): string[] {
    const files: string[] = [];
    
    // Start with comprehensive files for thorough coverage
    for (const file of this.comprehensiveFiles) {
      if (fs.existsSync(path.join(this.projectRoot, file))) {
        files.push(file);
      }
    }
    
    const walkDir = (dir: string, baseDir: string = '') => {
      try {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const relativePath = path.join(baseDir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            // Enhanced directory filtering for better coverage
            if (item !== 'node_modules' && 
                item !== '.git' && 
                !item.startsWith('.') &&
                item !== 'dist' &&
                item !== 'build' &&
                item !== 'coverage') {
              walkDir(fullPath, relativePath);
            }
          } else if (stat.isFile()) {
            const ext = path.extname(item);
            if (['.ts', '.js', '.md', '.yaml', '.yml', '.json', '.txt'].includes(ext)) {
              // Avoid duplicates from comprehensive files list
              if (!files.includes(relativePath)) {
                files.push(relativePath);
              }
            }
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    };

    walkDir(this.projectRoot);
    return files;
  }

  /**
   * Generate recommendations based on violations
   */
  private generateRecommendations(violations: VersionCheck[]): string[] {
    const recommendations: string[] = [];

    if (violations.length === 0) {
      recommendations.push('✅ All version references are consistent');
      return recommendations;
    }

    const criticalViolations = violations.filter(v => this.criticalFiles.includes(v.file));
    const otherViolations = violations.filter(v => !this.criticalFiles.includes(v.file));

    if (criticalViolations.length > 0) {
      recommendations.push(`🚨 ${criticalViolations.length} critical files have version mismatches`);
      criticalViolations.forEach(v => {
        if (v.status === 'mismatch') {
          recommendations.push(`   Update ${v.file}:${v.line} from ${v.foundVersion} to ${v.expectedVersion}`);
        } else if (v.status === 'missing') {
          recommendations.push(`   Add version reference to ${v.file}`);
        }
      });
    }

    if (otherViolations.length > 0) {
      recommendations.push(`⚠️ ${otherViolations.length} other files have version mismatches`);
    }

    recommendations.push('💡 Run "node tools/validate-version-consistency.ts --auto-fix" to apply automatic corrections');
    recommendations.push('💡 Add version validation to pre-commit hooks to prevent future issues');

    return recommendations;
  }

  /**
   * Display validation results
   */
  private displayResults(result: VersionConsistencyResult): void {
    console.log('📊 Version Consistency Validation Results');
    console.log('=========================================\n');

    if (result.violations.length === 0) {
      console.log('✅ All version references are consistent!');
      return;
    }

    console.log(`❌ Found ${result.violations.length} version inconsistencies\n`);

    // Group violations by severity
    const criticalViolations = result.violations.filter(v => this.criticalFiles.includes(v.file));
    const otherViolations = result.violations.filter(v => !this.criticalFiles.includes(v.file));

    if (criticalViolations.length > 0) {
      console.log('🚨 Critical Files (Must Fix):');
      criticalViolations.forEach(v => {
        const status = v.status === 'mismatch' ? '❌' : v.status === 'missing' ? '⚠️' : '💥';
        console.log(`   ${status} ${v.file}`);
        if (v.line) {
          console.log(`      Line ${v.line}: ${v.context}`);
        }
        if (v.status === 'mismatch') {
          console.log(`      Expected: ${v.expectedVersion}, Found: ${v.foundVersion}`);
        }
      });
      console.log('');
    }

    if (otherViolations.length > 0) {
      console.log('⚠️ Other Files:');
      otherViolations.forEach(v => {
        const status = v.status === 'mismatch' ? '❌' : v.status === 'missing' ? '⚠️' : '💥';
        console.log(`   ${status} ${v.file}`);
        if (v.line) {
          console.log(`      Line ${v.line}: ${v.context}`);
        }
      });
      console.log('');
    }

    console.log('💡 Recommendations:');
    result.recommendations.forEach(rec => console.log(`   ${rec}`));

    console.log(`\n📋 Overall Status: ${result.overallStatus.toUpperCase()}`);
  }

  /**
   * Auto-fix version inconsistencies
   */
  async autoFix(): Promise<void> {
    console.log('🔧 Auto-fixing version inconsistencies...\n');

    const result = await this.validateAll();
    let fixedCount = 0;

    for (const violation of result.violations) {
      if (violation.status === 'mismatch' && violation.line) {
        try {
          const fullPath = path.join(this.projectRoot, violation.file);
          const content = fs.readFileSync(fullPath, 'utf8');
          const lines = content.split('\n');
          
          // Replace version in the specific line
          const lineIndex = violation.line - 1;
          const oldLine = lines[lineIndex];
          const newLine = oldLine.replace(violation.foundVersion!, this.currentVersion);
          
          if (newLine !== oldLine) {
            lines[lineIndex] = newLine;
            fs.writeFileSync(fullPath, lines.join('\n'));
            console.log(`✅ Fixed ${violation.file}:${violation.line}`);
            fixedCount++;
          }
        } catch (error) {
          console.log(`❌ Failed to fix ${violation.file}: ${error}`);
        }
      }
    }

    console.log(`\n📊 Auto-fix complete: ${fixedCount} files updated`);
  }
}

// CLI interface
async function main(): Promise<void> {
  const validator = new VersionConsistencyValidator();
  
  if (process.argv.includes('--auto-fix')) {
    await validator.autoFix();
  } else {
    const result = await validator.validateAll();
    
    if (result.overallStatus === 'fail') {
      process.exit(1);
    }
  }
}

// Run if called directly
if (process.argv[1] && process.argv[1].endsWith('validate-version-consistency.ts')) {
  main().catch(error => {
    console.error('Version validation error:', error);
    process.exit(1);
  });
}

export { VersionConsistencyValidator };
