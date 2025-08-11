<!--
@aegisFrameworkVersion: 2.5.0
@intent: Documentation for versioned agent instruction system
@context: Auto-generated instructions for AI agents based on framework state
-->

# 📋 Versioned Agent Instructions System

## 🎯 Overview

The Aegis Framework now includes a versioned agent instruction system that automatically generates specific guidance for
AI agents based on the current framework state and capabilities.

## 🔧 System Components

### 1. Instruction Generator CLI

- **File**: `CLI/generate-agent-instructions.cjs`
- **Purpose**: Automatically generates versioned instructions for AI agents
- **Features**: Agent-specific guidance, framework feature detection, Constitutional compliance

### 2. Generated Instructions

- **Location**: `framework/versions/instructions-*-v{version}.md`
- **Format**: Markdown with Constitutional metadata annotations
- **Versioning**: Matches current framework version from `VERSION` file

## 🚀 Usage

### Generate Instructions for All Agents

```
node CLI/generate-agent-instructions.cjs all
```

### Generate Instructions for Specific Agent

```
node CLI/generate-agent-instructions.cjs GitHub-copilot
node CLI/generate-agent-instructions.cjs claude-3-5-sonnet
node CLI/generate-agent-instructions.cjs cursor
```

### List Available Versions

```
node CLI/generate-agent-instructions.cjs list
```

## 📄 Generated Content Structure

Each generated instruction file includes:

### 1. Constitutional Compliance

- Framework authority and governance
- Mandatory annotation requirements
- Traceability principles

### 2. Framework Context

- Current version capabilities
- Available execution modes
- Feature detection based on codebase

### 3. Agent-Specific Guidance

- Language and framework capabilities
- Specialization areas
- Multi-agent coordination support

### 4. Operational Protocols

- Blueprint compliance requirements
- MCP metadata emission
- Drift detection and response
- CLI integration commands

### 5. Validation & Testing

- Snapshot test requirements
- Constitutional compliance checklist
- Error handling patterns

### 6. Knowledge Base

- Key resource references
- Blueprint examples
- Quick reference commands

## 🔄 Version Evolution

### Automatic Feature Detection

The generator automatically detects framework features:

- ✅ `Blueprint-driven-development` (from core spec)
- ✅ `multi-agent-orchestration` (from v2.5.0 spec)
- ✅ `apprenticeship-scaffolds` (from CLI presence)
- ✅ `advanced-observability` (from framework/observability)
- ✅ `Constitutional-governance` (from CONSTITUTION.md)

### Agent Capability Resolution

Reads from `framework/agent-manifest.JSON`:

- Agent language capabilities
- Specialization areas
- Coordination support
- Token limits and execution modes

### Versioned Evolution

- Instructions are versioned with framework releases
- Each version captures the specific capabilities and requirements
- Historical versions remain accessible for reference

## 📋 Current Generated Files

### v2.5.0 (Current)

- `instructions-GitHub-copilot-v2.5.0.md` - GitHub Copilot specific
- `instructions-v2.5.0.md` - Generic AI agent guidance

### v2.5.0 (Historical)

- `instructions-v2.5.0.md` - Original alpha version

## 🎯 Integration Benefits

### 1. Agent Onboarding

- New AI agents get current framework guidance
- Version-specific requirements clearly documented
- Constitutional compliance automated

### 2. Framework Evolution

- Instructions evolve with framework capabilities
- Breaking changes automatically documented
- Migration guidance included

### 3. Multi-Agent Coordination

- Each agent understands coordination protocols
- Handoff procedures clearly defined
- Context transfer requirements specified

### 4. Quality Assurance

- Constitutional compliance enforced
- Validation requirements standardized
- Testing protocols documented

## 🔮 Future Enhancements

### 1. Automated Updates

- CI/CD integration for instruction generation
- Automatic updates on framework releases
- Version comparison and migration guides

### 2. Enhanced Agent Profiles

- Dynamic capability detection
- Performance optimization guidance
- Context-aware specialization

### 3. Interactive CLI

- Agent instruction validation
- Real-time compliance checking
- Interactive setup wizards

---

**Status**: ✅ Implemented and Operational  
**Version**: 1.2.1  
**Last Updated**: August 6, 2025  
**Framework Authority**: Aegis Framework Constitution
