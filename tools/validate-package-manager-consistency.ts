#!/usr/bin/env bun

/**
 * Package Manager Consistency Validator
 * @aegisFrameworkVersion 2.4.0
 * @intent Prevent npm/node/bun hybrid confusion through automated validation
 * @context Constitutional protection against package manager drift
 */

import { readFileSync } from 'fs';
import { glob } from 'glob';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

class PackageManagerValidator {
  private errors: string[] = [];
  private warnings: string[] = [];

  async validate(): Promise<ValidationResult> {
    console.log('🔍 Validating package manager consistency...\n');

    // 1. Validate package.json scripts
    await this.validatePackageJsonScripts();
    
    // 2. Validate GitHub Actions workflows
    await this.validateGitHubWorkflows();
    
    // 3. Validate documentation
    await this.validateDocumentation();
    
    // 4. Validate git hooks
    await this.validateGitHooks();
    
    // 5. Validate CLI scripts shebang
    await this.validateCliScripts();

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  private async validatePackageJsonScripts(): Promise<void> {
    try {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      const scripts = packageJson.scripts || {};

      console.log('📋 Validating package.json scripts...');

      // Check for npm run usage (should be bun run)
      Object.entries(scripts).forEach(([name, script]: [string, any]) => {
        if (typeof script === 'string') {
          // Flag npm run usage in internal scripts
          if (script.includes('npm run ') && !this.isDistributionScript(name)) {
            this.errors.push(`Script "${name}" uses "npm run" - should use "bun run" for internal commands`);
          }

          // Flag node usage for TypeScript files (should be bun)
          if (script.includes('node ') && script.includes('.ts')) {
            this.errors.push(`Script "${name}" uses "node" for TypeScript - should use "bun"`);
          }

          // Flag direct node usage for our scripts (exceptions for legacy .cjs files)
          if (script.includes('node cli/') || script.includes('node tools/') || script.includes('node framework/')) {
            if (!script.includes('.cjs')) {
              this.errors.push(`Script "${name}" uses "node" for internal script - should use "bun"`);
            } else {
              this.warnings.push(`Script "${name}" uses "node" for .cjs file - consider migrating to .ts`);
            }
          }

          // Flag npx usage (should be bunx)
          if (script.includes('npx ')) {
            this.warnings.push(`Script "${name}" uses "npx" - consider using "bunx" for consistency`);
          }
        }
      });

      console.log('✅ Package.json validation complete');
    } catch (error) {
      this.errors.push(`Failed to validate package.json: ${error}`);
    }
  }

  private async validateGitHubWorkflows(): Promise<void> {
    try {
      console.log('🔄 Validating GitHub Actions workflows...');
      
      const workflowFiles = await glob('.github/workflows/*.yml');
      
      for (const file of workflowFiles) {
        const content = readFileSync(file, 'utf8');
        
        // Check for setup-node usage (should be setup-bun)
        if (content.includes('setup-node@') && !content.includes('setup-bun@')) {
          this.errors.push(`Workflow ${file} uses setup-node instead of setup-bun`);
        }

        // Check for npm install usage (should be bun install)
        if (content.includes('npm install') && !content.includes('bun install')) {
          this.errors.push(`Workflow ${file} uses "npm install" instead of "bun install"`);
        }

        // Check for npm ci usage
        if (content.includes('npm ci')) {
          this.errors.push(`Workflow ${file} uses "npm ci" - should use "bun install"`);
        }

        // Check for node command usage in CLI execution
        if (content.includes('node cli/') || content.includes('node tools/')) {
          this.warnings.push(`Workflow ${file} uses "node" for CLI/tools - consider "bun" for speed`);
        }
      }

      console.log('✅ GitHub workflows validation complete');
    } catch (error) {
      this.errors.push(`Failed to validate workflows: ${error}`);
    }
  }

  private async validateDocumentation(): Promise<void> {
    try {
      console.log('📚 Validating documentation...');
      
      const docFiles = await glob('docs/**/*.md');
      docFiles.push('README.md', 'CONTRIBUTING.md');
      
      for (const file of docFiles) {
        try {
          const content = readFileSync(file, 'utf8');
          
          // Check for npm install in development instructions
          if (content.includes('npm install') && 
              content.includes('development') && 
              !content.includes('end user')) {
            this.warnings.push(`Documentation ${file} shows "npm install" for development - should show "bun install"`);
          }

          // Check for npm run in development examples
          if (content.includes('npm run') && 
              content.includes('development') &&
              !content.includes('user')) {
            this.warnings.push(`Documentation ${file} shows "npm run" for development - should show "bun run"`);
          }
        } catch (error) {
          // Skip files that can't be read
        }
      }

      console.log('✅ Documentation validation complete');
    } catch (error) {
      this.warnings.push(`Could not fully validate documentation: ${error}`);
    }
  }

  private async validateGitHooks(): Promise<void> {
    try {
      console.log('🎣 Validating git hooks...');
      
      const hookFiles = await glob('tools/*hook*.sh');
      
      for (const file of hookFiles) {
        const content = readFileSync(file, 'utf8');
        
        // Check for node usage in hooks
        if (content.includes('node cli/') || content.includes('node tools/')) {
          this.warnings.push(`Git hook ${file} uses "node" - consider "bun" for consistency`);
        }
      }

      console.log('✅ Git hooks validation complete');
    } catch (error) {
      this.warnings.push(`Could not validate git hooks: ${error}`);
    }
  }

  private async validateCliScripts(): Promise<void> {
    try {
      console.log('🔧 Validating CLI scripts...');
      
      const cliFiles = await glob('cli/*.ts');
      cliFiles.push(...await glob('tools/*.ts'));
      
      for (const file of cliFiles) {
        const content = readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        // Check shebang line
        if (lines[0].startsWith('#!/')) {
          if (lines[0].includes('node') && !lines[0].includes('bun')) {
            this.warnings.push(`CLI script ${file} has node shebang - consider #!/usr/bin/env bun`);
          }
        }
      }

      console.log('✅ CLI scripts validation complete');
    } catch (error) {
      this.warnings.push(`Could not validate CLI scripts: ${error}`);
    }
  }

  private isDistributionScript(scriptName: string): boolean {
    // Scripts that are meant for end-user distribution can use npm
    const distributionScripts = [
      'publish',
      'prepublish', 
      'postpublish',
      'pack',
      'prepack',
      'postpack'
    ];
    
    return distributionScripts.includes(scriptName);
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new PackageManagerValidator();
  
  validator.validate().then(result => {
    console.log('\n🏛️ Package Manager Consistency Report');
    console.log('=====================================');
    
    if (result.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      result.warnings.forEach(warning => console.log(`   ${warning}`));
    }
    
    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach(error => console.log(`   ${error}`));
      console.log('\n🚨 CONSTITUTIONAL VIOLATION: Package manager inconsistency detected!');
      console.log('Run the auto-fix: bun tools/fix-package-manager-consistency.ts');
      process.exit(1);
    } else {
      console.log('\n✅ Package manager consistency validated!');
      console.log('All development commands use Bun, distribution uses NPM.');
      process.exit(0);
    }
  }).catch(error => {
    console.error('💥 Validation failed:', error);
    process.exit(1);
  });
}

export { PackageManagerValidator };
