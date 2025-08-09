# 🏛️ Constitutional Package Manager Protection

## 🎯 **Constitutional Mandate**

The Aegis Framework Constitution (Article I, Section 1 - Traceability) requires **consistent, deterministic tooling** for all development operations. Package manager confusion violates this principle by creating:

- **Non-deterministic builds** (different tools, different results)
- **Performance degradation** (slower development cycles)
- **Maintenance drift** (hybrid tooling complexity)
- **Onboarding confusion** (unclear developer setup)

## 🛡️ **Systematic Protection Mechanisms**

### **1. Automated Validation** 
```bash
# Runs in CI/CD and pre-commit
bun tools/validate-package-manager-consistency.ts
```

**Validates:**
- ✅ All package.json scripts use `bun` (not `npm run` or `node`)
- ✅ All GitHub Actions use `setup-bun` (not `setup-node`)
- ✅ All workflows use `bun install` (not `npm install`)
- ✅ All CLI execution uses `bun` (not `node`)

### **2. Auto-Repair System**
```bash
# Automatically fixes inconsistencies
bun tools/fix-package-manager-consistency.ts
```

**Auto-fixes:**
- 🔧 `npm run` → `bun run` in package.json scripts
- 🔧 `node script.ts` → `bun script.ts` in scripts  
- 🔧 `setup-node` → `setup-bun` in workflows
- 🔧 `npm install` → `bun install` in CI/CD

### **3. Pre-Commit Blocking**
```bash
# Prevents inconsistent commits
tools/package-manager-pre-commit-hook.sh
```

**Prevents:**
- ❌ Committing scripts with `npm run` 
- ❌ Committing workflows with `setup-node`
- ❌ Committing any hybrid package manager usage

### **4. CI/CD Integration**
**Fast CI workflow** includes package manager validation:
- Runs on every push/PR
- Fails CI if inconsistencies detected
- Provides clear error messages and fix instructions

## 📋 **The Clear Rules**

### **Development Commands (Internal):**
```json
{
  "scripts": {
    "build": "bun run build:vite",           // ✅ bun run
    "test": "bun test",                      // ✅ bun  
    "dev": "bun --watch cli/script.ts",     // ✅ bun
    "validate": "bun tools/validate.ts"     // ✅ bun
  }
}
```

### **GitHub Actions (CI/CD):**
```yaml
- name: Setup Bun
  uses: oven-sh/setup-bun@v2              # ✅ setup-bun
  
- name: Install dependencies  
  run: bun install                        # ✅ bun install
  
- name: Run CLI
  run: bun cli/aegis-hydrate.ts          # ✅ bun execution
```

### **Distribution (External):**
```bash
# Users still install via NPM (industry standard)
npm install -g @aegis-framework/cli@2.4.0
```

## 🚨 **Violation Detection**

### **Examples of Constitutional Violations:**
```json
// ❌ VIOLATION: Mixed package managers
{
  "scripts": {
    "build": "npm run validate && bun run build:vite",  // Mixed!
    "test": "node cli/test.ts",                         // Wrong runtime!
    "dev": "npm install && bun dev"                     // Inconsistent!
  }
}
```

### **Automatic Detection:**
- 🔍 **Real-time**: Pre-commit hooks catch violations
- 🔍 **Continuous**: CI/CD validates on every push
- 🔍 **Comprehensive**: Scans scripts, workflows, docs, hooks

## 🔧 **Developer Workflow Protection**

### **Onboarding Safety:**
```bash
# New developers get consistent setup
git clone aegis-framework
cd aegis-framework
bun install                    # ✅ Single command
bun run validate:all           # ✅ Includes package manager check
```

### **Development Safety:**
```bash
# All commands are consistent
bun cli/aegis-hydrate.ts       # ✅ Direct execution
bun run build                  # ✅ Fast builds  
bun test                       # ✅ Instant testing
bun tools/validate.ts          # ✅ Quick validation
```

### **Contribution Safety:**
```bash
# Pre-commit prevents violations
git add .
git commit -m "feature: add new capability"
# → Automatically validates package manager consistency
# → Blocks commit if violations found
# → Provides auto-fix instructions
```

## 📊 **Protection Coverage**

### **Protected Areas:**
- ✅ **package.json scripts** (100% coverage)
- ✅ **GitHub Actions workflows** (100% coverage)  
- ✅ **Git hooks** (100% coverage)
- ✅ **Documentation examples** (warning system)
- ✅ **CLI script execution** (recommendation system)

### **Enforcement Levels:**
- 🔥 **BLOCKING**: Package.json scripts, workflows (CI fails)
- ⚠️ **WARNING**: Documentation, shebangs (alerts only)
- 📝 **LOGGING**: Historical analysis and drift tracking

## 🎯 **Success Metrics**

### **Zero Tolerance Policy:**
- **0 errors** in package manager consistency validator
- **0 CI failures** due to package manager drift  
- **0 mixed commands** in package.json scripts
- **0 node usage** for TypeScript execution in workflows

### **Developer Experience:**
- **Single setup command**: `bun install`
- **Consistent execution**: All commands use `bun`
- **Fast feedback**: Package manager validation in <5 seconds
- **Auto-repair**: One-command fix for any violations

## 🏛️ **Constitutional Integration**

This protection system enforces:

- **Article I §1 (Traceability)**: Deterministic tooling for reproducible builds
- **Article I §2 (Observability)**: Clear logging of package manager usage
- **Article I §3 (Reproducibility)**: Consistent environment across all contexts  
- **Article I §4 (Safety)**: Preventing drift through automated enforcement

**Result: The Aegis Framework is constitutionally protected from package manager confusion!** 🛡️
