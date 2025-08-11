<!--
@aegisBlueprint: planning-optimization
# Using the Planner Optimization

@version: 1.0.0
@mode: lean
@intent: Usage documentation for the planning optimization system
@context: Guide for developers and AI agents on using planning optimization
-->

# Using the Planner Optimization

## Local Development

### 1. Draft Your Plan

Use the `minimum-viable-plan.md` template to create your plan:

```bash
cp docs/Aegis/planning/minimum-viable-plan.md ./PLAN.md
# Edit PLAN.md with your specific plan
```text

### 2. Run the Plan Gate

Validate your plan against Constitutional constraints:

```bash
# For MVP plans
node scripts/ci/plan-gate.mjs MVP ./PLAN.md 2

# For Surgical plans
node scripts/ci/plan-gate.mjs SURGICAL ./PLAN.md 5

# For Systemic plans
node scripts/ci/plan-gate.mjs SYSTEMIC ./PLAN.md 10
```text

## With AI Agents

### Kilo/Cursor Integration

Use the provided prompts for AI-assisted planning:

- __Plan Generation__: Use `tools/prompts/Aegis-plan-optimizer.kilo.md`
- __Test Generation__: Use `tools/prompts/contract-driven-tests.kilo.md`

### ConstitutionalConstitutional Compliance

All plans must include:

```markdown
<!--
@aegisBlueprint: planning-optimization
@version: 1.0.0
@mode: lean|strict|generative
@intent: Brief description of plan purpose
@context: Relevant context for plan execution
-->
```text

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Plan Gate Validation
on: [pull_request]
jobs:
  plan-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate Plan
        run: |
          if [ -f PLAN.md ]; then
            node scripts/ci/plan-gate.mjs MVP PLAN.md 2
          fi
```text

### Pre-commit Hook

Add to your `.pre-commit-config.YAML`:

```yaml
- repo: local
  hooks:
    - id: plan-gate
      name: Plan Gate Validation
      entry: node scripts/ci/plan-gate.mjs MVP PLAN.md 2
      files: PLAN.md
      pass_filenames: false
```text

## Plan Classes

### MVP-Fix (Recommended)

- __Scope__: 1-2 files, < 2 hours
- __Use Case__: Bug fixes, minor enhancements
- __Constraints__: No schema changes, no infrastructure changes

### Surgical-Refactor

- __Scope__: ≤ 5 files, < 8 hours
- __Use Case__: Refactoring, component extraction, API improvements
- __Constraints__: No breaking changes, preserve contracts

### Systemic-Change (Requires Justification)

- __Scope__: ≤ 20 files, < 40 hours
- __Use Case__: Schema changes, infrastructure changes, breaking changes
- __Requirements__: Explicit justification, approval acknowledgment

## Contract-Driven Development

### Behavioral Contracts

Focus on observable behavior, not implementation:

✅ __Good Contracts__:

- "Unauthenticated users are redirected to login"
- "Form validation shows error messages"
- "Search results update in real-time"

❌ __Bad Contracts__:

- "Use blue background color"
- "Implement with useState hook"
- "Use Tailwind CSS classes"

### Route Equivalence

Accept multiple valid implementations:

```typescript
// Both are valid
const loginRoute = "/login"
const loginRoute = "/(auth)/login"
```text

### Theme Policy

Avoid exact RGB values, prefer semantic tokens:

```typescript
// ✅ Good
const primaryColor = "var(--color-primary)"
const gradient = "linear-gradient(to right, var(--color-start), var(--color-end))"

// ❌ Bad
const primaryColor = "#3B82F6"
```text

## Troubleshooting

### Common Plan Gate Failures

1. __Plan Too Long__: Reduce scope or split into multiple plans
2. __Too Many Files__: Consolidate changes or escalate to next plan class
3. __Missing Justification__: Add explicit justification for systemic changes
4. __Forbidden Assertions__: Remove implementation-specific requirements
5. __Missing Contracts__: Add behavioral contract section

### Getting Help

- Check the decision rubric: `docs/Aegis/planning/decision-rubric.md`
- Review plan templates: `docs/Aegis/planning/minimum-viable-plan.md`
- Validate Blueprint: `node CLI/validate-Blueprint.ts patterns/planning-optimization/Blueprint.YAML`
