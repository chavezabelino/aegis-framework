#!/usr/bin/env node

/**
 * @aegisFrameworkVersion 2.0.0-alpha-dev
 * @intent Simple validation script for testing remediation plan constitutional compliance
 * @context Temporary JavaScript version to test framework safeguards
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Simple validation function
function validateRemediationPlan(planPath) {
  console.log('🔍 Validating remediation plan against constitutional requirements...\n');

  let score = 0;
  const errors = [];
  const warnings = [];
  const suggestions = [];

  try {
    // Load and parse the plan
    const planContent = fs.readFileSync(planPath, 'utf8');
    let plan;

    if (planPath.endsWith('.yaml') || planPath.endsWith('.yml')) {
      plan = yaml.load(planContent);
    } else if (planPath.endsWith('.json')) {
      plan = JSON.parse(planContent);
    } else {
      errors.push('Plan file must be JSON or YAML format');
      return { score: 0, errors, warnings, suggestions };
    }

    // Basic constitutional compliance checks
    const requiredFields = [
      'id',
      'name',
      'description',
      'version',
      'aegisFrameworkVersion',
      'intent',
      'context',
      'mode',
    ];
    const missingFields = requiredFields.filter(field => !plan[field]);

    if (missingFields.length === 0) {
      score += 20;
      console.log('✅ Constitutional annotations complete');
    } else {
      errors.push(`Missing constitutional annotations: ${missingFields.join(', ')}`);
    }

    // Check for phases
    if (plan.phases && plan.phases.length > 0) {
      score += 15;
      console.log('✅ Execution phases defined');

      // Check validation steps in first phase
      const firstPhase = plan.phases.find(p => p.order === 1);
      if (firstPhase && firstPhase.validationSteps) {
        const hasRequiredValidation = ['build', 'test', 'lint'].some(type =>
          firstPhase.validationSteps.some(
            step => step.name.toLowerCase().includes(type) || step.command.toLowerCase().includes(type)
          )
        );

        if (hasRequiredValidation) {
          score += 20;
          console.log('✅ Required validation steps present (build/test/lint)');
        } else {
          errors.push('First phase must include build, test, and lint validation steps');
        }
      } else {
        errors.push('First phase missing validation steps');
      }

      // Check rollback plans
      const phasesWithRollback = plan.phases.filter(p => p.rollbackPlan);
      if (phasesWithRollback.length === plan.phases.length) {
        score += 15;
        console.log('✅ All phases have rollback plans');
      } else {
        warnings.push('Some phases missing rollback plans');
      }
    } else {
      errors.push('No execution phases defined');
    }

    // Check success criteria
    if (plan.successCriteria && plan.successCriteria.length >= 3) {
      score += 10;
      console.log('✅ Adequate success criteria defined');
    } else {
      errors.push('Plan must define at least 3 success criteria');
    }

    // Check compliance targets
    if (plan.complianceTargets && plan.complianceTargets.length > 0) {
      score += 10;
      console.log('✅ Compliance targets defined');
    } else {
      warnings.push('No compliance targets specified');
    }

    // Check CI integration
    if (plan.ciIntegration && plan.ciIntegration.required) {
      score += 10;
      console.log('✅ CI integration configured');
    } else {
      warnings.push('CI integration not configured');
    }

    // Framework version check
    if (plan.aegisFrameworkVersion === '2.0.0-alpha-dev') {
      score += 5;
      console.log('✅ Framework version matches current');
    } else {
      warnings.push(`Framework version mismatch. Expected: 2.0.0-alpha-dev, Found: ${plan.aegisFrameworkVersion}`);
    }

    // Semantic versioning check
    const versionRegex = /^\d+\.\d+\.\d+$/;
    if (versionRegex.test(plan.version)) {
      score += 5;
      console.log('✅ Semantic versioning followed');
    } else {
      errors.push('Plan version must follow semantic versioning (X.Y.Z)');
    }
  } catch (error) {
    errors.push(`Failed to load or parse plan file: ${error.message}`);
  }

  return { score, errors, warnings, suggestions };
}

// CLI interface
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node validate-remediation-plan-simple.js <plan-file>');
    process.exit(1);
  }

  const planPath = args[0];
  const result = validateRemediationPlan(planPath);

  console.log(`\n📊 Validation Score: ${result.score}/100`);

  if (result.errors.length > 0) {
    console.log('\n🚨 Errors:');
    result.errors.forEach(error => console.log(`   ❌ ${error}`));
  }

  if (result.warnings.length > 0) {
    console.log('\n⚠️ Warnings:');
    result.warnings.forEach(warning => console.log(`   ⚠️ ${warning}`));
  }

  const isValid = result.errors.length === 0 && result.score >= 70;
  console.log(`\n${isValid ? '✅' : '❌'} Overall: ${isValid ? 'VALID' : 'INVALID'}\n`);

  if (!isValid) {
    console.log('🚫 Remediation plan does not meet constitutional requirements and cannot be executed safely.');
    process.exit(1);
  } else {
    console.log('✅ Remediation plan meets constitutional requirements and is safe for execution.');
  }
}

main();
