# Consumer Setup Guide

This guide explains how to integrate the Aegis Framework's reusable governance workflow into your repository.

## Quick Start

### 1. Create Governance Workflow

Create `.github/workflows/governance.yml` in your repository:

```yaml
name: Governance
on: [push, pull_request]

jobs:
  aegis:
    uses: chavezabelino/aegis-framework/.github/workflows/aegis-governance-reusable.yml@v2.6.0
    with:
      profile: standard  # lite | standard | core
```

### 2. Configure Branch Protection

Set up branch protection rules for your main branch:

1. Go to **Settings** → **Branches** → **Add rule**
2. Set **Branch name pattern**: `main`
3. Enable **Require status checks to pass before merging**
4. Add required status checks based on your profile:

**Lite Profile**:
- `fast_checks`
- `provenance_min`

**Standard Profile**:
- `fast_checks`
- `provenance_min`
- `prove_evidence`

**Core Profile**:
- `fast_checks`
- `provenance_min`
- `prove_evidence`
- `vr`

## Prerequisites

### Required Package.json Scripts

Ensure your `package.json` includes these scripts:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "test": "jest --coverage",
    "build": "your-build-command"
  }
}
```

### Required Dependencies

Install necessary dependencies:

```bash
npm install --save-dev typescript @types/node jest eslint
```

### Optional: Evidence Manifests

For `standard` and `core` profiles, create evidence manifests:

```json
// blueprints/your-feature/evidence.json
{
  "feature": "user-authentication",
  "version": "1.0.0",
  "evidence": [
    {
      "type": "test-coverage",
      "value": 85,
      "threshold": 80
    },
    {
      "type": "security-scan",
      "value": "passed",
      "details": "No vulnerabilities found"
    }
  ]
}
```

## Profile Selection

### Lite Profile (`lite`)
**Best for**: Development branches, rapid iteration

```yaml
jobs:
  aegis:
    uses: chavezabelino/aegis-framework/.github/workflows/aegis-governance-reusable.yml@v2.6.0
    with:
      profile: lite
```

**Includes**:
- Type checking
- Linting
- Unit tests with coverage
- Basic provenance header validation

### Standard Profile (`standard`)
**Best for**: Main branch protection, production deployments

```yaml
jobs:
  aegis:
    uses: chavezabelino/aegis-framework/.github/workflows/aegis-governance-reusable.yml@v2.6.0
    with:
      profile: standard
```

**Includes**:
- All Lite features
- Evidence proving (PREC)
- Plan gate validation

### Core Profile (`core`)
**Best for**: Security-critical applications, compliance requirements

```yaml
jobs:
  aegis:
    uses: chavezabelino/aegis-framework/.github/workflows/aegis-governance-reusable.yml@v2.6.0
    with:
      profile: core
```

**Includes**:
- All Standard features
- Visual regression testing with Playwright

## Advanced Configuration

### Custom Workflow Triggers

```yaml
name: Governance
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  workflow_dispatch:
    inputs:
      profile:
        description: 'Governance profile to run'
        required: true
        default: 'standard'
        type: choice
        options:
        - lite
        - standard
        - core

jobs:
  aegis:
    uses: chavezabelino/aegis-framework/.github/workflows/aegis-governance-reusable.yml@v2.6.0
    with:
      profile: ${{ github.event.inputs.profile || 'standard' }}
```

### Multiple Profiles

Run different profiles for different branches:

```yaml
name: Governance
on: [push, pull_request]

jobs:
  aegis-lite:
    if: github.ref != 'refs/heads/main'
    uses: chavezabelino/aegis-framework/.github/workflows/aegis-governance-reusable.yml@v2.6.0
    with:
      profile: lite

  aegis-standard:
    if: github.ref == 'refs/heads/main'
    uses: chavezabelino/aegis-framework/.github/workflows/aegis-governance-reusable.yml@v2.6.0
    with:
      profile: standard
```

### Secrets Configuration

For `standard` and `core` profiles, configure secrets for attestation:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add repository secret: `AEGIS_HMAC_KEY`
3. Set the value to your HMAC key for attestation

**Note**: Without this secret, the workflow will run in relaxed mode (suitable for PRs and forks).

## Troubleshooting

### Common Issues

**Workflow Not Found**:
```
Error: Unable to resolve action `chavezabelino/aegis-framework/.github/workflows/aegis-governance-reusable.yml@v2.6.0`
```

**Solution**: 
- Verify the tag exists: `v2.6.0`
- Check repository permissions
- Use a valid tag or commit SHA

**Missing Scripts**:
```
Error: npm run typecheck failed
```

**Solution**:
- Add required scripts to `package.json`
- Install necessary dependencies
- Verify TypeScript configuration

**Evidence Validation Failing**:
```
Error: tools/check-evidence.ts not found
```

**Solution**:
- Create evidence manifests in `blueprints/**/evidence.json`
- Ensure evidence format is valid
- Check that evidence files are committed

**VR Tests Failing**:
```
Error: No VR tests found
```

**Solution**:
- Create VR tests in `tests/vr/**/*.spec.ts`
- Install Playwright: `npm install --save-dev @playwright/test`
- Configure Playwright properly

### Debug Mode

Enable debug logging by setting the `ACTIONS_STEP_DEBUG` secret to `true`:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add repository secret: `ACTIONS_STEP_DEBUG`
3. Set value to: `true`

### Local Testing

Test your setup locally:

```bash
# Test type checking
npm run typecheck

# Test linting
npm run lint

# Test unit tests
npm test

# Test evidence validation (if applicable)
npx tsx tools/check-evidence.ts "blueprints/**/evidence.json"

# Test VR (if applicable)
npx playwright test
```

## Migration Guide

### From Custom Governance

If you have existing governance workflows:

1. **Backup**: Save your current workflow files
2. **Replace**: Replace with the reusable workflow call
3. **Test**: Verify all checks still pass
4. **Cleanup**: Remove old workflow files

### From Other Frameworks

If migrating from other governance frameworks:

1. **Map Checks**: Identify equivalent checks in Aegis profiles
2. **Select Profile**: Choose appropriate profile level
3. **Configure**: Set up branch protection rules
4. **Test**: Run workflow and verify results

## Best Practices

### Security
- Use `standard` or `core` profiles for production branches
- Configure `AEGIS_HMAC_KEY` secret for attestation
- Enable branch protection rules
- Review evidence manifests regularly

### Performance
- Use `lite` profile for development branches
- Optimize test execution time
- Use parallel job execution where possible
- Cache dependencies appropriately

### Maintenance
- Keep workflow version updated
- Monitor evidence manifest validity
- Review and update branch protection rules
- Document custom configurations

## Support

For issues with the reusable workflow:

1. Check the [troubleshooting guide](#troubleshooting)
2. Review [profile documentation](../profiles.md)
3. Open an issue in the Aegis Framework repository
4. Check workflow run logs for detailed error information
