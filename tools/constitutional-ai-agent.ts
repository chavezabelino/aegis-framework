/**
 * @aegisFrameworkVersion 2.4.0-alpha-dev
 * @intent AI Agent wrapper with built-in constitutional enforcement
 * @context Prevents agent drift by enforcing intent and constitutional compliance before every action
 */

import { IntentEnforcementEngine, ExecutionIntent, IntentViolation } from './intent-enforcement-engine.ts';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface AgentAction {
  type: 'command' | 'file-write' | 'file-edit' | 'validation' | 'test';
  description: string;
  command?: string;
  filePath?: string;
  content?: string;
  reasoning: string;
}

interface AgentSession {
  sessionId: string;
  startTime: string;
  intent: ExecutionIntent;
  actions: AgentAction[];
  violations: IntentViolation[];
  status: 'active' | 'completed' | 'violated' | 'emergency-stop';
}

export class ConstitutionalAIAgent {
  private enforcement: IntentEnforcementEngine;
  private session: AgentSession;
  private projectRoot: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.enforcement = new IntentEnforcementEngine(projectRoot);
    this.session = this.initializeSession();
  }

  /**
   * Initialize new agent session
   */
  private initializeSession(): AgentSession {
    return {
      sessionId: `session-${Date.now()}`,
      startTime: new Date().toISOString(),
      intent: {
        primaryGoal: 'undefined',
        mode: 'strict',
        expectedActions: [],
        forbiddenActions: ['non-functional commands', 'demonstrative only'],
        safetyConstraints: ['constitutional compliance', 'traceability', 'functional purpose']
      },
      actions: [],
      violations: [],
      status: 'active'
    };
  }

  /**
   * Set agent intent and constitutional constraints
   */
  setIntent(intent: Partial<ExecutionIntent>): void {
    this.session.intent = { ...this.session.intent, ...intent };
    this.enforcement.setExecutionIntent(this.session.intent);
    
    console.log('🤖 Constitutional AI Agent Initialized');
    console.log(`📋 Session: ${this.session.sessionId}`);
    console.log(`🎯 Goal: ${this.session.intent.primaryGoal}`);
    console.log(`⚖️ Mode: ${this.session.intent.mode}`);
  }

  /**
   * Execute command with constitutional enforcement
   */
  async executeCommand(command: string, reasoning: string): Promise<{ success: boolean; output?: string; violations: IntentViolation[] }> {
    const action: AgentAction = {
      type: 'command',
      description: `Execute: ${command}`,
      command,
      reasoning
    };

    // Constitutional pre-check
    const enforcement = this.enforcement.enforceIntent(command, reasoning);
    
    if (!enforcement.allowed) {
      this.handleViolations(enforcement.violations);
      return { success: false, violations: enforcement.violations };
    }

    // Execute command if constitutionally compliant
    try {
      console.log(`🔨 Executing: ${command}`);
      const output = execSync(command, { 
        cwd: this.projectRoot, 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      action.description = `✅ Executed: ${command}`;
      this.session.actions.push(action);
      
      return { success: true, output, violations: [] };
    } catch (error) {
      action.description = `❌ Failed: ${command}`;
      this.session.actions.push(action);
      
      console.error(`❌ Command failed: ${error instanceof Error ? error.message : String(error)}`);
      return { success: false, violations: [] };
    }
  }

  /**
   * Write file with constitutional validation
   */
  async writeFile(filePath: string, content: string, reasoning: string): Promise<{ success: boolean; violations: IntentViolation[] }> {
    const action: AgentAction = {
      type: 'file-write',
      description: `Write file: ${filePath}`,
      filePath,
      content,
      reasoning
    };

    // Check if file modification aligns with intent
    const pseudoCommand = `create file ${filePath}`;
    const enforcement = this.enforcement.enforceIntent(pseudoCommand, reasoning);
    
    if (!enforcement.allowed) {
      this.handleViolations(enforcement.violations);
      return { success: false, violations: enforcement.violations };
    }

    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, content);
      action.description = `✅ Created: ${filePath}`;
      this.session.actions.push(action);
      
      console.log(`📄 File created: ${filePath}`);
      return { success: true, violations: [] };
    } catch (error) {
      action.description = `❌ Failed to create: ${filePath}`;
      this.session.actions.push(action);
      
      console.error(`❌ File creation failed: ${error instanceof Error ? error.message : String(error)}`);
      return { success: false, violations: [] };
    }
  }

  /**
   * Run functional test with verification
   */
  async runFunctionalTest(testCommand: string, reasoning: string): Promise<{ success: boolean; output?: string; violations: IntentViolation[] }> {
    // Validate this is actually a functional test
    if (testCommand.trim().startsWith('echo ')) {
      const violation: IntentViolation = {
        type: 'functional-drift',
        severity: 'critical',
        description: 'Attempting to use echo command for functional test',
        evidence: `Command: ${testCommand}`,
        suggestedCorrection: 'Use actual test runner or validation tool',
        blockExecution: true
      };
      
      this.handleViolations([violation]);
      return { success: false, violations: [violation] };
    }

    return this.executeCommand(testCommand, reasoning);
  }

  /**
   * Validate framework state
   */
  async validateFrameworkState(): Promise<{ constitutional: boolean; violations: IntentViolation[] }> {
    console.log('🏛️ Running constitutional validation...');
    
    const validations = [
      { command: 'node tools/validate-constitution.ts', name: 'Constitution' },
      { command: 'node tools/validate-template-quality.ts', name: 'Template Quality' },
      { command: 'npm run build', name: 'Build' },
      { command: 'npm test', name: 'Tests' }
    ];

    let constitutional = true;
    const violations: IntentViolation[] = [];

    for (const validation of validations) {
      try {
        const result = await this.executeCommand(validation.command, `Validate ${validation.name}`);
        if (!result.success) {
          constitutional = false;
          violations.push({
            type: 'constitutional-violation',
            severity: 'error',
            description: `${validation.name} validation failed`,
            evidence: `Command failed: ${validation.command}`,
            suggestedCorrection: `Fix ${validation.name} issues before proceeding`,
            blockExecution: false
          });
        }
      } catch (error) {
        constitutional = false;
        violations.push({
          type: 'constitutional-violation',
          severity: 'error',
          description: `${validation.name} validation error`,
          evidence: `Error: ${error instanceof Error ? error.message : String(error)}`,
          suggestedCorrection: `Investigate and fix ${validation.name} validation`,
          blockExecution: false
        });
      }
    }

    return { constitutional, violations };
  }

  /**
   * Handle constitutional violations
   */
  private handleViolations(violations: IntentViolation[]): void {
    this.session.violations.push(...violations);
    
    const criticalViolations = violations.filter(v => v.severity === 'critical');
    if (criticalViolations.length > 0) {
      this.session.status = 'violated';
      console.log('\n🚨 CRITICAL CONSTITUTIONAL VIOLATION DETECTED');
      console.log('🛑 Agent session suspended for constitutional review');
      
      // Generate violation report
      this.generateViolationReport();
    }
  }

  /**
   * Generate comprehensive session report
   */
  generateSessionReport(): string {
    const report = `# Constitutional AI Agent Session Report

**Session ID**: ${this.session.sessionId}
**Start Time**: ${this.session.startTime}
**End Time**: ${new Date().toISOString()}
**Status**: ${this.session.status}
**Intent**: ${this.session.intent.primaryGoal}

## Session Intent
- **Primary Goal**: ${this.session.intent.primaryGoal}
- **Mode**: ${this.session.intent.mode}
- **Expected Actions**: ${this.session.intent.expectedActions.join(', ')}
- **Forbidden Actions**: ${this.session.intent.forbiddenActions.join(', ')}

## Actions Performed
${this.session.actions.map((action, index) => `
${index + 1}. **${action.type}**: ${action.description}
   - **Reasoning**: ${action.reasoning}
   ${action.command ? `- **Command**: \`${action.command}\`` : ''}
   ${action.filePath ? `- **File**: ${action.filePath}` : ''}
`).join('')}

## Constitutional Violations
${this.session.violations.length === 0 ? 'None detected ✅' : this.session.violations.map((v, index) => `
${index + 1}. **${v.type}** (${v.severity})
   - **Description**: ${v.description}
   - **Evidence**: ${v.evidence}
   - **Correction**: ${v.suggestedCorrection}
`).join('')}

## Summary
- **Total Actions**: ${this.session.actions.length}
- **Violations**: ${this.session.violations.length}
- **Critical Violations**: ${this.session.violations.filter(v => v.severity === 'critical').length}
- **Constitutional Status**: ${this.session.violations.length === 0 ? '✅ Compliant' : '⚠️ Violations Detected'}

---
*Generated by Constitutional AI Agent Framework v2.0.0-alpha-dev*
`;

    return report;
  }

  /**
   * Generate violation report
   */
  private generateViolationReport(): void {
    const report = this.generateSessionReport();
    const reportPath = path.join(this.projectRoot, 'logs', 'constitutional-violations', `${this.session.sessionId}.md`);
    
    const dir = path.dirname(reportPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(reportPath, report);
    console.log(`📋 Violation report saved: ${reportPath}`);
  }

  /**
   * Complete session and generate final report
   */
  completeSession(): string {
    this.session.status = 'completed';
    const report = this.generateSessionReport();
    
    console.log('\n🏁 Constitutional AI Agent Session Complete');
    console.log(`📊 Actions: ${this.session.actions.length}`);
    console.log(`⚖️ Violations: ${this.session.violations.length}`);
    console.log(`📋 Status: ${this.session.status}`);
    
    return report;
  }
}

/**
 * Factory function for creating constitutional AI agents
 */
export function createConstitutionalAgent(intent: ExecutionIntent, projectRoot?: string): ConstitutionalAIAgent {
  const agent = new ConstitutionalAIAgent(projectRoot);
  agent.setIntent(intent);
  return agent;
}

/**
 * Demo function showing proper constitutional agent usage
 */
export async function demonstrateConstitutionalAgent(): Promise<void> {
  console.log('🧪 Demonstrating Constitutional AI Agent\n');
  
  // Create agent with proper intent
  const agent = createConstitutionalAgent({
    primaryGoal: 'validate evolution story detection system functionality',
    mode: 'strict',
    expectedActions: ['run actual tests', 'validate tools', 'check framework state'],
    forbiddenActions: ['echo-only commands', 'demonstrative actions'],
    safetyConstraints: ['constitutional compliance', 'functional verification', 'real outputs']
  });

  // Demonstrate proper testing approach
  console.log('🔍 Testing with constitutional enforcement:\n');
  
  // This should be BLOCKED - echo command for functional test
  console.log('❌ Attempting non-functional test...');
  const badResult = await agent.runFunctionalTest(
    'echo "Testing evolution story detection..."',
    'Testing the evolution story system'
  );
  
  if (!badResult.success) {
    console.log('   ✅ Constitutional enforcement blocked non-functional command\n');
  }
  
  // This should be ALLOWED - actual functional test
  console.log('✅ Attempting functional test...');
  const goodResult = await agent.executeCommand(
    'node tools/detect-evolution-stories.ts',
    'Actually testing the evolution story detection functionality'
  );
  
  if (goodResult.success) {
    console.log('   ✅ Constitutional enforcement allowed functional command\n');
  }
  
  // Validate framework state
  console.log('🏛️ Validating constitutional compliance...');
  const validation = await agent.validateFrameworkState();
  console.log(`   Constitutional status: ${validation.constitutional ? '✅ Compliant' : '❌ Violations'}\n`);
  
  // Complete session
  const report = agent.completeSession();
  console.log('📋 Session Report Generated');
  
  return;
}

// Run demo if called directly
if (process.argv[1] && process.argv[1].endsWith('constitutional-ai-agent.ts')) {
  demonstrateConstitutionalAgent();
}
