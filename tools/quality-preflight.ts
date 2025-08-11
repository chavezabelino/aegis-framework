#!/usr/bin/env tsx
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

type Res = { name: string; ok: boolean; meta?: Record<string, any> };

function sh(cmd: string, silent = false) {
  try {
    const out = execSync(cmd, { stdio: silent ? ['ignore', 'pipe', 'pipe'] : 'pipe' }).toString();
    return { ok: true, out };
  } catch (e: any) {
    return { ok: false, out: e?.stdout?.toString() ?? '', err: e?.stderr?.toString() ?? '' };
  }
}

function parseNumber(re: RegExp, s: string, d = 0) {
  const m = s.match(re);
  return m ? Number(m[1]) : d;
}

function loadCfg() {
  return JSON.parse(readFileSync('.aegis/config/quality.json', 'utf8'));
}

function grade(score: number, cfg: any) {
  if (score >= cfg.gradeBands.A) return 'A';
  if (score >= cfg.gradeBands.B) return 'B';
  if (score >= cfg.gradeBands.C) return 'C';
  return 'F';
}

function main() {
  const cfg = loadCfg();
  const ci = process.argv.includes('--ci');

  const results: Res[] = [];

  // Types
  const types = sh('pnpm run types', true);
  results.push({ name: 'types', ok: types.ok });

  // Lint
  const lint = sh('pnpm run lint', true);
  const eslintErrors = /[1-9]\d* errors?/.test(lint.err + lint.out) ? 1 : 0;
  results.push({ name: 'lint', ok: eslintErrors <= cfg.thresholds.eslintErrors, meta: { eslintErrors } });

  // Format
  const fmt = sh('pnpm run format:check', true);
  results.push({ name: 'format', ok: fmt.ok });

  // Unit + Coverage
  const unit = sh('pnpm run test:unit', true);
  const lines = parseNumber(/Lines\s*:\s*([\d.]+)/i, unit.out);
  const branches = parseNumber(/Branches\s*:\s*([\d.]+)/i, unit.out);
  const covOK = lines >= cfg.thresholds.coverage.lines && branches >= cfg.thresholds.coverage.branches;
  results.push({ name: 'coverage', ok: covOK, meta: { lines, branches } });

  // Mutation
  const mut = sh('pnpm run mutate', true);
  const mScore = parseNumber(/Mutation score\s*:\s*([\d.]+)/i, mut.out);
  const mutOK = mScore >= cfg.thresholds.mutationScore;
  results.push({ name: 'mutation', ok: mutOK, meta: { mutationScore: mScore } });

  // E2E (@critical only)
  const e2e = sh(`pnpm run test:e2e -- --grep ${cfg.criticalE2ETag}`, true);
  results.push({ name: 'e2e', ok: e2e.ok });

  // Deps
  const deps = sh('pnpm run deps:scan', true);
  results.push({ name: 'deps', ok: deps.ok });

  // Security
  const sec = sh('pnpm run sec:scan', true);
  results.push({ name: 'security', ok: sec.ok });

  // Provenance & waivers
  const prov = sh('pnpm run aegis:provenance:verify', true);
  results.push({ name: 'provenance', ok: prov.ok });
  const wv = sh('pnpm run aegis:waivers:verify', true);
  results.push({ name: 'waivers', ok: wv.ok });

  // Score
  const weights = cfg.weights;
  const pieces: { key: keyof typeof weights; ok: boolean; score: number }[] = (
    ['types', 'lint', 'coverage', 'mutation', 'e2e', 'security', 'deps'] as const
  ).map(k => {
    const r = results.find(x => x.name === k)!;
    return { key: k, ok: r.ok, score: r.ok ? weights[k] : 0 };
  });

  const total = pieces.reduce((a, b) => a + b.score, 0);
  const gradeStr = grade(total, cfg);
  const pass = total >= cfg.gradeBands[cfg.failBelowGrade];

  const summary = {
    grade: gradeStr,
    score: total,
    details: Object.fromEntries(results.map(r => [r.name, { ok: r.ok, ...(r.meta || {}) }])),
  };

  if (!ci) {
    console.log('Aegis Quality Summary:');
    console.log(JSON.stringify(summary, null, 2));
  } else {
    // emit machine-friendly line for GH Actions step summary
    console.log(`__AegisQuality__=${JSON.stringify(summary)}`);
  }

  process.exit(pass ? 0 : 1);
}

main();
