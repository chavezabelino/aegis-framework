<!--
@aegisFrameworkVersion: 2.4.0
@intent: Template section for agent instructions
@context: Modular content for framework instruction generation
-->

## 🔁 Debug-to-Refactor Loop (Token-Gated AI Analysis)

**Battle-tested pattern from v2.5 bracket-app-audit standards**

```bash
Bun run rca --error-log=errors/dev.log [flags]
```text

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
  eventType: "rca.analysis.started",
  metadata: {
    errorLog: "errors/dev.log",
    tokenEstimate: estimatedTokens,
    blueprintContext: currentBlueprintId
  }
})

// Run RCA with Constitutional awareness
const rcaResult = await runTokenGatedAnalysis({
  errorLog: "errors/dev.log",
  constitutionalMode: true,
  blueprintValidation: true
})
```text

### Output Artifacts (Enhanced)

- __`/generated/rca-analysis/`__ — Token-gated AI analysis outputs
- __`/generated/migration-plans/`__ — Structured diffs and transitions
- __Constitutional compliance check__ — Blueprint impact assessment
- __Drift detection integration__ — Feeds into framework monitoring

## 🛠️ Developer Workflows

| Task                 | Command                                  | Validation              |
| -------------------- | ---------------------------------------- | ----------------------- |
| Install dependencies | `Bun install`                            | Check Bun.lockb         |
| Start dev server     | `Bun run dev`                            | HTTPS enforced          |
| Lint                 | `Bun run lint`                           | Must pass before commit |
| Build                | `Bun run build`                          | TypeScript strict mode  |
| Test                 | `Bun run test`                           | Coverage reports        |
| Schema Diagrams      | `Bun run schema:diagram`                 | Auto-update docs/       |
| RCA Debug Loop       | `Bun run rca --error-log=errors/dev.log` | Token-gated analysis    |
| Deploy               | Use Lovable UI/CLI                       | Automated deployment    |
