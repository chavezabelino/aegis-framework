<!--
@aegisBlueprint: planning-optimization
# Planning Optimization System

@version: 1.0.0
@mode: lean
@intent: Overview and navigation for IDE-agnostic planning optimization system
@context: Universal planning optimization that works with any IDE via MCP
-->

# Planning Optimization System

> __Purpose__: Universal planning optimization that biases AI agents toward minimum viable, contract-driven solutions
> with automated plan gates. Works with any IDE through MCP (Model Context Protocol).

## 🎯 __Overview**

The Planning Optimization System is a Constitutional capability that enforces lean planning practices and prevents plan
bloat through automated validation gates. It represents a sophisticated governance pattern that enhances the framework's
ability to guide AI agents toward better, more efficient solutions.

**Universal Compatibility__: Works seamlessly with Cursor, VS Code, JetBrains, and any MCP-compatible IDE.

## 📚 __Documentation**

### __Core Concepts**

- __[Decision Rubric](./decision-rubric.md)__ - Lean-first planning guidance
- __[Minimum Viable Plan Template](./minimum-viable-plan.md)__ - Standardized plan format
- __[Usage Guide](./usage.md)__ - How to use the planning system
- __[Vibe Coding Guide](./vibe-coding.md)__ - Frictionless development with automatic planning
- __[IDE Integration Guide](./ide-integration.md)__ - MCP support for any IDE

### __Tools & Scripts**

- __[Plan Gate](./usage.md#ci-integration)__ - CI enforcement of planning constraints
- __[Planner Critic](./usage.md#with-ai-agents)__ - Automated plan comparison
- __[Contract-Driven Tests](./usage.md#contract-driven-development)__ - Behavioral test generation
- __[Auto Plan Detector](./vibe-coding.md#automatic-plan-detection)__ - Automatic plan analysis
- __[MCP Server](./ide-integration.md#mcp-server-setup)__ - Universal IDE integration

### __Prompts**

- __[Vibe Coder](./vibe-coding.md#ai-agent-integration)__ - Frictionless automatic planning
- __[Plan Optimizer](./usage.md#kilo-cursor-integration)__ - AI-assisted plan generation
- __[Contract-Driven Tests](./usage.md#contract-driven-development)__ - Test generation prompts

## 🏗️ __Architecture**

### __Plan Classes**

1. __MVP-Fix__ (Recommended)
   - Scope: 1-2 files, < 2 hours
   - Use Case: Bug fixes, minor enhancements
   - Constraints: No schema changes

2. __Surgical-Refactor**
   - Scope: ≤ 5 files, < 8 hours
   - Use Case: Refactoring, component extraction
   - Constraints: No breaking changes

3. __Systemic-Change__ (Requires Justification)
   - Scope: ≤ 20 files, < 40 hours
   - Use Case: Schema changes, infrastructure changes
   - Requirements: Explicit justification, approval

### __Constitutional Integration**

- __Blueprint__: `patterns/planning-optimization/Blueprint.YAML`
- __Configuration__: `.Aegis/config/planning.JSON`
- __Validation__: `scripts/ci/plan-gate.mjs`
- __Analysis__: `tools/planner-critic.ts`
- __MCP Server__: `tools/MCP-Aegis-server.ts`

## 🚀 __Quick Start**

### __1. Universal IDE Setup**

```bash
# Install MCP dependencies
npm install @modelcontextprotocol/sdk

# Start MCP server
npm run MCP:start
```text

### __2. Configure Your IDE**

Follow the [IDE Integration Guide](./ide-integration.md) for your specific IDE:

- __Cursor__: Built-in MCP support
- __VS Code__: MCP extensions
- __JetBrains__: MCP plugins
- __Any MCP IDE__: Universal compatibility

### __3. Just Prompt Naturally**

```text
"Add a user profile page"
"Fix the navigation menu"
"Refactor the data fetching"
"Add dark mode support"
```text

The AI automatically handles all planning optimization behind the scenes!

## 🎯 __Key Principles**

### __Contract-Driven Development**

Focus on observable behavior, not implementation:

- ✅ "Unauthenticated users are redirected to login"
- ❌ "Use blue background color"

### __Route Equivalence**

Accept multiple valid implementations:

```typescript
// Both are valid
const loginRoute = "/login"
const loginRoute = "/(auth)/login"
```text

### __Theme Policy**

Prefer semantic tokens over exact RGB values:

```typescript
// ✅ Good
const primaryColor = "var(--color-primary)"

// ❌ Bad
const primaryColor = "#3B82F6"
```text

## 🔄 __Framework Integration**

### __Execution Mode Alignment**

- __MVP-Fix__ → `lean` mode
- __Surgical-Refactor__ → `strict` mode
- __Systemic-Change__ → `generative` mode

### __Blueprint Compliance**

All plans must include Constitutional annotations:

```markdown
<!--
@aegisBlueprint: planning-optimization
@version: 1.0.0
@mode: lean|strict|generative
@intent: Brief description of plan purpose
@context: Relevant context for plan execution
-->
```text

### __Observability**

Planning decisions emit structured Telemetry:

- `plan.optimization.started`
- `plan.class.selected`
- `plan.gate.passed`
- `plan.gate.failed`

## 🎯 __IDE-Specific Features**

### __Cursor**

- __Native AI__: Built-in AI agents use planning optimization automatically
- __Command Palette__: Access Aegis commands directly
- __Auto-completion__: Planning suggestions in real-time

### __VS Code**

- __GitHub Copilot__: Enhanced with planning optimization
- __Claude Extension__: Full planning optimization support
- __MCP Extensions__: Native MCP protocol support

### __JetBrains**

- __AI Assistant__: Planning optimization integration
- __MCP Plugins__: Full MCP protocol support
- __Tool Windows__: Dedicated Aegis planning panel

### __Any MCP IDE**

- __Universal Support__: Works with any MCP-compatible editor
- __Protocol Standard__: Uses Model Context Protocol
- __Tool Integration__: Seamless command execution

## 📋 __Evolution Story**

This planning optimization system was integrated as part of __Evolution Story EVS-2025-01-15-002__, representing
real-time evolution detection and framework learning from field usage patterns.

**Learn More__: [Evolution Story Details](../evolution/evs-2025-01-15-002-planning-optimization-integration.md)

## 🛠️ __Troubleshooting**

### __Common Issues**

1. __Plan Too Long__: Reduce scope or split into multiple plans
2. __Too Many Files__: Consolidate changes or escalate to next plan class
3. __Missing Justification__: Add explicit justification for systemic changes
4. __Forbidden Assertions__: Remove implementation-specific requirements

### __Getting Help**

- Check the decision rubric: `docs/Aegis/planning/decision-rubric.md`
- Review plan templates: `docs/Aegis/planning/minimum-viable-plan.md`
- Validate Blueprint: `npm run plan:validate`
- Test MCP integration: `npm run MCP:start`

## 🚀 __Benefits**

### __1. Universal Compatibility**

- Works with any MCP-compatible IDE
- No vendor lock-in
- Standard protocol support

### __2. Frictionless Development**

- Just prompt naturally
- AI handles planning optimization automatically
- No manual steps required

### __3. Consistent Quality**

- Same planning optimization across all IDEs
- Contract-driven development everywhere
- Automatic validation and constraints

**The result__: __Universal planning optimization__ that works seamlessly across Cursor, VS Code, JetBrains, and any
MCP-compatible IDE. Users get the same high-quality planning optimization regardless of their development environment!
🚀
