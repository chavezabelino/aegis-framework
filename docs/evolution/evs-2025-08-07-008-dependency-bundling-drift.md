<!--
# EVS-2025-08-07-008: Dependency Bundling Drift and Correction

@aegisFrameworkVersion: 2.5.0
@intent: Document framework drift regarding incorrect dependency bundling approach
@context: Field-driven learning about open source distribution best practices
-->

# EVS-2025-08-07-008: Dependency Bundling Drift and Correction

## 📊 Story Metadata

```
evolutionStory:
  id: "EVS-2025-08-07-008"
  title: "Dependency Bundling Drift and Correction"
  date: "2025-08-07"
  frameworkVersion: "2.1.0"
  triggerType: "field-driven-learning"
  impactLevel: "high"

  participants:
    fieldUser: "nino (open source distribution novice)"
    frameworkMaintainer: "GitHub Copilot"

  artifactsGenerated:
    - "docs/guide/dependency-strategy-corrected.md"
    - "docs/guide/dependency-management-challenge.md"
    - "corrected build-package.ts implementation"
    - "proper npm package.JSON with dependencies"
```

## 🔍 Field Context

### **User Scenario**

User asked: _"i'm new to open source software and using GitHub public repos for distribution... should we bundle
dependencies that are available through established installation methods? should this not just be part of instructions
and prerequisites?"_

### **Expectation vs Reality**

- **User Expectation**: Dependencies should be prerequisites, not bundled
- **Framework Approach**: Initially suggested dependency bundling
- **Gap**: Framework gave incorrect guidance contrary to industry standards

### **User Workflow Impact**

1. User questioned framework's bundling approach
2. Revealed framework was suggesting anti-patterns
3. Led to complete re-evaluation of distribution strategy

## 🚨 Gap Analysis

### **Trigger Moment**

When user asked about bundling dependencies, they revealed that the framework was:

- ✅ **User Insight**: Dependencies should be prerequisites + package manager
- ❌ **Framework Drift**: Suggested bundling node_modules (wrong approach)
- ❌ **Implementation**: Built complex bundling logic unnecessarily

### **Framework Limitation Exposed**

```
// WRONG APPROACH (what framework initially did):
private copyNodeModules(cliDir: string): void {
  // Bundling dependencies = anti-pattern for Node.js CLI tools
  const essentialDeps = ['commander', 'inquirer', 'ora', 'chalk'];
  for (const dep of essentialDeps) {
    this.copyDirectory(`node_modules/${dep}`, `${nodeModulesDir}/${dep}`);
  }
}

// CORRECT APPROACH (what user identified):
// Just declare dependencies in package.JSON
// Let npm handle dependency resolution automatically
```

### **Impact Assessment**

- **User Experience**: Would have created bloated packages (1MB+ vs 83KB)
- **Industry Standards**: Violated Node.js CLI distribution conventions
- **Maintenance**: Added unnecessary complexity to build system
- **Security**: Would have made dependency updates harder

## 💡 Solution Design

### **User-Driven Correction**

User insight led to complete strategy reversal:

#### **Before (Incorrect)**

```javascript
// Bundled approach - WRONG
dist/Aegis-CLI/
├── bin/Aegis-hydrate           # CLI wrapper
├── node_modules/               # BUNDLED deps (50MB+)
│   ├── commander/
│   ├── inquirer/
│   └── ... (deep dependency tree)
└── package.JSON               # No dependencies declared
```

#### **After (Correct)**

```javascript
// npm approach - CORRECT
dist/Aegis-CLI/
├── bin/Aegis-hydrate           # CLI executable
├── lib/CLI/                    # Source files
└── package.JSON               # Dependencies DECLARED (83KB)
   "dependencies": {
     "commander": "^14.0.0",
     "inquirer": "^12.9.0"
   }
```

### **Implementation Strategy**

1. **Removed bundling logic** from build-package.ts
2. **Added dependencies** to CLI package.JSON
3. **Updated documentation** to reflect npm-first approach
4. **Tested npm installation** workflow properly

## 🔧 Implementation Details

### **Code Changes Made**

```
// REMOVED this anti-pattern:
this.copyNodeModules(cliDir)

// ADDED proper dependency declaration:
const cliPackage = {
  dependencies: {
    "commander": "^14.0.0",
    "inquirer": "^12.9.0",
    "ora": "^8.2.0",
    "chalk": "^5.3.0",
    "js-YAML": "^4.1.0"
  }
}
```

### **Documentation Updates**

- Created `docs/guide/dependency-strategy-corrected.md`
- Updated installation instructions to focus on npm
- Added examples from industry-standard CLI tools

### **Validation Results**

```
# Package size comparison:
Before (bundling): 1.1MB+
After (npm deps):  83KB ✅

# npm installation test:
npm install /path/to/Aegis-framework-CLI-2.1.0.tgz
# ✅ Added 60 packages automatically
# ✅ All dependencies resolved correctly
```

## 🌱 Meta-Learning

### **Pattern Recognition**

This drift reveals a systematic issue:

- **Framework assumption**: "Standalone" means "bundle everything"
- **Industry reality**: "Standalone" means "npm handles dependencies"
- **User expertise**: Newcomers often have better instincts than complex systems

### **Prevention Strategy**

1. **User validation gates**: Ask users about industry standards before implementing
2. **Reference other tools**: Always check how similar tools handle distribution
3. **Simplicity bias**: Prefer simpler solutions (npm) over complex ones (bundling)

### **Framework Learning**

- **Humility**: User questions can reveal framework blindspots
- **Standards compliance**: Follow established patterns, don't reinvent
- **Documentation**: Explain WHY certain approaches are chosen

## 🚀 Implementation Impact

### **Immediate Changes**

- ✅ Removed 30+ lines of unnecessary bundling code
- ✅ Reduced package size by 92% (1.1MB → 83KB)
- ✅ Aligned with Node.js CLI standards
- ✅ Simplified build process significantly

### **User Experience Improvement**

```
# Before (complex):
curl -sSL https://releases/download/aegis-cli-huge.tar.gz | tar -xz
./Aegis-CLI/bin/Aegis-hydrate # Might fail with dependency issues

# After (standard):
npm install -g @Aegis-framework/CLI@2.1.0
Aegis-hydrate /path/to/project  # Just works
```

### **Framework Evolution**

This user interaction fundamentally improved the framework's understanding of:

- Open source distribution standards
- Package management best practices
- User expectations for CLI tools
- Industry conventions vs custom solutions

## 📋 Recommendations

### **For Framework Development**

1. **Always validate against industry standards** before implementing distribution logic
2. **Ask users about their expectations** early in design process
3. **Research existing tools** to understand established patterns
4. **Prefer standard solutions** over custom implementations

### **For Documentation**

1. **Document WHY decisions are made**, not just WHAT is implemented
2. **Include comparisons** with other popular tools
3. **Explain trade-offs** between different approaches
4. **Provide migration paths** when changing approaches

### **For Future Evolution**

This story should be referenced when:

- Adding new distribution methods
- Considering bundling vs dependency declaration
- Evaluating "standalone" vs "npm-managed" approaches
- Making decisions about package complexity

---

**Story Status**: ✅ Completed - Framework Corrected  
**Framework Impact**: High - Fundamental distribution strategy change  
**Evolution Pattern**: Field-Driven Learning Success

_User insight > Framework assumption. This story demonstrates the value of questioning framework decisions and
validating against industry standards._
