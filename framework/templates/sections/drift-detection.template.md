<!--
@aegisFrameworkVersion: 2.4.0
@intent: Template section for agent instructions
@context: Modular content for framework instruction generation
-->

## 🧠 Drift Detection & Response

### Three-Layer Drift Monitoring

1. __Agent Behavior Drift__: Changes in code generation patterns, annotation compliance
2. __User Workflow Drift__: Deviations from established development patterns
3. __Framework System Drift__: Constitutional violations, version inconsistencies

### Drift Response Protocol

```typescript
// Check for drift
const driftResults = await detectDrift({
  type: ["agent-behavior", "user-workflow", "framework-system"],
  timeWindow: "24h"
})

// Auto-correct minor violations
if (driftResults.severity === "low") {
  await autoCorrect(driftResults)
}

// Escalate critical violations
if (driftResults.severity === "critical") {
  await escalateToConstitutionalConductor(driftResults)
}
```text

### Predictive Enforcement

- __Pattern Recognition__: Learn from historical violations
- __Proactive Prevention__: Stop violations before they occur
- __Context-Aware Corrections__: Smart auto-fixes based on project patterns

### Drift Log Files

- `framework/drift-log/agent-behavior-drift.JSON`
- `framework/drift-log/framework-system-drift.JSON`
- `framework/drift-log/user-workflow-drift.JSON`

### CLI Commands

```bash
# Check current drift status
node CLI/drift-CLI.ts --check

# View drift history
node CLI/drift-CLI.ts --history --type agent-behavior

# Manual drift correction
node CLI/drift-CLI.ts --fix --severity low
```text
