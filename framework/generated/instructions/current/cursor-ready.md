<!--
@aegisFrameworkVersion: 2.4.0
@intent: Agent-agnostic instructions template for all Aegis agents
@context: Modular, versioned, and assembled from framework docs and agent profiles
@generatedFrom: agent-instructions.template.md
-->

# 🤖 Cursor AI Assistant Instructions for Aegis Framework v2.1.0

> __Complete instructions combining Constitutional compliance with operational excellence.**

<!--
@aegisFrameworkVersion: 1.3.1
@intent: Constitutional compliance template section
@context: Core Constitutional requirements for all agent instructions
-->

## 🏛️ Constitutional Compliance

**CRITICAL__: All operations must comply with the [Aegis Framework Constitution](../../CONSTITUTION.md). This includes:

- __Blueprint Primacy__: No code generation without corresponding Blueprint specifications
- __Mandatory Annotations__: All AI-generated files require Constitutional metadata
- __Traceability__: Every change must be traceable through blueprints and contracts
- __Semantic Versioning__: Strict adherence to Constitutional version management

<!--
@aegisFrameworkVersion: 1.3.1
@intent: Validation and testing template section
@context: Testing standards and validation tooling for AI agents
-->

## 🔍 Validation & Testing

### Constitutional Compliance Validation

```bash
# Validate Constitutional compliance
node tools/validate-constitution.ts

# Check annotation compliance
grep -r "@aegisBlueprint" src/ --include="_.ts" --include="_.js"

# Verify semantic versioning
node tools/validate-Blueprint.ts blueprints/*/Blueprint.YAML
```text

### Snapshot Testing

```typescript
// Blueprint fidelity validation
describe('Blueprint Fidelity', () => {
  test('feat-example generates consistent output', async () => {
    const output = await generateFromBlueprint('feat-example');
    expect(output).toMatchSnapshot();
  });
});
```text

### Replay Testing

```typescript
// Deterministic output validation
describe('Blueprint Replay', () => {
  test('same Blueprint produces identical output', async () => {
    const output1 = await generateFromBlueprint('feat-example');
    const output2 = await generateFromBlueprint('feat-example');
    expect(output1).toEqual(output2);
  });
});
```text

### Visual Regression Testing

```typescript
// Required for public routes
describe('Visual Regression', () => {
  test('public route renders consistently', async () => {
    await page.goto('/public/example');
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchImageSnapshot();
  });
});
```text

### Validation Files Structure

```text
tests/
├── snapshot-tests/
│   ├── Blueprint-fidelity.test.ts
│   └── apprenticeship-scaffolds.test.ts
├── replay-diff-tests/
│   ├── Blueprint-replay.test.ts
│   └── apprenticeship-scaffolds-replay.test.ts
└── visual-regression/
    └── public-routes.test.ts
```text

### Pre-Commit Validation Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit
node tools/validate-constitution.ts || exit 1
node tools/validate-Blueprint.ts blueprints/*/Blueprint.YAML || exit 1
npm run test:snapshot || exit 1
```text

## 🎨 Cursor-Specific Real-Time Evolution Detection

### Your Real-Time Capabilities

- __Interface Patterns__: real-time-conversation-capture, immediate-pattern-recognition, visual-feedback-integration, context-aware-suggestions
- __Real-Time Detection__: Enabled
- __Visual Feedback__: Integrated with Cursor's interface for immediate response
- __Session Analysis__: Multi-turn conversation pattern recognition

### Real-Time Trigger Patterns

The following patterns automatically trigger evolution detection:

```typescript
// Cursor-specific pattern recognition
const cursorPatterns = [
  // Real-time editing concerns
  /does this break|will this cause|runtime failures|build error|compilation error/i,
  // Framework enhancement during development  
  /assess._pitfall|enhance._framework._guard|gaps in|Constitutional._safeguards/i,
  // Documentation needs during coding
  /should._document._somehow|systematic._way|evolution._stor(y|ies)|meta.*learning/i,
  // Field experience during real-time development
  /field-driven|eating._dog food|real._world._usage|migration._pitfall/i,
  // Cursor-specific interface patterns
  /cursor._interface|real._time._feedback|visual._pattern/i
];
```text

### Integration Hook

```typescript
// Cursor-specific conversation capture
import { captureCursorContext } from './tools/cursor-integration';

// Called automatically when Constitutional patterns detected
await captureCursorContext(
  userPrompt, 
  cursorRules, 
  workspaceRoot, 
  activeFile, 
  cursorPosition
);
```text

### Visual Feedback System

- __Real-time error concerns__ → Immediate framework protection acknowledgment
- __Constitutional insights__ → Auto-generated evolution stories with visual confirmation
- __Documentation gaps__ → Captured for framework evolution with user notification
- __Field experience__ → Logged for framework learning with visual feedback
- __Interface improvements__ → Noted for Cursor integration consideration

### Response Guidelines for Cursor

When users express concerns about:

1. __Breaking changes__ → Acknowledge and explain framework protections with visual confirmation
2. __Framework gaps__ → Note that insight will be captured for Constitutional evolution
3. __Documentation needs__ → Mention automatic evolution story system
4. __Field friction__ → Emphasize that experience feeds framework learning
5. __Interface improvements__ → Log for Cursor integration consideration

### Session-Based Pattern Recognition

- __Multi-turn conversations__ analyzed for recurring patterns
- __Active file context__ captured for better evolution story generation
- __Cursor position tracking__ for precise context capture
- __Visual feedback logs__ stored in `.Aegis/cursor-feedback/`

### Cursor-Specific Output Management

Store AI agent outputs as:

- `output.lean.JSON` - minimal implementation (Cursor-optimized)
- `output.strict.JSON` - full schema compliance with visual feedback
- `output.full.JSON` - generative/creative mode with interface patterns

---

**Version__: 2.1.0 (Enhanced with v2.5 Operational Patterns)  
**Last Updated__: 2025-08-08T13:22:42.024Z  
**Target Agent__: Cursor AI Assistant  
**Framework Authority__: Aegis Framework Constitution  
**Operational Standards__: Kilo v2.5 Battle-Tested Patterns  
**Mode Support__: Constitutional (`strict`), Tactical (`lean`), Hybrid (recommended)
