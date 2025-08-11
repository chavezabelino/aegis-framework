#!/usr/bin/env node

/**
 * @aegisBlueprint: planning-optimization
 * @version: 2.5.1
 * @mode: strict
 * @intent: "CI plan gate that enforces planning constraints and prevents plan bloat"
 * @context: scripts/ci/plan-gate.mjs
 * @model: gpt-5-thinking
 * @hash: <filled-by-attest>
 *
 * Usage (preferred):
 *   node scripts/ci/plan-gate.mjs [.aegis/outputs/<plan>.json]
 *   env:
 *     PLAN_GATE_ALLOW_MISSING=true   # skip on PRs with no plan
 *     PLAN_GATE_STRICT=true          # stricter checks on protected branches
 *
 * Legacy (detected, but deprecated):
 *   node scripts/ci/plan-gate.mjs <planClass> <path/to/PLAN.md> [filesTouched]
 */

import { existsSync, readFileSync } from 'node:fs';
import { globSync } from 'glob';

const argv = process.argv.slice(2);

// Legacy arg shim: if first arg looks like a class, ignore and fall back to JSON detection
const legacyClassValues = new Set([
  'MVP','MVP-Fix','SURGICAL','Surgical-Refactor','SYSTEMIC','Systemic-Change'
]);
const looksLegacy = argv.length >= 2 && legacyClassValues.has(argv[0]);

const planArg = looksLegacy ? null : argv[0];
const allowMissing = process.env.PLAN_GATE_ALLOW_MISSING === 'true';
const strict = process.env.PLAN_GATE_STRICT === 'true';

// Prefer generated JSON plans in .aegis/outputs
const candidates = globSync('.aegis/outputs/**/*plan*.json', { dot: true, nodir: true }).sort();
const planPath = planArg || candidates.at(-1);

if (!planPath || !existsSync(planPath)) {
  const msg = 'Plan gate: no plan found (.aegis/outputs/*plan*.json).';
  if (allowMissing) {
    console.warn(`${msg} Skipping (ALLOW_MISSING).`);
    process.exit(0);
  }
  console.error(`${msg} Set PLAN_GATE_ALLOW_MISSING=true to skip on PRs.`);
  process.exit(1);
}

let plan;
try {
  plan = JSON.parse(readFileSync(planPath, 'utf8'));
} catch {
  console.error(`Plan gate: invalid JSON: ${planPath}`);
  process.exit(1);
}

// Minimal, enforceable checks (extend as schema stabilizes)
const findings = [];
const klass = plan.class || plan.planClass || plan.type;
if (!klass) findings.push('missing plan.class/planClass');
if (klass && klass !== 'MVP-Fix') findings.push(`planClass must be "MVP-Fix", got "${klass}"`);
if (Array.isArray(plan.steps) && plan.steps.length === 0) findings.push('steps present but empty');
if (!plan.contracts && !plan.contract && !plan.behavior) {
  if (strict) findings.push('missing contracts/behavior section');
}

if (findings.length) {
  const level = strict ? 'ERROR' : 'WARN';
  findings.forEach(f => console[level === 'ERROR' ? 'error' : 'warn'](`Plan gate ${level}: ${f}`));
  process.exit(strict ? 1 : 0);
}

console.log(`Plan gate OK: ${planPath}${klass ? ` (class=${klass})` : ''}`);
