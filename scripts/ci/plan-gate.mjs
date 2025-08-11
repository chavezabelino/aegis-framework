#!/usr/bin/env node

/**
 * @aegisBlueprint: planning-optimization
 * @version: 2.5.1
 * @mode: strict
 * @intent: "CI plan gate that enforces planning constraints and prevents plan bloat"
 * @context: scripts/ci/plan-gate.mjs
 * @model: gpt-5-thinking
 * @hash: <filled-by-attest>   // leave placeholder; your attest step signs separately
 *
 * Usage (preferred):
 *   node scripts/ci/plan-gate.mjs [.aegis/outputs/<plan>.json]
 *   env:
 *     PLAN_GATE_ALLOW_MISSING=true   # skip on PRs with no plan
 *     PLAN_GATE_STRICT=true          # stricter checks on protected branches
 *
 * Legacy compatibility (still supported; deprecating):
 *   node scripts/ci/plan-gate.mjs <planClass> <path/to/PLAN.md> [filesTouched]
 *   where planClass ∈ {MVP, SURGICAL, SYSTEMIC}
 */

// --- legacy arg shim (optional, deprecating) ---
const argv = process.argv.slice(2);
let legacyPlanClass = null;
let legacyPlanMd = null;
if (argv.length >= 2 && ['MVP','SURGICAL','SYSTEMIC','MVP-Fix','Surgical-Refactor','Systemic-Change'].includes(argv[0])) {
  legacyPlanClass = argv[0];
  legacyPlanMd = argv[1];
  console.warn('Plan gate: legacy CLI args detected (<class> <PLAN.md>); prefer JSON plan path. This mode will be removed.');
}
// You can map legacyPlanMd → a temporary JSON (or just ignore and continue with .aegis/outputs/*plan*.json)
// ------------------------------------------------


#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { globSync } from 'glob';

const planArg = process.argv[2];
const allowMissing = process.env.PLAN_GATE_ALLOW_MISSING === 'true';
const strict = process.env.PLAN_GATE_STRICT === 'true'; // set true on protected branches if you want harder checks

const candidates = globSync('.aegis/outputs/**/*plan*.json').sort();
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

// Minimal, enforceable checks (extend as your schema stabilizes)
const findings = [];

// Prefer a clear class flag
const klass = plan.class || plan.planClass || plan.type;
if (!klass) findings.push('missing plan.class/planClass');
if (klass && klass !== 'MVP-Fix') findings.push(`planClass must be "MVP-Fix", got "${klass}"`);

// If steps exist, they shouldn’t be empty
if (Array.isArray(plan.steps) && plan.steps.length === 0) {
  findings.push('steps present but empty');
}

// Basic contract-driven hints (non-fatal unless strict)
if (!plan.contracts && !plan.contract && !plan.behavior) {
  if (strict) findings.push('missing contracts/behavior section');
}

// Decide outcome
if (findings.length) {
  const level = strict ? 'ERROR' : 'WARN';
  findings.forEach(f => console[level === 'ERROR' ? 'error' : 'warn'](`Plan gate ${level}: ${f}`));
  process.exit(strict ? 1 : 0);
}

console.log(`Plan gate OK: ${planPath}${klass ? ` (class=${klass})` : ''}`);
