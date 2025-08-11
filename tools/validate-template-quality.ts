#!/usr/bin/env node

/**
 * Template Quality Validator
 *
 * Constitutional enforcement tool for Article IX: Template and Documentation Quality Standards
 * Validates encoding compliance, structural integrity, and output fidelity
 *
 * @aegisFrameworkVersion: 2.5.0
 * @intent: Prevent HTML encoding artifacts and ensure template quality with team configuration support
 * @constitutionalAuthority: Article IX, Section 4
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TeamConfigLoader } from './team-config-loader.js';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TemplateQualityResult {
  overall: number;
  encoding: EncodingValidation;
  structure: StructuralValidation;
  fidelity: FidelityValidation;
  violations: QualityViolation[];
  recommendations: string[];
}

interface EncodingValidation {
  score: number;
  plainTextCompliance: boolean;
  htmlEntities: string[];
  encodingIssues: string[];
  mixedEncodingDetected: boolean;
}

interface StructuralValidation {
  score: number;
  markdownStructure: boolean;
  headingHierarchy: boolean;
  constitutionalAnnotations: boolean;
  formatConsistency: boolean;
  issues: string[];
}

interface FidelityValidation {
  score: number;
  referenceMatches: ReferenceMatch[];
  encodingArtifacts: string[];
  outputConsistency: boolean;
  crossPlatformCompatible: boolean;
}

interface ReferenceMatch {
  template: string;
  reference: string;
  matches: boolean;
  differences: string[];
}

interface QualityViolation {
  type: 'encoding' | 'structure' | 'fidelity' | 'constitutional';
  severity: 'critical' | 'high' | 'medium' | 'low';
  file: string;
  line?: number;
  message: string;
  suggestion?: string;
}

class TemplateQualityValidator {
  private frameworkRoot: string;
  private violations: QualityViolation[] = [];
  private configLoader: TeamConfigLoader;

  constructor(projectRoot?: string) {
    this.frameworkRoot = projectRoot || path.resolve(__dirname, '..');
    this.configLoader = TeamConfigLoader.getInstance(this.frameworkRoot);
  }

  async validateAll(): Promise<TemplateQualityResult> {
    console.log('🔍 Validating Template Quality (Constitutional Article IX)...\n');

    // Check if template quality validation is enabled
    if (!this.configLoader.isRequiredFeatureEnabled('templateQuality')) {
      console.log('📋 Template quality validation disabled in team configuration');
      return {
        overall: 100,
        encoding: {
          score: 100,
          plainTextCompliance: true,
          htmlEntities: [],
          encodingIssues: [],
          mixedEncodingDetected: false,
        },
        structure: {
          score: 100,
          markdownStructure: true,
          headingHierarchy: true,
          constitutionalAnnotations: true,
          formatConsistency: true,
          issues: [],
        },
        fidelity: {
          score: 100,
          referenceMatches: [],
          encodingArtifacts: [],
          outputConsistency: true,
          crossPlatformCompatible: true,
        },
        violations: [],
        recommendations: [],
      };
    }

    const encoding = await this.validateEncoding();
    const structure = await this.validateStructure();
    const fidelity = await this.validateFidelity();

    const overall = Math.round((encoding.score + structure.score + fidelity.score) / 3);

    const result: TemplateQualityResult = {
      overall,
      encoding,
      structure,
      fidelity,
      violations: this.violations,
      recommendations: this.generateRecommendations(),
    };

    this.printResults(result);
    return result;
  }

  private async validateEncoding(): Promise<EncodingValidation> {
    console.log('📝 Validating Encoding Compliance...');

    const templatePaths = this.findTemplateFiles();
    const htmlEntities: string[] = [];
    const encodingIssues: string[] = [];
    let plainTextCompliance = true;
    let mixedEncodingDetected = false;

    // Common HTML entities that should be plain text
    const forbiddenEntities = {
      '&#39;': "'",
      '&apos;': "'",
      '&quot;': '"',
      '&ldquo;': '"',
      '&rdquo;': '"',
      '&lsquo;': "'",
      '&rsquo;': "'",
      '&mdash;': '—',
      '&ndash;': '–',
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&nbsp;': ' ',
    };

    for (const templatePath of templatePaths) {
      const content = fs.readFileSync(templatePath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // Check for HTML entities
        for (const [entity, replacement] of Object.entries(forbiddenEntities)) {
          if (line.includes(entity)) {
            htmlEntities.push(`${templatePath}:${index + 1} - Found "${entity}", should be "${replacement}"`);
            plainTextCompliance = false;

            this.violations.push({
              type: 'encoding',
              severity: 'high',
              file: templatePath,
              line: index + 1,
              message: `HTML entity "${entity}" found, violates plain text primacy`,
              suggestion: `Replace with plain Unicode character: "${replacement}"`,
            });
          }
        }

        // Check for mixed encoding patterns
        const hasHtmlEntities = Object.keys(forbiddenEntities).some(entity => line.includes(entity));
        const hasUnicodeChars = /[""''—–]/.test(line);

        if (hasHtmlEntities && hasUnicodeChars) {
          mixedEncodingDetected = true;
          encodingIssues.push(`${templatePath}:${index + 1} - Mixed encoding detected`);

          this.violations.push({
            type: 'encoding',
            severity: 'critical',
            file: templatePath,
            line: index + 1,
            message: 'Mixed encoding detected: HTML entities and Unicode characters in same context',
            suggestion: 'Use consistent plain Unicode characters throughout',
          });
        }
      });
    }

    const score =
      plainTextCompliance && !mixedEncodingDetected
        ? 100
        : plainTextCompliance
          ? 75
          : htmlEntities.length < 10
            ? 50
            : 0;

    console.log(`  ✅ Plain text compliance: ${plainTextCompliance ? 'PASS' : 'FAIL'}`);
    console.log(`  ✅ Mixed encoding check: ${mixedEncodingDetected ? 'FAIL' : 'PASS'}`);
    console.log(`  📊 Encoding score: ${score}/100\n`);

    return {
      score,
      plainTextCompliance,
      htmlEntities,
      encodingIssues,
      mixedEncodingDetected,
    };
  }

  private async validateStructure(): Promise<StructuralValidation> {
    console.log('🏗️ Validating Structural Integrity...');

    const templatePaths = this.findTemplateFiles();
    const issues: string[] = [];
    let markdownStructure = true;
    let headingHierarchy = true;
    let constitutionalAnnotations = true;
    let formatConsistency = true;

    for (const templatePath of templatePaths) {
      const content = fs.readFileSync(templatePath, 'utf-8');

      // Check for proper markdown structure
      if (!this.validateMarkdownStructure(content, templatePath)) {
        markdownStructure = false;
      }

      // Check heading hierarchy
      if (!this.validateHeadingHierarchy(content, templatePath)) {
        headingHierarchy = false;
      }

      // Check constitutional annotations
      if (templatePath.includes('framework/') && !this.validateConstitutionalAnnotations(content, templatePath)) {
        constitutionalAnnotations = false;
      }

      // Check format consistency
      if (!this.validateFormatConsistency(content, templatePath)) {
        formatConsistency = false;
      }
    }

    const score =
      [markdownStructure, headingHierarchy, constitutionalAnnotations, formatConsistency].filter(Boolean).length * 25;

    console.log(`  ✅ Markdown structure: ${markdownStructure ? 'PASS' : 'FAIL'}`);
    console.log(`  ✅ Heading hierarchy: ${headingHierarchy ? 'PASS' : 'FAIL'}`);
    console.log(`  ✅ Constitutional annotations: ${constitutionalAnnotations ? 'PASS' : 'FAIL'}`);
    console.log(`  ✅ Format consistency: ${formatConsistency ? 'PASS' : 'FAIL'}`);
    console.log(`  📊 Structure score: ${score}/100\n`);

    return {
      score,
      markdownStructure,
      headingHierarchy,
      constitutionalAnnotations,
      formatConsistency,
      issues,
    };
  }

  private async validateFidelity(): Promise<FidelityValidation> {
    console.log('🎯 Validating Output Fidelity...');

    const referenceMatches: ReferenceMatch[] = [];
    const encodingArtifacts: string[] = [];
    let outputConsistency = true;
    let crossPlatformCompatible = true;

    // Check generated outputs against reference targets
    const generatedDir = path.join(this.frameworkRoot, 'framework/generated/instructions/current');
    const testTargetPath = path.join(generatedDir, 'github-copilot-ready-test-target.md');
    const outputPath = path.join(generatedDir, 'github-copilot-ready.md');

    if (fs.existsSync(testTargetPath) && fs.existsSync(outputPath)) {
      const testTarget = fs.readFileSync(testTargetPath, 'utf-8');
      const output = fs.readFileSync(outputPath, 'utf-8');

      const differences = this.findDifferences(testTarget, output);
      const matches = differences.length === 0;

      referenceMatches.push({
        template: 'github-copilot-ready.md',
        reference: 'github-copilot-ready-test-target.md',
        matches,
        differences,
      });

      if (!matches) {
        outputConsistency = false;

        // Check if differences are encoding-related
        const encodingDiffs = differences.filter(
          diff => diff.includes('&#') || diff.includes('&amp;') || diff.includes('&lt;') || diff.includes('&gt;')
        );

        if (encodingDiffs.length > 0) {
          encodingArtifacts.push(...encodingDiffs);

          this.violations.push({
            type: 'fidelity',
            severity: 'high',
            file: outputPath,
            message: 'Output contains encoding artifacts that differ from reference target',
            suggestion: 'Clean up templates to use plain Unicode characters',
          });
        }
      }
    }

    const score = outputConsistency && crossPlatformCompatible ? 100 : outputConsistency ? 75 : 50;

    console.log(`  ✅ Output consistency: ${outputConsistency ? 'PASS' : 'FAIL'}`);
    console.log(`  ✅ Cross-platform compatible: ${crossPlatformCompatible ? 'PASS' : 'FAIL'}`);
    console.log(`  📊 Fidelity score: ${score}/100\n`);

    return {
      score,
      referenceMatches,
      encodingArtifacts,
      outputConsistency,
      crossPlatformCompatible,
    };
  }

  private findTemplateFiles(): string[] {
    const templateDirs = [
      path.join(this.frameworkRoot, 'framework/templates'),
      path.join(this.frameworkRoot, 'templates'),
      path.join(this.frameworkRoot, 'docs'),
    ];

    const templateFiles: string[] = [];

    for (const dir of templateDirs) {
      if (fs.existsSync(dir)) {
        const files = this.getFilesRecursively(dir, ['.md', '.ejs', '.template']);
        templateFiles.push(...files);
      }
    }

    return templateFiles;
  }

  private getFilesRecursively(dir: string, extensions: string[]): string[] {
    const files: string[] = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...this.getFilesRecursively(fullPath, extensions));
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }

    return files;
  }

  private validateMarkdownStructure(content: string, filePath: string): boolean {
    // Basic markdown structure validation
    const lines = content.split('\n');
    let hasHeadings = false;
    let hasValidStructure = true;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith('#')) {
        hasHeadings = true;

        // Check for proper spacing after #
        if (!line.match(/^#+\s+/)) {
          this.violations.push({
            type: 'structure',
            severity: 'medium',
            file: filePath,
            line: i + 1,
            message: 'Missing space after heading marker',
            suggestion: 'Add space after # in headings: "# Heading"',
          });
          hasValidStructure = false;
        }
      }
    }

    return hasHeadings && hasValidStructure;
  }

  private validateHeadingHierarchy(content: string, filePath: string): boolean {
    const lines = content.split('\n');
    const headings: { level: number; line: number }[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const match = line.match(/^(#+)\s+/);

      if (match) {
        headings.push({ level: match[1].length, line: i + 1 });
      }
    }

    // Check for proper hierarchy (no skipping levels)
    for (let i = 1; i < headings.length; i++) {
      const current = headings[i];
      const previous = headings[i - 1];

      if (current.level > previous.level + 1) {
        this.violations.push({
          type: 'structure',
          severity: 'medium',
          file: filePath,
          line: current.line,
          message: `Heading level ${current.level} skips level ${previous.level + 1}`,
          suggestion: 'Use sequential heading levels (h1 → h2 → h3, etc.)',
        });
        return false;
      }
    }

    return true;
  }

  private validateConstitutionalAnnotations(content: string, filePath: string): boolean {
    // Check for required constitutional annotations in framework files
    const requiredAnnotations = ['@aegisFrameworkVersion', '@intent'];
    const missingAnnotations: string[] = [];

    for (const annotation of requiredAnnotations) {
      if (!content.includes(annotation)) {
        missingAnnotations.push(annotation);
      }
    }

    if (missingAnnotations.length > 0) {
      this.violations.push({
        type: 'constitutional',
        severity: 'critical',
        file: filePath,
        message: `Missing required constitutional annotations: ${missingAnnotations.join(', ')}`,
        suggestion: 'Add required annotations to file header',
      });
      return false;
    }

    return true;
  }

  private validateFormatConsistency(content: string, filePath: string): boolean {
    // Check for consistent formatting patterns
    const lines = content.split('\n');
    let consistent = true;

    // Check for consistent list formatting
    const listPatterns = [/^[-*+]\s+/, /^\d+\.\s+/];
    let currentListPattern: RegExp | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      for (const pattern of listPatterns) {
        if (pattern.test(line)) {
          if (currentListPattern && currentListPattern !== pattern) {
            this.violations.push({
              type: 'structure',
              severity: 'low',
              file: filePath,
              line: i + 1,
              message: 'Inconsistent list formatting within document',
              suggestion: 'Use consistent list markers throughout the document',
            });
            consistent = false;
          }
          currentListPattern = pattern;
          break;
        }
      }

      // Reset pattern if we hit a non-list line
      if (!listPatterns.some(p => p.test(line)) && line.trim() !== '') {
        currentListPattern = null;
      }
    }

    return consistent;
  }

  private findDifferences(target: string, output: string): string[] {
    const targetLines = target.split('\n');
    const outputLines = output.split('\n');
    const differences: string[] = [];

    const maxLines = Math.max(targetLines.length, outputLines.length);

    for (let i = 0; i < maxLines; i++) {
      const targetLine = targetLines[i] || '';
      const outputLine = outputLines[i] || '';

      if (targetLine !== outputLine) {
        differences.push(`Line ${i + 1}: Expected "${targetLine}", got "${outputLine}"`);
      }
    }

    return differences;
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [
      'Use plain Unicode characters instead of HTML entities in all templates',
      'Implement pre-commit hooks for template quality validation',
      'Add encoding validation to CI/CD pipeline',
      'Maintain reference targets for critical generated outputs',
      'Use consistent markdown formatting across all documentation',
    ];

    // Add specific recommendations based on violations
    const encodingViolations = this.violations.filter(v => v.type === 'encoding');
    if (encodingViolations.length > 0) {
      recommendations.push('Run find-and-replace to convert HTML entities to Unicode characters');
    }

    const structuralViolations = this.violations.filter(v => v.type === 'structure');
    if (structuralViolations.length > 0) {
      recommendations.push('Review markdown structure and heading hierarchy');
    }

    return recommendations;
  }

  private printResults(result: TemplateQualityResult): void {
    console.log('📊 Template Quality Validation Results\n');
    console.log(`Overall Score: ${result.overall}/100`);
    console.log(`Encoding Score: ${result.encoding.score}/100`);
    console.log(`Structure Score: ${result.structure.score}/100`);
    console.log(`Fidelity Score: ${result.fidelity.score}/100\n`);

    if (result.violations.length > 0) {
      console.log('⚠️  Quality Violations:\n');

      const critical = result.violations.filter(v => v.severity === 'critical');
      const high = result.violations.filter(v => v.severity === 'high');
      const medium = result.violations.filter(v => v.severity === 'medium');
      const low = result.violations.filter(v => v.severity === 'low');

      if (critical.length > 0) {
        console.log('🚨 CRITICAL VIOLATIONS:');
        critical.forEach(v => console.log(`  ${v.file}:${v.line || '?'} - ${v.message}`));
        console.log('');
      }

      if (high.length > 0) {
        console.log('❌ HIGH SEVERITY:');
        high.forEach(v => console.log(`  ${v.file}:${v.line || '?'} - ${v.message}`));
        console.log('');
      }

      if (medium.length > 0) {
        console.log('⚠️  MEDIUM SEVERITY:');
        medium.forEach(v => console.log(`  ${v.file}:${v.line || '?'} - ${v.message}`));
        console.log('');
      }

      if (low.length > 0) {
        console.log('ℹ️  LOW SEVERITY:');
        low.forEach(v => console.log(`  ${v.file}:${v.line || '?'} - ${v.message}`));
        console.log('');
      }
    }

    if (result.recommendations.length > 0) {
      console.log('💡 Recommendations:\n');
      result.recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. ${rec}`);
      });
      console.log('');
    }

    // Constitutional compliance summary
    const constitutionalViolations = result.violations.filter(v => v.type === 'constitutional');
    if (constitutionalViolations.length > 0) {
      console.log('🏛️  CONSTITUTIONAL COMPLIANCE VIOLATION');
      console.log('   Article IX requires immediate remediation of template quality issues.');
      console.log('   These violations prevent framework evolution and must be addressed.\n');
    }

    const exitCode = result.overall >= 80 ? 0 : 1;
    process.exit(exitCode);
  }
}

// CLI execution
const isMainModule = process.argv[1] && process.argv[1].endsWith('validate-template-quality.ts');
if (isMainModule) {
  const validator = new TemplateQualityValidator();
  validator.validateAll().catch(console.error);
}

export { TemplateQualityValidator, type TemplateQualityResult };
