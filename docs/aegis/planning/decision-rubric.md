<!--
@aegisBlueprint: planning-optimization
# Aegis Decision Rubric — Lean First

@version: 1.0.0
@mode: strict
@intent: Decision rubric for selecting minimum viable plans that satisfy user contracts
@context: Core planning optimization guidance for AI agents
-->

# Aegis Decision Rubric — Lean First

> Purpose: Select the _minimum viable_ plan that satisfies user contracts within current constraints.

## 1. Problem Framing (must be 3–6 lines)

- What is the user's __explicit ask__?
- What __must__ be true when we're done? (contracts)
- What __must not__ change? (invariants/constraints)

## 2. Plan Class Selection

Choose exactly one:

- __MVP-Fix__: 1–2 files, < 2h effort, no schema changes.
- __Surgical-Refactor__: ≤ 5 files, minimal surface, contracts preserved.
- __Systemic-Change__: requires schema/infra changes; only if MVP/Surgical can't meet contracts.

**Rule:__ Prefer MVP-Fix → Surgical → Systemic, in that order. Justify any escalation in ≤ 3 bullets.

## 3. Behavior > Implementation

- Assert __observable behavior__ (routes, ARIA roles, redirects), not internal classes/colors.
- Accept __equivalent valid outputs__ (e.g., `/login` or `/(auth)/login`).

## 4. Cost & Risk Heuristics

- __Time__: Can an experienced dev complete this in a single sitting?
- __Blast radius__: #files touched × criticality.
- __Reversibility__: Can we revert without data migration?
- __Token cost__: Prompts/artifacts must be concise; prefer reusable templates.

## 5. Acceptance (binary)

- Contracts pass (Playwright/Vitest).
- No unintended route/visual regressions.
- CI "plan gate" passes (see scripts/ci/plan-gate.mjs).
