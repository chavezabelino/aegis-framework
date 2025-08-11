<!--
@aegisFrameworkVersion: 2.4.0
@intent: Template section for agent instructions
@context: Modular content for framework instruction generation
-->

## 🎯 <%= agent.displayName %> Specific Guidance

### Your Capabilities

- __Languages__: <%= agent.capabilities.languages.join(', ') %>
- __Specializations__: <%= agent.capabilities.specializations.join(', ') %>
- __Coordination__: <%= agent.coordination.handoffs ? 'Multi-agent coordination supported' : 'Single-agent mode only' %>

### Operational Execution Modes

1. __Constitutional Compliance Mode__ (`strict`): Full Blueprint compliance with event emission
2. __Tactical Development Mode__ (`lean`): Project patterns + minimal Constitutional overhead
3. __Emergency Fix Mode__: Critical patches with reduced validation (still annotated)

### Integration Patterns

- __Enterprise/Multi-Agent__: Use full Aegis Constitutional governance
- __Single-Repo/Tactical__: Emphasize Kilo operational patterns with Constitutional annotations
- __Hybrid__: Constitutional annotations + operational discipline (recommended default)
