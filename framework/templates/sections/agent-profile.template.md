<!--
@aegisFrameworkVersion: 2.4.0
@intent: Template section for agent instructions
@context: Modular content for framework instruction generation
-->
## 🎯 <%= agent.displayName %> Specific Guidance

### Your Capabilities
- **Languages**: <%= agent.capabilities.languages.join(', ') %>
- **Specializations**: <%= agent.capabilities.specializations.join(', ') %>
- **Coordination**: <%= agent.coordination.handoffs ? 'Multi-agent coordination supported' : 'Single-agent mode only' %>

### Operational Execution Modes
1. **Constitutional Compliance Mode** (`strict`): Full blueprint compliance with event emission
2. **Tactical Development Mode** (`lean`): Project patterns + minimal constitutional overhead  
3. **Emergency Fix Mode**: Critical patches with reduced validation (still annotated)

### Integration Patterns
- **Enterprise/Multi-Agent**: Use full Aegis constitutional governance
- **Single-Repo/Tactical**: Emphasize Kilo operational patterns with constitutional annotations
- **Hybrid**: Constitutional annotations + operational discipline (recommended default)
