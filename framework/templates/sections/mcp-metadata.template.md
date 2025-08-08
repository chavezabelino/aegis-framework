<!--
@aegisFrameworkVersion: 2.4.0
@intent: MCP metadata emission template section
@context: Event schemas and observability patterns for agents
-->

## 📄 MCP Metadata Emission

### Event Schema Structure
```typescript
interface MCPEvent {
  timestamp: string;
  eventType: string;
  agentId: string;
  blueprintId: string;
  correlationId: string;
  metadata: Record<string, any>;
}
```

### Required Event Emissions
```typescript
// Blueprint lifecycle events
await emitEvent({
  eventType: 'blueprint.validated',
  blueprintId: 'feat-example',
  metadata: { validationResult: 'passed' }
});

// Agent coordination events
await emitEvent({
  eventType: 'agent.handoff',
  agentId: 'github-copilot',
  metadata: { targetAgent: 'claude-3-5-sonnet', reason: 'complex_analysis' }
});

// Drift detection events
await emitEvent({
  eventType: 'drift.detected',
  metadata: { driftType: 'agent-behavior', severity: 'medium' }
});
```

### Observability Files
- `framework/observability/events.jsonl` — General framework events
- `framework/observability/apprenticeship-events.jsonl` — Learning telemetry
- `framework/drift-log/agent-behavior-drift.json` — Agent drift tracking
- `framework/drift-log/framework-system-drift.json` — System drift tracking
- `framework/drift-log/user-workflow-drift.json` — Workflow drift tracking
