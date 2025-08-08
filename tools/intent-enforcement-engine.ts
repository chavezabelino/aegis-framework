/**
 * @aegisFrameworkVersion: 2.4.0
 * @intent: Real-time intent enforcement and agent drift prevention that catches systematic issues
 * @context: Prevents AI agents from deviating from constitutional principles and detects pattern-based drift
 * @mode: strict
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { TeamConfigLoader } from './team-config-loader.js';

interface IntentViolation {
  type: 'functional-drift' | 'constitutional-violation' | 'blueprint-deviation' | 'safety-bypass';
  severity: 'warning' | 'error' | 'critical';
  description: string;
  evidence: string;
  suggestedCorrection: string;
  blockExecution: boolean;
}

interface ExecutionIntent {
  primaryGoal: string;
  blueprintId?: string;
  mode: 'lean' | 'strict' | 'generative';
  expectedActions: string[];
  forbiddenActions: string[];
  safetyConstraints: string[];
}

interface CommandAnalysis {
  command: string;
  category: 'functional' | 'demonstrative' | 'test' | 'validation' | 'unsafe';
  intentAlignment: number; // 0-100 score
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  constitutionalCompliance: boolean;
}

export class IntentEnforcementEngine {
  private projectRoot: string;
  private currentIntent: ExecutionIntent | null = null;
  private violationHistory: IntentViolation[] = [];
  private commandHistory: CommandAnalysis[] = [];
  private configLoader: TeamConfigLoader;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.configLoader = TeamConfigLoader.getInstance(projectRoot);
  }

  /**
   * Set execution intent for current session
   */
  setExecutionIntent(intent: ExecutionIntent): void {
    this.currentIntent = intent;
    console.log(`🎯 Intent Set: ${intent.primaryGoal}`);
    console.log(`📋 Mode: ${intent.mode}`);
    if (intent.blueprintId) {
      console.log(`🏗️ Blueprint: ${intent.blueprintId}`);
    }
  }

  /**
   * Analyze command before execution for intent alignment
   */
  analyzeCommand(command: string, explanation?: string): CommandAnalysis {
    const analysis: CommandAnalysis = {
      command,
      category: this.categorizeCommand(command),
      intentAlignment: this.calculateIntentAlignment(command, explanation),
      riskLevel: this.assessRiskLevel(command),
      constitutionalCompliance: this.checkConstitutionalCompliance(command)
    };

    this.commandHistory.push(analysis);
    return analysis;
  }

  /**
   * Enforce intent before command execution
   */
  enforceIntent(command: string, explanation?: string): { allowed: boolean; violations: IntentViolation[] } {
    // Check if constitutional enforcement is enabled
    if (!this.configLoader.isRequiredFeatureEnabled('constitutionalEnforcement')) {
      console.log('📋 Constitutional enforcement disabled in team configuration');
      return { allowed: true, violations: [] };
    }

    if (!this.currentIntent) {
      return {
        allowed: false,
        violations: [{
          type: 'constitutional-violation',
          severity: 'critical',
          description: 'No execution intent set - violates traceability principle',
          evidence: 'Command attempted without constitutional intent declaration',
          suggestedCorrection: 'Set execution intent using setExecutionIntent() before any commands',
          blockExecution: true
        }]
      };
    }

    const analysis = this.analyzeCommand(command, explanation);
    const violations = this.detectViolations(analysis, explanation);
    
    // Apply team configuration mode
    const mode = this.configLoader.getConstitutionalMode();
    const blocking = this.configLoader.loadConfig()?.required.constitutionalEnforcement.blocking ?? true;
    
    // Adjust violations based on mode
    const adjustedViolations = violations.map(violation => ({
      ...violation,
      blockExecution: mode === 'strict' ? violation.blockExecution : 
                     mode === 'guided' ? violation.severity === 'critical' :
                     false // advisory mode - never block
    }));
    
    // Log enforcement decision
    this.logEnforcementDecision(command, analysis, adjustedViolations);
    
    return {
      allowed: adjustedViolations.filter(v => v.blockExecution).length === 0,
      violations
    };
  }

  /**
   * Categorize command type
   */
  private categorizeCommand(command: string): CommandAnalysis['category'] {
    // Echo commands are demonstrative, not functional
    if (command.trim().startsWith('echo ')) {
      return 'demonstrative';
    }

    // Build, test, validation commands
    if (command.includes('npm run') || command.includes('npm test') || command.includes('npm build')) {
      return 'functional';
    }

    // Validation tools
    if (command.includes('validate-') || command.includes('node tools/')) {
      return 'validation';
    }

    // Git operations
    if (command.startsWith('git ')) {
      return 'functional';
    }

    // File operations
    if (command.includes('rm ') || command.includes('mv ') || command.includes('cp ')) {
      return 'unsafe';
    }

    // Test runners
    if (command.includes('jest') || command.includes('test')) {
      return 'test';
    }

    return 'functional';
  }

  /**
   * Calculate intent alignment score
   */
  private calculateIntentAlignment(command: string, explanation?: string): number {
    if (!this.currentIntent) return 0;

    let score = 50; // Base score

    // Check if command aligns with expected actions
    const matchesExpected = this.currentIntent.expectedActions.some(action =>
      command.toLowerCase().includes(action.toLowerCase()) ||
      (explanation && explanation.toLowerCase().includes(action.toLowerCase()))
    );

    if (matchesExpected) score += 30;

    // Check if command violates forbidden actions
    const violatesForbidden = this.currentIntent.forbiddenActions.some(forbidden =>
      command.toLowerCase().includes(forbidden.toLowerCase())
    );

    if (violatesForbidden) score -= 40;

    // Demonstrative commands get heavy penalty for functional intent
    if (this.categorizeCommand(command) === 'demonstrative' && 
        this.currentIntent.primaryGoal.includes('test')) {
      score -= 30;
    }

    // Functional commands get bonus for functional intent
    if (this.categorizeCommand(command) === 'functional' && 
        this.currentIntent.primaryGoal.includes('test')) {
      score += 20;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Assess risk level of command
   */
  private assessRiskLevel(command: string): CommandAnalysis['riskLevel'] {
    if (command.includes('rm ') || command.includes('delete') || command.includes('DROP')) {
      return 'critical';
    }

    if (command.includes('sudo') || command.includes('chmod 777')) {
      return 'high';
    }

    if (command.startsWith('echo ') && command.includes('Testing')) {
      return 'medium'; // Echo commands masquerading as tests
    }

    if (command.includes('npm install') || command.includes('git push')) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Check constitutional compliance
   */
  private checkConstitutionalCompliance(command: string): boolean {
    // Commands must have clear purpose (not just demonstrative)
    if (command.startsWith('echo ') && !command.includes('actual')) {
      return false;
    }

    // Commands modifying constitutional files require special handling
    if (command.includes('CONSTITUTION.md') || command.includes('framework-core-v')) {
      return false; // Requires special approval
    }

    // Detect systematic issue patterns like version documentation drift
    const systematicIssuePatterns = [
      /git\s+commit.*-m.*version/i,
      /git\s+commit.*-m.*update/i,
      /git\s+commit.*-m.*fix/i
    ];

    // Detect version-related commits without validation
    if (systematicIssuePatterns.some(pattern => pattern.test(command))) {
      console.log('🚨 Systematic issue pattern detected: Version-related commit');
      console.log('💡 Recommendation: Run version consistency validation before commits');
      
      // Record this as a potential drift pattern
      this.violationHistory.push({
        type: 'constitutional-violation',
        severity: 'warning',
        description: 'Version-related commit without prior validation - systematic drift pattern detected',
        evidence: `Command: ${command}`,
        suggestedCorrection: 'Run "node tools/validate-version-consistency.ts" before version-related commits',
        blockExecution: false
      });
    }

    return true;
  }

  /**
   * Detect violations in command analysis
   */
  private detectViolations(analysis: CommandAnalysis, explanation?: string): IntentViolation[] {
    const violations: IntentViolation[] = [];

    // Low intent alignment violation
    if (analysis.intentAlignment < 60) {
      violations.push({
        type: 'blueprint-deviation',
        severity: 'warning',
        description: `Command has low intent alignment (${analysis.intentAlignment}%)`,
        evidence: `Command: ${analysis.command}`,
        suggestedCorrection: 'Ensure command directly serves the stated execution intent',
        blockExecution: false
      });
    }

    // Demonstrative command for functional intent
    if (analysis.category === 'demonstrative' && 
        this.currentIntent?.primaryGoal.includes('test')) {
      violations.push({
        type: 'functional-drift',
        severity: 'error',
        description: 'Using demonstrative command when functional action is required',
        evidence: `Echo command: ${analysis.command}`,
        suggestedCorrection: 'Replace echo with actual functional test command',
        blockExecution: true
      });
    }

    // Constitutional compliance violation
    if (!analysis.constitutionalCompliance) {
      violations.push({
        type: 'constitutional-violation',
        severity: 'critical',
        description: 'Command violates constitutional principles',
        evidence: `Non-compliant command: ${analysis.command}`,
        suggestedCorrection: 'Use constitutional-compliant alternative or request approval',
        blockExecution: true
      });
    }

    // High risk without justification
    if (analysis.riskLevel === 'critical' && (!explanation || explanation.length < 20)) {
      violations.push({
        type: 'safety-bypass',
        severity: 'critical',
        description: 'High-risk command without adequate justification',
        evidence: `Risk level: ${analysis.riskLevel}, Command: ${analysis.command}`,
        suggestedCorrection: 'Provide detailed justification for high-risk operations',
        blockExecution: true
      });
    }

    return violations;
  }

  /**
   * Log enforcement decision
   */
  private logEnforcementDecision(
    command: string, 
    analysis: CommandAnalysis, 
    violations: IntentViolation[]
  ): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      command,
      analysis,
      violations,
      intent: this.currentIntent?.primaryGoal || 'none',
      decision: violations.filter(v => v.blockExecution).length === 0 ? 'ALLOWED' : 'BLOCKED'
    };

    // Write to enforcement log
    const logPath = path.join(this.projectRoot, 'logs', 'intent-enforcement.log');
    const logDir = path.dirname(logPath);
    
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');

    // Console output
    const statusIcon = logEntry.decision === 'ALLOWED' ? '✅' : '🚫';
    console.log(`${statusIcon} ${logEntry.decision}: ${command}`);
    
    if (violations.length > 0) {
      violations.forEach(v => {
        const icon = v.severity === 'critical' ? '🚨' : v.severity === 'error' ? '❌' : '⚠️';
        console.log(`   ${icon} ${v.description}`);
        console.log(`      💡 ${v.suggestedCorrection}`);
      });
    }
  }

  /**
   * Generate intent violation report
   */
  generateViolationReport(): string {
    const allViolations = this.violationHistory.concat(
      this.commandHistory.flatMap(cmd => this.detectViolations(cmd))
    );

    const grouped = allViolations.reduce((acc, violation) => {
      if (!acc[violation.type]) acc[violation.type] = [];
      acc[violation.type].push(violation);
      return acc;
    }, {} as Record<string, IntentViolation[]>);

    let report = '# Intent Enforcement Violation Report\n\n';
    report += `**Generated**: ${new Date().toISOString()}\n`;
    report += `**Session Commands**: ${this.commandHistory.length}\n`;
    report += `**Total Violations**: ${allViolations.length}\n\n`;

    for (const [type, violations] of Object.entries(grouped)) {
      report += `## ${type.toUpperCase()}\n\n`;
      violations.forEach((v, index) => {
        report += `### Violation ${index + 1}\n`;
        report += `- **Severity**: ${v.severity}\n`;
        report += `- **Description**: ${v.description}\n`;
        report += `- **Evidence**: ${v.evidence}\n`;
        report += `- **Suggested Correction**: ${v.suggestedCorrection}\n\n`;
      });
    }

    return report;
  }

  /**
   * Check if current session has critical violations
   */
  hasCriticalViolations(): boolean {
    return this.violationHistory.some(v => v.severity === 'critical');
  }

  /**
   * Reset enforcement state
   */
  reset(): void {
    this.currentIntent = null;
    this.violationHistory = [];
    this.commandHistory = [];
    console.log('🔄 Intent enforcement engine reset');
  }
}

/**
 * Pre-execution hook for AI agents
 * Call this before any command execution
 */
export function enforceIntentBeforeExecution(
  command: string,
  explanation: string,
  intent: ExecutionIntent
): { proceed: boolean; violations: IntentViolation[] } {
  const engine = new IntentEnforcementEngine();
  engine.setExecutionIntent(intent);
  
  const result = engine.enforceIntent(command, explanation);
  
  if (!result.allowed) {
    console.log('\n🚫 EXECUTION BLOCKED - Constitutional Violation Detected');
    console.log('📋 Violations:');
    result.violations.forEach(v => {
      console.log(`   ❌ ${v.description}`);
      console.log(`      💡 ${v.suggestedCorrection}`);
    });
    console.log('\n🏛️ Framework requires adherence to constitutional principles.');
  }
  
  return { proceed: result.allowed, violations: result.violations };
}

/**
 * CLI interface for intent enforcement testing
 */
export async function testIntentEnforcement(): Promise<void> {
  const engine = new IntentEnforcementEngine();
  
  // Test scenario: Agent claims to test but uses echo commands
  console.log('🧪 Testing Intent Enforcement Engine\n');
  
  // Set functional testing intent
  engine.setExecutionIntent({
    primaryGoal: 'test evolution story detection system',
    mode: 'strict',
    expectedActions: ['run actual tests', 'validate functionality', 'check outputs'],
    forbiddenActions: ['echo only', 'demonstrative commands'],
    safetyConstraints: ['must produce real results', 'must validate actual functionality']
  });
  
  // Test various commands
  const testCommands = [
    {
      command: 'echo "Testing evolution story detection..."',
      explanation: 'Running evolution story detection test'
    },
    {
      command: 'node tools/detect-evolution-stories.ts',
      explanation: 'Actually testing the evolution story detection functionality'
    },
    {
      command: 'npm test',
      explanation: 'Running the full test suite'
    },
    {
      command: 'rm -rf node_modules',
      explanation: 'Cleaning dependencies'
    }
  ];
  
  for (const test of testCommands) {
    console.log(`\n🔍 Analyzing: ${test.command}`);
    const result = engine.enforceIntent(test.command, test.explanation);
    
    if (!result.allowed) {
      console.log('   🚫 BLOCKED');
    } else {
      console.log('   ✅ ALLOWED');
    }
  }
  
  // Generate report
  console.log('\n📊 Session Report:');
  console.log(engine.generateViolationReport());
}

// Export types for integration
export type { IntentViolation, ExecutionIntent, CommandAnalysis };

// Run CLI if called directly
if (process.argv[1] && process.argv[1].endsWith('intent-enforcement-engine.ts')) {
  testIntentEnforcement();
}
