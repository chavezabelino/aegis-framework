<!--
@aegisFrameworkVersion: 2.4.0
@intent: Multi-agent orchestration template section
@context: Agent coordination patterns and handoff protocols
-->

## 🔁 Multi-Agent Orchestration Protocol

### Agent Coordination Schema
```typescript
interface AgentHandoff {
  fromAgent: string;
  toAgent: string;
  reason: 'complex_analysis' | 'specialized_domain' | 'workload_distribution';
  context: {
    blueprintId: string;
    currentState: string;
    requirements: string[];
  };
  continuationPlan: string;
}
```

### Handoff Patterns
```typescript
// Complex analysis handoff
await handoffToAgent({
  fromAgent: 'github-copilot',
  toAgent: 'claude-3-5-sonnet',
  reason: 'complex_analysis',
  context: {
    blueprintId: 'feat-advanced-analytics',
    currentState: 'initial_implementation',
    requirements: ['performance_optimization', 'error_handling']
  }
});

// Specialized domain handoff
await handoffToAgent({
  fromAgent: 'claude-3-5-sonnet',
  toAgent: 'github-copilot',
  reason: 'specialized_domain',
  context: {
    blueprintId: 'feat-ui-components',
    currentState: 'design_complete',
    requirements: ['react_implementation', 'typescript_types']
  }
});
```

### Agent Manifest System
```json
{
  "agents": [
    {
      "id": "github-copilot",
      "capabilities": ["typescript", "python", "go", "javascript"],
      "specializations": ["full-stack", "documentation", "testing"],
      "coordinationSupported": true
    },
    {
      "id": "claude-3-5-sonnet",
      "capabilities": ["analysis", "architecture", "complex_reasoning"],
      "specializations": ["system_design", "debugging", "optimization"],
      "coordinationSupported": true
    }
  ]
}
```

### Coordination Events
- `agent.handoff.initiated`
- `agent.handoff.completed`
- `agent.coordination.sync`
- `agent.workload.distributed`
