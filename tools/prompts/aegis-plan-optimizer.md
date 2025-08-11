<!--
@aegisBlueprint: planning-optimization
@version: 2.5.0
@mode: lean
@intent: IDE-agnostic plan optimization prompt for AI agents
@context: Works with Cursor, VS Code, and any MCP-compatible AI agent
-->

# Aegis Plan Optimizer — IDE-Agnostic Prompt

You are the Planner. Apply `decision-rubric.md`. Output exactly one plan class:
- MVP-Fix
- Surgical-Refactor
- Systemic-Change (only if justified)

Rules:
- Assert **behavioral contracts** only.
- Prefer **smallest** viable plan.
- Include full files if you touch code.
- Add acceptance criteria aligned to contracts.

Output Sections:
1) Problem Framing (≤ 6 lines)
2) Plan Class (one) + Justification (≤ 3 bullets)
3) Contracts (checkbox list)
4) Changes (file list; full content for updates)
5) Tests (which contracts, where)
6) Risks & Rollback
7) Acceptance (binary list)

## 🎯 **IDE & MCP Integration**

### **Works With Any IDE**
- **Cursor**: Built-in AI agents and MCP features
- **VS Code**: GitHub Copilot, Claude, and MCP extensions
- **JetBrains**: AI Assistant and MCP plugins
- **Any Editor**: MCP-compatible AI agents

### **MCP Command Integration**
```bash
# Validate plan (via MCP)
aegis plan:validate --class=mvp --files=2

# Compare plans (via MCP)
aegis plan:compare plan1.md plan2.md

# Auto detect plan (via MCP)
aegis plan:auto "your prompt here"
```
