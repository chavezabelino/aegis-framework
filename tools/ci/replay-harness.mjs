#!/usr/bin/env node
/**
 * Aegis Governance Replay Harness
 * Re-runs the governance suite against a list of SHAs to baseline false positives and perf.
 * Usage: node tools/ci/replay-harness.mjs [--file tools/ci/replay-shas.txt]
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const idx = args.indexOf('--file');
const file = idx >= 0 ? args[idx + 1] : 'tools/ci/replay-shas.txt';

const content = readFileSync(file, 'utf8').trim();
const shas = content.split(/\r?\n/).filter(Boolean).filter(line => !line.startsWith('#'));

const artifactsDir = resolve('.aegis-artifacts/replay');
mkdirSync(artifactsDir, { recursive: true });

function run(cmd, env = {}) {
  const r = spawnSync(cmd, { shell: true, stdio: 'pipe', env: { ...process.env, ...env } });
  return { code: r.status ?? 0, out: (r.stdout||'').toString(), err: (r.stderr||'').toString() };
}

for (const sha of shas) {
  console.log(`\n[aegis:replay] Checking out ${sha}`);
  let r = run(`git checkout --quiet ${sha}`);
  if (r.code !== 0) { console.error(r.err || r.out); process.exit(1); }

  // Dry-run pass
  console.log(`[aegis:replay] Dry-run governance suite @ ${sha}`);
  r = run(`node tools/ci/run-governance-suite.mjs --group all`, {
    AEGIS_GOVERNANCE_MODE: 'dry-run',
  });
  const snap = {
    sha,
    mode: 'dry-run',
    exit: r.code,
    out: r.out.slice(-4000),
    err: r.err.slice(-4000),
    ts: new Date().toISOString(),
  };
  writeFileSync(resolve(artifactsDir, `${sha}-dry-run.log.json`), JSON.stringify(snap, null, 2));

  // Validation-only enforce pass
  console.log(`[aegis:replay] Enforce validation-only @ ${sha}`);
  r = run(`node tools/ci/run-governance-suite.mjs --group validation`, {
    AEGIS_GOVERNANCE_MODE: 'enforce',
    AEGIS_ENFORCE_VALIDATION: '1',
    AEGIS_ENFORCE_PREVENTION: '0',
    AEGIS_ENFORCE_INTEL: '0',
    AEGIS_ENFORCE_MONITORING: '0',
  });
  const snap2 = {
    sha,
    mode: 'enforce:validation',
    exit: r.code,
    out: r.out.slice(-4000),
    err: r.err.slice(-4000),
    ts: new Date().toISOString(),
  };
  writeFileSync(resolve(artifactsDir, `${sha}-enforce-validation.log.json`), JSON.stringify(snap2, null, 2));
}

console.log('\n[aegis:replay] done');
