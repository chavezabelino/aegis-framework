<!--
@aegisBlueprint: planning-optimization
@version: 2.5.0
@mode: lean
@intent: IDE-agnostic contract-driven test generation prompt
@context: Works with Cursor, VS Code, and any MCP-compatible AI agent
-->

# Contract-Driven Tests — IDE-Agnostic Prompt

Task: Write/adjust tests that assert **promises** to users, not implementation.
Must:
- Accept multiple valid routes for auth (`/login` | `/(auth)/login`).
- Avoid RGB/class name assertions for themes; prefer computed gradients or semantics.
- Skip auth-only tests when TEST_EMAIL/TEST_PASSWORD not set.
- Use role/label/data-testid selectors.

Deliver:
- Full Playwright spec files (no snippets).
- README notes if new env vars/hooks needed.

## 🎯 **IDE & MCP Integration**

### **Works With Any IDE**
- **Cursor**: Built-in AI agents and MCP features
- **VS Code**: GitHub Copilot, Claude, and MCP extensions
- **JetBrains**: AI Assistant and MCP plugins
- **Any Editor**: MCP-compatible AI agents

### **MCP Test Integration**
```bash
# Run tests (via MCP)
aegis test:run --contracts

# Generate test files (via MCP)
aegis test:generate --contract-driven

# Validate test contracts (via MCP)
aegis test:validate --behavioral
```
