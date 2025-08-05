# Getting Started with the Aegis Framework

Welcome to Aegis — a production-ready AI engineering framework.

---

## 🔧 Requirements

- Node.js (for running CLI tools)
- Any AI coding agent (Copilot, Kilo, Lovable)
- Git (for version control)
- A webapp or backend project to scaffold against

---

## 🚀 Quickstart

```bash
# Clone your blueprint-enabled repo
git clone git@github.com:your-org/aegis-framework-app.git
cd aegis-framework-app

# Run blueprint init (optional CLI)
npx aegis-cli init feat-public-viewing

# Edit blueprint YAML
code blueprints/feat-public-viewing/blueprint.yaml

# Generate or replay with your AI agent
# Save outputs in: blueprints/feat-public-viewing/output.{lean,strict,full}.json

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
