# 🚀 Aegis Framework Setup Guide

This guide will help you set up the Aegis Framework locally for development, testing, or framework contribution.

## 📋 Prerequisites

### Required Software

- __Node.js__ >= 18.0.0 ([Download](https://nodejs.org/))
- __npm__ >= 8.0.0 (included with Node.js)
- __Git__ for version control

### System Requirements

- __Operating System__: macOS, Linux, or Windows with WSL2
- __Memory__: Minimum 4GB RAM (8GB recommended)
- __Storage__: At least 500MB free space for framework and dependencies

### Optional but Recommended

- __VS Code__ with the Aegis Framework extension (coming soon)
- __TypeScript__ knowledge for advanced customization
- __YAML__ familiarity for Blueprint authoring

## 🛠️ Installation Steps

### 1. Clone the Repository

```bash
# Clone from GitHub
git clone https://github.com/your-org/aegis-framework.git
cd Aegis-framework

# Or download and extract the latest release
# wget https://github.com/your-org/aegis-framework/archive/refs/tags/v2.4.0-alpha.tar.gz
```text

### 2. Install Dependencies

```bash
# Install all framework dependencies
npm install

# Verify installation
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 8.0.0
```text

### 3. Initialize Constitutional Framework

```bash
# Initialize the Constitutional governance system
npm run conductor init

# This creates:
# - .framework/Constitutional-state.JSON
# - .framework/enforcement-config.YAML
# - framework/drift-log/ directory with initial logs
```text

### 4. Verify Installation

```bash
# Run Constitutional compliance check
npm run check

# Expected output:
# 🔍 Running Constitutional compliance audit...
# ✅ Framework is constitutionally compliant!

# Run comprehensive validation
npm run validate

# Show Constitutional conductor status
npm run conductor status
```text

## 🔧 Configuration

### ConstitutionalConstitutional Enforcement Configuration

Edit `.framework/enforcement-config.YAML` to customize governance behavior:

```yaml
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
```text

### Package.JSON Scripts

The framework provides these npm scripts:

```json
{
  "scripts": {
    "validate": "node tools/validate-constitution.ts",
    "conductor": "node CLI/Aegis-conductor.ts",
    "check": "node CLI/Aegis-conductor.ts check",
    "init": "node CLI/Aegis-conductor.ts init"
  }
}
```text

## 📊 Constitutional Commands Reference

### Basic Operations

```bash
# Show framework status
npm run conductor status

# Run compliance audit
npm run check

# Comprehensive Constitutional validation
npm run validate
```text

### Advanced Operations

```bash
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
```text

## 🧪 Testing Your Setup

### 1. Basic Functionality Test

```bash
# Test Constitutional conductor
npm run conductor status
# Expected: "🏛️ Aegis Constitutional Conductor v1.0.1-alpha"

# Test compliance checking
npm run check
# Expected: Overall compliance score and breakdown
```text

### 2. Blueprint Validation Test

```bash
# Validate existing blueprints
npm run validate
# Expected: Blueprint compliance analysis

# Test enforcement system
npm run conductor enforce --dry-run
# Expected: Preview of any needed corrections
```text

### 3. Framework Structure Test

Check that these directories exist after setup:

```text
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
```text

## 🐛 Troubleshooting

### Common Issues

#### "Cannot find module" errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.JSON
npm install
```text

#### TypeScript compilation errors

```bash
# These are expected in development - the tools work despite TS warnings
# To see actual runtime issues, check the command output, not TS errors
```text

#### ConstitutionalConstitutional state file missing

```bash
# Reinitialize the framework
npm run conductor init
```text

#### Permission denied on CLI tools

```bash
# Make sure the tools are executable
chmod +x CLI/Aegis-conductor.ts
chmod +x tools/validate-constitution.ts
```text

### Getting Help

- __Documentation__: Check `docs/` directory for detailed guides
- __Issues__: Report bugs on GitHub Issues
- __Constitution__: Read `CONSTITUTION.md` for governance questions
- __Roadmap__: See `docs/roadmap/` for planned features

## 🔄 Development Workflow

### For Framework Contributors

```bash
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
```text

### For Blueprint Authors

```bash
# Create new Blueprint
mkdir blueprints/your-feature
# Edit Blueprint.YAML

# Validate Blueprint
npm run check

# Test Constitutional compliance
npm run validate
```text

## 📚 Next Steps

1. __Read the Constitution__: Understand framework governance in `CONSTITUTION.md`
2. __Explore Examples__: Check existing Blueprints in `blueprints/`
3. __Study the Roadmap__: See planned features in `docs/roadmap/`
4. __Contribute__: Follow guidelines in `CONTRIBUTING.md`

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `npm run conductor status` shows active status
- [ ] `npm run check` reports compliance score
- [ ] `npm run validate` completes without critical errors
- [ ] `.framework/` directory exists with state files
- [ ] Constitutional drift logs are present
- [ ] All npm scripts execute without module errors

**Setup complete!__ Your Aegis Framework installation is ready for Constitutional governance and Blueprint-driven
development. 🎉
