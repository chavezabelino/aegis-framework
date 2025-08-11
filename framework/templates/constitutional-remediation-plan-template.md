<!--
@aegisFrameworkVersion: 2.4.0-alpha-dev
@intent: Constitutional example of a safe remediation plan
@context: Template showing all required safety mechanisms and validation gates
@mode: strict
-->

# 📋 Example: Constitutional Remediation Plan Template

This template demonstrates how to create remediation plans that meet Constitutional safety requirements and prevent the
gaps identified in framework migration pitfalls.

## YAML Format Example

```
# Constitutional Remediation Plan
# All fields marked as required must be present to pass validation

# Basic plan metadata
id: "example-remediation-2025-001"
name: "Framework Migration with Constitutional Safety"
description: "Demonstrates complete remediation plan with all required safety mechanisms and validation gates"
version: "1.0.0"

# Constitutional annotations (required)
aegisFrameworkVersion: "2.0.0-alpha-dev"
blueprintId: "feat-public-viewing" # Optional if not Blueprint-specific
mode: "strict"
intent: "Migrate existing project to Aegis Framework v2.0 with complete safety guarantees"
context: "AI-generated remediation plan demonstrating Constitutional compliance patterns"

# Project targeting
targetProject:
  path: "/path/to/target/project"
  type: "react-nextjs"
  currentFrameworkVersion: "1.0.0-alpha"
  detectedIssues:
    - "Missing Constitutional annotations"
    - "Outdated Blueprint schema"
    - "Non-compliant file structure"
    - "Missing rollback mechanisms"

# Execution phases (minimum 1 required)
phases:
  - id: "phase-1-preflight"
    name: "Constitutional Preflight Validation"
    description: "Validate current state and prepare safe migration environment"
    order: 1

    # Required validation steps
    validationSteps:
      - name: "build-check"
        command: "npm run build"
        description: "Ensure project builds successfully before any changes"
        required: true
        rollbackOnFailure: true
      - name: "test-check"
        command: "npm test"
        description: "Verify all tests pass before migration"
        required: true
        rollbackOnFailure: true
      - name: "lint-check"
        command: "npm run lint"
        description: "Check code quality standards"
        required: true
        rollbackOnFailure: true

    # Required rollback plan
    rollbackPlan:
      strategy: "git-snapshot"
      snapshotCommand: "git stash push -m 'pre-migration-snapshot'"
      restoreInstructions: "Run 'git stash pop' to restore pre-migration state"
      testRollback: true
      validationSteps:
        - name: "verify-restoration"
          command: "git status --porcelain"
          description: "Verify working directory is clean after rollback"
          required: true
          rollbackOnFailure: false

    # Required dry-run simulation
    dryRunSimulation:
      enabled: true
      commands:
        - "echo 'Simulating framework migration...'"
        - "diff -r current/ proposed/ || true"
      outputPath: "dry-run-results.txt"
      diffGeneration: true
      safetyChecks:
        - "No critical files will be deleted"
        - "All imports will remain valid"
        - "Build process will not break"

    # Tool validation
    toolingRequirements:
      requiredTools:
        - name: "node"
          version: ">=18.0.0"
          validateCommand: "node --version"
          criticalForExecution: true
        - name: "git"
          validateCommand: "git --version"
          criticalForExecution: true
      scaffoldedTools:
        - name: "migration-validator"
          path: "tools/validate-migration.js"
          purpose: "Validate migration steps"
          validated: true
      toolingValidated: true
      validationCommand: "node tools/validate-tools.js"

    # Risk assessment
    riskLevel: "medium"
    riskMitigation:
      "Comprehensive validation gates and rollback mechanisms ensure safe execution with ability to restore previous
      state"

    # Constitutional impact
    constitutionalImpact:
      blueprintChanges: false
      frameworkModifications: true
      breakingChanges: false
      requiresApproval: true

    # Execution metadata
    estimatedDuration: "15-30 minutes"
    dependencies: []
    parallelizable: false

  - id: "phase-2-migration"
    name: "Framework Structure Migration"
    description: "Apply framework changes with continuous validation"
    order: 2

    validationSteps:
      - name: "incremental-build"
        command: "npm run build"
        description: "Validate build after each structural change"
        required: true
        rollbackOnFailure: true
      - name: "Constitutional-compliance"
        command: "node tools/validate-constitution.ts"
        description: "Ensure Constitutional compliance throughout migration"
        required: true
        rollbackOnFailure: true

    rollbackPlan:
      strategy: "git-snapshot"
      snapshotCommand: "git add . && git commit -m 'migration-checkpoint'"
      restoreInstructions: "Use 'git reset --hard HEAD~1' to rollback to previous checkpoint"
      testRollback: true
      validationSteps:
        - name: "verify-rollback"
          command: "npm run build && npm test"
          description: "Ensure project still works after rollback"
          required: true
          rollbackOnFailure: false

    dryRunSimulation:
      enabled: true
      commands:
        - "cp -r src/ src-backup/"
        - "echo 'Testing migration on copy...'"
      diffGeneration: true
      safetyChecks:
        - "Original files preserved during simulation"
        - "No permanent changes during dry run"

    toolingRequirements:
      requiredTools:
        - name: "Aegis-hydrate"
          validateCommand: "node CLI/Aegis-hydrate.ts --version"
          criticalForExecution: true
      scaffoldedTools: []
      toolingValidated: true

    riskLevel: "high"
    riskMitigation:
      "Phase executed in checkpoint mode with rollback after each step. All changes validated before proceeding."

    constitutionalImpact:
      blueprintChanges: true
      frameworkModifications: true
      breakingChanges: false
      requiresApproval: true

    estimatedDuration: "45-60 minutes"
    dependencies: ["phase-1-preflight"]
    parallelizable: false

# Compliance targets (minimum 1 required)
complianceTargets:
  - metric: "Build Success Rate"
    currentValue: "unknown"
    targetValue: "100%"
    measurementCommand: "npm run build"
    validationFrequency: "post-phase"
    enforcementLevel: "blocking"
  - metric: "Test Pass Rate"
    targetValue: "100%"
    measurementCommand: "npm test"
    validationFrequency: "post-phase"
    enforcementLevel: "blocking"
  - metric: "Constitutional Compliance"
    targetValue: "full compliance"
    measurementCommand: "node tools/validate-constitution.ts"
    validationFrequency: "continuous"
    enforcementLevel: "blocking"

# CI integration
ciIntegration:
  required: true
  workflowPath: ".GitHub/workflows/Constitutional-compliance.yml"
  complianceChecks:
    - metric: "Schema Validation"
      targetValue: "pass"
      measurementCommand: "node tools/validate-remediation-plan.ts plan.YAML"
      validationFrequency: "pre-phase"
      enforcementLevel: "blocking"
  preflightGates:
    - name: "build-gate"
      command: "npm run build"
      blocking: true
    - name: "test-gate"
      command: "npm test"
      blocking: true
    - name: "lint-gate"
      command: "npm run lint"
      blocking: true
  postExecutionValidation:
    - "npm run build"
    - "npm test"
    - "node tools/validate-constitution.ts"
  failureActions:
    - "rollback"
    - "notify"

# Overall safety strategy
overallRollbackStrategy:
  strategy: "git-snapshot"
  snapshotCommand: "git tag migration-start-$(date +%s)"
  restoreInstructions: "Use 'git reset --hard migration-start-{timestamp}' to restore complete pre-migration state"
  testRollback: true
  validationSteps:
    - name: "complete-rollback-test"
      command: "npm run build && npm test"
      description: "Verify complete system integrity after full rollback"
      required: true
      rollbackOnFailure: false

# Emergency procedures
emergencyProcedures:
  escalationPath: "Contact framework maintainers via GitHub issues with 'emergency' label"
  emergencyContacts:
    - "framework-maintainers@Aegis.dev"
    - "Constitutional-committee@Aegis.dev"
  failsafeActions:
    - "git-tag-emergency-restore"
    - "create-emergency-branch"
    - "escalate-to-maintainers"
    - "halt-all-automation"

# Plan validation metadata
planValidation:
  schemaValidated: true
  preflightTested: false # Set to true after running dry-run
  dryRunExecuted: false # Set to true after successful simulation
  toolingVerified: true
  peerReviewed: false # Optional but recommended
  constitutionallyCompliant: true

# Success criteria (minimum 3 required)
successCriteria:
  - criterion: "Build Successful"
    measurementMethod: "npm run build returns exit code 0"
    acceptanceThreshold: "zero errors"
  - criterion: "All Tests Pass"
    measurementMethod: "npm test returns exit code 0 with 100% pass rate"
    acceptanceThreshold: "100%"
  - criterion: "Constitutional Compliance"
    measurementMethod: "node tools/validate-constitution.ts returns success"
    acceptanceThreshold: "full compliance"
  - criterion: "Framework Migration Complete"
    measurementMethod: "Aegis hydrate --validate returns success"
    acceptanceThreshold: "validation pass"

# Approval and governance
approvalRequired: true
approvers:
  - "framework-maintainer"
  - "Constitutional-reviewer"
constitutionalReview: true

# Timestamps
createdAt: "2025-08-06T00:00:00Z"
lastModified: "2025-08-06T00:00:00Z"
estimatedCompletionTime: "2-3 hours with approval gates"
actualExecutionTime: null # Filled during execution
```

## JSON Format Example

The same plan can be expressed in JSON format:

```
{
  "id": "example-remediation-2025-001",
  "name": "Framework Migration with Constitutional Safety",
  "description": "Demonstrates complete remediation plan with all required safety mechanisms and validation gates",
  "version": "1.0.0",
  "aegisFrameworkVersion": "2.0.0-alpha-dev",
  "mode": "strict",
  "intent": "Migrate existing project to Aegis Framework v2.0 with complete safety guarantees",
  "context": "AI-generated remediation plan demonstrating Constitutional compliance patterns",
  "targetProject": {
    "path": "/path/to/target/project",
    "type": "react-nextjs",
    "currentFrameworkVersion": "1.0.0-alpha",
    "detectedIssues": [
      "Missing Constitutional annotations",
      "Outdated Blueprint schema",
      "Non-compliant file structure",
      "Missing rollback mechanisms"
    ]
  },
  "phases": [
    {
      "id": "phase-1-preflight",
      "name": "Constitutional Preflight Validation",
      "description": "Validate current state and prepare safe migration environment",
      "order": 1,
      "validationSteps": [
        {
          "name": "build-check",
          "command": "npm run build",
          "description": "Ensure project builds successfully before any changes",
          "required": true,
          "rollbackOnFailure": true
        }
      ],
      "rollbackPlan": {
        "strategy": "git-snapshot",
        "snapshotCommand": "git stash push -m 'pre-migration-snapshot'",
        "restoreInstructions": "Run 'git stash pop' to restore pre-migration state",
        "testRollback": true,
        "validationSteps": [
          {
            "name": "verify-restoration",
            "command": "git status --porcelain",
            "description": "Verify working directory is clean after rollback",
            "required": true,
            "rollbackOnFailure": false
          }
        ]
      },
      "dryRunSimulation": {
        "enabled": true,
        "commands": ["echo 'Simulating framework migration...'"],
        "diffGeneration": true,
        "safetyChecks": ["No critical files will be deleted", "All imports will remain valid"]
      },
      "toolingRequirements": {
        "requiredTools": [
          {
            "name": "node",
            "version": ">=18.0.0",
            "validateCommand": "node --version",
            "criticalForExecution": true
          }
        ],
        "scaffoldedTools": [],
        "toolingValidated": true
      },
      "riskLevel": "medium",
      "riskMitigation": "Comprehensive validation gates and rollback mechanisms ensure safe execution",
      "constitutionalImpact": {
        "blueprintChanges": false,
        "frameworkModifications": true,
        "breakingChanges": false,
        "requiresApproval": true
      },
      "estimatedDuration": "15-30 minutes",
      "dependencies": [],
      "parallelizable": false
    }
  ],
  "complianceTargets": [
    {
      "metric": "Build Success Rate",
      "targetValue": "100%",
      "measurementCommand": "npm run build",
      "validationFrequency": "post-phase",
      "enforcementLevel": "blocking"
    }
  ],
  "ciIntegration": {
    "required": true,
    "complianceChecks": [],
    "preflightGates": [
      {
        "name": "build-gate",
        "command": "npm run build",
        "blocking": true
      }
    ],
    "postExecutionValidation": ["npm run build", "npm test"],
    "failureActions": ["rollback", "notify"]
  },
  "overallRollbackStrategy": {
    "strategy": "git-snapshot",
    "restoreInstructions": "Use git reset to restore pre-migration state",
    "testRollback": true,
    "validationSteps": [
      {
        "name": "complete-rollback-test",
        "command": "npm run build && npm test",
        "description": "Verify complete system integrity after full rollback",
        "required": true,
        "rollbackOnFailure": false
      }
    ]
  },
  "emergencyProcedures": {
    "escalationPath": "Contact framework maintainers via GitHub issues",
    "emergencyContacts": ["framework-maintainers@Aegis.dev"],
    "failsafeActions": ["git-tag-emergency-restore", "escalate-to-maintainers"]
  },
  "planValidation": {
    "schemaValidated": true,
    "preflightTested": false,
    "dryRunExecuted": false,
    "toolingVerified": true,
    "constitutionallyCompliant": true
  },
  "successCriteria": [
    {
      "criterion": "Build Successful",
      "measurementMethod": "npm run build returns exit code 0",
      "acceptanceThreshold": "zero errors"
    },
    {
      "criterion": "All Tests Pass",
      "measurementMethod": "npm test returns exit code 0",
      "acceptanceThreshold": "100%"
    },
    {
      "criterion": "Constitutional Compliance",
      "measurementMethod": "validate-constitution.ts returns success",
      "acceptanceThreshold": "full compliance"
    }
  ],
  "approvalRequired": true,
  "constitutionalReview": true,
  "createdAt": "2025-08-06T00:00:00Z",
  "lastModified": "2025-08-06T00:00:00Z",
  "estimatedCompletionTime": "2-3 hours with approval gates"
}
```

## Validation Command

```
# Validate this plan against Constitutional requirements
node tools/validate-remediation-plan.ts example-remediation-plan.YAML

# Expected output:
# 🔍 Validating remediation plan against Constitutional requirements...
# 📊 Validation Score: 95/100
# ✅ Overall: VALID
# ✅ Remediation plan meets Constitutional requirements and is safe for execution.
```

## Key Constitutional Protections

This template includes all required Constitutional protections:

1. **✅ Validation Gates**: Build, test, lint checks before changes
2. **✅ Rollback Strategy**: Git snapshots with tested restoration
3. **✅ Dry-Run Simulation**: Preview effects before execution
4. **✅ Tool Validation**: Verify all required tools exist
5. **✅ Constitutional Review**: Framework compliance checks
6. **✅ Success Criteria**: Measurable completion standards
7. **✅ Emergency Procedures**: Escalation and failsafe actions
8. **✅ CI Integration**: Automated preflight gates
9. **✅ Risk Assessment**: Clear mitigation strategies
10. **✅ Constitutional Annotations**: Full metadata compliance

## Anti-Patterns to Avoid

❌ **Don't** create plans without rollback strategies  
❌ **Don't** skip validation steps for "simple" changes  
❌ **Don't** assume tools exist without validation  
❌ **Don't** omit dry-run simulation for high-risk phases  
❌ **Don't** ignore Constitutional review requirements  
❌ **Don't** use generic success criteria without measurement methods

## Framework Protection Summary

This template prevents the specific gaps identified in framework migration pitfalls:

- **Validation Gates**: Required build/test/lint checks before any structural changes
- **Tool Validation**: All referenced tools must exist and be validated
- **Rollback Safety**: Every phase includes tested rollback procedures
- **Dry-Run Protection**: High-risk changes must be simulated first
- **Constitutional Compliance**: All plans validated against framework principles
- **Measurable Success**: Clear, testable criteria for completion
- **Emergency Procedures**: Escalation paths and failsafe actions defined

By following this template, remediation plans will meet Constitutional requirements and provide the safety mechanisms
needed to prevent incomplete or dangerous migrations.
