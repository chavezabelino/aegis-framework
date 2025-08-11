<!--
@aegisFrameworkVersion: <%= frameworkVersion %>
<% if (projectStandards) { %>@intent: Complete <%= agent.displayName %> instructions combining Constitutional compliance with operational excellence
@context: Single source of truth for <%= agent.displayName %> under Aegis Framework + Kilo standards
@generatedFrom: agent-instructions.template.md + project-standards.md
@lastGenerated: <%= lastUpdated %><% } else { %>@intent: Agent-agnostic instructions template for all Aegis agents
@context: Modular, versioned, and assembled from framework docs and agent profiles
@generatedFrom: agent-instructions.template.md<% } %>
-->

# 🤖 <%= agent.displayName %> Instructions for Aegis Framework v<%= frameworkVersion %>

> __Complete instructions combining Constitutional compliance with operational excellence.**

<%- sections.Constitutional %>

<%- sections.frameworkContext %>

<%- sections.agentProfile %>

<%- sections.multiAgent %>

<%- sections.blueprintCompliance %>

<%- sections.mcpMetadata %>

<%- sections.driftDetection %>

<%- sections.cliIntegration %>

<%- sections.validation %>

<%- sections.knowledgeBase %>

## <% if (projectStandards) { %>

<%- projectStandards %> <% } else { %>

<%- sections.aiAgentMode %>

<%- sections.directoryStructure %>

<%- sections.rcaDebugLoop %>

<%- sections.codePatterns %>

<%- sections.decisionMatrix %> <% } %>

---

**Version__: <%= frameworkVersion %> (Enhanced with v2.5 Operational Patterns)  
**Last Updated__: <%= lastUpdated %>  
**Target Agent__: <%= agent.displayName %>  
**Framework Authority__: Aegis Framework Constitution  
**Operational Standards__: Kilo v2.5 Battle-Tested Patterns  
**Mode Support__: Constitutional (`strict`), Tactical (`lean`), Hybrid (recommended)
