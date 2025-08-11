# GitHub Actions Workflow Optimization

## Current Workflow Analysis

### ✅ __Keep These Workflows:**

#### 1. `deploy-docs-simple.yml`

- __Purpose__: Deploy Docusaurus documentation to GitHub Pages
- __Trigger__: Push to main
- __Status__: ✅ Working well
- __Recommendation__: Keep as-is

#### 2. `Constitutional-compliance.yml`

- __Purpose__: Comprehensive framework validation
- __Trigger__: Push/PR to main
- __Status__: ⚠️ Too heavy - runs 15+ validation steps
- __Recommendation__: Optimize (see below)

### ❌ __Remove/Modify These Workflows:**

#### 3. `validate.yml`

- __Purpose__: Basic validation (placeholder)
- __Status__: ❌ Just echoes "TODO"
- __Recommendation__: __DELETE__ - redundant with Constitutional-compliance.yml

#### 4. `Aegis-eval.yml`

- __Purpose__: Run evaluation pipeline
- __Status__: ⚠️ Disabled (workflow_dispatch only)
- __Recommendation__: __Enable selectively__ - only for releases

#### 5. `deploy-docs.yml`

- __Status__: ⚠️ Disabled
- __Recommendation__: __DELETE__ - replaced by deploy-docs-simple.yml

## Optimization Plan

### 🚀 __Phase 1: Immediate Cleanup**

```bash
# Delete redundant workflows
rm .GitHub/workflows/validate.yml
rm .GitHub/workflows/deploy-docs.yml

# Keep but optimize others
```text

### 🎯 __Phase 2: Optimize Constitutional Compliance**

**Problem__: Runs 15+ steps on every push (expensive)

**Solution__: Split into focused workflows:

1. __Fast CI__ (on every push):
   - Version consistency
   - Blueprint validation
   - Basic linting

2. __Full Compliance__ (on PR to main):
   - Constitutional validation
   - Remediation plans
   - Evolution story detection

3. __Release Validation__ (on tag):
   - Complete evaluation pipeline
   - Full test suite
   - Documentation build

### 🔧 __Phase 3: Enable Evaluations Selectively**

**Current__: Disabled because it was failing __Fix__: Enable for releases only

```yaml
on:
  release:
    types: [published]
  workflow_dispatch: # Manual trigger
```text

## Recommended Final State

### Workflows to Keep

1. __Fast CI__ (`ci.yml`) - Quick validation on every push
2. __PR Validation__ (`pr-validation.yml`) - Full checks on PR
3. __Documentation__ (`deploy-docs-simple.yml`) - Deploy docs
4. __Release__ (`release.yml`) - Full evaluation on releases

### Benefits

- ✅ __Faster feedback__ (30s vs 5min for basic CI)
- ✅ __Lower GitHub Actions costs**
- ✅ __Focused validation__ per context
- ✅ __Cleaner run history**

## Migration Steps

1. __Delete redundant workflows**
2. __Split Constitutional-compliance.yml__ into focused workflows
3. __Enable Aegis-eval.yml__ for releases only
4. __Test new workflow setup**
5. __Clean up failed run history**

## Cost Analysis

### Before

- Constitutional compliance: ~5 minutes × every push = expensive
- Multiple redundant workflows
- High failure rate due to complexity

### After

- Fast CI: ~30 seconds × every push
- Full validation: ~3 minutes × PRs only
- Evaluations: ~2 minutes × releases only
- __~80% reduction in compute time**
