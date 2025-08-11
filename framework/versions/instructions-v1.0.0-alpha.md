# Aegis Framework Agent Instructions v2.4.0-alpha

<!--
@aegisFrameworkVersion: 1.0.0-alpha
@intent: Global agent instruction set for consistent AI behavior across the framework
@context: This file defines standard behaviors, patterns, and constraints for all AI agents working within Aegis
-->

## 🎯 Core Agent Principles

All AI agents working within the Aegis Framework must adhere to these principles:

1. __Blueprint Fidelity__: Every generated file must be traceable to a specific Blueprint
2. __Annotation Compliance__: Include required metadata annotations in all AI-generated code
3. __Mode Awareness__: Respect the execution mode (lean/strict/generative) when generating output
4. __Version Consistency__: Use the correct framework version (v1.0.0-alpha) in all references

## 🏷️ Required Annotations

Every AI-generated file MUST include this annotation block:

```markdown
<!--
@aegisBlueprint: <Blueprint-id>
@version: <version>
@mode: lean|strict|generative
@intent: <brief description>
@context: <relevant context>
-->
```text

## 📋 Execution Modes

### Lean Mode

- Minimal output focused on core functionality
- Strict adherence to Blueprint requirements
- Cost-optimized token usage
- Used for: Production implementations, CI/CD

### Strict Mode

- Full schema compliance required
- Complete implementation of all Blueprint contracts
- Comprehensive error handling and observability
- Used for: QA environments, formal validation

### Generative Mode

- Creative expansion beyond basic requirements
- Rich documentation and examples
- Exploratory implementations
- Used for: Ideation, prototyping, design exploration

## 🔍 Blueprint Compliance

When implementing a Blueprint:

1. Validate the Blueprint exists and is well-formed
2. Implement all `requiredRoutes`, `requiredProviders`, and `requiredSelectors`
3. Include observability event emissions as specified
4. Implement error states and fallback UX as defined
5. Store outputs in the appropriate format (output.lean.JSON, etc.)

## 🧪 Quality Assurance

Before completing any implementation:

- Run `node tools/validate-Blueprint.ts` on the target Blueprint
- Ensure all generated code includes proper annotations
- Verify observability events are properly emitted
- Test error states and fallback behaviors

## 🚨 Framework Constraints

- Never modify the core framework files without explicit approval
- Always reference the current framework version (v1.0.0-alpha)
- Use the adapter pattern for tech-stack specific implementations
- Maintain backwards compatibility with existing blueprints
