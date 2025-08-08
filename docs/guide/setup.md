# 🚀 Aegis Framework Setup Guide

This guide will help you set up the Aegis Framework locally for development, testing, or framework contribution.

## 📋 Prerequisites

### Required Software

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 8.0.0 (included with Node.js)
- **Git** for version control

### System Requirements

- **Operating System**: macOS, Linux, or Windows with WSL2
- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Storage**: At least 500MB free space for framework and dependencies

### Optional but Recommended

- **VS Code** with the Aegis Framework extension (coming soon)
- **TypeScript** knowledge for advanced customization
- **YAML** familiarity for blueprint authoring

## 🛠️ Installation Steps

### 1. Clone the Repository

```bash
# Clone from GitHub
git clone https://github.com/your-org/aegis-framework.git
cd aegis-framework

# Or download and extract the latest release
# wget https://github.com/your-org/aegis-framework/archive/refs/tags/v2.4.0-alpha.tar.gz
```

### 2. Install Dependencies

```bash
# Install all framework dependencies
npm install

# Verify installation
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 8.0.0
```

### 3. Initialize Constitutional Framework

```bash
# Initialize the constitutional governance system
npm run conductor init

# This creates:
# - .framework/constitutional-state.json
# - .framework/enforcement-config.yaml
# - framework/drift-log/ directory with initial logs
```

### 4. Verify Installation

```bash
# Run constitutional compliance check
npm run check

# Expected output:
# 🔍 Running constitutional compliance audit...
# ✅ Framework is constitutionally compliant!

# Run comprehensive validation
npm run validate

# Show constitutional conductor status
npm run conductor status
```

## 🔧 Configuration

### Constitutional Enforcement Configuration

Edit `.framework/enforcement-config.yaml` to customize governance behavior:

```yaml
enforcement:
  mode: strict  # strict, moderate, permissive
  
autoCorrect:
  enabled: true
  dryRun: false  # Set to true for testing
  
validation:
  frequency: "on-commit"  # on-commit, daily, weekly
  
drift:
  sensitivity: medium  # low, medium, high
  monitoring:
    - agent-behavior
    - user-workflows
    - framework-evolution
```

### Package.json Scripts

The framework provides these npm scripts:

```json
{
  "scripts": {
    "validate": "node tools/validate-constitution.ts",
    "conductor": "node cli/aegis-conductor.ts",
    "check": "node cli/aegis-conductor.ts check",
    "init": "node cli/aegis-conductor.ts init"
  }
}
```

## 📊 Constitutional Commands Reference

### Basic Operations

```bash
# Show framework status
npm run conductor status

# Run compliance audit
npm run check

# Comprehensive constitutional validation
npm run validate
```

### Advanced Operations

```bash
# Initialize constitutional framework
npm run conductor init

# Enforce constitutional compliance (dry-run)
npm run conductor enforce --dry-run

# Apply auto-corrections
npm run conductor enforce --auto-fix

# Generate drift analysis report
npm run conductor drift-report

# Scope enforcement to specific areas
npm run conductor enforce --scope=annotations
npm run conductor enforce --scope=versioning
npm run conductor enforce --scope=blueprints
```

## 🧪 Testing Your Setup

### 1. Basic Functionality Test

```bash
# Test constitutional conductor
npm run conductor status
# Expected: "🏛️ Aegis Constitutional Conductor v1.0.1-alpha"

# Test compliance checking
npm run check
# Expected: Overall compliance score and breakdown
```

### 2. Blueprint Validation Test

```bash
# Validate existing blueprints
npm run validate
# Expected: Blueprint compliance analysis

# Test enforcement system
npm run conductor enforce --dry-run
# Expected: Preview of any needed corrections
```

### 3. Framework Structure Test

Check that these directories exist after setup:

```
.framework/
├── constitutional-state.json
└── enforcement-config.yaml

framework/
├── drift-log/
│   ├── framework-system-drift.json
│   ├── agent-behavior-drift.json
│   └── user-workflow-drift.json
└── governance/
    └── amendment-proposals/
```

## 🐛 Troubleshooting

### Common Issues

#### "Cannot find module" errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript compilation errors

```bash
# These are expected in development - the tools work despite TS warnings
# To see actual runtime issues, check the command output, not TS errors
```

#### Constitutional state file missing

```bash
# Reinitialize the framework
npm run conductor init
```

#### Permission denied on CLI tools

```bash
# Make sure the tools are executable
chmod +x cli/aegis-conductor.ts
chmod +x tools/validate-constitution.ts
```

### Getting Help

- **Documentation**: Check `docs/` directory for detailed guides
- **Issues**: Report bugs on GitHub Issues
- **Constitution**: Read `CONSTITUTION.md` for governance questions
- **Roadmap**: See `docs/roadmap/` for planned features

## 🔄 Development Workflow

### For Framework Contributors

```bash
# Make changes to framework files
# ...

# Validate constitutional compliance
npm run validate

# Check for drift patterns
npm run conductor drift-report

# Test enforcement system
npm run conductor enforce --dry-run

# Apply corrections if needed
npm run conductor enforce --auto-fix
```

### For Blueprint Authors

```bash
# Create new blueprint
mkdir blueprints/your-feature
# Edit blueprint.yaml

# Validate blueprint
npm run check

# Test constitutional compliance
npm run validate
```

## 📚 Next Steps

1. **Read the Constitution**: Understand framework governance in `CONSTITUTION.md`
2. **Explore Examples**: Check existing blueprints in `blueprints/`
3. **Study the Roadmap**: See planned features in `docs/roadmap/`
4. **Contribute**: Follow guidelines in `CONTRIBUTING.md`

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `npm run conductor status` shows active status
- [ ] `npm run check` reports compliance score
- [ ] `npm run validate` completes without critical errors
- [ ] `.framework/` directory exists with state files
- [ ] Constitutional drift logs are present
- [ ] All npm scripts execute without module errors

**Setup complete!** Your Aegis Framework installation is ready for constitutional governance and blueprint-driven development. 🎉
