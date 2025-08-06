<!--
@aegisFrameworkVersion: <%= frameworkVersion %>
@intent: Agent-agnostic instructions template for all Aegis agents
@context: Modular, versioned, and assembled from framework docs and agent profiles
@generatedFrom: agent-instructions.template.md
-->

# 🤖 <%= agent.displayName %> Instructions for Aegis Framework v<%= frameworkVersion %>

> **Agent-specific guidance for <%= agent.displayName %> working within the Aegis Framework ecosystem.**

<%= sections.constitutional %>

<%= sections.frameworkContext %>

<%= sections.agentProfile %>

<%= sections.multiAgent %>

<%= sections.blueprintCompliance %>

<%= sections.mcpMetadata %>

<%= sections.driftDetection %>

<%= sections.cliIntegration %>

<%= sections.validation %>

<%= sections.knowledgeBase %>

---

**Version**: <%= frameworkVersion %>  
**Last Updated**: <%= lastUpdated %>  
**Target Agent**: <%= agent.displayName %>  
**Framework Authority**: Aegis Framework Constitution
