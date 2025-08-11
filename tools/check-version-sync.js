#!/usr/bin/env node

/**
 * @aegisBlueprint: governance-enforcement
 * @version: 1.0.0
 * @mode: strict
 * @intent: Validate semantic versioning synchronization
 * @context: Enforce constitutional governance through version consistency
 */

import fs from 'node:fs';
import path from 'node:path';

class VersionSyncChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.isCI = process.argv.includes('--ci');
    this.rootVersion = null;
  }

  readRootVersion() {
    try {
      if (fs.existsSync('VERSION')) {
        this.rootVersion = fs.readFileSync('VERSION', 'utf8').trim();
      } else if (fs.existsSync('package.json')) {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        this.rootVersion = packageJson.version;
      } else {
        this.errors.push('No VERSION file or package.json found');
        return false;
      }

      // Validate version format
      if (!this.isValidVersion(this.rootVersion)) {
        this.errors.push(`Invalid version format in root: ${this.rootVersion}`);
        return false;
      }

      return true;
    } catch (error) {
      this.errors.push(`Error reading root version: ${error.message}`);
      return false;
    }
  }

  isValidVersion(version) {
    // Check for semantic versioning format (x.y.z[-prerelease][+build])
    const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
    return semverRegex.test(version);
  }

  checkPackageJson(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const packageJson = JSON.parse(content);
      
      if (packageJson.version && packageJson.version !== this.rootVersion) {
        this.errors.push(`Version mismatch in ${filePath}: ${packageJson.version} != ${this.rootVersion}`);
        return false;
      }

      return true;
    } catch (error) {
      this.errors.push(`Error checking ${filePath}: ${error.message}`);
      return false;
    }
  }

  checkBlueprintYaml(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Look for version field in YAML
      const versionMatch = content.match(/^version:\s*["']?([^"\s]+)["']?/m);
      if (versionMatch) {
        const version = versionMatch[1];
        if (version !== this.rootVersion) {
          this.errors.push(`Version mismatch in ${filePath}: ${version} != ${this.rootVersion}`);
          return false;
        }
      }

      return true;
    } catch (error) {
      this.errors.push(`Error checking ${filePath}: ${error.message}`);
      return false;
    }
  }

  checkMarkdownFiles(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Look for version references in markdown
      const versionMatches = content.match(/version[:\s]+["']?([^"\s]+)["']?/gi);
      if (versionMatches) {
        for (const match of versionMatches) {
          const version = match.replace(/version[:\s]+["']?([^"\s]+)["']?/i, '$1');
          if (this.isValidVersion(version) && version !== this.rootVersion) {
            this.warnings.push(`Version reference in ${filePath}: ${version} != ${this.rootVersion}`);
          }
        }
      }

      return true;
    } catch (error) {
      this.errors.push(`Error checking ${filePath}: ${error.message}`);
      return false;
    }
  }

  async checkDirectory(dirPath) {
    try {
      if (!fs.existsSync(dirPath)) {
        return;
      }

      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip node_modules and .git
          if (item !== 'node_modules' && item !== '.git') {
            await this.checkDirectory(fullPath);
          }
        } else if (stat.isFile()) {
          const ext = path.extname(item);
          
          if (item === 'package.json') {
            this.checkPackageJson(fullPath);
          } else if (item === 'blueprint.yaml' || item.endsWith('.blueprint.yaml')) {
            this.checkBlueprintYaml(fullPath);
          } else if (ext === '.md') {
            this.checkMarkdownFiles(fullPath);
          }
        }
      }
    } catch (error) {
      this.errors.push(`Error checking directory ${dirPath}: ${error.message}`);
    }
  }

  printResults() {
    console.log('🔍 Version Sync Check Results\n');
    
    if (this.rootVersion) {
      console.log(`📋 Root Version: ${this.rootVersion}\n`);
    }
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All version references are synchronized');
      return true;
    }

    if (this.errors.length > 0) {
      console.log('❌ Errors:');
      this.errors.forEach(error => console.log(`  • ${error}`));
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      this.warnings.forEach(warning => console.log(`  • ${warning}`));
    }

    return this.errors.length === 0;
  }

  suggestFix(filePath, currentVersion, expectedVersion) {
    const ext = path.extname(filePath);
    
    if (ext === '.json') {
      return `Update ${filePath} version field to "${expectedVersion}"`;
    } else if (ext === '.yaml' || ext === '.yml') {
      return `Update ${filePath} version field to "${expectedVersion}"`;
    } else if (ext === '.md') {
      return `Update version references in ${filePath} to "${expectedVersion}"`;
    }
    
    return `Update version in ${filePath} to "${expectedVersion}"`;
  }
}

async function main() {
  const checker = new VersionSyncChecker();
  
  // Read root version first
  if (!checker.readRootVersion()) {
    console.error('❌ Failed to read root version');
    process.exit(1);
  }

  // Check specific directories
  const directories = ['blueprints', 'adapters', 'tools', 'cli', 'patterns', 'packages'];
  
  for (const dir of directories) {
    await checker.checkDirectory(dir);
  }

  // Check root package.json
  if (fs.existsSync('package.json')) {
    checker.checkPackageJson('package.json');
  }

  const success = checker.printResults();
  
  if (!success && checker.isCI) {
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('❌ Version sync check failed:', error.message);
    process.exit(1);
  });
}

export { VersionSyncChecker };
