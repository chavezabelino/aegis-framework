#!/usr/bin/env node

/**
 * @aegisBlueprint: planning-optimization
 * @version: 1.0.0
 * @mode: strict
 * @intent: CI plan gate that enforces planning constraints and prevents plan bloat
 * @context: Constitutional enforcement tool for planning optimization
 */

// Aegis Plan Gate: fail CI on overbuilt plans.
// Usage: node scripts/ci/plan-gate.mjs <planClass> <path/to/plan.md> [filesTouched]
// planClass: MVP | SURGICAL | SYSTEMIC

import fs from 'node:fs';
import path from 'node:path';

// Load configuration (gracefully handle missing)
const configPath = path.join(process.cwd(), '.aegis/config/planning.json');
if (!fs.existsSync(configPath)) {
  console.error('⚠️  Planning config not found at .aegis/config/planning.json. Skipping plan gate.');
  process.exit(0);
}
const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const [,, planClassRaw, planPath, filesTouchedRaw] = process.argv;

if (!planClassRaw || !planPath) {
  console.error('Usage: node scripts/ci/plan-gate.mjs <MVP|SURGICAL|SYSTEMIC> <plan.md> [filesTouched]');
  process.exit(2);
}

const planClass = planClassRaw;
if (!fs.existsSync(planPath)) {
  console.error(`❌ Plan Gate: Plan file not found: ${planPath}. Create one or adjust the path.`);
  process.exit(1);
}
const plan = fs.readFileSync(planPath, 'utf8');
const tokensApprox = Math.ceil(plan.length / 4); // rough char→token heuristic
const filesTouched = Number(filesTouchedRaw ?? 0);

function fail(msg) { 
  console.error(`❌ Plan Gate: ${msg}`); 
  process.exit(1); 
}

function ok(msg) { 
  console.log(`✅ Plan Gate: ${msg}`); 
  process.exit(0); 
}

// Validate plan class exists in config
const planClassConfig = cfg.planClasses[planClass];
if (!planClassConfig) {
  fail(`Unknown plan class: ${planClass}. Valid classes: ${Object.keys(cfg.planClasses).join(', ')}`);
}

// Check token limits
if (tokensApprox > planClassConfig.maxTokens) {
  fail(`${planClass} plan too long (${tokensApprox} tokens > ${planClassConfig.maxTokens})`);
}

// Check file count limits
if (filesTouched > planClassConfig.maxFiles) {
  fail(`${planClass} touches too many files (${filesTouched} > ${planClassConfig.maxFiles})`);
}

// Check for required justification on systemic changes
if (planClass === 'SYSTEMIC') {
  if (cfg.disallowSystemicWithoutJustification && !/Justification/i.test(plan)) {
    fail('Systemic change missing explicit Justification section');
  }
  
  if (planClassConfig.approvalRequired && !/APPROVAL_REQUIRED/i.test(plan)) {
    fail('Systemic change requires explicit approval acknowledgment');
  }
}

// Validate contract assertions
const forbiddenPatterns = cfg.contractValidation.forbiddenAssertions;
for (const pattern of forbiddenPatterns) {
  if (plan.toLowerCase().includes(pattern.toLowerCase())) {
    fail(`Plan contains forbidden assertion pattern: ${pattern}`);
  }
}

// Check for behavioral contracts
const hasContracts = /contracts?/i.test(plan) && /observable|behavioral|user-facing/i.test(plan);
if (!hasContracts) {
  fail('Plan must include behavioral contracts section');
}

ok(`${planClass} plan within limits and passes validation`);
