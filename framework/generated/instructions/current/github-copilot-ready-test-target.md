<!--
@aegisFrameworkVersion: 1.2.1
@intent: Complete GitHub Copilot instructions combining constitutional compliance with operational excellence
@context: Single source of truth for GitHub Copilot under Aegis Framework + Kilo standards
@generatedFrom: agent-instructions.template.md + project-standards.md
@lastGenerated: 2025-08-06
-->

# 🤖 GitHub Copilot Instructions for Aegis Framework v1.2.1

> **Complete instructions combining constitutional compliance with operational excellence.**

## 🏛️ Constitutional Compliance

**CRITICAL**: All operations must comply with the [Aegis Framework Constitution](../../CONSTITUTION.md). This includes:

- **Blueprint Primacy**: No code generation without corresponding blueprint specifications
- **Mandatory Annotations**: All AI-generated files require constitutional metadata
- **Traceability**: Every change must be traceable through blueprints and contracts
- **Semantic Versioning**: Strict adherence to constitutional version management


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


## 🎯 GitHub Copilot Specific Guidance

### Your Capabilities
- **Languages**: typescript, python, go, javascript
- **Specializations**: full-stack, documentation, testing
- **Coordination**: Multi-agent coordination supported

### Operational Execution Modes
1. **Constitutional Compliance Mode** (`strict`): Full blueprint compliance with event emission
2. **Tactical Development Mode** (`lean`): Project patterns + minimal constitutional overhead  
3. **Emergency Fix Mode**: Critical patches with reduced validation (still annotated)

### Integration Patterns
- **Enterprise/Multi-Agent**: Use full Aegis constitutional governance
- **Single-Repo/Tactical**: Emphasize Kilo operational patterns with constitutional annotations
- **Hybrid**: Constitutional annotations + operational discipline (recommended default)


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


## 🏗️ Blueprint Compliance

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


## 🧠 Drift Detection &amp; Response

### Three-Layer Drift Monitoring
1. **Agent Behavior Drift**: Changes in code generation patterns, annotation compliance
2. **User Workflow Drift**: Deviations from established development patterns
3. **Framework System Drift**: Constitutional violations, version inconsistencies

### Drift Response Protocol
```typescript
// Check for drift
const driftResults = await detectDrift({
  type: [&#39;agent-behavior&#39;, &#39;user-workflow&#39;, &#39;framework-system&#39;],
  timeWindow: &#39;24h&#39;
});

// Auto-correct minor violations
if (driftResults.severity === &#39;low&#39;) {
  await autoCorrect(driftResults);
}

// Escalate critical violations
if (driftResults.severity === &#39;critical&#39;) {
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


## 🛠️ CLI Integration

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


## 🔍 Validation &amp; Testing

### Constitutional Compliance Validation
```bash
# Validate constitutional compliance
node tools/validate-constitution.ts

# Check annotation compliance
grep -r &#34;@aegisBlueprint&#34; src/ --include=&#34;*.ts&#34; --include=&#34;*.js&#34;

# Verify semantic versioning
node tools/validate-blueprint.ts blueprints/*/blueprint.yaml
```

### Snapshot Testing
```typescript
// Blueprint fidelity validation
describe(&#39;Blueprint Fidelity&#39;, () =&gt; {
  test(&#39;feat-example generates consistent output&#39;, async () =&gt; {
    const output = await generateFromBlueprint(&#39;feat-example&#39;);
    expect(output).toMatchSnapshot();
  });
});
```

### Replay Testing
```typescript
// Deterministic output validation
describe(&#39;Blueprint Replay&#39;, () =&gt; {
  test(&#39;same blueprint produces identical output&#39;, async () =&gt; {
    const output1 = await generateFromBlueprint(&#39;feat-example&#39;);
    const output2 = await generateFromBlueprint(&#39;feat-example&#39;);
    expect(output1).toEqual(output2);
  });
});
```

### Visual Regression Testing
```typescript
// Required for public routes
describe(&#39;Visual Regression&#39;, () =&gt; {
  test(&#39;public route renders consistently&#39;, async () =&gt; {
    await page.goto(&#39;/public/example&#39;);
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchImageSnapshot();
  });
});
```

### Validation Files Structure
```
tests/
├── snapshot-tests/
│   ├── blueprint-fidelity.test.ts
│   └── apprenticeship-scaffolds.test.ts
├── replay-diff-tests/
│   ├── blueprint-replay.test.ts
│   └── apprenticeship-scaffolds-replay.test.ts
└── visual-regression/
    └── public-routes.test.ts
```

### Pre-Commit Validation Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit
node tools/validate-constitution.ts || exit 1
node tools/validate-blueprint.ts blueprints/*/blueprint.yaml || exit 1
npm run test:snapshot || exit 1
```


## 📚 Knowledge Base

See docs/ for architecture, workflow, and reference.



---
&lt;!--
@aegisProjectProfile: true
@intent: Project-specific operational standards for agent instruction merging
@context: This file is merged with framework/agent instructions to produce ready-to-use, IDE/agent-specific guidance.
@extends: github-copilot.md@v1.2.1
--&gt;

# 🏗️ Project Operational Standards

&gt; 🧭 You are a compiler for intent — not a guesser.

## 🧠 AI Agent Mode

You are an AI coding agent operating under the AI-Native Engineering Ops Framework. Your behavior must conform to the following execution pattern:

- Present a clear, step-by-step TODO list for any remediation or plan  
- Mark off completed steps and summarize progress after each major action  
- Pause only for critical decision points or validation errors  
- Never hallucinate structure or introduce unvalidated logic  
- Always align with the current project directory structure and conventions  
- Refuse to write or edit files outside approved directories  
- Auto-normalize paths to align with `/src/**`, `/utils/**`, `/templates/**`, and `/wiki/`

**🧭 You are a compiler for intent — not a guesser.**

### Execution Discipline
- **Intent Compilation**: Transform user requirements into precise, actionable code without speculation
- **Structural Integrity**: Maintain strict directory boundaries and import restrictions
- **Incremental Progress**: Show completed steps and next actions clearly
- **Validation Gates**: Stop at critical decision points requiring user confirmation

## 📁 Directory Structure &amp; Enforcement

```
/project-root/
├── /generated/               # AI-generated code or structured diffs not yet merged into /src
│   ├── /functions/           # Refactored or scaffolded edge functions
│   ├── /schemas/             # Zod schema outputs
│   ├── /migration-plans/     # Patch plans, deltas, transitions
├── /templates/               # AI prompt templates and scaffolds
├── /src/                     # Application code (STRICT: No utility logic allowed)
│   ├── /functions/
│   ├── /schemas/
│   ├── /lib/
│   ├── /components/
│   ├── /pages/
│   ├── /hooks/, /stores/, /types/
├── /utils/                   # Dev utilities (STRICT: No app imports allowed)
├── /wiki/                    # Docs and guidance
├── /public/
├── /docs/
```

### 🚫 Forbidden Patterns
- No utility logic in `/src/**`
- No app imports in utility scripts
- No usage of `any`, `unknown`, or unsafe types
- No raw Tailwind utilities (use semantic tokens)

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

## 🧪 Code Patterns &amp; Integration Examples

### Edge Function Call Pattern
```ts
import { invokeEdgeFunctionSimple } from &#39;@/lib/edge-function-client&#39;;
import { PreviewTeamsResponseSchema } from &#39;@/schemas/api/team-preview&#39;;

const result = await invokeEdgeFunctionSimple(
  &#39;preview-teams&#39;,
  { input: teamData },
  PreviewTeamsResponseSchema
);
```

### Schema Validation &amp; Transforms
```ts
// Schema Naming Convention:
// *RowSchema → DB layer (snake_case)
// *ModelSchema → App layer (camelCase)

import { unwrapAndValidate } from &#39;@/lib/api-response&#39;;

const validated = unwrapAndValidate(response, TeamModelSchema);
```

### Environment Config Validation
```ts
import { z } from &#39;zod&#39;;

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  NODE_ENV: z.enum([&#39;development&#39;, &#39;production&#39;, &#39;staging&#39;]).default(&#39;development&#39;),
});

// Validate at startup
const env = envSchema.parse(process.env);
```

### Supabase CORS Handler (Mandatory)
```ts
import { handleCorsPrelight } from &#39;../_shared/lib/corsHeaders.ts&#39;;
import { createSuccessResponse, createErrorResponse } from &#39;../_shared/lib/responseHelpers.ts&#39;;

export default async function handler(req: Request) {
  if (req.method === &#34;OPTIONS&#34;) return handleCorsPrelight();
  
  try {
    const result = await processRequest(req);
    return createSuccessResponse(result, correlationId);
  } catch (error) {
    return createErrorResponse(error, correlationId);
  }
}
```

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

## 🏗️ Legacy Handling
```ts
// LEGACY: Guard all legacy logic blocks
if (isLegacyFormat(data)) {
  // LEGACY: Handle old data structure
  return transformLegacyData(data);
}
```

## ✅ CI/Build Enforcement Checklist

### Pre-Commit Requirements
- [ ] `bun run lint`, `build`, and `typecheck` pass  
- [ ] `.env` validated at startup via Zod schema
- [ ] `.env.local` is gitignored  
- [ ] HTTPS enforced in development
- [ ] Typed Supabase wrappers used (no raw SQL)
- [ ] Schema diagrams updated via `bun run schema:diagram`
- [ ] All speculative or unmerged AI output lives under `/generated/`  
- [ ] All AI-generated files inside `/src/**` are annotated with `@aiGenerated: true`
- [ ] No usage of `any`, `unknown`, or unsafe types (Zod validation required)
- [ ] All edge functions implement shared CORS handler
- [ ] Error logs include `correlationId` for traceability
- [ ] Blueprint annotations present for constitutional compliance
- [ ] No utility logic leaked into `/src/**` directories

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

## ⚠️ Common Pitfalls & Solutions

| Mistake                     | Solution                                              | Impact Level |
| --------------------------- | ----------------------------------------------------- | ------------ |
| Missing `.transform()`      | Normalize with `RowSchema → ModelSchema`              | High         |
| Schema drift                | Run drift check with RCA loop, update diagrams       | Critical     |
| Raw Tailwind utilities      | Use semantic tokens where possible                    | Medium       |
| Legacy format not isolated  | Guard + annotate legacy logic with `// LEGACY:` tags | High         |
| Missing `z.infer<>` exports | Always export type aliases from schema files          | Medium       |
| Unsafe types                | Replace `any`/`unknown` with proper Zod schemas       | Critical     |
| Missing CORS                | All edge functions must implement shared CORS handler | Critical     |

## 🎯 **Execution Mode Decision Matrix**

Based on analysis of Aegis v1.2.1 vs bracket-app-audit v2.5:

### When to Use Full Constitutional Mode (`strict`)
- **Multi-agent systems** with orchestration requirements
- **Enterprise-scale** projects with formal governance needs  
- **Blueprint-driven development** with versioned contracts
- **Distributed teams** requiring traceable AI-generated changes

### When to Use Tactical Mode (`lean`) 
- **Single-repo projects** with Kilo/Copilot focus
- **Fast iteration** with proven operational patterns
- **Localized execution discipline** within project boundaries
- **Direct Lovable/Supabase integration** workflows

### Hybrid Approach (Recommended Default)
- **Constitutional annotations** for traceability (`@aegisBlueprint`, `@aiGenerated`)
- **Operational patterns** from v2.5 (Zod validation, RCA loop, directory enforcement)
- **Selective blueprint compliance** based on feature complexity
- **Event emission** for critical architectural decisions only

### Pattern Selection Guide
```ts
// ENTERPRISE: Full constitutional compliance
/**
 * @aegisBlueprint: feat-complex-system
 * @version: 1.0.0
 * @mode: strict
 * @multiAgent: true
 * @governanceRequired: true
 */

// TACTICAL: Operational focus with minimal overhead  
/**
 * @aiGenerated: true
 * @author: GitHub Copilot
 * @mode: lean
 * @projectPattern: kilo-standards-v2.5
 */

// HYBRID: Best of both worlds (recommended)
/**
 * @aegisBlueprint: feat-user-auth
 * @version: 1.0.0  
 * @mode: lean
 * @aiGenerated: true
 * @author: GitHub Copilot
 * @operationalPatterns: true
 */
```

---
| Blueprint violations        | Use `validate-blueprint.ts` before commit             | Constitutional |
| Utility leakage             | Enforce `/src/**` vs `/utils/**` separation           | High         |
| Annotation gaps             | Required `@aiGenerated`, `@aegisBlueprint` metadata   | Constitutional |

### Emergency Patterns
```ts
// CRITICAL: Always include constitutional compliance
/**
 * @aegisBlueprint: emergency-fix
 * @version: 1.0.0
 * @mode: lean
 * @intent: Critical production fix
 * @aiGenerated: true
 * @author: GitHub Copilot
 * @emergency: true
 */

// LEGACY: Guard all legacy logic blocks
if (isLegacyFormat(data)) {
  // LEGACY: Handle old data structure
  return transformLegacyData(data);
}

// VALIDATION: Always validate with Zod
const safeData = MySchema.parse(unsafeData);
```

---



---

**Version**: 1.2.1 (Enhanced with v2.5 Operational Patterns)  
**Last Updated**: 2025-08-06  
**Target Agent**: GitHub Copilot  
**Framework Authority**: Aegis Framework Constitution  
**Operational Standards**: Kilo v2.5 Battle-Tested Patterns  
**Mode Support**: Constitutional (`strict`), Tactical (`lean`), Hybrid (recommended)
