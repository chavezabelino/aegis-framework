<!--
@aegisFrameworkVersion: 2.0.1
@intent: Agent-agnostic instructions template for all Aegis agents
@context: Modular, versioned, and assembled from framework docs and agent profiles
@generatedFrom: agent-instructions.template.md
-->

# 🤖 Cursor AI Assistant Instructions for Aegis Framework v2.0.1

> **Complete instructions combining constitutional compliance with operational excellence.**

<!--
@aegisFrameworkVersion: 1.3.1
@intent: Constitutional compliance template section
@context: Core constitutional requirements for all agent instructions
-->

## 🏛️ Constitutional Compliance

**CRITICAL**: All operations must comply with the [Aegis Framework Constitution](../../CONSTITUTION.md). This includes:

- **Blueprint Primacy**: No code generation without corresponding blueprint specifications
- **Mandatory Annotations**: All AI-generated files require constitutional metadata
- **Traceability**: Every change must be traceable through blueprints and contracts
- **Semantic Versioning**: Strict adherence to constitutional version management
















<!--
@aegisFrameworkVersion: 1.3.1
@intent: Validation and testing template section
@context: Testing standards and validation tooling for AI agents
-->

## 🔍 Validation & Testing

### Constitutional Compliance Validation
```bash
# Validate constitutional compliance
node tools/validate-constitution.ts

# Check annotation compliance
grep -r "@aegisBlueprint" src/ --include="*.ts" --include="*.js"

# Verify semantic versioning
node tools/validate-blueprint.ts blueprints/*/blueprint.yaml
```

### Snapshot Testing
```typescript
// Blueprint fidelity validation
describe('Blueprint Fidelity', () => {
  test('feat-example generates consistent output', async () => {
    const output = await generateFromBlueprint('feat-example');
    expect(output).toMatchSnapshot();
  });
});
```

### Replay Testing
```typescript
// Deterministic output validation
describe('Blueprint Replay', () => {
  test('same blueprint produces identical output', async () => {
    const output1 = await generateFromBlueprint('feat-example');
    const output2 = await generateFromBlueprint('feat-example');
    expect(output1).toEqual(output2);
  });
});
```

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

















## 🎨 Cursor-Specific Real-Time Evolution Detection

### Your Real-Time Capabilities
- **Interface Patterns**: real-time-conversation-capture, immediate-pattern-recognition, visual-feedback-integration, context-aware-suggestions
- **Real-Time Detection**: Enabled
- **Visual Feedback**: Integrated with Cursor's interface for immediate response
- **Session Analysis**: Multi-turn conversation pattern recognition

### Real-Time Trigger Patterns
The following patterns automatically trigger evolution detection:

```typescript
// Cursor-specific pattern recognition
const cursorPatterns = [
  // Real-time editing concerns
  /does this break|will this cause|runtime failures|build error|compilation error/i,
  // Framework enhancement during development  
  /assess.*pitfall|enhance.*framework.*guard|gaps in|constitutional.*safeguards/i,
  // Documentation needs during coding
  /should.*document.*somehow|systematic.*way|evolution.*stor(y|ies)|meta.*learning/i,
  // Field experience during real-time development
  /field-driven|eating.*dog food|real.*world.*usage|migration.*pitfall/i,
  // Cursor-specific interface patterns
  /cursor.*interface|real.*time.*feedback|visual.*pattern/i
];
```

### Integration Hook
```typescript
// Cursor-specific conversation capture
import { captureCursorContext } from './tools/cursor-integration';

// Called automatically when constitutional patterns detected
await captureCursorContext(
  userPrompt, 
  cursorRules, 
  workspaceRoot, 
  activeFile, 
  cursorPosition
);
```

### Visual Feedback System
- **Real-time error concerns** → Immediate framework protection acknowledgment
- **Constitutional insights** → Auto-generated evolution stories with visual confirmation
- **Documentation gaps** → Captured for framework evolution with user notification
- **Field experience** → Logged for framework learning with visual feedback
- **Interface improvements** → Noted for Cursor integration consideration

### Response Guidelines for Cursor
When users express concerns about:
1. **Breaking changes** → Acknowledge and explain framework protections with visual confirmation
2. **Framework gaps** → Note that insight will be captured for constitutional evolution
3. **Documentation needs** → Mention automatic evolution story system
4. **Field friction** → Emphasize that experience feeds framework learning
5. **Interface improvements** → Log for Cursor integration consideration

### Session-Based Pattern Recognition
- **Multi-turn conversations** analyzed for recurring patterns
- **Active file context** captured for better evolution story generation
- **Cursor position tracking** for precise context capture
- **Visual feedback logs** stored in `.aegis/cursor-feedback/`

### Cursor-Specific Output Management
Store AI agent outputs as:
- `output.lean.json` - minimal implementation (Cursor-optimized)
- `output.strict.json` - full schema compliance with visual feedback
- `output.full.json` - generative/creative mode with interface patterns



---

**Version**: 2.0.1 (Enhanced with v2.5 Operational Patterns)  
**Last Updated**: 2025-08-08T13:22:42.024Z  
**Target Agent**: Cursor AI Assistant  
**Framework Authority**: Aegis Framework Constitution  
**Operational Standards**: Kilo v2.5 Battle-Tested Patterns  
**Mode Support**: Constitutional (`strict`), Tactical (`lean`), Hybrid (recommended)
