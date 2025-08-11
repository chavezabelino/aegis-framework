#!/usr/bin/env -S node --experimental-specifier-resolution=node

/**
 * @aegisBlueprint: governance-enforcement
 * @version: 2.5.1
 * @mode: strict
 * @intent: "Validate evidence manifests (PREC) and prove claims in CI"
 * @context: tools/check-evidence.ts
 * @model: gpt-5-thinking
 * @hash: <filled-by-attest>
 *
 * Behavior:
 *  - Executes commands from blueprints/<id>/evidence.json
 *  - Verifies expected stdout, exit codes, and written artifacts
 *  - Treats missing *.sig as WARNING when SKIP_SIGNATURE_CHECKS=true or AEGIS_HMAC_KEY is absent (PR/fork mode)
 *  - Fails CI on any non-signature errors
 */

/* eslint-disable no-console */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'glob';

type EvidenceCommand = {
  run: string;
  expect?: {
    exit?: number;
    stdout?: string | string[]; // substring(s) expected in stdout
    writes?: string | string[]; // path(s)/glob(s) expected to exist after
  };
};

type EvidenceManifest = {
  blueprintId: string;
  artifacts?: Array<{ path: string; type?: 'source' | 'output' | 'other' }>;
  commands?: EvidenceCommand[];
};

type Finding = { level: 'error' | 'warning'; message: string; file?: string; manifest?: string };

const __dirname = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const ciMode = args.includes('--ci') || process.env.CI === 'true';
const manifestGlobs = args.filter(a => !a.startsWith('-'));
const hasHmac = !!process.env.AEGIS_HMAC_KEY;
const relaxSigChecks = process.env.SKIP_SIGNATURE_CHECKS === 'true' || !hasHmac;

const receipts: any = {
  startedAtUtc: new Date().toISOString(),
  manifests: [] as Array<{ path: string; commands: any[]; outputs: any[] }>,
  env: { ciMode, hasHmac, relaxSigChecks },
};
const findings: Finding[] = [];

function run(cmd: string) {
  const started = Date.now();
  try {
    const stdout = execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { command: cmd, exitCode: 0, stdout, stderr: '', durationMs: Date.now() - started };
  } catch (e: any) {
    return {
      command: cmd,
      exitCode: e.status ?? 1,
      stdout: (e.stdout && e.stdout.toString && e.stdout.toString()) || '',
      stderr: (e.stderr && e.stderr.toString && e.stderr.toString()) || String(e),
      durationMs: Date.now() - started,
    };
  }
}

function asArray<T>(v: T | T[] | undefined): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function checkExists(patternOrPath: string): { ok: boolean; matches: string[] } {
  const expanded = globSync(patternOrPath, { dot: true, nodir: true });
  if (expanded.length > 0) return { ok: true, matches: expanded };
  return { ok: existsSync(patternOrPath), matches: existsSync(patternOrPath) ? [patternOrPath] : [] };
}

function loadManifest(p: string): { path: string; data: EvidenceManifest } {
  const abs = resolve(process.cwd(), p);
  if (!existsSync(abs)) throw new Error(`evidence manifest not found: ${p}`);
  const data = JSON.parse(readFileSync(abs, 'utf8')) as EvidenceManifest;
  return { path: abs, data };
}

function expectStdoutContains(stdout: string, needle: string) {
  if (!stdout.includes(needle)) return `stdout missing expected substring: ${JSON.stringify(needle)}`;
  return null;
}

function checkArtifacts(manifestPath: string, m: EvidenceManifest) {
  const outputs: any[] = [];
  for (const a of m.artifacts || []) {
    const isSig = a.path.endsWith('.sig');
    const res = checkExists(a.path);
    outputs.push({ path: a.path, type: a.type || 'other', exists: res.ok, matches: res.matches });

    if (!res.ok) {
      if (isSig && relaxSigChecks) {
        findings.push({
          level: 'warning',
          message: `Missing signature (relaxed): ${a.path}`,
          manifest: manifestPath,
          file: a.path,
        });
      } else {
        findings.push({
          level: 'error',
          message: `Required output file not found: ${a.path}`,
          manifest: manifestPath,
          file: a.path,
        });
      }
    }
  }
  return outputs;
}

function runCommands(manifestPath: string, cmds: EvidenceCommand[]) {
  const cmdReceipts: any[] = [];
  for (const c of cmds) {
    const r = run(c.run);
    const localFindings: string[] = [];

    if (typeof c.expect?.exit === 'number' && r.exitCode !== c.expect.exit) {
      localFindings.push(`exit ${r.exitCode} != expected ${c.expect.exit}`);
    }

    for (const needle of asArray(c.expect?.stdout)) {
      const err = expectStdoutContains(r.stdout || '', needle);
      if (err) localFindings.push(err);
    }

    for (const w of asArray(c.expect?.writes)) {
      const chk = checkExists(w);
      if (!chk.ok) localFindings.push(`expected written file/glob not found: ${w}`);
    }

    if (localFindings.length) {
      findings.push({
        level: 'error',
        message: `Command failed expectations: ${c.run} :: ${localFindings.join('; ')}`,
        manifest: manifestPath,
      });
    }

    cmdReceipts.push({ ...r, expectations: c.expect || {} });
  }
  return cmdReceipts;
}

function writeSummary() {
  const outDir = '.aegis/validation';
  mkdirSync(outDir, { recursive: true });
  const out = `${outDir}/evidence-summary.json`;
  const errors = findings.filter(f => f.level === 'error');
  const payload = { ...receipts, findings };
  writeFileSync(out, JSON.stringify(payload, null, 2));
  console.log(`Evidence summary written: ${out}`);
  process.exit(errors.length ? 1 : 0);
}

function main() {
  const globs = manifestGlobs.length ? manifestGlobs : ['blueprints/**/evidence.json'];
  const manifests = globs.flatMap(g => globSync(g, { dot: true, nodir: true }));

  if (!manifests.length) {
    console.warn('No evidence manifests found. (Globs: ' + globs.join(', ') + ')');
    return writeSummary();
  }

  for (const mpath of manifests) {
    let mf: EvidenceManifest;
    try {
      ({ data: mf } = loadManifest(mpath));
    } catch (e: any) {
      findings.push({ level: 'error', message: e.message, manifest: mpath });
      continue;
    }

    const cmdReceipts = runCommands(mpath, mf.commands || []);
    const outReceipts = checkArtifacts(mpath, mf);

    receipts.manifests.push({
      path: mpath,
      commands: cmdReceipts,
      outputs: outReceipts,
    });
  }

  writeSummary();
}

main();
