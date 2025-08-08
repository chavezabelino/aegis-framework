#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.4.0
 * @intent: Validate built packages for release readiness
 * @context: Ensure CLI tools work and packages are complete
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class PackageValidator {
  private distDir = 'dist';
  
  async validateAll(): Promise<void> {
    console.log('🔍 Validating release packages...\n');
    
    // Check dist directory exists
    if (!fs.existsSync(this.distDir)) {
      throw new Error('dist/ directory not found. Run npm run build:package first.');
    }
    
    // Validate package metadata
    await this.validatePackageMetadata();
    
    // Validate CLI package
    await this.validateCLIPackage();
    
    // Validate framework library package
    await this.validateFrameworkLibrary();
    
    // Test CLI executables
    await this.testCLIExecutables();
    
    console.log('\n✅ All package validations passed!');
    console.log('🎉 Packages are ready for release');
  }
  
  private async validatePackageMetadata(): Promise<void> {
    console.log('📋 Validating package metadata...');
    
    const metadataPath = path.join(this.distDir, 'packages.json');
    if (!fs.existsSync(metadataPath)) {
      throw new Error('packages.json metadata file missing');
    }
    
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    
    // Check required fields
    const requiredFields = ['version', 'buildDate', 'packages', 'checksums'];
    for (const field of requiredFields) {
      if (!metadata[field]) {
        throw new Error(`Missing required field in packages.json: ${field}`);
      }
    }
    
    // Validate packages structure
    if (!metadata.packages['aegis-cli'] || !metadata.packages['aegis-framework-lib']) {
      throw new Error('Missing required package entries in metadata');
    }
    
    console.log('  ✅ Package metadata valid');
  }
  
  private async validateCLIPackage(): Promise<void> {
    console.log('📦 Validating CLI package...');
    
    const cliDir = path.join(this.distDir, 'aegis-cli');
    
    // Check directory structure
    const requiredDirs = ['bin', 'lib', 'docs'];
    for (const dir of requiredDirs) {
      const dirPath = path.join(cliDir, dir);
      if (!fs.existsSync(dirPath)) {
        throw new Error(`CLI package missing required directory: ${dir}`);
      }
    }
    
    // Check package.json
    const packageJsonPath = path.join(cliDir, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('CLI package.json missing');
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (!packageJson.bin || !packageJson.bin['aegis-hydrate']) {
      throw new Error('CLI package.json missing bin entries');
    }
    
    // Check executable files exist
    const executables = ['aegis-hydrate', 'aegis-conductor', 'aegis-config'];
    for (const executable of executables) {
      const execPath = path.join(cliDir, 'bin', executable);
      if (!fs.existsSync(execPath)) {
        throw new Error(`CLI executable missing: ${executable}`);
      }
      
      // Check if executable
      const stats = fs.statSync(execPath);
      if (!(stats.mode & 0o111)) {
        throw new Error(`CLI file not executable: ${executable}`);
      }
    }
    
    console.log('  ✅ CLI package structure valid');
  }
  
  private async validateFrameworkLibrary(): Promise<void> {
    console.log('📚 Validating framework library...');
    
    const libDir = path.join(this.distDir, 'aegis-framework-lib');
    
    // Check key directories exist
    const requiredDirs = ['framework', 'cli', 'tools', 'docs'];
    for (const dir of requiredDirs) {
      const dirPath = path.join(libDir, dir);
      if (!fs.existsSync(dirPath)) {
        throw new Error(`Framework library missing directory: ${dir}`);
      }
    }
    
    // Check key files
    const requiredFiles = ['package.json', 'README.md', 'LICENSE', 'CONSTITUTION.md'];
    for (const file of requiredFiles) {
      const filePath = path.join(libDir, file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Framework library missing file: ${file}`);
      }
    }
    
    console.log('  ✅ Framework library structure valid');
  }
  
  private async testCLIExecutables(): Promise<void> {
    console.log('🧪 Testing CLI executables...');
    
    const cliDir = path.join(this.distDir, 'aegis-cli');
    
    // Test aegis-hydrate --help
    try {
      const output = execSync(`${cliDir}/bin/aegis-hydrate --help`, { encoding: 'utf8' });
      if (!output.includes('Usage: aegis-hydrate')) {
        throw new Error('aegis-hydrate help output unexpected');
      }
      console.log('  ✅ aegis-hydrate executable working');
    } catch (error) {
      throw new Error(`aegis-hydrate test failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Test aegis-conductor help
    try {
      const output = execSync(`${cliDir}/bin/aegis-conductor`, { encoding: 'utf8' });
      if (!output.includes('Aegis Constitutional Conductor')) {
        throw new Error('aegis-conductor help output unexpected');
      }
      console.log('  ✅ aegis-conductor executable working');
    } catch (error) {
      throw new Error(`aegis-conductor test failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// CLI execution
async function main() {
  try {
    const validator = new PackageValidator();
    await validator.validateAll();
  } catch (error) {
    console.error('❌ Package validation failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] && process.argv[1].endsWith('validate-package.ts')) {
  main();
}

export { PackageValidator };
