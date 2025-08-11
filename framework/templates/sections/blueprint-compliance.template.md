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
  - path: "/API/example"
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
