/**
 * @aegisFrameworkVersion 2.4.0
 * @intent TypeScript schema definitions for blueprint validation
 * @context Generated from blueprint.schema.json for type safety
 */

export interface BlueprintDeterminismConfig {
  seed?: string | number;
  temperature?: number;
  strictMode?: boolean;
  generationReceipt?: {
    inputHash: string;
    modelVersion: string;
    outputDigest: string;
    timestamp: string;
    reproduced: boolean;
  };
}

export interface BlueprintRoute {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  description?: string;
}

export interface BlueprintProvider {
  name: string;
  type?: string;
  version?: string;
}

export interface BlueprintSelector {
  name: string;
  type: 'data' | 'computed' | 'action';
}

export interface BlueprintRuleContract {
  rule: string;
  version: string;
  enforcement: 'blocking' | 'warning' | 'advisory';
  schema?: Record<string, any>;
}

export interface BlueprintObservabilityEvent {
  name: string;
  schema?: string;
  description?: string;
}

export interface BlueprintTrace {
  operation: string;
  attributes?: Record<string, any>;
}

export interface BlueprintObservability {
  events?: BlueprintObservabilityEvent[];
  traces?: BlueprintTrace[];
}

export interface BlueprintErrorState {
  code: string;
  fallback: string;
  recovery?: string;
}

export interface BlueprintAdapterConfig {
  framework?: string;
  version?: string;
  dependencies?: Record<string, any>;
  config?: Record<string, any>;
}

export interface BlueprintValidation {
  required?: ('build' | 'test' | 'lint' | 'typecheck')[];
  optional?: string[];
}

export interface AegisBlueprint {
  id: string;
  name: string;
  version: string;
  aegisFrameworkVersion: string;
  description?: string;
  determinismConfig?: BlueprintDeterminismConfig;
  requiredRoutes?: BlueprintRoute[];
  requiredProviders?: BlueprintProvider[];
  requiredSelectors?: BlueprintSelector[];
  ruleContracts?: BlueprintRuleContract[];
  observability?: BlueprintObservability;
  errorStates?: BlueprintErrorState[];
  adapters?: Record<string, BlueprintAdapterConfig>;
  validation?: BlueprintValidation;
}

export const BLUEPRINT_SCHEMA_VERSION = '1.0.0';
export const BLUEPRINT_SCHEMA_URL = 'https://aegis-framework.dev/schemas/blueprint.schema.json';
