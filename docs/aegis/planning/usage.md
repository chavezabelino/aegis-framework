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

```
cp docs/Aegis/planning/minimum-viable-plan.md ./PLAN.md
# Edit PLAN.md with your specific plan
```

### 2. Run the Plan Gate

Validate your plan against Constitutional constraints:

```
# For MVP plans
node scripts/ci/plan-gate.mjs MVP ./PLAN.md 2

# For Surgical plans
node scripts/ci/plan-gate.mjs SURGICAL ./PLAN.md 5

# For Systemic plans
node scripts/ci/plan-gate.mjs SYSTEMIC ./PLAN.md 10
```

## With AI Agents

### Kilo/Cursor Integration

Use the provided prompts for AI-assisted planning:

- **Plan Generation**: Use `tools/prompts/Aegis-plan-optimizer.kilo.md`
- **Test Generation**: Use `tools/prompts/contract-driven-tests.kilo.md`

### ConstitutionalConstitutional Compliance

All plans must include:

```
<!--
@aegisBlueprint: planning-optimization
@version: 1.0.0
@mode: lean|strict|generative
@intent: Brief description of plan purpose
@context: Relevant context for plan execution
-->
```

## CI/CD Integration

### GitHub Actions Example

```
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
```

### Pre-commit Hook

Add to your `.pre-commit-config.YAML`:

```
- repo: local
  hooks:
    - id: plan-gate
      name: Plan Gate Validation
      entry: node scripts/ci/plan-gate.mjs MVP PLAN.md 2
      files: PLAN.md
      pass_filenames: false
```

## Plan Classes

### MVP-Fix (Recommended)

- **Scope**: 1-2 files, < 2 hours
- **Use Case**: Bug fixes, minor enhancements
- **Constraints**: No schema changes, no infrastructure changes

### Surgical-Refactor

- **Scope**: ≤ 5 files, < 8 hours
- **Use Case**: Refactoring, component extraction, API improvements
- **Constraints**: No breaking changes, preserve contracts

### Systemic-Change (Requires Justification)

- **Scope**: ≤ 20 files, < 40 hours
- **Use Case**: Schema changes, infrastructure changes, breaking changes
- **Requirements**: Explicit justification, approval acknowledgment

## Contract-Driven Development

### Behavioral Contracts

Focus on observable behavior, not implementation:

✅ **Good Contracts**:

- "Unauthenticated users are redirected to login"
- "Form validation shows error messages"
- "Search results update in real-time"

❌ **Bad Contracts**:

- "Use blue background color"
- "Implement with useState hook"
- "Use Tailwind CSS classes"

### Route Equivalence

Accept multiple valid implementations:

```
// Both are valid
const loginRoute = "/login"
const loginRoute = "/(auth)/login"
```

### Theme Policy

Avoid exact RGB values, prefer semantic tokens:

```
// ✅ Good
const primaryColor = "var(--color-primary)"
const gradient = "linear-gradient(to right, var(--color-start), var(--color-end))"

// ❌ Bad
const primaryColor = "#3B82F6"
```

## Troubleshooting

### Common Plan Gate Failures

1. **Plan Too Long**: Reduce scope or split into multiple plans
2. **Too Many Files**: Consolidate changes or escalate to next plan class
3. **Missing Justification**: Add explicit justification for systemic changes
4. **Forbidden Assertions**: Remove implementation-specific requirements
5. **Missing Contracts**: Add behavioral contract section

### Getting Help

- Check the decision rubric: `docs/Aegis/planning/decision-rubric.md`
- Review plan templates: `docs/Aegis/planning/minimum-viable-plan.md`
- Validate Blueprint: `node CLI/validate-Blueprint.ts patterns/planning-optimization/Blueprint.YAML`
