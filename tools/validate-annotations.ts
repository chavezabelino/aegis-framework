#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.4.0
 * @intent: Annotation validation with team configuration support
 * @context: Validate constitutional annotations across all framework files
 * @mode: strict
 */

import fs from 'fs';
import path from 'path';
import { TeamConfigLoader } from './team-config-loader.js';

interface AnnotationValidationResult {
  valid: boolean;
  coverage: number;
  violations: AnnotationViolation[];
  warnings: string[];
  recommendations: string[];
}

interface AnnotationViolation {
  file: string;
  line?: number;
  type: 'missing' | 'invalid' | 'incomplete';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  suggestion?: string;
}

interface FileAnnotation {
  file: string;
  hasAnnotations: boolean;
  annotationCount: number;
  requiredAnnotations: string[];
  missingAnnotations: string[];
  invalidAnnotations: string[];
}

class AnnotationValidator {
  private configLoader: TeamConfigLoader;
  private projectRoot: string;
  private violations: AnnotationViolation[] = [];
  private warnings: string[] = [];

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.configLoader = TeamConfigLoader.getInstance(projectRoot);
  }

  /**
   * Validate annotations across all framework files
   */
  async validateAll(): Promise<AnnotationValidationResult> {
    console.log('🔍 Validating Constitutional Annotations...\n');

    // Check if annotation requirements are enabled
    if (!this.configLoader.isRequiredFeatureEnabled('annotations')) {
      console.log('📋 Annotation requirements disabled in team configuration');
      return {
        valid: true,
        coverage: 1.0,
        violations: [],
        warnings: [],
        recommendations: [],
      };
    }

    const config = this.configLoader.loadConfig();
    const requiredCoverage = config?.required.annotations.coverage ?? 0.8;
    const enforcementLevel = this.configLoader.getAnnotationEnforcement();

    // Find all framework files
    const frameworkFiles = this.findFrameworkFiles();
    const annotationResults: FileAnnotation[] = [];

    // Validate each file
    for (const file of frameworkFiles) {
      const result = this.validateFileAnnotations(file);
      annotationResults.push(result);
    }

    // Calculate coverage
    const filesWithAnnotations = annotationResults.filter(r => r.hasAnnotations).length;
    const totalFiles = annotationResults.length;
    const coverage = totalFiles > 0 ? filesWithAnnotations / totalFiles : 1.0;

    // Generate result
    const result: AnnotationValidationResult = {
      valid: coverage >= requiredCoverage && this.violations.length === 0,
      coverage,
      violations: this.violations,
      warnings: this.warnings,
      recommendations: this.generateRecommendations(annotationResults, coverage, requiredCoverage),
    };

    this.printResults(result, enforcementLevel);
    return result;
  }

  /**
   * Validate annotations in a specific file
   */
  private validateFileAnnotations(filePath: string): FileAnnotation {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    const requiredAnnotations = ['@aegisFrameworkVersion', '@intent', '@context', '@mode'];

    const foundAnnotations: string[] = [];
    const missingAnnotations: string[] = [];
    const invalidAnnotations: string[] = [];

    // Check for annotations in file header
    const headerLines = lines.slice(0, 20); // Check first 20 lines
    for (const line of headerLines) {
      for (const annotation of requiredAnnotations) {
        if (line.includes(annotation)) {
          foundAnnotations.push(annotation);

          // Validate annotation format
          if (!this.isValidAnnotation(line, annotation)) {
            invalidAnnotations.push(`${annotation}: ${line.trim()}`);
          }
        }
      }
    }

    // Find missing annotations
    for (const annotation of requiredAnnotations) {
      if (!foundAnnotations.includes(annotation)) {
        missingAnnotations.push(annotation);
      }
    }

    // Add violations for missing annotations
    if (missingAnnotations.length > 0) {
      this.violations.push({
        file: path.relative(this.projectRoot, filePath),
        type: 'missing',
        severity: this.getSeverityForMissingAnnotations(missingAnnotations),
        message: `Missing required annotations: ${missingAnnotations.join(', ')}`,
        suggestion: `Add the following annotations to the file header:\n${missingAnnotations.map(a => `<!--\n${a}: value\n-->`).join('\n')}`,
      });
    }

    // Add violations for invalid annotations
    if (invalidAnnotations.length > 0) {
      this.violations.push({
        file: path.relative(this.projectRoot, filePath),
        type: 'invalid',
        severity: 'medium',
        message: `Invalid annotation format: ${invalidAnnotations.join(', ')}`,
        suggestion: 'Ensure annotations follow the format: @annotationName: value',
      });
    }

    return {
      file: path.relative(this.projectRoot, filePath),
      hasAnnotations: foundAnnotations.length >= 2, // At least 2 annotations required
      annotationCount: foundAnnotations.length,
      requiredAnnotations,
      missingAnnotations,
      invalidAnnotations,
    };
  }

  /**
   * Check if annotation format is valid
   */
  private isValidAnnotation(line: string, annotation: string): boolean {
    const trimmed = line.trim();

    // Check for HTML comment format
    if (trimmed.startsWith('<!--') || trimmed.startsWith('-->')) {
      return true;
    }

    // Check for direct annotation format
    if (trimmed.startsWith(annotation)) {
      const parts = trimmed.split(':');
      return parts.length >= 2 && parts[1].trim().length > 0;
    }

    return false;
  }

  /**
   * Determine severity for missing annotations
   */
  private getSeverityForMissingAnnotations(missing: string[]): 'critical' | 'high' | 'medium' | 'low' {
    if (missing.includes('@aegisFrameworkVersion')) {
      return 'critical';
    }
    if (missing.includes('@intent') || missing.includes('@context')) {
      return 'high';
    }
    if (missing.includes('@mode')) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Find all framework files that should have annotations
   */
  private findFrameworkFiles(): string[] {
    const frameworkDirs = ['framework', 'cli', 'tools', 'blueprints', 'adapters', 'tests', 'docs'];

    const extensions = ['.ts', '.js', '.md', '.yaml', '.yml', '.json'];
    const files: string[] = [];

    for (const dir of frameworkDirs) {
      const dirPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(dirPath)) {
        files.push(...this.getFilesRecursively(dirPath, extensions));
      }
    }

    // Also include root-level files
    const rootFiles = [
      'CONSTITUTION.md',
      'README.md',
      'CHANGELOG.md',
      'CONTRIBUTING.md',
      'package.json',
      'tsconfig.json',
      'VERSION',
    ];

    for (const file of rootFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        files.push(filePath);
      }
    }

    return files;
  }

  /**
   * Get files recursively from directory
   */
  private getFilesRecursively(dir: string, extensions: string[]): string[] {
    const files: string[] = [];

    try {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // Skip node_modules and .git
          if (item !== 'node_modules' && item !== '.git' && !item.startsWith('.')) {
            files.push(...this.getFilesRecursively(fullPath, extensions));
          }
        } else if (stat.isFile()) {
          const ext = path.extname(item);
          if (extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      this.warnings.push(`Failed to read directory ${dir}: ${error}`);
    }

    return files;
  }

  /**
   * Generate recommendations based on validation results
   */
  private generateRecommendations(results: FileAnnotation[], coverage: number, requiredCoverage: number): string[] {
    const recommendations: string[] = [];

    if (coverage < requiredCoverage) {
      const missingFiles = results.filter(r => !r.hasAnnotations);
      recommendations.push(
        `Coverage ${(coverage * 100).toFixed(1)}% is below required ${(requiredCoverage * 100).toFixed(1)}%`,
        `Add annotations to ${missingFiles.length} files to meet coverage requirements`
      );
    }

    const criticalViolations = this.violations.filter(v => v.severity === 'critical');
    if (criticalViolations.length > 0) {
      recommendations.push(
        `Fix ${criticalViolations.length} critical annotation violations`,
        'Critical violations include missing @aegisFrameworkVersion annotations'
      );
    }

    const highViolations = this.violations.filter(v => v.severity === 'high');
    if (highViolations.length > 0) {
      recommendations.push(
        `Fix ${highViolations.length} high-severity annotation violations`,
        'High-severity violations include missing @intent or @context annotations'
      );
    }

    if (recommendations.length === 0) {
      recommendations.push('All annotation requirements met');
    }

    return recommendations;
  }

  /**
   * Print validation results
   */
  private printResults(result: AnnotationValidationResult, enforcementLevel: string): void {
    console.log(`📊 Annotation Coverage: ${(result.coverage * 100).toFixed(1)}%`);
    console.log(`📋 Enforcement Level: ${enforcementLevel}`);
    console.log(`📄 Files Validated: ${result.violations.length + result.coverage * 100}`);

    if (result.violations.length > 0) {
      console.log('\n❌ Annotation Violations:');
      result.violations.forEach(v => {
        const severity = v.severity.toUpperCase();
        console.log(`   [${severity}] ${v.file}: ${v.message}`);
        if (v.suggestion) {
          console.log(`      💡 ${v.suggestion}`);
        }
      });
    }

    if (result.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      result.warnings.forEach(w => console.log(`   - ${w}`));
    }

    if (result.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      result.recommendations.forEach(r => console.log(`   - ${r}`));
    }

    if (result.valid) {
      console.log('\n✅ Annotation validation passed');
    } else {
      console.log('\n❌ Annotation validation failed');
      if (enforcementLevel === 'error') {
        console.log('🚨 Enforcement level: error - validation must pass');
      } else if (enforcementLevel === 'warning') {
        console.log('⚠️ Enforcement level: warning - issues should be addressed');
      } else {
        console.log('📋 Enforcement level: silent - issues noted but not enforced');
      }
    }
  }
}

// CLI interface
async function main(): Promise<void> {
  const validator = new AnnotationValidator();
  const result = await validator.validateAll();

  const enforcementLevel = validator['configLoader'].getAnnotationEnforcement();

  if (!result.valid && enforcementLevel === 'error') {
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] && process.argv[1].endsWith('validate-annotations.ts')) {
  main().catch(error => {
    console.error('Annotation validation error:', error);
    process.exit(1);
  });
}

export { AnnotationValidator };
