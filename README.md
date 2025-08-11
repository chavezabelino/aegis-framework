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

Aegis provides **Constitutional governance** for AI agents, ensuring they generate __consistent, compliant, trackable
code__ that follows your standards.

### What Aegis Does

- **🎯 Agent Consistency**: All AI agents follow the same patterns and standards
- **📊 Quality Enforcement**: Real-time prevention of non-compliant AI code generation
- **🔄 Multi-Agent Coordination**: Orchestrate multiple AI tools under shared governance
- **📈 Performance Tracking**: Monitor and improve AI agent effectiveness
- **🛡️ Drift Prevention**: Automatic detection and correction of AI code quality drift

---

## Installation

### npm Package

```
# Install globally
npm install -g @Aegis-framework/CLI@2.5.0

# Initialize in a project
Aegis-hydrate /path/to/your/project

# Basic commands
Aegis-conductor init
Aegis-conductor check
```

#### Option 2: Source Installation (For Customization)

```
# Clone for customization and development
git clone https://github.com/your-org/aegis-framework.git
cd Aegis-framework

# Install dependencies
npm install

# Build packages
npm run build:package

# Run from source
./CLI/Aegis-hydrate.ts /path/to/project
```

### Requirements

- Node.js >= 18.0.0
- npm >= 8.0.0 (or equivalent package manager)
- Git

## Core Features

### Project Setup

```
Aegis-hydrate /path/to/project
```

Configures a project with framework patterns including approval gates, rollback capability, and compliance validation.

### Governance Tools

```
Aegis-conductor init       # Initialize framework
Aegis-conductor check      # Run compliance checks
Aegis-conductor enforce    # Apply enforcement rules
```

### Distribution

- `@Aegis-framework/CLI`: Standalone CLI package
- `Aegis-framework-lib`: Full framework source
- Docker support available

---

## Available Commands

### CLI Commands

```
# After: npm install -g @Aegis-framework/CLI
Aegis-hydrate <path>           # Project setup
Aegis-conductor <command>      # Governance tools
Aegis-config                   # Configuration management
```

### Development Commands

```
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

Aegis is a framework for managing AI-assisted software development. It provides contracts, execution rules, and
validation layers for AI-generated code across different tech stacks and development contexts.

Key capabilities:

- **Auditability**: Track what was generated, when, and with what context
- **Reproducibility**: Regenerate consistent output from the same Blueprint
- **Observability**: Emit Telemetry and trace Blueprint coverage
- **Safety**: Define fallback states for failed AI generations
- **Contracts**: Schemas for AI-assisted changes
- **Versioning**: Enforce contract versions via CI
- **Governance**: Framework evolution patterns

---

## Project Structure

```txt
Aegis-framework/
├── framework/             # Core specs, contracts, modes, agent behaviors
│   ├── framework-core-v1.0.0-alpha.md
│   ├── contracts/         # Blueprint + rule schemas
│   ├── modes/             # lean, strict, generative (token-mode configs)
│   ├── agents/            # Copilot, Kilo, Lovable behavior profiles
│   └── versions/          # Archived framework versions
│
├── patterns/              # AI Code Patterns (testable, replayable)
│   └── feat-public-viewing/
│       ├── Blueprint.YAML
│       ├── output.lean.JSON
│       ├── output.full.JSON
│       └── visual.png
│
├── adapters/              # Translate contracts to specific tech stacks
│   ├── react-next/
│   ├── deno-edge/
│   └── python-fastapi/
│
├── tests/                 # Snapshot & diff tests for Blueprint fidelity
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
├── CLI/                   # (optional) CLI tooling
│
├── VERSION                # Current version tag
├── CHANGELOG.md           # Semantic versioning log
└── README.md              # This file
```

---

## 🚀 How to Use

### 1. Author a Blueprint

Create a new AI code pattern using `patterns/<your-feature>/pattern.YAML`.

Blueprints define:

- Feature intent and context
- Required routes, selectors, and components
- Associated rule contracts and error fallback UX
- Agent mode and output hash

See `framework/framework-core-v1.0.0-alpha.md` for the full Blueprint schema.

---

### 2. Run and Compare Outputs

Execute the Blueprint using your agent (Kilo, Copilot, etc.), then store:

- `output.lean.JSON`: minimal usage (strict match)
- `output.strict.JSON`: full schema coverage
- `output.full.JSON`: generative mode (max detail)

Use snapshot testing in `/tests/` to diff these outputs over time.

---

### 3. Validate and Observe

- Use `tools/validate-Blueprint.ts` to check schema compliance.
- Use `tools/detect-drift.ts` to compare intent hash to agent outputs.
- Log observability events defined in each Blueprint (`observability.events[]`).

---

### 4. Build for Any Tech Stack

Adapters in `/adapters/` allow the same Blueprint to execute across:

- React + Next.js
- Deno + Edge Functions
- Python + FastAPI
- Spring Boot, Ruby, Vue, etc. (planned)

---

## 🧬 Agent Modes & Profiles

Aegis supports execution **modes** to tune agent behavior and token usage:

| Mode         | Description                         | Use Case            |
| ------------ | ----------------------------------- | ------------------- |
| `lean`       | Minimal output, strict replay match | Cost-sensitive ops  |
| `strict`     | Full schema compliance              | CI/QA environments  |
| `generative` | Rich creative expansion             | Ideation and design |

Each agent (Copilot, Kilo, Lovable) has a behavior profile in `/framework/agents/`.

---

## 🛣 Roadmap

### ✅ **Foundation Era (v1.x - v2.4)**

- ✅ **v1.0.0-alpha**: Initial semantic release - hardened replay, error taxonomy, observability contracts
- ✅ **v1.2.0-alpha**: Constitutional governance, self-healing systems, pattern recognition, amendment processes
- ✅ **v1.3.0**: Apprenticeship scaffolds and documentation reorganization
- ✅ **v1.4.0**: Template quality & GitHub Copilot instructions
- ✅ **v2.0.0**: One-command hydration paradigm shift
- ✅ **v2.1.0**: Framework protection & Cursor integration, package distribution
- ✅ **v2.2.0**: Feature configurability system complete
- ✅ **v2.4.0**: Constitutional framework maturation

### 🎯 **AI Agent Governance Era (v2.5+)**

- ✅ **v2.5.0**: **AI Agent Development Governance Framework**
  - Strategic positioning as industry-first governance framework
  - AI Code Patterns (`blueprints/` → `patterns/`) for market clarity
  - v1.0 AI Agent Development Governance Specification
  - Documentation standards compliance and organization
  - Constitutional governance as technical differentiation

### 🚀 **Industry Leadership Era (v3.0+)**

- 🔜 **v3.0.0**: **Multi-Agent Coordination & Standards**
  - Distributed AI agent governance across development tools
  - Advanced pattern composition and inheritance
  - Industry standards working group establishment
  - Enterprise governance analytics and reporting

- 🔮 **v3.1.0**: **Ecosystem Integration**
  - Native integrations with major AI coding tools (Cursor, GitHub Copilot, ChatGPT, Claude)
  - Real-time governance enforcement across development environments
  - Community pattern marketplace and contribution system

- 🔮 **v4.0.0**: **Autonomous Governance Evolution**
  - AI-powered governance rule optimization
  - Predictive compliance and quality assurance
  - Self-evolving pattern effectiveness analysis

See [detailed roadmaps](docs/roadmap/),
[v2.2.0 Feature Configurability completion](docs/implementation/feature-configurability-phase3-complete.md), and the
[CHANGELOG.md](CHANGELOG.md) for complete feature planning and release history.

---

## 📎 Resources

### Core Framework

- [🏛️ **Constitutional Framework**](CONSTITUTION.md) - Technical governance implementation
- [📋 **AI Agent Governance Specification**](docs/specifications/AI-AGENT-GOVERNANCE-SPEC-v1.md) - Industry standard
  v1.0
- [🎯 **AI Code Patterns**](patterns/) - Governance patterns for consistent AI agent code generation
- [📊 **Framework Dashboard**](docs/reference/FRAMEWORK-DASHBOARD.md) - Live framework status and metrics

### Technical Implementation

- [🔧 **Implementation Documentation**](docs/implementation/) - Technical implementation details
- [🧩 **Pattern Schema**](framework/contracts/) - AI code pattern specifications
- [🧪 **Snapshot Tests**](tests/snapshot-tests/) - Pattern validation and testing
- [🛠 **Governance Tools**](tools/) - Real-time enforcement and validation tools

### Community & Standards

- [📖 **Contributing Guide**](CONTRIBUTING.md) - How to contribute to governance standards
- [📋 **Release Documentation**](docs/releases/) - Version history and governance evolution
- [🔄 **Evolution Strategy**](docs/evolution-strategy.md) - Framework development methodology
- [🎭 **Vision Documents**](docs/vision/) - Strategic framework direction

### Deployment & Operations

- [🚀 **Deployment Guides**](docs/deployment/) - GitHub Pages and documentation hosting
- [📚 **Documentation System**](website/) - Docusaurus documentation site
- [🧱 **Starter Scaffolds**](scaffolds/) - Project templates and examples

---

## 🔄 Contributing & Versioning

Aegis follows [Semantic Versioning](https://semver.org/) starting with v1.0.0-alpha.

**For changelog-worthy contributions:**

```
# Generate changelog entry for your changes
./tools/generate-changelog.sh 1.0.1-alpha "Your feature description"

# Validate blueprints before committing
node tools/validate-Blueprint.ts patterns/your-feature/pattern.YAML
```

See [Evolution Strategy](docs/evolution-strategy.md) for guidance on framework development and impact assessment.

---

## 🧠 About This Framework

The **AI Agent Development Governance Framework** represents a fundamental shift from "AI as better autocomplete" to "AI
as governed, reliable infrastructure."

We're solving the critical problem that every developer using AI agents faces: __inconsistent, non-compliant code
generation__. This framework provides the governance layer that makes any AI tool reliable for production use.

### Why This Matters

- **Individual Developers**: Get consistent AI output across all tools
- **Development Teams**: Enforce team standards through AI agent governance
- **Enterprise Organizations**: Meet compliance requirements for AI-generated code

> _"We're not just building better AI tools. We're establishing the industry standards for governing AI agent code
> generation."_

**Learn More**: [AI Agent Development Governance Specification](docs/specifications/AI-AGENT-GOVERNANCE-SPEC-v1.md)

---

## 🌍 Community & Engagement

### Join the Constitutional Computing Movement

- **🐛 Found an issue?**
  [Report bugs](https://github.com/chavezabelino/aegis-framework/issues/new?template=bug-report.md) with Constitutional
  impact assessment
- **💡 Have an idea?**
  [Request features](https://github.com/chavezabelino/aegis-framework/issues/new?template=feature-request.md) that
  advance AI governance
- **🔄 Share your story:**
  [Evolution Stories](https://github.com/chavezabelino/aegis-framework/issues/new?template=evolution-story.md) help the
  framework learn from real-world usage
- **🏛️ Contribute code:** See our [Contributing Guide](CONTRIBUTING.md) for Constitutional compliance requirements

### Community Principles

> **"Constitutional computing is a conversation, not a monologue."** - [Author Notes](docs/manifesto/author-notes.md)

If you're building reliable AI systems and thinking "finally, someone else gets it," we want to hear from you. If you're
skeptical but curious, try the framework on one small project—infrastructure is easier to understand when you've lived
in it.

**Connect with us:**

- 📖 Read our [manifesto](docs/manifesto/README.md) and share your thoughts
- ⭐ Star this repo to help others discover Constitutional computing
- 🔔 Watch for updates on AI governance patterns and framework evolution
- 💬 Start discussions about AI infrastructure and systematic reliability

---

## 🔄 Contributing & Versioning

Aegis follows [Semantic Versioning](https://semver.org/) starting with v1.0.0-alpha.

**For changelog-worthy contributions:**

```
# Generate changelog entry for your changes
./tools/generate-changelog.sh 1.0.1-alpha "Your feature description"

# Validate blueprints before committing
node tools/validate-Blueprint.ts patterns/your-feature/pattern.YAML
```

See [Evolution Strategy](docs/evolution-strategy.md) for guidance on framework development and impact assessment.

---

## 📚 Documentation

### Core Documentation

- **[AI Agent Governance Specification](docs/specifications/AI-AGENT-GOVERNANCE-SPEC-v1.md)** - Industry standard for AI
  agent governance
- **[Constitutional Framework](CONSTITUTION.md)** - Technical governance implementation
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the framework

### User Guides

- **[Getting Started](docs/guide/getting-started.md)** - Quick start guide for new users
- **[AI Code Patterns](patterns/)** - Available governance patterns
- **[Framework Dashboard](docs/reference/FRAMEWORK-DASHBOARD.md)** - Live framework status

### Deployment & Operations

- **[GitHub Pages Deployment](docs/deployment/DEPLOY-TO-GitHub-PAGES.md)** - Deploy documentation site
- **[Docusaurus Setup](docs/deployment/DOCUSAURUS-SETUP.md)** - Documentation site setup
- **[Migration Planning](docs/implementation/POSITIONING-MIGRATION-PLAN.md)** - Framework migration guide

### Vision & Strategy

- **[Framework Vision](docs/vision/)** - Long-term framework direction
- **[Evolution Stories](docs/evolution/)** - Framework development history
- **[Implementation Details](docs/implementation/)** - Technical implementation documentation

---

## 🧠 Created By

This framework is part of a broader initiative to make AI-generated systems **safe**, **reliable**, and **replayable** —
with fidelity.

It was designed to be used in production environments and across consulting, open-source, and enterprise workflows.

> _"We're not building a replicator, but we are designing like someone who wants to."_
