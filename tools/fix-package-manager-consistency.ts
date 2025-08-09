#!/usr/bin/env bun

/**
 * Package Manager Consistency Auto-Fixer
 * @aegisFrameworkVersion 2.4.0
 * @intent Automatically fix npm/node/bun hybrid confusion
 * @context Constitutional enforcement tool for package manager consistency
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

interface FixResult {
  filesFixed: number;
  changesApplied: string[];
}

class PackageManagerFixer {
  private changesApplied: string[] = [];
  private filesFixed = 0;

  async autoFix(): Promise<FixResult> {
    console.log('🔧 Auto-fixing package manager inconsistencies...\n');

    // 1. Fix package.json scripts
    await this.fixPackageJsonScripts();
    
    // 2. Fix GitHub Actions workflows
    await this.fixGitHubWorkflows();
    
    // 3. Fix documentation
    await this.fixDocumentation();
    
    // 4. Fix git hooks
    await this.fixGitHooks();

    return {
      filesFixed: this.filesFixed,
      changesApplied: this.changesApplied
    };
  }

  private async fixPackageJsonScripts(): Promise<void> {
    try {
      console.log('📋 Fixing package.json scripts...');
      
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      const scripts = packageJson.scripts || {};
      let modified = false;

      Object.entries(scripts).forEach(([name, script]: [string, any]) => {
        if (typeof script === 'string') {
          let newScript = script;

          // Fix npm run → bun run (for internal scripts only)
          if (script.includes('npm run ') && !this.isDistributionScript(name)) {
            newScript = newScript.replace(/npm run /g, 'bun run ');
            this.changesApplied.push(`Script "${name}": npm run → bun run`);
            modified = true;
          }

          // Fix node → bun for TypeScript files
          if (script.includes('node ') && script.includes('.ts')) {
            newScript = newScript.replace(/node /g, 'bun ');
            this.changesApplied.push(`Script "${name}": node → bun for TypeScript`);
            modified = true;
          }

          // Fix node cli/ → bun cli/ 
          if (script.includes('node cli/') && !script.includes('.cjs')) {
            newScript = newScript.replace(/node cli\//g, 'bun cli/');
            this.changesApplied.push(`Script "${name}": node cli/ → bun cli/`);
            modified = true;
          }

          // Fix node tools/ → bun tools/
          if (script.includes('node tools/') && !script.includes('.cjs')) {
            newScript = newScript.replace(/node tools\//g, 'bun tools/');
            this.changesApplied.push(`Script "${name}": node tools/ → bun tools/`);
            modified = true;
          }

          // Fix node framework/ → bun framework/
          if (script.includes('node framework/') && !script.includes('.cjs')) {
            newScript = newScript.replace(/node framework\//g, 'bun framework/');
            this.changesApplied.push(`Script "${name}": node framework/ → bun framework/`);
            modified = true;
          }

          // Fix npx → bunx
          if (script.includes('npx ')) {
            newScript = newScript.replace(/npx /g, 'bunx ');
            this.changesApplied.push(`Script "${name}": npx → bunx`);
            modified = true;
          }

          scripts[name] = newScript;
        }
      });

      if (modified) {
        packageJson.scripts = scripts;
        writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');
        this.filesFixed++;
        console.log('✅ Fixed package.json scripts');
      } else {
        console.log('✅ Package.json scripts already consistent');
      }
    } catch (error) {
      console.error(`❌ Failed to fix package.json: ${error}`);
    }
  }

  private async fixGitHubWorkflows(): Promise<void> {
    try {
      console.log('🔄 Fixing GitHub Actions workflows...');
      
      const workflowFiles = await glob('.github/workflows/*.yml');
      
      for (const file of workflowFiles) {
        let content = readFileSync(file, 'utf8');
        let modified = false;
        
        // Fix setup-node → setup-bun
        if (content.includes('setup-node@') && !content.includes('setup-bun@')) {
          content = content.replace(/actions\/setup-node@v\d+/g, 'oven-sh/setup-bun@v2');
          content = content.replace(/node-version:/g, 'bun-version:');
          content = content.replace(/cache: ['"]npm['"]/, '');
          this.changesApplied.push(`${file}: setup-node → setup-bun`);
          modified = true;
        }

        // Fix npm install → bun install
        if (content.includes('npm install') && !content.includes('bun install')) {
          content = content.replace(/npm install/g, 'bun install');
          this.changesApplied.push(`${file}: npm install → bun install`);
          modified = true;
        }

        // Fix npm ci → bun install
        if (content.includes('npm ci')) {
          content = content.replace(/npm ci/g, 'bun install');
          this.changesApplied.push(`${file}: npm ci → bun install`);
          modified = true;
        }

        // Fix node cli/ → bun cli/
        if (content.includes('node cli/')) {
          content = content.replace(/node cli\//g, 'bun cli/');
          this.changesApplied.push(`${file}: node cli/ → bun cli/`);
          modified = true;
        }

        // Fix node tools/ → bun tools/
        if (content.includes('node tools/')) {
          content = content.replace(/node tools\//g, 'bun tools/');
          this.changesApplied.push(`${file}: node tools/ → bun tools/`);
          modified = true;
        }

        if (modified) {
          writeFileSync(file, content);
          this.filesFixed++;
          console.log(`✅ Fixed ${file}`);
        }
      }

      console.log('✅ GitHub workflows fixing complete');
    } catch (error) {
      console.error(`❌ Failed to fix workflows: ${error}`);
    }
  }

  private async fixDocumentation(): Promise<void> {
    try {
      console.log('📚 Fixing documentation...');
      
      const docFiles = ['CONTRIBUTING.md'];
      
      for (const file of docFiles) {
        try {
          let content = readFileSync(file, 'utf8');
          let modified = false;
          
          // Fix development instructions
          if (content.includes('npm install') && content.includes('dependencies')) {
            // Only fix development sections, not user installation
            const developmentSection = content.match(/### Development.*?(?=###|$)/s);
            if (developmentSection) {
              const fixedSection = developmentSection[0]
                .replace(/npm install/g, 'bun install')
                .replace(/npm run /g, 'bun run ')
                .replace(/npm test/g, 'bun test');
              
              content = content.replace(developmentSection[0], fixedSection);
              modified = true;
              this.changesApplied.push(`${file}: Fixed development instructions`);
            }
          }

          if (modified) {
            writeFileSync(file, content);
            this.filesFixed++;
            console.log(`✅ Fixed ${file}`);
          }
        } catch (error) {
          // Skip files that can't be read/written
        }
      }

      console.log('✅ Documentation fixing complete');
    } catch (error) {
      console.error(`❌ Could not fix all documentation: ${error}`);
    }
  }

  private async fixGitHooks(): Promise<void> {
    try {
      console.log('🎣 Fixing git hooks...');
      
      const hookFiles = await glob('tools/*hook*.sh');
      
      for (const file of hookFiles) {
        let content = readFileSync(file, 'utf8');
        let modified = false;
        
        // Fix node cli/ → bun cli/
        if (content.includes('node cli/')) {
          content = content.replace(/node cli\//g, 'bun cli/');
          this.changesApplied.push(`${file}: node cli/ → bun cli/`);
          modified = true;
        }

        // Fix node tools/ → bun tools/
        if (content.includes('node tools/')) {
          content = content.replace(/node tools\//g, 'bun tools/');
          this.changesApplied.push(`${file}: node tools/ → bun tools/`);
          modified = true;
        }

        if (modified) {
          writeFileSync(file, content);
          this.filesFixed++;
          console.log(`✅ Fixed ${file}`);
        }
      }

      console.log('✅ Git hooks fixing complete');
    } catch (error) {
      console.error(`❌ Could not fix git hooks: ${error}`);
    }
  }

  private isDistributionScript(scriptName: string): boolean {
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
  const fixer = new PackageManagerFixer();
  
  fixer.autoFix().then(result => {
    console.log('\n🔧 Package Manager Auto-Fix Report');
    console.log('===================================');
    console.log(`Files fixed: ${result.filesFixed}`);
    
    if (result.changesApplied.length > 0) {
      console.log('\n✅ Changes applied:');
      result.changesApplied.forEach(change => console.log(`   ${change}`));
      console.log('\n🎯 Package manager consistency restored!');
    } else {
      console.log('\n✅ No fixes needed - already consistent!');
    }
  }).catch(error => {
    console.error('💥 Auto-fix failed:', error);
    process.exit(1);
  });
}

export { PackageManagerFixer };
