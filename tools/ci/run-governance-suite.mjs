#!/usr/bin/env node
/**
 * Aegis Governance Suite Runner (solo-dev, flag-driven)
 * - Groups: intelligence | validation | monitoring | utilities | prevention | all
 * - Modes: off | dry-run | enforce (AEGIS_GOVERNANCE_MODE)
 * - Group toggles (only used when enforce): AEGIS_ENFORCE_*
 * - Emits JSON artifact per group in .aegis-artifacts/
 */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const MODE = process.env.AEGIS_GOVERNANCE_MODE || 'dry-run';
const ENF = {
  validation: process.env.AEGIS_ENFORCE_VALIDATION === '1',
  prevention: process.env.AEGIS_ENFORCE_PREVENTION === '1',
  intelligence: process.env.AEGIS_ENFORCE_INTEL === '1',
  monitoring: process.env.AEGIS_ENFORCE_MONITORING === '1',
  utilities: true, // never blocking by default
};
const TS_RUNNER = process.env.TS_RUNNER || 'tsx';
const INTEL_THRESHOLD = parseFloat(process.env.AEGIS_INTEL_THRESHOLD || '0.9');

const argv = process.argv.slice(2);
const groupArgIdx = argv.indexOf('--group');
const targetGroup = groupArgIdx >= 0 ? (argv[groupArgIdx + 1] || 'all') : 'all';

const groups = {
  intelligence: [
    `${TS_RUNNER} tools/intelligent-pattern-detector.ts`,
    `${TS_RUNNER} tools/predictive-compliance-monitor.ts`,
    `${TS_RUNNER} tools/realtime-constitutional-enforcer.ts`,
    `${TS_RUNNER} tools/realtime-evolution-detection.ts`,
    `${TS_RUNNER} tools/continuous-compliance-monitor.ts`,
    `${TS_RUNNER} tools/enhanced-evolution-detection.ts`,
    `${TS_RUNNER} tools/framework-intelligence-certification.ts`,
    `${TS_RUNNER} tools/intent-enforcement-engine.ts`,
    `${TS_RUNNER} tools/systematic-prevention-validator.ts`,
    `${TS_RUNNER} tools/evidence-based-validation.ts`,
    `${TS_RUNNER} tools/evolution-learning-system.ts`,
    `${TS_RUNNER} tools/framework-capability-mapper.ts`,
    `${TS_RUNNER} tools/comprehensive-intelligence-testing.ts`,
  ],
  validation: [
    `${TS_RUNNER} tools/validate-annotations.ts`,
    `${TS_RUNNER} tools/validate-article-xi-abstraction.ts`,
    `${TS_RUNNER} tools/check-evidence.ts`,
    `${TS_RUNNER} tools/quality-preflight.ts`,
    `${TS_RUNNER} tools/blueprint-coverage-auditor.ts`,
    // Include workflow lint
    `actionlint -no-color`,
    // Existing active tools (idempotent)
    `${TS_RUNNER} tools/validate-blueprint.ts`,
    `${TS_RUNNER} tools/validate-constitution.ts`,
    `${TS_RUNNER} tools/validate-package-manager-consistency.ts`,
    `node tools/validate-version-consistency.cjs`,
  ],
  monitoring: [
    `${TS_RUNNER} tools/drift-monitoring-dashboard.ts`,
    `${TS_RUNNER} tools/cursor-integration.ts`,
    `${TS_RUNNER} tools/cursor-realtime-integration.ts`,
    `${TS_RUNNER} tools/test-cursor-detection.ts`,
    `${TS_RUNNER} tools/update-framework-dashboard.ts`,
  ],
  utilities: [
    `${TS_RUNNER} tools/team-config-loader.ts`,
    `node tools/distribution/create-aegis-bundle.cjs --check`,
    `${TS_RUNNER} tools/aegis-svelte-init.ts --check`,
  ],
  prevention: [
    // These are represented via pre-commit locally; in CI we simulate by running the scripts
    `bash tools/constitutional-pre-commit-hook.sh --check`,
    `bash tools/pre-commit-destructive-check.sh --check`,
    `bash tools/package-manager-pre-commit-hook.sh --check`,
    `${TS_RUNNER} tools/pre-commit-hook.ts --check`,
    `bash tools/pre-commit-hook.sh --check`,
    `bash tools/setup-git-hooks.sh uninstall && bash tools/setup-git-hooks.sh install && echo ok`,
    `bash tools/setup-proactive-detection.sh --check`,
    `${TS_RUNNER} tools/destructive-action-protection.ts --check`,
  ],
};

function pickGroups(target) {
  if (target === 'all') return Object.keys(groups);
  if (!groups[target]) {
    console.error(`Unknown group: ${target}`);
    process.exit(2);
  }
  return [target];
}

function runCmd(cmd, { envExtra = {} } = {}) {
  return new Promise((resolveP) => {
    const start = Date.now();
    const child = spawn(cmd, {
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: {
        ...process.env,
        ...envExtra,
      },
    });
    let out = '';
    let err = '';
    child.stdout.on('data', (d) => (out += d.toString()));
    child.stderr.on('data', (d) => (err += d.toString()));
    child.on('close', (code) => {
      resolveP({
        exitCode: code ?? 0,
        durationMs: Date.now() - start,
        stdout: out.trim(),
        stderr: err.trim(),
      });
    });
  });
}

async function runGroup(name) {
  const cmds = groups[name];
  const results = [];
  for (const cmd of cmds) {
    const r = await runCmd(cmd, {
      envExtra: {
        AEGIS_GOVERNANCE_MODE: MODE,
        AEGIS_INTEL_THRESHOLD: String(INTEL_THRESHOLD),
      },
    });
    const status = r.exitCode === 0 ? 'ok' : 'fail';
    results.push({ tool: cmd, status, ...r });
  }
  const dir = resolve('.aegis-artifacts');
  mkdirSync(dir, { recursive: true });
  const path = resolve(dir, `latest-${name}.json`);
  writeFileSync(path, JSON.stringify({
    mode: MODE,
    group: name,
    enforce: ENF[name] || false,
    generatedAt: new Date().toISOString(),
    results,
  }, null, 2));
  // Determine blocking behavior
  if (MODE === 'enforce' && ENF[name]) {
    const anyFail = results.some(r => r.status === 'fail');
    return anyFail ? 1 : 0;
  }
  return 0;
}

(async () => {
  if (MODE === 'off') {
    console.log('[aegis] mode=off → exiting 0');
    process.exit(0);
  }

  const gs = pickGroups(targetGroup);
  let exit = 0;
  for (const g of gs) {
    console.log(`[aegis] running group=${g} mode=${MODE} enforce=${ENF[g] ? 1 : 0}`);
    const code = await runGroup(g);
    if (code !== 0) exit = code;
  }
  process.exit(exit);
})();
