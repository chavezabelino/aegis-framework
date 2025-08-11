# New Feature Development Workflow

## 🎯 When You Want to Add a New Feature

Following semantic versioning principles, here's how to properly develop new features:

### 1. **Determine Version Impact**

Ask yourself:

- **Is this a breaking change?** → Major version (2.0.0)
- **Does this add new functionality?** → Minor version (1.1.0)
- **Is this a bug fix or small improvement?** → Patch version (1.0.1)

### 2. **Create Feature Specification**

Instead of informal drafts, create structured specifications:

```
# For a new minor version feature
touch framework/versions/framework-core-v2.4.0-beta-spec.md
```

**Specification Template:**

```
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

- **Agents**: [How this affects AI agents]
- **Blueprints**: [Schema or contract changes]
- **Users**: [Developer workflow changes]
- **Migration**: [Required manual updates]
- **Documentation**: [What docs need updating]
```

### 3. **Implementation Strategy**

For v1.1.0-beta multi-agent features:

```
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
```

### 4. **Testing & Validation**

```
# Create test blueprints for new features
mkdir blueprints/test-multi-agent/
echo "id: test-multi-agent" > blueprints/test-multi-agent/Blueprint.YAML

# Validate new schema
node tools/validate-Blueprint.ts blueprints/test-multi-agent/Blueprint.YAML

# Generate changelog entry
./tools/generate-changelog.sh 1.1.0-beta "Multi-agent orchestration support"
```

### 5. **Release Process**

```
# Update version file
echo "1.1.0-beta" > VERSION

# Update framework core
mv framework/framework-core-v1.0.0-alpha.md framework/versions/
cp framework/versions/framework-core-v1.1.0-beta-spec.md framework/framework-core-v1.1.0-beta.md

# Create git tag
git tag v1.1.0-beta
git push origin v1.1.0-beta
```

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

1. **Specifications before Implementation**: Write detailed specs before coding
2. **Semantic Version Targeting**: Assign features to appropriate version levels
3. **Impact Assessment**: Always evaluate the 5-category impact framework
4. **Migration Planning**: Provide clear upgrade paths for breaking changes
5. **Backward Compatibility**: Maintain compatibility when possible

This approach ensures that every new feature has a clear home in our versioning strategy and follows our framework
evolution principles.
