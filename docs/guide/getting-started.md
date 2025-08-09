# Getting Started with AI Agent Development Governance

Welcome to Aegis — the first governance framework for consistent, compliant AI agent code generation.

---

## 🔧 Requirements

- Node.js (for running CLI tools)
- Any AI coding agent (ChatGPT, Claude, Cursor, GitHub Copilot)
- Git (for version control)
- A webapp or backend project to scaffold against

---

## 🚀 Quickstart

```bash
# Clone your blueprint-enabled repo
git clone git@github.com:your-org/aegis-framework-app.git
cd aegis-framework-app

# Run pattern init (optional CLI)  
npx aegis-cli init feat-public-viewing

# Edit AI code pattern YAML
code patterns/feat-public-viewing/pattern.yaml

# Generate with your AI agent following the pattern
# Save outputs in: patterns/feat-public-viewing/output.{lean,strict,full}.json

# Run snapshot tests
npm run test:snapshots
```

---

## 🧪 Validating a Blueprint

```bash
node tools/validate-blueprint.js blueprints/feat-my-feature/blueprint.yaml
```

---

## 📘 Next Steps

- Learn how to create adapters: `adapters/<tech>/blueprint-adapter.ts`
- Learn how to test for drift: `tools/detect-drift.ts`
- Reference schema docs in `framework/contracts/`
