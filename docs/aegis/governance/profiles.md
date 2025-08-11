# PROFILES

## Aegis Governance Profiles

The Aegis Framework provides three governance profiles that can be selected when using the reusable governance workflow.

Each profile offers different levels of validation and security checks.

## Profile Overview

### Lite Profile (`lite`)

**Fastest, minimal checks for rapid development**

- ✅ **Fast Checks**: Type checking, linting, unit tests, diff coverage

- ✅ **Provenance Headers**: Basic header validation only

- ⏭️ **No Evidence Proving**: Skips PREC validation

- ⏭️ **No Visual Regression**: Skips VR tests

**Use Case**: Development branches, feature PRs, rapid iteration

### Standard Profile (`standard`)

**Balanced approach for most production scenarios**

- ✅ **Fast Checks**: Type checking, linting, unit tests, diff coverage

- ✅ **Provenance Headers**: Basic header validation

- ✅ **Evidence Proving**: PREC validation with relaxed signatures on PRs

- ⏭️ **No Visual Regression**: Skips VR tests

**Use Case**: Main branch protection, release candidates, production deployments

### Core Profile (`core`)

**Maximum security and validation for critical systems**

- ✅ **Fast Checks**: Type checking, linting, unit tests, diff coverage

- ✅ **Provenance Headers**: Basic header validation

- ✅ **Evidence Proving**: PREC validation with relaxed signatures on PRs

- ✅ **Visual Regression**: Full VR test suite with Playwright

**Use Case**: Security-critical applications, compliance requirements, enterprise deployments

## Profile Selection Guide

| Scenario                | Recommended Profile | Reasoning                               |

| ----------------------- | ------------------- | --------------------------------------- |

| Feature development     | `lite`              | Fast feedback, minimal overhead         |

| Main branch protection  | `standard`          | Balanced security and speed             |

| Release preparation     | `standard`          | Evidence validation without VR overhead |

| Security-critical apps  | `core`              | Maximum validation including VR         |

| Compliance requirements | `core`              | Full audit trail and visual regression  |

| Enterprise deployments  | `core`              | Comprehensive validation suite          |

## Implementation

### Consumer Setup

```

## .GitHub/workflows/governance.yml

name: Governance

on: [push, pull_request]

jobs:

  Aegis:

    uses: chavezabelino/Aegis-framework/.GitHub/workflows/Aegis-governance-reusable.yml@v2.6.0

    with:

      profile: standard # lite | standard | core

```

### Branch Protection Rules

Configure branch protection based on your selected profile:

**Lite Profile**:

- Require status checks: `fast*checks`, `provenance*min`

**Standard Profile**:

- Require status checks: `fast*checks`, `provenance*min`, `prove_evidence`

**Core Profile**:

- Require status checks: `fast*checks`, `provenance*min`, `prove_evidence`, `VR`

## Profile Migration

### Upgrading from Lite to Standard

1. Update workflow call: `profile: standard`

2. Add branch protection for `prove_evidence` job

3. Ensure evidence manifests exist in `blueprints/**/evidence.JSON`

### Upgrading from Standard to Core

1. Update workflow call: `profile: core`

2. Add branch protection for `VR` job

3. Create VR tests in `tests/VR/**/*.spec.ts`

4. Install Playwright dependencies

### Downgrading Profiles

- Remove branch protection rules for skipped jobs

- Update workflow call to lower profile

- Consider impact on security posture

## Security Considerations

### Lite Profile

- **Risk**: Minimal validation may miss security issues

- **Mitigation**: Use only for development, not production

### Standard Profile

- **Risk**: No visual regression may miss UI regressions

- **Mitigation**: Manual testing or separate VR pipeline

### Core Profile

- **Risk**: Slower feedback due to comprehensive checks

- **Mitigation**: Parallel job execution, selective VR tests

## Performance Characteristics

| Profile  | Typical Duration | Resource Usage | Feedback Speed |

| -------- | ---------------- | -------------- | -------------- |

| Lite     | 2-5 minutes      | Low            | Fast           |

| Standard | 5-10 minutes     | Medium         | Moderate       |

| Core     | 10-20 minutes    | High           | Slower         |

## Troubleshooting

### Common Issues

**Lite Profile Failing**:

- Check that `npm run typecheck`, `npm run lint`, `npm test` exist

- Ensure diff coverage tool is available

**Standard Profile Failing**:

- Verify evidence manifests exist and are valid

- Check that `tools/check-evidence.ts` is available

- Ensure `scripts/ci/plan-gate.mjs` exists

**Core Profile Failing**:

- Confirm VR tests exist in `tests/VR/**/*.spec.ts`

- Verify Playwright is properly configured

- Check that VR baseline images are available

### Profile-Specific Debugging

Each profile includes specific debugging information:

```

## Lite profile debugging

npm run typecheck --verbose
npm run lint --debug
npm test --coverage --verbose

## Standard profile debugging

npx tsx tools/check-evidence.ts --debug
node scripts/ci/plan-gate.mjs --verbose

## Core profile debugging

npx Playwright test --debug
npx Playwright show-report

```
