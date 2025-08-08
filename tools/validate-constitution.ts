#!/usr/bin/env node

/**
 * Constitutional Validator
 * 
 * Validates framework structure and constitutional compliance
 * Integrates with the Constitutional Conductor for comprehensive governance
 */

import fs from "fs";
import path from "path";
import yaml from "js-yaml";

interface ConstitutionalValidationResult {
  overall: number;
  structure: StructureValidation;
  annotations: AnnotationValidation;
  versioning: VersionValidation;
  blueprints: BlueprintValidation;
  violations: ConstitutionalViolation[];
  recommendations: string[];
}

interface StructureValidation {
  score: number;
  requiredDirectories: DirectoryCheck[];
  requiredFiles: FileCheck[];
  issues: string[];
}

interface AnnotationValidation {
  score: number;
  frameworkFiles: AnnotationCheck[];
  blueprintFiles: AnnotationCheck[];
  generatedFiles: AnnotationCheck[];
  missingAnnotations: string[];
}

interface VersionValidation {
  score: number;
  versionConsistency: boolean;
  currentVersion: string;
  references: VersionReference[];
  inconsistencies: string[];
}

interface BlueprintValidation {
  score: number;
  blueprints: BlueprintCheck[];
  schemaIssues: string[];
  missingFields: { [blueprint: string]: string[] };
}

interface DirectoryCheck {
  path: string;
  exists: boolean;
  required: boolean;
}

interface FileCheck {
  path: string;
  exists: boolean;
  required: boolean;
  hasCorrectAnnotations?: boolean;
}

interface AnnotationCheck {
  file: string;
  hasAnnotations: boolean;
  requiredAnnotations: string[];
  missingAnnotations: string[];
  validFormat: boolean;
}

interface VersionReference {
  file: string;
  version: string;
  consistent: boolean;
}

interface BlueprintCheck {
  file: string;
  valid: boolean;
  hasRequiredFields: boolean;
  schemaCompliant: boolean;
  issues: string[];
}

interface ConstitutionalViolation {
  id: string;
  type: 'structure' | 'annotation' | 'versioning' | 'blueprint';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  file?: string;
  autoCorrectible: boolean;
  recommendation: string;
}

class ConstitutionalValidator {
  private frameworkRoot: string;
  private currentVersion: string;

  constructor(frameworkRoot: string = process.cwd()) {
    this.frameworkRoot = frameworkRoot;
    this.currentVersion = this.loadCurrentVersion();
  }

  async validateAll(): Promise<ConstitutionalValidationResult> {
    console.log("🏛️ Running comprehensive constitutional validation...");

    const structure = await this.validateStructure();
    const annotations = await this.validateAnnotations();
    const versioning = await this.validateVersioning();
    const blueprints = await this.validateBlueprints();

    const violations = this.collectViolations(structure, annotations, versioning, blueprints);
    const recommendations = this.generateRecommendations(violations);
    const overall = this.calculateOverallScore(structure, annotations, versioning, blueprints);

    return {
      overall,
      structure,
      annotations,
      versioning,
      blueprints,
      violations,
      recommendations
    };
  }

  private async validateStructure(): Promise<StructureValidation> {
    console.log("  📁 Validating framework structure...");

    const requiredDirectories = [
      { path: 'framework', required: true },
      { path: 'framework/versions', required: true },
      { path: 'framework/drift-log', required: true },
      { path: 'blueprints', required: true },
      { path: 'tools', required: true },
      { path: 'cli', required: true },
      { path: '.framework', required: true },
      { path: 'docs', required: true },
      { path: 'docs/roadmap', required: true }
    ].map(dir => ({
      ...dir,
      exists: fs.existsSync(path.join(this.frameworkRoot, dir.path))
    }));

    const requiredFiles = [
      { path: 'VERSION', required: true },
      { path: 'CONSTITUTION.md', required: true },
      { path: 'CHANGELOG.md', required: true },
      { path: 'README.md', required: true },
      { path: `.framework/constitutional-state.json`, required: true },
      { path: `.framework/enforcement-config.yaml`, required: true },
      { path: `framework/framework-core-v${this.currentVersion}.md`, required: true },
      { path: 'cli/aegis-conductor.ts', required: true }
    ].map(file => {
      const exists = fs.existsSync(path.join(this.frameworkRoot, file.path));
      return {
        ...file,
        exists,
        hasCorrectAnnotations: exists ? this.checkFileAnnotations(file.path) : false
      };
    });

    const issues = [
      ...requiredDirectories.filter(dir => dir.required && !dir.exists).map(dir => `Missing required directory: ${dir.path}`),
      ...requiredFiles.filter(file => file.required && !file.exists).map(file => `Missing required file: ${file.path}`)
    ];

    const score = this.calculateStructureScore(requiredDirectories, requiredFiles);

    return {
      score,
      requiredDirectories,
      requiredFiles,
      issues
    };
  }

  private async validateAnnotations(): Promise<AnnotationValidation> {
    console.log("  📝 Validating constitutional annotations...");

    const frameworkFiles = await this.checkFrameworkFileAnnotations();
    const blueprintFiles = await this.checkBlueprintFileAnnotations();
    const generatedFiles = await this.checkGeneratedFileAnnotations();

    const missingAnnotations = [
      ...frameworkFiles.filter(f => !f.hasAnnotations).map(f => f.file),
      ...blueprintFiles.filter(f => !f.hasAnnotations).map(f => f.file),
      ...generatedFiles.filter(f => !f.hasAnnotations).map(f => f.file)
    ];

    const totalFiles = frameworkFiles.length + blueprintFiles.length + generatedFiles.length;
    const annotatedFiles = totalFiles - missingAnnotations.length;
    const score = totalFiles > 0 ? annotatedFiles / totalFiles : 1;

    return {
      score,
      frameworkFiles,
      blueprintFiles,
      generatedFiles,
      missingAnnotations
    };
  }

  private async validateVersioning(): Promise<VersionValidation> {
    console.log("  🔢 Validating version consistency...");

    const references = await this.findAllVersionReferences();
    const inconsistencies = references
      .filter(ref => ref.version !== this.currentVersion)
      .map(ref => `${ref.file}: found ${ref.version}, expected ${this.currentVersion}`);

    const versionConsistency = inconsistencies.length === 0;
    const score = versionConsistency ? 1 : Math.max(0, 1 - (inconsistencies.length / references.length));

    return {
      score,
      versionConsistency,
      currentVersion: this.currentVersion,
      references,
      inconsistencies
    };
  }

  private async validateBlueprints(): Promise<BlueprintValidation> {
    console.log("  📋 Validating blueprint compliance...");

    const blueprintFiles = await this.findBlueprintFiles();
    const blueprints = await Promise.all(
      blueprintFiles.map(file => this.validateBlueprintFile(file))
    );

    const schemaIssues = blueprints
      .filter(bp => !bp.schemaCompliant)
      .map(bp => `${bp.file}: schema compliance issues`)
      .concat(
        blueprints
          .filter(bp => !bp.hasRequiredFields)
          .map(bp => `${bp.file}: missing required fields`)
      );

    const missingFields: { [blueprint: string]: string[] } = {};
    blueprints.forEach(bp => {
      if (bp.issues.length > 0) {
        missingFields[bp.file] = bp.issues;
      }
    });

    const validBlueprints = blueprints.filter(bp => bp.valid).length;
    const score = blueprints.length > 0 ? validBlueprints / blueprints.length : 1;

    return {
      score,
      blueprints,
      schemaIssues,
      missingFields
    };
  }

  private loadCurrentVersion(): string {
    try {
      const versionPath = path.join(this.frameworkRoot, 'VERSION');
      if (fs.existsSync(versionPath)) {
        return fs.readFileSync(versionPath, 'utf8').trim();
      }
    } catch (error) {
      console.warn("⚠️ Could not load VERSION file, using default");
    }
    return "1.0.0-alpha";
  }

  private checkFileAnnotations(filePath: string): boolean {
    try {
      const fullPath = path.join(this.frameworkRoot, filePath);
      if (!fs.existsSync(fullPath)) return false;

      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Check for constitutional annotations
      if (filePath.startsWith('framework/')) {
        return content.includes('@aegisFrameworkVersion');
      }
      
      if (filePath.includes('blueprint')) {
        return content.includes('@aegisBlueprint');
      }

      return true; // Other files don't require specific annotations
    } catch (error) {
      return false;
    }
  }

  private async checkFrameworkFileAnnotations(): Promise<AnnotationCheck[]> {
    const frameworkFiles = [
      'framework/framework-core-v2.1.0.md',
      'CONSTITUTION.md'
    ];

    return frameworkFiles.map(file => this.checkAnnotationInFile(file, ['@aegisFrameworkVersion']));
  }

  private async checkBlueprintFileAnnotations(): Promise<AnnotationCheck[]> {
    const blueprintFiles = await this.findBlueprintFiles();
    return blueprintFiles.map(file => this.checkAnnotationInFile(file, ['@aegisBlueprint']));
  }

  private async checkGeneratedFileAnnotations(): Promise<AnnotationCheck[]> {
    // This would scan for AI-generated files and check for proper annotations
    // Simplified implementation for now
    return [];
  }

  private checkAnnotationInFile(filePath: string, requiredAnnotations: string[]): AnnotationCheck {
    try {
      const fullPath = path.join(this.frameworkRoot, filePath);
      if (!fs.existsSync(fullPath)) {
        return {
          file: filePath,
          hasAnnotations: false,
          requiredAnnotations,
          missingAnnotations: requiredAnnotations,
          validFormat: false
        };
      }

      const content = fs.readFileSync(fullPath, 'utf8');
      const missingAnnotations = requiredAnnotations.filter(annotation => 
        !content.includes(annotation)
      );

      return {
        file: filePath,
        hasAnnotations: missingAnnotations.length === 0,
        requiredAnnotations,
        missingAnnotations,
        validFormat: content.includes('<!--') && content.includes('-->')
      };
    } catch (error) {
      return {
        file: filePath,
        hasAnnotations: false,
        requiredAnnotations,
        missingAnnotations: requiredAnnotations,
        validFormat: false
      };
    }
  }

  private async findAllVersionReferences(): Promise<VersionReference[]> {
    const files = [
      'VERSION',
      'README.md',
      'CHANGELOG.md',
      'framework/framework-core-v2.1.0.md',
      '.github/copilot-instructions.md'
    ];

    return files.map(file => {
      const version = this.extractVersionFromFile(file);
      const consistent = this.isVersionConsistent(file, version);
      return {
        file,
        version: version || 'unknown',
        consistent
      };
    });
  }

  private isVersionConsistent(filePath: string, version: string | null): boolean {
    // VERSION file should always match current version
    if (filePath === 'VERSION') {
      return version === this.currentVersion;
    }

    // README.md should reflect current version
    if (filePath === 'README.md') {
      return version === this.currentVersion;
    }

    // CHANGELOG.md can contain historical versions - check if current version is present
    if (filePath === 'CHANGELOG.md') {
      return version === this.currentVersion || this.hasCurrentVersionInChangelog();
    }

    // Framework core spec filename contains version - this is expected
    if (filePath === 'framework/framework-core-v2.1.0.md') {
      return version === this.currentVersion; // Should match current version
    }

    // Copilot instructions can reference framework specs - check if current version is mentioned
    if (filePath === '.github/copilot-instructions.md') {
      return this.hasCurrentVersionInCopilotInstructions();
    }

    return version === this.currentVersion;
  }

  private hasCurrentVersionInChangelog(): boolean {
    try {
      const changelogPath = path.join(this.frameworkRoot, 'CHANGELOG.md');
      const content = fs.readFileSync(changelogPath, 'utf8');
      return content.includes(`[${this.currentVersion}]`);
    } catch (error) {
      return false;
    }
  }

  private hasCurrentVersionInCopilotInstructions(): boolean {
    try {
      const instructionsPath = path.join(this.frameworkRoot, '.github/copilot-instructions.md');
      const content = fs.readFileSync(instructionsPath, 'utf8');
      return content.includes(this.currentVersion);
    } catch (error) {
      return false;
    }
  }

  private extractVersionFromFile(filePath: string): string | null {
    try {
      const fullPath = path.join(this.frameworkRoot, filePath);
      if (!fs.existsSync(fullPath)) return null;

      const content = fs.readFileSync(fullPath, 'utf8');
      
      if (filePath === 'VERSION') {
        return content.trim();
      }

      // For CHANGELOG.md, look for the most recent version entry
      if (filePath === 'CHANGELOG.md') {
        const changelogMatch = content.match(/## \[(\d+\.\d+\.\d+(?:-[a-zA-Z0-9]+)?)\]/);
        return changelogMatch ? changelogMatch[1] : null;
      }

      // For other files, look for version patterns but be more specific
      if (filePath === 'README.md') {
        // Look for version in badges or headers
        const versionMatch = content.match(/v(\d+\.\d+\.\d+(?:-[a-zA-Z0-9]+)?)/);
        return versionMatch ? versionMatch[1] : null;
      }

      // For framework core spec, extract from filename
      if (filePath === 'framework/framework-core-v2.0.1.md') {
        const filenameMatch = filePath.match(/v(\d+\.\d+\.\d+(?:-[a-zA-Z0-9]+)?)/);
        return filenameMatch ? filenameMatch[1] : null;
      }

      // For copilot instructions, look for framework version references
      if (filePath === '.github/copilot-instructions.md') {
        const versionMatch = content.match(/v(\d+\.\d+\.\d+(?:-[a-zA-Z0-9]+)?)/);
        return versionMatch ? versionMatch[1] : null;
      }

      // Default: look for version patterns in other files
      const versionMatch = content.match(/(\d+\.\d+\.\d+(?:-[a-zA-Z0-9]+)?)/);
      return versionMatch ? versionMatch[1] : null;
    } catch (error) {
      return null;
    }
  }

  private async findBlueprintFiles(): Promise<string[]> {
    const blueprintsDir = path.join(this.frameworkRoot, 'blueprints');
    if (!fs.existsSync(blueprintsDir)) return [];

    const blueprintFiles: string[] = [];
    const directories = fs.readdirSync(blueprintsDir);

    for (const dir of directories) {
      const blueprintPath = path.join('blueprints', dir, 'blueprint.yaml');
      if (fs.existsSync(path.join(this.frameworkRoot, blueprintPath))) {
        blueprintFiles.push(blueprintPath);
      }
    }

    return blueprintFiles;
  }

  private async validateBlueprintFile(filePath: string): Promise<BlueprintCheck> {
    try {
      const fullPath = path.join(this.frameworkRoot, filePath);
      const content = fs.readFileSync(fullPath, 'utf8');
      const blueprint = yaml.load(content) as any;

      const requiredFields = ['id', 'name', 'version'];
      const missingFields = requiredFields.filter(field => !blueprint[field]);
      
      const hasRequiredFields = missingFields.length === 0;
      const schemaCompliant = this.validateBlueprintSchema(blueprint);
      const valid = hasRequiredFields && schemaCompliant;

      return {
        file: filePath,
        valid,
        hasRequiredFields,
        schemaCompliant,
        issues: missingFields
      };
    } catch (error) {
      return {
        file: filePath,
        valid: false,
        hasRequiredFields: false,
        schemaCompliant: false,
        issues: ['Parse error or file not found']
      };
    }
  }

  private validateBlueprintSchema(blueprint: any): boolean {
    // Basic schema validation - would be more comprehensive in full implementation
    return typeof blueprint === 'object' && blueprint !== null;
  }

  private calculateStructureScore(directories: DirectoryCheck[], files: FileCheck[]): number {
    const totalRequired = directories.filter(d => d.required).length + files.filter(f => f.required).length;
    const existingRequired = directories.filter(d => d.required && d.exists).length + files.filter(f => f.required && f.exists).length;
    
    return totalRequired > 0 ? existingRequired / totalRequired : 1;
  }

  private collectViolations(
    structure: StructureValidation,
    annotations: AnnotationValidation,
    versioning: VersionValidation,
    blueprints: BlueprintValidation
  ): ConstitutionalViolation[] {
    const violations: ConstitutionalViolation[] = [];

    // Structure violations
    structure.issues.forEach((issue, index) => {
      violations.push({
        id: `struct-${index}`,
        type: 'structure',
        severity: 'high',
        description: issue,
        autoCorrectible: true,
        recommendation: 'Run aegis-conductor init to create missing structure'
      });
    });

    // Annotation violations
    annotations.missingAnnotations.forEach((file, index) => {
      violations.push({
        id: `annot-${index}`,
        type: 'annotation',
        severity: 'medium',
        description: `Missing constitutional annotations in ${file}`,
        file,
        autoCorrectible: true,
        recommendation: 'Add required @aegisBlueprint or @aegisFrameworkVersion annotations'
      });
    });

    // Version violations
    versioning.inconsistencies.forEach((issue, index) => {
      violations.push({
        id: `version-${index}`,
        type: 'versioning',
        severity: 'high',
        description: issue,
        autoCorrectible: true,
        recommendation: 'Update version references to match current version'
      });
    });

    // Blueprint violations
    Object.entries(blueprints.missingFields).forEach(([file, issues], index) => {
      violations.push({
        id: `blueprint-${index}`,
        type: 'blueprint',
        severity: 'medium',
        description: `Blueprint issues in ${file}: ${issues.join(', ')}`,
        file,
        autoCorrectible: false,
        recommendation: 'Review and update blueprint schema compliance'
      });
    });

    return violations;
  }

  private generateRecommendations(violations: ConstitutionalViolation[]): string[] {
    const recommendations = new Set<string>();

    violations.forEach(violation => {
      recommendations.add(violation.recommendation);
    });

    if (violations.some(v => v.autoCorrectible)) {
      recommendations.add('Run "aegis-conductor enforce --auto-fix" to apply automatic corrections');
    }

    if (violations.some(v => !v.autoCorrectible)) {
      recommendations.add('Manual review required for non-auto-correctable violations');
    }

    return Array.from(recommendations);
  }

  private calculateOverallScore(
    structure: StructureValidation,
    annotations: AnnotationValidation,
    versioning: VersionValidation,
    blueprints: BlueprintValidation
  ): number {
    const weights = {
      structure: 0.3,
      annotations: 0.25,
      versioning: 0.25,
      blueprints: 0.2
    };

    return (
      structure.score * weights.structure +
      annotations.score * weights.annotations +
      versioning.score * weights.versioning +
      blueprints.score * weights.blueprints
    );
  }

  displayResults(results: ConstitutionalValidationResult): void {
    console.log("\n🏛️ Constitutional Validation Report");
    console.log("====================================");
    console.log(`Overall Compliance: ${(results.overall * 100).toFixed(1)}%`);
    console.log("");

    console.log("📁 Structure Compliance:", `${(results.structure.score * 100).toFixed(1)}%`);
    if (results.structure.issues.length > 0) {
      results.structure.issues.forEach(issue => console.log(`  ⚠️ ${issue}`));
    }

    console.log("📝 Annotation Compliance:", `${(results.annotations.score * 100).toFixed(1)}%`);
    if (results.annotations.missingAnnotations.length > 0) {
      console.log(`  ⚠️ ${results.annotations.missingAnnotations.length} files missing annotations`);
    }

    console.log("🔢 Version Consistency:", `${(results.versioning.score * 100).toFixed(1)}%`);
    if (results.versioning.inconsistencies.length > 0) {
      results.versioning.inconsistencies.forEach(issue => console.log(`  ⚠️ ${issue}`));
    }

    console.log("📋 Blueprint Compliance:", `${(results.blueprints.score * 100).toFixed(1)}%`);
    if (results.blueprints.schemaIssues.length > 0) {
      results.blueprints.schemaIssues.forEach(issue => console.log(`  ⚠️ ${issue}`));
    }

    if (results.violations.length > 0) {
      console.log(`\n⚠️ ${results.violations.length} constitutional violations detected`);
      console.log("\nRecommendations:");
      results.recommendations.forEach(rec => console.log(`  💡 ${rec}`));
    } else {
      console.log("\n✅ Framework is fully constitutionally compliant!");
    }
  }
}

// CLI usage
async function main() {
  const validator = new ConstitutionalValidator();
  const results = await validator.validateAll();
  validator.displayResults(results);

  // Exit with appropriate code
  process.exit(results.overall >= 0.9 ? 0 : 1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { ConstitutionalValidator };
