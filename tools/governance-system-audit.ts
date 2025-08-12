#!/usr/bin/env tsx

/**
 * @aegisBlueprint: governance-audit
 * @version: 2.5.0
 * @mode: lean
 * @intent: Reclassify tools based on governance system context - unused may mean broken governance
 * @context: After discovering broken intelligence system, need to reanalyze all "unused" tools
 * @model: claude-3-5-sonnet
 * @hash: 3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c
 */

import { readFileSync, existsSync } from 'fs';
import { glob } from 'glob';

interface GovernanceTool {
  name: string;
  location: string;
  category: 'intelligence' | 'compliance' | 'enforcement' | 'monitoring' | 'prevention' | 'validation' | 'utility';
  purpose: string;
  usedInPackageJson: boolean;
  usedInCI: boolean;
  status: 'active' | 'broken-governance' | 'unused' | 'partial';
  criticality: 'critical' | 'high' | 'medium' | 'low';
  description: string;
}

async function main() {
  console.log('🏛️ Aegis Governance System Audit');
  console.log('==================================\n');

  const governanceTools: GovernanceTool[] = [
    // INTELLIGENCE SYSTEM (Already identified as broken)
    {
      name: 'Intelligent Pattern Detector',
      location: 'tools/intelligent-pattern-detector.ts',
      category: 'intelligence',
      purpose: 'Detects intelligent patterns in code and documentation',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'critical',
      description: 'Should be detecting patterns for constitutional compliance'
    },
    {
      name: 'Predictive Compliance Monitor',
      location: 'tools/predictive-compliance-monitor.ts',
      category: 'intelligence',
      purpose: 'Predicts compliance issues before they occur',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'critical',
      description: 'Should be preventing constitutional violations proactively'
    },
    {
      name: 'Realtime Constitutional Enforcer',
      location: 'tools/realtime-constitutional-enforcer.ts',
      category: 'enforcement',
      purpose: 'Real-time constitutional compliance enforcement',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'critical',
      description: 'Should be enforcing constitutional rules in real-time'
    },
    {
      name: 'Realtime Evolution Detection',
      location: 'tools/realtime-evolution-detection.ts',
      category: 'monitoring',
      purpose: 'Real-time evolution detection and response',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'critical',
      description: 'Should be detecting evolution in real-time'
    },
    {
      name: 'Continuous Compliance Monitor',
      location: 'tools/continuous-compliance-monitor.ts',
      category: 'monitoring',
      purpose: 'Continuous monitoring of constitutional compliance',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'critical',
      description: 'Should be continuously monitoring compliance'
    },
    {
      name: 'Enhanced Evolution Detector',
      location: 'tools/enhanced-evolution-detection.ts',
      category: 'monitoring',
      purpose: 'Enhanced evolution detection with ML capabilities',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'high',
      description: 'Should be providing enhanced evolution detection'
    },
    {
      name: 'Framework Intelligence Certification',
      location: 'tools/framework-intelligence-certification.ts',
      category: 'validation',
      purpose: 'Certifies framework intelligence capabilities',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'high',
      description: 'Should be certifying intelligence system health'
    },
    {
      name: 'Intent Enforcement Engine',
      location: 'tools/intent-enforcement-engine.ts',
      category: 'enforcement',
      purpose: 'Enforces developer intent in code and documentation',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'high',
      description: 'Should be enforcing developer intent'
    },
    {
      name: 'Systematic Prevention Validator',
      location: 'tools/systematic-prevention-validator.ts',
      category: 'prevention',
      purpose: 'Systematically validates prevention mechanisms',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'high',
      description: 'Should be validating prevention systems'
    },
    {
      name: 'Evidence-Based Validation',
      location: 'tools/evidence-based-validation.ts',
      category: 'validation',
      purpose: 'Validates framework decisions based on evidence',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'high',
      description: 'Should be validating decisions with evidence'
    },
    {
      name: 'Evolution Learning System',
      location: 'tools/evolution-learning-system.ts',
      category: 'intelligence',
      purpose: 'Learns from framework evolution patterns',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'high',
      description: 'Should be learning from evolution patterns'
    },
    {
      name: 'Framework Capability Mapper',
      location: 'tools/framework-capability-mapper.ts',
      category: 'validation',
      purpose: 'Maps framework capabilities and gaps',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'medium',
      description: 'Should be mapping capabilities and gaps'
    },
    {
      name: 'Comprehensive Intelligence Testing',
      location: 'tools/comprehensive-intelligence-testing.ts',
      category: 'validation',
      purpose: 'Comprehensive testing of intelligence features',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'high',
      description: 'Should be testing intelligence system health'
    },

    // COMPLIANCE & ENFORCEMENT SYSTEM
    {
      name: 'Constitutional Pre-commit Hook',
      location: 'tools/constitutional-pre-commit-hook.sh',
      category: 'enforcement',
      purpose: 'Pre-commit hook for constitutional compliance',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'critical',
      description: 'Should be preventing unconstitutional commits'
    },
    {
      name: 'Pre-commit Destructive Check',
      location: 'tools/pre-commit-destructive-check.sh',
      category: 'prevention',
      purpose: 'Prevents destructive actions in commits',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'critical',
      description: 'Should be preventing destructive commits'
    },
    {
      name: 'Package Manager Pre-commit Hook',
      location: 'tools/package-manager-pre-commit-hook.sh',
      category: 'enforcement',
      purpose: 'Pre-commit hook for package manager consistency',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'high',
      description: 'Should be ensuring package manager consistency'
    },
    {
      name: 'Pre-commit Hook (TypeScript)',
      location: 'tools/pre-commit-hook.ts',
      category: 'enforcement',
      purpose: 'TypeScript pre-commit hook',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'high',
      description: 'Should be running pre-commit checks'
    },
    {
      name: 'Pre-commit Hook (Shell)',
      location: 'tools/pre-commit-hook.sh',
      category: 'enforcement',
      purpose: 'Shell pre-commit hook',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'high',
      description: 'Should be running pre-commit checks'
    },

    // MONITORING & DETECTION SYSTEM
    {
      name: 'Drift Monitoring Dashboard',
      location: 'tools/drift-monitoring-dashboard.ts',
      category: 'monitoring',
      purpose: 'Dashboard for monitoring framework drift',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'high',
      description: 'Should be monitoring framework drift'
    },
    {
      name: 'Destructive Action Protection',
      location: 'tools/destructive-action-protection.ts',
      category: 'prevention',
      purpose: 'Protects against destructive actions',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'critical',
      description: 'Should be protecting against destructive actions'
    },
    {
      name: 'Setup Proactive Detection',
      location: 'tools/setup-proactive-detection.sh',
      category: 'monitoring',
      purpose: 'Sets up proactive detection systems',
      usedInPackageJson: true,
      usedInCI: false,
      status: 'partial',
      criticality: 'high',
      description: 'Should be setting up proactive detection'
    },
    {
      name: 'Setup Git Hooks',
      location: 'tools/setup-git-hooks.sh',
      category: 'enforcement',
      purpose: 'Sets up git hooks for governance',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'high',
      description: 'Should be setting up governance git hooks'
    },

    // VALIDATION & AUDITING SYSTEM
    {
      name: 'Validate Annotations',
      location: 'tools/validate-annotations.ts',
      category: 'validation',
      purpose: 'Validates constitutional annotations',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'high',
      description: 'Should be validating constitutional annotations'
    },
    {
      name: 'Validate Agent Drift Plan',
      location: 'tools/validate-agent-drift-plan.cjs',
      category: 'validation',
      purpose: 'Validates agent drift prevention plans',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'high',
      description: 'Should be validating drift prevention plans'
    },
    {
      name: 'Validate Article XI Abstraction',
      location: 'tools/validate-article-xi-abstraction.ts',
      category: 'validation',
      purpose: 'Validates Article XI constitutional compliance',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'critical',
      description: 'Should be validating Article XI compliance'
    },
    {
      name: 'Check Evidence',
      location: 'tools/check-evidence.ts',
      category: 'validation',
      purpose: 'Checks evidence for governance decisions',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'high',
      description: 'Should be checking evidence for decisions'
    },
    {
      name: 'Quality Preflight',
      location: 'tools/quality-preflight.ts',
      category: 'validation',
      purpose: 'Preflight quality checks',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'medium',
      description: 'Should be running quality preflight checks'
    },

    // INTEGRATION & AUTOMATION SYSTEM
    {
      name: 'Cursor Integration',
      location: 'tools/cursor-integration.ts',
      category: 'utility',
      purpose: 'Integrates with Cursor IDE',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'medium',
      description: 'Should be integrating with Cursor for governance'
    },
    {
      name: 'Cursor Realtime Integration',
      location: 'tools/cursor-realtime-integration.ts',
      category: 'utility',
      purpose: 'Real-time integration with Cursor IDE',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'medium',
      description: 'Should be providing real-time Cursor integration'
    },
    {
      name: 'Test Cursor Detection',
      location: 'tools/test-cursor-detection.ts',
      category: 'validation',
      purpose: 'Tests Cursor detection capabilities',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'low',
      description: 'Should be testing Cursor detection'
    },

    // GENERATION & AUTOMATION SYSTEM
    {
      name: 'Generate Changelog (TypeScript)',
      location: 'tools/generate-changelog.ts',
      category: 'utility',
      purpose: 'Generates changelog with TypeScript',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'unused',
      criticality: 'low',
      description: 'TypeScript changelog generation (duplicate)'
    },
    {
      name: 'Generate Changelog (Shell)',
      location: 'tools/generate-changelog.sh',
      category: 'utility',
      purpose: 'Generates changelog with shell',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'unused',
      criticality: 'low',
      description: 'Shell changelog generation (duplicate)'
    },
    {
      name: 'Update Framework Dashboard',
      location: 'tools/update-framework-dashboard.ts',
      category: 'utility',
      purpose: 'Updates framework dashboard',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'unused',
      criticality: 'low',
      description: 'Dashboard update utility'
    },

    // BLUEPRINT & COVERAGE SYSTEM
    {
      name: 'Blueprint Coverage Auditor',
      location: 'tools/blueprint-coverage-auditor.ts',
      category: 'validation',
      purpose: 'Audits blueprint coverage',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'high',
      description: 'Should be auditing blueprint coverage'
    },
    {
      name: 'Team Config Loader',
      location: 'tools/team-config-loader.ts',
      category: 'utility',
      purpose: 'Loads team configuration',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'medium',
      description: 'Should be loading team configuration'
    },

    // DEMO & TESTING SYSTEM
    {
      name: 'Demo Constitutional Enforcement',
      location: 'tools/demo-constitutional-enforcement.cjs',
      category: 'utility',
      purpose: 'Demonstrates constitutional enforcement',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'unused',
      criticality: 'low',
      description: 'Demo script for constitutional enforcement'
    },
    {
      name: 'Aegis Svelte Init',
      location: 'tools/aegis-svelte-init.ts',
      category: 'utility',
      purpose: 'Initializes Svelte applications',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'unused',
      criticality: 'low',
      description: 'Svelte initialization utility'
    },
    {
      name: 'Create Aegis Bundle',
      location: 'tools/distribution/create-aegis-bundle.cjs',
      category: 'utility',
      purpose: 'Creates Aegis distribution bundles',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'unused',
      criticality: 'low',
      description: 'Distribution bundle creation'
    },

    // COMPLIANCE SYSTEM (Newly identified as potentially broken)
    {
      name: 'Compliance Claims',
      location: 'tools/compliance/claims.ts',
      category: 'compliance',
      purpose: 'Defines compliance claims for validation',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'critical',
      description: 'Should be defining compliance claims for validation'
    },
    {
      name: 'Validation Contract',
      location: 'tools/compliance/validation-contract.ts',
      category: 'compliance',
      purpose: 'Defines validation contract for compliance',
      usedInPackageJson: false,
      usedInCI: false,
      status: 'broken-governance',
      criticality: 'critical',
      description: 'Should be defining validation contracts'
    }
  ];

  // Analyze by status
  const active = governanceTools.filter(t => t.status === 'active');
  const brokenGovernance = governanceTools.filter(t => t.status === 'broken-governance');
  const unused = governanceTools.filter(t => t.status === 'unused');
  const partial = governanceTools.filter(t => t.status === 'partial');

  // Analyze by criticality
  const critical = governanceTools.filter(t => t.criticality === 'critical');
  const high = governanceTools.filter(t => t.criticality === 'high');
  const medium = governanceTools.filter(t => t.criticality === 'medium');
  const low = governanceTools.filter(t => t.criticality === 'low');

  console.log('📊 GOVERNANCE SYSTEM STATUS');
  console.log('===========================');
  console.log(`Total governance tools: ${governanceTools.length}`);
  console.log(`✅ Active: ${active.length}`);
  console.log(`🚨 BROKEN GOVERNANCE: ${brokenGovernance.length}`);
  console.log(`⚠️  Partial: ${partial.length}`);
  console.log(`❌ Truly unused: ${unused.length}\n`);

  console.log('🚨 CRITICAL GOVERNANCE FAILURES');
  console.log('===============================');
  console.log(`Critical tools broken: ${critical.filter(t => t.status === 'broken-governance').length}`);
  console.log(`High priority tools broken: ${high.filter(t => t.status === 'broken-governance').length}`);
  console.log(`Medium priority tools broken: ${medium.filter(t => t.status === 'broken-governance').length}\n`);

  if (brokenGovernance.length > 0) {
    console.log('🚨 BROKEN GOVERNANCE TOOLS (CRITICAL)');
    console.log('=====================================');
    console.log('These tools are essential for governance but are not being used:');
    console.log('');

    // Group by criticality
    const criticalBroken = brokenGovernance.filter(t => t.criticality === 'critical');
    const highBroken = brokenGovernance.filter(t => t.criticality === 'high');
    const mediumBroken = brokenGovernance.filter(t => t.criticality === 'medium');

    if (criticalBroken.length > 0) {
      console.log('🔥 CRITICAL GOVERNANCE FAILURES:');
      criticalBroken.forEach(tool => {
        console.log(`   🚨 ${tool.name}`);
        console.log(`      Location: ${tool.location}`);
        console.log(`      Purpose: ${tool.purpose}`);
        console.log(`      Impact: ${tool.description}`);
        console.log('');
      });
    }

    if (highBroken.length > 0) {
      console.log('⚠️  HIGH PRIORITY GOVERNANCE FAILURES:');
      highBroken.forEach(tool => {
        console.log(`   ⚠️  ${tool.name}`);
        console.log(`      Location: ${tool.location}`);
        console.log(`      Purpose: ${tool.purpose}`);
        console.log(`      Impact: ${tool.description}`);
        console.log('');
      });
    }

    if (mediumBroken.length > 0) {
      console.log('📋 MEDIUM PRIORITY GOVERNANCE FAILURES:');
      mediumBroken.forEach(tool => {
        console.log(`   📋 ${tool.name}`);
        console.log(`      Location: ${tool.location}`);
        console.log(`      Purpose: ${tool.purpose}`);
        console.log(`      Impact: ${tool.description}`);
        console.log('');
      });
    }
  }

  if (unused.length > 0) {
    console.log('❌ TRULY UNUSED TOOLS (Safe to deprecate)');
    console.log('=========================================');
    unused.forEach(tool => {
      console.log(`   🗑️  ${tool.name}`);
      console.log(`      Location: ${tool.location}`);
      console.log(`      Purpose: ${tool.purpose}`);
      console.log(`      Criticality: ${tool.criticality}`);
      console.log('');
    });
  }

  console.log('🔍 REVISED ANALYSIS');
  console.log('===================');
  console.log('After reanalysis with governance context:');
  console.log('');
  console.log(`🚨 BROKEN GOVERNANCE: ${brokenGovernance.length} tools`);
  console.log(`   - These are essential for constitutional compliance`);
  console.log(`   - They should be integrated into CI/CD pipeline`);
  console.log(`   - Their absence represents governance failures`);
  console.log('');
  console.log(`❌ TRULY UNUSED: ${unused.length} tools`);
  console.log(`   - These are safe to deprecate`);
  console.log(`   - They are not essential for governance`);
  console.log(`   - They may be duplicates or outdated utilities`);
  console.log('');
  console.log(`⚠️  PARTIAL: ${partial.length} tools`);
  console.log(`   - These are used but not fully integrated`);
  console.log(`   - They need CI integration for proper governance`);
  console.log('');

  console.log('💡 CORRECTED RECOMMENDATIONS');
  console.log('============================');
  console.log('1. 🚨 IMMEDIATE: Fix broken governance tools (${brokenGovernance.length} tools)');
  console.log('2. 🚨 IMMEDIATE: Integrate partial tools into CI (${partial.length} tools)');
  console.log('3. 🗑️  DEPRECATE: Remove truly unused tools (${unused.length} tools)');
  console.log('4. 🔧 REFACTOR: Consolidate duplicate governance features');
  console.log('5. 🧪 TEST: Add comprehensive testing for governance system');
  console.log('6. 📊 MONITOR: Add observability for governance health');
  console.log('');

  console.log('🎯 CONCLUSION');
  console.log('==============');
  console.log('The original audit was WRONG - most "unused" tools are actually');
  console.log('BROKEN GOVERNANCE FEATURES that need immediate remediation.');
  console.log('');
  console.log('This represents a SYSTEMIC GOVERNANCE FAILURE that requires');
  console.log('immediate attention to restore constitutional compliance.');
}

main().catch(console.error);
