/**
 * @aegisFrameworkVersion 2.3.0-alpha-dev
 * @intent Constitutional schema for validating AI-generated remediation plans
 * @context Framework safeguard against incomplete or unsafe remediation strategies
 */

import { z } from 'zod';

/**
 * Constitutional schema ensuring all remediation plans meet safety and completeness standards
 * Prevents the framework gaps that led to incomplete initial remediation plans
 */

export const ValidationStepSchema = z.object({
  name: z.string().min(1, "Validation step must have a clear name"),
  command: z.string().min(1, "Validation step must specify executable command"),
  description: z.string().min(10, "Validation step must explain what it validates"),
  required: z.boolean().default(true),
  rollbackOnFailure: z.boolean().default(true)
});

export const RollbackPlanSchema = z.object({
  strategy: z.enum(['git-snapshot', 'file-backup', 'parallel-path', 'none']),
  snapshotCommand: z.string().optional(),
  restoreInstructions: z.string().min(20, "Rollback must include clear restore instructions"),
  testRollback: z.boolean().default(true),
  validationSteps: z.array(ValidationStepSchema).min(1, "Rollback must include validation")
});

export const DryRunSimulationSchema = z.object({
  enabled: z.boolean(),
  commands: z.array(z.string()).min(1, "Dry run must specify simulation commands"),
  outputPath: z.string().optional(),
  diffGeneration: z.boolean().default(true),
  safetyChecks: z.array(z.string()).min(1, "Dry run must include safety checks")
});

export const ToolingManifestSchema = z.object({
  requiredTools: z.array(z.object({
    name: z.string(),
    version: z.string().optional(),
    installCommand: z.string().optional(),
    validateCommand: z.string(),
    criticalForExecution: z.boolean().default(true)
  })),
  scaffoldedTools: z.array(z.object({
    name: z.string(),
    path: z.string(),
    purpose: z.string(),
    validated: z.boolean()
  })),
  toolingValidated: z.boolean(),
  validationCommand: z.string().optional()
});

export const RemediationPhaseSchema = z.object({
  id: z.string().min(1, "Phase must have unique identifier"),
  name: z.string().min(5, "Phase name must be descriptive"),
  description: z.string().min(20, "Phase must have detailed description"),
  order: z.number().int().positive(),
  
  // Constitutional requirements
  validationSteps: z.array(ValidationStepSchema)
    .min(3, "Each phase must include build, test, and lint validation"),
  
  rollbackPlan: RollbackPlanSchema,
  
  dryRunSimulation: DryRunSimulationSchema,
  
  // Tool and dependency validation
  toolingRequirements: ToolingManifestSchema,
  
  // Risk assessment
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
  riskMitigation: z.string().min(30, "High-risk phases must detail mitigation strategies"),
  
  // Constitutional compliance
  constitutionalImpact: z.object({
    blueprintChanges: z.boolean(),
    frameworkModifications: z.boolean(),
    breakingChanges: z.boolean(),
    requiresApproval: z.boolean()
  }),
  
  // Execution metadata
  estimatedDuration: z.string(),
  dependencies: z.array(z.string()),
  parallelizable: z.boolean().default(false)
});

export const ComplianceTargetSchema = z.object({
  metric: z.string().min(1, "Compliance metric must be specified"),
  currentValue: z.union([z.string(), z.number()]).optional(),
  targetValue: z.union([z.string(), z.number()]),
  measurementCommand: z.string().min(1, "Must specify how to measure compliance"),
  validationFrequency: z.enum(['pre-phase', 'post-phase', 'continuous', 'final']),
  enforcementLevel: z.enum(['warning', 'error', 'blocking'])
});

export const CIIntegrationSchema = z.object({
  required: z.boolean(),
  workflowPath: z.string().optional(),
  complianceChecks: z.array(ComplianceTargetSchema),
  preflightGates: z.array(z.object({
    name: z.string(),
    command: z.string(),
    blocking: z.boolean().default(true)
  })),
  postExecutionValidation: z.array(z.string()),
  failureActions: z.array(z.enum(['rollback', 'notify', 'halt', 'continue']))
});

/**
 * Main remediation plan schema
 * Constitutional requirement: All AI-generated remediation plans must conform to this schema
 */
export const RemediationPlanSchema = z.object({
  // Plan metadata
  id: z.string().min(1, "Remediation plan must have unique identifier"),
  name: z.string().min(10, "Plan name must be descriptive"),
  description: z.string().min(50, "Plan must include comprehensive description"),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Version must follow semantic versioning"),
  
  // Constitutional annotations
  aegisFrameworkVersion: z.string(),
  blueprintId: z.string().optional(),
  mode: z.enum(['lean', 'strict', 'generative']),
  intent: z.string().min(20, "Intent must clearly state plan purpose"),
  context: z.string().min(30, "Context must explain remediation need"),
  
  // Project targeting
  targetProject: z.object({
    path: z.string(),
    type: z.string(),
    currentFrameworkVersion: z.string().optional(),
    detectedIssues: z.array(z.string()).min(1, "Must identify specific issues to remediate")
  }),
  
  // Execution phases
  phases: z.array(RemediationPhaseSchema)
    .min(1, "Remediation plan must include at least one phase")
    .refine(phases => {
      // Validate phase ordering
      const orders = phases.map(p => p.order);
      return orders.length === new Set(orders).size;
    }, "Phase orders must be unique")
    .refine(phases => {
      // Ensure first phase includes preflight validation
      const firstPhase = phases.find(p => p.order === 1);
      return firstPhase?.validationSteps.some(step => 
        step.name.toLowerCase().includes('build') ||
        step.name.toLowerCase().includes('test') ||
        step.name.toLowerCase().includes('lint')
      );
    }, "First phase must include build/test/lint validation"),
  
  // Compliance and quality gates
  complianceTargets: z.array(ComplianceTargetSchema)
    .min(1, "Plan must define measurable compliance targets"),
  
  // CI/CD integration
  ciIntegration: CIIntegrationSchema,
  
  // Overall safety mechanisms
  overallRollbackStrategy: RollbackPlanSchema,
  emergencyProcedures: z.object({
    escalationPath: z.string(),
    emergencyContacts: z.array(z.string()),
    failsafeActions: z.array(z.string())
  }),
  
  // Plan validation metadata
  planValidation: z.object({
    schemaValidated: z.boolean(),
    preflightTested: z.boolean(),
    dryRunExecuted: z.boolean(),
    toolingVerified: z.boolean(),
    peerReviewed: z.boolean().default(false),
    constitutionallyCompliant: z.boolean()
  }),
  
  // Success criteria
  successCriteria: z.array(z.object({
    criterion: z.string(),
    measurementMethod: z.string(),
    acceptanceThreshold: z.union([z.string(), z.number()])
  })).min(3, "Plan must define at least 3 success criteria"),
  
  // Plan approval and governance
  approvalRequired: z.boolean(),
  approvers: z.array(z.string()).optional(),
  constitutionalReview: z.boolean(),
  
  // Timestamps and tracking
  createdAt: z.string(),
  lastModified: z.string(),
  estimatedCompletionTime: z.string(),
  actualExecutionTime: z.string().optional()
});

export type RemediationPlan = z.infer<typeof RemediationPlanSchema>;
export type RemediationPhase = z.infer<typeof RemediationPhaseSchema>;
export type ValidationStep = z.infer<typeof ValidationStepSchema>;
export type ComplianceTarget = z.infer<typeof ComplianceTargetSchema>;

/**
 * Constitutional validation errors
 * These represent violations of framework safety principles
 */
export class ConstitutionalViolationError extends Error {
  constructor(
    public violation: string,
    public remedy: string,
    public severity: 'warning' | 'error' | 'critical'
  ) {
    super(`Constitutional Violation: ${violation}\nRemedy: ${remedy}`);
    this.name = 'ConstitutionalViolationError';
  }
}

/**
 * Validates remediation plan against constitutional requirements
 * Throws ConstitutionalViolationError for serious violations
 */
export function validateRemediationPlan(plan: unknown): RemediationPlan {
  try {
    return RemediationPlanSchema.parse(plan);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const criticalIssues = error.issues.filter(err => 
        err.path.some(segment => 
          typeof segment === 'string' && 
          ['rollbackPlan', 'validationSteps', 'dryRunSimulation'].includes(segment)
        )
      );
      
      if (criticalIssues.length > 0) {
        throw new ConstitutionalViolationError(
          `Critical safety mechanism missing: ${criticalIssues.map(i => i.message).join(', ')}`,
          'All remediation plans must include rollback strategies, validation steps, and dry-run simulations',
          'critical'
        );
      }
    }
    throw error;
  }
}

/**
 * Default constitutional remediation plan template
 * Provides safe defaults for all required fields
 */
export const createBaseRemediationPlan = (
  name: string,
  targetPath: string,
  detectedIssues: string[]
): Partial<RemediationPlan> => ({
  name,
  description: `Constitutional remediation plan for ${name}`,
  version: "1.0.0",
  aegisFrameworkVersion: "2.0.0-alpha-dev",
  mode: "strict",
  intent: `Remediate detected framework compliance issues: ${detectedIssues.join(', ')}`,
  context: "AI-generated remediation plan with constitutional safety guarantees",
  
  targetProject: {
    path: targetPath,
    type: "unknown",
    detectedIssues
  },
  
  planValidation: {
    schemaValidated: true,
    preflightTested: false,
    dryRunExecuted: false,
    toolingVerified: false,
    peerReviewed: false,
    constitutionallyCompliant: true
  },
  
  overallRollbackStrategy: {
    strategy: 'git-snapshot',
    restoreInstructions: 'Use git reset --hard to restore from snapshot',
    testRollback: true,
    validationSteps: [{
      name: 'verify-rollback',
      command: 'git status --porcelain',
      description: 'Verify working directory is clean after rollback',
      required: true,
      rollbackOnFailure: false
    }]
  },
  
  ciIntegration: {
    required: true,
    complianceChecks: [],
    preflightGates: [
      {
        name: 'build-check',
        command: 'npm run build',
        blocking: true
      },
      {
        name: 'test-check', 
        command: 'npm test',
        blocking: true
      }
    ],
    postExecutionValidation: ['npm run build', 'npm test', 'npm run lint'],
    failureActions: ['rollback', 'notify']
  },
  
  emergencyProcedures: {
    escalationPath: 'Follow constitutional amendment process for framework failures',
    emergencyContacts: ['framework-maintainers@aegis.framework'],
    failsafeActions: ['git-snapshot-restore', 'emergency-rollback', 'escalate-to-maintainers']
  },
  
  successCriteria: [
    {
      criterion: 'Build successful',
      measurementMethod: 'npm run build',
      acceptanceThreshold: 'zero errors'
    },
    {
      criterion: 'Tests passing',
      measurementMethod: 'npm test',
      acceptanceThreshold: '100% pass rate'
    },
    {
      criterion: 'Constitutional compliance',
      measurementMethod: 'node tools/validate-constitution.ts',
      acceptanceThreshold: 'full compliance'
    }
  ],
  
  approvalRequired: true,
  constitutionalReview: true,
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString(),
  estimatedCompletionTime: 'TBD'
});
