/*
@aegisBlueprint: enhanced-blueprint-auto-repair
@version: 1.2.1
@mode: lean
@intent: Type definitions for ML-driven blueprint auto-repair engine
@context: Shared types for blueprint, error patterns, and repair actions used by auto-repair-ml-engine.ts
*/

export interface Blueprint {
  id: string;
  version: string;
  content: any;
}

export interface ErrorPattern {
  code: string;
  description: string;
  confidence: number;
}

export interface RepairAction {
  patternCode: string;
  action: string;
  applied: boolean;
  details?: string;
}
