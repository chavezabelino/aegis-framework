<!--
@aegisFrameworkVersion: 2.3.0-alpha-dev
@intent: Documentation for automated evolution story detection system
@context: Complete the meta-learning loop by automating detection of evolution documentation needs
-->

# 🔍 Automated Evolution Story Detection

## Overview

The Aegis Framework now includes an **automated detection system** that identifies when evolution stories should be documented. This closes the meta-learning loop by proactively identifying field-driven insights that require constitutional documentation.

## 🎯 What It Detects

### **Automatic Triggers**
- ✅ **Constitutional violations** without associated evolution stories
- ✅ **Validation failures** indicating framework gaps
- ✅ **Migration friction** from recent changes
- ✅ **AI quality gaps** in generated content

### **Pattern Recognition**
- 🔍 **User question patterns** in documentation and commits
- 🔍 **Common failure patterns** across validation systems
- 🔍 **Documentation drift** from field usage
- 🔍 **Tool manifest violations** indicating missing capabilities

## 🛠️ Usage

### **CLI Commands**
```bash
# Detect evolution story triggers
npm run detect-evolution

# Alternative direct call
node cli/detect-evolution-stories.cjs

# Generate evolution story interactively
npm run evolution-story

# Alternative direct call
node cli/generate-evolution-story.cjs
```

### **Automatic Integration**
The detection system runs automatically in:
- **CI/CD Pipeline**: On every pull request
- **Git Hooks**: Pre-commit validation (when configured)
- **Manual Validation**: Via npm scripts

## 🤖 Auto-Generation

### **Critical Triggers**
For high-severity triggers (like constitutional violations), the system:
1. **Automatically generates** placeholder evolution stories
2. **Creates structured templates** with detected evidence
3. **Flags for human review** and completion
4. **Links to specific commits** and changes

### **Manual Triggers**
For medium/low-severity triggers, the system:
1. **Suggests** evolution story creation
2. **Provides evidence** and suggested titles
3. **Guides users** to the interactive CLI tool
4. **Tracks patterns** for future automation

## 📊 Detection Categories

### **Constitutional Violations** 🚨
- **Severity**: Critical
- **Auto-Generate**: Yes
- **Evidence**: Commits with constitutional changes lacking evolution stories
- **Example**: Framework spec changes without documentation

### **Validation Failures** ⚠️
- **Severity**: High
- **Auto-Generate**: No
- **Evidence**: Schema validation failures, CI failures
- **Example**: Remediation plans failing constitutional compliance

### **User Questions** 💡
- **Severity**: Medium
- **Auto-Generate**: No
- **Evidence**: Question patterns in docs, commits, issues
- **Example**: "Does this break..." or "Will this cause..."

### **AI Quality Gaps** 📝
- **Severity**: Medium
- **Auto-Generate**: No
- **Evidence**: Incomplete AI content, TODOs, placeholders
- **Example**: Generated plans with "TBD" sections

### **Migration Friction** 🔄
- **Severity**: Medium
- **Auto-Generate**: No
- **Evidence**: Migration-related keywords in recent changes
- **Example**: Breaking changes, compatibility issues

## 📋 Integration Points

### **CI/CD Workflow**
```yaml
- name: Detect evolution story triggers
  run: |
    echo "🔍 Detecting evolution story triggers..."
    node cli/detect-evolution-stories.cjs
    
- name: Comment evolution insights
  if: always()
  uses: actions/github-script@v6
  # ... comments auto-generated stories on PRs
```

### **Tools Manifest**
```json
{
  "name": "detect-evolution-stories",
  "path": "tools/detect-evolution-stories.ts",
  "required": false,
  "description": "Automatically detect triggers for evolution story documentation"
}
```

### **Package.json Scripts**
```json
{
  "scripts": {
    "detect-evolution": "node cli/detect-evolution-stories.cjs",
    "evolution-story": "node cli/generate-evolution-story.cjs"
  }
}
```

## 🔬 Technical Implementation

### **EvolutionStoryDetector Class**
```typescript
interface EvolutionTrigger {
  type: 'constitutional-violation' | 'user-question' | 'validation-failure' | 'migration-friction' | 'ai-quality-gap';
  severity: 'low' | 'medium' | 'high' | 'critical';
  evidence: string[];
  suggestedStoryTitle: string;
  autoGenerate: boolean;
}
```

### **Detection Methods**
- `detectConstitutionalViolations()`: Git commit analysis
- `detectValidationFailures()`: Log pattern matching
- `detectUserQuestionPatterns()`: Documentation scanning
- `detectAIQualityGaps()`: Content quality analysis
- `detectMigrationFriction()`: Change impact assessment

### **Auto-Generation Features**
- **Story ID Generation**: `EVS-YYYY-MM-DD-XXX` format
- **Template Creation**: Structured markdown with metadata
- **Evidence Compilation**: Specific examples and context
- **Human Review Flags**: Clear indicators for required completion

## 🎯 Meta-Learning Objectives

### **Closing the Loop**
This system enables the framework to:
1. **Learn from field usage** automatically
2. **Identify patterns** before they become systematic
3. **Document insights** proactively
4. **Improve governance** through data-driven evolution

### **Constitutional Compliance**
Implements Article X requirements:
- **Systematic documentation** of field-driven insights
- **Constitutional integration** of evolution stories
- **Pattern recognition** for framework improvement
- **Automated enforcement** of documentation standards

## 🚀 Future Enhancements

### **Planned Capabilities**
- **Machine learning models** for better pattern recognition
- **Integration with user behavior analytics** for deeper insights
- **Predictive evolution story generation** based on trends
- **Cross-framework learning** from other constitutional AI systems

### **Community Integration**
- **Public API** for community contributions to detection patterns
- **Shared learning models** across Aegis Framework deployments
- **Industry benchmarking** for evolution story quality

---

## 📝 Example Output

```
🔍 Evolution Story Detection Results:

📋 CONSTITUTIONAL-VIOLATION:
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
      Command: node cli/generate-evolution-story.cjs
```

---

**Status**: ✅ Implemented and Integrated  
**Framework Version**: 2.0.0-alpha-dev  
**Constitutional Authority**: Article X - Field-Driven Evolution Documentation
