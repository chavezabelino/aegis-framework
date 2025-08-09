/**
 * @aegisFrameworkVersion: 2.4.0-alpha-dev
 * @intent: Real-time constitutional compliance enforcement for AI code generation
 * @context: Prevent constitutional drift by detecting violations during development
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface ConstitutionalViolation {
  type: 'blueprint-missing' | 'annotation-missing' | 'observability-missing' | 'security-pattern-violation';
  severity: 'critical' | 'high' | 'medium' | 'low';
  file?: string;
  line?: number;
  evidence: string;
  suggestedFix: string;
  constitutionalArticle: string;
  blockExecution: boolean;
}

interface CodeAnalysisPattern {
  pattern: RegExp;
  violationType: ConstitutionalViolation['type'];
  severity: ConstitutionalViolation['severity'];
  constitutionalArticle: string;
  description: string;
  suggestedFix: string;
  blockExecution: boolean;
}

export class RealtimeConstitutionalEnforcer {
  private projectRoot: string;
  private blueprintRegistry: Map<string, any> = new Map();

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.loadBlueprintRegistry();
  }

  /**
   * Load all available blueprints for validation
   */
  private async loadBlueprintRegistry(): Promise<void> {
    const blueprintFiles = await glob('patterns/**/blueprint.yaml', { 
      cwd: this.projectRoot 
    });

    for (const blueprintPath of blueprintFiles) {
      try {
        const content = fs.readFileSync(path.join(this.projectRoot, blueprintPath), 'utf8');
        const yaml = await import('yaml');
        const blueprint = yaml.parse(content);
        
        if (blueprint.id) {
          this.blueprintRegistry.set(blueprint.id, {
            ...blueprint,
            path: blueprintPath
          });
        }
      } catch (error) {
        console.warn(`Warning: Could not load blueprint ${blueprintPath}:`, error);
      }
    }
  }

  /**
   * Critical authentication code patterns that must reference blueprints
   */
  private getAuthenticationPatterns(): CodeAnalysisPattern[] {
    return [
      // Password handling patterns
      {
        pattern: /(?:bcrypt|argon2|scrypt|hash).*password|password.*(?:hash|verify)/i,
        violationType: 'blueprint-missing',
        severity: 'critical',
        constitutionalArticle: 'Article I, Section 2: Blueprint Primacy',
        description: 'Password handling code detected without blueprint reference',
        suggestedFix: 'Reference user-authentication blueprint and include @aegisBlueprint annotation',
        blockExecution: true
      },
      
      // Session management patterns
      {
        pattern: /(?:session|cookie|token).*(?:create|generate|validate|destroy)/i,
        violationType: 'blueprint-missing',
        severity: 'critical', 
        constitutionalArticle: 'Article I, Section 2: Blueprint Primacy',
        description: 'Session management code detected without blueprint reference',
        suggestedFix: 'Reference user-authentication blueprint for session patterns',
        blockExecution: true
      },
      
      // Database authentication queries
      {
        pattern: /db\.(?:query|select|insert|update).*(?:user|auth|login|session)/i,
        violationType: 'blueprint-missing',
        severity: 'high',
        constitutionalArticle: 'Article I, Section 2: Blueprint Primacy',
        description: 'Authentication database operations without blueprint validation',
        suggestedFix: 'Use validated database patterns from user-authentication blueprint',
        blockExecution: true
      },
      
      // Login/logout endpoints
      {
        pattern: /(?:POST|GET|DELETE).*\/(?:login|logout|register|auth)/i,
        violationType: 'blueprint-missing',
        severity: 'high',
        constitutionalArticle: 'Article I, Section 2: Blueprint Primacy',
        description: 'Authentication endpoints without blueprint compliance',
        suggestedFix: 'Implement authentication endpoints using user-authentication blueprint',
        blockExecution: true
      },
      
      // CSRF and security patterns
      {
        pattern: /csrf|xsrf|token.*verify|security.*check/i,
        violationType: 'security-pattern-violation',
        severity: 'high',
        constitutionalArticle: 'Article I, Section 4: Safety',
        description: 'Security patterns require constitutional compliance',
        suggestedFix: 'Implement security patterns from user-authentication blueprint',
        blockExecution: false
      }
    ];
  }

  /**
   * Check if code has required constitutional annotations
   */
  private hasConstitutionalAnnotations(content: string): boolean {
    const requiredAnnotations = [
      /@aegisBlueprint/,
      /@version/,
      /@intent/
    ];

    return requiredAnnotations.some(annotation => annotation.test(content));
  }

  /**
   * Check if code references a valid blueprint
   */
  private getReferencedBlueprint(content: string): string | null {
    const blueprintMatch = content.match(/@aegisBlueprint:\s*([^\s\n]+)/);
    if (!blueprintMatch) return null;

    const blueprintId = blueprintMatch[1];
    return this.blueprintRegistry.has(blueprintId) ? blueprintId : null;
  }

  /**
   * Check if authentication code has required observability
   */
  private hasRequiredObservability(content: string): boolean {
    const observabilityPatterns = [
      /log.*auth|auth.*log/i,
      /event.*auth|auth.*event/i,
      /telemetry|metric|trace/i,
      /console\.log.*auth/i
    ];

    return observabilityPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Analyze a single file for constitutional violations
   */
  async analyzeFile(filePath: string): Promise<ConstitutionalViolation[]> {
    const violations: ConstitutionalViolation[] = [];
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      const authPatterns = this.getAuthenticationPatterns();

      // Check for authentication patterns
      for (const pattern of authPatterns) {
        const matches = content.match(pattern.pattern);
        if (matches) {
          // Find line number for better reporting
          let lineNumber = 1;
          for (let i = 0; i < lines.length; i++) {
            if (pattern.pattern.test(lines[i])) {
              lineNumber = i + 1;
              break;
            }
          }

          // Check if this file has blueprint references
          const hasAnnotations = this.hasConstitutionalAnnotations(content);
          const referencedBlueprint = this.getReferencedBlueprint(content);
          const hasObservability = this.hasRequiredObservability(content);

          // Blueprint violation
          if (!hasAnnotations || !referencedBlueprint) {
            violations.push({
              type: pattern.violationType,
              severity: pattern.severity,
              file: filePath,
              line: lineNumber,
              evidence: `${pattern.description}: "${matches[0]}"`,
              suggestedFix: pattern.suggestedFix,
              constitutionalArticle: pattern.constitutionalArticle,
              blockExecution: pattern.blockExecution
            });
          }

          // Observability violation for authentication
          if (referencedBlueprint === 'user-authentication' && !hasObservability) {
            violations.push({
              type: 'observability-missing',
              severity: 'high',
              file: filePath,
              line: lineNumber,
              evidence: 'Authentication code missing required observability events',
              suggestedFix: 'Add authentication event logging per user-authentication blueprint',
              constitutionalArticle: 'Article I, Section 1: Observability',
              blockExecution: false
            });
          }
        }
      }

    } catch (error) {
      violations.push({
        type: 'blueprint-missing',
        severity: 'medium',
        file: filePath,
        evidence: `Could not analyze file: ${error instanceof Error ? error.message : String(error)}`,
        suggestedFix: 'Ensure file is readable and contains valid code',
        constitutionalArticle: 'Article I: Core Principles',
        blockExecution: false
      });
    }

    return violations;
  }

  /**
   * Analyze multiple files or directories
   */
  async analyzeCodebase(paths: string[] = ['src', 'lib', 'components', 'routes']): Promise<ConstitutionalViolation[]> {
    const allViolations: ConstitutionalViolation[] = [];

    for (const searchPath of paths) {
      const fullPath = path.join(this.projectRoot, searchPath);
      
      if (!fs.existsSync(fullPath)) {
        continue;
      }

      // Find relevant code files
      const codeFiles = await glob('**/*.{ts,tsx,js,jsx,svelte,vue}', {
        cwd: fullPath,
        ignore: ['node_modules/**', '*.test.*', '*.spec.*', 'dist/**', 'build/**']
      });

      for (const file of codeFiles) {
        const filePath = path.join(fullPath, file);
        const violations = await this.analyzeFile(filePath);
        allViolations.push(...violations);
      }
    }

    return allViolations;
  }

  /**
   * Real-time enforcement during development
   */
  async enforceConstitutionalCompliance(filePaths?: string[]): Promise<{
    violations: ConstitutionalViolation[];
    criticalViolations: ConstitutionalViolation[];
    shouldBlock: boolean;
  }> {
    console.log('🏛️ Running real-time constitutional compliance enforcement...\n');

    const violations = filePaths 
      ? await Promise.all(filePaths.map(path => this.analyzeFile(path))).then(results => results.flat())
      : await this.analyzeCodebase();

    const criticalViolations = violations.filter(v => v.blockExecution);
    const shouldBlock = criticalViolations.length > 0;

    // Report violations
    if (violations.length > 0) {
      console.log('📋 Constitutional Violations Detected:');
      console.log('=====================================\n');

      for (const violation of violations) {
        const icon = violation.severity === 'critical' ? '🚨' : 
                    violation.severity === 'high' ? '⚠️' : 
                    violation.severity === 'medium' ? '💡' : '📝';
        
        console.log(`${icon} [${violation.severity.toUpperCase()}] ${violation.type}`);
        console.log(`   File: ${violation.file}${violation.line ? `:${violation.line}` : ''}`);
        console.log(`   Evidence: ${violation.evidence}`);
        console.log(`   Authority: ${violation.constitutionalArticle}`);
        console.log(`   Fix: ${violation.suggestedFix}`);
        if (violation.blockExecution) {
          console.log('   🛑 BLOCKING: This violation prevents code generation');
        }
        console.log('');
      }

      if (shouldBlock) {
        console.log('🚫 CONSTITUTIONAL ENFORCEMENT: Critical violations detected!');
        console.log('Code generation/deployment blocked until violations are resolved.\n');
        
        console.log('📋 Required Actions:');
        criticalViolations.forEach((violation, index) => {
          console.log(`${index + 1}. ${violation.suggestedFix}`);
        });
      }
    } else {
      console.log('✅ No constitutional violations detected');
    }

    return {
      violations,
      criticalViolations, 
      shouldBlock
    };
  }

  /**
   * Generate enforcement report
   */
  generateReport(violations: ConstitutionalViolation[]): string {
    const report = {
      timestamp: new Date().toISOString(),
      totalViolations: violations.length,
      criticalViolations: violations.filter(v => v.severity === 'critical').length,
      highViolations: violations.filter(v => v.severity === 'high').length,
      blockingViolations: violations.filter(v => v.blockExecution).length,
      violations: violations.map(v => ({
        type: v.type,
        severity: v.severity,
        file: v.file,
        line: v.line,
        evidence: v.evidence,
        constitutionalArticle: v.constitutionalArticle,
        blockExecution: v.blockExecution
      }))
    };

    return JSON.stringify(report, null, 2);
  }
}

/**
 * CLI interface for real-time enforcement
 */
export async function enforceConstitutionalCompliance(
  filePaths?: string[],
  projectRoot?: string
): Promise<void> {
  const enforcer = new RealtimeConstitutionalEnforcer(projectRoot);
  const result = await enforcer.enforceConstitutionalCompliance(filePaths);
  
  // Save enforcement report
  const reportDir = path.join(projectRoot || process.cwd(), '.aegis', 'enforcement-reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const reportFile = path.join(reportDir, `enforcement-${Date.now()}.json`);
  fs.writeFileSync(reportFile, enforcer.generateReport(result.violations));
  
  if (result.shouldBlock) {
    process.exit(1);
  }
}

// CLI execution
if (require.main === module) {
  const filePaths = process.argv.slice(2);
  enforceConstitutionalCompliance(filePaths.length > 0 ? filePaths : undefined)
    .catch(error => {
      console.error('Constitutional enforcement error:', error);
      process.exit(1);
    });
}
