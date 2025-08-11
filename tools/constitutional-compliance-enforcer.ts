#!/usr/bin/env node

/**
 * @aegisFrameworkVersion: 2.5.0
 * @intent: Constitutional compliance enforcer to prevent false claims and ensure framework integrity
 * @context: Emergency response to constitutional crisis - systematic intelligence failure
 * @mode: strict
 */

import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ValidationReport } from './compliance/validation-contract.ts';
import { CLAIMS, ComplianceClaim } from './compliance/claims.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

interface EnforcerResult {
  passed: string[];
  failed: string[];
  errored: string[];
  reports: ValidationReport[];
}

function runNodeScript(scriptPath: string, args: string[]): Promise<{ code: number; stdout: string; stderr: string; }> {
  return new Promise((resolvePromise) => {
    const child = spawn(process.execPath, [scriptPath, ...args], {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += String(d)));
    child.stderr.on('data', (d) => (stderr += String(d)));
    child.on('close', (code) => resolvePromise({ code: code ?? 1, stdout, stderr }));
  });
}

function prettyReport(report: ValidationReport): string {
  const head = `• [${report.status.toUpperCase()}] ${report.claimId} — ${report.title}`;
  if (report.status === 'pass') return head;
  const issues = report.issues?.map(i => `   - (${i.code}) ${i.message}${i.hint ? ` | hint: ${i.hint}` : ''}`).join('\n') || '   - (no issues payload)';
  return `${head}\n${issues}`;
}

async function enforce(jsonOut: boolean): Promise<number> {
  const results: EnforcerResult = { passed: [], failed: [], errored: [], reports: [] };

  for (const claim of CLAIMS) {
    const scriptAbs = resolve(process.cwd(), claim.implementation);
    const args = claim.args ?? [];
    // Ensure --json is present
    const finalArgs = args.includes('--json') ? args : [...args, '--json'];

    const { code, stdout, stderr } = await runNodeScript(scriptAbs, finalArgs);

    let parsed: ValidationReport | null = null;
    try {
      parsed = JSON.parse(stdout) as ValidationReport;
    } catch {
      // If JSON parsing fails, mark as error
      parsed = {
        claimId: claim.id,
        title: claim.title,
        status: 'error',
        issues: [
          {
            code: 'INVALID_JSON',
            message: 'Validator did not emit valid JSON to stdout with --json.',
            hint: 'Ensure the validator writes a ValidationReport JSON object to stdout.'
          }
        ],
        evidence: claim.evidence
      };
    }

    // Harmonize status with exit code if needed
    let status = parsed.status;
    if (code === 0) status = 'pass';
    else if (code === 1) status = 'fail';
    else status = 'error';
    const report: ValidationReport = { ...parsed, status };

    results.reports.push(report);
    if (status === 'pass') results.passed.push(claim.id);
    else if (status === 'fail') results.failed.push(claim.id);
    else results.errored.push(claim.id);

    // Attach stderr into meta for JSON consumers
    if (stderr?.trim()) {
      report.meta = { ...(report.meta ?? {}), stderr };
    }
  }

  const failedRequired = results.reports.filter(r => {
    const claim = CLAIMS.find(c => c.id === r.claimId);
    return claim?.required && (r.status === 'fail' || r.status === 'error');
  });

  if (jsonOut) {
    process.stdout.write(JSON.stringify({
      summary: {
        total: results.reports.length,
        pass: results.passed.length,
        fail: results.failed.length,
        error: results.errored.length,
        blockingFailures: failedRequired.map(r => r.claimId)
      },
      reports: results.reports
    }, null, 2) + '\n');
  } else {
    const ok = results.reports.filter(r => r.status === 'pass');
    const notOk = results.reports.filter(r => r.status !== 'pass');
    console.log('Aegis Constitutional Compliance Report\n');
    for (const r of ok) console.log(prettyReport(r));
    if (notOk.length) {
      console.log('\nFailures / Errors:');
      for (const r of notOk) console.log(prettyReport(r));
    }
    console.log('\nSummary:', {
      total: results.reports.length,
      pass: results.passed.length,
      fail: results.failed.length,
      error: results.errored.length,
      blockingFailures: failedRequired.map(r => r.claimId)
    });
  }

  // Block on required claim failures/errors
  if (failedRequired.length > 0) return 1;
  return 0;
}

const jsonFlag = process.argv.includes('--json');
enforce(jsonFlag).then(code => process.exit(code)).catch(err => {
  console.error('Enforcer crashed:', err);
  process.exit(2);
});
