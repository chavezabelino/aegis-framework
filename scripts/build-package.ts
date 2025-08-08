#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.1.0
 * @intent: Build packaged distribution of Aegis Framework
 * @context: Create standalone and library packages for stable releases
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface PackageConfig {
  name: string;
  type: 'standalone-cli' | 'framework-library' | 'docker';
  outputDir: string;
  includeFiles: string[];
  excludeFiles: string[];
  binaryName?: string;
}

class PackageBuilder {
  private readonly version = fs.readFileSync('VERSION', 'utf8').trim();
  private readonly distDir = 'dist';
  
  async buildAllPackages(): Promise<void> {
    console.log(`🏗️ Building Aegis Framework v${this.version} packages...\n`);
    
    // Clean and create dist directory
    this.cleanDist();
    
    // Build standalone CLI package
    await this.buildStandaloneCLI();
    
    // Build framework library package
    await this.buildFrameworkLibrary();
    
    // Generate package metadata
    await this.generatePackageMetadata();
    
    console.log('\n✅ Package building complete!');
    this.showPackageInfo();
  }
  
  private cleanDist(): void {
    if (fs.existsSync(this.distDir)) {
      fs.rmSync(this.distDir, { recursive: true, force: true });
    }
    fs.mkdirSync(this.distDir, { recursive: true });
    console.log('🧹 Cleaned dist directory');
  }
  
  private async buildStandaloneCLI(): Promise<void> {
    console.log('📦 Building standalone CLI package...');
    
    const cliDir = path.join(this.distDir, 'aegis-cli');
    fs.mkdirSync(cliDir, { recursive: true });
    
    // Create package structure
    const binDir = path.join(cliDir, 'bin');
    const libDir = path.join(cliDir, 'lib');
    const docsDir = path.join(cliDir, 'docs');
    
    fs.mkdirSync(binDir, { recursive: true });
    fs.mkdirSync(libDir, { recursive: true });
    fs.mkdirSync(docsDir, { recursive: true });
    
    // Copy CLI executables (convert TS to executable JS)
    this.copyCLIExecutable('cli/aegis-hydrate.ts', path.join(binDir, 'aegis-hydrate'));
    this.copyCLIExecutable('cli/aegis-conductor.ts', path.join(binDir, 'aegis-conductor'));
    this.copyCLIExecutable('cli/team-config.ts', path.join(binDir, 'aegis-config'));
    
    // Copy essential libraries
    this.copyDirectory('tools', path.join(libDir, 'tools'));
    this.copyDirectory('framework/contracts', path.join(libDir, 'contracts'));
    this.copyDirectory('framework/templates', path.join(libDir, 'templates'));
    
    // Dependencies will be handled by NPM during installation
    // No need to bundle - this is standard for Node.js CLI tools
    
    // Copy essential docs
    this.copyFile('README.md', path.join(docsDir, 'README.md'));
    this.copyFile('LICENSE', path.join(docsDir, 'LICENSE'));
    this.generateQuickStartGuide(path.join(docsDir, 'QUICK-START.md'));
    
    // Create CLI package.json with proper dependencies
    this.createCLIPackageJson(cliDir);
    
    // Make binaries executable
    this.makeExecutable(path.join(binDir, 'aegis-hydrate'));
    this.makeExecutable(path.join(binDir, 'aegis-conductor'));
    this.makeExecutable(path.join(binDir, 'aegis-config'));
    
    console.log('✅ Standalone CLI package built');
  }
  
  private async buildFrameworkLibrary(): Promise<void> {
    console.log('📚 Building framework library package...');
    
    const libDir = path.join(this.distDir, 'aegis-framework-lib');
    fs.mkdirSync(libDir, { recursive: true });
    
    // Copy entire framework structure for customization
    this.copyDirectory('framework', path.join(libDir, 'framework'));
    this.copyDirectory('cli', path.join(libDir, 'cli'));
    this.copyDirectory('tools', path.join(libDir, 'tools'));
    this.copyDirectory('templates', path.join(libDir, 'templates'));
    this.copyDirectory('docs', path.join(libDir, 'docs'));
    
    // Copy configuration files
    this.copyFile('package.json', path.join(libDir, 'package.json'));
    this.copyFile('tsconfig.json', path.join(libDir, 'tsconfig.json'));
    this.copyFile('jest.config.js', path.join(libDir, 'jest.config.js'));
    this.copyFile('VERSION', path.join(libDir, 'VERSION'));
    this.copyFile('CONSTITUTION.md', path.join(libDir, 'CONSTITUTION.md'));
    this.copyFile('CHANGELOG.md', path.join(libDir, 'CHANGELOG.md'));
    this.copyFile('README.md', path.join(libDir, 'README.md'));
    this.copyFile('LICENSE', path.join(libDir, 'LICENSE'));
    
    // Create customization guide
    this.generateCustomizationGuide(path.join(libDir, 'CUSTOMIZATION.md'));
    
    console.log('✅ Framework library package built');
  }
  
  private generatePackageMetadata(): void {
    const metadata = {
      version: this.version,
      buildDate: new Date().toISOString(),
      packages: {
        'aegis-cli': {
          type: 'standalone-cli',
          description: 'Standalone CLI for project hydration',
          size: this.getDirectorySize(path.join(this.distDir, 'aegis-cli')),
          binaries: ['aegis-hydrate', 'aegis-conductor', 'aegis-config']
        },
        'aegis-framework-lib': {
          type: 'framework-library',
          description: 'Full framework for customization',
          size: this.getDirectorySize(path.join(this.distDir, 'aegis-framework-lib')),
          features: ['constitutional-governance', 'blueprint-driven', 'self-healing']
        }
      },
      checksums: this.generateChecksums()
    };
    
    fs.writeFileSync(
      path.join(this.distDir, 'packages.json'),
      JSON.stringify(metadata, null, 2)
    );
    
    console.log('📋 Generated package metadata');
  }
  
  private copyFile(source: string, destination: string): void {
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, destination);
    }
  }
  
  private copyCLIExecutable(source: string, destination: string): void {
    if (fs.existsSync(source)) {
      // For v2.1.0, we'll use Node.js direct TypeScript execution
      // This is simpler and doesn't require compilation for initial release
      
      const cliName = path.basename(source, '.ts');
      const wrapperContent = `#!/usr/bin/env node

// Aegis Framework CLI: ${cliName} v2.1.0
// Runs TypeScript CLI directly using Node.js built-in capabilities

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the original CLI file
const cliPath = resolve(__dirname, '..', 'lib', 'cli', '${path.basename(source)}');

try {
  // Execute the CLI directly with Node.js TypeScript support
  execSync(\`node --experimental-strip-types "\${cliPath}" \${process.argv.slice(2).join(' ')}\`, {
    stdio: 'inherit',
    env: process.env
  });
} catch (error) {
  // If TypeScript stripping not available, fall back to the original method
  console.error('Note: Using direct import method...');
  try {
    const cliModule = await import(\`file://\${cliPath}\`);
    // Most CLI tools are self-executing when imported
  } catch (importError) {
    console.error('❌ Failed to execute CLI:', importError.message);
    console.error('💡 This CLI requires Node.js v20+ with TypeScript support');
    process.exit(1);
  }
}
`;
      
      // Write the wrapper
      fs.writeFileSync(destination, wrapperContent);
      
      // Make executable
      fs.chmodSync(destination, 0o755);
      
      // Also copy the original source to lib/cli/
      const libCliDir = path.join(path.dirname(destination), '..', 'lib', 'cli');
      fs.mkdirSync(libCliDir, { recursive: true });
      fs.copyFileSync(source, path.join(libCliDir, path.basename(source)));
    }
  }
  
  private copyDirectory(source: string, destination: string): void {
    if (fs.existsSync(source)) {
      fs.mkdirSync(destination, { recursive: true });
      
      const items = fs.readdirSync(source);
      for (const item of items) {
        const sourcePath = path.join(source, item);
        const destPath = path.join(destination, item);
        
        if (fs.statSync(sourcePath).isDirectory()) {
          this.copyDirectory(sourcePath, destPath);
        } else {
          fs.copyFileSync(sourcePath, destPath);
        }
      }
    }
  }
  
  private makeExecutable(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.chmodSync(filePath, '755');
    }
  }
  
  private copyNodeModules(cliDir: string): void {
    console.log('📦 Bundling dependencies for standalone operation...');
    
    // For a proper production setup, we'd use webpack or esbuild
    // For now, copy essential dependencies only
    const nodeModulesDir = path.join(cliDir, 'node_modules');
    fs.mkdirSync(nodeModulesDir, { recursive: true });
    
    // Copy only the dependencies our CLI actually uses
    const essentialDeps = ['commander', 'inquirer', 'ora', 'chalk'];
    
    for (const dep of essentialDeps) {
      const sourceDepDir = path.join('node_modules', dep);
      const targetDepDir = path.join(nodeModulesDir, dep);
      
      if (fs.existsSync(sourceDepDir)) {
        this.copyDirectory(sourceDepDir, targetDepDir);
      }
    }
    
    // Create a minimal package.json for node_modules resolution
    const nodeModulesPackage = {
      "name": "aegis-cli-dependencies",
      "version": "1.0.0",
      "private": true
    };
    
    fs.writeFileSync(
      path.join(nodeModulesDir, 'package.json'),
      JSON.stringify(nodeModulesPackage, null, 2)
    );
  }
  
  private createCLIPackageJson(cliDir: string): void {
    const cliPackage = {
      name: '@aegis-framework/cli',
      version: this.version,
      description: 'Aegis Framework CLI - Blueprint-driven AI engineering with constitutional governance',
      type: 'module',
      bin: {
        'aegis-hydrate': './bin/aegis-hydrate',
        'aegis-conductor': './bin/aegis-conductor',
        'aegis-config': './bin/aegis-config'
      },
      dependencies: {
        'commander': '^14.0.0',
        'inquirer': '^12.9.0',
        'ora': '^8.2.0',
        'chalk': '^5.3.0',
        'js-yaml': '^4.1.0'
      },
      engines: {
        node: '>=18.0.0'
      },
      keywords: [
        'ai',
        'framework',
        'blueprint',
        'governance',
        'constitutional',
        'hydration'
      ],
      license: 'MIT',
      homepage: 'https://github.com/aegis-framework/aegis-framework',
      repository: {
        type: 'git',
        url: 'https://github.com/aegis-framework/aegis-framework.git'
      }
    };
    
    fs.writeFileSync(
      path.join(cliDir, 'package.json'),
      JSON.stringify(cliPackage, null, 2)
    );
  }
  
  private generateQuickStartGuide(filePath: string): void {
    const guide = `# Aegis Framework CLI v${this.version} - Quick Start

## Installation

\`\`\`bash
npm install -g @aegis-framework/cli@${this.version}
\`\`\`

## Usage

### Hydrate an Existing Project
\`\`\`bash
aegis-hydrate /path/to/your/project
\`\`\`

### Constitutional Governance
\`\`\`bash
aegis-conductor check
aegis-conductor init
\`\`\`

### Team Configuration
\`\`\`bash
aegis-config setup
aegis-config validate
\`\`\`

## Documentation

- Full documentation: https://github.com/aegis-framework/aegis-framework/docs
- Constitutional governance: ./docs/CONSTITUTION.md
- Examples: ./docs/examples/

## Support

- Issues: https://github.com/aegis-framework/aegis-framework/issues
- Discussions: https://github.com/aegis-framework/aegis-framework/discussions
`;
    
    fs.writeFileSync(filePath, guide);
  }
  
  private generateCustomizationGuide(filePath: string): void {
    const guide = `# Aegis Framework Library v${this.version} - Customization Guide

## Overview

This package contains the full Aegis Framework source code for customization and extension.

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Validate framework
npm run validate:all

# Build custom package
npm run build:package
\`\`\`

## Customization Points

### 1. Framework Configuration
- \`framework/contracts/\` - Constitutional contracts
- \`framework/templates/\` - Blueprint templates
- \`framework/adapters/\` - Tech stack adapters

### 2. CLI Tools
- \`cli/\` - Command-line interfaces
- \`tools/\` - Validation and utility tools

### 3. Governance
- \`CONSTITUTION.md\` - Framework governance principles
- \`framework/governance/\` - Democratic processes

## Building Custom Packages

\`\`\`bash
# Build standalone CLI
npm run build:cli

# Build library package
npm run build:package

# Build Docker image
npm run build:docker
\`\`\`

## Documentation

- Architecture: ./docs/architecture.md
- API Reference: ./docs/reference/
- Examples: ./docs/examples/
`;
    
    fs.writeFileSync(filePath, guide);
  }
  
  private getDirectorySize(dirPath: string): string {
    if (!fs.existsSync(dirPath)) return '0 KB';
    
    try {
      const result = execSync(`du -sh "${dirPath}"`, { encoding: 'utf8' });
      return result.split('\t')[0];
    } catch {
      return 'Unknown';
    }
  }
  
  private generateChecksums(): Record<string, string> {
    const checksums: Record<string, string> = {};
    
    try {
      const cliDir = path.join(this.distDir, 'aegis-cli');
      const libDir = path.join(this.distDir, 'aegis-framework-lib');
      
      if (fs.existsSync(cliDir)) {
        const cliChecksum = execSync(`find "${cliDir}" -type f -exec sha256sum {} \\; | sha256sum`, { encoding: 'utf8' });
        checksums['aegis-cli'] = cliChecksum.split(' ')[0];
      }
      
      if (fs.existsSync(libDir)) {
        const libChecksum = execSync(`find "${libDir}" -type f -exec sha256sum {} \\; | sha256sum`, { encoding: 'utf8' });
        checksums['aegis-framework-lib'] = libChecksum.split(' ')[0];
      }
    } catch (error) {
      console.warn('⚠️ Could not generate checksums:', error);
    }
    
    return checksums;
  }
  
  private showPackageInfo(): void {
    console.log('\n📦 Package Information:');
    console.log(`Version: ${this.version}`);
    console.log(`Build Date: ${new Date().toISOString()}`);
    console.log('\nPackages built:');
    
    const cliPath = path.join(this.distDir, 'aegis-cli');
    const libPath = path.join(this.distDir, 'aegis-framework-lib');
    
    if (fs.existsSync(cliPath)) {
      console.log(`  ✅ Standalone CLI: ${cliPath}`);
      console.log(`     Size: ${this.getDirectorySize(cliPath)}`);
    }
    
    if (fs.existsSync(libPath)) {
      console.log(`  ✅ Framework Library: ${libPath}`);
      console.log(`     Size: ${this.getDirectorySize(libPath)}`);
    }
    
    console.log(`\n📋 Package metadata: ${path.join(this.distDir, 'packages.json')}`);
  }
}

// CLI execution
async function main() {
  try {
    const builder = new PackageBuilder();
    await builder.buildAllPackages();
  } catch (error) {
    console.error('❌ Package building failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] && process.argv[1].endsWith('build-package.ts')) {
  main();
}

export { PackageBuilder };
