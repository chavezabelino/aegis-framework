# GitHub Actions Workflow Optimization

## Current Workflow Analysis

### ✅ **Keep These Workflows:**

#### 1. `deploy-docs-simple.yml` 
- **Purpose**: Deploy Docusaurus documentation to GitHub Pages
- **Trigger**: Push to main
- **Status**: ✅ Working well
- **Recommendation**: Keep as-is

#### 2. `constitutional-compliance.yml`
- **Purpose**: Comprehensive framework validation
- **Trigger**: Push/PR to main  
- **Status**: ⚠️ Too heavy - runs 15+ validation steps
- **Recommendation**: Optimize (see below)

### ❌ **Remove/Modify These Workflows:**

#### 3. `validate.yml`
- **Purpose**: Basic validation (placeholder)
- **Status**: ❌ Just echoes "TODO"
- **Recommendation**: **DELETE** - redundant with constitutional-compliance.yml

#### 4. `aegis-eval.yml` 
- **Purpose**: Run evaluation pipeline
- **Status**: ⚠️ Disabled (workflow_dispatch only)
- **Recommendation**: **Enable selectively** - only for releases

#### 5. `deploy-docs.yml`
- **Status**: ⚠️ Disabled 
- **Recommendation**: **DELETE** - replaced by deploy-docs-simple.yml

## Optimization Plan

### 🚀 **Phase 1: Immediate Cleanup**

```bash
# Delete redundant workflows
rm .github/workflows/validate.yml
rm .github/workflows/deploy-docs.yml

# Keep but optimize others
```

### 🎯 **Phase 2: Optimize Constitutional Compliance**

**Problem**: Runs 15+ steps on every push (expensive)

**Solution**: Split into focused workflows:

1. **Fast CI** (on every push):
   - Version consistency
   - Blueprint validation  
   - Basic linting

2. **Full Compliance** (on PR to main):
   - Constitutional validation
   - Remediation plans
   - Evolution story detection

3. **Release Validation** (on tag):
   - Complete evaluation pipeline
   - Full test suite
   - Documentation build

### 🔧 **Phase 3: Enable Evaluations Selectively**

**Current**: Disabled because it was failing
**Fix**: Enable for releases only

```yaml
on:
  release:
    types: [published]
  workflow_dispatch:  # Manual trigger
```

## Recommended Final State

### Workflows to Keep:
1. **Fast CI** (`ci.yml`) - Quick validation on every push
2. **PR Validation** (`pr-validation.yml`) - Full checks on PR
3. **Documentation** (`deploy-docs-simple.yml`) - Deploy docs
4. **Release** (`release.yml`) - Full evaluation on releases

### Benefits:
- ✅ **Faster feedback** (30s vs 5min for basic CI)
- ✅ **Lower GitHub Actions costs** 
- ✅ **Focused validation** per context
- ✅ **Cleaner run history**

## Migration Steps

1. **Delete redundant workflows**
2. **Split constitutional-compliance.yml** into focused workflows  
3. **Enable aegis-eval.yml** for releases only
4. **Test new workflow setup**
5. **Clean up failed run history**

## Cost Analysis

### Before:
- Constitutional compliance: ~5 minutes × every push = expensive
- Multiple redundant workflows
- High failure rate due to complexity

### After:  
- Fast CI: ~30 seconds × every push
- Full validation: ~3 minutes × PRs only
- Evaluations: ~2 minutes × releases only
- **~80% reduction in compute time**
