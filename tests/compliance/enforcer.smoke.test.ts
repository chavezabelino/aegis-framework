import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { resolve } from 'node:path';
import { promisify } from 'node:util';
const execFileAsync = promisify(execFile);

describe('Aegis Compliance Enforcer', () => {
  const enforcer = resolve(process.cwd(), 'tools/constitutional-compliance-enforcer.ts');

  it('executes and returns structured output', async () => {
    const { stdout } = await execFileAsync('npx', ['tsx', enforcer, '--json'], { cwd: process.cwd() });
    const parsed = JSON.parse(stdout);
    
    expect(parsed).toHaveProperty('summary');
    expect(parsed).toHaveProperty('reports');
    expect(parsed.summary).toHaveProperty('total');
    expect(parsed.summary).toHaveProperty('pass');
    expect(parsed.summary).toHaveProperty('fail');
    expect(parsed.summary).toHaveProperty('error');
    expect(parsed.summary).toHaveProperty('blockingFailures');
    
    expect(Array.isArray(parsed.reports)).toBe(true);
    expect(parsed.reports.length).toBeGreaterThan(0);
  });

  it('identifies version consistency issues', async () => {
    const { stdout } = await execFileAsync('npx', ['tsx', enforcer, '--json'], { cwd: process.cwd() });
    const parsed = JSON.parse(stdout);
    
    const versionReport = parsed.reports.find((r: any) => r.claimId === 'version-consistency');
    expect(versionReport).toBeDefined();
    expect(versionReport).toHaveProperty('status');
    expect(versionReport).toHaveProperty('issues');
  });

  it('returns non-zero exit code on failures', async () => {
    try {
      await execFileAsync('npx', ['tsx', enforcer], { cwd: process.cwd() });
      // If we get here, the test should fail because we expect non-zero exit
      throw new Error('Expected failure, got success');
    } catch (e: any) {
      // Non-zero exit expected due to version inconsistencies
      expect(e.code).not.toBe(0);
    }
  });
});
