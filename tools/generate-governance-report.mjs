#!/usr/bin/env node

/**
 * @aegisBlueprint: governance-enforcement
 * @version: 2.5.1
 * @mode: strict
 * @intent: "Generate a governance receipts report without TS dependencies"
 * @context: tools/generate-governance-report.mjs
 * @model: gpt-5-thinking
 * @hash: <filled-by-attest>
 */

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';

const OUT_DIR = '.aegis/reports';
const OUT_FILE_LOCAL = path.join(OUT_DIR, 'governance-report.local.json');
const OUT_FILE_CI = path.join(OUT_DIR, 'governance-report.ci.json');

const CI = !!process.env.GITHUB_ACTIONS;
const NOW = new Date().toISOString();

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

function sha256File(p) {
  try {
    const buf = fs.readFileSync(p);
    return crypto.createHash('sha256').update(buf).digest('hex');
  } catch { return null; }
}

function safeStat(p) {
  try {
    const s = fs.statSync(p);
    return { size: s.size, mtime: s.mtime.toISOString(), isFile: s.isFile(), isDir: s.isDirectory() };
  } catch { return null; }
}

function walk(dir, filter = () => true, out = []) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walk(fp, filter, out);
    else if (filter(fp)) out.push(fp);
  }
  return out;
}

function safeRun(command) {
  const started = Date.now();
  try {
    const stdout = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { command, exitCode: 0, stdout, stderr: '', durationMs: Date.now() - started };
  } catch (e) {
    return {
      command,
      exitCode: typeof e.status === 'number' ? e.status : 1,
      stdout: e.stdout?.toString?.() ?? '',
      stderr: e.stderr?.toString?.() ?? String(e),
      durationMs: Date.now() - started
    };
  }
}

async function main() {
  try {
    ensureDir(OUT_DIR);
    ensureDir('.aegis/outputs');
    ensureDir('.aegis/telemetry');

    // Best-effort telemetry line so report always has something to reference.
    const telemetryFile = path.join('.aegis/telemetry', 'planning-events.ndjson');
    if (!fs.existsSync(telemetryFile)) fs.writeFileSync(telemetryFile, '');
    fs.appendFileSync(telemetryFile, JSON.stringify({
      timestamp: NOW,
      event: 'report.generated',
      source: 'generate-governance-report.mjs'
    }) + '\n');

    // Collect file receipts from key areas
    const roots = [
      '.aegis/outputs',
      '.aegis/telemetry',
      '.aegis/validation',
      '.aegis/vr-baselines',
      '.aegis/artifacts',                     // downloaded artifacts from other jobs
      '.github/workflows/aegis-governance.yml'
    ];

    const files = [];
    for (const r of roots) {
      if (!fs.existsSync(r)) continue;
      const stat = safeStat(r);
      if (stat?.isFile) {
        files.push({ path: r, ...stat, sha256: sha256File(r) });
      } else {
        for (const f of walk(r, () => true)) {
          const meta = safeStat(f);
          if (meta?.isFile) files.push({ path: f, ...meta, sha256: sha256File(f) });
        }
      }
    }

    // Minimal, safe command receipts (no tsx / no installs here)
    const commands = {
      check_paths: safeRun('node tools/check-paths.js --json || true'),
      check_version: safeRun('node tools/check-version-sync.js --ci || true'),
      // Add more plain-node commands if desired; avoid tsx/npx here on purpose.
    };

    const report = {
      meta: {
        generatedAtUtc: NOW,
        ci: CI,
        node: process.version,
        cwd: process.cwd(),
        runId: process.env.GITHUB_RUN_ID || 'local',
        job: process.env.GITHUB_JOB || null,
        workflow: process.env.GITHUB_WORKFLOW || null,
        ref: process.env.GITHUB_REF || null,
        commit: process.env.GITHUB_SHA || 'local',
      },
      env: {
        hasHmacKey: !!process.env.AEGIS_HMAC_KEY,
        skipSignatureChecks: process.env.SKIP_SIGNATURE_CHECKS === 'true',
      },
      commands,
      files
    };

    // Write local; in CI also mirror to ci.json (the workflow already copies, but be kind)
    fs.writeFileSync(OUT_FILE_LOCAL, JSON.stringify(report, null, 2));
    if (CI) {
      try { fs.writeFileSync(OUT_FILE_CI, JSON.stringify(report, null, 2)); } catch { /* ignore */ }
    }

    console.log(`✅ Governance report written: ${CI ? OUT_FILE_CI : OUT_FILE_LOCAL}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Governance report generation failed:', err?.message || String(err));
    // Never block CI due to receipts; exit 0 by design.
    try {
      ensureDir(OUT_DIR);
      const fallback = {
        meta: { generatedAtUtc: NOW, ci: CI, error: String(err?.message || err) },
        files: [], commands: {}
      };
      fs.writeFileSync(OUT_FILE_LOCAL, JSON.stringify(fallback, null, 2));
      if (CI) fs.writeFileSync(OUT_FILE_CI, JSON.stringify(fallback, null, 2));
      console.log(`⚠️ Wrote fallback report to ${CI ? OUT_FILE_CI : OUT_FILE_LOCAL}`);
    } catch { /* ignore */ }
    process.exit(0);
  }
}

main();
