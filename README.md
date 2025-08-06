# 🛡️ Aegis Framework

> A production-grade, blueprint-driven system for AI-assisted software development — with full traceability, observability, drift protection, and replay fidelity.

**🏛️ Governed by the [Aegis Framework Constitution](CONSTITUTION.md)** - establishing foundational principles, governance structures, and evolutionary processes for AI-native engineering.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 (or yarn/pnpm equivalent)

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-org/aegis-framework.git
cd aegis-framework

# Install dependencies
npm install

# Initialize constitutional framework
npm run conductor init

# Run constitutional compliance check
npm run check

# Validate comprehensive framework compliance
npm run validate
```

### Available Commands

```bash
# Constitutional Governance
npm run conductor <command>     # Run constitutional conductor
npm run check                   # Quick compliance audit
npm run validate               # Comprehensive constitutional validation

# Constitutional Conductor Commands
npm run conductor status       # Show governance status
npm run conductor init         # Initialize constitutional framework
npm run conductor check        # Run compliance audit
npm run conductor enforce      # Apply constitutional enforcement
npm run conductor drift-report # Generate drift analysis
```

---

## 🧠 What is Aegis?

**Aegis** is an AI-native engineering framework for managing complex, agent-driven software systems. It formalizes the contracts, execution rules, and validation layers required to safely scale AI-generated software — across tech stacks, tools, and developer contexts.

It was designed from the ground up to enforce:

- ✅ **Auditability**: Track who generated what, when, and with what context
- 🔁 **Replayability**: Regenerate the same output from the same blueprint, deterministically
- 📈 **Observability**: Emit telemetry and trace blueprint coverage at runtime
- ❗ **Fallback Safety**: Define user-facing error states for failed AI generations
- 🔐 **Blueprint Contracts**: Strict schemas for every AI-assisted change
- 🧬 **Rule Versioning**: Enforce specific contract versions via CI or orchestration
- 🏛️ **Constitutional Governance**: Self-healing, democratic framework evolution

---

## 📂 Project Structure

```txt
aegis-framework/
├── framework/             # Core specs, contracts, modes, agent behaviors
│   ├── framework-core-v1.0.0-alpha.md
│   ├── contracts/         # Blueprint + rule schemas
│   ├── modes/             # lean, strict, generative (token-mode configs)
│   ├── agents/            # Copilot, Kilo, Lovable behavior profiles
│   └── versions/          # Archived framework versions
│
├── blueprints/            # Real blueprint examples (testable, replayable)
│   └── feat-public-viewing/
│       ├── blueprint.yaml
│       ├── output.lean.json
│       ├── output.full.json
│       └── visual.png
│
├── adapters/              # Translate contracts to specific tech stacks
│   ├── react-next/
│   ├── deno-edge/
│   └── python-fastapi/
│
├── tests/                 # Snapshot & diff tests for blueprint fidelity
│   ├── snapshot-tests/
│   └── replay-diff-tests/
│
├── tools/                 # Helpers for validation, drift detection, docgen
├── docs/                  # Guide and architecture docs
│   ├── architecture.md
│   ├── guide/
│   └── reference/
│
├── scaffolds/             # Starter kits for framework adoption
│   └── web-app-starter/
│
├── cli/                   # (optional) CLI tooling
│
├── VERSION                # Current version tag
├── CHANGELOG.md           # Semantic versioning log
└── README.md              # This file
```

---

## 🚀 How to Use

### 1. Author a Blueprint

Create a new blueprint using `blueprints/<your-feature>/blueprint.yaml`.

Blueprints define:
- Feature intent and context
- Required routes, selectors, and components
- Associated rule contracts and error fallback UX
- Agent mode and output hash

See `framework/framework-core-v1.0.0-alpha.md` for the full blueprint schema.

---

### 2. Run and Compare Outputs

Execute the blueprint using your agent (Kilo, Copilot, etc.), then store:

- `output.lean.json`: minimal usage (strict match)
- `output.strict.json`: full schema coverage
- `output.full.json`: generative mode (max detail)

Use snapshot testing in `/tests/` to diff these outputs over time.

---

### 3. Validate and Observe

- Use `tools/validate-blueprint.ts` to check schema compliance.
- Use `tools/detect-drift.ts` to compare intent hash to agent outputs.
- Log observability events defined in each blueprint (`observability.events[]`).

---

### 4. Build for Any Tech Stack

Adapters in `/adapters/` allow the same blueprint to execute across:
- React + Next.js
- Deno + Edge Functions
- Python + FastAPI
- Spring Boot, Ruby, Vue, etc. (planned)

---

## 🧬 Agent Modes & Profiles

Aegis supports execution **modes** to tune agent behavior and token usage:

| Mode        | Description                          | Use Case              |
|-------------|--------------------------------------|------------------------|
| `lean`      | Minimal output, strict replay match  | Cost-sensitive ops     |
| `strict`    | Full schema compliance               | CI/QA environments     |
| `generative`| Rich creative expansion              | Ideation and design    |

Each agent (Copilot, Kilo, Lovable) has a behavior profile in `/framework/agents/`.

---

## 🛣 Roadmap

- ✅ **v1.0.0-alpha**: Initial semantic release - hardened replay, error taxonomy, observability contracts
- ✅ **v1.1.0-beta**: Multi-agent orchestration, MCP metadata, drift logging, enhanced adapters
- ✅ **v1.2.1**: Enhanced Blueprint Auto-Repair (ML optimization, context-sensitive fixes, observability, compliance)
- ✅ **v1.3.0**: Apprenticeship Scaffolds (guided/challenge/review-only modes, reflection, observability, mentor plugin, CLI, tests)
- 🔜 **v2.0.0**: Visual blueprint designer, real-time collaboration, enterprise governance, compliance reporting, marketplace

See `framework-core-v1.0.0-alpha.md`, [v1.1.0-beta specification](framework/versions/framework-core-v1.1.0-beta-spec.md), and the [CHANGELOG.md](CHANGELOG.md) for detailed feature planning and release history.

---

## 📎 Resources

- [🏛️ **Framework Constitution**](CONSTITUTION.md) - Foundational principles and governance
- [📘 Architecture Overview](docs/architecture.md)
- [🧩 Blueprint Schema](framework/contracts/)
- [🧪 Snapshot Test Examples](tests/snapshot-tests/)
- [🛠 Drift Detection Tool](tools/detect-drift.ts)
- [🧱 Starter Scaffold](scaffolds/web-app-starter/)
- [🔄 Framework Evolution Strategy](docs/evolution-strategy.md)
- [📝 Changelog Generator](tools/generate-changelog.sh)

---

## 🔄 Contributing & Versioning

Aegis follows [Semantic Versioning](https://semver.org/) starting with v1.0.0-alpha. 

**For changelog-worthy contributions:**
```bash
# Generate changelog entry for your changes
./tools/generate-changelog.sh 1.0.1-alpha "Your feature description"

# Validate blueprints before committing
node tools/validate-blueprint.ts blueprints/your-feature/blueprint.yaml
```

See [Evolution Strategy](docs/evolution-strategy.md) for guidance on framework development and impact assessment.

---

## 🧠 Created By

This framework is part of a broader initiative to make AI-generated systems **safe**, **reliable**, and **replayable** — with fidelity.

It was designed to be used in production environments and across consulting, open-source, and enterprise workflows.

> _“We're not building a replicator, but we are designing like someone who wants to.”_
