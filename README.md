# Aegis: AI Agent Development Governance Framework

[![Framework Version](https://img.shields.io/badge/Framework-v2.5.0-orange?style=for-the-badge)](VERSION)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**The first governance framework for consistent, compliant AI agent code generation**

## 🚨 The Problem You're Experiencing

If you're using AI agents for coding (ChatGPT, Claude, Cursor, GitHub Copilot, etc.), you've probably hit these issues:

- **Inconsistent Code**: AI agents generate different patterns for the same problems
- **Quality Drift**: AI-generated code quality degrades over time without oversight  
- **Standards Bypass**: AI agents ignore your team's coding standards and patterns
- **Multi-Agent Chaos**: Different AI tools produce conflicting code styles and approaches
- **No Accountability**: Can't track or enforce quality in AI-generated code

## ✅ The Solution: AI Agent Governance

Aegis provides **constitutional governance** for AI agents, ensuring they generate **consistent, compliant, trackable code** that follows your standards.

### What Aegis Does
- **🎯 Agent Consistency**: All AI agents follow the same patterns and standards
- **📊 Quality Enforcement**: Real-time prevention of non-compliant AI code generation
- **🔄 Multi-Agent Coordination**: Orchestrate multiple AI tools under shared governance
- **📈 Performance Tracking**: Monitor and improve AI agent effectiveness
- **🛡️ Drift Prevention**: Automatic detection and correction of AI code quality drift

---

## Installation

### NPM Package
```bash
# Install globally
npm install -g @aegis-framework/cli@2.5.0

# Initialize in a project
aegis-hydrate /path/to/your/project

# Basic commands
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

### Requirements

- Node.js >= 18.0.0
- npm >= 8.0.0 (or equivalent package manager)
- Git

## Core Features

### Project Setup
```bash
aegis-hydrate /path/to/project
```
Configures a project with framework patterns including approval gates, rollback capability, and compliance validation.

### Governance Tools
```bash
aegis-conductor init       # Initialize framework
aegis-conductor check      # Run compliance checks
aegis-conductor enforce    # Apply enforcement rules
```

### Distribution
- `@aegis-framework/cli`: Standalone CLI package
- `aegis-framework-lib`: Full framework source
- Docker support available

---

## Available Commands

### CLI Commands
```bash
# After: npm install -g @aegis-framework/cli
aegis-hydrate <path>           # Project setup
aegis-conductor <command>      # Governance tools
aegis-config                   # Configuration management
```

### Development Commands
```bash
# Package Management
npm run build:package          # Build packages
npm run version:sync           # Synchronize versions
npm run package:validate       # Validate packages

# Release Management  
npm run release:patch          # Patch release
npm run release:minor          # Minor release
npm run release:major          # Major release
```

## What is Aegis?

Aegis is a framework for managing AI-assisted software development. It provides contracts, execution rules, and validation layers for AI-generated code across different tech stacks and development contexts.

Key capabilities:

- **Auditability**: Track what was generated, when, and with what context
- **Reproducibility**: Regenerate consistent output from the same blueprint
- **Observability**: Emit telemetry and trace blueprint coverage
- **Safety**: Define fallback states for failed AI generations
- **Contracts**: Schemas for AI-assisted changes
- **Versioning**: Enforce contract versions via CI
- **Governance**: Framework evolution patterns

---

## Project Structure

```txt
aegis-framework/
├── framework/             # Core specs, contracts, modes, agent behaviors
│   ├── framework-core-v1.0.0-alpha.md
│   ├── contracts/         # Blueprint + rule schemas
│   ├── modes/             # lean, strict, generative (token-mode configs)
│   ├── agents/            # Copilot, Kilo, Lovable behavior profiles
│   └── versions/          # Archived framework versions
│
├── patterns/              # AI Code Patterns (testable, replayable)
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

Create a new AI code pattern using `patterns/<your-feature>/pattern.yaml`.

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
- ✅ **v2.2.0**: Feature Configurability System Complete (Three-tier configuration: Core/Required/Optional)
- ✅ **v2.1.0**: Framework Protection & Cursor Integration (Destructive action protection, Cursor IDE integration, Vite + Bun migration)
- ✅ **v2.1.0**: Package Distribution & Automation (NPM packages, Docker support, automated releases)
- 🔜 **v3.0.0**: Tech Stack Neutrality (universal framework support beyond React+Next.js)

See [detailed roadmaps](docs/roadmap/), [v2.2.0 Feature Configurability completion](docs/implementation/feature-configurability-phase3-complete.md), and the [CHANGELOG.md](CHANGELOG.md) for complete feature planning and release history.

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
node tools/validate-blueprint.ts patterns/your-feature/pattern.yaml
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
node tools/validate-blueprint.ts patterns/your-feature/pattern.yaml
```

See [Evolution Strategy](docs/evolution-strategy.md) for guidance on framework development and impact assessment.

---

## 📚 Documentation

### Core Documentation
- **[AI Agent Governance Specification](docs/specifications/AI-AGENT-GOVERNANCE-SPEC-v1.md)** - Industry standard for AI agent governance
- **[Constitutional Framework](CONSTITUTION.md)** - Technical governance implementation
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the framework

### User Guides
- **[Getting Started](docs/guide/getting-started.md)** - Quick start guide for new users
- **[AI Code Patterns](patterns/)** - Available governance patterns
- **[Framework Dashboard](docs/reference/FRAMEWORK-DASHBOARD.md)** - Live framework status

### Deployment & Operations
- **[GitHub Pages Deployment](docs/deployment/DEPLOY-TO-GITHUB-PAGES.md)** - Deploy documentation site
- **[Docusaurus Setup](docs/deployment/DOCUSAURUS-SETUP.md)** - Documentation site setup
- **[Migration Planning](docs/implementation/POSITIONING-MIGRATION-PLAN.md)** - Framework migration guide

### Vision & Strategy
- **[Framework Vision](docs/vision/)** - Long-term framework direction
- **[Evolution Stories](docs/evolution/)** - Framework development history
- **[Implementation Details](docs/implementation/)** - Technical implementation documentation

---

## 🧠 Created By

This framework is part of a broader initiative to make AI-generated systems **safe**, **reliable**, and **replayable** — with fidelity.

It was designed to be used in production environments and across consulting, open-source, and enterprise workflows.

> _“We're not building a replicator, but we are designing like someone who wants to.”_
# Test comment
