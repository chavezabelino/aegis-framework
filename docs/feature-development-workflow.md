# New Feature Development Workflow

## 🎯 When You Want to Add a New Feature

Following semantic versioning principles, here's how to properly develop new features:

### 1. __Determine Version Impact**

Ask yourself:

- __Is this a breaking change?__ → Major version (2.0.0)
- __Does this add new functionality?__ → Minor version (1.1.0)
- __Is this a bug fix or small improvement?__ → Patch version (1.0.1)

### 2. __Create Feature Specification**

Instead of informal drafts, create structured specifications:

```bash
# For a new minor version feature
touch framework/versions/framework-core-v2.4.0-beta-spec.md
```text

**Specification Template:**

```markdown
<!--
@aegisFrameworkVersion: 1.1.0-beta
@intent: [Brief description of feature set]
@context: [Why these features are needed]
-->

# ⚙️ Aegis Framework v1.1.0-beta (Specification)

## 🎯 Feature Overview

[High-level description]

## 🔧 New Capabilities

[Detailed feature descriptions with examples]

## 🚀 Migration Path from v1.0.x

[How to upgrade existing projects]

## 📊 Impact Assessment

- __Agents__: [How this affects AI agents]
- __Blueprints__: [Schema or contract changes]
- __Users__: [Developer workflow changes]
- __Migration__: [Required manual updates]
- __Documentation__: [What docs need updating]
```text

### 3. __Implementation Strategy**

For v1.1.0-beta multi-agent features:

```bash
# Phase 1: Core infrastructure
- Update Blueprint schema for agent coordination
- Implement agent capability discovery
- Create basic handoff mechanisms

# Phase 2: Advanced features
- MCP metadata integration
- Drift logging system
- Enhanced adapter interfaces

# Phase 3: Validation & tooling
- Update CLI for multi-agent workflows
- Enhance testing framework
- Create migration guides
```text

### 4. __Testing & Validation**

```bash
# Create test blueprints for new features
mkdir blueprints/test-multi-agent/
echo "id: test-multi-agent" > blueprints/test-multi-agent/Blueprint.YAML

# Validate new schema
node tools/validate-Blueprint.ts blueprints/test-multi-agent/Blueprint.YAML

# Generate changelog entry
./tools/generate-changelog.sh 1.1.0-beta "Multi-agent orchestration support"
```text

### 5. __Release Process**

```bash
# Update version file
echo "1.1.0-beta" > VERSION

# Update framework core
mv framework/framework-core-v1.0.0-alpha.md framework/versions/
cp framework/versions/framework-core-v1.1.0-beta-spec.md framework/framework-core-v1.1.0-beta.md

# Create git tag
git tag v1.1.0-beta
git push origin v1.1.0-beta
```text

## 🔄 Example: Converting v4.7 Draft to v1.1.0-beta

**What we did:**

1. ✅ Archived the v4.7 draft with migration notes
2. ✅ Created comprehensive v1.1.0-beta specification
3. ✅ Updated roadmap and evolution strategy
4. ✅ Maintained backward compatibility plan

**What this gives us:**

- Clear feature targeting (v1.1.0-beta gets multi-agent support)
- Proper semantic versioning progression
- Detailed migration guidance
- Structured implementation plan

## 🎯 Key Principles

1. __Specifications before Implementation__: Write detailed specs before coding
2. __Semantic Version Targeting__: Assign features to appropriate version levels
3. __Impact Assessment__: Always evaluate the 5-category impact framework
4. __Migration Planning__: Provide clear upgrade paths for breaking changes
5. __Backward Compatibility__: Maintain compatibility when possible

This approach ensures that every new feature has a clear home in our versioning strategy and follows our framework
evolution principles.
