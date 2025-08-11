# 🛡️ Constitutional Governance Enforcement Guide

> **Complete guide** for enforcing constitutional governance through automated checks and validation

## 🎯 **Overview**

The Aegis Framework uses **automated enforcement** to ensure constitutional governance compliance. This guide explains how the enforcement system works and how to use it.

## 🔧 **Enforcement Components**

### **1. Provenance Validation**
- **Script**: `tools/check-provenance.js`
- **Command**: `npm run check:provenance`
- **Purpose**: Validates file annotations and generates cryptographic hashes

#### **Requirements**
Every AI-generated file must include:
```javascript
/**
 * @aegisBlueprint: <blueprint-id>
 * @version: <semantic-version>
 * @mode: (lean|strict|generative)
 * @intent: <purpose-description>
 * @context: <context-description>
 * @model: <ai-model-used>
 * @hash: <sha256-hash>
 */
```

#### **Validation Rules**
- ✅ Blueprint ID must exist in `blueprints/<id>/blueprint.yaml`
- ✅ Version must follow semantic versioning (x.y.z)
- ✅ Mode must be one of: lean, strict, generative
- ✅ Hash must match file content (excluding hash line)

### **2. File Organization Enforcement**
- **Script**: `tools/check-paths.js`
- **Command**: `npm run check:paths`
- **Purpose**: Enforces directory boundaries and file organization

#### **Allowed Directories**
- `framework/` - Core framework code and governance
- `blueprints/` - Blueprint definitions and schemas
- `adapters/` - Framework adapters for different environments
- `tools/` - Development and governance tools
- `cli/` - Command-line interface tools
- `patterns/` - Pattern definitions and implementations
- `.aegis/` - Framework metadata and outputs
- `docs/` - Documentation
- `tests/` - Test files
- `examples/` - Example implementations
- `demo/` - Demo scripts and examples

#### **Allowed Root Files**
- Configuration files: `package.json`, `tsconfig.json`, etc.
- Documentation: `README.md`, `CHANGELOG.md`, `LICENSE`
- Framework files: `VERSION`, `CONSTITUTION.md`, `.cursorrules`

### **3. Version Synchronization**
- **Script**: `tools/check-version-sync.js`
- **Command**: `npm run check:version`
- **Purpose**: Ensures semantic versioning consistency across the project

#### **Validation Rules**
- ✅ Root version (from `VERSION` or `package.json`) is valid semver
- ✅ All `package.json` files have matching version
- ✅ All `blueprint.yaml` files have matching version
- ✅ Version references in documentation are consistent

## 🚀 **Usage**

### **Local Development**

#### **Pre-commit Checks**
```bash
# Check all governance rules
npm run check:provenance
npm run check:paths
npm run check:version

# Fix violations before committing
```

#### **Planning Optimization**
```bash
# Auto-detect plan class
npm run aegis:planning auto "Add user authentication"

# Validate plan
npm run aegis:planning validate MVP-Fix plan.json 2

# Compare plans
npm run aegis:planning compare plan1.json plan2.json
```

### **CI/CD Integration**

#### **GitHub Actions**
The framework includes automated governance checks in `.github/workflows/governance-checks.yml`:

```yaml
- name: Check provenance headers
  run: npm run check:provenance -- --ci
  
- name: Check file organization
  run: npm run check:paths -- --ci
  
- name: Check version synchronization
  run: npm run check:version -- --ci
```

#### **Pre-commit Hooks**
Add to your `.git/hooks/pre-commit`:
```bash
#!/bin/bash
npm run check:provenance -- --ci
npm run check:paths -- --ci
npm run check:version -- --ci
```

## 🎯 **Violation Resolution**

### **1. Missing Provenance Headers**

#### **Add Header to File**
```javascript
/**
 * @aegisBlueprint: planning-optimization
 * @version: 2.5.0
 * @mode: lean
 * @intent: Your file's purpose
 * @context: Context for this file
 * @model: claude-3-5-sonnet
 * @hash: <placeholder>
 */
```

#### **Generate Hash**
```bash
# The hash will be automatically generated when you run
npm run check:provenance
```

### **2. File Organization Violations**

#### **Move Files to Proper Locations**
```bash
# Move documentation
mv README-PLANNING.md docs/planning/README.md

# Move test files
mv test-plan.json .aegis/plans/test-plan.json

# Move unauthorized files
mv unauthorized-file.js tools/unauthorized-file.js
```

### **3. Version Mismatches**

#### **Update Versions**
```bash
# Update blueprint versions
sed -i 's/version: 1.0.0/version: 2.5.0/g' blueprints/*/blueprint.yaml

# Update package versions
npm version 2.5.0 --workspaces

# Update documentation references
find docs/ -name "*.md" -exec sed -i 's/1\.0\.0/2.5.0/g' {} \;
```

## 🛡️ **Governance Rules**

### **Blueprint Primacy**
- **Rule**: AI must only generate/modify files when an active blueprint exists
- **Enforcement**: `npm run validate:blueprint -- blueprints/<id>/blueprint.yaml`
- **Failure**: Missing blueprint or invalid schema

### **Provenance & Annotations**
- **Rule**: Every AI-written file includes verifiable header
- **Enforcement**: `npm run check:provenance`
- **Failure**: Missing or invalid provenance header

### **Directory Boundaries**
- **Rule**: Only write to allowed directories
- **Enforcement**: `npm run check:paths`
- **Failure**: Unauthorized file or directory

### **Execution Modes**
- **Rule**: Outputs must match active adapter mode
- **Enforcement**: Mode validation in provenance headers
- **Failure**: Invalid mode specification

### **Semantic Versioning**
- **Rule**: Use root VERSION; no manual package.json edits
- **Enforcement**: `npm run check:version`
- **Failure**: Version mismatches across project

## 🔍 **Troubleshooting**

### **Common Issues**

#### **Hash Mismatch**
```bash
# Regenerate hash by updating the header
# Remove the hash line, run check, then add the generated hash
```

#### **Blueprint Not Found**
```bash
# Create the blueprint
mkdir -p blueprints/<id>
touch blueprints/<id>/blueprint.yaml
```

#### **Unauthorized Directory**
```bash
# Move file to allowed location
mv unauthorized-file.js tools/unauthorized-file.js
```

### **Getting Help**

#### **Debug Mode**
```bash
# Run with verbose output
npm run check:provenance -- --verbose
npm run check:paths -- --verbose
npm run check:version -- --verbose
```

#### **Fix Suggestions**
The enforcement scripts provide specific suggestions for fixing violations.

## 🎯 **Best Practices**

### **1. Always Use Provenance Headers**
- Include headers in every AI-generated file
- Use accurate blueprint IDs and versions
- Generate proper hashes

### **2. Follow Directory Structure**
- Keep files in their designated locations
- Use proper naming conventions
- Avoid root-level clutter

### **3. Maintain Version Consistency**
- Update all version references together
- Use semantic versioning properly
- Document version changes

### **4. Test Before Committing**
- Run governance checks locally
- Fix violations before pushing
- Use pre-commit hooks

## 🚀 **Advanced Usage**

### **Custom Enforcement Rules**

#### **Add Custom Checks**
```javascript
// In tools/custom-enforcement.js
export class CustomEnforcer {
  async checkCustomRule(filePath) {
    // Your custom validation logic
  }
}
```

#### **Extend CI Pipeline**
```yaml
# In .github/workflows/governance-checks.yml
- name: Custom enforcement
  run: node tools/custom-enforcement.js
```

### **Integration with IDEs**

#### **Cursor Integration**
The `.cursorrules` file automatically applies governance rules in Cursor.

#### **VS Code Integration**
Use the MCP server for planning optimization tools.

## 🎉 **Success Metrics**

### **Compliance Tracking**
- **Provenance Compliance**: 100% of files have valid headers
- **Organization Compliance**: 0 unauthorized files
- **Version Compliance**: 100% version synchronization
- **Blueprint Compliance**: All files reference valid blueprints

### **Quality Indicators**
- **Zero CI Failures**: All governance checks pass
- **Fast Feedback**: Local checks complete in <30 seconds
- **Clear Violations**: Specific error messages with fixes
- **Automated Resolution**: Self-healing governance system

---

**The constitutional governance enforcement system ensures that all AI-generated code follows the framework's principles and maintains quality standards.**
