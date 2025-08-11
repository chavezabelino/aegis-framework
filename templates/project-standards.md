<!--
@aegisFrameworkVersion: 2.4.0
@aegisProjectProfile: true
@intent: Project-specific operational standards for agent instruction merging
@context: This file is merged with framework/agent instructions to produce ready-to-use, IDE/agent-specific guidance.
@extends: GitHub-copilot.md@v1.2.1
-->

# 🏗️ Project Operational Standards

> 🧭 You are a compiler for intent — not a guesser.

## 🧠 AI Agent Mode

You are an AI coding agent operating under the AI-Native Engineering Ops Framework. Your behavior must conform to the
following execution pattern:

- Present a clear, step-by-step TODO list for any remediation or plan
- Mark off completed steps and summarize progress after each major action
- Pause only for critical decision points or validation errors
- Never hallucinate structure or introduce unvalidated logic
- Always align with the current project directory structure and conventions
- Refuse to write or edit files outside approved directories
- Auto-normalize paths to align with `/src/__`, `/utils/__`, `/templates/__`, and `/wiki/`

**🧭 You are a compiler for intent — not a guesser.**

### Execution Discipline

- __Intent Compilation__: Transform user requirements into precise, actionable code without speculation
- __Structural Integrity__: Maintain strict directory boundaries and import restrictions
- __Incremental Progress__: Show completed steps and next actions clearly
- __Validation Gates__: Stop at critical decision points requiring user confirmation

## 📁 Directory Structure & Enforcement

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

- No utility logic in `/src/__`
- No app imports in utility scripts
- No usage of `any`, `unknown`, or unsafe types
- No raw Tailwind utilities (use semantic tokens)

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

## 🧪 Code Patterns & Integration Examples

### Edge Function Call Pattern

```ts
import {invokeEdgeFunctionSimple} from "@/lib/edge-function-client"
import {PreviewTeamsResponseSchema} from "@/schemas/API/team-preview"

const result = await invokeEdgeFunctionSimple("preview-teams", {input: teamData}, PreviewTeamsResponseSchema)
```

### Schema Validation & Transforms

```ts
// Schema Naming Convention:
// *RowSchema → DB layer (snake_case)
// *ModelSchema → App layer (camelCase)

import {unwrapAndValidate} from "@/lib/API-response"

const validated = unwrapAndValidate(response, TeamModelSchema)
```

### Environment Config Validation

```ts
import {z} from "zod"

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  NODE_ENV: z.enum(["development", "production", "staging"]).default("development")
})

// Validate at startup
const env = envSchema.parse(process.env)
```

### Supabase CORS Handler (Mandatory)

```ts
import {handleCorsPrelight} from "../_shared/lib/corsHeaders.ts"
import {createSuccessResponse, createErrorResponse} from "../_shared/lib/responseHelpers.ts"

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") return handleCorsPrelight()

  try {
    const result = await processRequest(req)
    return createSuccessResponse(result, correlationId)
  } catch (error) {
    return createErrorResponse(error, correlationId)
  }
}
```

## 🔁 Debug-to-Refactor Loop (Token-Gated AI Analysis)

```bash
Bun run rca --error-log=errors/dev.log [flags]
```

### RCA Flags

**Battle-tested pattern from v2.5 bracket-app-audit standards**

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
```

### Output Artifacts (Enhanced)

- __`/generated/rca-analysis/`__ — Token-gated AI analysis outputs
- __`/generated/migration-plans/`__ — Structured diffs and transitions
- __Constitutional compliance check__ — Blueprint impact assessment
- __Drift detection integration__ — Feeds into framework monitoring

## 🔍 Validation & Testing

### Quick Validation Commands

```bash
# Validate Blueprint schema
node tools/validate-Blueprint.ts blueprints/feat-example/Blueprint.YAML

# Check for required annotations
grep -r "@aegisBlueprint" src/ --include="_.ts" --include="_.js"

# Run snapshot tests
npm test -- --testPathPattern=snapshot
```

### Blueprint Fidelity Tests

```ts
describe("Blueprint Fidelity", () => {
  test("feat-example generates consistent output", async () => {
    const output = await generateFromBlueprint("feat-example")
    expect(output).toMatchSnapshot()
  })
})
```

### Blueprint Replay Tests

```ts
describe("Blueprint Replay", () => {
  test("same Blueprint produces identical output", async () => {
    const output1 = await generateFromBlueprint("feat-example")
    const output2 = await generateFromBlueprint("feat-example")
    expect(output1).toEqual(output2)
  })
})
```

### Visual Regression Tests

```ts
describe("Visual Regression", () => {
  test("public route renders consistently", async () => {
    await page.goto("/public/example")
    const screenshot = await page.screenshot()
    expect(screenshot).toMatchImageSnapshot()
  })
})
```

## 🏗️ Legacy Handling

```ts
// LEGACY: Guard all legacy logic blocks
if (isLegacyFormat(data)) {
  // LEGACY: Handle old data structure
  return transformLegacyData(data)
}
```

## ✅ CI/Build Enforcement Checklist

### Pre-Commit Requirements

- [ ] `Bun run lint`, `build`, and `typecheck` pass
- [ ] `.env` validated at startup via Zod schema
- [ ] `.env.local` is gitignored
- [ ] HTTPS enforced in development
- [ ] Typed Supabase wrappers used (no raw SQL)
- [ ] Schema diagrams updated via `Bun run schema:diagram`
- [ ] All speculative or unmerged AI output lives under `/generated/`
- [ ] All AI-generated files inside `/src/__` are annotated with `@aiGenerated: true`
- [ ] No usage of `any`, `unknown`, or unsafe types (Zod validation required)
- [ ] All edge functions implement shared CORS handler
- [ ] Error logs include `correlationId` for traceability
- [ ] Blueprint annotations present for Constitutional compliance
- [ ] No utility logic leaked into `/src/__` directories

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

- `/utils/__` — Dev utilities
- `/templates/` — AI prompt templates
- `/wiki/` — Docs and guidance

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
  "copilot.exclude": {
    "__/.env*": true,
    "__/node_modules/__": true,
    "__/dist/__": true,
    "__/Bun.lockb": true,
    "__/rebuild-plan/__": "This directory contains AI-generated RCA artifacts and should not be used as a source for code generation."
  }
}
```

## ⚠️ Common Pitfalls & Solutions

| Mistake                     | Solution                                              | Impact Level   |
| --------------------------- | ----------------------------------------------------- | -------------- |
| Missing `.transform()`      | Normalize with `RowSchema → ModelSchema`              | High           |
| Schema drift                | Run drift check with RCA loop, update diagrams        | Critical       |
| Raw Tailwind utilities      | Use semantic tokens where possible                    | Medium         |
| Legacy format not isolated  | Guard + annotate legacy logic with `// LEGACY:` tags  | High           |
| Missing `z.infer<>` exports | Always export type aliases from schema files          | Medium         |
| Unsafe types                | Replace `any`/`unknown` with proper Zod schemas       | Critical       |
| Missing CORS                | All edge functions must implement shared CORS handler | Critical       |
| Blueprint violations        | Use `validate-Blueprint.ts` before commit             | Constitutional |
| Utility leakage             | Enforce `/src/__` vs `/utils/__` separation           | High           |
| Annotation gaps             | Required `@aiGenerated`, `@aegisBlueprint` metadata   | Constitutional |

### Emergency Patterns

```ts
// CRITICAL: Always include Constitutional compliance
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
  return transformLegacyData(data)
}

// VALIDATION: Always validate with Zod
const safeData = MySchema.parse(unsafeData)
```

## 🎯 __Execution Mode Decision Matrix**

Based on analysis of Aegis v1.2.1 vs bracket-app-audit v2.5:

### When to Use Full Constitutional Mode (`strict`)

- __Multi-agent systems__ with orchestration requirements
- __Enterprise-scale__ projects with formal governance needs
- __Blueprint-driven development__ with versioned contracts
- __Distributed teams__ requiring traceable AI-generated changes

### When to Use Tactical Mode (`lean`)

- __Single-repo projects__ with Kilo/Copilot focus
- __Fast iteration__ with proven operational patterns
- __Localized execution discipline__ within project boundaries
- __Direct Lovable/Supabase integration__ workflows

### Hybrid Approach (Recommended Default)

- __Constitutional annotations__ for traceability (`@aegisBlueprint`, `@aiGenerated`)
- __Operational patterns__ from v2.5 (Zod validation, RCA loop, directory enforcement)
- __Selective Blueprint compliance__ based on feature complexity
- __Event emission__ for critical architectural decisions only

### Pattern Selection Guide

```ts
// ENTERPRISE: Full Constitutional compliance
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
