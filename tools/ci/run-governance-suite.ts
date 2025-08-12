#!/usr/bin/env tsx

/**
 * @aegisBlueprint: governance-runner
 * @version: 2.5.0
 * @mode: strict
 * @intent: Single governance runner that respects environment flags and emits JSON artifacts
 * @context: Centralized governance execution with kill-switch and group-based control
 * @model: claude-3-5-sonnet
 * @hash: 7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a
 */

import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

interface GovernanceResult {
  tool: string;
  status: 'pass' | 'fail' | 'error' | 'skipped';
  duration: number;
  findings: string[];
  exitCode: number;
  group: string;
  timestamp: string;
}

interface GovernanceArtifact {
  group: string;
  results: GovernanceResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    errors: number;
    skipped: number;
    duration: number;
  };
}

type GovernanceGroup = 'intelligence' | 'validation' | 'monitoring' | 'utilities';

class GovernanceRunner {
  private mode: 'off' | 'dry-run' | 'enforce';
  private enforceFlags: {
    validation: boolean;
    prevention: boolean;
    intelligence: boolean;
    monitoring: boolean;
  };
  private group: string;
  private artifactsDir: string;

  constructor() {
    this.mode = (process.env.AEGIS_GOVERNANCE_MODE as 'off' | 'dry-run' | 'enforce') || 'dry-run';
    this.enforceFlags = {
      validation: process.env.AEGIS_ENFORCE_VALIDATION === '1',
      prevention: process.env.AEGIS_ENFORCE_PREVENTION === '1',
      intelligence: process.env.AEGIS_ENFORCE_INTEL === '1',
      monitoring: process.env.AEGIS_ENFORCE_MONITORING === '1'
    };
    this.group = process.env.AEGIS_GROUP || 'all';
    this.artifactsDir = process.env.AEGIS_ARTIFACTS_DIR || '.aegis/artifacts';
    
    // Create artifacts directory
    mkdirSync(this.artifactsDir, { recursive: true });
  }

  /**
   * Run a governance tool and return result
   */
  private async runTool(tool: string, group: string): Promise<GovernanceResult> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    // Skip if mode is 'off'
    if (this.mode === 'off') {
      return {
        tool,
        status: 'skipped',
        duration: 0,
        findings: ['Governance mode is OFF'],
        exitCode: 0,
        group,
        timestamp
      };
    }

    // Determine if tool should enforce based on group and mode
    const shouldEnforce = this.shouldEnforceTool(group);
    const toolArguments = shouldEnforce ? ['--enforce'] : ['--dry-run'];

    try {
      const result = await this.executeTool(tool, toolArguments);
      const duration = Date.now() - startTime;

      return {
        tool,
        status: result.exitCode === 0 ? 'pass' : 'fail',
        duration,
        findings: result.findings,
        exitCode: result.exitCode,
        group,
        timestamp
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        tool,
        status: 'error',
        duration,
        findings: [error instanceof Error ? error.message : String(error)],
        exitCode: 1,
        group,
        timestamp
      };
    }
  }

  /**
   * Execute a governance tool
   */
  private executeTool(tool: string, toolArguments: string[]): Promise<{ exitCode: number; findings: string[] }> {
    return new Promise((resolve) => {
      const isTypeScript = tool.endsWith('.ts');
      const executable = isTypeScript ? 'bun' : 'node';
      const scriptArguments = isTypeScript ? [tool, ...toolArguments] : [tool, ...toolArguments];

      const child = spawn(executable, scriptArguments, {
        cwd: process.cwd(),
        stdio: ['ignore', 'pipe', 'pipe'],
        env: {
          ...process.env,
          AEGIS_GOVERNANCE_MODE: this.mode,
          AEGIS_ENFORCE_VALIDATION: this.enforceFlags.validation ? '1' : '0',
          AEGIS_ENFORCE_PREVENTION: this.enforceFlags.prevention ? '1' : '0',
          AEGIS_ENFORCE_INTEL: this.enforceFlags.intelligence ? '1' : '0',
          AEGIS_ENFORCE_MONITORING: this.enforceFlags.monitoring ? '1' : '0'
        }
      });

      let stdout = '';
      let stderr = '';
      let findings: string[] = [];

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        const exitCode = code || 0;
        
        // Parse findings from output
        if (stdout) {
          findings = [...findings, ...stdout.split('\n').filter(line => line.trim())];
        }
        if (stderr) {
          findings = [...findings, ...stderr.split('\n').filter(line => line.trim())];
        }

        resolve({ exitCode, findings });
      });
    });
  }

  /**
   * Determine if a tool should enforce based on group and mode
   */
  private shouldEnforceTool(group: string): boolean {
    if (this.mode === 'dry-run') return false;
    if (this.mode !== 'enforce') return false;

    switch (group) {
      case 'validation': {
        return this.enforceFlags.validation;
      }
      case 'prevention': {
        return this.enforceFlags.prevention;
      }
      case 'intelligence': {
        return this.enforceFlags.intelligence;
      }
      case 'monitoring': {
        return this.enforceFlags.monitoring;
      }
      default: {
        return false;
      }
    }
  }

  /**
   * Get tools for a specific group
   */
  private getToolsForGroup(group: string): string[] {
    const toolGroups: Record<GovernanceGroup, string[]> = {
      intelligence: [
        'tools/intelligent-pattern-detector.ts',
        'tools/predictive-compliance-monitor.ts',
        'tools/realtime-constitutional-enforcer.ts',
        'tools/continuous-compliance-monitor.ts',
        'tools/enhanced-evolution-detection.ts',
        'tools/framework-intelligence-certification.ts',
        'tools/intent-enforcement-engine.ts',
        'tools/systematic-prevention-validator.ts',
        'tools/evidence-based-validation.ts',
        'tools/evolution-learning-system.ts',
        'tools/framework-capability-mapper.ts',
        'tools/comprehensive-intelligence-testing.ts'
      ],
      validation: [
        'tools/validate-annotations.ts',
        'tools/validate-agent-drift-plan.cjs',
        'tools/validate-article-xi-abstraction.ts',
        'tools/check-evidence.ts',
        'tools/quality-preflight.ts',
        'tools/blueprint-coverage-auditor.ts'
      ],
      monitoring: [
        'tools/drift-monitoring-dashboard.ts',
        'tools/cursor-integration.ts',
        'tools/cursor-realtime-integration.ts',
        'tools/test-cursor-detection.ts'
      ],
      utilities: [
        'tools/team-config-loader.ts',
        'tools/update-framework-dashboard.ts'
      ]
    };

    return toolGroups[group as GovernanceGroup] || [];
  }

  /**
   * Run governance suite for a group
   */
  async runGroup(group: string): Promise<GovernanceArtifact> {
    console.log(`🔍 Running governance group: ${group}`);
    console.log(`📊 Mode: ${this.mode}`);
    console.log(`⚙️  Enforce flags:`, this.enforceFlags);

    const tools = this.getToolsForGroup(group);
    const results: GovernanceResult[] = [];
    const startTime = Date.now();

    for (const tool of tools) {
      console.log(`  Running: ${tool}`);
      const result = await this.runTool(tool, group);
      results.push(result);
      
      const status = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : result.status === 'error' ? '💥' : '⏭️';
      console.log(`    ${status} ${result.status} (${result.duration}ms)`);
    }

    const duration = Date.now() - startTime;
    const summary = {
      total: results.length,
      passed: results.filter(r => r.status === 'pass').length,
      failed: results.filter(r => r.status === 'fail').length,
      errors: results.filter(r => r.status === 'error').length,
      skipped: results.filter(r => r.status === 'skipped').length,
      duration
    };

    const artifact: GovernanceArtifact = {
      group,
      results,
      summary
    };

    // Write artifact to file
    const artifactFile = path.join(this.artifactsDir, `governance-${group}-${Date.now()}.json`);
    writeFileSync(artifactFile, JSON.stringify(artifact, null, 2));
    console.log(`📄 Artifact written: ${artifactFile}`);

    // Print summary
    console.log(`📊 Summary for ${group}:`);
    console.log(`  Total: ${summary.total}, Passed: ${summary.passed}, Failed: ${summary.failed}, Errors: ${summary.errors}, Skipped: ${summary.skipped}`);
    console.log(`  Duration: ${duration}ms`);

    return artifact;
  }

  /**
   * Run all groups
   */
  async runAll(): Promise<GovernanceArtifact[]> {
    const groups = ['intelligence', 'validation', 'monitoring', 'utilities'];
    const artifacts: GovernanceArtifact[] = [];

    for (const group of groups) {
      const artifact = await this.runGroup(group);
      artifacts.push(artifact);
    }

    return artifacts;
  }
}

async function main() {
  const runner = new GovernanceRunner();
  const group = process.env.AEGIS_GROUP;

  try {
    if (group && group !== 'all') {
      await runner.runGroup(group);
    } else {
      await runner.runAll();
    }
  } catch (error) {
    console.error('❌ Governance runner failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
