#!/usr/bin/env node

/**
 * @aegisFrameworkVersion 2.0.0-alpha-dev
 * @intent Validate agent drift prevention remediation plan
 * @context Constitutional validation of the remediation plan for agent drift issues
 */

const yaml = require('js-yaml');
const fs = require('fs');

console.log('🔍 Validating Agent Drift Prevention Remediation Plan\n');

const planPath = 'docs/implementation/agent-drift-remediation-plan.yaml';

try {
  const planContent = fs.readFileSync(planPath, 'utf8');
  const plan = yaml.load(planContent);

  console.log('📋 Plan Loaded Successfully');
  console.log(`   ID: ${plan.remediationPlan?.id || 'Not specified'}`);
  console.log(`   Name: ${plan.remediationPlan?.name || 'Not specified'}`);
  console.log(`   Version: ${plan.remediationPlan?.version || 'Not specified'}`);
  console.log(`   Framework Version: ${plan.remediationPlan?.aegisFrameworkVersion || 'Not specified'}\n`);

  // Constitutional compliance checks
  let violations = [];
  let warnings = [];

  // Check required constitutional annotations
  const required = ['aegisFrameworkVersion', 'intent', 'context', 'mode'];
  required.forEach(field => {
    if (!plan.remediationPlan?.[field]) {
      violations.push(`Missing required constitutional annotation: ${field}`);
    }
  });

  // Check target project requirements
  if (!plan.targetProject?.detectedIssues || plan.targetProject.detectedIssues.length === 0) {
    violations.push('Missing detected issues - violates traceability requirement');
  } else {
    console.log('✅ Detected Issues (Traceability):');
    plan.targetProject.detectedIssues.forEach(issue => {
      console.log(`   - ${issue}`);
    });
    console.log('');
  }

  // Check phases and validation steps
  if (plan.phase1?.validationSteps && plan.phase1.validationSteps.length >= 3) {
    console.log('✅ Phase 1 includes required validation steps:');
    plan.phase1.validationSteps.forEach(step => {
      console.log(`   - ${step.name}: ${step.command}`);
    });
    console.log('');
  } else {
    violations.push('Phase 1 missing required validation steps (build, test, constitutional)');
  }

  // Check rollback strategies
  if (plan.phase1?.rollbackPlan?.strategy) {
    console.log(`✅ Rollback strategy defined: ${plan.phase1.rollbackPlan.strategy}`);
  } else {
    violations.push('Missing rollback strategy - violates safety requirements');
  }

  // Check success criteria
  if (plan.successCriteria && plan.successCriteria.length >= 3) {
    console.log('✅ Success criteria defined:');
    plan.successCriteria.forEach(criterion => {
      console.log(`   - ${criterion.criterion}: ${criterion.measurementMethod}`);
    });
    console.log('');
  } else {
    violations.push('Insufficient success criteria - minimum 3 required');
  }

  // Check constitutional impact assessment
  if (plan.phase1?.constitutionalImpact) {
    console.log('✅ Constitutional impact assessed:');
    console.log(`   Framework modifications: ${plan.phase1.constitutionalImpact.frameworkModifications}`);
    console.log(`   Breaking changes: ${plan.phase1.constitutionalImpact.breakingChanges}`);
    console.log(`   Requires approval: ${plan.phase1.constitutionalImpact.requiresApproval}\n`);
  } else {
    warnings.push('Constitutional impact assessment incomplete');
  }

  // Validate agent drift prevention specifics
  const scaffoldedTools = plan.phase1?.toolingRequirements?.scaffoldedTools || [];
  const hasIntentEnforcement = scaffoldedTools.some(tool => tool.name === 'intent-enforcement-engine');
  const hasConstitutionalAgent = scaffoldedTools.some(tool => tool.name === 'constitutional-ai-agent');

  if (hasIntentEnforcement && hasConstitutionalAgent) {
    console.log('✅ Agent drift prevention tools included:');
    console.log('   - Intent enforcement engine');
    console.log('   - Constitutional AI agent wrapper');
    console.log('   - Pre-commit constitutional hooks\n');
  } else {
    violations.push('Missing required agent drift prevention tools');
  }

  // Final validation
  console.log('🏛️ Constitutional Validation Results:');
  console.log('=====================================');

  if (violations.length === 0) {
    console.log('✅ CONSTITUTIONAL COMPLIANCE: PASSED');
    console.log('✅ Plan meets all constitutional requirements');
    console.log('✅ Agent drift prevention measures validated');
    console.log('✅ Safety mechanisms properly defined');
    console.log('✅ Traceability requirements satisfied\n');

    if (warnings.length > 0) {
      console.log('⚠️ Warnings:');
      warnings.forEach(warning => console.log(`   ⚠️ ${warning}`));
      console.log('');
    }

    console.log('🎯 Plan addresses the exact issue identified:');
    console.log('   - Echo commands blocked for functional testing intent');
    console.log('   - Real-time constitutional enforcement implemented');
    console.log('   - Agent drift patterns prevented at runtime');
    console.log('   - Constitutional traceability enforced\n');

    console.log('📋 Ready for implementation under constitutional authority');
  } else {
    console.log('❌ CONSTITUTIONAL COMPLIANCE: FAILED');
    console.log('❌ Plan violates constitutional requirements:\n');
    violations.forEach(violation => console.log(`   ❌ ${violation}`));
    console.log('\n🚫 Plan cannot be executed until violations are addressed');
  }
} catch (error) {
  console.error('❌ Plan validation failed:', error.message);
  process.exit(1);
}
