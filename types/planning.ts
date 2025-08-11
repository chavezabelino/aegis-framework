/**
 * @aegisBlueprint: planning-optimization
 * @version: 2.5.0
 * @mode: strict
 * @intent: Type definitions for planning CLI and validation
 * @context: Centralized types for planning system components
 * @model: claude-3-5-sonnet
 * @hash: 8f7e3a2b1c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0
 */

export type PlanClass = 'MVP-Fix' | 'Surgical-Refactor' | 'Systemic-Change';

export interface PlanningChange {
  file: string;
  action: string;
  reason: string;
}

export interface PlanningPlan {
  planClass: PlanClass;
  contracts: string[];
  changes: PlanningChange[];
  tests: string[];
  risks: string[];
  rollback: string[];
  doneWhen: string[];
}

export interface PlanningError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

export interface PlanningValidationResult {
  isValid: boolean;
  errors: PlanningError[];
  warnings: PlanningError[];
}
