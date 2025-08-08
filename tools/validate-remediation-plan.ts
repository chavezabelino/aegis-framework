/**
 * @aegisFrameworkVersion 2.4.0-alpha-dev
 * @intent Validate remediation plans against constitutional requirements
 * @context Prevents deployment of incomplete or unsafe remediation strategies
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { RemediationPlanSchema, validateRemediationPlan, ConstitutionalViolationError } from '../framework/contracts/RemediationPlan.schema.js';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  constitutionalViolations: string[];
  suggestions: string[];
  score: number;
}

interface ToolManifest {
  tools: Array<{
    name: string;
    path: string;
    required: boolean;
    version?: string;
  }>;
}

export class RemediationPlanValidator {
  private projectRoot: string;
  
  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  /**
   * Validate a remediation plan file against constitutional requirements
   */
  async validatePlanFile(planPath: string): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: false,
      errors: [],
      warnings: [],
      constitutionalViolations: [],
      suggestions: [],
      score: 0
    };

    try {
      // Load and parse the plan
      const planContent = fs.readFileSync(planPath, 'utf8');
      let plan;

      if (planPath.endsWith('.yaml') || planPath.endsWith('.yml')) {
        plan = yaml.load(planContent);
      } else if (planPath.endsWith('.json')) {
        plan = JSON.parse(planContent);
      } else {
        result.errors.push('Plan file must be JSON or YAML format');
        return result;
      }

      // Schema validation
      try {
        const validatedPlan = validateRemediationPlan(plan);
        result.score += 30; // Base schema compliance
        
        // Constitutional compliance checks
        await this.performConstitutionalChecks(validatedPlan, result);
        
        // Safety mechanism validation
        await this.validateSafetyMechanisms(validatedPlan, result);
        
        // Tooling validation
        await this.validateToolingRequirements(validatedPlan, result);
        
        // Preflight gate validation
        await this.validatePreflightGates(validatedPlan, result);
        
        // Success criteria validation
        this.validateSuccessCriteria(validatedPlan, result);
        
        result.isValid = result.errors.length === 0 && result.constitutionalViolations.length === 0;
        
      } catch (error) {
        if (error instanceof ConstitutionalViolationError) {
          result.constitutionalViolations.push(error.message);
          if (error.severity === 'critical') {
            result.errors.push(`CRITICAL: ${error.violation}`);
          } else {
            result.warnings.push(error.violation);
          }
        } else {
          result.errors.push(`Schema validation failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      }

    } catch (error) {
      result.errors.push(`Failed to load plan file: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Constitutional compliance checks
   */
  private async performConstitutionalChecks(plan: any, result: ValidationResult): Promise<void> {
    // Check for required constitutional annotations
    const requiredFields = ['aegisFrameworkVersion', 'intent', 'context', 'mode'];
    const missingFields = requiredFields.filter(field => !plan[field]);
    
    if (missingFields.length > 0) {
      result.constitutionalViolations.push(
        `Missing constitutional annotations: ${missingFields.join(', ')}`
      );
    } else {
      result.score += 10;
    }

    // Validate framework version compatibility
    if (plan.aegisFrameworkVersion !== '2.0.0-alpha-dev') {
      result.warnings.push(
        `Framework version mismatch. Expected: 2.0.0-alpha-dev, Found: ${plan.aegisFrameworkVersion}`
      );
    }

    // Check for proper semantic versioning
    const versionRegex = /^\d+\.\d+\.\d+$/;
    if (!versionRegex.test(plan.version)) {
      result.constitutionalViolations.push(
        'Plan version must follow semantic versioning (X.Y.Z)'
      );
    } else {
      result.score += 5;
    }

    // Validate traceability requirements
    if (!plan.targetProject?.detectedIssues || plan.targetProject.detectedIssues.length === 0) {
      result.constitutionalViolations.push(
        'Constitutional violation: Traceability requires specific detected issues to be listed'
      );
    } else {
      result.score += 10;
    }
  }

  /**
   * Validate safety mechanisms are properly implemented
   */
  private async validateSafetyMechanisms(plan: any, result: ValidationResult): Promise<void> {
    // Check rollback strategy
    if (!plan.overallRollbackStrategy) {
      result.constitutionalViolations.push(
        'CRITICAL: Missing overall rollback strategy - violates safety principle'
      );
    } else {
      result.score += 15;
      
      // Validate rollback testing
      if (!plan.overallRollbackStrategy.testRollback) {
        result.warnings.push('Rollback strategy should include testing');
      }
    }

    // Check phase-level rollback plans
    for (const phase of plan.phases || []) {
      if (!phase.rollbackPlan) {
        result.errors.push(`Phase "${phase.name}" missing rollback plan`);
      } else if (phase.rollbackPlan.strategy === 'none' && phase.riskLevel !== 'low') {
        result.constitutionalViolations.push(
          `Phase "${phase.name}" with ${phase.riskLevel} risk requires rollback strategy`
        );
      }
    }

    // Check dry-run simulation requirements
    const highRiskPhases = plan.phases?.filter((p: any) => ['high', 'critical'].includes(p.riskLevel)) || [];
    for (const phase of highRiskPhases) {
      if (!phase.dryRunSimulation?.enabled) {
        result.constitutionalViolations.push(
          `High-risk phase "${phase.name}" must include dry-run simulation`
        );
      }
    }

    // Emergency procedures validation
    if (!plan.emergencyProcedures) {
      result.warnings.push('No emergency procedures defined');
    } else {
      result.score += 5;
    }
  }

  /**
   * Validate tooling requirements and existence
   */
  private async validateToolingRequirements(plan: any, result: ValidationResult): Promise<void> {
    for (const phase of plan.phases || []) {
      if (!phase.toolingRequirements) {
        result.warnings.push(`Phase "${phase.name}" has no tooling requirements specified`);
        continue;
      }

      // Check if required tools exist
      for (const tool of phase.toolingRequirements.requiredTools || []) {
        try {
          const { execSync } = await import('child_process');
          execSync(tool.validateCommand, { stdio: 'ignore' });
          result.score += 2;
        } catch (error) {
          if (tool.criticalForExecution) {
            result.errors.push(`Critical tool missing: ${tool.name}`);
          } else {
            result.warnings.push(`Optional tool missing: ${tool.name}`);
          }
        }
      }

      // Check scaffolded tools
      for (const scaffoldedTool of phase.toolingRequirements.scaffoldedTools || []) {
        const toolPath = path.resolve(this.projectRoot, scaffoldedTool.path);
        if (!fs.existsSync(toolPath)) {
          result.errors.push(
            `Scaffolded tool "${scaffoldedTool.name}" not found at ${scaffoldedTool.path}`
          );
        } else if (!scaffoldedTool.validated) {
          result.warnings.push(
            `Scaffolded tool "${scaffoldedTool.name}" has not been validated`
          );
        } else {
          result.score += 3;
        }
      }
    }
  }

  /**
   * Validate preflight gates meet constitutional requirements
   */
  private async validatePreflightGates(plan: any, result: ValidationResult): Promise<void> {
    const requiredGates = ['build', 'test', 'lint'];
    const ciGates = plan.ciIntegration?.preflightGates || [];
    
    for (const requiredGate of requiredGates) {
      const hasGate = ciGates.some((gate: any) => 
        gate.name.toLowerCase().includes(requiredGate) ||
        gate.command.toLowerCase().includes(requiredGate)
      );
      
      if (!hasGate) {
        result.constitutionalViolations.push(
          `Missing required preflight gate: ${requiredGate} validation`
        );
      } else {
        result.score += 5;
      }
    }

    // Check first phase includes validation
    const firstPhase = plan.phases?.find((p: any) => p.order === 1);
    if (firstPhase) {
      const hasValidation = firstPhase.validationSteps?.some((step: any) =>
        ['build', 'test', 'lint'].some(type => 
          step.name.toLowerCase().includes(type) || 
          step.command.toLowerCase().includes(type)
        )
      );
      
      if (!hasValidation) {
        result.constitutionalViolations.push(
          'First phase must include build/test/lint validation steps'
        );
      } else {
        result.score += 10;
      }
    }
  }

  /**
   * Validate success criteria are measurable and meaningful
   */
  private validateSuccessCriteria(plan: any, result: ValidationResult): void {
    const criteria = plan.successCriteria || [];
    
    if (criteria.length < 3) {
      result.errors.push('Plan must define at least 3 success criteria');
      return;
    }

    const requiredCriteria = ['build', 'test', 'compliance'];
    for (const required of requiredCriteria) {
      const hasCriterion = criteria.some((c: any) => 
        c.criterion.toLowerCase().includes(required) ||
        c.measurementMethod.toLowerCase().includes(required)
      );
      
      if (!hasCriterion) {
        result.warnings.push(`Missing recommended success criterion: ${required}`);
      } else {
        result.score += 3;
      }
    }

    // Check for measurable criteria
    for (const criterion of criteria) {
      if (!criterion.measurementMethod || criterion.measurementMethod.length < 10) {
        result.warnings.push(
          `Success criterion "${criterion.criterion}" lacks detailed measurement method`
        );
      }
    }

    result.score += Math.min(criteria.length * 2, 10);
  }

  /**
   * Generate improvement suggestions based on validation results
   */
  private generateSuggestions(result: ValidationResult): void {
    if (result.constitutionalViolations.length > 0) {
      result.suggestions.push(
        'Address constitutional violations immediately - these represent framework safety principle violations'
      );
    }

    if (result.score < 70) {
      result.suggestions.push(
        'Plan quality score is below recommended threshold (70). Consider adding more validation steps, rollback mechanisms, and success criteria'
      );
    }

    if (result.errors.some(e => e.includes('tool missing'))) {
      result.suggestions.push(
        'Create tool manifest file and validate all required tools exist before plan execution'
      );
    }

    if (result.warnings.some(w => w.includes('rollback'))) {
      result.suggestions.push(
        'Strengthen rollback mechanisms - consider git snapshots and automated restoration procedures'
      );
    }
  }

  /**
   * Validate tools manifest exists and is current
   */
  async validateToolsManifest(): Promise<{ exists: boolean; valid: boolean; tools: string[] }> {
    const manifestPath = path.join(this.projectRoot, 'tools', 'manifest.json');
    
    if (!fs.existsSync(manifestPath)) {
      return { exists: false, valid: false, tools: [] };
    }

    try {
      const manifest: ToolManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      const toolNames = manifest.tools.map(t => t.name);
      
      // Verify tools exist
      const { execSync } = await import('child_process');
      for (const tool of manifest.tools) {
        if (tool.required) {
          try {
            if (tool.path) {
              const toolPath = path.resolve(this.projectRoot, tool.path);
              if (!fs.existsSync(toolPath)) {
                return { exists: true, valid: false, tools: toolNames };
              }
            }
          } catch (error) {
            return { exists: true, valid: false, tools: toolNames };
          }
        }
      }
      
      return { exists: true, valid: true, tools: toolNames };
    } catch (error) {
      return { exists: true, valid: false, tools: [] };
    }
  }
}

/**
 * CLI interface for validating remediation plans
 */
export async function validateRemediationPlanCLI(): Promise<void> {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node validate-remediation-plan.js <plan-file>');
    process.exit(1);
  }

  const planPath = args[0];
  const validator = new RemediationPlanValidator();
  
  console.log('🔍 Validating remediation plan against constitutional requirements...\n');
  
  const result = await validator.validatePlanFile(planPath);
  
  // Report results
  console.log(`📊 Validation Score: ${result.score}/100`);
  
  if (result.constitutionalViolations.length > 0) {
    console.log('\n🏛️ Constitutional Violations:');
    result.constitutionalViolations.forEach(violation => 
      console.log(`   ❌ ${violation}`)
    );
  }
  
  if (result.errors.length > 0) {
    console.log('\n🚨 Errors:');
    result.errors.forEach(error => console.log(`   ❌ ${error}`));
  }
  
  if (result.warnings.length > 0) {
    console.log('\n⚠️ Warnings:');
    result.warnings.forEach(warning => console.log(`   ⚠️ ${warning}`));
  }
  
  if (result.suggestions.length > 0) {
    console.log('\n💡 Suggestions:');
    result.suggestions.forEach(suggestion => console.log(`   💡 ${suggestion}`));
  }
  
  // Tools manifest validation
  const toolsResult = await validator.validateToolsManifest();
  console.log(`\n🛠️ Tools Manifest: ${toolsResult.exists ? 'Found' : 'Missing'}`);
  if (toolsResult.exists && !toolsResult.valid) {
    console.log('   ❌ Tools manifest validation failed');
  } else if (toolsResult.valid) {
    console.log(`   ✅ ${toolsResult.tools.length} tools validated`);
  }
  
  console.log(`\n${result.isValid ? '✅' : '❌'} Overall: ${result.isValid ? 'VALID' : 'INVALID'}\n`);
  
  if (!result.isValid) {
    console.log('🚫 Remediation plan does not meet constitutional requirements and cannot be executed safely.');
    process.exit(1);
  } else {
    console.log('✅ Remediation plan meets constitutional requirements and is safe for execution.');
  }
}

// Run CLI if called directly
if (process.argv[1] && process.argv[1].endsWith('validate-remediation-plan.ts')) {
  validateRemediationPlanCLI();
}
