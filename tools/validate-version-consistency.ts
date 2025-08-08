#!/usr/bin/env node
/**
 * @aegisFrameworkVersion 2.0.1
 * @intent Constitutional validation tool for version consistency across framework
 * @context Prevention tool for version drift following comprehensive audit
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface VersionValidation {
  versionFile: string;
  gitTags: string[];
  changelogEntries: string[];
  roadmapReferences: string[];
  releaseDocuments: string[];
  frameworkSpecs: string[];
}

interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  summary: string;
}

class VersionConsistencyValidator {
  private workspaceRoot: string;
  
  constructor(workspaceRoot: string = process.cwd()) {
    this.workspaceRoot = workspaceRoot;
  }

  /**
   * Run comprehensive version consistency validation
   */
  async validateVersionConsistency(): Promise<ValidationResult> {
    const result: ValidationResult = {
      passed: true,
      errors: [],
      warnings: [],
      summary: ''
    };

    console.log('🔍 Starting constitutional version consistency validation...\n');

    try {
      // 1. Gather version information from all sources
      const versionData = await this.gatherVersionData();
      
      // 2. Validate VERSION file matches current git tag
      this.validateVersionFile(versionData, result);
      
      // 3. Validate CHANGELOG entries match git tags
      this.validateChangelogConsistency(versionData, result);
      
      // 4. Validate release documentation coverage
      this.validateReleaseDocumentation(versionData, result);
      
      // 5. Validate roadmap version references
      this.validateRoadmapReferences(versionData, result);
      
      // 6. Validate framework specification versions
      this.validateFrameworkSpecs(versionData, result);
      
      // 7. Generate summary
      this.generateValidationSummary(result);
      
      return result;
      
    } catch (error: any) {
      result.passed = false;
      result.errors.push(`Validation failed: ${error?.message || 'Unknown error'}`);
      return result;
    }
  }

  /**
   * Gather version information from all framework sources
   */
  private async gatherVersionData(): Promise<VersionValidation> {
    const data: VersionValidation = {
      versionFile: '',
      gitTags: [],
      changelogEntries: [],
      roadmapReferences: [],
      releaseDocuments: [],
      frameworkSpecs: []
    };

    // Read VERSION file
    const versionPath = path.join(this.workspaceRoot, 'VERSION');
    if (fs.existsSync(versionPath)) {
      data.versionFile = fs.readFileSync(versionPath, 'utf8').trim();
    }

    // Get git tags
    try {
      const gitOutput = execSync('git tag | grep -E "v[0-9]" | sort -V', { 
        cwd: this.workspaceRoot,
        encoding: 'utf8' 
      });
      data.gitTags = gitOutput.trim().split('\n').filter((tag: string) => tag.length > 0);
    } catch (error) {
      console.warn('Warning: Could not retrieve git tags');
    }

    // Parse CHANGELOG for version entries
    const changelogPath = path.join(this.workspaceRoot, 'CHANGELOG.md');
    if (fs.existsSync(changelogPath)) {
      const changelogContent = fs.readFileSync(changelogPath, 'utf8');
      const versionMatches = changelogContent.match(/## \[([^\]]+)\]/g);
      if (versionMatches) {
        data.changelogEntries = versionMatches.map((match: string) => {
          const version = match.match(/\[([^\]]+)\]/);
          return version ? version[1] : '';
        }).filter((v: string) => v && v !== 'Unreleased');
      }
    }

    // Find release documentation files
    const releasesDir = path.join(this.workspaceRoot, 'docs/releases');
    if (fs.existsSync(releasesDir)) {
      const releaseFiles = fs.readdirSync(releasesDir)
        .filter((file: string) => file.match(/^v\d+\.\d+\.\d+.*-summary\.md$/))
        .map((file: string) => file.replace('-summary.md', ''));
      data.releaseDocuments = releaseFiles;
    }

    // Find framework specification files
    const frameworkDir = path.join(this.workspaceRoot, 'framework');
    if (fs.existsSync(frameworkDir)) {
      const specFiles = fs.readdirSync(frameworkDir)
        .filter((file: string) => file.match(/^framework-core-v.*\.md$/))
        .map((file: string) => {
          const version = file.match(/framework-core-v([^\.]+)\.md/);
          return version ? version[1] : '';
        }).filter((v: string) => v);
      data.frameworkSpecs = specFiles;
    }

    return data;
  }

  /**
   * Validate VERSION file consistency
   */
  private validateVersionFile(data: VersionValidation, result: ValidationResult): void {
    console.log('📄 Validating VERSION file...');
    
    if (!data.versionFile) {
      result.errors.push('VERSION file not found or empty');
      result.passed = false;
      return;
    }

    // Check if VERSION matches latest git tag
    const latestTag = data.gitTags[data.gitTags.length - 1];
    const expectedVersion = latestTag ? latestTag.replace('v', '') : '';
    
    if (data.versionFile !== expectedVersion) {
      result.errors.push(`VERSION file (${data.versionFile}) does not match latest git tag (${latestTag})`);
      result.passed = false;
    } else {
      console.log(`  ✅ VERSION file matches latest git tag: ${data.versionFile}`);
    }
  }

  /**
   * Validate CHANGELOG entries match git tags
   */
  private validateChangelogConsistency(data: VersionValidation, result: ValidationResult): void {
    console.log('📝 Validating CHANGELOG consistency...');
    
    // Check for phantom versions (in CHANGELOG but not in git)
    const phantomVersions = data.changelogEntries.filter(version => {
      const tag = `v${version}`;
      return !data.gitTags.includes(tag);
    });

    if (phantomVersions.length > 0) {
      result.errors.push(`Phantom versions in CHANGELOG (not in git): ${phantomVersions.join(', ')}`);
      result.passed = false;
    }

    // Check for missing versions (in git but not in CHANGELOG)
    const missingVersions = data.gitTags.filter(tag => {
      const version = tag.replace('v', '');
      return !data.changelogEntries.includes(version);
    });

    if (missingVersions.length > 0) {
      result.warnings.push(`Missing CHANGELOG entries for git tags: ${missingVersions.join(', ')}`);
    }

    if (phantomVersions.length === 0) {
      console.log(`  ✅ No phantom versions detected in CHANGELOG`);
    }
    
    console.log(`  📊 CHANGELOG has ${data.changelogEntries.length} versions, git has ${data.gitTags.length} tags`);
  }

  /**
   * Validate release documentation coverage
   */
  private validateReleaseDocumentation(data: VersionValidation, result: ValidationResult): void {
    console.log('📋 Validating release documentation coverage...');
    
    // Check if current version has release documentation
    const currentVersion = `v${data.versionFile}`;
    if (!data.releaseDocuments.includes(currentVersion)) {
      result.errors.push(`Missing release documentation for current version: ${currentVersion}`);
      result.passed = false;
    }

    // Check for major versions missing documentation
    const majorVersions = data.gitTags.filter(tag => {
      const parts = tag.split('.');
      return parts.length >= 2 && !tag.includes('alpha') && !tag.includes('beta');
    });

    const missingDocs = majorVersions.filter(tag => !data.releaseDocuments.includes(tag));
    if (missingDocs.length > 0) {
      result.warnings.push(`Major versions missing release documentation: ${missingDocs.join(', ')}`);
    }

    console.log(`  📚 ${data.releaseDocuments.length} release documents found`);
  }

  /**
   * Validate roadmap version references are current
   */
  private validateRoadmapReferences(data: VersionValidation, result: ValidationResult): void {
    console.log('🗺️ Validating roadmap version references...');
    
    // Check README roadmap section
    const readmePath = path.join(this.workspaceRoot, 'README.md');
    if (fs.existsSync(readmePath)) {
      const readmeContent = fs.readFileSync(readmePath, 'utf8');
      
      // Look for outdated "current" version references
      const currentVersionRefs = readmeContent.match(/v\d+\.\d+\.\d+/g);
      if (currentVersionRefs) {
        const latestVersion = `v${data.versionFile}`;
        const hasLatestRef = currentVersionRefs.includes(latestVersion);
        
        if (!hasLatestRef) {
          result.warnings.push(`README may have outdated version references. Current: ${latestVersion}`);
        }
      }
    }

    console.log(`  🎯 Roadmap version references validated`);
  }

  /**
   * Validate framework specification versions
   */
  private validateFrameworkSpecs(data: VersionValidation, result: ValidationResult): void {
    console.log('🏛️ Validating framework specifications...');
    
    // Check if current version has framework spec
    const currentSpec = data.frameworkSpecs.find(spec => spec === data.versionFile);
    
    if (!currentSpec) {
      result.warnings.push(`No framework specification found for current version: v${data.versionFile}`);
    }

    console.log(`  📜 ${data.frameworkSpecs.length} framework specifications found`);
  }

  /**
   * Generate validation summary
   */
  private generateValidationSummary(result: ValidationResult): void {
    console.log('\n📊 Validation Summary:');
    console.log('═'.repeat(50));
    
    if (result.passed) {
      console.log('✅ Constitutional version consistency: PASSED');
    } else {
      console.log('❌ Constitutional version consistency: FAILED');
    }
    
    if (result.errors.length > 0) {
      console.log(`\n🚨 ${result.errors.length} Error(s):`);
      result.errors.forEach(error => console.log(`   • ${error}`));
    }
    
    if (result.warnings.length > 0) {
      console.log(`\n⚠️  ${result.warnings.length} Warning(s):`);
      result.warnings.forEach(warning => console.log(`   • ${warning}`));
    }
    
    result.summary = `Version consistency validation ${result.passed ? 'PASSED' : 'FAILED'} with ${result.errors.length} errors and ${result.warnings.length} warnings.`;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new VersionConsistencyValidator();
  
  validator.validateVersionConsistency()
    .then(result => {
      if (result.passed) {
        console.log('\n🎉 Constitutional compliance achieved! Version consistency validated.');
        process.exit(0);
      } else {
        console.log('\n💥 Constitutional violation detected! Version inconsistencies must be resolved.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Validation error:', error.message);
      process.exit(1);
    });
}

export { VersionConsistencyValidator };
