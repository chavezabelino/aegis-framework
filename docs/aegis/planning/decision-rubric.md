<!--
@aegisBlueprint: planning-optimization
@version: 1.0.0
@mode: strict
@intent: Decision rubric for selecting minimum viable plans that satisfy user contracts
@context: Core planning optimization guidance for AI agents
-->

# Aegis Decision Rubric — Lean First

> Purpose: Select the *minimum viable* plan that satisfies user contracts within current constraints.

## 1. Problem Framing (must be 3–6 lines)
- What is the user's **explicit ask**?
- What **must** be true when we're done? (contracts)
- What **must not** change? (invariants/constraints)

## 2. Plan Class Selection
Choose exactly one:
- **MVP-Fix**: 1–2 files, < 2h effort, no schema changes.
- **Surgical-Refactor**: ≤ 5 files, minimal surface, contracts preserved.
- **Systemic-Change**: requires schema/infra changes; only if MVP/Surgical can't meet contracts.

**Rule:** Prefer MVP-Fix → Surgical → Systemic, in that order. Justify any escalation in ≤ 3 bullets.

## 3. Behavior > Implementation
- Assert **observable behavior** (routes, ARIA roles, redirects), not internal classes/colors.
- Accept **equivalent valid outputs** (e.g., `/login` or `/(auth)/login`).

## 4. Cost & Risk Heuristics
- **Time**: Can an experienced dev complete this in a single sitting?
- **Blast radius**: #files touched × criticality.
- **Reversibility**: Can we revert without data migration?
- **Token cost**: Prompts/artifacts must be concise; prefer reusable templates.

## 5. Acceptance (binary)
- Contracts pass (Playwright/Vitest).
- No unintended route/visual regressions.
- CI "plan gate" passes (see scripts/ci/plan-gate.mjs).
