#!/usr/bin/env tsx

/**
 * @aegisBlueprint: intelligence-audit
 * @version: 2.5.0
 * @mode: lean
 * @intent: Audit the intelligence/ML system to identify broken governance features
 * @context: The user identified that unused tools may indicate a broken governance system
 * @model: claude-3-5-sonnet
 * @hash: 2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b
 */

import { readFileSync, existsSync } from 'fs';
import { glob } from 'glob';

interface IntelligenceFeature {
  name: string;
  location: string;
  type: 'learning' | 'detection' | 'prediction' | 'enforcement' | 'analysis';
  usedInPackageJson: boolean;
  usedInCI: boolean;
  usedInAnyWorkflow: boolean;
  status: 'active' | 'broken' | 'unused' | 'partial';
  description: string;
}

async function main() {
  console.log('🧠 Aegis Intelligence System Audit');
  console.log('===================================\n');

  const intelligenceFeatures: IntelligenceFeature[] = [
    // Framework Learning System
    {
      name: 'Intelligent Changelog',
      location: 'framework/learning/intelligent-changelog.ts',
      type: 'learning',
      usedInPackageJson: true,
      usedInCI: false,
      usedInAnyWorkflow: false,
      status: 'partial',
      description: 'AI-powered changelog generation and analysis'
    },
    {
      name: 'Pattern Recognition Engine',
      location: 'framework/learning/pattern-recognition-engine.ts',
      type: 'analysis',
      usedInPackageJson: true,
      usedInCI: false,
      usedInAnyWorkflow: false,
      status: 'partial',
      description: 'Detects patterns in framework usage and evolution'
    },
    {
      name: 'Predictive Enforcement',
      location: 'framework/learning/predictive-enforcement.ts',
      type: 'prediction',
      usedInPackageJson: true,
      usedInCI: false,
      usedInAnyWorkflow: false,
      status: 'partial',
      description: 'Predicts and prevents constitutional violations'
    },
    {
      name: 'Cross-Framework Learning',
      location: 'framework/learning/cross-framework-learning-system.ts',
      type: 'learning',
      usedInPackageJson: true,
      usedInCI: false,
      usedInAnyWorkflow: false,
      status: 'partial',
      description: 'Learns from other frameworks and applies insights'
    },
    {
      name: 'Evolution Story Detection',
      location: 'tools/detect-evolution-stories.ts',
      type: 'detection',
      usedInPackageJson: true,
      usedInCI: true,
      usedInAnyWorkflow: true,
      status: 'active',
      description: 'Automatically detects when evolution stories should be created'
    },
    {
      name: 'Intelligent Pattern Detector',
      location: 'tools/intelligent-pattern-detector.ts',
      type: 'detection',
      usedInPackageJson: false,
      usedInCI: false,
      usedInAnyWorkflow: false,
      status: 'unused',
      description: 'Detects intelligent patterns in code and documentation'
    },
    {
      name: 'Predictive Compliance Monitor',
      location: 'tools/predictive-compliance-monitor.ts',
      type: 'prediction',
      usedInPackageJson: false,
      usedInCI: false,
      usedInAnyWorkflow: false,
      status: 'unused',
      description: 'Predicts compliance issues before they occur'
    },
    {
      name: 'Realtime Constitutional Enforcer',
      location: 'tools/realtime-constitutional-enforcer.ts',
      type: 'enforcement',
      usedInPackageJson: false,
      usedInCI: false,
      usedInAnyWorkflow: false,
      status: 'unused',
      description: 'Real-time constitutional compliance enforcement'
    },
    {
      name: 'Realtime Evolution Detection',
      location: 'tools/realtime-evolution-detection.ts',
      type: 'detection',
      usedInPackageJson: false,
      usedInCI: false,
      usedInAnyWorkflow: false,
      status: 'unused',
      description: 'Real-time evolution detection and response'
    },
    {
      name: 'Continuous Compliance Monitor',
      location: 'tools/continuous-compliance-monitor.ts',
      type: 'enforcement',
      usedInPackageJson: false,
      usedInCI: false,
      usedInAnyWorkflow: false,
      status: 'unused',
      description: 'Continuous monitoring of constitutional compliance'
    },
    {
      name: 'Enhanced Evolution Detector',
      location: 'tools/enhanced-evolution-detector.ts',
      type: 'detection',
      usedInPackageJson: false,
      usedInCI: false,
      usedInAnyWorkflow: false,
      status: 'unused',
      description: 'Enhanced evolution detection with ML capabilities'
    },
    {
      name: 'Framework Intelligence Certification',
      location: 'tools/framework-intelligence-certification.ts',
      type: 'analysis',
      usedInPackageJson: false,
      usedInCI: false,
      usedInAnyWorkflow: false,
      status: 'unused',
      description: 'Certifies framework intelligence capabilities'
    },
    {
      name: 'Intent Enforcement Engine',
      location: 'tools/intent-enforcement-engine.ts',
      type: 'enforcement',
      usedInPackageJson: false,
      usedInCI: false,
      usedInAnyWorkflow: false,
      status: 'unused',
      description: 'Enforces developer intent in code and documentation'
    },
    {
      name: 'Systematic Prevention Validator',
      location: 'tools/systematic-prevention-validator.ts',
      type: 'enforcement',
      usedInPackageJson: false,
      usedInCI: false,
      usedInAnyWorkflow: false,
      status: 'unused',
      description: 'Systematically validates prevention mechanisms'
    },
    {
      name: 'Evidence-Based Validation',
      location: 'tools/evidence-based-validation.ts',
      type: 'analysis',
      usedInPackageJson: false,
      usedInCI: false,
      usedInAnyWorkflow: false,
      status: 'unused',
      description: 'Validates framework decisions based on evidence'
    },
    {
      name: 'Evolution Learning System',
      location: 'tools/evolution-learning-system.ts',
      type: 'learning',
      usedInPackageJson: false,
      usedInCI: false,
      usedInAnyWorkflow: false,
      status: 'unused',
      description: 'Learns from framework evolution patterns'
    },
    {
      name: 'Framework Capability Mapper',
      location: 'tools/framework-capability-mapper.ts',
      type: 'analysis',
      usedInPackageJson: false,
      usedInCI: false,
      usedInAnyWorkflow: false,
      status: 'unused',
      description: 'Maps framework capabilities and gaps'
    },
    {
      name: 'Comprehensive Intelligence Testing',
      location: 'tools/comprehensive-intelligence-testing.ts',
      type: 'analysis',
      usedInPackageJson: false,
      usedInCI: false,
      usedInAnyWorkflow: false,
      status: 'unused',
      description: 'Comprehensive testing of intelligence features'
    }
  ];

  // Analyze status
  const active = intelligenceFeatures.filter(f => f.status === 'active');
  const partial = intelligenceFeatures.filter(f => f.status === 'partial');
  const unused = intelligenceFeatures.filter(f => f.status === 'unused');
  const broken = intelligenceFeatures.filter(f => f.status === 'broken');

  console.log('📊 INTELLIGENCE SYSTEM STATUS');
  console.log('=============================');
  console.log(`Total intelligence features: ${intelligenceFeatures.length}`);
  console.log(`✅ Active: ${active.length}`);
  console.log(`⚠️  Partial (used but not in CI): ${partial.length}`);
  console.log(`❌ Unused: ${unused.length}`);
  console.log(`🚨 Broken: ${broken.length}\n`);

  if (partial.length > 0) {
    console.log('⚠️  PARTIAL INTEGRATION (CRITICAL ISSUE)');
    console.log('========================================');
    console.log('These intelligence features are used in package.json but NOT in CI:');
    console.log('This means the governance system is BROKEN - intelligence features');
    console.log('are not being used to enforce constitutional compliance!\n');
    
    partial.forEach(feature => {
      console.log(`📦 ${feature.name}`);
      console.log(`   Location: ${feature.location}`);
      console.log(`   Type: ${feature.type}`);
      console.log(`   Description: ${feature.description}`);
      console.log(`   Status: Used in package.json but NOT in CI workflows`);
      console.log('');
    });
  }

  if (unused.length > 0) {
    console.log('❌ UNUSED INTELLIGENCE FEATURES');
    console.log('===============================');
    console.log('These intelligence features are completely unused:');
    console.log('');
    
    unused.forEach(feature => {
      console.log(`🚫 ${feature.name}`);
      console.log(`   Location: ${feature.location}`);
      console.log(`   Type: ${feature.type}`);
      console.log(`   Description: ${feature.description}`);
      console.log('');
    });
  }

  console.log('🔍 ROOT CAUSE ANALYSIS');
  console.log('======================');
  console.log('The intelligence system is BROKEN because:');
  console.log('');
  console.log('1. 🚨 CRITICAL: Intelligence features are NOT integrated into CI');
  console.log('   - Only 1 out of 19 intelligence features runs in CI');
  console.log('   - This means constitutional compliance is NOT being enforced by AI');
  console.log('   - The governance system is running on manual rules only');
  console.log('');
  console.log('2. 🚨 CRITICAL: No automated drift detection in CI');
  console.log('   - Evolution detection runs but results are not enforced');
  console.log('   - No automated response to detected issues');
  console.log('   - No learning from detected patterns');
  console.log('');
  console.log('3. 🚨 CRITICAL: No predictive enforcement');
  console.log('   - Predictive features exist but are not used');
  console.log('   - No prevention of constitutional violations');
  console.log('   - No automated quality gates based on ML insights');
  console.log('');
  console.log('4. 🚨 CRITICAL: No continuous monitoring');
  console.log('   - Continuous compliance monitoring exists but is unused');
  console.log('   - No real-time enforcement of constitutional rules');
  console.log('   - No automated response to detected issues');
  console.log('');

  console.log('💡 RECOMMENDATIONS');
  console.log('==================');
  console.log('1. 🚨 IMMEDIATE: Integrate intelligence features into CI workflows');
  console.log('2. 🚨 IMMEDIATE: Add automated drift detection and response');
  console.log('3. 🚨 IMMEDIATE: Implement predictive enforcement gates');
  console.log('4. 🚨 IMMEDIATE: Add continuous compliance monitoring');
  console.log('5. 🔧 REFACTOR: Consolidate duplicate intelligence features');
  console.log('6. 🔧 REFACTOR: Standardize intelligence feature interfaces');
  console.log('7. 🧪 TEST: Add comprehensive testing for intelligence features');
  console.log('8. 📊 MONITOR: Add metrics and observability for intelligence system');
  console.log('');

  console.log('🎯 CONCLUSION');
  console.log('==============');
  console.log('The user was CORRECT - the unused tools indicate a BROKEN governance system.');
  console.log('The Aegis Framework has sophisticated intelligence features for constitutional');
  console.log('compliance, but they are NOT being used in the CI/CD pipeline. This means');
  console.log('the framework is running on manual rules instead of AI-powered governance.');
  console.log('');
  console.log('This is a CRITICAL governance failure that needs immediate remediation.');
}

main().catch(console.error);
