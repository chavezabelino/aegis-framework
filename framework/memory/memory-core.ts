/**
 * @aegisFrameworkVersion: 2.5.0
 * @intent: Core memory interfaces and base classes for Aegis Memory Subsystem
 * @context: Constitutional memory governance with dual-layer architecture (Lite + Heavy)
 * @mode: strict
 */

import { z } from 'zod';

// ============================================================================
// CONSTITUTIONAL MEMORY SCHEMAS
// ============================================================================

/**
 * Memory Message Schema - Constitutional validation for all memory messages
 */
export const MemoryMessageSchema = z.object({
  role: z.enum(['user', 'agent', 'tool', 'system', 'memory', 'summarized']),
  content: z.string().min(1, 'Memory content cannot be empty'),
  timestamp: z.string().datetime('Invalid timestamp format'),
  tags: z.array(z.string()).optional(),
  curated: z.boolean().optional(),
  blueprintId: z.string().min(1, 'Blueprint ID is required'),
  schemaVersion: z.string().min(1, 'Schema version is required'),
  observabilityEvents: z.array(z.string()).optional(),
});

export type MemoryMessage = z.infer<typeof MemoryMessageSchema>;

/**
 * Memory Snapshot Schema - Constitutional validation for memory snapshots
 */
export const MemorySnapshotSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['project', 'persona', 'system', 'drift', 'lite_summary']),
  created: z.string().datetime('Invalid creation timestamp'),
  createdBy: z.enum(['agent', 'user', 'system']),
  schema: z.string().min(1, 'Schema identifier is required'),
  content: z.union([z.string(), z.record(z.string(), z.any())]),
  blueprintId: z.string().min(1, 'Blueprint ID is required'),
  schemaVersion: z.string().min(1, 'Schema version is required'),
  observabilityEvents: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type MemorySnapshot = z.infer<typeof MemorySnapshotSchema>;

/**
 * Memory Commit Schema - Constitutional validation for memory commits
 */
export const MemoryCommitSchema = z.object({
  id: z.string().uuid(),
  snapshotId: z.string().uuid(),
  timestamp: z.string().datetime('Invalid commit timestamp'),
  author: z.string().min(1, 'Commit author is required'),
  message: z.string().min(1, 'Commit message is required'),
  blueprintId: z.string().min(1, 'Blueprint ID is required'),
  schemaVersion: z.string().min(1, 'Schema version is required'),
  observabilityEvents: z.array(z.string()).optional(),
  parentCommitId: z.string().uuid().optional(),
});

export type MemoryCommit = z.infer<typeof MemoryCommitSchema>;

/**
 * Memory Filter Schema - Constitutional validation for memory filtering
 */
export const MemoryFilterSchema = z.object({
  tags: z.array(z.string()).optional(),
  schema: z.string().optional(),
  type: z.enum(['project', 'persona', 'system', 'drift', 'lite_summary']).optional(),
  dateRange: z
    .object({
      start: z.string().datetime().optional(),
      end: z.string().datetime().optional(),
    })
    .optional(),
  blueprintId: z.string().optional(),
  limit: z.number().positive().optional(),
});

export type MemoryFilter = z.infer<typeof MemoryFilterSchema>;

// ============================================================================
// CORE MEMORY INTERFACES
// ============================================================================

/**
 * Base interface for all memory operations
 * Constitutional compliance interface
 */
export interface MemoryModule {
  readonly blueprintId: string;
  readonly schemaVersion: string;
  readonly observabilityEvents: string[];

  // Constitutional compliance methods
  validateConstitutionalCompliance(): Promise<boolean>;
  emitObservabilityEvent(event: string, data?: any): void;
}

/**
 * Lite Memory Interface - Transient contextual layer
 * Fast, ephemeral, task-scoped memory for prompt enrichment and context tracking
 */
export interface LiteMemory extends MemoryModule {
  readonly tokenLimit: number;
  readonly messages: MemoryMessage[];

  // Core operations
  append(message: MemoryMessage): Promise<void>;
  generateContext(): Promise<string>;
  summarize(): Promise<MemorySnapshot>;
  forget(criteria: MemoryFilter): Promise<void>;
  pin(messageId: string): Promise<void>;
  unpin(messageId: string): Promise<void>;

  // Token management
  getTokenCount(): number;
  truncateToLimit(): Promise<void>;

  // Constitutional compliance
  validateMessage(message: MemoryMessage): Promise<boolean>;
  emitMemoryEvent(event: string, data?: any): void;
}

/**
 * Heavy Memory Store Interface - Persistent reflective layer
 * Structured, semantically tagged long-term memory for reflection and audit
 */
export interface HeavyMemoryStore extends MemoryModule {
  readonly storage: MemoryStorage;
  readonly schemaRegistry: MemorySchemaRegistry;

  // Core operations
  commit(snapshot: MemorySnapshot): Promise<MemoryCommit>;
  load(filter: MemoryFilter): Promise<MemorySnapshot[]>;
  diff(commitId1: string, commitId2: string): Promise<MemoryDiff>;
  replay(commitId: string): Promise<MemoryReplay>;

  // Schema management
  registerSchema(schema: MemorySchema): Promise<void>;
  validateSchema(schemaId: string, data: any): Promise<boolean>;

  // Constitutional compliance
  validateSnapshot(snapshot: MemorySnapshot): Promise<boolean>;
  emitMemoryEvent(event: string, data?: any): void;
}

// ============================================================================
// SUPPORTING INTERFACES
// ============================================================================

/**
 * Memory Storage Interface - Abstract storage layer
 */
export interface MemoryStorage {
  store(snapshot: MemorySnapshot): Promise<string>;
  retrieve(snapshotId: string): Promise<MemorySnapshot | null>;
  search(filter: MemoryFilter): Promise<MemorySnapshot[]>;
  delete(snapshotId: string): Promise<boolean>;

  // Constitutional compliance
  validateStorage(): Promise<boolean>;
  backup(): Promise<string>;
  restore(backupId: string): Promise<boolean>;
}

/**
 * Memory Schema Registry Interface - Schema management
 */
export interface MemorySchemaRegistry {
  register(schema: MemorySchema): Promise<void>;
  get(schemaId: string): Promise<MemorySchema | null>;
  validate(schemaId: string, data: any): Promise<boolean>;
  list(): Promise<MemorySchema[]>;

  // Constitutional compliance
  validateRegistry(): Promise<boolean>;
}

/**
 * Memory Schema Interface - Schema definition
 */
export interface MemorySchema {
  id: string;
  version: string;
  description: string;
  schema: z.ZodSchema;
  blueprintId: string;
  observabilityEvents: string[];
}

/**
 * Memory Diff Interface - Diff representation
 */
export interface MemoryDiff {
  commitId1: string;
  commitId2: string;
  added: MemorySnapshot[];
  removed: MemorySnapshot[];
  modified: Array<{
    before: MemorySnapshot;
    after: MemorySnapshot;
    changes: string[];
  }>;
  timestamp: string;
  blueprintId: string;
}

/**
 * Memory Replay Interface - Replay representation
 */
export interface MemoryReplay {
  commitId: string;
  snapshot: MemorySnapshot;
  context: string;
  metadata: Record<string, any>;
  timestamp: string;
  blueprintId: string;
}

// ============================================================================
// CONSTITUTIONAL MEMORY EVENTS
// ============================================================================

/**
 * Standard memory observability events
 * All memory operations must emit these events for constitutional compliance
 */
export const MEMORY_EVENTS = {
  // Lite Memory Events
  LITE_MEMORY_APPEND: 'lite_memory_append',
  LITE_MEMORY_GENERATE_CONTEXT: 'lite_memory_generate_context',
  LITE_MEMORY_SUMMARIZE: 'lite_memory_summarize',
  LITE_MEMORY_FORGET: 'lite_memory_forget',
  LITE_MEMORY_PIN: 'lite_memory_pin',
  LITE_MEMORY_UNPIN: 'lite_memory_unpin',
  LITE_MEMORY_TRUNCATE: 'lite_memory_truncate',

  // Heavy Memory Events
  HEAVY_MEMORY_COMMIT: 'heavy_memory_commit',
  HEAVY_MEMORY_LOAD: 'heavy_memory_load',
  HEAVY_MEMORY_DIFF: 'heavy_memory_diff',
  HEAVY_MEMORY_REPLAY: 'heavy_memory_replay',
  HEAVY_MEMORY_SCHEMA_REGISTER: 'heavy_memory_schema_register',
  HEAVY_MEMORY_SCHEMA_VALIDATE: 'heavy_memory_schema_validate',

  // Constitutional Compliance Events
  MEMORY_VALIDATION_SUCCESS: 'memory_validation_success',
  MEMORY_VALIDATION_FAILURE: 'memory_validation_failure',
  MEMORY_CONSTITUTIONAL_COMPLIANCE: 'memory_constitutional_compliance',
  MEMORY_CONSTITUTIONAL_VIOLATION: 'memory_constitutional_violation',

  // Error Events
  MEMORY_QUOTA_EXCEEDED: 'memory_quota_exceeded',
  MEMORY_SCHEMA_VALIDATION_FAILED: 'memory_schema_validation_failed',
  MEMORY_STORAGE_ERROR: 'memory_storage_error',
  MEMORY_OPERATION_FAILED: 'memory_operation_failed',
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validate memory message against constitutional schemas
 */
export function validateMemoryMessage(message: MemoryMessage): Promise<boolean> {
  try {
    MemoryMessageSchema.parse(message);
    return Promise.resolve(true);
  } catch (error) {
    return Promise.resolve(false);
  }
}

/**
 * Validate memory snapshot against constitutional schemas
 */
export function validateMemorySnapshot(snapshot: MemorySnapshot): Promise<boolean> {
  try {
    MemorySnapshotSchema.parse(snapshot);
    return Promise.resolve(true);
  } catch (error) {
    return Promise.resolve(false);
  }
}

/**
 * Generate constitutional memory event
 */
export function generateMemoryEvent(
  event: string,
  blueprintId: string,
  data?: any
): { event: string; timestamp: string; blueprintId: string; data?: any } {
  return {
    event,
    timestamp: new Date().toISOString(),
    blueprintId,
    data,
  };
}

/**
 * Calculate token count for memory content
 * Uses tiktoken or similar tokenizer
 */
export async function calculateTokenCount(content: string): Promise<number> {
  // TODO: Implement token counting logic
  // This is a placeholder - should use actual tokenizer
  return Math.ceil(content.length / 4); // Rough approximation
}

/**
 * Generate unique memory ID
 */
export function generateMemoryId(): string {
  return crypto.randomUUID();
}

/**
 * Generate memory timestamp
 */
export function generateMemoryTimestamp(): string {
  return new Date().toISOString();
}
