#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.1.0
 * @intent: Comprehensive version update script to fix systematic gaps
 * @context: Addresses documentation drift by updating all version references
 * @mode: strict
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface VersionUpdateConfig {
  oldVersion: string;
  newVersion: string;
  filePatterns: string[];
  excludePatterns: string[];
  annotationPatterns: string[];
  contentPatterns: string[];
}

class ComprehensiveVersionUpdater {
  private config: VersionUpdateConfig;
  private frameworkRoot: string;
  private updatedFiles: string[] = [];
  private skippedFiles: string[] = [];
  private errors: string[] = [];

  constructor(frameworkRoot: string = process.cwd()) {
    this.frameworkRoot = frameworkRoot;
    this.config = {
      oldVersion: '2.1.0',
      newVersion: '2.1.0',
      filePatterns: [
        '**/*.ts',
        '**/*.js',
        '**/*.md',
        '**/*.yaml',
        '**/*.yml',
        '**/*.json',
        '**/*.sh',
        '**/*.cjs'
      ],
      excludePatterns: [
        'node_modules/**',
        'dist/**',
        '.git/**',
        '**/*.map',
        '**/*.d.ts',
        '**/package-lock.json',
        '**/yarn.lock',
        '**/bun.lockb'
      ],
      annotationPatterns: [
        '@aegisFrameworkVersion: 2.1.0',
        '@aegisFrameworkVersion: "2.1.0"',
        '@aegisFrameworkVersion: \'2.1.0\''
      ],
      contentPatterns: [
        'v2.1.0',
        '2.1.0',
        '@aegis-framework/cli@2.1.0',
        'aegis-framework/cli:2.1.0',
        'framework-core-v2.1.0.md'
      ]
    };
  }

  async updateAllVersions(): Promise<void> {
    console.log('🔄 Comprehensive Version Update Process');
    console.log('=====================================');
    console.log(`Updating from ${this.config.oldVersion} to ${this.config.newVersion}`);
    console.log('');

    try {
      // Find all files that need updating
      const files = await this.findFilesToUpdate();
      console.log(`📁 Found ${files.length} files to process`);
      console.log('');

      // Process each file
      for (const file of files) {
        await this.updateFile(file);
      }

      // Generate report
      this.generateReport();

    } catch (error) {
      console.error('❌ Error during version update:', error);
      process.exit(1);
    }
  }

  private async findFilesToUpdate(): Promise<string[]> {
    const files: string[] = [];

    for (const pattern of this.config.filePatterns) {
      const matches = await glob(pattern, {
        cwd: this.frameworkRoot,
        ignore: this.config.excludePatterns,
        absolute: true
      });
      files.push(...matches);
    }

    return [...new Set(files)]; // Remove duplicates
  }

  private async updateFile(filePath: string): Promise<void> {
    try {
      const relativePath = path.relative(this.frameworkRoot, filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      let updatedContent = content;
      let hasChanges = false;

      // Update annotation patterns
      for (const pattern of this.config.annotationPatterns) {
        const newPattern = pattern.replace(this.config.oldVersion, this.config.newVersion);
        if (content.includes(pattern)) {
          updatedContent = updatedContent.replace(new RegExp(this.escapeRegex(pattern), 'g'), newPattern);
          hasChanges = true;
        }
      }

      // Update content patterns
      for (const pattern of this.config.contentPatterns) {
        const newPattern = pattern.replace(this.config.oldVersion, this.config.newVersion);
        if (content.includes(pattern)) {
          updatedContent = updatedContent.replace(new RegExp(this.escapeRegex(pattern), 'g'), newPattern);
          hasChanges = true;
        }
      }

      // Special handling for CLI version commands
      if (content.includes('.version(\'2.1.0\')')) {
        updatedContent = updatedContent.replace(/\.version\('2\.0\.1'\)/g, `.version('${this.config.newVersion}')`);
        hasChanges = true;
      }

      if (content.includes('.version("2.1.0")')) {
        updatedContent = updatedContent.replace(/\.version\("2\.0\.1"\)/g, `.version("${this.config.newVersion}")`);
        hasChanges = true;
      }

      // Special handling for environment variables
      if (content.includes('process.env.npm_package_version || \'2.1.0\'')) {
        updatedContent = updatedContent.replace(
          /process\.env\.npm_package_version \|\| '2\.0\.1'/g,
          `process.env.npm_package_version || '${this.config.newVersion}'`
        );
        hasChanges = true;
      }

      if (content.includes('process.env.npm_package_version || "2.1.0"')) {
        updatedContent = updatedContent.replace(
          /process\.env\.npm_package_version \|\| "2\.0\.1"/g,
          `process.env.npm_package_version || "${this.config.newVersion}"`
        );
        hasChanges = true;
      }

      // Write updated content if changes were made
      if (hasChanges) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        this.updatedFiles.push(relativePath);
        console.log(`✅ Updated: ${relativePath}`);
      } else {
        this.skippedFiles.push(relativePath);
      }

    } catch (error) {
      const relativePath = path.relative(this.frameworkRoot, filePath);
      this.errors.push(`${relativePath}: ${error instanceof Error ? error.message : String(error)}`);
      console.log(`❌ Error updating: ${relativePath}`);
    }
  }

  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private generateReport(): void {
    console.log('');
    console.log('📊 Version Update Report');
    console.log('=======================');
    console.log(`✅ Files Updated: ${this.updatedFiles.length}`);
    console.log(`⏭️ Files Skipped: ${this.skippedFiles.length}`);
    console.log(`❌ Errors: ${this.errors.length}`);
    console.log('');

    if (this.updatedFiles.length > 0) {
      console.log('📝 Updated Files:');
      this.updatedFiles.forEach(file => console.log(`  - ${file}`));
      console.log('');
    }

    if (this.errors.length > 0) {
      console.log('🚨 Errors:');
      this.errors.forEach(error => console.log(`  - ${error}`));
      console.log('');
    }

    console.log('🎯 Next Steps:');
    console.log('  1. Review updated files for accuracy');
    console.log('  2. Run constitutional validation: node tools/validate-constitution.ts');
    console.log('  3. Test build system: npm run build:vite');
    console.log('  4. Commit changes with comprehensive message');
  }
}

// CLI interface
async function main() {
  const updater = new ComprehensiveVersionUpdater();
  await updater.updateAllVersions();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { ComprehensiveVersionUpdater };
