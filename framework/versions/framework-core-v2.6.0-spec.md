<!--
@aegisFrameworkVersion: 2.6.0
@intent: Framework specification for agent outcome logging system
@context: Multi-agent development workflow enhancement with structured outcome logging
@mode: strict
-->

# ⚙️ Aegis Framework v2.6.0 (Specification)

> Agent Outcome Logging System - Tiered, configurable outcome logging for multi-agent assessment and evaluation

## 🎯 Feature Overview

This release introduces a comprehensive agent outcome logging system that enables structured recording, validation, and sharing of AI agent outputs across different assessment contexts. The system provides tiered detail levels from minimal metadata to forensic analysis, supporting seamless integration with existing multi-agent workflows.

## 🔧 New Capabilities

### **Tiered Outcome Logging Modes**

The system supports four distinct logging modes to balance detail with usability:

- **Lite Mode**: Minimal metadata only (session, agent, verdict) - ideal for quick status checks
- **Standard Mode**: Includes prompt/output excerpts (2000 chars) - perfect for paste/upload to other agents
- **Full Mode**: Complete prompt/output with artifacts - comprehensive record keeping
- **Forensic Mode**: Environment snapshots, tool traces, diff summaries - deep analysis

### **Integrity and Validation**

- **SHA256 Integrity Hashing**: Bundle hashes for verification after paste/upload
- **Zod Schema Validation**: Type-safe outcome record validation
- **Deterministic Output**: Consistent file layouts and reproducible hashing

### **Multi-Format Output**

- **JSONL Format**: Append-only logs for programmatic analysis
- **Markdown Format**: Human-readable summaries for easy paste/upload
- **Structured Organization**: Date/session/step hierarchy for easy navigation

### **CLI Integration**

- **Single Command Interface**: `aegis:outcome` with mode flags
- **Environment Configuration**: `AEGIS_OUTCOME_MODE` for default behavior
- **Flexible Input**: stdin piping or file-based input

## 🚀 Migration Path from v2.5.0

### **No Breaking Changes**

This is a pure feature addition with no impact on existing functionality:

1. **Install Dependencies**: `pnpm add zod@^3.23.8`
2. **Create Directory Structure**: `mkdir -p aegis/outcomes`
3. **Make CLI Executable**: `chmod +x tools/ci/record-outcome.mjs`
4. **Optional Integration**: Wire into existing governance runners

### **Optional Integration Points**

For teams using the governance system:

```javascript
// Auto-wire into governance runner
import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";

async function recordOutcome(step) {
  const payload = {
    aegisVersion: "v2.6.0",
    sessionId: process.env.AEGIS_SESSION_ID ?? `sess-${Date.now()}`,
    stepId: step.id,
    agent: { name: step.agent ?? "cursor", model: step.model ?? "unknown" },
    prompt: { user: step.prompt ?? "" },
    output: { text: step.output ?? "" },
    outcomes: { 
      summary: step.summary ?? "n/a", 
      verdict: step.ok ? "success" : "failure", 
      rationale: step.rationale ?? "" 
    },
    artifacts: step.artifacts ?? [],
    diffs: step.diffs ?? [],
    tools: step.tools ?? [],
    env: step.env ?? {}
  };
  
  const tmp = `.aegis-outcome-${step.id}.json`;
  await writeFile(tmp, JSON.stringify(payload), "utf8");
  await new Promise((res, rej) => {
    const p = spawn(process.execPath, [
      "tools/ci/record-outcome.mjs", 
      "--mode", 
      process.env.AEGIS_OUTCOME_MODE ?? "standard", 
      "--from", 
      tmp
    ], { stdio: "inherit" });
    p.on("exit", (code) => code === 0 ? res() : rej(new Error(`record-outcome exited ${code}`)));
  });
}
```

## 📊 Impact Assessment

### **Agent Behavior Impact**

- **Enhanced Traceability**: All agent outputs can be systematically logged and assessed
- **Multi-Agent Coordination**: Enables structured handoffs with outcome documentation
- **Quality Assurance**: Provides audit trail for agent performance evaluation
- **No Behavioral Changes**: Existing agent workflows remain unchanged

### **Blueprint Contract Changes**

- **New Blueprint**: `feat-agent-outcome-logging` defines the feature requirements
- **Schema Extensions**: Outcome record schemas for validation
- **Observability Events**: New event types for outcome recording lifecycle
- **Error Handling**: Defined fallback behaviors for validation failures

### **Developer Workflow Changes**

- **New CLI Commands**: `aegis:outcome:*` family of commands
- **Configuration Management**: `aegis/outcome.config.json` for behavior tuning
- **File Organization**: `aegis/outcomes/` directory structure
- **Integration Options**: Optional wiring into existing governance systems

### **Migration Requirements**

- **Dependency Addition**: Zod schema validation library
- **Directory Creation**: Outcomes storage structure
- **Permission Updates**: CLI executable permissions
- **No Code Changes**: Existing codebases unaffected

### **Documentation Updates**

- **CLI Reference**: New command documentation
- **Configuration Guide**: Outcome logging configuration options
- **Integration Examples**: Multi-agent workflow integration patterns
- **Best Practices**: When and how to use different logging modes

## 🧪 Testing & Validation

### **Schema Validation Tests**

```bash
# Test schema loading
node -e "import('./tools/ci/outcomes/schema.mjs').then(m => console.log('Schema loaded'))"

# Test validation with sample data
echo '{"aegisVersion":"v2.6.0","sessionId":"test","stepId":"s1","agent":{"name":"cursor"},"prompt":{"user":"hi"},"output":{"text":"ok"},"outcomes":{"summary":"test","verdict":"success"}}' | node tools/ci/record-outcome.mjs --mode standard
```

### **Output Generation Tests**

```bash
# Verify file creation
ls -la aegis/outcomes/$(date +%Y%m%d)/test/s1.*

# Verify content integrity
cat aegis/outcomes/$(date +%Y%m%d)/test/s1.md
cat aegis/outcomes/$(date +%Y%m%d)/test/s1.jsonl
```

### **Integration Tests**

- **Governance Runner Integration**: Test auto-wiring into existing systems
- **Multi-Mode Validation**: Verify all four logging modes work correctly
- **Error Handling**: Test fallback behaviors for invalid inputs
- **Performance**: Ensure minimal impact on existing workflows

## 📋 Implementation Phases

### **Phase 1: Core Infrastructure (Week 1)**

- [ ] Create Zod schema definitions
- [ ] Implement JSONL and Markdown writers
- [ ] Build main CLI interface
- [ ] Set up directory structure

### **Phase 2: Validation & Testing (Week 2)**

- [ ] Implement schema validation
- [ ] Add integrity hash computation
- [ ] Create comprehensive test suite
- [ ] Validate all logging modes

### **Phase 3: Integration & Documentation (Week 3)**

- [ ] Add package.json scripts
- [ ] Create configuration system
- [ ] Write comprehensive documentation
- [ ] Test integration with governance system

### **Phase 4: Release Preparation (Week 4)**

- [ ] Final testing and validation
- [ ] Update framework documentation
- [ ] Create migration guide
- [ ] Prepare release notes

## 🎯 Success Criteria

### **Functional Requirements**

- [ ] All four logging modes work correctly
- [ ] Schema validation catches invalid inputs
- [ ] Integrity hashes are computed and verified
- [ ] JSONL and Markdown outputs are generated
- [ ] CLI handles both stdin and file input

### **Quality Requirements**

- [ ] Zero impact on existing framework functionality
- [ ] Comprehensive test coverage (>90%)
- [ ] Clear error messages and fallback behaviors
- [ ] Well-documented configuration options

### **Integration Requirements**

- [ ] Seamless integration with governance system
- [ ] Compatible with existing multi-agent workflows
- [ ] Easy adoption for new teams
- [ ] Minimal learning curve for developers

## 🔮 Future Enhancements

### **Planned for v2.7.0**

- **Real-time Streaming**: Live outcome logging during agent execution
- **Advanced Analytics**: Outcome pattern analysis and insights
- **Cross-Agent Comparison**: Comparative analysis of multiple agents
- **Integration APIs**: REST endpoints for programmatic access

### **Long-term Vision**

- **Machine Learning Integration**: Automated outcome quality assessment
- **Predictive Analytics**: Outcome prediction based on historical patterns
- **Collaborative Assessment**: Multi-human evaluation workflows
- **Enterprise Features**: Advanced security, compliance, and audit capabilities

---

**Constitutional Authority**: Article III, Section 1 (Feature Development Workflow)  
**Blueprint Reference**: `feat-agent-outcome-logging` v1.0.0  
**Target Release**: Q4 2025  
**Confidence Level**: High (well-defined scope, clear requirements, minimal risk)
