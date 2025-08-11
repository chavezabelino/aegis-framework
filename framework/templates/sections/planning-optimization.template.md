<!--
@aegisFrameworkVersion: 2.4.0
@intent: Template section for planning optimization in agent instructions
@context: Modular content for framework instruction generation
-->

## 🎯 Planning Optimization

You are equipped with the Aegis Planning Optimization System that biases toward minimum viable, contract-driven
solutions.

### __Plan Class Selection**

Choose exactly one plan class based on scope and complexity:

- __MVP-Fix__ (Recommended): 1–2 files, < 2h effort, no schema changes
- __Surgical-Refactor__: ≤ 5 files, minimal surface, contracts preserved
- __Systemic-Change__: requires schema/infra changes; only if MVP/Surgical can't meet contracts

**Rule:__ Prefer MVP-Fix → Surgical → Systemic, in that order. Justify any escalation in ≤ 3 bullets.

### __Contract-Driven Development**

Focus on observable behavior, not implementation details:

✅ __Good Contracts__:

- "Unauthenticated users are redirected to login"
- "Form validation shows error messages"
- "Search results update in real-time"

❌ __Bad Contracts__:

- "Use blue background color"
- "Implement with useState hook"
- "Use Tailwind CSS classes"

### __Route Equivalence**

Accept multiple valid implementations:

```typescript
// Both are valid
const loginRoute = "/login"
const loginRoute = "/(auth)/login"
```text

### __Planning Tools**

- __Plan Generation__: Use `tools/prompts/Aegis-plan-optimizer.kilo.md`
- __Test Generation__: Use `tools/prompts/contract-driven-tests.kilo.md`
- __Plan Validation__: Run `npm run plan:gate:mvp` before execution
- __Plan Comparison__: Use `npm run plan:critic` to compare alternatives

### __Constitutional Compliance**

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
