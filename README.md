# Aegis: AI Agent Development Governance Framework

[![Framework Version](https://img.shields.io/badge/Framework-v2.5.0-orange?style=for-the-badge)](VERSION)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**The first governance framework for consistent, compliant AI agent code generation**

## 🚨 The Problem You're Experiencing

If you're using AI agents for coding (ChatGPT, Claude, Cursor, GitHub Copilot, etc.), you've probably hit these issues:

- __Inconsistent Code__: AI agents generate different patterns for the same problems
- __Quality Drift__: AI-generated code quality degrades over time without oversight
- __Standards Bypass__: AI agents ignore your team's coding standards and patterns
- __Multi-Agent Chaos__: Different AI tools produce conflicting code styles and approaches
- __No Accountability__: Can't track or enforce quality in AI-generated code

## ✅ The Solution: AI Agent Governance

Aegis provides __Constitutional governance__ for AI agents, ensuring they generate __consistent, compliant, trackable
code__ that follows your standards.

### What Aegis Does

- __🎯 Agent Consistency__: All AI agents follow the same patterns and standards
- __📊 Quality Enforcement__: Real-time prevention of non-compliant AI code generation
- __🔄 Multi-Agent Coordination__: Orchestrate multiple AI tools under shared governance
- __📈 Performance Tracking__: Monitor and improve AI agent effectiveness
- __🛡️ Drift Prevention__: Automatic detection and correction of AI code quality drift

---

## Installation

### npm Package

```bash
# Install globally
npm install -g @Aegis-framework/CLI@2.5.0

# Initialize in a project
Aegis-hydrate /path/to/your/project

# Basic commands
Aegis-conductor init
Aegis-conductor check
```text

#### Option 2: Source Installation (For Customization)

```bash
# Clone for customization and development
git clone https://github.com/your-org/aegis-framework.git
cd Aegis-framework

# Install dependencies
npm install

# Build packages
npm run build:package

# Run from source
./CLI/Aegis-hydrate.ts /path/to/project
```text

### Requirements

- Node.js >= 18.0.0
- npm >= 8.0.0 (or equivalent package manager)
- Git

## Core Features

### Project Setup

```bash
Aegis-hydrate /path/to/project
```text

Configures a project with framework patterns including approval gates, rollback capability, and compliance validation.

### Governance Tools

```bash
Aegis-conductor init       # Initialize framework
Aegis-conductor check      # Run compliance checks
Aegis-conductor enforce    # Apply enforcement rules
```text

### Distribution

- `@Aegis-framework/CLI`: Standalone CLI package
- `Aegis-framework-lib`: Full framework source
- Docker support available

---

## Available Commands

### CLI Commands

```bash
# After: npm install -g @Aegis-framework/CLI
Aegis-hydrate <path>           # Project setup
Aegis-conductor <command>      # Governance tools
Aegis-config                   # Configuration management
```text

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
```text

## What is Aegis?

Aegis is a framework for managing AI-assisted software development. It provides contracts, execution rules, and
validation layers for AI-generated code across different tech stacks and development contexts.

Key capabilities:

- __Auditability__: Track what was generated, when, and with what context
- __Reproducibility__: Regenerate consistent output from the same Blueprint
- __Observability__: Emit Telemetry and trace Blueprint coverage
- __Safety__: Define fallback states for failed AI generations
- __Contracts__: Schemas for AI-assisted changes
- __Versioning__: Enforce contract versions via CI
- __Governance__: Framework evolution patterns

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
```text

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

Aegis supports execution __modes__ to tune agent behavior and token usage:

| Mode         | Description                         | Use Case            |
| ------------ | ----------------------------------- | ------------------- |
| `lean`       | Minimal output, strict replay match | Cost-sensitive ops  |
| `strict`     | Full schema compliance              | CI/QA environments  |
| `generative` | Rich creative expansion             | Ideation and design |

Each agent (Copilot, Kilo, Lovable) has a behavior profile in `/framework/agents/`.

---

## 🛣 Roadmap

### ✅ __Foundation Era (v1.x - v2.4)**

- ✅ __v1.0.0-alpha__: Initial semantic release - hardened replay, error taxonomy, observability contracts
- ✅ __v1.2.0-alpha__: Constitutional governance, self-healing systems, pattern recognition, amendment processes
- ✅ __v1.3.0__: Apprenticeship scaffolds and documentation reorganization
- ✅ __v1.4.0__: Template quality & GitHub Copilot instructions
- ✅ __v2.0.0__: One-command hydration paradigm shift
- ✅ __v2.1.0__: Framework protection & Cursor integration, package distribution
- ✅ __v2.2.0__: Feature configurability system complete
- ✅ __v2.4.0__: Constitutional framework maturation

### 🎯 __AI Agent Governance Era (v2.5+)**

- ✅ __v2.5.0__: __AI Agent Development Governance Framework**
  - Strategic positioning as industry-first governance framework
  - AI Code Patterns (`blueprints/` → `patterns/`) for market clarity
  - v1.0 AI Agent Development Governance Specification
  - Documentation standards compliance and organization
  - Constitutional governance as technical differentiation

### 🚀 __Industry Leadership Era (v3.0+)**

- 🔜 __v3.0.0__: __Multi-Agent Coordination & Standards**
  - Distributed AI agent governance across development tools
  - Advanced pattern composition and inheritance
  - Industry standards working group establishment
  - Enterprise governance analytics and reporting

- 🔮 __v3.1.0__: __Ecosystem Integration**
  - Native integrations with major AI coding tools (Cursor, GitHub Copilot, ChatGPT, Claude)
  - Real-time governance enforcement across development environments
  - Community pattern marketplace and contribution system

- 🔮 __v4.0.0__: __Autonomous Governance Evolution**
  - AI-powered governance rule optimization
  - Predictive compliance and quality assurance
  - Self-evolving pattern effectiveness analysis

See [detailed roadmaps](docs/roadmap/),
[v2.2.0 Feature Configurability completion](docs/implementation/feature-configurability-phase3-complete.md), and the
[CHANGELOG.md](CHANGELOG.md) for complete feature planning and release history.

---

## 📎 Resources

### Core Framework

- [🏛️ __Constitutional Framework__](CONSTITUTION.md) - Technical governance implementation
- [📋 __AI Agent Governance Specification__](docs/specifications/AI-AGENT-GOVERNANCE-SPEC-v1.md) - Industry standard
  v1.0
- [🎯 __AI Code Patterns__](patterns/) - Governance patterns for consistent AI agent code generation
- [📊 __Framework Dashboard__](docs/reference/FRAMEWORK-DASHBOARD.md) - Live framework status and metrics

### Technical Implementation

- [🔧 __Implementation Documentation__](docs/implementation/) - Technical implementation details
- [🧩 __Pattern Schema__](framework/contracts/) - AI code pattern specifications
- [🧪 __Snapshot Tests__](tests/snapshot-tests/) - Pattern validation and testing
- [🛠 __Governance Tools__](tools/) - Real-time enforcement and validation tools

### Community & Standards

- [📖 __Contributing Guide__](CONTRIBUTING.md) - How to contribute to governance standards
- [📋 __Release Documentation__](docs/releases/) - Version history and governance evolution
- [🔄 __Evolution Strategy__](docs/evolution-strategy.md) - Framework development methodology
- [🎭 __Vision Documents__](docs/vision/) - Strategic framework direction

### Deployment & Operations

- [🚀 __Deployment Guides__](docs/deployment/) - GitHub Pages and documentation hosting
- [📚 __Documentation System__](website/) - Docusaurus documentation site
- [🧱 __Starter Scaffolds__](scaffolds/) - Project templates and examples

---

## 🔄 Contributing & Versioning

Aegis follows [Semantic Versioning](https://semver.org/) starting with v1.0.0-alpha.

**For changelog-worthy contributions:**

```bash
# Generate changelog entry for your changes
./tools/generate-changelog.sh 1.0.1-alpha "Your feature description"

# Validate blueprints before committing
node tools/validate-Blueprint.ts patterns/your-feature/pattern.YAML
```text

See [Evolution Strategy](docs/evolution-strategy.md) for guidance on framework development and impact assessment.

---

## 🧠 About This Framework

The __AI Agent Development Governance Framework__ represents a fundamental shift from "AI as better autocomplete" to "AI
as governed, reliable infrastructure."

We're solving the critical problem that every developer using AI agents faces: __inconsistent, non-compliant code
generation__. This framework provides the governance layer that makes any AI tool reliable for production use.

### Why This Matters

- __Individual Developers__: Get consistent AI output across all tools
- __Development Teams__: Enforce team standards through AI agent governance
- __Enterprise Organizations__: Meet compliance requirements for AI-generated code

> _"We're not just building better AI tools. We're establishing the industry standards for governing AI agent code
> generation."_

**Learn More__: [AI Agent Development Governance Specification](docs/specifications/AI-AGENT-GOVERNANCE-SPEC-v1.md)

---

## 🌍 Community & Engagement

### Join the Constitutional Computing Movement

- __🐛 Found an issue?**
  [Report bugs](https://github.com/chavezabelino/aegis-framework/issues/new?template=bug-report.md) with Constitutional
  impact assessment
- __💡 Have an idea?**
  [Request features](https://github.com/chavezabelino/aegis-framework/issues/new?template=feature-request.md) that
  advance AI governance
- __🔄 Share your story:**
  [Evolution Stories](https://github.com/chavezabelino/aegis-framework/issues/new?template=evolution-story.md) help the
  framework learn from real-world usage
- __🏛️ Contribute code:__ See our [Contributing Guide](CONTRIBUTING.md) for Constitutional compliance requirements

### Community Principles

> __"Constitutional computing is a conversation, not a monologue."__ - [Author Notes](docs/manifesto/author-notes.md)

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

```bash
# Generate changelog entry for your changes
./tools/generate-changelog.sh 1.0.1-alpha "Your feature description"

# Validate blueprints before committing
node tools/validate-Blueprint.ts patterns/your-feature/pattern.YAML
```text

See [Evolution Strategy](docs/evolution-strategy.md) for guidance on framework development and impact assessment.

---

## 📚 Documentation

### Core Documentation

- __[AI Agent Governance Specification](docs/specifications/AI-AGENT-GOVERNANCE-SPEC-v1.md)__ - Industry standard for AI
  agent governance
- __[Constitutional Framework](CONSTITUTION.md)__ - Technical governance implementation
- __[Contributing Guide](CONTRIBUTING.md)__ - How to contribute to the framework

### User Guides

- __[Getting Started](docs/guide/getting-started.md)__ - Quick start guide for new users
- __[AI Code Patterns](patterns/)__ - Available governance patterns
- __[Framework Dashboard](docs/reference/FRAMEWORK-DASHBOARD.md)__ - Live framework status

### Deployment & Operations

- __[GitHub Pages Deployment](docs/deployment/DEPLOY-TO-GitHub-PAGES.md)__ - Deploy documentation site
- __[Docusaurus Setup](docs/deployment/DOCUSAURUS-SETUP.md)__ - Documentation site setup
- __[Migration Planning](docs/implementation/POSITIONING-MIGRATION-PLAN.md)__ - Framework migration guide

### Vision & Strategy

- __[Framework Vision](docs/vision/)__ - Long-term framework direction
- __[Evolution Stories](docs/evolution/)__ - Framework development history
- __[Implementation Details](docs/implementation/)__ - Technical implementation documentation

---

## 🧠 Created By

This framework is part of a broader initiative to make AI-generated systems __safe__, __reliable__, and __replayable__ —
with fidelity.

It was designed to be used in production environments and across consulting, open-source, and enterprise workflows.

> _"We're not building a replicator, but we are designing like someone who wants to."_
