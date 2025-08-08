<!--
@aegisFrameworkVersion: 2.4.0
@intent: Template section for agent instructions
@context: Modular content for framework instruction generation
-->
## 🏗️ Blueprint Compliance

### Required Blueprint Structure
```yaml
id: feat-example
name: Example Feature
version: 1.0.0
requiredRoutes:
  - path: "/api/example"
    method: "POST"
requiredProviders:
  - name: "exampleProvider"
requiredSelectors:
  - name: "selectExample"
ruleContracts:
  - rule: "validation"
    version: "1.0.0"
observability:
  events:
    - name: "example.created"
      schema: "ExampleEventSchema"
errorStates:
  - code: "EXAMPLE_NOT_FOUND"
    fallback: "Show default example"
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
