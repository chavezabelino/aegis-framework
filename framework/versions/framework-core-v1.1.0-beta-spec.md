<!--
@aegisFrameworkVersion: 2.3.0-beta
@intent: Multi-agent orchestration and advanced observability features
@migratedFrom: framework-core-v4.7-draft.md
@context:
- This specification defines the next major feature set for Aegis Framework
- Features from the v4.7 draft have been reorganized under semantic versioning
- Target release: Q4 2025 or Q1 2026
-->

# ⚙️ Aegis Framework v1.1.0-beta (Specification)

> Next-generation multi-agent orchestration, observability, and human-in-the-loop drift controls for the Aegis Framework.

## 🎯 Feature Overview

This release introduces advanced orchestration capabilities that enable multiple AI agents to collaborate on complex blueprints while maintaining the core principles of traceability, observability, and reproducibility.

## 🔁 Multi-Agent Execution Layer

### Agent Declaration in Blueprints

```yaml
# blueprints/feat-complex-feature/blueprint.yaml
id: feat-complex-feature
name: Complex Multi-Component Feature
version: 1.0.0
agents:
  primary: github-copilot
  fallback: claude-3-5-sonnet
  specialized:
    - agent: cursor
      role: frontend-components
      scope: ["src/components/**"]
    - agent: windsurf  
      role: backend-api
      scope: ["src/api/**"]
coordination:
  strategy: sequential  # sequential | parallel | hybrid
  handoff:
    - from: cursor
      to: windsurf
      trigger: "frontend components complete"
    - from: windsurf
      to: github-copilot
      trigger: "api endpoints ready"
```

### Agent Capability Resolution

The framework will query each agent's capabilities through the `agent-manifest.json` pattern:

```json
{
  "agentId": "github-copilot",
  "capabilities": {
    "languages": ["typescript", "python", "go"],
    "frameworks": ["react", "next.js", "fastapi"],
    "specializations": ["full-stack", "documentation"],
    "maxTokens": 8192,
    "supportedModes": ["lean", "strict", "generative"]
  },
  "coordinationSupport": {
    "handoffs": true,
    "parallelExecution": false,
    "conflictResolution": "merge-strategy"
  }
}
```

## 📄 Model Context Protocol (MCP) Metadata

### Runtime MCP Context Emission

```yaml
# Example blueprint with MCP metadata
observability:
  mcpContext:
    modelProvider: "openai"
    modelVersion: "gpt-4"
    contextTokens: 4096
    responseTokens: 1024
    temperature: 0.1
    timestamp: "2025-08-05T10:30:00Z"
    sessionId: "aegis-session-12345"
    blueprintHash: "sha256:abc123..."
  events:
    - name: mcp_execution_start
      context: { blueprintId: string, agentId: string }
      mcpFields: ["modelProvider", "contextTokens"]
    - name: mcp_execution_complete  
      context: { outputMode: string, tokenUsage: number }
      mcpFields: ["responseTokens", "temperature"]
```

### MCP-Compatible Output Format

```json
{
  "aegis": {
    "blueprintId": "feat-complex-feature",
    "version": "1.1.0-beta",
    "mode": "strict"
  },
  "mcp": {
    "protocol_version": "1.0",
    "model": {
      "provider": "openai",
      "name": "gpt-4-turbo",
      "version": "2024-04-09"
    },
    "usage": {
      "prompt_tokens": 4096,
      "completion_tokens": 1024,
      "total_tokens": 5120
    },
    "metadata": {
      "temperature": 0.1,
      "top_p": 1.0,
      "session_id": "aegis-session-12345"
    }
  }
}
```

## 🧠 Drift Logging & Human-in-the-Loop

### Drift Detection Schema

```yaml
# drift-log.yaml
driftEvents:
  - id: drift-001
    timestamp: "2025-08-05T10:30:00Z"
    type: "semantic_drift"  # semantic_drift | regression | hallucination | performance
    severity: "medium"      # low | medium | high | critical
    detection:
      method: "automated"   # automated | human_reported | validation_failure
      source: "snapshot_test_failure"
    context:
      blueprintId: "feat-user-auth"
      expectedOutput: "Login form with email validation"
      actualOutput: "Login form without validation"
      agentId: "github-copilot"
      mode: "strict"
    resolution:
      action: "human_intervention_required"
      assignee: "developer@company.com"
      notes: "Agent skipped required validation rules"
    metadata:
      mcpContext: { ... }
      blueprintHash: "sha256:def456..."
```

### Human Intervention Workflow

```bash
# CLI commands for drift management
aegis drift list --severity=high
aegis drift review drift-001 --approve
aegis drift replay feat-user-auth --fix-mode=guided
```

## 🏗️ Enhanced Adapter Interface

### Tech Stack Translation Protocol

```typescript
// adapters/react-next/blueprint-adapter.ts
interface AdapterInterface {
  name: string;
  version: string;
  supportedModes: ExecutionMode[];
  
  translateBlueprint(blueprint: Blueprint): TechStackBlueprint;
  validateOutput(output: any): ValidationResult;
  generateScaffold(blueprint: Blueprint): FileStructure;
  
  // New in v1.1.0-beta
  supportsMultiAgent(): boolean;
  handleAgentHandoff(context: HandoffContext): HandoffResult;
  resolveDependencies(components: Component[]): DependencyGraph;
}
```

## 📊 Blueprint Execution Metadata

### Run Logs & Telemetry

```json
{
  "executionId": "exec-12345",
  "blueprintId": "feat-complex-feature", 
  "startTime": "2025-08-05T10:30:00Z",
  "endTime": "2025-08-05T10:45:00Z",
  "agents": [
    {
      "agentId": "cursor",
      "role": "frontend-components",
      "startTime": "2025-08-05T10:30:00Z",
      "endTime": "2025-08-05T10:35:00Z",
      "outputMode": "strict",
      "tokenUsage": 2048,
      "filesGenerated": ["src/components/LoginForm.tsx"],
      "status": "completed"
    },
    {
      "agentId": "windsurf",
      "role": "backend-api", 
      "startTime": "2025-08-05T10:36:00Z",
      "endTime": "2025-08-05T10:42:00Z",
      "outputMode": "strict",
      "tokenUsage": 3072,
      "filesGenerated": ["src/api/auth.ts"],
      "status": "completed"
    }
  ],
  "coordination": {
    "strategy": "sequential",
    "handoffs": [
      {
        "from": "cursor",
        "to": "windsurf",
        "timestamp": "2025-08-05T10:35:30Z",
        "trigger": "frontend components complete",
        "context": "LoginForm component ready for API integration"
      }
    ]
  },
  "outputs": {
    "lean": "output.lean.json",
    "strict": "output.strict.json", 
    "generative": "output.full.json"
  },
  "validation": {
    "schemaCompliance": true,
    "visualRegression": "passed",
    "snapshotTests": "passed"
  }
}
```

## 🚀 Migration Path from v1.0.0-alpha

### Breaking Changes
- Blueprint schema now supports `agents` and `coordination` fields
- MCP metadata emission becomes mandatory for observability
- Drift logging requires `drift-log.yaml` configuration

### Upgrade Process
1. Update blueprint schemas to include agent coordination
2. Configure MCP metadata emission points
3. Set up drift logging infrastructure
4. Test multi-agent workflows in staging environment

### Backward Compatibility
- Single-agent blueprints continue to work without modification
- Existing output formats remain valid
- Previous validation tools continue to function
