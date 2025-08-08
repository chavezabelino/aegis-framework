# ## 🏛️ Constitutional Authority

**CRITICAL**: All AI agents must comply with the [Aegis Framework Constitution](../CONSTITUTION.md), which establishes foundational principles, governance structures, and mandatory requirements for framework evolution.

## 🔍 Real-Time Evolution Detection

**NEW**: The framework now includes real-time evolution story detection. When working with users, be aware that:

### **Automatic Trigger Patterns**
These user phrases automatically trigger evolution detection:
- "does this break" / "will this cause" / "runtime failures"
- "assess the pitfall" / "enhance the framework" / "guard against"
- "should we document somehow" / "systematic way"
- "field-driven" / "eating dog food" / "real-world usage"

### **Integration Hook**
```typescript
// Framework automatically captures conversation context
import { captureConversationContext } from './tools/copilot-integration';

// Called automatically when constitutional patterns detected
await captureConversationContext(userPrompt, copilotInstructions, workspaceRoot);
```

### **Real-Time Response Guidelines**
When users express concerns about:
1. **Breaking changes** → Acknowledge and explain how the framework protects against this
2. **Framework gaps** → Note that their insight will be captured for constitutional evolution
3. **Documentation needs** → Mention the automatic evolution story system
4. **Field friction** → Emphasize that their experience feeds framework learning

## 🎯 Project Overview Framework AI Coding Instructions

## �️ Constitutional Authority

**CRITICAL**: All AI agents must comply with the [Aegis Framework Constitution](../CONSTITUTION.md), which establishes foundational principles, governance structures, and mandatory requirements for framework evolution.

## �🎯 Project Overview

Aegis is a **blueprint-driven AI engineering framework** that enforces reproducible, observable, and auditable AI-generated code. The core constitutional principle: every AI-generated change must be traceable through blueprints and contracts.

## 🏗️ Architecture & Key Components

### Blueprint-Driven Development
- **Blueprints** (`blueprints/*/blueprint.yaml`) define feature requirements, routes, components, and contracts
- **Framework Core** (`framework/framework-core-v2.1.0.md`) defines the specification - currently v2.1.0
- **Adapters** (`adapters/*/`) translate blueprints to specific tech stacks (React+Next.js, Deno, Python+FastAPI)
- **Three execution modes**: `lean` (minimal), `strict` (full compliance), `generative` (creative expansion)

### Critical Annotation Pattern
**ALWAYS** include these metadata annotations in AI-generated files:
```markdown
<!--
@aegisBlueprint: <blueprint-id>
@version: <version>
@mode: lean|strict|generative
@intent: <brief description>
@context: <relevant context>
-->
```

## 🛠️ Developer Workflows

### Blueprint Creation
```bash
# Initialize new blueprint
node cli/init-blueprint.ts feat-your-feature

# Validate blueprint schema
node tools/validate-blueprint.ts blueprints/feat-your-feature/blueprint.yaml
```

### Blueprint Structure Pattern
Follow the template in `framework/framework-core-v2.1.0.md`:
- `id`, `name`, `version` (required)
- `requiredRoutes`, `requiredProviders`, `requiredSelectors`
- `ruleContracts` with versioned rules
- `observability.events[]` for telemetry
- `errorStates[]` for fallback UX

### Output Management
Store AI agent outputs as:
- `output.lean.json` - minimal implementation
- `output.strict.json` - full schema compliance  
- `output.full.json` - generative/creative mode

## 🧪 Testing & Validation

- **Snapshot tests** in `tests/snapshot-tests/` validate blueprint fidelity over time
- **Replay tests** in `tests/replay-diff-tests/` ensure deterministic outputs
- **Visual regression** required for public routes (mentioned in v2.1.0 spec)

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
1. Always reference the blueprint ID in generated code
2. Include observability event emissions as specified in blueprints
3. Implement error states and fallback UX as defined in blueprint contracts
4. Follow the adapter pattern for tech stack translation

## 🚨 Constitutional Requirements

- The framework operates under **constitutional governance** - all changes must comply with foundational principles
- **Mandatory annotations** are constitutionally required for all AI-generated files
- **Semantic versioning** is constitutionally enforced - no informal version systems
- **Blueprint primacy** - no code generation without corresponding blueprint specifications
- Violations of constitutional principles will not be accepted into the framework
