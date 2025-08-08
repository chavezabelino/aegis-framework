#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.3.0
 * @intent: Pre-commit hook with team configuration support
 * @context: Constitutional protection with configurable enforcement levels
 * @mode: strict
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { TeamConfigLoader } from './team-config-loader.js';

interface PreCommitResult {
  allowed: boolean;
  violations: string[];
  warnings: string[];
}

class PreCommitHook {
  private configLoader: TeamConfigLoader;
  private projectRoot: string;
  private criticalFiles: string[] = [
    'VERSION',
    'README.md',
    'CHANGELOG.md',
    'docs/roadmap/current-state.md',
    'docs/roadmap/README.md',
    'docs/releases/README.md',
    'package.json'
  ];

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.configLoader = TeamConfigLoader.getInstance(projectRoot);
  }

  /**
   * Run pre-commit checks with team configuration respect
   */
  async run(): Promise<PreCommitResult> {
    const result: PreCommitResult = {
      allowed: true,
      violations: [],
      warnings: []
    };

    console.log('🛡️ Pre-commit Constitutional Check');
    console.log('==================================');

    // Check if pre-commit hooks are enabled
    if (!this.configLoader.isRequiredFeatureEnabled('precommitHooks')) {
      console.log('📋 Pre-commit hooks disabled in team configuration');
      return result;
    }

    // Run destructive action checks
    if (this.configLoader.loadConfig()?.required.precommitHooks.constitutionalValidation) {
      const destructiveResult = this.checkDestructiveActions();
      result.violations.push(...destructiveResult.violations);
      result.warnings.push(...destructiveResult.warnings);
    }

    // Run evolution story detection if enabled
    if (this.configLoader.loadConfig()?.required.precommitHooks.evolutionDetection) {
      const evolutionResult = await this.checkEvolutionStories();
      result.violations.push(...evolutionResult.violations);
      result.warnings.push(...evolutionResult.warnings);
    }

    // Run version consistency validation
    const versionResult = await this.checkVersionConsistency();
    result.violations.push(...versionResult.violations);
    result.warnings.push(...versionResult.warnings);

    // Determine if commit should be blocked
    const mode = this.configLoader.getConstitutionalMode();
    const blocking = this.configLoader.loadConfig()?.required.constitutionalEnforcement.blocking ?? true;

    if (mode === 'strict' && result.violations.length > 0) {
      result.allowed = false;
    } else if (mode === 'guided' && result.violations.some(v => v.includes('CRITICAL'))) {
      result.allowed = false;
    } else if (mode === 'advisory') {
      result.allowed = true; // Never block in advisory mode
    }

    // Report results
    this.reportResults(result, mode);

    return result;
  }

  /**
   * Check for destructive actions in staged files
   */
  private checkDestructiveActions(): { violations: string[]; warnings: string[] } {
    const violations: string[] = [];
    const warnings: string[] = [];

    try {
      const stagedFiles = execSync('git diff --cached --name-only', { 
        cwd: this.projectRoot, 
        encoding: 'utf8' 
      }).trim().split('\n').filter(Boolean);

      const destructivePatterns = [
        'rm -rf',
        'rm -r',
        'rm -f',
        'rm -rf .',
        'rm -rf /',
        'rm -rf node_modules',
        'rm -rf dist',
        'rm -rf .framework',
        'rm -rf .aegis',
        'rm -rf .vscode',
        'rm -rf .cursor',
        'rm CONSTITUTION.md',
        'rm VERSION',
        'rm package.json',
        'rm tsconfig.json',
        'rm README.md',
        'rm CHANGELOG.md',
        'rm CONTRIBUTING.md',
        'rm LICENSE'
      ];

      const essentialFiles = [
        'CONSTITUTION.md',
        'VERSION',
        'package.json',
        'tsconfig.json',
        'README.md',
        'CHANGELOG.md',
        'CONTRIBUTING.md',
        'LICENSE'
      ];

      const essentialDirs = [
        'framework',
        'docs',
        'cli',
        'tools',
        'blueprints',
        'adapters',
        'tests',
        'examples',
        'templates',
        'scaffolds'
      ];

      // Check staged files for destructive patterns
      for (const file of stagedFiles) {
        if (fs.existsSync(file)) {
          const content = execSync(`git show ":${file}"`, { 
            cwd: this.projectRoot, 
            encoding: 'utf8' 
          });

          for (const pattern of destructivePatterns) {
            if (content.includes(pattern)) {
              const violation = `DESTRUCTIVE ACTION DETECTED in ${file}: ${pattern}`;
              violations.push(violation);
              console.log(`🚨 ${violation}`);
            }
          }
        }
      }

      // Check for deletion of essential files
      const stagedChanges = execSync('git diff --cached --name-status', { 
        cwd: this.projectRoot, 
        encoding: 'utf8' 
      });

      for (const file of essentialFiles) {
        if (stagedChanges.includes(`D\t${file}`)) {
          const violation = `CRITICAL: Essential file deletion detected: ${file}`;
          violations.push(violation);
          console.log(`🚨 ${violation}`);
        }
      }

      // Check for deletion of essential directories
      for (const dir of essentialDirs) {
        if (stagedChanges.includes(`D\t${dir}/`)) {
          const violation = `CRITICAL: Essential directory deletion detected: ${dir}/`;
          violations.push(violation);
          console.log(`🚨 ${violation}`);
        }
      }

    } catch (error) {
      warnings.push(`Failed to check destructive actions: ${error}`);
    }

    return { violations, warnings };
  }

  /**
   * Check for evolution story requirements
   */
  private async checkEvolutionStories(): Promise<{ violations: string[]; warnings: string[] }> {
    const violations: string[] = [];
    const warnings: string[] = [];

    try {
      // Check if recent commits have evolution stories
      const recentCommits = execSync('git log --oneline -5', { 
        cwd: this.projectRoot, 
        encoding: 'utf8' 
      });

      const constitutionalCommits = recentCommits.split('\n').filter(line => 
        line.toLowerCase().includes('constitutional') || 
        line.toLowerCase().includes('constitution') ||
        line.toLowerCase().includes('breaking change')
      );

      for (const commit of constitutionalCommits) {
        const commitHash = commit.split(' ')[0];
        
        // Check if this commit has an associated evolution story
        const evolutionStories = this.getExistingEvolutionStories();
        const hasStory = evolutionStories.some(story => story.includes(commitHash));
        
        if (!hasStory) {
          const warning = `Commit without evolution story: ${commit}`;
          warnings.push(warning);
          console.log(`⚠️ ${warning}`);
        }
      }

    } catch (error) {
      warnings.push(`Failed to check evolution stories: ${error}`);
    }

    return { violations, warnings };
  }

  /**
   * Check version consistency
   */
  private async checkVersionConsistency(): Promise<{ violations: string[]; warnings: string[] }> {
    const violations: string[] = [];
    const warnings: string[] = [];

    try {
      // Import and run version consistency validator
      const { VersionConsistencyValidator } = await import('./validate-version-consistency.js');
      const validator = new VersionConsistencyValidator(this.projectRoot);
      const result = await validator.validateAll();

      if (result.overallStatus === 'fail') {
        violations.push('CRITICAL: Version consistency validation failed');
        result.violations.forEach(v => {
          if (this.criticalFiles.includes(v.file)) {
            violations.push(`Version mismatch in ${v.file}: expected ${v.expectedVersion}, found ${v.foundVersion}`);
          } else {
            warnings.push(`Version mismatch in ${v.file}: expected ${v.expectedVersion}, found ${v.foundVersion}`);
          }
        });
      } else if (result.overallStatus === 'warning') {
        warnings.push('Version consistency warnings detected');
        result.violations.forEach(v => {
          warnings.push(`Version mismatch in ${v.file}: expected ${v.expectedVersion}, found ${v.foundVersion}`);
        });
      }
    } catch (error) {
      warnings.push(`Failed to check version consistency: ${error}`);
    }

    return { violations, warnings };
  }

  /**
   * Get existing evolution stories
   */
  private getExistingEvolutionStories(): string[] {
    try {
      const evolutionDir = path.join(this.projectRoot, 'docs', 'evolution');
      if (!fs.existsSync(evolutionDir)) {
        return [];
      }

      return fs.readdirSync(evolutionDir)
        .filter(file => file.endsWith('.md'))
        .map(file => path.join(evolutionDir, file));
    } catch (error) {
      return [];
    }
  }

  /**
   * Report pre-commit results
   */
  private reportResults(result: PreCommitResult, mode: string): void {
    if (result.violations.length > 0) {
      console.log('\n❌ Constitutional Violations:');
      result.violations.forEach(v => console.log(`   - ${v}`));
    }

    if (result.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      result.warnings.forEach(w => console.log(`   - ${w}`));
    }

    if (result.allowed) {
      console.log('\n✅ Commit allowed to proceed');
      if (result.warnings.length > 0) {
        console.log(`📋 Mode: ${mode} - Warnings shown but commit allowed`);
      }
    } else {
      console.log('\n❌ Commit blocked - Constitutional violations detected');
      console.log(`📋 Mode: ${mode} - Enforcement level requires blocking`);
    }
  }
}

// CLI interface
async function main(): Promise<void> {
  const hook = new PreCommitHook();
  const result = await hook.run();
  
  if (!result.allowed) {
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] && process.argv[1].endsWith('pre-commit-hook.ts')) {
  main().catch(error => {
    console.error('Pre-commit hook error:', error);
    process.exit(1);
  });
}

export { PreCommitHook };
