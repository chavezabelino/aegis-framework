<!--
@aegisBlueprint: planning-optimization
@version: 2.5.0
@mode: lean
@intent: IDE-agnostic contract-driven test generation prompt
@context: Works with Cursor, VS Code, and any MCP-compatible AI agent
-->

# Contract-Driven Tests — IDE-Agnostic Prompt

Task: Write/adjust tests that assert __promises__ to users, not implementation. Must:

- Accept multiple valid routes for auth (`/login` | `/(auth)/login`).
- Avoid RGB/class name assertions for themes; prefer computed gradients or semantics.
- Skip auth-only tests when TEST_EMAIL/TEST_PASSWORD not set.
- Use role/label/data-testid selectors.

Deliver:

- Full Playwright spec files (no snippets).
- README notes if new env vars/hooks needed.

## 🎯 __IDE & MCP Integration**

### __Works With Any IDE**

- __Cursor__: Built-in AI agents and MCP features
- __VS Code__: GitHub Copilot, Claude, and MCP extensions
- __JetBrains__: AI Assistant and MCP plugins
- __Any Editor__: MCP-compatible AI agents

### __MCP Test Integration**

```bash
# Run tests (via MCP)
Aegis test:run --contracts

# Generate test files (via MCP)
Aegis test:generate --contract-driven

# Validate test contracts (via MCP)
Aegis test:validate --behavioral
```text
