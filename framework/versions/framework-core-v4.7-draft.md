<!--
@aegisBlueprint: framework-core
@version: 4.7-draft
@mode: strict
@intent: ARCHIVED - Features migrated to v2.5.0 specification
@context:
- This file has been archived as part of semantic versioning migration
- Features from this draft have been migrated to framework-core-v2.5.0 Do not implement features from this file - use the v2.5.0 spec instead

@migrationNote: See framework/versions/framework-core-v2.5.0or current feature planning
@newFeatures: [MIGRATED TO v2.5.0]
- Multi-agent execution support → Multi-Agent Execution Layer
- Model Context Protocol (MCP) metadata emission → MCP Metadata Output
- Blueprint execution metadata with run logs → Blueprint Execution Metadata
- Snapshot testing across lean/strict/full modes → Enhanced Testing
- Adapter interface for tech stack translation → Enhanced Adapter Interface
- Drift logging: human-in-the-loop input and YAML sidecar → Drift Logging & Human-in-the-Loop
- CLI updates to support all of the above → CLI enhancements in v2.5.0
-->

# ⚙️ Aegis Framework v4.7 (Draft) - ARCHIVED

> ⚠️ **ARCHIVED**: This draft has been superseded by semantic versioning.
>
> **See instead**: [`framework/versions/framework-core-v2.5.0(framework-core-v2.5.0
_This draft has been migrated to the v2.5.0 specification as part of our semantic versioning adoption._

## 🆕 Additions in v4.7

...

## 🔁 Multi-Agent Execution Layer

<!--
@task: Define how preferredAgents is declared and resolved.
@context: Each Blueprint should declare one or more agents. Execution engine must hydrate blueprints using the agent contract.
-->

## 📄 MCP Metadata Output

<!--
@task: Define mcpContext fields to emit at runtime. Should be compatible with OpenAI MCP spec.
-->

## 🧠 Drift Logging

<!--
@task: Add schema for drift-log.YAML. Reference types like drift, regression, hallucination, etc.
-->
