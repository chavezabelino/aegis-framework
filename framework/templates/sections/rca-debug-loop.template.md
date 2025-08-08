<!--
@aegisFrameworkVersion: 2.3.0
@intent: Template section for agent instructions
@context: Modular content for framework instruction generation
-->
## 🔁 Debug-to-Refactor Loop (Token-Gated AI Analysis)

**Battle-tested pattern from v2.5 bracket-app-audit standards**

```bash
bun run rca --error-log=errors/dev.log [flags]
```

### RCA Flags
| Flag             | Description                    | Default | Impact          |
| ---------------- | ------------------------------ | ------- | --------------- |
| `--dry-run`      | Estimate token usage only      | `true`  | Cost control    |
| `--max-tokens=N` | Max tokens before confirmation | `5000`  | Budget limiting |
| `--auto-approve` | Skip prompt                    | `false` | Safety gate     |
| `--only=rca,...` | Limit output artifacts         | `all`   | Scope control   |

### Integration with Constitutional Compliance
```ts
// Emit RCA analysis event for drift monitoring
await emitEvent({
  eventType: 'rca.analysis.started',
  metadata: { 
    errorLog: 'errors/dev.log',
    tokenEstimate: estimatedTokens,
    blueprintContext: currentBlueprintId 
  }
});

// Run RCA with constitutional awareness
const rcaResult = await runTokenGatedAnalysis({
  errorLog: 'errors/dev.log',
  constitutionalMode: true,
  blueprintValidation: true
});
```

### Output Artifacts (Enhanced)
- **`/generated/rca-analysis/`** — Token-gated AI analysis outputs
- **`/generated/migration-plans/`** — Structured diffs and transitions  
- **Constitutional compliance check** — Blueprint impact assessment
- **Drift detection integration** — Feeds into framework monitoring

## 🛠️ Developer Workflows

| Task                | Command              | Validation                    |
|---------------------|----------------------|-------------------------------|
| Install dependencies | `bun install`        | Check bun.lockb               |
| Start dev server     | `bun run dev`        | HTTPS enforced                |
| Lint                 | `bun run lint`       | Must pass before commit       |
| Build                | `bun run build`      | TypeScript strict mode        |
| Test                 | `bun run test`       | Coverage reports              |
| Schema Diagrams      | `bun run schema:diagram` | Auto-update docs/         |
| RCA Debug Loop       | `bun run rca --error-log=errors/dev.log` | Token-gated analysis |
| Deploy               | Use Lovable UI/CLI   | Automated deployment          |
