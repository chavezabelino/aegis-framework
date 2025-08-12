# Aegis Prompt Cache & Optimization System - Design Document

## Guardrails Check

### (a) Type Safety
- **Zod-first schemas** for all data models (PromptBlock, PromptScaffold, Checkpoint, etc.)
- **Strict TypeScript** throughout with no `any` types
- **Schema validation** at runtime for all cache operations
- **Type-safe provider adapters** with discriminated unions

### (b) Developer Ergonomics
- **Minimal surface APIs**: Single `resolveScaffold()` function for most use cases
- **Clean DX**: Intuitive CLI commands (`aegis:cache:resolve`, `aegis:cache:checkpoint`)
- **Composable interfaces**: Small, focused modules that compose well
- **Clear error messages**: Descriptive failures with actionable guidance

### (c) Runtime/Theme & DB-driven tokens
- **UI theme tokens**: Enforced where UI components are generated
- **Database tokens**: Respects repo config and redaction rules
- **Environment-aware**: Adapts to development vs production contexts
- **Token validation**: Ensures theme and DB tokens are properly used

### (d) Kilo-grade extensibility
- **Plugin architecture**: Provider adapters can be extended
- **Rulepack system**: Custom validation rules can be added
- **Schema evolution**: Backward-compatible schema changes
- **Performance hooks**: Observable performance metrics for optimization

## Assumptions & Non-Goals

### Assumptions
- **Provider APIs are stable**: OpenAI, Anthropic, vLLM APIs won't change dramatically
- **Local development**: SQLite and local file storage are sufficient for development
- **Single-user**: No multi-user concurrency requirements initially
- **TypeScript focus**: Primary language support is TypeScript/TSX
- **Aegis integration**: System will be integrated with existing Aegis workflows

### Non-Goals (v1)
- **Multi-user concurrency**: No distributed locking or user isolation
- **Real-time collaboration**: No live collaboration features
- **Advanced ML optimization**: No machine learning-based cache optimization
- **Cross-language support**: No support for languages beyond TypeScript/TSX
- **Distributed caching**: No Redis or distributed cache support
- **Advanced analytics**: No complex analytics or ML insights

## Architecture Options

### Option 1: Monolithic Cache Store (Not Recommended)

**Component Diagram:**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Prompt Cache  │    │   Checkpoint    │    │   Telemetry     │
│   (SQLite)      │    │   Store (PG)    │    │   (File)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Monolithic    │
                    │   Controller    │
                    └─────────────────┘
```

**Pros:**
- Simple to implement
- Single point of control
- Easy to debug

**Cons:**
- Tight coupling
- Hard to test individual components
- Difficult to extend
- Single point of failure

**Risks:**
- High coupling makes changes risky
- Performance bottlenecks
- Difficult to optimize individual components

**Migration Path:**
- Would require complete rewrite for any significant changes

### Option 2: Microservices Architecture (Overkill for v1)

**Component Diagram:**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Cache Service  │    │ Checkpoint      │    │ Telemetry       │
│  (SQLite)       │    │ Service (PG)    │    │ Service (File)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   API Gateway   │
                    └─────────────────┘
```

**Pros:**
- Highly scalable
- Independent deployment
- Technology flexibility

**Cons:**
- Complex to implement
- Network overhead
- Distributed system complexity
- Overkill for initial requirements

**Risks:**
- Distributed system failures
- Network latency
- Complex debugging

**Migration Path:**
- Would require significant infrastructure changes

### Option 3: Modular Architecture with Shared Interfaces (Recommended)

**Component Diagram:**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cache Store   │    │ Checkpoint      │    │   Artifact      │
│   (SQLite)      │    │ Store (PG)      │    │   Store (PG)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Shared        │
                    │   Interfaces    │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Provider      │
                    │   Adapters      │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Standards     │
                    │   Enforcer      │
                    └─────────────────┘
```

**Pros:**
- Loose coupling
- Easy to test
- Extensible
- Clear separation of concerns
- Shared interfaces enable composition

**Cons:**
- More initial complexity
- Interface design challenges

**Risks:**
- Interface design mistakes
- Potential over-abstraction

**Migration Path:**
- Can evolve individual components independently
- Easy to add new providers or storage backends

## Recommended Architecture

### Components

1. **Scaffold Cache (SQLite)**
   - Local SQLite database for prompt caching
   - Stable hashing for cache keys
   - Automatic rotation and cleanup
   - Provider-specific optimization

2. **Checkpoint Store (Neon Postgres)**
   - LangGraph-compatible checkpoint storage
   - Graph node relationships
   - Branch and revision support
   - Full audit trail

3. **Artifacts & Tool Traces Store (Neon Postgres)**
   - Persistent scratchpad storage
   - Tool execution trace recording
   - Span-based re-execution support
   - Artifact linking and provenance

4. **Compliance Enforcer**
   - Constitutional standards validation
   - Rulepack execution
   - CI/CD integration
   - Fail-fast on violations

5. **Replay CLI**
   - Deterministic replay engine
   - Semantic diff computation
   - Override support
   - Verification and analysis

6. **Telemetry Middleware**
   - Cost and latency tracking
   - Cache performance monitoring
   - Provenance linking
   - Performance analysis

7. **Shared Schemas**
   - Zod schemas for all data models
   - Type-safe interfaces
   - Schema validation
   - Evolution support

### Data Models (Zod)

```typescript
// PromptBlock - Individual prompt block with stable hash
const PromptBlockSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  type: z.enum(['requirements', 'file_map', 'style_guide', 'context']),
  hash: z.string().length(64), // SHA-256
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

// PromptScaffold - Complete prompt scaffold with blocks
const PromptScaffoldSchema = z.object({
  id: z.string().uuid(),
  blocks: z.array(PromptBlockSchema),
  provider: z.enum(['openai', 'anthropic', 'vllm', 'sglang', 'llama-cpp']),
  model: z.string(),
  temperature: z.number().min(0).max(2),
  seed: z.number().optional(),
  hash: z.string().length(64),
  createdAt: z.string().datetime()
});

// ResolveInput - Input for scaffold resolution
const ResolveInputSchema = z.object({
  prompt: z.string(),
  provider: z.enum(['openai', 'anthropic', 'vllm', 'sglang', 'llama-cpp']),
  model: z.string(),
  temperature: z.number().min(0).max(2).default(0),
  seed: z.number().optional(),
  rulepacks: z.array(z.string()).default([]),
  context: z.record(z.unknown()).optional()
});

// ResolvedScaffold - Resolved scaffold with provider-specific formatting
const ResolvedScaffoldSchema = z.object({
  id: z.string().uuid(),
  originalScaffold: PromptScaffoldSchema,
  resolvedContent: z.string(),
  providerFormat: z.string(),
  tokenCount: z.number(),
  estimatedCost: z.number(),
  cacheHit: z.boolean(),
  createdAt: z.string().datetime()
});

// GraphNode - LangGraph node with checkpoint data
const GraphNodeSchema = z.object({
  id: z.string().uuid(),
  nodeType: z.enum(['plan', 'module', 'file']),
  state: z.record(z.unknown()),
  inputs: z.record(z.unknown()),
  outputs: z.record(z.unknown()),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.string().datetime()
});

// Checkpoint - Checkpoint with graph state and metadata
const CheckpointSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  scaffoldId: z.string().uuid(),
  nodes: z.array(GraphNodeSchema),
  state: z.record(z.unknown()),
  metadata: z.record(z.unknown()).optional(),
  parentId: z.string().uuid().optional(),
  branchId: z.string().uuid().optional(),
  createdAt: z.string().datetime()
});

// ScratchpadArtifact - Persistent scratchpad artifact
const ScratchpadArtifactSchema = z.object({
  id: z.string().uuid(),
  checkpointId: z.string().uuid(),
  content: z.string(),
  type: z.enum(['note', 'code', 'test', 'lint']),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.string().datetime()
});

// ToolTrace - Tool execution trace with inputs/outputs
const ToolTraceSchema = z.object({
  id: z.string().uuid(),
  checkpointId: z.string().uuid(),
  toolName: z.string(),
  inputs: z.record(z.unknown()),
  outputs: z.record(z.unknown()),
  duration: z.number(),
  success: z.boolean(),
  error: z.string().optional(),
  createdAt: z.string().datetime()
});

// TelemetryRecord - Telemetry record with cost and performance data
const TelemetryRecordSchema = z.object({
  id: z.string().uuid(),
  scaffoldId: z.string().uuid(),
  checkpointId: z.string().uuid().optional(),
  operation: z.enum(['resolve', 'checkpoint', 'replay', 'enforce']),
  tokenCount: z.number(),
  cost: z.number(),
  latency: z.number(),
  cacheHit: z.boolean(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.string().datetime()
});
```

### Key APIs

```typescript
// Core scaffold resolution with caching
async function resolveScaffold(input: ResolveInput): Promise<ResolvedScaffold>

// Checkpoint operations
async function saveCheckpoint(scaffoldId: string, state: unknown, name?: string): Promise<Checkpoint>
async function getCheckpoint(id: string): Promise<Checkpoint>
async function branchFrom(checkpointId: string, name: string): Promise<Checkpoint>

// Scratchpad operations
async function addScratchpad(checkpointId: string, content: string, type: string): Promise<ScratchpadArtifact>
async function listScratchpads(checkpointId: string): Promise<ScratchpadArtifact[]>

// Tool trace operations
async function addToolTrace(checkpointId: string, toolName: string, inputs: unknown, outputs: unknown): Promise<ToolTrace>
async function listToolTraces(checkpointId: string): Promise<ToolTrace[]>

// Standards enforcement
async function enforceStandards(content: string, rulepacks: string[]): Promise<ComplianceReport>

// Replay operations
async function replay(checkpointId: string, overrides?: unknown): Promise<ReplayResult>
```

### Determinism & Replay

**Span Hash Computation:**
```typescript
function computeSpanHash(content: string, context: unknown): string {
  const canonical = JSON.stringify({
    content,
    context: sortObjectKeys(context),
    timestamp: Math.floor(Date.now() / 1000) // Round to second for determinism
  });
  return createHash('sha256').update(canonical).digest('hex');
}
```

**Re-execution Triggers:**
- Content hash mismatch
- Context changes
- Provider/model changes
- Temperature/seed changes
- Rulepack changes

**Diff Production:**
```typescript
function computeASTDiff(original: string, modified: string): ASTDiff {
  const originalAST = parseTypeScript(original);
  const modifiedAST = parseTypeScript(modified);
  return diffAST(originalAST, modifiedAST);
}
```

### Telemetry

**Token Counts:**
- Input tokens per provider
- Output tokens per provider
- Total tokens per operation

**Latency:**
- Cache lookup time
- Provider API latency
- Total operation time

**Cost Estimates:**
- Per-provider pricing
- Real-time cost tracking
- Cost optimization suggestions

**Cache Performance:**
- Hit rates by scaffold type
- Miss analysis
- Optimization opportunities

## Standards/Rules Gate

### Exact Checks

**ESLint Rules:**
```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

**Vitest Thresholds:**
```json
{
  "coverage": {
    "branches": 90,
    "functions": 90,
    "lines": 90,
    "statements": 90
  }
}
```

**AST Validations:**
- No `any` types
- Proper TypeScript strict mode
- Consistent import/export patterns
- Proper error handling

**Theme Token Enforcement (UI):**
- Use theme tokens for colors, spacing, typography
- No hardcoded values
- Proper accessibility attributes
- Responsive design patterns

### Merge-Blocking Criteria

1. **Standards Violations**: Any ESLint errors or TypeScript strict mode violations
2. **Test Coverage**: Below 90% coverage threshold
3. **AST Validation**: Any `any` types or unsafe patterns
4. **Theme Violations**: Hardcoded values in UI components
5. **Accessibility Issues**: Missing a11y attributes or patterns

## CI/CD Plan

### GitHub Actions Jobs

**Cache Performance Monitoring:**
```yaml
name: Cache Performance
on: [push, pull_request]
jobs:
  cache-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Analyze Cache Performance
        run: pnpm aegis:cache:analyze --ci
      - name: Upload Cache Report
        uses: actions/upload-artifact@v4
        with:
          name: cache-performance-report
          path: cache-performance.json
```

**Standards Enforcement:**
```yaml
name: Standards Enforcement
on: [push, pull_request]
jobs:
  enforce-standards:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Enforce Standards
        run: pnpm aegis:cache:enforce --ci --fail-fast
      - name: Upload Compliance Report
        uses: actions/upload-artifact@v4
        with:
          name: compliance-report
          path: compliance-report.json
```

**Replay Verification:**
```yaml
name: Replay Verification
on: [push, pull_request]
jobs:
  replay-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Replay Tests
        run: pnpm test:prompt-cache --replay
      - name: Upload Replay Results
        uses: actions/upload-artifact@v4
        with:
          name: replay-results
          path: replay-results.json
```

### Required Checks

1. **Cache Integrity**: All cache operations pass integrity validation
2. **Standards Compliance**: All code meets constitutional standards
3. **Test Coverage**: >90% coverage for all components
4. **Replay Determinism**: All replay tests pass with identical outputs
5. **Performance Thresholds**: Cache hit rate >80%, latency <100ms

### Artifact Uploads

- Cache performance reports
- Compliance validation reports
- Replay test results
- Telemetry analysis
- Cost optimization suggestions

### PR Comment Summary

```typescript
interface PRSummary {
  cacheHitRate: number;
  costSavings: number;
  standardsCompliance: boolean;
  testCoverage: number;
  replaySuccess: boolean;
  recommendations: string[];
}
```

## Phased Delivery Plan

### Phase 1: Core Infrastructure (v0.1) - Weeks 1-4

**Acceptance Criteria:**
- Basic prompt caching with SQLite
- Provider adapters for OpenAI and Anthropic
- Simple checkpoint save/load
- Basic telemetry tracking

**KPIs:**
- Cache hit rate >60%
- Checkpoint save/load <200ms
- Basic test coverage >80%

### Phase 2: Advanced Features (v0.2) - Weeks 5-8

**Acceptance Criteria:**
- Full checkpoint branching system
- Artifact and tool trace recording
- Standards enforcement
- Deterministic replay

**KPIs:**
- Cache hit rate >75%
- Replay time reduction >40%
- Standards compliance 100%

### Phase 3: Production Ready (v1.0) - Weeks 9-12

**Acceptance Criteria:**
- Complete CI/CD integration
- Advanced telemetry and cost tracking
- Comprehensive test suite
- Full documentation

**KPIs:**
- Cache hit rate >80%
- Replay time reduction >50%
- Test coverage >90%
- Zero defect leakage

## Risk Register & Mitigations

### Provider API Drift

**Risk:** Provider APIs change, breaking adapters
**Mitigation:** 
- Abstract provider interfaces
- Version-specific adapters
- Automated API compatibility testing
- Graceful degradation to fallback providers

### Cache Invalidation

**Risk:** Cache becomes stale or corrupted
**Mitigation:**
- Stable hashing for cache keys
- Cache integrity validation
- Automatic cache rotation
- Fallback to fresh resolution

### Schema Drift

**Risk:** Data model changes break existing data
**Mitigation:**
- Backward-compatible schema evolution
- Migration scripts for data updates
- Schema versioning
- Validation at all boundaries

### Storage Costs

**Risk:** Database storage costs grow unexpectedly
**Mitigation:**
- Data retention policies
- Automatic cleanup of old data
- Cost monitoring and alerts
- Compression for large artifacts

### Performance Hotspots

**Risk:** Performance bottlenecks in critical paths
**Mitigation:**
- Performance monitoring and profiling
- Caching at multiple levels
- Asynchronous operations where possible
- Load testing and optimization

## Appendix

### Stable Hash Util

```typescript
import { createHash } from 'crypto';

export function stableHash(content: string, context?: unknown): string {
  const canonical = JSON.stringify({
    content,
    context: context ? sortObjectKeys(context) : undefined
  });
  return createHash('sha256').update(canonical).digest('hex');
}

function sortObjectKeys(obj: unknown): unknown {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(sortObjectKeys);
  
  const sorted: Record<string, unknown> = {};
  Object.keys(obj as Record<string, unknown>)
    .sort()
    .forEach(key => {
      sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
    });
  return sorted;
}
```

### Provider Adapter Interface

```typescript
interface ProviderAdapter {
  name: string;
  models: string[];
  
  resolveScaffold(scaffold: PromptScaffold): Promise<ResolvedScaffold>;
  estimateTokens(content: string): Promise<number>;
  estimateCost(tokens: number, model: string): Promise<number>;
  
  // Optional: Direct execution
  execute?(prompt: string, options: ExecutionOptions): Promise<ExecutionResult>;
}

interface ExecutionOptions {
  model: string;
  temperature: number;
  seed?: number;
  maxTokens?: number;
}

interface ExecutionResult {
  content: string;
  tokens: number;
  cost: number;
  latency: number;
}
```

### Checkpoint Persistence Interface

```typescript
interface CheckpointStore {
  save(checkpoint: Checkpoint): Promise<void>;
  load(id: string): Promise<Checkpoint | null>;
  branch(parentId: string, name: string): Promise<Checkpoint>;
  list(limit?: number): Promise<Checkpoint[]>;
  delete(id: string): Promise<void>;
}

interface GraphNodeStore {
  save(node: GraphNode): Promise<void>;
  load(id: string): Promise<GraphNode | null>;
  list(checkpointId: string): Promise<GraphNode[]>;
  delete(id: string): Promise<void>;
}
```

### AST Diff Helper (TS/TSX)

```typescript
import { parse, SyntaxKind } from 'typescript';

interface ASTDiff {
  added: ASTNode[];
  removed: ASTNode[];
  modified: ModifiedNode[];
}

interface ModifiedNode {
  original: ASTNode;
  modified: ASTNode;
  changes: NodeChange[];
}

interface NodeChange {
  type: 'property' | 'child' | 'text';
  path: string[];
  original: unknown;
  modified: unknown;
}

function computeASTDiff(original: string, modified: string): ASTDiff {
  const originalAST = parse(original);
  const modifiedAST = parse(modified);
  
  return diffAST(originalAST, modifiedAST);
}

function diffAST(original: ASTNode, modified: ASTNode): ASTDiff {
  // Implementation would traverse both ASTs and compare nodes
  // This is a simplified version
  return {
    added: [],
    removed: [],
    modified: []
  };
}
```

### Enforcer Rulepack Shape

```typescript
interface Rulepack {
  id: string;
  name: string;
  version: string;
  rules: Rule[];
  metadata?: Record<string, unknown>;
}

interface Rule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  validate(content: string, context?: unknown): ValidationResult;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  code: string;
  message: string;
  line?: number;
  column?: number;
  path?: string[];
}

interface ValidationWarning {
  code: string;
  message: string;
  suggestion?: string;
}
```

### Telemetry Wrapper

```typescript
interface TelemetryWrapper {
  record(operation: string, data: TelemetryData): Promise<void>;
  analyze(checkpointId: string): Promise<TelemetryAnalysis>;
  optimize(): Promise<OptimizationRecommendation[]>;
}

interface TelemetryData {
  operation: string;
  scaffoldId: string;
  checkpointId?: string;
  tokenCount: number;
  cost: number;
  latency: number;
  cacheHit: boolean;
  metadata?: Record<string, unknown>;
}

interface TelemetryAnalysis {
  totalCost: number;
  averageLatency: number;
  cacheHitRate: number;
  costByProvider: Record<string, number>;
  performanceTrends: PerformanceTrend[];
}

interface OptimizationRecommendation {
  type: 'cache' | 'provider' | 'model' | 'cost';
  description: string;
  potentialSavings: number;
  implementation: string;
}
```

## Open Questions for Review

1. **Cache Invalidation Strategy**: Should we implement time-based invalidation or rely purely on content hashing?

2. **Provider Priority**: Which providers should be prioritized for initial implementation?

3. **Storage Backend**: Should we consider Redis for high-performance caching in addition to SQLite?

4. **Concurrency Model**: How should we handle concurrent access to checkpoints and artifacts?

5. **Cost Optimization**: What level of cost optimization should be automated vs. manual?

6. **Integration Scope**: How deeply should this integrate with existing Aegis workflows?

7. **Performance Targets**: Are the performance targets (80% hit rate, <100ms operations) realistic?

8. **Schema Evolution**: What's the right balance between schema flexibility and stability?
