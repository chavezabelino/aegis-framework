<!--
@aegisFrameworkVersion: 2.3.0
@intent: Template section for agent instructions
@context: Modular content for framework instruction generation
-->
## 🧠 Drift Detection & Response

### Three-Layer Drift Monitoring
1. **Agent Behavior Drift**: Changes in code generation patterns, annotation compliance
2. **User Workflow Drift**: Deviations from established development patterns
3. **Framework System Drift**: Constitutional violations, version inconsistencies

### Drift Response Protocol
```typescript
// Check for drift
const driftResults = await detectDrift({
  type: ['agent-behavior', 'user-workflow', 'framework-system'],
  timeWindow: '24h'
});

// Auto-correct minor violations
if (driftResults.severity === 'low') {
  await autoCorrect(driftResults);
}

// Escalate critical violations
if (driftResults.severity === 'critical') {
  await escalateToConstitutionalConductor(driftResults);
}
```

### Predictive Enforcement
- **Pattern Recognition**: Learn from historical violations
- **Proactive Prevention**: Stop violations before they occur
- **Context-Aware Corrections**: Smart auto-fixes based on project patterns

### Drift Log Files
- `framework/drift-log/agent-behavior-drift.json`
- `framework/drift-log/framework-system-drift.json`
- `framework/drift-log/user-workflow-drift.json`

### CLI Commands
```bash
# Check current drift status
node cli/drift-cli.ts --check

# View drift history
node cli/drift-cli.ts --history --type agent-behavior

# Manual drift correction
node cli/drift-cli.ts --fix --severity low
```
