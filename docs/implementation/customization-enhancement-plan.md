<!--
@aegisFrameworkVersion: 2.4.0
@intent: Design plan for enhanced team customization capabilities
@context: Addresses engineering team adoption needs for framework instruction customization
-->

# 🎨 Framework Customization Enhancement Plan

## 📋 **Executive Summary**

Engineering teams adopting Aegis Framework need flexible customization without breaking constitutional compliance. This plan outlines enhanced tooling to support section-level overrides, appending, and partial customization while maintaining framework integrity.

## 🎯 **Customization Requirements**

### **Team Adoption Scenarios**
1. **Enterprise Override**: Replace all framework sections with company-specific standards
2. **Selective Override**: Replace specific sections (e.g., code patterns) while keeping constitutional compliance
3. **Append Mode**: Add custom sections to framework-generated instructions
4. **Hybrid Mode**: Mix framework sections with custom overrides and additions

## 🏗️ **Proposed Architecture**

### **1. Enhanced CLI with Customization Modes**

```bash
# Current (basic override)
node cli/generate-agent-instructions-v2.cjs github-copilot --project-profile my-standards.md

# Proposed (granular customization)
node cli/generate-agent-instructions-v2.cjs github-copilot \
  --override sections=code-patterns,decision-matrix \
  --override-path overrides/ \
  --append custom-sections/ \
  --merge-strategy selective \
  --output custom-github-copilot-ready.md
```

### **2. Customization Configuration File**

```yaml
# .aegis-customization.yaml
customization:
  mode: selective  # full | selective | append | hybrid
  
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
      - constitutional
      - framework-context
      - blueprint-compliance
    
  validation:
    enforce_constitutional: true
    require_annotations: true
    custom_validation: ./validation/custom-rules.js
```

### **3. Section Override Structure**

```
/project-root/
├── .aegis-customization.yaml
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
```

## 🔧 **Implementation Strategy**

### **Phase 1: Section-Level Override Support**

#### **Enhanced Generator Logic**
```javascript
function generateWithCustomization(agentId, customizationConfig) {
  const baseProfile = loadAgentProfile(agentId);
  const baseSections = renderSections(baseProfile);
  
  // Apply overrides
  if (customizationConfig.overrides?.sections) {
    for (const [sectionName, overridePath] of Object.entries(customizationConfig.overrides.sections)) {
      if (isOverrideAllowed(sectionName, customizationConfig.preserve.mandatory)) {
        baseSections[sectionName] = renderCustomSection(overridePath, baseProfile);
      } else {
        console.warn(`⚠️ Cannot override mandatory section: ${sectionName}`);
      }
    }
  }
  
  // Add custom sections
  const customSections = {};
  if (customizationConfig.append?.sections) {
    for (const [sectionName, templatePath] of Object.entries(customizationConfig.append.sections)) {
      customSections[sectionName] = renderCustomSection(templatePath, baseProfile);
    }
  }
  
  return { baseSections, customSections };
}
```

#### **Constitutional Protection**
```javascript
const PROTECTED_SECTIONS = [
  'constitutional',
  'framework-context', 
  'blueprint-compliance'
];

function isOverrideAllowed(sectionName, mandatorySections = []) {
  return !PROTECTED_SECTIONS.includes(sectionName) && !mandatorySections.includes(sectionName);
}
```

### **Phase 2: Enhanced Template Engine**

#### **Custom Section Template Structure**
```markdown
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
```

### Data Protection
- PII handling requirements
- Encryption standards
- Audit logging
```

#### **Template Validation**
```javascript
function validateCustomTemplate(templatePath, config) {
  const template = fs.readFileSync(templatePath, 'utf8');
  
  // Check constitutional annotations
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
```

### **Phase 3: Merge Strategy Engine**

#### **Selective Merge Logic**
```javascript
function mergeInstructions(baseSections, customSections, strategy) {
  switch (strategy) {
    case 'selective':
      return { ...baseSections, ...customSections };
    
    case 'append':
      return {
        ...baseSections,
        customSections: Object.values(customSections).join('\n\n---\n\n')
      };
    
    case 'hybrid':
      return {
        ...baseSections,
        ...customSections,
        frameworkNotice: generateFrameworkNotice(baseSections, customSections)
      };
  }
}
```

## 📊 **Constitutional Compliance**

### **Mandatory Requirements**
1. **Protected Sections**: Constitutional, framework-context, blueprint-compliance cannot be overridden
2. **Annotation Requirements**: All custom sections must include proper annotations
3. **Version Tracking**: Custom sections must declare framework version compatibility
4. **Validation Gates**: Custom sections must pass constitutional validation

### **Validation Integration**
```bash
# Enhanced validation with custom sections
node tools/validate-template-quality.cjs --include-custom --config .aegis-customization.yaml

# Constitutional compliance check with overrides
node tools/validate-constitution.cjs --custom-sections overrides/ custom-sections/
```

## 🧪 **Usage Examples**

### **Example 1: Enterprise Code Standards Override**
```yaml
# .aegis-customization.yaml
customization:
  mode: selective
  overrides:
    sections:
      code-patterns: ./overrides/enterprise-patterns.template.md
      decision-matrix: ./overrides/enterprise-decision-matrix.template.md
  validation:
    enforce_constitutional: true
```

### **Example 2: Startup Append Mode**
```yaml
# .aegis-customization.yaml  
customization:
  mode: append
  append:
    sections:
      startup-velocity: ./custom/rapid-development.template.md
      tool-stack: ./custom/modern-tooling.template.md
```

### **Example 3: Hybrid Consulting Firm**
```yaml
# .aegis-customization.yaml
customization:
  mode: hybrid
  overrides:
    sections:
      code-patterns: ./overrides/multi-client-patterns.template.md
  append:
    sections:
      client-compliance: ./custom/sox-compliance.template.md
      billing-integration: ./custom/time-tracking.template.md
```

## ✅ **Implementation Timeline**

### **v1.5.0 - Section Override Support**
- Basic section-level override capability
- Constitutional protection for mandatory sections
- Enhanced CLI with override flags
- Validation integration for custom sections

### **v1.6.0 - Append & Merge Modes**
- Custom section append capability
- Multiple merge strategies
- Customization configuration file support
- Enhanced template validation

### **v1.7.0 - Advanced Features**
- Conditional section rendering
- Template inheritance and extension
- Visual diff for customized instructions
- Team collaboration features

## 🔍 **Validation & Quality Assurance**

### **Custom Section Quality Gates**
1. **Constitutional Annotation**: Required framework version and custom markers
2. **Template Syntax**: Valid EJS template structure
3. **Content Quality**: No HTML entity contamination (Article IX compliance)
4. **Integration Testing**: Custom sections must not break instruction generation

### **Team Adoption Testing**
- Test with real engineering team scenarios
- Validate enterprise customization workflows
- Ensure constitutional compliance across all customization modes
- Performance testing with large custom section libraries

---

## 🎯 **Business Value**

### **For Framework Adopters**
- **Flexibility**: Customize instructions without losing framework benefits
- **Adoption Speed**: Easier migration from existing standards
- **Team Ownership**: Maintain team-specific patterns while gaining framework governance

### **For Framework Maintainers**
- **Wider Adoption**: Lower barrier to entry for teams with existing standards
- **Feedback Loop**: Learn from team customizations to improve core framework
- **Enterprise Readiness**: Meet enterprise customization requirements

---

**Status**: Design Complete - Ready for Implementation
**Priority**: High - Critical for framework adoption
**Dependencies**: v1.4.0 template quality improvements
