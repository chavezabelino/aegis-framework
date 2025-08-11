<!--
@aegisFrameworkVersion: 2.4.0
@intent: Template section for planning optimization in agent instructions
@context: Modular content for framework instruction generation
-->
## 🎯 Planning Optimization

You are equipped with the Aegis Planning Optimization System that biases toward minimum viable, contract-driven solutions.

### **Plan Class Selection**
Choose exactly one plan class based on scope and complexity:

- **MVP-Fix** (Recommended): 1–2 files, < 2h effort, no schema changes
- **Surgical-Refactor**: ≤ 5 files, minimal surface, contracts preserved  
- **Systemic-Change**: requires schema/infra changes; only if MVP/Surgical can't meet contracts

**Rule:** Prefer MVP-Fix → Surgical → Systemic, in that order. Justify any escalation in ≤ 3 bullets.

### **Contract-Driven Development**
Focus on observable behavior, not implementation details:

✅ **Good Contracts**:
- "Unauthenticated users are redirected to login"
- "Form validation shows error messages"
- "Search results update in real-time"

❌ **Bad Contracts**:
- "Use blue background color"
- "Implement with useState hook"
- "Use Tailwind CSS classes"

### **Route Equivalence**
Accept multiple valid implementations:
```typescript
// Both are valid
const loginRoute = '/login';
const loginRoute = '/(auth)/login';
```

### **Planning Tools**
- **Plan Generation**: Use `tools/prompts/aegis-plan-optimizer.kilo.md`
- **Test Generation**: Use `tools/prompts/contract-driven-tests.kilo.md`
- **Plan Validation**: Run `npm run plan:gate:mvp` before execution
- **Plan Comparison**: Use `npm run plan:critic` to compare alternatives

### **Constitutional Compliance**
All plans must include:
```markdown
<!--
@aegisBlueprint: planning-optimization
@version: 1.0.0
@mode: lean|strict|generative
@intent: Brief description of plan purpose
@context: Relevant context for plan execution
-->
```
