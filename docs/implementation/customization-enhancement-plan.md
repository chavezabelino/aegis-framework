<!--
# 🎨 Framework Customization Enhancement Plan

@aegisFrameworkVersion: 2.4.0
@intent: Design plan for enhanced team customization capabilities
@context: Addresses engineering team adoption needs for framework instruction customization
-->

# 🎨 Framework Customization Enhancement Plan

## 📋 __Executive Summary**

Engineering teams adopting Aegis Framework need flexible customization without breaking Constitutional compliance. This
plan outlines enhanced tooling to support section-level overrides, appending, and partial customization while
maintaining framework integrity.

## 🎯 __Customization Requirements**

### __Team Adoption Scenarios**

1. __Enterprise Override__: Replace all framework sections with company-specific standards
2. __Selective Override__: Replace specific sections (e.g., code patterns) while keeping Constitutional compliance
3. __Append Mode__: Add custom sections to framework-generated instructions
4. __Hybrid Mode__: Mix framework sections with custom overrides and additions

## 🏗️ __Proposed Architecture**

### __1. Enhanced CLI with Customization Modes**

```bash
# Current (basic override)
node CLI/generate-agent-instructions-v2.cjs GitHub-copilot --project-profile my-standards.md

# Proposed (granular customization)
node CLI/generate-agent-instructions-v2.cjs GitHub-copilot \
  --override sections=code-patterns,decision-matrix \
  --override-path overrides/ \
  --append custom-sections/ \
  --merge-strategy selective \
  --output custom-GitHub-copilot-ready.md
```text

### __2. Customization Configuration File**

```yaml
# .Aegis-customization.YAML
customization:
  mode: selective # full | selective | append | hybrid

  overrides:
    sections:
      - code-patterns: ./overrides/company-code-patterns.template.md
      - decision-matrix: ./overrides/enterprise-decision-matrix.template.md

  append:
    sections:
      - company-security: ./custom/security-standards.template.md
      - deployment-patterns: ./custom/deployment-guide.template.md

  preserve:
    mandatory:
      - Constitutional
      - framework-context
      - Blueprint-compliance

  validation:
    enforce_constitutional: true
    require_annotations: true
    custom_validation: ./validation/custom-rules.js
```text

### __3. Section Override Structure**

```text
/project-root/
├── .Aegis-customization.YAML
├── overrides/
│   ├── code-patterns.template.md
│   ├── decision-matrix.template.md
│   └── agent-profile.template.md
├── custom-sections/
│   ├── company-security.template.md
│   ├── deployment-patterns.template.md
│   └── tool-integration.template.md
└── validation/
    └── custom-rules.js
```text

## 🔧 __Implementation Strategy**

### __Phase 1: Section-Level Override Support**

#### __Enhanced Generator Logic**

```javascript
function generateWithCustomization(agentId, customizationConfig) {
  const baseProfile = loadAgentProfile(agentId)
  const baseSections = renderSections(baseProfile)

  // Apply overrides
  if (customizationConfig.overrides?.sections) {
    for (const [sectionName, overridePath] of Object.entries(customizationConfig.overrides.sections)) {
      if (isOverrideAllowed(sectionName, customizationConfig.preserve.mandatory)) {
        baseSections[sectionName] = renderCustomSection(overridePath, baseProfile)
      } else {
        console.warn(`⚠️ Cannot override mandatory section: ${sectionName}`)
      }
    }
  }

  // Add custom sections
  const customSections = {}
  if (customizationConfig.append?.sections) {
    for (const [sectionName, templatePath] of Object.entries(customizationConfig.append.sections)) {
      customSections[sectionName] = renderCustomSection(templatePath, baseProfile)
    }
  }

  return {baseSections, customSections}
}
```text

#### __Constitutional Protection**

```javascript
const PROTECTED_SECTIONS = ["Constitutional", "framework-context", "Blueprint-compliance"]

function isOverrideAllowed(sectionName, mandatorySections = []) {
  return !PROTECTED_SECTIONS.includes(sectionName) && !mandatorySections.includes(sectionName)
}
```text

### __Phase 2: Enhanced Template Engine**

#### __Custom Section Template Structure**

````markdown
<!--
@aegisFrameworkVersion: <%= frameworkVersion %>
@customSection: true
@owner: company-name
@intent: Company-specific security standards
@extends: framework-section-base
-->

## 🔒 Company Security Standards

### Authentication Patterns

```ts
// Company-specific auth patterns
```text
````

### Data Protection

- PII handling requirements
- Encryption standards
- Audit logging

````

#### __Template Validation**
```JavaScript
function validateCustomTemplate(templatePath, config) {
  const template = fs.readFileSync(templatePath, 'utf8');

  // Check Constitutional annotations
  if (!template.includes('@aegisFrameworkVersion')) {
    throw new Error('Custom template missing @aegisFrameworkVersion annotation');
  }

  // Check custom section marker
  if (!template.includes('@customSection: true')) {
    throw new Error('Custom template missing @customSection annotation');
  }

  // Run custom validation if provided
  if (config.validation?.custom_validation) {
    return runCustomValidation(template, config.validation.custom_validation);
  }

  return { valid: true };
}
````

### __Phase 3: Merge Strategy Engine**

#### __Selective Merge Logic**

```javascript
function mergeInstructions(baseSections, customSections, strategy) {
  switch (strategy) {
    case "selective":
      return {...baseSections, ...customSections}

    case "append":
      return {
        ...baseSections,
        customSections: Object.values(customSections).join("\n\n---\n\n")
      }

    case "hybrid":
      return {
        ...baseSections,
        ...customSections,
        frameworkNotice: generateFrameworkNotice(baseSections, customSections)
      }
  }
}
```text

## 📊 __Constitutional Compliance**

### __Mandatory Requirements**

1. __Protected Sections__: Constitutional, framework-context, Blueprint-compliance cannot be overridden
2. __Annotation Requirements__: All custom sections must include proper annotations
3. __Version Tracking__: Custom sections must declare framework version compatibility
4. __Validation Gates__: Custom sections must pass Constitutional validation

### __Validation Integration**

```bash
# Enhanced validation with custom sections
node tools/validate-template-quality.cjs --include-custom --config .Aegis-customization.YAML

# ConstitutionalConstitutional compliance check with overrides
node tools/validate-constitution.cjs --custom-sections overrides/ custom-sections/
```text

## 🧪 __Usage Examples**

### __Example 1: Enterprise Code Standards Override**

```yaml
# .Aegis-customization.YAML
customization:
  mode: selective
  overrides:
    sections:
      code-patterns: ./overrides/enterprise-patterns.template.md
      decision-matrix: ./overrides/enterprise-decision-matrix.template.md
  validation:
    enforce_constitutional: true
```text

### __Example 2: Startup Append Mode**

```yaml
# .Aegis-customization.YAML
customization:
  mode: append
  append:
    sections:
      startup-velocity: ./custom/rapid-development.template.md
      tool-stack: ./custom/modern-tooling.template.md
```text

### __Example 3: Hybrid Consulting Firm**

```yaml
# .Aegis-customization.YAML
customization:
  mode: hybrid
  overrides:
    sections:
      code-patterns: ./overrides/multi-client-patterns.template.md
  append:
    sections:
      client-compliance: ./custom/sox-compliance.template.md
      billing-integration: ./custom/time-tracking.template.md
```text

## ✅ __Implementation Timeline**

### __v1.5.0 - Section Override Support**

- Basic section-level override capability
- Constitutional protection for mandatory sections
- Enhanced CLI with override flags
- Validation integration for custom sections

### __v1.6.0 - Append & Merge Modes**

- Custom section append capability
- Multiple merge strategies
- Customization configuration file support
- Enhanced template validation

### __v1.7.0 - Advanced Features**

- Conditional section rendering
- Template inheritance and extension
- Visual diff for customized instructions
- Team collaboration features

## 🔍 __Validation & Quality Assurance**

### __Custom Section Quality Gates**

1. __Constitutional Annotation__: Required framework version and custom markers
2. __Template Syntax__: Valid EJS template structure
3. __Content Quality__: No HTML entity contamination (Article IX compliance)
4. __Integration Testing__: Custom sections must not break instruction generation

### __Team Adoption Testing**

- Test with real engineering team scenarios
- Validate enterprise customization workflows
- Ensure Constitutional compliance across all customization modes
- Performance testing with large custom section libraries

---

## 🎯 __Business Value**

### __For Framework Adopters**

- __Flexibility__: Customize instructions without losing framework benefits
- __Adoption Speed__: Easier migration from existing standards
- __Team Ownership__: Maintain team-specific patterns while gaining framework governance

### __For Framework Maintainers**

- __Wider Adoption__: Lower barrier to entry for teams with existing standards
- __Feedback Loop__: Learn from team customizations to improve core framework
- __Enterprise Readiness__: Meet enterprise customization requirements

---

**Status__: Design Complete - Ready for Implementation __Priority__: High - Critical for framework adoption
**Dependencies__: v1.4.0 template quality improvements
