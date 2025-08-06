## 🎯 <%= agent.displayName %> Specific Guidance

### Your Capabilities
- **Languages**: <%= agent.capabilities.languages.join(', ') %>
- **Specializations**: <%= agent.capabilities.specializations.join(', ') %>
- **Coordination**: <%= agent.coordination.handoffs ? 'Multi-agent coordination supported' : 'Single-agent mode only' %>
