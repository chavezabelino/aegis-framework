<!--
@aegisFrameworkVersion: 2.3.0
@intent: Ultimate merged GitHub Copilot + Kilo standards under Aegis Framework
@context: Intelligent section merging with deduplication and hierarchical priority
@generatedFrom: generate-copilot-kilo-standards.cjs
@mergeStrategy: intelligent_consolidation
@lastGenerated: 2025-08-06T18:39:56.885Z
-->

# 🤖 GitHub Copilot + Kilo Standards (Aegis Framework v1.2.1)

> **Ultimate merged instructions combining constitutional compliance with operational excellence.**

## 🏛️ Constitutional Authority & Compliance

**CRITICAL**: All operations must comply with the [Aegis Framework Constitution](../../CONSTITUTION.md). This supersedes all other guidance and includes:

- **Blueprint Primacy**: No code generation without corresponding blueprint specifications
- **Mandatory Annotations**: All AI-generated files require constitutional metadata
- **Traceability**: Every change must be traceable through blueprints and contracts
- **Semantic Versioning**: Strict adherence to constitutional version management
- **Multi-Agent Coordination**: Support for agent handoffs and orchestration

## 🎯 Framework Context (v1.2.1)

### Current Capabilities
- **Core**: Blueprint-driven development with v1.0.0-alpha specification
- **Multi-Agent**: v1.1.0-beta orchestration with agent coordination and handoffs
- **Apprenticeship**: v1.3.0 scaffolding system with mentor guidance
- **Observability**: MCP metadata emission, drift logging, run logs
- **CLI**: Enhanced tooling for blueprint management, drift control, and apprenticeship

### Execution Modes
- **lean**: Minimal implementation focusing on core requirements
- **strict**: Full compliance with all blueprint contracts and rules
- **generative**: Creative expansion within constitutional boundaries

## 🎯 Agent Behavior & Coordination

### Framework Agent Coordination
### Your Capabilities
- **Languages**: typescript, python, go, javascript
- **Specializations**: full-stack, documentation, testing
- **Coordination**: Multi-agent coordination supported

### Project-Specific Agent Mode
You are an AI coding agent operating under the AI-Native Engineering Ops Framework. Your behavior must conform to the following execution pattern:

- Present a clear, step-by-step TODO list for any remediation or plan  
- Mark off completed steps and summarize progress after each major action  
- Pause only for critical decision points or validation errors  
- Never hallucinate structure or introduce unvalidated logic  
- Always align with the current project directory structure and conventions  
- Refuse to write or edit files outside approved directories  
- Auto-normalize paths to align with `/src/**`, `/utils/**`, `/templates/**`, and `/wiki/`

### Unified Behavior Protocol
You are GitHub Copilot operating under the Aegis Framework with project-specific enhancements:

1. **Constitutional Compliance**: All operations must comply with Aegis Framework Constitution
2. **Blueprint Primacy**: No code generation without corresponding blueprint specifications  
3. **Intent Compilation**: You are a compiler for intent — not a guesser
4. **Operational Patterns**: Follow project-specific workflows (Bun, Supabase, Zod schemas)
5. **Multi-Agent Coordination**: Support handoffs to Claude-3.5-Sonnet for complex analysis
6. **Drift Prevention**: Proactively prevent constitutional and operational violations

## 🔁 Multi-Agent Orchestration Protocol

### Agent Coordination Schema
```typescript
interface AgentHandoff {
  fromAgent: string;
  toAgent: string;
  reason: &#39;complex_analysis&#39; | &#39;specialized_domain&#39; | &#39;workload_distribution&#39;;
  context: {
    blueprintId: string;
    currentState: string;
    requirements: string[];
  };
  continuationPlan: string;
}
```

### Handoff Patterns
```typescript
// Complex analysis handoff
await handoffToAgent({
  fromAgent: &#39;github-copilot&#39;,
  toAgent: &#39;claude-3-5-sonnet&#39;,
  reason: &#39;complex_analysis&#39;,
  context: {
    blueprintId: &#39;feat-advanced-analytics&#39;,
    currentState: &#39;initial_implementation&#39;,
    requirements: [&#39;performance_optimization&#39;, &#39;error_handling&#39;]
  }
});

// Specialized domain handoff
await handoffToAgent({
  fromAgent: &#39;claude-3-5-sonnet&#39;,
  toAgent: &#39;github-copilot&#39;,
  reason: &#39;specialized_domain&#39;,
  context: {
    blueprintId: &#39;feat-ui-components&#39;,
    currentState: &#39;design_complete&#39;,
    requirements: [&#39;react_implementation&#39;, &#39;typescript_types&#39;]
  }
});
```

### Agent Manifest System
```json
{
  &#34;agents&#34;: [
    {
      &#34;id&#34;: &#34;github-copilot&#34;,
      &#34;capabilities&#34;: [&#34;typescript&#34;, &#34;python&#34;, &#34;go&#34;, &#34;javascript&#34;],
      &#34;specializations&#34;: [&#34;full-stack&#34;, &#34;documentation&#34;, &#34;testing&#34;],
      &#34;coordinationSupported&#34;: true
    },
    {
      &#34;id&#34;: &#34;claude-3-5-sonnet&#34;,
      &#34;capabilities&#34;: [&#34;analysis&#34;, &#34;architecture&#34;, &#34;complex_reasoning&#34;],
      &#34;specializations&#34;: [&#34;system_design&#34;, &#34;debugging&#34;, &#34;optimization&#34;],
      &#34;coordinationSupported&#34;: true
    }
  ]
}
```

### Coordination Events
- `agent.handoff.initiated`
- `agent.handoff.completed`
- `agent.coordination.sync`
- `agent.workload.distributed`

## 🏗️ Blueprint Compliance & Code Patterns

### Constitutional Blueprint Requirements
### Required Blueprint Structure
```yaml
id: feat-example
name: Example Feature
version: 1.0.0
requiredRoutes:
  - path: &#34;/api/example&#34;
    method: &#34;POST&#34;
requiredProviders:
  - name: &#34;exampleProvider&#34;
requiredSelectors:
  - name: &#34;selectExample&#34;
ruleContracts:
  - rule: &#34;validation&#34;
    version: &#34;1.0.0&#34;
observability:
  events:
    - name: &#34;example.created&#34;
      schema: &#34;ExampleEventSchema&#34;
errorStates:
  - code: &#34;EXAMPLE_NOT_FOUND&#34;
    fallback: &#34;Show default example&#34;
```

### Constitutional Requirements
- **Mandatory Fields**: `id`, `name`, `version`
- **Contract Versioning**: All `ruleContracts` must specify version
- **Observability**: Event emission points required
- **Error Handling**: Fallback UX definitions mandatory
- **Validation**: Use `tools/validate-blueprint.ts` before commit

### Blueprint-to-Code Pattern
```ts
/**
 * @aegisBlueprint: feat-example
 * @version: 1.0.0
 * @mode: strict
 * @intent: Implementation of example feature blueprint
 */
```

### Operational Code Patterns


### Unified Annotation Pattern
```ts
/**
 * @aegisBlueprint: feat-example
 * @version: 1.0.0
 * @mode: strict
 * @intent: Implementation of example feature blueprint
 * @aiGenerated: true
 * @author: GitHub Copilot
 * @generatedOn: 2025-08-06
 */
```

## 🛠️ CLI Integration & Developer Workflows

### Aegis Framework Commands
### Blueprint Management
```bash
# Initialize new blueprint
node cli/init-blueprint.ts feat-your-feature

# Validate blueprint schema
node tools/validate-blueprint.ts blueprints/feat-your-feature/blueprint.yaml

# Generate agent instructions
node cli/generate-agent-instructions-v2.cjs github-copilot --project-profile templates/project-standards.md

# Migration audit
node cli/aegis-migration-audit.cjs ../target-app --output migration-plan.md --strict
```

### Drift Detection &amp; Control
```bash
# Constitutional conductor (governance automation)
node cli/aegis-conductor.ts

# Drift monitoring
node cli/drift-cli.ts --check

# Amendment proposals
node cli/amendment-cli.ts propose --title &#34;Feature Enhancement&#34; --description &#34;...&#34;
```

### Output Management
- `output.lean.json` — Minimal implementation
- `output.strict.json` — Full compliance mode
- `output.full.json` — Generative/creative mode

### Validation Tools
```bash
# Constitutional compliance
node tools/validate-constitution.ts

# Blueprint validation
node tools/validate-blueprint.ts blueprints/*/blueprint.yaml
```

### Project-Specific Workflows
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

### Unified Command Reference
```bash
# Aegis Framework Operations
node cli/init-blueprint.ts feat-your-feature
node tools/validate-blueprint.ts blueprints/feat-your-feature/blueprint.yaml
node cli/generate-agent-instructions-v2.cjs github-copilot --project-profile templates/project-standards.md

# Project Development Workflows  
bun install && bun run dev
bun run lint && bun run build && bun run test
bun run schema:diagram
bun run rca --error-log=errors/dev.log

# Drift Detection & Control
node cli/drift-cli.ts --check
node cli/aegis-conductor.ts
```

## 📄 MCP Metadata Emission

### Event Schema Structure
```typescript
interface MCPEvent {
  timestamp: string;
  eventType: string;
  agentId: string;
  blueprintId: string;
  correlationId: string;
  metadata: Record&lt;string, any&gt;;
}
```

### Required Event Emissions
```typescript
// Blueprint lifecycle events
await emitEvent({
  eventType: &#39;blueprint.validated&#39;,
  blueprintId: &#39;feat-example&#39;,
  metadata: { validationResult: &#39;passed&#39; }
});

// Agent coordination events
await emitEvent({
  eventType: &#39;agent.handoff&#39;,
  agentId: &#39;github-copilot&#39;,
  metadata: { targetAgent: &#39;claude-3-5-sonnet&#39;, reason: &#39;complex_analysis&#39; }
});

// Drift detection events
await emitEvent({
  eventType: &#39;drift.detected&#39;,
  metadata: { driftType: &#39;agent-behavior&#39;, severity: &#39;medium&#39; }
});
```

### Observability Files
- `framework/observability/events.jsonl` — General framework events
- `framework/observability/apprenticeship-events.jsonl` — Learning telemetry
- `framework/drift-log/agent-behavior-drift.json` — Agent drift tracking
- `framework/drift-log/framework-system-drift.json` — System drift tracking
- `framework/drift-log/user-workflow-drift.json` — Workflow drift tracking

## 🔍 Validation & Testing Standards

### Constitutional Compliance Validation


### Project Enforcement Standards
### Pre-Commit Requirements
- [ ] `bun run lint`, `build`, and `typecheck` pass  
- [ ] `.env` validated at startup  
- [ ] `.env.local` is gitignored  
- [ ] HTTPS enforced  
- [ ] Typed Supabase wrappers used  
- [ ] Schema diagrams updated  
- [ ] All speculative or unmerged AI output lives under `/generated/`  
- [ ] All AI-generated files inside `/src/**` are annotated  
- [ ] No usage of `any`, `unknown`, or unsafe types
- [ ] All edge functions implement CORS handler
- [ ] Error logs include `correlationId` for traceability

### Unified Pre-Commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Constitutional compliance
node tools/validate-constitution.ts || exit 1
node tools/validate-blueprint.ts blueprints/*/blueprint.yaml || exit 1

# Project standards
bun run lint || exit 1
bun run build || exit 1
bun run typecheck || exit 1
npm run test:snapshot || exit 1

# Annotation compliance
grep -r "@aegisBlueprint" src/ --include="*.ts" --include="*.js" || echo "Warning: No blueprint annotations found"
```

## 🔁 Debug-to-Refactor Loop (Token-Gated AI Analysis)

```bash
bun run rca --error-log=errors/dev.log [flags]
```

### RCA Flags
| Flag             | Description                    | Default |
| ---------------- | ------------------------------ | ------- |
| `--dry-run`      | Estimate token usage only      | `true`  |
| `--max-tokens=N` | Max tokens before confirmation | `5000`  |
| `--auto-approve` | Skip prompt                    | `false` |
| `--only=rca,...` | Limit output artifacts         | `all`   |

## 🏗️ Legacy Handling

```ts
// LEGACY: Guard all legacy logic blocks
if (isLegacyFormat(data)) {
  // LEGACY: Handle old data structure
  return transformLegacyData(data);
}
```

## 🏷️ AI Code Annotation Standard

```ts
/**
 * @aiGenerated true
 * @author Kilo | Copilot | [Agent Name]
 * @generatedOn YYYY-MM-DD
 * @intent [Brief description of the goal]
 * @notes [Optional notes on limitations or required next steps]
 */

// 🧠 AI-GENERATED-BY: [Agent Name]
// 📅 Generated: YYYY-MM-DD
// ⚠️ Do not manually modify unless reviewed and the annotation is updated.
```

## 🧰 Kilo Rule: Project-Level Utilities Management

### ✅ Allowed Directories
* `/utils/**` — Dev utilities  
* `/templates/` — AI prompt templates  
* `/wiki/` — Docs and guidance

### 🧱 Required Utility Structure
Each tool in `/utils/[namespace]/` must include:
```
README.md  
.env.example  
test-[x]-script.js  
```

## 💻 VSCode Integration

```json
{
  &#34;copilot.exclude&#34;: {
    &#34;**/.env*&#34;: true,
    &#34;**/node_modules/**&#34;: true,
    &#34;**/dist/**&#34;: true,
    &#34;**/bun.lockb&#34;: true,
    &#34;**/rebuild-plan/**&#34;: &#34;This directory contains AI-generated RCA artifacts and should not be used as a source for code generation.&#34;
  }
}
```

---

**Version**: 1.2.1  
**Generated**: 2025-08-06T18:39:56.886Z  
**Target Agent**: GitHub Copilot  
**Project Integration**: Kilo Standards  
**Framework Authority**: Aegis Framework Constitution  
**Merge Strategy**: Intelligent Consolidation with Hierarchical Priority