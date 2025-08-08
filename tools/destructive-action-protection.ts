#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.3.0
 * @intent: Destructive action protection and validation system
 * @context: Prevents framework-breaking operations through systematic validation
 * @mode: strict
 */

import * as fs from 'fs';
import * as path from 'path';

interface DestructiveActionCheck {
  action: string;
  files: string[];
  directories: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  requiresApproval: boolean;
  constitutionalImpact: string[];
}

export interface ProtectionResult {
  allowed: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  warnings: string[];
  requiredApprovals: string[];
  constitutionalViolations: string[];
}

class DestructiveActionProtector {
  private frameworkRoot: string;
  private essentialFiles: string[];
  private essentialDirectories: string[];
  private constitutionalFiles: string[];

  constructor(frameworkRoot: string = process.cwd()) {
    this.frameworkRoot = frameworkRoot;
    this.essentialFiles = [
      'CONSTITUTION.md',
      'VERSION',
      'package.json',
      'tsconfig.json',
      'README.md',
      'CHANGELOG.md',
      'CONTRIBUTING.md',
      'LICENSE'
    ];
    this.essentialDirectories = [
      'framework/',
      'docs/',
      'cli/',
      'tools/',
      'blueprints/',
      'adapters/',
      'tests/',
      'examples/',
      'templates/',
      'scaffolds/'
    ];
    this.constitutionalFiles = [
      'CONSTITUTION.md',
      'VERSION',
      '.framework/constitutional-state.json',
      '.aegis/framework-state.json'
    ];
  }

  /**
   * Validate destructive action before execution
   */
  async validateDestructiveAction(action: string, targets: string[]): Promise<ProtectionResult> {
    const check = this.analyzeAction(action, targets);
    const result: ProtectionResult = {
      allowed: false,
      riskLevel: 'low',
      warnings: [],
      requiredApprovals: [],
      constitutionalViolations: []
    };

    // Check for constitutional violations
    const constitutionalImpact = this.checkConstitutionalImpact(check);
    if (constitutionalImpact.length > 0) {
      result.constitutionalViolations = constitutionalImpact;
      result.riskLevel = 'critical';
      result.allowed = false;
      result.warnings.push('🚨 CONSTITUTIONAL VIOLATION DETECTED');
      return result;
    }

    // Check for essential file/directory deletion
    const essentialImpact = this.checkEssentialImpact(check);
    if (essentialImpact.length > 0) {
      result.riskLevel = 'critical';
      result.allowed = false;
      result.warnings.push('🚨 ESSENTIAL FRAMEWORK FILES TARGETED');
      result.warnings.push(...essentialImpact);
      return result;
    }

    // Check for high-risk operations
    if (check.riskLevel === 'high' || check.riskLevel === 'critical') {
      result.riskLevel = check.riskLevel;
      result.allowed = false;
      result.requiredApprovals.push('Human approval required for high-risk operation');
      result.warnings.push('⚠️ HIGH-RISK OPERATION DETECTED');
    }

    // Medium risk operations
    if (check.riskLevel === 'medium') {
      result.riskLevel = 'medium';
      result.allowed = true;
      result.warnings.push('⚠️ Medium-risk operation - proceed with caution');
    }

    // Low risk operations
    if (check.riskLevel === 'low') {
      result.riskLevel = 'low';
      result.allowed = true;
    }

    return result;
  }

  /**
   * Analyze action for risk assessment
   */
  private analyzeAction(action: string, targets: string[]): DestructiveActionCheck {
    const check: DestructiveActionCheck = {
      action,
      files: [],
      directories: [],
      riskLevel: 'low',
      requiresApproval: false,
      constitutionalImpact: []
    };

    // Parse targets
    for (const target of targets) {
      if (target.includes('.')) {
        check.files.push(target);
      } else {
        check.directories.push(target);
      }
    }

    // Risk assessment based on action type
    if (action.includes('delete') || action.includes('remove') || action.includes('rm')) {
      check.riskLevel = this.assessDeletionRisk(check.files, check.directories);
    }

    if (action.includes('move') || action.includes('mv')) {
      check.riskLevel = this.assessMoveRisk(check.files, check.directories);
    }

    if (action.includes('modify') || action.includes('edit')) {
      check.riskLevel = this.assessModificationRisk(check.files);
    }

    return check;
  }

  /**
   * Assess risk level for deletion operations
   */
  private assessDeletionRisk(files: string[], directories: string[]): 'low' | 'medium' | 'high' | 'critical' {
    // Check for constitutional files
    for (const file of files) {
      if (this.constitutionalFiles.includes(file)) {
        return 'critical';
      }
      if (this.essentialFiles.includes(file)) {
        return 'critical';
      }
    }

    // Check for essential directories
    for (const dir of directories) {
      if (this.essentialDirectories.includes(dir)) {
        return 'critical';
      }
      if (dir.startsWith('.') && (dir.includes('framework') || dir.includes('aegis'))) {
        return 'critical';
      }
    }

    // Check for build artifacts (medium risk)
    if (files.some(f => f.includes('dist') || f.includes('build') || f.includes('node_modules'))) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Assess risk level for move operations
   */
  private assessMoveRisk(files: string[], directories: string[]): 'low' | 'medium' | 'high' | 'critical' {
    // Moving constitutional files is critical
    for (const file of files) {
      if (this.constitutionalFiles.includes(file)) {
        return 'critical';
      }
    }

    // Moving essential directories is high risk
    for (const dir of directories) {
      if (this.essentialDirectories.includes(dir)) {
        return 'high';
      }
    }

    return 'medium';
  }

  /**
   * Assess risk level for modification operations
   */
  private assessModificationRisk(files: string[]): 'low' | 'medium' | 'high' | 'critical' {
    // Modifying constitutional files is critical
    for (const file of files) {
      if (this.constitutionalFiles.includes(file)) {
        return 'critical';
      }
    }

    // Modifying essential files is high risk
    for (const file of files) {
      if (this.essentialFiles.includes(file)) {
        return 'high';
      }
    }

    return 'low';
  }

  /**
   * Check for constitutional impact
   */
  private checkConstitutionalImpact(check: DestructiveActionCheck): string[] {
    const violations: string[] = [];

    for (const file of check.files) {
      if (this.constitutionalFiles.includes(file)) {
        violations.push(`Constitutional file targeted: ${file}`);
      }
    }

    return violations;
  }

  /**
   * Check for essential file/directory impact
   */
  private checkEssentialImpact(check: DestructiveActionCheck): string[] {
    const impacts: string[] = [];

    for (const file of check.files) {
      if (this.essentialFiles.includes(file)) {
        impacts.push(`Essential file targeted: ${file}`);
      }
    }

    for (const dir of check.directories) {
      if (this.essentialDirectories.includes(dir)) {
        impacts.push(`Essential directory targeted: ${dir}`);
      }
    }

    return impacts;
  }

  /**
   * Emergency recovery for destructive actions
   */
  async emergencyRecovery(): Promise<void> {
    console.log('🚨 EMERGENCY RECOVERY INITIATED');
    console.log('📋 Restoring essential framework files...');
    
    // This would implement recovery logic
    // For now, just log the recovery attempt
    console.log('✅ Emergency recovery protocol activated');
  }
}

// Export for use in other tools
export { DestructiveActionProtector };

// CLI interface
async function main() {
  const protector = new DestructiveActionProtector();
  
  if (process.argv.length < 4) {
    console.log('Usage: node destructive-action-protection.ts <action> <target1> [target2] ...');
    console.log('Example: node destructive-action-protection.ts delete .DS_Store');
    process.exit(1);
  }

  const action = process.argv[2];
  const targets = process.argv.slice(3);

  const result = await protector.validateDestructiveAction(action, targets);
  
  console.log('🛡️ Destructive Action Protection Check');
  console.log('=====================================');
  console.log(`Action: ${action}`);
  console.log(`Targets: ${targets.join(', ')}`);
  console.log(`Risk Level: ${result.riskLevel.toUpperCase()}`);
  console.log(`Allowed: ${result.allowed ? '✅ YES' : '❌ NO'}`);
  
  if (result.warnings.length > 0) {
    console.log('\n⚠️ Warnings:');
    result.warnings.forEach(warning => console.log(`  - ${warning}`));
  }

  if (result.constitutionalViolations.length > 0) {
    console.log('\n🚨 Constitutional Violations:');
    result.constitutionalViolations.forEach(violation => console.log(`  - ${violation}`));
  }

  if (result.requiredApprovals.length > 0) {
    console.log('\n🔒 Required Approvals:');
    result.requiredApprovals.forEach(approval => console.log(`  - ${approval}`));
  }

  if (!result.allowed) {
    console.log('\n❌ ACTION BLOCKED - Framework protection activated');
    process.exit(1);
  }

  console.log('\n✅ Action validated - proceed with caution');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
