#!/usr/bin/env node

/**
 * Aegis Traceability Gate
 *
 * Constitutional enforcement tool preventing claims without code lineage.
 * Verifies blueprint→contract→artifact trace before allowing "implemented" status.
 *
 * @aegisFrameworkVersion: 2.5.0
 * @intent: Prevent Article I §1 violations through automated verification
 * @context: Response to EVS-2025-01-15-002 constitutional violation
 * @constitutionalAuthority: CONSTITUTION.md Article I Section 1 (Traceability)
 */

import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import yaml from 'js-yaml';
import { execSync } from 'child_process';

interface TraceabilityRecord {
  featureId: string;
  claimedStatus: 'implemented' | 'architected' | 'roadmap';
  blueprintPath?: string;
  contractPath?: string;
  artifactPaths: string[];
  verificationStatus: 'verified' | 'partial' | 'failed';
  evidence: TraceabilityEvidence;
  violations: string[];
}

interface TraceabilityEvidence {
  blueprintExists: boolean;
  contractExists: boolean;
  artifactsExist: string[];
  artifactsMissing: string[];
  cliCommandExists: boolean;
  testsExist: boolean;
  documentationExists: boolean;
  lastVerified: string;
  commitHash: string;
}

interface CapabilityClaim {
  id: string;
  name: string;
  status: 'implemented' | 'architected' | 'roadmap';
  description: string;
  blueprintId?: string;
  cliCommand?: string;
  expectedArtifacts: string[];
  testPaths?: string[];
}

class TraceabilityGate {
  private frameworkRoot: string;
  private violations: string[] = [];

  constructor(frameworkRoot: string = process.cwd()) {
    this.frameworkRoot = frameworkRoot;
  }

  async verifyCapabilityClaim(claim: CapabilityClaim): Promise<TraceabilityRecord> {
    console.log(`🔍 Verifying: ${claim.name} (${claim.status})`);

    const record: TraceabilityRecord = {
      featureId: claim.id,
      claimedStatus: claim.status,
      artifactPaths: [],
      verificationStatus: 'failed',
      evidence: {
        blueprintExists: false,
        contractExists: false,
        artifactsExist: [],
        artifactsMissing: [],
        cliCommandExists: false,
        testsExist: false,
        documentationExists: false,
        lastVerified: new Date().toISOString(),
        commitHash: this.getCommitHash(),
      },
      violations: [],
    };

    // Step 1: Verify blueprint exists if claimed
    if (claim.blueprintId) {
      const blueprintPath = path.join(this.frameworkRoot, 'blueprints', claim.blueprintId, 'blueprint.yaml');
      if (fs.existsSync(blueprintPath)) {
        record.blueprintPath = blueprintPath;
        record.evidence.blueprintExists = true;
        console.log(`  ✅ Blueprint found: ${blueprintPath}`);
      } else {
        record.violations.push(`Blueprint not found: ${blueprintPath}`);
        console.log(`  ❌ Blueprint missing: ${blueprintPath}`);
      }
    }

    // Step 2: Verify CLI command exists if claimed as implemented
    if (claim.status === 'implemented' && claim.cliCommand) {
      const cliPath = path.join(this.frameworkRoot, 'cli', `${claim.cliCommand}.ts`);
      if (fs.existsSync(cliPath)) {
        record.evidence.cliCommandExists = true;
        record.artifactPaths.push(cliPath);
        console.log(`  ✅ CLI command found: ${cliPath}`);
      } else {
        record.violations.push(`CLI command not found: ${cliPath}`);
        console.log(`  ❌ CLI command missing: ${cliPath}`);
      }
    }

    // Step 3: Verify expected artifacts exist
    for (const expectedPath of claim.expectedArtifacts) {
      const fullPath = path.join(this.frameworkRoot, expectedPath);
      if (fs.existsSync(fullPath)) {
        record.evidence.artifactsExist.push(expectedPath);
        record.artifactPaths.push(fullPath);
        console.log(`  ✅ Artifact found: ${expectedPath}`);
      } else {
        record.evidence.artifactsMissing.push(expectedPath);
        record.violations.push(`Expected artifact not found: ${expectedPath}`);
        console.log(`  ❌ Artifact missing: ${expectedPath}`);
      }
    }

    // Step 4: Verify tests exist for implemented features
    if (claim.status === 'implemented' && claim.testPaths) {
      for (const testPath of claim.testPaths) {
        const fullTestPath = path.join(this.frameworkRoot, testPath);
        if (fs.existsSync(fullTestPath)) {
          record.evidence.testsExist = true;
          console.log(`  ✅ Tests found: ${testPath}`);
        } else {
          record.violations.push(`Tests not found: ${testPath}`);
          console.log(`  ❌ Tests missing: ${testPath}`);
        }
      }
    }

    // Step 5: Constitutional compliance check for "implemented" claims
    if (claim.status === 'implemented') {
      if (record.violations.length === 0) {
        record.verificationStatus = 'verified';
        console.log(`  ✅ VERIFIED: ${claim.name} has complete traceability`);
      } else {
        record.verificationStatus = 'failed';
        record.violations.unshift(`CONSTITUTIONAL VIOLATION: Claimed "implemented" without complete code lineage`);
        console.log(`  ❌ FAILED: ${claim.name} violates Article I §1 (Traceability)`);
        this.violations.push(`${claim.name}: ${record.violations.join(', ')}`);
      }
    } else if (claim.status === 'architected') {
      // For architected features, allow partial implementation
      if (record.evidence.artifactsExist.length > 0) {
        record.verificationStatus = 'partial';
        console.log(`  🚧 PARTIAL: ${claim.name} has architectural foundation`);
      } else {
        record.verificationStatus = 'failed';
        console.log(`  ❌ FAILED: ${claim.name} has no verifiable artifacts`);
      }
    } else {
      // Roadmap items don't need verification
      record.verificationStatus = 'verified';
      console.log(`  📋 ROADMAP: ${claim.name} correctly marked as future work`);
    }

    return record;
  }

  async auditCapabilityClaims(claimsPath: string): Promise<{
    passed: boolean;
    totalClaims: number;
    verifiedClaims: number;
    violations: string[];
    auditReport: TraceabilityRecord[];
  }> {
    console.log(`\n🏛️  Aegis Traceability Gate - Constitutional Enforcement`);
    console.log(`📋 Auditing capability claims: ${claimsPath}`);
    console.log(`⚖️  Authority: CONSTITUTION.md Article I §1 (Traceability)\n`);

    // Load capability claims
    const claims = await this.loadCapabilityClaims(claimsPath);
    const auditReport: TraceabilityRecord[] = [];

    for (const claim of claims) {
      const record = await this.verifyCapabilityClaim(claim);
      auditReport.push(record);
    }

    const verifiedClaims = auditReport.filter(r => r.verificationStatus === 'verified').length;
    const passed = this.violations.length === 0;

    console.log(`\n📊 Audit Summary:`);
    console.log(`   Total Claims: ${claims.length}`);
    console.log(`   Verified: ${verifiedClaims}`);
    console.log(`   Violations: ${this.violations.length}`);
    console.log(`   Status: ${passed ? '✅ PASS' : '❌ CONSTITUTIONAL VIOLATION'}`);

    if (!passed) {
      console.log(`\n🚨 Constitutional Violations Detected:`);
      this.violations.forEach(violation => {
        console.log(`   • ${violation}`);
      });
      console.log(`\n⚖️  Remedy Required: Retract unverifiable claims or provide code artifacts`);
    }

    return {
      passed,
      totalClaims: claims.length,
      verifiedClaims,
      violations: this.violations,
      auditReport,
    };
  }

  private async loadCapabilityClaims(claimsPath: string): Promise<CapabilityClaim[]> {
    if (!fs.existsSync(claimsPath)) {
      throw new Error(`Capability claims file not found: ${claimsPath}`);
    }

    const content = fs.readFileSync(claimsPath, 'utf8');

    if (claimsPath.endsWith('.yaml') || claimsPath.endsWith('.yml')) {
      const data = yaml.load(content) as any;
      // Handle YAML structure with capabilities array
      return data.capabilities || data;
    } else if (claimsPath.endsWith('.json')) {
      const data = JSON.parse(content);
      return data.capabilities || data;
    } else {
      throw new Error('Capability claims must be YAML or JSON format');
    }
  }

  private getCommitHash(): string {
    try {
      return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    } catch {
      return 'unknown';
    }
  }

  async generateTraceabilityReport(auditResults: any, outputPath: string): Promise<void> {
    const report = {
      audit: {
        timestamp: new Date().toISOString(),
        commitHash: this.getCommitHash(),
        constitutionalAuthority: 'CONSTITUTION.md Article I §1 (Traceability)',
        totalClaims: auditResults.totalClaims,
        verifiedClaims: auditResults.verifiedClaims,
        passed: auditResults.passed,
      },
      violations: auditResults.violations,
      records: auditResults.auditReport,
      remediation: {
        required: !auditResults.passed,
        actions: auditResults.passed
          ? []
          : [
              'Retract unverifiable implementation claims',
              'Mark features as "architected" or "roadmap" until artifacts exist',
              'Provide code lineage for all "implemented" features',
              'Update documentation to match actual implementation state',
            ],
      },
    };

    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Traceability report written: ${outputPath}`);
  }

  // Static method for integration with aegis-orient
  static async enforceTraceability(capabilityClaimsPath: string): Promise<boolean> {
    const gate = new TraceabilityGate();
    const results = await gate.auditCapabilityClaims(capabilityClaimsPath);

    if (!results.passed) {
      console.error(`\n🚨 CONSTITUTIONAL VIOLATION: Traceability requirements not met`);
      console.error(`Cannot proceed with capability claims containing unverifiable "implemented" status.`);

      // Generate violation report
      const reportPath = path.join(process.cwd(), '.aegis', 'traceability-violations.json');
      await gate.generateTraceabilityReport(results, reportPath);

      return false;
    }

    return true;
  }
}

// CLI Implementation
const program = new Command();

program
  .name('aegis-traceability-gate')
  .description('Constitutional enforcement for capability claims')
  .version('2.4.0');

program
  .command('audit')
  .description('Audit capability claims against code artifacts')
  .argument('<claims-file>', 'Path to capability claims file (YAML/JSON)')
  .option('--strict', 'Fail on any violations (default: true)', true)
  .option('--report <path>', 'Generate detailed report', '.aegis/traceability-audit.json')
  .action(async (claimsFile, options) => {
    const gate = new TraceabilityGate();
    const results = await gate.auditCapabilityClaims(claimsFile);

    await gate.generateTraceabilityReport(results, options.report);

    if (!results.passed && options.strict) {
      console.error(`\n🚨 Traceability Gate FAILED - Constitutional violation detected`);
      process.exit(1);
    }
  });

program
  .command('verify')
  .description('Verify single capability claim')
  .argument('<feature-id>', 'Feature ID to verify')
  .argument('<status>', 'Claimed status (implemented|architected|roadmap)')
  .option('--blueprint <id>', 'Blueprint ID')
  .option('--cli <command>', 'CLI command name')
  .option('--artifacts <paths...>', 'Expected artifact paths')
  .action(async (featureId, status, options) => {
    const gate = new TraceabilityGate();

    const claim: CapabilityClaim = {
      id: featureId,
      name: featureId,
      status: status as any,
      description: 'Single verification',
      blueprintId: options.blueprint,
      cliCommand: options.cli,
      expectedArtifacts: options.artifacts || [],
    };

    const record = await gate.verifyCapabilityClaim(claim);

    console.log(`\nVerification Result: ${record.verificationStatus}`);
    if (record.violations.length > 0) {
      console.log(`Violations: ${record.violations.join(', ')}`);
      process.exit(1);
    }
  });

// ES Module entry point detection
if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse();
}

export { TraceabilityGate, type TraceabilityRecord, type CapabilityClaim };
