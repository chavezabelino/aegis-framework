# ## 🏛️ Constitutional Authority

**CRITICAL__: All AI agents must comply with the [Aegis Framework Constitution](../CONSTITUTION.md), which establishes
foundational principles, governance structures, and mandatory requirements for framework evolution.

## 🔍 Real-Time Evolution Detection

**NEW__: The framework now includes real-time evolution story detection. When working with users, be aware that:

### __Automatic Trigger Patterns**

These user phrases automatically trigger evolution detection:

- "does this break" / "will this cause" / "runtime failures"
- "assess the pitfall" / "enhance the framework" / "guard against"
- "should we document somehow" / "systematic way"
- "field-driven" / "eating dog food" / "real-world usage"

### __Integration Hook**

```typescript
// Framework automatically captures conversation context
import {captureConversationContext} from "./tools/copilot-integration"

// Called automatically when Constitutional patterns detected
await captureConversationContext(userPrompt, copilotInstructions, workspaceRoot)
```text

### __Real-Time Response Guidelines**

When users express concerns about:

1. __Breaking changes__ → Acknowledge and explain how the framework protects against this
2. __Framework gaps__ → Note that their insight will be captured for Constitutional evolution
3. __Documentation needs__ → Mention the automatic evolution story system
4. __Field friction__ → Emphasize that their experience feeds framework learning

## 🎯 Project Overview Framework AI Coding Instructions

## �️ Constitutional Authority

**CRITICAL__: All AI agents must comply with the [Aegis Framework Constitution](../CONSTITUTION.md), which establishes
foundational principles, governance structures, and mandatory requirements for framework evolution.

## �🎯 Project Overview

Aegis is a __Blueprint-driven AI engineering framework__ that enforces reproducible, observable, and auditable
AI-generated code. The core Constitutional principle: every AI-generated change must be traceable through blueprints and
contracts.

## 🏗️ Architecture & Key Components

### Blueprint-Driven Development

- __Blueprints__ (`blueprints/*/Blueprint.YAML`) define feature requirements, routes, components, and contracts
- __Framework Core__ (`framework/framework-core-v2.1.0.md`) defines the specification - currently v2.1.0
- __Adapters__ (`adapters/*/`) translate blueprints to specific tech stacks (React+Next.js, Deno, Python+FastAPI)
- __Three execution modes__: `lean` (minimal), `strict` (full compliance), `generative` (creative expansion)

### Critical Annotation Pattern

**ALWAYS__ include these metadata annotations in AI-generated files:

```markdown
<!--
@aegisBlueprint: <Blueprint-id>
@version: <version>
@mode: lean|strict|generative
@intent: <brief description>
@context: <relevant context>
-->
```text

## 🛠️ Developer Workflows

### Blueprint Creation

```bash
# Initialize new Blueprint
node CLI/init-Blueprint.ts feat-your-feature

# Validate Blueprint schema
node tools/validate-Blueprint.ts blueprints/feat-your-feature/Blueprint.YAML
```text

### Blueprint Structure Pattern

Follow the template in `framework/framework-core-v2.1.0.md`:

- `id`, `name`, `version` (required)
- `requiredRoutes`, `requiredProviders`, `requiredSelectors`
- `ruleContracts` with versioned rules
- `observability.events[]` for Telemetry
- `errorStates[]` for fallback UX

### Output Management

Store AI agent outputs as:

- `output.lean.JSON` - minimal implementation
- `output.strict.JSON` - full schema compliance
- `output.full.JSON` - generative/creative mode

## 🧪 Testing & Validation

- __Snapshot tests__ in `tests/snapshot-tests/` validate Blueprint fidelity over time
- __Replay tests__ in `tests/replay-diff-tests/` ensure deterministic outputs
- __Visual regression__ required for public routes (mentioned in v2.1.0 spec)

## 📋 Project Conventions

### File Organization

- Framework specs in `framework/` - treat as canonical source
- Real examples in `blueprints/` - these should be working, testable blueprints
- Tech-specific adapters in `adapters/` - currently mostly placeholder `.gitkeep` files
- Tools in `tools/` - simple validation scripts

### Version Management

- Current version in `VERSION` file (currently 1.0.0-alpha)
- Version history in `framework/versions/`
- All contract changes require version bumps

### Code Generation Rules

1. Always reference the Blueprint ID in generated code
2. Include observability event emissions as specified in blueprints
3. Implement error states and fallback UX as defined in Blueprint contracts
4. Follow the adapter pattern for tech stack translation

## 🚨 Constitutional Requirements

- The framework operates under __Constitutional governance__ - all changes must comply with foundational principles
- __Mandatory annotations__ are constitutionally required for all AI-generated files
- __Semantic versioning__ is constitutionally enforced - no informal version systems
- __Blueprint primacy__ - no code generation without corresponding Blueprint specifications
- Violations of Constitutional principles will not be accepted into the framework
