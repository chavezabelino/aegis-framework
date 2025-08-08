# 🏛️ Aegis Framework Constitution

## 📜 Preamble

This document establishes the foundational principles, governance structures, and evolutionary processes for the Aegis Framework. It serves as the supreme authority for all framework decisions, ensuring consistency, traceability, and democratic evolution of the AI-native engineering ecosystem.

## 🎯 Article I: Core Principles

### Section 1: Fundamental Values
The Aegis Framework is founded upon these immutable principles:

1. **Traceability**: Every AI-generated change must be traceable through blueprints and contracts
2. **Observability**: All framework operations must emit telemetry and be auditable
3. **Reproducibility**: Same blueprint must generate identical outputs deterministically
4. **Safety**: Production AI systems must include fallback mechanisms and error handling
5. **Semantic Versioning**: All changes follow strict semantic versioning principles

### Section 2: Blueprint Primacy
Blueprints are the supreme source of truth for all AI-generated code. No code shall be generated without a corresponding blueprint specification.

## 🏗️ Article II: Framework Governance

### Section 1: Version Authority
The current framework version is declared in:
- `VERSION` file (single source of truth)
- `framework/framework-core-v{X.Y.Z}.md` (specification document)
- All framework files via `@aegisFrameworkVersion` annotations

### Section 2: Change Classification
All framework changes shall be classified as:

#### Breaking Changes (Major Version)
- Blueprint schema modifications requiring migration
- Annotation requirement changes
- Framework file structure changes
- CLI interface breaking modifications

#### Feature Additions (Minor Version)
- New blueprint capabilities
- Additional execution modes
- Enhanced validation tools
- New adapter support

#### Improvements (Patch Version)
- Bug fixes and hotfixes
- Documentation enhancements
- Minor CLI improvements
- Validation rule refinements

### Section 3: Specification Authority
Framework specifications shall be maintained as:
- **Current Spec**: `framework/framework-core-v{current}.md`
- **Future Specs**: `framework/versions/framework-core-v{future}-spec.md`
- **Archived Specs**: `framework/versions/framework-core-v{past}.md`

## 🔄 Article III: Evolution Process

### Section 1: Feature Development Workflow
New features must follow this constitutional process:

1. **Impact Assessment**: Evaluate against 5-category framework:
   - Agent behavior impact
   - Blueprint contract changes
   - Developer workflow changes
   - Migration requirements
   - Documentation updates

2. **Version Targeting**: Assign semantic version based on change scope
3. **Specification Creation**: Document in versioned specification file
4. **Implementation Planning**: Break into phases with clear milestones
5. **Validation Requirements**: Include testing and migration strategies

### Section 2: Mandatory Annotations
All AI-generated files must include constitutional metadata:

```markdown
<!--
@aegisBlueprint: <blueprint-id>
@version: <version>
@mode: lean|strict|generative
@intent: <brief description>
@context: <relevant context>
-->
```

Framework files must include:
```markdown
<!--
@aegisFrameworkVersion: <framework-version>
@intent: <purpose of this file>
-->
```

### Section 3: Blueprint Contract Requirements
All blueprints must include:
- **Required**: `id`, `name`, `version`
- **Observability**: Event emission specifications
- **Error Handling**: Fallback state definitions
- **Validation**: Rule contracts with versioning

### Section 4: Remediation Plan Constitutional Requirements
All AI-generated or team-authored remediation plans must conform to constitutional safety standards:

#### **Mandatory Safety Mechanisms**
- **Validation Gates**: All plans must include build, test, and lint validation before any structural changes
- **Rollback Strategy**: Every phase must include tested rollback procedures with clear restoration steps
- **Dry-Run Simulation**: High-risk phases must include simulation or preview of effects before execution
- **Tool Validation**: All referenced tools must exist and be validated before plan approval
- **Constitutional Review**: Plans affecting framework structure require constitutional compliance validation

#### **Schema Compliance**
All remediation plans must conform to `RemediationPlan.schema.ts` including:
- Constitutional annotations (`@aegisFrameworkVersion`, `@intent`, `@context`, `@mode`)
- Semantic versioning for plan versions
- Measurable success criteria (minimum 3 criteria including build, test, compliance)
- Risk assessment and mitigation strategies
- CI integration requirements with preflight gates

#### **Preflight Gate Requirements**
Before any remediation plan execution:
1. **Build Validation**: `npm run build` or equivalent must pass
2. **Test Validation**: All existing tests must pass
3. **Lint Validation**: Code style and quality checks must pass
4. **Tool Existence**: All referenced tools must be verified to exist
5. **Schema Validation**: Plan must pass `validate-remediation-plan.ts` checks

#### **Enforcement Mechanisms**
- **CI Integration**: `.github/workflows/constitutional-compliance.yml` enforces validation
- **Blocking Failures**: Plans that fail constitutional validation cannot be executed
- **Tool Manifest**: `tools/manifest.json` must exist and validate all framework tools
- **Emergency Procedures**: All plans must include escalation paths and emergency contacts

## 📊 Article IV: Quality Assurance

### Section 1: Testing Requirements
- **Snapshot Tests**: Validate blueprint fidelity over time
- **Replay Tests**: Ensure deterministic output regeneration
- **Visual Regression**: Required for all public routes
- **Schema Validation**: All blueprints must pass validation

### Section 2: Documentation Standards
- **Changelog**: Structured, impact-categorized release notes
- **Migration Guides**: Clear upgrade paths for breaking changes
- **Examples**: Working blueprint demonstrations
- **Architecture**: Framework decision documentation

## 🚀 Article V: Release Process

### Section 1: Version Progression
- **Alpha**: Core feature implementation, may have breaking changes
- **Beta**: Feature-complete, API stable, production testing
- **Stable**: Production-ready, comprehensive documentation

### Section 2: Release Requirements
Before any version release:
1. All tests must pass
2. Documentation must be current
3. Migration guides must be provided for breaking changes
4. Changelog must be updated with structured entries
5. Git tags must follow semantic versioning

## 🔐 Article VI: Backward Compatibility

### Section 1: Compatibility Guarantee
- Patch versions maintain full backward compatibility
- Minor versions maintain API compatibility
- Major versions may introduce breaking changes with migration paths

### Section 2: Deprecation Process
Features marked for removal must:
1. Be deprecated for at least one minor version
2. Include clear migration documentation
3. Provide automated migration tools when possible

## 📋 Article VII: Amendment Process

### Section 1: Constitutional Changes
This constitution may only be amended through:
1. Proposal in framework specification
2. Community review and feedback
3. Formal documentation update
4. Version-controlled implementation

### Section 2: Emergency Procedures
In cases of critical security or stability issues:
1. Immediate hotfix deployment is permitted
2. Constitutional compliance review required within 48 hours
3. Retroactive documentation and process updates mandatory

## 🎨 Article VIII: Enforcement

### Section 1: Validation Tools
The framework provides constitutional enforcement through:
- `tools/validate-blueprint.ts`: Blueprint schema compliance
- `tools/validate-remediation-plan.ts`: Remediation plan constitutional compliance and safety validation
- `tools/generate-changelog.ts`: Structured changelog generation
- `tools/validate-template-quality.ts`: Template and documentation quality assurance
- `tools/validate-constitution.ts`: Constitutional principle validation
- CI/CD validation: Automated constitutional compliance checking via `.github/workflows/constitutional-compliance.yml`

### Section 2: Non-Compliance Consequences
Code that violates constitutional principles:
- Shall not be accepted into the main framework
- Must be remediated before merge approval
- May trigger emergency constitutional review

## 📝 Article IX: Template and Documentation Quality Standards

### Section 1: Template Encoding Standards
All framework templates and documentation must adhere to strict encoding principles:

1. **Plain Text Primacy**: Templates must use plain Unicode characters, not HTML entities
2. **Encoding Consistency**: No mixed encoding schemes within a single document
3. **Human Readability**: Generated output must be human-readable without decoding
4. **Platform Agnostic**: Templates must render consistently across all target platforms

### Section 2: Template Quality Requirements
All EJS templates and markdown documents must:

#### Encoding Compliance
- Use plain Unicode characters: `'`, `"`, `—`, `–` instead of HTML entities
- Avoid double-encoding through template engines
- Maintain consistent character encoding throughout the document
- Pass automated encoding validation before merge

#### Structural Integrity
- Follow semantic markdown structure with proper heading hierarchy
- Use consistent formatting patterns across all templates
- Include required constitutional annotations in template headers
- Validate against target output schemas

#### Output Validation
- Generated files must match reference targets character-for-character
- No encoding artifacts or malformed entities permitted
- Diff validation must pass with zero tolerance for encoding discrepancies
- Section-by-section validation required for complex templates

### Section 3: Documentation Development Standards
Framework documentation development must follow:

#### Template Development Workflow
1. **Plain Text First**: Write templates using plain Unicode characters
2. **Validation Early**: Run encoding validation during development
3. **Reference Matching**: Compare against established reference targets
4. **Peer Review**: Multi-agent validation of template outputs

#### Quality Gates
- All templates pass `tools/validate-template-quality.ts` before merge
- Generated outputs validated against reference targets
- No HTML entity artifacts in production documentation
- Consistent rendering across GitHub, VS Code, and other platforms

### Section 4: Automated Quality Enforcement
The framework provides template quality enforcement through:

#### Validation Tools
- `tools/validate-template-quality.ts`: Comprehensive template and encoding validation
- `tools/validate-output-fidelity.ts`: Generated output quality assurance
- Pre-commit hooks: Automated template quality checking
- CI/CD integration: Template quality gates in deployment pipeline

#### Quality Metrics
- **Encoding Compliance Score**: 100% plain text character usage
- **Output Fidelity Score**: Character-perfect match against reference targets  
- **Structural Integrity Score**: Proper markdown hierarchy and formatting
- **Cross-Platform Consistency Score**: Identical rendering across platforms

#### Violation Response
Template quality violations trigger:
1. Immediate CI/CD failure with detailed violation report
2. Automated suggestion of plain text alternatives for HTML entities
3. Template development workflow enforcement
4. Constitutional compliance review for repeated violations

---

## 📅 Ratification

This constitution was ratified on August 5, 2025, with the adoption of Aegis Framework v2.4.0-alpha.

**Constitutional Authority**: `framework/framework-core-v1.0.0-alpha.md`  
**Governance Model**: Semantic versioning with structured evolution  
**Enforcement**: Automated validation and community review

> *"We establish this constitution to ensure that AI-generated systems remain safe, reliable, and replayable — with fidelity."*

---

## 🔄 Article X: Field-Driven Evolution Documentation

### Section 1: Evolution Story Requirements
All framework evolution driven by real-world usage must be systematically documented using standardized Evolution Stories to preserve intellectual journey and enable pattern recognition.

#### **Mandatory Documentation Triggers**
- **Field Usage Gaps**: When real-world usage exposes framework limitations
- **User Questions**: When user inquiries reveal systematic issues
- **Constitutional Violations**: When framework principles are inadvertently violated
- **Migration Challenges**: When adoption processes reveal friction points

#### **Evolution Story Schema**
All evolution stories must follow the standardized format:
- **Metadata**: ID, trigger type, impact level, participants, artifacts
- **Field Context**: Real-world scenario, user workflow, expectation vs reality
- **Gap Analysis**: Trigger moment, framework limitation, impact assessment
- **Solution Design**: Enhancement proposal, implementation strategy
- **Meta-Learning**: Patterns identified, preventive measures, future implications

### Section 2: Constitutional Integration
Evolution stories become part of framework constitutional history and intellectual property:

#### **Governance Requirements**
- Stories affecting constitutional principles require governance review
- All constitutional amendments must reference originating evolution story
- Meta-patterns analyzed for systematic framework improvements

#### **Knowledge Preservation**
- Evolution stories linked to specific commits and releases
- Decision context preserved for future maintainers
- Institutional knowledge base maintained for framework development

### Section 3: Meta-Learning Objectives
The evolution documentation system enables:

#### **Pattern Recognition**
- Identification of recurring themes in field-driven evolution
- Recognition of systematic gaps before they impact users
- Development of predictive frameworks for common evolution patterns

#### **Framework Maturation**
- Tracking evolution from reactive to proactive development
- Measurement of reduction in field-driven constitutional amendments
- Documentation of progression toward comprehensive coverage

#### **Industry Leadership**
- Establishment of new standards for AI framework development
- Sharing of meta-learning with broader community
- Influence on industry best practices for constitutional AI governance

### Section 4: Implementation Standards
Evolution documentation must be:

#### **Comprehensive**
- 100% of constitutional changes have evolution stories
- All major features include field-driven insight capture
- Meta-patterns documented and validated

#### **Actionable**
- Tool integration with CI/CD pipeline for automatic linking
- Search and analysis capabilities for pattern recognition
- Community involvement in evolution insight contribution

#### **Constitutional**
- Evolution stories required for all constitutional amendments
- Governance review process for major framework changes
- Audit trail maintenance for all framework decision-making

**First Evolution Story**: EVS-2025-08-06-001 (Remediation Plan Constitutional Safeguards)  
**Ratification Date**: August 6, 2025
