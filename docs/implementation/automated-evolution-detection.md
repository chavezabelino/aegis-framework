<!--
# 🔍 Automated Evolution Story Detection

@aegisFrameworkVersion: 2.4.0-alpha-dev
@intent: Documentation for automated evolution story detection system
@context: Complete the meta-learning loop by automating detection of evolution documentation needs
-->

# 🔍 Automated Evolution Story Detection

## Overview

The Aegis Framework now includes an __automated detection system__ that identifies when evolution stories should be
documented. This closes the meta-learning loop by proactively identifying field-driven insights that require
ConstitutionalConstitutional documentation.

## 🎯 What It Detects

### __Automatic Triggers**

- ✅ __Constitutional violations__ without associated evolution stories
- ✅ __Validation failures__ indicating framework gaps
- ✅ __Migration friction__ from recent changes
- ✅ __AI quality gaps__ in generated content

### __Pattern Recognition**

- 🔍 __User question patterns__ in documentation and commits
- 🔍 __Common failure patterns__ across validation systems
- 🔍 __Documentation drift__ from field usage
- 🔍 __Tool manifest violations__ indicating missing capabilities

## 🛠️ Usage

### __CLI Commands**

```bash
# Detect evolution story triggers
npm run detect-evolution

# Alternative direct call
node CLI/detect-evolution-stories.cjs

# Generate evolution story interactively
npm run evolution-story

# Alternative direct call
node CLI/generate-evolution-story.cjs
```text

### __Automatic Integration**

The detection system runs automatically in:

- __CI/CD Pipeline__: On every pull request
- __Git Hooks__: Pre-commit validation (when configured)
- __Manual Validation__: Via npm scripts

## 🤖 Auto-Generation

### __Critical Triggers**

For high-severity triggers (like Constitutional violations), the system:

1. __Automatically generates__ placeholder evolution stories
2. __Creates structured templates__ with detected evidence
3. __Flags for human review__ and completion
4. __Links to specific commits__ and changes

### __Manual Triggers**

For medium/low-severity triggers, the system:

1. __Suggests__ evolution story creation
2. __Provides evidence__ and suggested titles
3. __Guides users__ to the interactive CLI tool
4. __Tracks patterns__ for future automation

## 📊 Detection Categories

### __Constitutional Violations__ 🚨

- __Severity__: Critical
- __Auto-Generate__: Yes
- __Evidence__: Commits with Constitutional changes lacking evolution stories
- __Example__: Framework spec changes without documentation

### __Validation Failures__ ⚠️

- __Severity__: High
- __Auto-Generate__: No
- __Evidence__: Schema validation failures, CI failures
- __Example__: Remediation plans failing Constitutional compliance

### __User Questions__ 💡

- __Severity__: Medium
- __Auto-Generate__: No
- __Evidence__: Question patterns in docs, commits, issues
- __Example__: "Does this break..." or "Will this cause..."

### __AI Quality Gaps__ 📝

- __Severity__: Medium
- __Auto-Generate__: No
- __Evidence__: Incomplete AI content, TODOs, placeholders
- __Example__: Generated plans with "TBD" sections

### __Migration Friction__ 🔄

- __Severity__: Medium
- __Auto-Generate__: No
- __Evidence__: Migration-related keywords in recent changes
- __Example__: Breaking changes, compatibility issues

## 📋 Integration Points

### __CI/CD Workflow**

```yaml
- name: Detect evolution story triggers
  run: |
    echo "🔍 Detecting evolution story triggers..."
    node CLI/detect-evolution-stories.cjs

- name: Comment evolution insights
  if: always()
  uses: actions/GitHub-script@v6
  # ... comments auto-generated stories on PRs
```text

### __Tools Manifest**

```json
{
  "name": "detect-evolution-stories",
  "path": "tools/detect-evolution-stories.ts",
  "required": false,
  "description": "Automatically detect triggers for evolution story documentation"
}
```text

### __Package.JSON Scripts**

```json
{
  "scripts": {
    "detect-evolution": "node CLI/detect-evolution-stories.cjs",
    "evolution-story": "node CLI/generate-evolution-story.cjs"
  }
}
```text

## 🔬 Technical Implementation

### __EvolutionStoryDetector Class**

```typescript
interface EvolutionTrigger {
  type: "Constitutional-violation" | "user-question" | "validation-failure" | "migration-friction" | "ai-quality-gap"
  severity: "low" | "medium" | "high" | "critical"
  evidence: string[]
  suggestedStoryTitle: string
  autoGenerate: boolean
}
```text

### __Detection Methods**

- `detectConstitutionalViolations()`: Git commit analysis
- `detectValidationFailures()`: Log pattern matching
- `detectUserQuestionPatterns()`: Documentation scanning
- `detectAIQualityGaps()`: Content quality analysis
- `detectMigrationFriction()`: Change impact assessment

### __Auto-Generation Features**

- __Story ID Generation__: `EVS-YYYY-MM-DD-XXX` format
- __Template Creation__: Structured Markdown with metadata
- __Evidence Compilation__: Specific examples and context
- __Human Review Flags__: Clear indicators for required completion

## 🎯 Meta-Learning Objectives

### __Closing the Loop**

This system enables the framework to:

1. __Learn from field usage__ automatically
2. __Identify patterns__ before they become systematic
3. __Document insights__ proactively
4. __Improve governance__ through data-driven evolution

### __Constitutional Compliance**

Implements Article X requirements:

- __Systematic documentation__ of field-driven insights
- __Constitutional integration__ of evolution stories
- __Pattern recognition__ for framework improvement
- __Automated enforcement__ of documentation standards

## 🚀 Future Enhancements

### __Planned Capabilities**

- __Machine learning models__ for better pattern recognition
- __Integration with user behavior analytics__ for deeper insights
- __Predictive evolution story generation__ based on trends
- __Cross-framework learning__ from other Constitutional AI systems

### __Community Integration**

- __Public API__ for community contributions to detection patterns
- __Shared learning models__ across Aegis Framework deployments
- __Industry benchmarking__ for evolution story quality

---

## 📝 Example Output

```text
🔍 Evolution Story Detection Results:

📋 Constitutional-VIOLATION:
   🚨 [critical] Constitutional Change Documentation - a1b2c3d
      Auto-generate: Yes
      Evidence: Commit without evolution story: a1b2c3d Add new validation schema

📋 USER-QUESTION:
   💡 [medium] Documentation Gap - README.md
      Auto-generate: No
      Evidence: Question pattern in README.md: "does this break"

🤖 Auto-generating stories for critical triggers...

✅ Auto-generated evolution stories:
   📄 docs/evolution/evs-2025-08-06-001-auto-generated.md

💡 Suggested manual evolution stories:
   📝 Documentation Gap - README.md
      Command: node CLI/generate-evolution-story.cjs
```text

---

**Status__: ✅ Implemented and Integrated  
**Framework Version__: 2.0.0-alpha-dev  
**Constitutional Authority__: Article X - Field-Driven Evolution Documentation
