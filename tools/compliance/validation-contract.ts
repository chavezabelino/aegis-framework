export type ValidationStatus = 'pass' | 'fail' | 'error';

export interface ValidationIssue {
  code: string;
  message: string;
  path?: string[]; // optional JSON pointer path
  hint?: string;
}

export interface ValidationReport {
  claimId: string;
  title: string;
  status: ValidationStatus;
  summary?: string;
  issues: ValidationIssue[];
  evidence?: string[];
  meta?: Record<string, unknown>;
}

/**
 * CLI contract:
 * - Validators MUST support `--json` to emit a ValidationReport to stdout as JSON.
 * - Exit codes:
 *   - 0: pass
 *   - 1: fail (validation failed)
 *   - 2+: error (tooling/runtime error)
 */
