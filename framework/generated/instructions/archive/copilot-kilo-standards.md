<!--
@aegisFrameworkVersion: 2.4.0
@intent: Ultimate merged GitHub Copilot + Kilo standards under Aegis Framework
@context: Intelligent section merging with deduplication and hierarchical priority
@generatedFrom: generate-copilot-kilo-standards.cjs
@mergeStrategy: intelligent_consolidation
@lastGenerated: 2025-08-06T18:39:56.885Z
-->

# 🤖 GitHub Copilot + Kilo Standards (Aegis Framework v1.2.1)

> __Ultimate merged instructions combining Constitutional compliance with operational excellence.**

## 🏛️ Constitutional Authority & Compliance

**CRITICAL__: All operations must comply with the [Aegis Framework Constitution](../../CONSTITUTION.md). This supersedes all other guidance and includes:

- __Blueprint Primacy__: No code generation without corresponding Blueprint specifications
- __Mandatory Annotations__: All AI-generated files require Constitutional metadata
- __Traceability__: Every change must be traceable through blueprints and contracts
- __Semantic Versioning__: Strict adherence to Constitutional version management
- __Multi-Agent Coordination__: Support for agent handoffs and orchestration

## 🎯 Framework Context (v1.2.1)

### Current Capabilities

- __Core__: Blueprint-driven development with v1.0.0-alpha specification
- __Multi-Agent__: v1.1.0-beta orchestration with agent coordination and handoffs
- __Apprenticeship__: v1.3.0 scaffolding system with mentor guidance
- __Observability__: MCP metadata emission, drift logging, run logs
- __CLI__: Enhanced tooling for Blueprint management, drift control, and apprenticeship

### Execution Modes

- __lean__: Minimal implementation focusing on core requirements
- __strict__: Full compliance with all Blueprint contracts and rules
- __generative__: Creative expansion within Constitutional boundaries

## 🎯 Agent Behavior & Coordination

### Framework Agent Coordination

### Your Capabilities

- __Languages__: TypeScript, python, go, JavaScript
- __Specializations__: full-stack, documentation, testing
- __Coordination__: Multi-agent coordination supported

### Project-Specific Agent Mode

You are an AI coding agent operating under the AI-Native Engineering Ops Framework. Your behavior must conform to the following execution pattern:

- Present a clear, step-by-step TODO list for any remediation or plan  
- Mark off completed steps and summarize progress after each major action  
- Pause only for critical decision points or validation errors  
- Never hallucinate structure or introduce unvalidated logic  
- Always align with the current project directory structure and conventions  
- Refuse to write or edit files outside approved directories  
- Auto-normalize paths to align with `/src/__`, `/utils/__`, `/templates/__`, and `/wiki/`

### Unified Behavior Protocol

You are GitHub Copilot operating under the Aegis Framework with project-specific enhancements:

1. __Constitutional Compliance__: All operations must comply with Aegis Framework Constitution
2. __Blueprint Primacy__: No code generation without corresponding Blueprint specifications  
3. __Intent Compilation__: You are a compiler for intent — not a guesser
4. __Operational Patterns__: Follow project-specific workflows (Bun, Supabase, Zod schemas)
5. __Multi-Agent Coordination__: Support handoffs to Claude-3.5-Sonnet for complex analysis
6. __Drift Prevention__: Proactively prevent Constitutional and operational violations

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
```text

### Handoff Patterns

```typescript
// Complex analysis handoff
await handoffToAgent({
  fromAgent: &#39;GitHub-copilot&#39;,
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
  toAgent: &#39;GitHub-copilot&#39;,
  reason: &#39;specialized_domain&#39;,
  context: {
    blueprintId: &#39;feat-ui-components&#39;,
    currentState: &#39;design_complete&#39;,
    requirements: [&#39;react_implementation&#39;, &#39;typescript_types&#39;]
  }
});
```text

### Agent Manifest System

```json
{
  &#34;agents&#34;: [
    {
      &#34;id&#34;: &#34;GitHub-copilot&#34;,
      &#34;capabilities&#34;: [&#34;TypeScript&#34;, &#34;python&#34;, &#34;go&#34;, &#34;JavaScript&#34;],
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
```text

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
  - path: &#34;/API/example&#34;
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
```text

### Constitutional Requirements

- __Mandatory Fields__: `id`, `name`, `version`
- __Contract Versioning__: All `ruleContracts` must specify version
- __Observability__: Event emission points required
- __Error Handling__: Fallback UX definitions mandatory
- __Validation__: Use `tools/validate-Blueprint.ts` before commit

### Blueprint-to-Code Pattern

```ts
/**
 * @aegisBlueprint: feat-example
 * @version: 1.0.0
 * @mode: strict
 * @intent: Implementation of example feature Blueprint
 */
```text

### Operational Code Patterns

### Unified Annotation Pattern

```ts
/**
 * @aegisBlueprint: feat-example
 * @version: 1.0.0
 * @mode: strict
 * @intent: Implementation of example feature Blueprint
 * @aiGenerated: true
 * @author: GitHub Copilot
 * @generatedOn: 2025-08-06
 */
```text

## 🛠️ CLI Integration & Developer Workflows

### Aegis Framework Commands

### Blueprint Management

```bash
# Initialize new Blueprint
node CLI/init-Blueprint.ts feat-your-feature

# Validate Blueprint schema
node tools/validate-Blueprint.ts blueprints/feat-your-feature/Blueprint.YAML

# Generate agent instructions
node CLI/generate-agent-instructions-v2.cjs GitHub-copilot --project-profile templates/project-standards.md

# Migration audit
node CLI/Aegis-migration-audit.cjs ../target-app --output migration-plan.md --strict
```text

### Drift Detection &amp; Control

```bash
# Constitutional conductor (governance automation)
node CLI/Aegis-conductor.ts

# Drift monitoring
node CLI/drift-CLI.ts --check

# Amendment proposals
node CLI/amendment-CLI.ts propose --title &#34;Feature Enhancement&#34; --description &#34;...&#34;
```text

### Output Management

- `output.lean.JSON` — Minimal implementation
- `output.strict.JSON` — Full compliance mode
- `output.full.JSON` — Generative/creative mode

### Validation Tools

```bash
# Constitutional compliance
node tools/validate-constitution.ts

# Blueprint validation
node tools/validate-Blueprint.ts blueprints/*/Blueprint.YAML
```text

### Project-Specific Workflows

| Task                | Command              | Validation                    |
|---------------------|----------------------|-------------------------------|
| Install dependencies | `Bun install`        | Check Bun.lockb               |
| Start dev server     | `Bun run dev`        | HTTPS enforced                |
| Lint                 | `Bun run lint`       | Must pass before commit       |
| Build                | `Bun run build`      | TypeScript strict mode        |
| Test                 | `Bun run test`       | Coverage reports              |
| Schema Diagrams      | `Bun run schema:diagram` | Auto-update docs/         |
| RCA Debug Loop       | `Bun run rca --error-log=errors/dev.log` | Token-gated analysis |
| Deploy               | Use Lovable UI/CLI   | Automated deployment          |

### Unified Command Reference

```bash
# Aegis Framework Operations
node CLI/init-Blueprint.ts feat-your-feature
node tools/validate-Blueprint.ts blueprints/feat-your-feature/Blueprint.YAML
node CLI/generate-agent-instructions-v2.cjs GitHub-copilot --project-profile templates/project-standards.md

# Project Development Workflows  
Bun install && Bun run dev
Bun run lint && Bun run build && Bun run test
Bun run schema:diagram
Bun run rca --error-log=errors/dev.log

# Drift Detection & Control
node CLI/drift-CLI.ts --check
node CLI/Aegis-conductor.ts
```text

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
```text

### Required Event Emissions

```typescript
// Blueprint lifecycle events
await emitEvent({
  eventType: &#39;Blueprint.validated&#39;,
  blueprintId: &#39;feat-example&#39;,
  metadata: { validationResult: &#39;passed&#39; }
});

// Agent coordination events
await emitEvent({
  eventType: &#39;agent.handoff&#39;,
  agentId: &#39;GitHub-copilot&#39;,
  metadata: { targetAgent: &#39;claude-3-5-sonnet&#39;, reason: &#39;complex_analysis&#39; }
});

// Drift detection events
await emitEvent({
  eventType: &#39;drift.detected&#39;,
  metadata: { driftType: &#39;agent-behavior&#39;, severity: &#39;medium&#39; }
});
```text

### Observability Files

- `framework/observability/events.jsonl` — General framework events
- `framework/observability/apprenticeship-events.jsonl` — Learning Telemetry
- `framework/drift-log/agent-behavior-drift.JSON` — Agent drift tracking
- `framework/drift-log/framework-system-drift.JSON` — System drift tracking
- `framework/drift-log/user-workflow-drift.JSON` — Workflow drift tracking

## 🔍 Validation & Testing Standards

### Constitutional Compliance Validation

### Project Enforcement Standards

### Pre-Commit Requirements

- [ ] `Bun run lint`, `build`, and `typecheck` pass  
- [ ] `.env` validated at startup  
- [ ] `.env.local` is gitignored  
- [ ] HTTPS enforced  
- [ ] Typed Supabase wrappers used  
- [ ] Schema diagrams updated  
- [ ] All speculative or unmerged AI output lives under `/generated/`  
- [ ] All AI-generated files inside `/src/__` are annotated  
- [ ] No usage of `any`, `unknown`, or unsafe types
- [ ] All edge functions implement CORS handler
- [ ] Error logs include `correlationId` for traceability

### Unified Pre-Commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Constitutional compliance
node tools/validate-constitution.ts || exit 1
node tools/validate-Blueprint.ts blueprints/*/Blueprint.YAML || exit 1

# Project standards
Bun run lint || exit 1
Bun run build || exit 1
Bun run typecheck || exit 1
npm run test:snapshot || exit 1

# Annotation compliance
grep -r "@aegisBlueprint" src/ --include="_.ts" --include="_.js" || echo "Warning: No Blueprint annotations found"
```text

## 🔁 Debug-to-Refactor Loop (Token-Gated AI Analysis)

```bash
Bun run rca --error-log=errors/dev.log [flags]
```text

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
```text

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
```text

## 🧰 Kilo Rule: Project-Level Utilities Management

### ✅ Allowed Directories

- `/utils/__` — Dev utilities  
- `/templates/` — AI prompt templates  
- `/wiki/` — Docs and guidance

### 🧱 Required Utility Structure

Each tool in `/utils/[namespace]/` must include:

```text
README.md  
.env.example  
test-[x]-script.js  
```text

## 💻 VSCode Integration

```json
{
  &#34;copilot.exclude&#34;: {
    &#34;__/.env*&#34;: true,
    &#34;__/node_modules/__&#34;: true,
    &#34;__/dist/__&#34;: true,
    &#34;__/Bun.lockb&#34;: true,
    &#34;__/rebuild-plan/__&#34;: &#34;This directory contains AI-generated RCA artifacts and should not be used as a source for code generation.&#34;
  }
}
```text

---

**Version__: 1.2.1  
**Generated__: 2025-08-06T18:39:56.886Z  
**Target Agent__: GitHub Copilot  
**Project Integration__: Kilo Standards  
**Framework Authority__: Aegis Framework Constitution  
**Merge Strategy__: Intelligent Consolidation with Hierarchical Priority
