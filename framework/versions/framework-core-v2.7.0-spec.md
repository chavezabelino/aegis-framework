<!--
@aegisFrameworkVersion: 2.7.0
@intent: Framework specification for Aegis Prompt Enhancement Mode (APEM)
@context: Multi-agent development workflow enhancement with automatic prompt optimization
@mode: strict
-->

# ⚙️ Aegis Framework v2.7.0 (Specification)

> Aegis Prompt Enhancement Mode (APEM) - On-demand prompt elevation system with deterministic tracing, replay verification, and drift detection capabilities

## 🎯 Feature Overview

This release introduces the Aegis Prompt Enhancement Mode (APEM), an intelligent prompt optimization system that automatically transforms raw user requests into high-quality, agent-compliant prompts. The system provides selective activation through trigger patterns, context-aware optimization, transparent execution with full traceability, deterministic tracing, replay verification, and drift detection capabilities.

## 🔧 New Capabilities

### **Trigger-Based Activation**

The system supports multiple trigger patterns for selective activation:

- **Prefix Triggers**: `optimize:` and `enhance:` for direct optimization requests
- **Slash Commands**: `/optimize` for command-line style activation
- **Natural Language**: "Aegis, optimize this prompt" for conversational activation
- **Priority-Based**: High-priority triggers for immediate optimization, medium-priority for suggestions

### **Context-Aware Optimization**

- **Aegis Guardrails**: Automatic injection of framework constraints and rules
- **Kilo Standards**: Integration of coding standards and architectural patterns
- **Project Rules**: Project-specific conventions and requirements
- **Session Context**: Current development session history and context

### **Intelligent Prompt Structuring**

- **Kilo Standard Format**: Goal → Tasks → Constraints → Deliverables structure
- **Intent Recognition**: Automatic detection of action types (debug, refactor, plan, explain)
- **Domain Awareness**: Technology-specific optimization (SvelteKit, Drizzle, Supabase, etc.)
- **Template Selection**: Context-appropriate structuring templates

### **Two-Stage Execution**

- **Stage 1**: Prompt optimization with context injection
- **Stage 2**: Execution of optimized prompt with Aegis/Kilo rules
- **Transparency Options**: Optional display of optimized prompt for debugging
- **Traceability**: Complete audit trail of prompt transformations

### **CLI Integration**

- **Single Command**: `aegis:enhance` for basic optimization
- **Transparency Mode**: `aegis:enhance:transparent` to show optimized prompt
- **Debug Mode**: `aegis:enhance:debug` for full optimization details
- **Flexible Input**: stdin piping or file-based input

### **Deterministic Trace Sink**

- **Append-Only JSONL**: Structured logging with daily rotation
- **Content Hashing**: SHA256 hashes for integrity verification
- **Secret Redaction**: Automatic redaction of credentials and tokens
- **Schema Validation**: Zod schemas for type safety and validation
- **JSON Schema Export**: External validation for CI/CD integration

### **Replay Harness System**

- **Deterministic Replay**: Re-execute prompts with identical parameters
- **Hash Verification**: Verify output consistency by content hash
- **Lenient Mode**: Handle whitespace and formatting differences
- **Filter Support**: Replay specific traces by status, model, date range
- **CI Integration**: Fail builds on verification failures

### **Drift Detection Matrix**

- **Multi-Model Testing**: Replay against multiple model variants
- **Seed Variation**: Test with different random seeds
- **Drift Analysis**: Detect output changes across model versions
- **Regression Detection**: Identify performance degradation
- **Automated Reporting**: Generate drift analysis reports

## 🚀 Migration Path from v2.6.0

### **No Breaking Changes**

This is a pure feature addition with no impact on existing functionality:

1. **Install Dependencies**: `pnpm add natural@^6.10.4 execa@^8.0.2 ajv@^9.0.2`
2. **Create Directory Structure**: `mkdir -p aegis/prompt-enhancement traces tools/aegis/apem/{trace,replay}`
3. **Make CLI Executables**: `chmod +x tools/ci/enhance-prompt.mjs tools/aegis/apem/replay/replay-harness.mts`
4. **Initialize Context Sources**: Set up Aegis/Kilo guardrail files
5. **Initialize Trace Schema**: Generate JSON schema for external validation
6. **Optional Integration**: Wire into existing prompt processing workflows

### **Integration Points**

For teams using existing prompt systems:

```javascript
// Auto-wire into existing prompt processor
import { enhancePrompt } from './tools/ci/prompt-enhancement/executor.mjs';

async function processUserPrompt(rawPrompt) {
  // Check for optimization triggers
  if (hasOptimizationTrigger(rawPrompt)) {
    const optimizedPrompt = await enhancePrompt(rawPrompt, {
      showOptimized: process.env.AEGIS_SHOW_OPTIMIZED === 'true',
      debugMode: process.env.AEGIS_DEBUG_MODE === 'true'
    });
    return await executePrompt(optimizedPrompt);
  } else {
    return await executePrompt(rawPrompt);
  }
}
```

## 📊 Impact Assessment

### **Agent Behavior Impact**

- **Enhanced Prompt Quality**: All triggered prompts automatically optimized to Kilo standards
- **Consistent Output**: Standardized prompt structure leads to more predictable results
- **Context Awareness**: Agents receive relevant project context automatically
- **No Behavioral Changes**: Existing workflows remain unchanged unless explicitly triggered

### **Blueprint Contract Changes**

- **New Blueprint**: `feat-prompt-enhance-trigger` defines the feature requirements
- **Schema Extensions**: Prompt optimization schemas for validation
- **Observability Events**: New event types for optimization lifecycle
- **Error Handling**: Defined fallback behaviors for optimization failures

### **Developer Workflow Changes**

- **New CLI Commands**: `aegis:enhance:*` and `apem:*` family of commands
- **Trigger Awareness**: Developers learn to use optimization triggers
- **Transparency Options**: Debug and transparency modes for optimization visibility
- **Trace Management**: Developers can replay and validate trace files
- **Drift Monitoring**: Automated drift detection in CI/CD pipelines
- **Integration Options**: Optional wiring into existing prompt systems

### **Migration Requirements**

- **Dependency Addition**: Natural language processing, process execution, and JSON schema validation libraries
- **Directory Creation**: Prompt enhancement, traces, and APEM tool storage structures
- **Permission Updates**: CLI executable permissions for multiple tools
- **Context Setup**: Aegis/Kilo guardrail file initialization
- **Schema Generation**: Trace JSON schema for external validation
- **No Code Changes**: Existing codebases unaffected

### **Documentation Updates**

- **CLI Reference**: New enhancement, trace, and replay command documentation
- **Trigger Patterns**: Guide to using optimization triggers
- **Trace Management**: Guide to managing and validating trace files
- **Replay Workflows**: Guide to deterministic replay and drift detection
- **CI/CD Integration**: Guide to GitHub Actions for trace artifacts and drift detection
- **Integration Examples**: How to wire into existing systems
- **Best Practices**: When and how to use prompt optimization and trace analysis

## 🧪 Testing & Validation

### **Trigger Detection Tests**

```bash
# Test trigger detection
echo "optimize: fix the login route" | node tools/ci/prompt-enhancement/triggers.mjs --test

# Test natural language triggers
echo "Aegis, optimize this prompt for debugging" | node tools/ci/prompt-enhancement/triggers.mjs --test
```

### **Context Injection Tests**

```bash
# Test context retrieval
node tools/ci/prompt-enhancement/context.mjs --test

# Test guardrail injection
echo "optimize: refactor the auth system" | node tools/ci/prompt-enhancement/context.mjs --test
```

### **End-to-End Tests**

```bash
# Test complete workflow
echo "optimize: fix the SvelteKit login route regression" | npm run aegis:enhance:transparent

# Test debug mode
echo "enhance: debug the authentication flow" | npm run aegis:enhance:debug

# Test trace and replay
pnpm apem:replay --file traces/apem-20250812.jsonl --status ok --mode hash

# Test drift detection
pnpm apem:replay:matrix --models gpt-4,gpt-4o --seeds 42,123,456
```

### **Performance Tests**

- **Optimization Overhead**: Ensure <100ms optimization time
- **Memory Usage**: Monitor context injection memory impact
- **Scalability**: Test with large context files and complex prompts
- **Trace Performance**: Ensure <50ms trace writing overhead
- **Replay Performance**: Test replay speed with large trace files
- **Drift Detection**: Measure matrix replay performance across multiple models

## 📋 Implementation Phases

### **Phase 1: Core Infrastructure (Week 1)**

- [ ] Create Zod schema definitions for prompt optimization
- [ ] Implement trigger detection and parsing logic
- [ ] Build context injection and guardrail retrieval system
- [ ] Set up directory structure and configuration

### **Phase 2: Prompt Structuring (Week 2)**

- [ ] Implement Kilo-style prompt structuring engine
- [ ] Create intent recognition and domain awareness
- [ ] Build template selection system
- [ ] Add multiple structuring templates

### **Phase 3: Execution Engine (Week 3)**

- [ ] Implement two-stage execution flow
- [ ] Add transparency and debug modes
- [ ] Create traceability and logging system
- [ ] Build CLI interface and npm scripts

### **Phase 4: Trace Sink & Replay (Week 4)**

- [ ] Implement append-only JSONL trace sink
- [ ] Add secret redaction and content hashing
- [ ] Create deterministic replay harness
- [ ] Build drift detection matrix system

### **Phase 5: CI/CD Integration (Week 5)**

- [ ] Create GitHub Actions for trace artifacts
- [ ] Implement replay matrix CI workflow
- [ ] Add JSON schema validation
- [ ] Create comprehensive test suite

### **Phase 6: Documentation & Optimization (Week 6)**

- [ ] Write documentation and usage guides
- [ ] Performance optimization and tuning
- [ ] Integration testing with existing systems
- [ ] Final validation and release preparation

## 🎯 Success Criteria

### **Functional Requirements**

- [ ] All trigger patterns correctly detected
- [ ] Context injection pulls relevant guardrails
- [ ] Prompt structuring produces Kilo-compliant formats
- [ ] Two-stage execution works with transparency options
- [ ] Traceability logging captures all prompt transformations
- [ ] Trace sink writes append-only JSONL with proper redaction
- [ ] Content hashing preserves integrity for verification
- [ ] Deterministic replay produces identical outputs
- [ ] Drift detection identifies model output changes
- [ ] CI integration fails builds on verification failures

### **Quality Requirements**

- [ ] Zero impact on existing prompt workflows
- [ ] Performance overhead <100ms for optimization
- [ ] Trace writing overhead <50ms
- [ ] Clear error messages and fallback behaviors
- [ ] Comprehensive test coverage (>90%)
- [ ] Secret redaction covers common credential formats
- [ ] Deterministic replay produces consistent results

### **Integration Requirements**

- [ ] Seamless integration with existing systems
- [ ] Compatible with current prompt processing workflows
- [ ] Easy adoption for new teams
- [ ] Minimal learning curve for developers
- [ ] GitHub Actions upload traces as artifacts
- [ ] Replay matrix runs in CI for drift detection
- [ ] JSON schema validation for external tools

## 🔮 Future Enhancements

### **Planned for v2.8.0**

- **Machine Learning Integration**: Learn from optimization patterns
- **Advanced Intent Recognition**: More sophisticated action detection
- **Custom Templates**: User-defined structuring templates
- **Batch Processing**: Optimize multiple prompts simultaneously
- **Advanced Drift Detection**: Statistical analysis of output changes
- **Trace Analytics**: Insights and patterns from trace data
- **Real-time Monitoring**: Live drift detection during development

### **Long-term Vision**

- **Predictive Optimization**: Suggest optimizations before execution
- **Collaborative Learning**: Share optimization patterns across teams
- **Enterprise Features**: Advanced security and compliance controls
- **API Integration**: REST endpoints for programmatic access
- **Distributed Tracing**: Cross-service trace correlation
- **Advanced Analytics**: Machine learning insights from trace data
- **Compliance Automation**: Automated audit trail generation

## 🔄 Integration with Existing Systems

### **Outcome Logging Integration**

The prompt enhancement system integrates with the v2.6.0 outcome logging system:

```javascript
// Log prompt optimization outcomes
const outcome = {
  aegisVersion: "v2.7.0",
  sessionId: sessionId,
  stepId: "prompt-optimization",
  agent: { name: "aegis-prompt-enhancer" },
  prompt: { user: rawPrompt },
  output: { text: optimizedPrompt },
  outcomes: { 
    summary: "Prompt optimized with Kilo standards", 
    verdict: "success" 
  },
  artifacts: [
    { path: "optimized-prompt.md", kind: "file_created", sha256: hash }
  ]
};

await recordOutcome(outcome);
```

### **Governance System Integration**

- **Constitutional Compliance**: All optimizations follow Aegis guardrails
- **Observability**: Complete event emission for optimization lifecycle
- **Audit Trail**: Full traceability of prompt transformations
- **Quality Gates**: Validation of optimization quality and compliance
- **Trace Governance**: Trace files follow constitutional requirements
- **Replay Verification**: Deterministic replay ensures compliance consistency
- **Drift Monitoring**: Automated detection of compliance drift

---

**Constitutional Authority**: Article III, Section 1 (Feature Development Workflow)  
**Blueprint Reference**: `feat-prompt-enhance-trigger` v1.0.0  
**Target Release**: Q1 2026  
**Confidence Level**: High (well-defined scope, clear requirements, minimal risk)
