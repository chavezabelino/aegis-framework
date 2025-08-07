#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.0.1
 * @intent: Synchronize version across all framework files
 * @context: Maintain version consistency for stable releases
 */

import fs from 'fs';
import path from 'path';

class VersionSynchronizer {
  private readonly versionFile = 'VERSION';
  private readonly packageJsonFile = 'package.json';
  
  async syncVersions(): Promise<void> {
    console.log('🔄 Synchronizing versions across framework files...');
    
    // Read canonical version from VERSION file
    const canonicalVersion = this.readVersionFile();
    console.log(`📋 Canonical version: ${canonicalVersion}`);
    
    // Update package.json
    await this.updatePackageJson(canonicalVersion);
    
    // Update CLI tools
    await this.updateCliVersions(canonicalVersion);
    
    // Update framework files
    await this.updateFrameworkVersions(canonicalVersion);
    
    console.log('✅ Version synchronization complete');
  }
  
  private readVersionFile(): string {
    if (!fs.existsSync(this.versionFile)) {
      throw new Error(`VERSION file not found: ${this.versionFile}`);
    }
    
    return fs.readFileSync(this.versionFile, 'utf8').trim();
  }
  
  private async updatePackageJson(version: string): Promise<void> {
    const packageJsonPath = path.resolve(this.packageJsonFile);
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (packageJson.version !== version) {
      packageJson.version = version;
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
      console.log(`📦 Updated package.json: ${packageJson.version} → ${version}`);
    }
  }
  
  private async updateCliVersions(version: string): Promise<void> {
    const cliFiles = [
      'cli/aegis-hydrate.ts',
      'cli/aegis-conductor.ts',
      'cli/team-config.ts'
    ];
    
    for (const filePath of cliFiles) {
      if (fs.existsSync(filePath)) {
        await this.updateVersionInFile(filePath, version);
      }
    }
  }
  
  private async updateFrameworkVersions(version: string): Promise<void> {
    // Update framework core version references
    const frameworkFiles = [
      'framework/framework-core-v2.0.0-alpha-dev.md',
      'docs/implementation/complete-summary.md'
    ];
    
    for (const filePath of frameworkFiles) {
      if (fs.existsSync(filePath)) {
        await this.updateVersionInFile(filePath, version);
      }
    }
  }
  
  private async updateVersionInFile(filePath: string, version: string): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Update @aegisFrameworkVersion annotations
    const updatedContent = content.replace(
      /@aegisFrameworkVersion:\s*[\d\.\-\w]+/g,
      `@aegisFrameworkVersion: ${version}`
    );
    
    // Update .version() calls in CLI files
    const finalContent = updatedContent.replace(
      /\.version\(['"`][\d\.\-\w]+['"`]\)/g,
      `.version('${version}')`
    );
    
    if (finalContent !== content) {
      fs.writeFileSync(filePath, finalContent);
      console.log(`📝 Updated version references in: ${filePath}`);
    }
  }
}

// CLI execution
async function main() {
  try {
    const synchronizer = new VersionSynchronizer();
    await synchronizer.syncVersions();
  } catch (error) {
    console.error('❌ Version synchronization failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] && process.argv[1].endsWith('sync-version.ts')) {
  main();
}

export { VersionSynchronizer };
