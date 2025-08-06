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
