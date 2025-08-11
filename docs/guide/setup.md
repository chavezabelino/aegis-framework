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
- **YAML** familiarity for Blueprint authoring

## 🛠️ Installation Steps

### 1. Clone the Repository

```
# Clone from GitHub
git clone https://github.com/your-org/aegis-framework.git
cd Aegis-framework

# Or download and extract the latest release
# wget https://github.com/your-org/aegis-framework/archive/refs/tags/v2.4.0-alpha.tar.gz
```

### 2. Install Dependencies

```
# Install all framework dependencies
npm install

# Verify installation
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 8.0.0
```

### 3. Initialize Constitutional Framework

```
# Initialize the Constitutional governance system
npm run conductor init

# This creates:
# - .framework/Constitutional-state.JSON
# - .framework/enforcement-config.YAML
# - framework/drift-log/ directory with initial logs
```

### 4. Verify Installation

```
# Run Constitutional compliance check
npm run check

# Expected output:
# 🔍 Running Constitutional compliance audit...
# ✅ Framework is constitutionally compliant!

# Run comprehensive validation
npm run validate

# Show Constitutional conductor status
npm run conductor status
```

## 🔧 Configuration

### ConstitutionalConstitutional Enforcement Configuration

Edit `.framework/enforcement-config.YAML` to customize governance behavior:

```
enforcement:
  mode: strict # strict, moderate, permissive

autoCorrect:
  enabled: true
  dryRun: false # Set to true for testing

validation:
  frequency: "on-commit" # on-commit, daily, weekly

drift:
  sensitivity: medium # low, medium, high
  monitoring:
    - agent-behavior
    - user-workflows
    - framework-evolution
```

### Package.JSON Scripts

The framework provides these npm scripts:

```
{
  "scripts": {
    "validate": "node tools/validate-constitution.ts",
    "conductor": "node CLI/Aegis-conductor.ts",
    "check": "node CLI/Aegis-conductor.ts check",
    "init": "node CLI/Aegis-conductor.ts init"
  }
}
```

## 📊 Constitutional Commands Reference

### Basic Operations

```
# Show framework status
npm run conductor status

# Run compliance audit
npm run check

# Comprehensive Constitutional validation
npm run validate
```

### Advanced Operations

```
# Initialize Constitutional framework
npm run conductor init

# Enforce Constitutional compliance (dry-run)
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

```
# Test Constitutional conductor
npm run conductor status
# Expected: "🏛️ Aegis Constitutional Conductor v1.0.1-alpha"

# Test compliance checking
npm run check
# Expected: Overall compliance score and breakdown
```

### 2. Blueprint Validation Test

```
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
├── Constitutional-state.JSON
└── enforcement-config.YAML

framework/
├── drift-log/
│   ├── framework-system-drift.JSON
│   ├── agent-behavior-drift.JSON
│   └── user-workflow-drift.JSON
└── governance/
    └── amendment-proposals/
```

## 🐛 Troubleshooting

### Common Issues

#### "Cannot find module" errors

```
# Delete node_modules and reinstall
rm -rf node_modules package-lock.JSON
npm install
```

#### TypeScript compilation errors

```
# These are expected in development - the tools work despite TS warnings
# To see actual runtime issues, check the command output, not TS errors
```

#### ConstitutionalConstitutional state file missing

```
# Reinitialize the framework
npm run conductor init
```

#### Permission denied on CLI tools

```
# Make sure the tools are executable
chmod +x CLI/Aegis-conductor.ts
chmod +x tools/validate-constitution.ts
```

### Getting Help

- **Documentation**: Check `docs/` directory for detailed guides
- **Issues**: Report bugs on GitHub Issues
- **Constitution**: Read `CONSTITUTION.md` for governance questions
- **Roadmap**: See `docs/roadmap/` for planned features

## 🔄 Development Workflow

### For Framework Contributors

```
# Make changes to framework files
# ...

# Validate Constitutional compliance
npm run validate

# Check for drift patterns
npm run conductor drift-report

# Test enforcement system
npm run conductor enforce --dry-run

# Apply corrections if needed
npm run conductor enforce --auto-fix
```

### For Blueprint Authors

```
# Create new Blueprint
mkdir blueprints/your-feature
# Edit Blueprint.YAML

# Validate Blueprint
npm run check

# Test Constitutional compliance
npm run validate
```

## 📚 Next Steps

1. **Read the Constitution**: Understand framework governance in `CONSTITUTION.md`
2. **Explore Examples**: Check existing Blueprints in `blueprints/`
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

**Setup complete!** Your Aegis Framework installation is ready for Constitutional governance and Blueprint-driven
development. 🎉
