# Contributing to Aegis Framework

[![GenAI OS Manifesto](https://img.shields.io/badge/📖_Read_Our-Manifesto-blue?style=flat-square)](docs/manifesto/README.md) [![Constitutional Computing](https://img.shields.io/badge/🏛️_Constitutional-Computing-green?style=flat-square)](docs/manifesto/principles.md)

Welcome to the world's first **GenAI Operating System** community! We welcome contributions that advance constitutional computing and AI-native engineering practices.

## 🏛️ Constitutional Foundation

**CRITICAL**: All contributions must align with the [Aegis Framework Constitution](CONSTITUTION.md) and support the [GenAI OS Manifesto](docs/manifesto/README.md).

### 📖 Required Reading
Before contributing, please read:
1. **[GenAI OS Manifesto](docs/manifesto/README.md)** - Our foundational philosophy
2. **[Constitutional Principles](docs/manifesto/principles.md)** - Technical governance framework  
3. **[Author Notes](docs/manifesto/author-notes.md)** - The journey to constitutional computing
4. **[Framework Constitution](CONSTITUTION.md)** - Governance requirements

### 🎯 Contributing Philosophy
We're not just building features—we're establishing the patterns for how humans work with intelligence. Your contributions should:
- **Advance constitutional governance** of AI systems
- **Support systematic AI reliability** over fast chaos
- **Enable democratic evolution** of framework capabilities
- **Preserve institutional knowledge** through evolution stories

We welcome contributions that improve the fidelity, flexibility, or portability of the Aegis Framework. All contributions must align with the [Aegis Framework Constitution](CONSTITUTION.md).

## 🚀 Development Setup

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Git** for version control

### Local Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/your-username/aegis-framework.git
cd aegis-framework

# Install dependencies (DO NOT commit node_modules)
npm install

# Initialize constitutional framework
npm run conductor init

# Verify setup
npm run check
npm run validate
```

### Development Workflow

```bash
# Before making changes - check current compliance
bun run check

# Make your changes...

# Validate constitutional compliance
bun run validate

# Check for drift patterns
bun run conductor drift-report

# Test enforcement system
bun run conductor enforce --dry-run

# Apply corrections if needed
bun run conductor enforce --auto-fix

# Run tests (when available)
bun test
```

## 🏛️ Constitutional Compliance

All contributions MUST maintain constitutional compliance:

- **Annotations**: Include proper `@aegisBlueprint` or `@aegisFrameworkVersion` annotations
- **Versioning**: Maintain semantic versioning consistency
- **Structure**: Follow required directory structure
- **Governance**: Respect democratic amendment processes

## 🔁 Blueprint Additions

- Follow the schema in `framework/contracts/blueprint-contract.schema.yaml`
- Include `lean`, `strict`, and `generative` outputs if relevant
- Submit with a snapshot test in `tests/snapshot-tests/`
- Ensure constitutional annotation compliance:

```yaml
# blueprint.yaml
metadata:
  annotations:
    aegisBlueprint: "feat-your-feature"
    version: "1.0.0-alpha"
    mode: "strict"
```

## ⚖️ Contract or Schema Changes

- All changes to `framework/contracts/` must include updated docs in `docs/`
- Version bumps should update `framework-core-vX.Y.md` and `VERSION`
- Constitutional amendments require proper proposal process:
  1. Create proposal in `framework/governance/amendment-proposals/`
  2. Follow democratic review process
  3. Update constitution if approved

## 🧪 Test Requirements

```bash
# Run constitutional compliance before PR
bun run check
bun run validate

# Test enforcement system
bun run conductor enforce --dry-run

# Check drift patterns
bun run conductor drift-report
```

- New adapters or tools should include constitutional compliance verification
- Blueprint changes must pass constitutional validation
- Framework changes require constitutional state verification

## 📋 Pull Request Checklist

Before submitting a PR, ensure:

- [ ] `bun run validate` passes with >90% compliance
- [ ] `bun run check` shows constitutional compliance
- [ ] All new files include proper constitutional annotations
- [ ] Version references are consistent with current framework version
- [ ] Changes follow semantic versioning principles
- [ ] Documentation is updated for any new features
- [ ] Constitutional state is properly maintained

## 🏗️ Framework Structure

Respect the constitutional framework structure:

```
aegis-framework/
├── .framework/               # Constitutional state (DO NOT IGNORE)
│   ├── constitutional-state.json
│   └── enforcement-config.yaml
├── framework/                # Core framework specs
│   ├── drift-log/           # Drift tracking (PRESERVE)
│   ├── governance/          # Democratic processes
│   └── versions/            # Version history
├── blueprints/              # Example blueprints
├── tools/                   # Constitutional tools
├── cli/                     # Constitutional conductor
└── docs/                    # Documentation
```

## 🚫 What NOT to Commit

- `node_modules/` (use bun install)
- `package-lock.json` (unless intentionally updating dependencies)
- Personal IDE configurations
- Temporary or cache files
- Local environment files

## � Documentation Guidelines

- Architecture or usage guides belong in `docs/guide/`
- README edits welcome for clarity, language, or ecosystem growth
- All documentation should follow constitutional annotation requirements
- Include setup instructions for new features

## 🎯 Constitutional Principles

All contributions must uphold these constitutional principles:

1. **Traceability**: Every change must be traceable through blueprints
2. **Observability**: All operations must be auditable
3. **Reproducibility**: Same inputs must generate identical outputs
4. **Safety**: Include fallback mechanisms and error handling
5. **Semantic Versioning**: Follow strict semantic versioning

## 🔄 Amendment Process

For constitutional changes:

1. Create amendment proposal in `framework/governance/amendment-proposals/`
2. Follow democratic review process outlined in Constitution
3. Include impact assessment and migration guide
4. Update framework specifications accordingly

## 🐛 Reporting Issues

- Use GitHub Issues for bug reports
- Include constitutional compliance status in reports
- Provide reproduction steps with constitutional context
- Check drift logs for relevant patterns

## 🎉 Recognition

Contributors who maintain constitutional compliance and improve framework fidelity will be recognized in:

- Framework changelog
- Constitutional amendment history
- Community documentation

---

**Remember**: All changes should align with the goals of replayability, observability, safety, and constitutional governance in AI-assisted systems. 🏛️✨
