<!--
@aegisFrameworkVersion: 2.4.0
@intent: Template section for agent instructions
@context: Modular content for framework instruction generation
-->

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
```text
