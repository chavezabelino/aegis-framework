# 🛡️ Aegis Framework v2.1.0

[![GenAI OS Manifesto](https://img.shields.io/badge/📖_GenAI_OS-Manifesto-blue?style=for-the-badge)](docs/manifesto/README.md)
[![Constitutional Computing](https://img.shields.io/badge/🏛️_Constitutional-Computing-green?style=for-the-badge)](docs/manifesto/principles.md)
[![Framework Version](https://img.shields.io/badge/Framework-v2.1.0-orange?style=for-the-badge)](VERSION)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

> **The world's first GenAI Operating System** - Constitutional governance for AI-native engineering with systematic drift detection, evolution learning, and democratic amendment processes.

## 📜 The GenAI Operating System Manifesto

**Stop building faster chaos. Start building governed intelligence.**

While most teams deploy AI like browser plugins—fast, fragile, ungoverned—we built the **constitutional layer** that makes AI reliable for production.

**[📖 Read the Full Manifesto →](docs/manifesto/README.md)**

### 🎯 The Problem We're Solving
- **Current State**: AI deployed without governance (prompt engineering ≠ system design)
- **The Gap**: Productivity gains that silently drift into technical debt
- **Our Solution**: Constitutional computing—infrastructure patterns for reliable AI

### 🧠 Core Principles
1. **Intelligence Requires Infrastructure** - You need governance, not just generation
2. **Prompting ≠ Governance** - Perfect prompts are still prayers to probability machines
3. **Drift Is Inevitable, Detection Is Optional** - Systems decay without monitoring
4. **Execution Modes Are Constitutional Rights** - Different contexts need different AI behavior

**[🔍 Explore Case Studies →](docs/manifesto/case-studies.md)** | **[⚙️ See Technical Principles →](docs/manifesto/principles.md)**

> 💡 **Like what you see?** ⭐ Star this repo to help others discover constitutional computing | 👀 Watch for updates on AI governance patterns

---

## 🚀 Quick Start

### Two Installation Options

#### Option 1: NPM Package (Recommended for Teams)
```bash
# Install globally for immediate use
npm install -g @aegis-framework/cli@2.1.0

# Hydrate any project instantly
aegis-hydrate /path/to/your/project

# Constitutional governance
aegis-conductor init
aegis-conductor check
```

#### Option 2: Source Installation (For Customization)
```bash
# Clone for customization and development
git clone https://github.com/your-org/aegis-framework.git
cd aegis-framework

# Install dependencies
npm install

# Build packages
npm run build:package

# Run from source
./cli/aegis-hydrate.ts /path/to/project
```

### System Requirements

- **Node.js** >= 18.0.0 (required for TypeScript support)
- **npm** >= 8.0.0 (or yarn/pnpm equivalent)
- **Git** (for project hydration and constitutional tracking)

---

## 🎯 Core Features

### ⚡ Single Command Hydration
Transform any project to constitutional compliance with one command:
```bash
aegis-hydrate /path/to/project
```
- **Approval gates** for transparent decision-making
- **Automatic rollback** on failures  
- **Constitutional compliance** validation
- **Risk assessment** and mitigation

### 🏛️ Constitutional Governance
Built-in democratic processes for framework evolution:
```bash
aegis-conductor init       # Initialize constitutional framework
aegis-conductor check      # Constitutional compliance audit
aegis-conductor enforce    # Apply governance enforcement
```

### 📦 Package Distribution
- **`@aegis-framework/cli`**: Standalone CLI for quick adoption
- **`aegis-framework-lib`**: Full framework source for customization
- **Docker support**: Containerized hydration and governance

---

## 📋 Available Commands

### 🚀 NPM Package Commands
```bash
# After: npm install -g @aegis-framework/cli
aegis-hydrate <path>           # One-command project hydration
aegis-conductor <command>      # Constitutional governance
aegis-config                   # Team configuration management
```

### 🔧 Development Commands (Source Installation)
```bash
# Package Management
npm run build:package          # Build distribution packages
npm run version:sync           # Synchronize version across files
npm run package:validate       # Validate built packages

# Release Management  
npm run release:patch          # Create patch release
npm run release:minor          # Create minor release
npm run release:major          # Create major release

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
├── docs/                  # Organized documentation
│   ├── releases/          # Release summaries and templates
│   ├── implementation/    # Technical implementation details
│   ├── architecture.md
│   ├── guide/             # User guides and tutorials
│   ├── reference/         # Reference documentation
│   └── roadmap/           # Future planning
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
- ✅ **v1.2.0-alpha**: Constitutional governance, self-healing systems, pattern recognition, amendment processes
- ✅ **v1.2.1**: Enhanced Blueprint Auto-Repair (ML optimization, context-sensitive fixes, observability, compliance)
- ✅ **v1.3.0**: Apprenticeship Scaffolds (guided/challenge/review-only modes, reflection, observability, mentor plugin, CLI, tests)
- ✅ **v1.3.1**: Documentation reorganization and improved maintainability
- ✅ **v1.4.0**: Template Quality & GitHub Copilot Instructions (HTML entity fixes, constitutional compliance, operational excellence)
- ✅ **v2.0.0-alpha-dev**: One-Command Hydration paradigm shift - "bill becomes law" migration with approval gates
- ✅ **v2.1.0**: Framework Protection & Cursor Integration (Destructive action protection, Cursor IDE integration, Vite + Bun migration)
- ✅ **v2.1.0**: Package Distribution & Automation (NPM packages, Docker support, automated releases)
- 🔜 **v2.1.0**: Feature Configurability System (three-tier configuration: Core/Required/Optional)
- 🔜 **v3.0.0**: Tech Stack Neutrality (universal framework support beyond React+Next.js)

See [detailed roadmaps](docs/roadmap/), [v2.1.0 Feature Configurability plan](docs/roadmap/feature-configurability-roadmap.md), and the [CHANGELOG.md](CHANGELOG.md) for complete feature planning and release history.

---

## 📎 Resources

- [🏛️ **Framework Constitution**](CONSTITUTION.md) - Foundational principles and governance
- [� **GenAI OS Manifesto**](docs/manifesto/README.md) - Core philosophy and vision
- [📊 **Case Studies**](docs/manifesto/case-studies.md) - Real-world evidence and examples
- [�📘 Architecture Overview](docs/architecture.md)
- [📋 **Release Documentation**](docs/releases/) - Version history and release summaries
- [🔧 **Implementation Details**](docs/implementation/) - Technical implementation documentation
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

This framework implements the **GenAI Operating System** paradigm - constitutional governance for intelligence-augmented engineering teams.

The Aegis Framework represents a fundamental shift from "AI as better autocomplete" to "AI as governable infrastructure." It provides the constitutional layer that makes AI reliable for production use.

> _"We're not just building better AI tools. We're building the governance layer that makes any AI tool reliable."_

**Learn More**: [GenAI Operating System Manifesto](docs/manifesto/README.md)

---

## 🌍 Community & Engagement

### Join the Constitutional Computing Movement
- **🐛 Found an issue?** [Report bugs](https://github.com/chavezabelino/aegis-framework/issues/new?template=bug-report.md) with constitutional impact assessment
- **💡 Have an idea?** [Request features](https://github.com/chavezabelino/aegis-framework/issues/new?template=feature-request.md) that advance AI governance
- **🔄 Share your story:** [Evolution Stories](https://github.com/chavezabelino/aegis-framework/issues/new?template=evolution-story.md) help the framework learn from real-world usage
- **🏛️ Contribute code:** See our [Contributing Guide](CONTRIBUTING.md) for constitutional compliance requirements

### Community Principles
> **"Constitutional computing is a conversation, not a monologue."** - [Author Notes](docs/manifesto/author-notes.md)

If you're building reliable AI systems and thinking "finally, someone else gets it," we want to hear from you. If you're skeptical but curious, try the framework on one small project—infrastructure is easier to understand when you've lived in it.

**Connect with us:**
- 📖 Read our [manifesto](docs/manifesto/README.md) and share your thoughts
- ⭐ Star this repo to help others discover constitutional computing
- 🔔 Watch for updates on AI governance patterns and framework evolution
- 💬 Start discussions about AI infrastructure and systematic reliability

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
# Test comment
