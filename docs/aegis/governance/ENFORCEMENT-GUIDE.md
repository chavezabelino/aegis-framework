# 🛡️ Constitutional Governance Enforcement Guide

> __Complete guide__ for enforcing Constitutional governance through automated checks and validation

## 🎯 __Overview**

The Aegis Framework uses __automated enforcement__ to ensure Constitutional governance compliance. This guide explains
how the enforcement system works and how to use it.

## 🔧 __Enforcement Components**

### __1. Provenance Validation**

- __Script__: `tools/check-provenance.js`
- __Command__: `npm run check:provenance`
- __Purpose__: Validates file annotations and generates cryptographic hashes

#### __Requirements**

Every AI-generated file must include:

```javascript
/**
 * @aegisBlueprint: <Blueprint-id>
 * @version: <semantic-version>
 * @mode: (lean|strict|generative)
 * @intent: <purpose-description>
 * @context: <context-description>
 * @model: <ai-model-used>
 * @hash: <SHA256-hash>
 */
```text

#### __Validation Rules**

- ✅ Blueprint ID must exist in `blueprints/<id>/Blueprint.YAML`
- ✅ Version must follow semantic versioning (x.y.z)
- ✅ Mode must be one of: lean, strict, generative
- ✅ Hash must match file content (excluding hash line)

### __2. File Organization Enforcement**

- __Script__: `tools/check-paths.js`
- __Command__: `npm run check:paths`
- __Purpose__: Enforces directory boundaries and file organization

#### __Allowed Directories**

- `framework/` - Core framework code and governance
- `blueprints/` - Blueprint definitions and schemas
- `adapters/` - Framework adapters for different environments
- `tools/` - Development and governance tools
- `CLI/` - Command-line interface tools
- `patterns/` - Pattern definitions and implementations
- `.Aegis/` - Framework metadata and outputs
- `docs/` - Documentation
- `tests/` - Test files
- `examples/` - Example implementations
- `demo/` - Demo scripts and examples

#### __Allowed Root Files**

- Configuration files: `package.JSON`, `tsconfig.JSON`, etc.
- Documentation: `README.md`, `CHANGELOG.md`, `LICENSE`
- Framework files: `VERSION`, `CONSTITUTION.md`, `.cursorrules`

### __3. Version Synchronization**

- __Script__: `tools/check-version-sync.js`
- __Command__: `npm run check:version`
- __Purpose__: Ensures semantic versioning consistency across the project

#### __Validation Rules**

- ✅ Root version (from `VERSION` or `package.JSON`) is valid semver
- ✅ All `package.JSON` files have matching version
- ✅ All `Blueprint.YAML` files have matching version
- ✅ Version references in documentation are consistent

## 🚀 __Usage**

### __Local Development**

#### __Pre-commit Checks**

```bash
# Check all governance rules
npm run check:provenance
npm run check:paths
npm run check:version

# Fix violations before committing
```text

#### __Planning Optimization**

```bash
# Auto-detect plan class
npm run Aegis:planning auto "Add user authentication"

# Validate plan
npm run Aegis:planning validate MVP-Fix plan.JSON 2

# Compare plans
npm run Aegis:planning compare plan1.JSON plan2.JSON
```text

### __CI/CD Integration**

#### __GitHub Actions**

The framework includes automated governance checks in `.GitHub/workflows/governance-checks.yml`:

```yaml
- name: Check provenance headers
  run: npm run check:provenance -- --ci

- name: Check file organization
  run: npm run check:paths -- --ci

- name: Check version synchronization
  run: npm run check:version -- --ci
```text

#### __Pre-commit Hooks**

Add to your `.git/hooks/pre-commit`:

```bash
#!/bin/bash
npm run check:provenance -- --ci
npm run check:paths -- --ci
npm run check:version -- --ci
```text

## 🎯 __Violation Resolution**

### __1. Missing Provenance Headers**

#### __Add Header to File**

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
```text

#### __Generate Hash**

```bash
# The hash will be automatically generated when you run
npm run check:provenance
```text

### __2. File Organization Violations**

#### __Move Files to Proper Locations**

```bash
# Move documentation
mv README-PLANNING.md docs/planning/README.md

# Move test files
mv test-plan.JSON .Aegis/plans/test-plan.JSON

# Move unauthorized files
mv unauthorized-file.js tools/unauthorized-file.js
```text

### __3. Version Mismatches**

#### __Update Versions**

```bash
# Update Blueprint versions
sed -i 's/version: 1.0.0/version: 2.5.0/g' blueprints/*/Blueprint.YAML

# Update package versions
npm version 2.5.0 --workspaces

# Update documentation references
find docs/ -name "*.md" -exec sed -i 's/1\.0\.0/2.5.0/g' {} \;
```text

## 🛡️ __Governance Rules**

### __Blueprint Primacy**

- __Rule__: AI must only generate/modify files when an active Blueprint exists
- __Enforcement__: `npm run validate:Blueprint -- blueprints/<id>/Blueprint.YAML`
- __Failure__: Missing Blueprint or invalid schema

### __Provenance & Annotations**

- __Rule__: Every AI-written file includes verifiable header
- __Enforcement__: `npm run check:provenance`
- __Failure__: Missing or invalid provenance header

### __Directory Boundaries**

- __Rule__: Only write to allowed directories
- __Enforcement__: `npm run check:paths`
- __Failure__: Unauthorized file or directory

### __Execution Modes**

- __Rule__: Outputs must match active adapter mode
- __Enforcement__: Mode validation in provenance headers
- __Failure__: Invalid mode specification

### __Semantic Versioning**

- __Rule__: Use root VERSION; no manual package.JSON edits
- __Enforcement__: `npm run check:version`
- __Failure__: Version mismatches across project

## 🔍 __Troubleshooting**

### __Common Issues**

#### __Hash Mismatch**

```bash
# Regenerate hash by updating the header
# Remove the hash line, run check, then add the generated hash
```text

#### __Blueprint Not Found**

```bash
# Create the Blueprint
mkdir -p blueprints/<id>
touch blueprints/<id>/Blueprint.YAML
```text

#### __Unauthorized Directory**

```bash
# Move file to allowed location
mv unauthorized-file.js tools/unauthorized-file.js
```text

### __Getting Help**

#### __Debug Mode**

```bash
# Run with verbose output
npm run check:provenance -- --verbose
npm run check:paths -- --verbose
npm run check:version -- --verbose
```text

#### __Fix Suggestions**

The enforcement scripts provide specific suggestions for fixing violations.

## 🎯 __Best Practices**

### __1. Always Use Provenance Headers**

- Include headers in every AI-generated file
- Use accurate Blueprint IDs and versions
- Generate proper hashes

### __2. Follow Directory Structure**

- Keep files in their designated locations
- Use proper naming conventions
- Avoid root-level clutter

### __3. Maintain Version Consistency**

- Update all version references together
- Use semantic versioning properly
- Document version changes

### __4. Test Before Committing**

- Run governance checks locally
- Fix violations before pushing
- Use pre-commit hooks

## 🚀 __Advanced Usage**

### __Custom Enforcement Rules**

#### __Add Custom Checks**

```javascript
// In tools/custom-enforcement.js
export class CustomEnforcer {
  async checkCustomRule(filePath) {
    // Your custom validation logic
  }
}
```text

#### __Extend CI Pipeline**

```yaml
# In .GitHub/workflows/governance-checks.yml
- name: Custom enforcement
  run: node tools/custom-enforcement.js
```text

### __Integration with IDEs**

#### __Cursor Integration**

The `.cursorrules` file automatically applies governance rules in Cursor.

#### __VS Code Integration**

Use the MCP server for planning optimization tools.

## 🎉 __Success Metrics**

### __Compliance Tracking**

- __Provenance Compliance__: 100% of files have valid headers
- __Organization Compliance__: 0 unauthorized files
- __Version Compliance__: 100% version synchronization
- __Blueprint Compliance__: All files reference valid Blueprints

### __Quality Indicators**

- __Zero CI Failures__: All governance checks pass
- __Fast Feedback__: Local checks complete in <30 seconds
- __Clear Violations__: Specific error messages with fixes
- __Automated Resolution__: Self-healing governance system

---

**The Constitutional governance enforcement system ensures that all AI-generated code follows the framework's principles
and maintains quality standards.**
