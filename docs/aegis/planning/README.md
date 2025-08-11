<!--
@aegisBlueprint: planning-optimization
# Planning Optimization System

@version: 1.0.0
@mode: lean
@intent: Overview and navigation for IDE-agnostic planning optimization system
@context: Universal planning optimization that works with any IDE via MCP
-->

# Planning Optimization System

> **Purpose**: Universal planning optimization that biases AI agents toward minimum viable, contract-driven solutions
> with automated plan gates. Works with any IDE through MCP (Model Context Protocol).

## 🎯 **Overview**

The Planning Optimization System is a Constitutional capability that enforces lean planning practices and prevents plan
bloat through automated validation gates. It represents a sophisticated governance pattern that enhances the framework's
ability to guide AI agents toward better, more efficient solutions.

**Universal Compatibility**: Works seamlessly with Cursor, VS Code, JetBrains, and any MCP-compatible IDE.

## 📚 **Documentation**

### **Core Concepts**

- **[Decision Rubric](./decision-rubric.md)** - Lean-first planning guidance
- **[Minimum Viable Plan Template](./minimum-viable-plan.md)** - Standardized plan format
- **[Usage Guide](./usage.md)** - How to use the planning system
- **[Vibe Coding Guide](./vibe-coding.md)** - Frictionless development with automatic planning
- **[IDE Integration Guide](./ide-integration.md)** - MCP support for any IDE

### **Tools & Scripts**

- **[Plan Gate](./usage.md#ci-integration)** - CI enforcement of planning constraints
- **[Planner Critic](./usage.md#with-ai-agents)** - Automated plan comparison
- **[Contract-Driven Tests](./usage.md#contract-driven-development)** - Behavioral test generation
- **[Auto Plan Detector](./vibe-coding.md#automatic-plan-detection)** - Automatic plan analysis
- **[MCP Server](./ide-integration.md#mcp-server-setup)** - Universal IDE integration

### **Prompts**

- **[Vibe Coder](./vibe-coding.md#ai-agent-integration)** - Frictionless automatic planning
- **[Plan Optimizer](./usage.md#kilo-cursor-integration)** - AI-assisted plan generation
- **[Contract-Driven Tests](./usage.md#contract-driven-development)** - Test generation prompts

## 🏗️ **Architecture**

### **Plan Classes**

1. **MVP-Fix** (Recommended)
   - Scope: 1-2 files, < 2 hours
   - Use Case: Bug fixes, minor enhancements
   - Constraints: No schema changes

2. **Surgical-Refactor**
   - Scope: ≤ 5 files, < 8 hours
   - Use Case: Refactoring, component extraction
   - Constraints: No breaking changes

3. **Systemic-Change** (Requires Justification)
   - Scope: ≤ 20 files, < 40 hours
   - Use Case: Schema changes, infrastructure changes
   - Requirements: Explicit justification, approval

### **Constitutional Integration**

- **Blueprint**: `patterns/planning-optimization/Blueprint.YAML`
- **Configuration**: `.Aegis/config/planning.JSON`
- **Validation**: `scripts/ci/plan-gate.mjs`
- **Analysis**: `tools/planner-critic.ts`
- **MCP Server**: `tools/MCP-Aegis-server.ts`

## 🚀 **Quick Start**

### **1. Universal IDE Setup**

```
# Install MCP dependencies
npm install @modelcontextprotocol/sdk

# Start MCP server
npm run MCP:start
```

### **2. Configure Your IDE**

Follow the [IDE Integration Guide](./ide-integration.md) for your specific IDE:

- **Cursor**: Built-in MCP support
- **VS Code**: MCP extensions
- **JetBrains**: MCP plugins
- **Any MCP IDE**: Universal compatibility

### **3. Just Prompt Naturally**

```
"Add a user profile page"
"Fix the navigation menu"
"Refactor the data fetching"
"Add dark mode support"
```

The AI automatically handles all planning optimization behind the scenes!

## 🎯 **Key Principles**

### **Contract-Driven Development**

Focus on observable behavior, not implementation:

- ✅ "Unauthenticated users are redirected to login"
- ❌ "Use blue background color"

### **Route Equivalence**

Accept multiple valid implementations:

```
// Both are valid
const loginRoute = "/login"
const loginRoute = "/(auth)/login"
```

### **Theme Policy**

Prefer semantic tokens over exact RGB values:

```
// ✅ Good
const primaryColor = "var(--color-primary)"

// ❌ Bad
const primaryColor = "#3B82F6"
```

## 🔄 **Framework Integration**

### **Execution Mode Alignment**

- **MVP-Fix** → `lean` mode
- **Surgical-Refactor** → `strict` mode
- **Systemic-Change** → `generative` mode

### **Blueprint Compliance**

All plans must include Constitutional annotations:

```
<!--
@aegisBlueprint: planning-optimization
@version: 1.0.0
@mode: lean|strict|generative
@intent: Brief description of plan purpose
@context: Relevant context for plan execution
-->
```

### **Observability**

Planning decisions emit structured Telemetry:

- `plan.optimization.started`
- `plan.class.selected`
- `plan.gate.passed`
- `plan.gate.failed`

## 🎯 **IDE-Specific Features**

### **Cursor**

- **Native AI**: Built-in AI agents use planning optimization automatically
- **Command Palette**: Access Aegis commands directly
- **Auto-completion**: Planning suggestions in real-time

### **VS Code**

- **GitHub Copilot**: Enhanced with planning optimization
- **Claude Extension**: Full planning optimization support
- **MCP Extensions**: Native MCP protocol support

### **JetBrains**

- **AI Assistant**: Planning optimization integration
- **MCP Plugins**: Full MCP protocol support
- **Tool Windows**: Dedicated Aegis planning panel

### **Any MCP IDE**

- **Universal Support**: Works with any MCP-compatible editor
- **Protocol Standard**: Uses Model Context Protocol
- **Tool Integration**: Seamless command execution

## 📋 **Evolution Story**

This planning optimization system was integrated as part of **Evolution Story EVS-2025-01-15-002**, representing
real-time evolution detection and framework learning from field usage patterns.

**Learn More**: [Evolution Story Details](../evolution/evs-2025-01-15-002-planning-optimization-integration.md)

## 🛠️ **Troubleshooting**

### **Common Issues**

1. **Plan Too Long**: Reduce scope or split into multiple plans
2. **Too Many Files**: Consolidate changes or escalate to next plan class
3. **Missing Justification**: Add explicit justification for systemic changes
4. **Forbidden Assertions**: Remove implementation-specific requirements

### **Getting Help**

- Check the decision rubric: `docs/Aegis/planning/decision-rubric.md`
- Review plan templates: `docs/Aegis/planning/minimum-viable-plan.md`
- Validate Blueprint: `npm run plan:validate`
- Test MCP integration: `npm run MCP:start`

## 🚀 **Benefits**

### **1. Universal Compatibility**

- Works with any MCP-compatible IDE
- No vendor lock-in
- Standard protocol support

### **2. Frictionless Development**

- Just prompt naturally
- AI handles planning optimization automatically
- No manual steps required

### **3. Consistent Quality**

- Same planning optimization across all IDEs
- Contract-driven development everywhere
- Automatic validation and constraints

**The result**: **Universal planning optimization** that works seamlessly across Cursor, VS Code, JetBrains, and any
MCP-compatible IDE. Users get the same high-quality planning optimization regardless of their development environment!
🚀
