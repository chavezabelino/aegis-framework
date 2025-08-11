# Quality Gates

---

**Path:** `docs/quality-gates.md`
**Type:** update
**Content:**

````markdown
# QUALITY GATES

## Aegis Quality Gates

**Run locally**

```bash
pnpm run quality
````

**CI blocks merge if:**

* Type errors > 0
* ESLint errors > 0
* Coverage below 85% lines / 80% branches
* Mutation score < 60%
* @critical E2E fails
* Security/deps scan fails
* Provenance/waivers checks fail
* Or overall grade < **B**

**Waivers**

Add a waiver file at `.Aegis/waivers/<pr-number>.JSON`:

```json
{
  "policy": "coverage",
  "justification": "Temporarily low coverage on new parser; tests follow in next PR.",
  "scope": "src/parsers/**",
  "expiry": "2025-09-15"
}
```

CI verifies schema and expiry format. Keep waivers rare and short-lived.

## Quality Components

### 1. Type Safety

* **Tool:** TypeScript strict mode
* **Threshold:** 0 errors
* **Weight:** 25%

### 2. Code Quality

* **Tool:** ESLint with strict rules
* **Threshold:** 0 errors
* **Weight:** 10%

### 3. Test Coverage

* **Tool:** Vitest with V8 coverage
* **Threshold:** 85% lines, 80% branches
* **Weight:** 20%

### 4. Mutation Testing

* **Tool:** Stryker.js
* **Threshold:** 60% mutation score
* **Weight:** 20%

### 5. End-to-End Testing

* **Tool:** Playwright
* **Threshold:** All @critical tests pass
* **Weight:** 15%

### 6. Security & Dependencies

* **Tools:** Semgrep, Knip, Depcheck
* **Threshold:** No critical issues
* **Weight:** 5% each

### 7. Provenance & Governance

* **Tools:** Aegis provenance verification, waiver validation
* **Threshold:** All checks pass
* **Weight:** Included in overall grade

## Grade Calculation

Quality score is calculated as a weighted average:

* **A:** 90–100 points
* **B:** 80–89 points
* **C:** 70–79 points
* **F:** < 70 points

Minimum required grade: **C** (70 points) — temporarily lowered for legacy debt burn-down.

## Local Development

```bash
# Run all quality checks
pnpm run quality

# Run individual components
pnpm run types          # TypeScript check
pnpm run lint           # ESLint
pnpm run test:unit      # Unit tests with coverage
pnpm run test:e2e       # End-to-end tests
pnpm run deps:scan      # Dependency analysis
pnpm run sec:scan       # Security scan

# Provenance management
pnpm run Aegis:provenance:add     # Add headers to AI-generated files
pnpm run Aegis:provenance:verify  # Verify all AI files have headers
pnpm run Aegis:waivers:verify     # Validate waiver files
```

## Configuration

Quality thresholds are configured in `.Aegis/config/quality.JSON`:

```json
{
  "gradeBands": { "A": 90, "B": 80, "C": 70 },
  "thresholds": {
    "eslintErrors": 0,
    "typeErrors": 0,
    "coverage": { "lines": 85, "branches": 80 },
    "mutationScore": 60
  },
  "weights": {
    "types": 25,
    "lint": 10,
    "coverage": 20,
    "mutation": 20,
    "e2e": 15,
    "security": 5,
    "deps": 5
  },
  "failBelowGrade": "C"
}
```

## Best Practices

1. **Run quality checks early** — don’t wait for CI to catch issues.
2. **Keep waivers minimal** — temporary, justified exceptions only.
3. **Maintain high coverage** — aim for 90%+ on new code.
4. **Use semantic tokens** — avoid raw Tailwind utilities.
5. **Document AI-generated code** — always add provenance headers.
6. **Write strong tests** — focus on mutation score, not just coverage.

## Current Debt Burn-Down Plan

### Week 1: Foundation

* **Day 1–2:** Fix top 5–7 files with most errors (website components, CLI tools).
* **Day 3:** Remove types waiver; keep `failBelowGrade: "C"`.
* **Day 4–5:** Add unit tests to raise coverage ≥ 70%.
* **Day 6:** Flip `failBelowGrade` back to **B**.
* **Day 7:** Enable Stryker on all non-draft PRs.

### Top Error Files (Priority Order)

1. `website/src/pages/Dashboard.tsx` (60 errors) — JSX/React issues
2. `website/src/components/FrameworkStatus.tsx` (23 errors) — JSX/React issues
3. `website/src/components/HomepageFeatures/index.tsx` (13 errors) — JSX/React issues
4. `website/src/pages/index.tsx` (12 errors) — JSX/React issues
5. `packages/planning-CLI/src/index.ts` (8 errors) — import/module issues
6. `framework/healing/self-healing-governance.ts` (7 errors) — type issues
7. `CLI/Aegis-memory.ts` (7 errors) — error-handling issues

### Quick Commands for Debt Analysis

```bash
# Generate flat error list for Cursor quick-fix passes
pnpm types --pretty false > .Aegis/tmp/types.txt

# Get top error files by count
grep -E 'error TS' .Aegis/tmp/types.txt \
  | cut -d'(' -f1 \
  | sort \
  | uniq -c \
  | sort -nr \
  | head -30
```
