<!--
@aegisFrameworkVersion: <%= frameworkVersion %>
<% if (projectStandards) { %>@intent: Complete <%= agent.displayName %> instructions combining constitutional compliance with operational excellence
@context: Single source of truth for <%= agent.displayName %> under Aegis Framework + Kilo standards
@generatedFrom: agent-instructions.template.md + project-standards.md
@lastGenerated: <%= lastUpdated %><% } else { %>@intent: Agent-agnostic instructions template for all Aegis agents
@context: Modular, versioned, and assembled from framework docs and agent profiles
@generatedFrom: agent-instructions.template.md<% } %>
-->

# 🤖 <%= agent.displayName %> Instructions for Aegis Framework v<%= frameworkVersion %>

> **Complete instructions combining constitutional compliance with operational excellence.**

<%- sections.constitutional %>

<%- sections.frameworkContext %>

<%- sections.agentProfile %>

<%- sections.multiAgent %>

<%- sections.blueprintCompliance %>

<%- sections.mcpMetadata %>

<%- sections.driftDetection %>

<%- sections.cliIntegration %>

<%- sections.validation %>

<%- sections.knowledgeBase %>

<% if (projectStandards) { %>
---
<%- projectStandards %>
<% } else { %>

<%- sections.aiAgentMode %>

<%- sections.directoryStructure %>

<%- sections.rcaDebugLoop %>

<%- sections.codePatterns %>

<%- sections.decisionMatrix %>
<% } %>

---

**Version**: <%= frameworkVersion %> (Enhanced with v2.5 Operational Patterns)  
**Last Updated**: <%= lastUpdated %>  
**Target Agent**: <%= agent.displayName %>  
**Framework Authority**: Aegis Framework Constitution  
**Operational Standards**: Kilo v2.5 Battle-Tested Patterns  
**Mode Support**: Constitutional (`strict`), Tactical (`lean`), Hybrid (recommended)
