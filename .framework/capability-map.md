# Aegis Framework Capability Map

**Generated**: 2025-08-08T23:10:40.374Z **Framework Version**: 2.4.0 **Total Capabilities**: 59 **Health Status**:
HEALTHY

## TOOL (35)

### Aegis Docs

**Status**: stable **Description**: Quick access to manifesto documentation and principles **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/CLI/Aegis-docs.ts **Dependencies**: commander, fs, path, chalk
**Documentation**: [README.md](README.md) **Usage**:

```
Aegis-docs search <
```

**Last Modified**: 2025-08-07T11:49:41.827Z

### Aegis Hydrate

**Status**: alpha **Description**: One-command migration tool with Constitutional governance **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/CLI/Aegis-hydrate.ts **Dependencies**: commander, fs, child_process,
util, inquirer, chalk, ora **Documentation**: [README.md](README.md) **Last Modified**: 2025-08-08T14:37:34.368Z

### Aegis Memory

**Status**: stable **Description**: CLI tool for Constitutional memory governance operations **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/CLI/Aegis-memory.ts **Dependencies**: commander, chalk, ora,
inquirer, fs, path **Documentation**: [README.md](README.md) **Last Modified**: 2025-08-08T22:28:09.773Z

### Amendment CLI

**Status**: beta **Description**: Provide user-friendly CLI for amendment management **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/CLI/amendment-CLI.ts **Documentation**: [README.md](README.md)
**Usage**:

```
submit <proposal-id>');
```

**Last Modified**: 2025-08-08T22:28:09.773Z

### Apprenticeship CLI

**Status**: beta **Description**: CLI for Blueprint-driven apprenticeship workflows (guided, challenge, review-only)
**Implementation**: /Users/nino/Workspace/02-local-dev/Aegis-framework/CLI/apprenticeship-CLI.ts **Dependencies**:
yargs, yargs/helpers **Documentation**: [README.md](README.md) **Usage**:

```
1024, status: 'completed' }],
```

**Last Modified**: 2025-08-08T22:28:09.773Z

### Auto Update Changelog

**Status**: stable **Description**: Automate changelog maintenance with AI-powered change detection and team
configuration support **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/auto-update-changelog.ts **Dependencies**: fs, path
**Documentation**: [README.md](README.md) **Usage**:

```
// Example usage:

  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-n');

  const updater = new AutomatedChangelogUpdater();
  await updater.updateChangelog(dryRun);
...
```

**Last Modified**: 2025-08-08T22:28:09.793Z

### Comprehensive Intelligence Testing

**Status**: stable **Description**: Comprehensive testing suite for all framework intelligence features
**Implementation**: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/comprehensive-intelligence-testing.ts
**Dependencies**: fs, path, child_process **Documentation**: [README.md](README.md) **Usage**:

```
// Example usage:

  const testing = new ComprehensiveIntelligenceTesting();
  try {
    const report = await testing.runAllTests();
    process.exit(report.overallStatus === 'fail' ? 1 : 0);
  } catch (error) {
    console.error('❌ Comprehensive testing failed:', error);
    process.exit(1);
  }
...
```

**Last Modified**: 2025-08-08T22:28:09.793Z

### ConstitutionalConstitutional Compliance Enforcer

**Status**: stable **Description**: Constitutional compliance enforcer to prevent false claims and ensure framework
integrity **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/Constitutional-compliance-enforcer.ts **Dependencies**: fs,
path **Documentation**: [README.md](README.md) **Usage**:

```
// Example usage:

  const enforcer = new ConstitutionalComplianceEnforcer();

  if (process.argv.includes('--block')) {
    await enforcer.blockFrameworkOperations();
  } else {
    const result = await enforcer.enforceCompliance();

    if (result.frameworkBlocked) {
      process.exit(1);
    }
  }
...
```

**Last Modified**: 2025-08-08T22:29:35.197Z

### Continuous Compliance Monitor

**Status**: stable **Description**: Continuous compliance monitoring that ensures Constitutional adherence at all times
**Implementation**: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/continuous-compliance-monitor.ts
**Dependencies**: fs, path, child_process **Documentation**: [README.md](README.md) **Usage**:

```
// Example usage:

  const monitor = new ContinuousComplianceMonitor();

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n📋 Received shutdown signal...');
    await monitor.stopMonitoring();
    process.exit(0);
  });

  // Check command line arguments
  const args = process....
```

**Last Modified**: 2025-08-08T22:28:09.794Z

### Cursor Integration

**Status**: alpha **Description**: Cursor-specific real-time evolution detection and conversation capture
**Implementation**: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/cursor-integration.ts **Dependencies**: fs,
path **Documentation**: [README.md](README.md) **Last Modified**: 2025-08-08T22:28:09.794Z

### Cursor Realtime CLI

**Status**: stable **Description**: CLI for managing Cursor real-time integration **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/CLI/cursor-realtime-CLI.ts **Dependencies**: commander, fs, path, url
**Documentation**: [README.md](README.md) **Last Modified**: 2025-08-08T22:28:09.773Z

### Cursor Realtime Integration

**Status**: stable **Description**: Real-time Cursor integration for live workflow detection **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/cursor-realtime-integration.ts **Dependencies**: fs, path, url,
events **Documentation**:
[docs/implementation/cursor-realtime-integration.md](docs/implementation/cursor-realtime-integration.md) __Last
Modified__: 2025-08-08T22:28:09.794Z

### Destructive Action Protection

**Status**: stable **Description**: Destructive action protection and validation system **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/destructive-action-protection.ts **Dependencies**: fs, path
**Documentation**: [README.md](README.md) **Usage**:

```
// Example usage:

  const protector = new DestructiveActionProtector();

  if (process.argv.length < 4) {
    console.log('Usage: node destructive-action-protection.ts <action> <target1> [target2] ...');
    console.log('Example: node destructive-action-protection.ts delete .DS_Store');
    process.exit(1);
  }

 ...
```

**Last Modified**: 2025-08-08T22:28:09.794Z

### Drift CLI

**Status**: beta **Description**: CLI for drift event listing, review, and replay (human-in-the-loop)
**Implementation**: /Users/nino/Workspace/02-local-dev/Aegis-framework/CLI/drift-CLI.ts **Dependencies**: fs, js-YAML
**Documentation**: [README.md](README.md) **Usage**:

```
drift list [severity] | drift review <id> --approve | drift replay <blueprintId> --fix-mode=<mode>');
```

**Last Modified**: 2025-08-08T22:28:09.773Z

### Drift Monitoring Dashboard

**Status**: stable **Description**: Drift monitoring dashboard with team configuration support **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/drift-monitoring-dashboard.ts **Dependencies**: fs, path
**Documentation**: [README.md](README.md) **Usage**:

```
// Example usage:

  const dashboard = new DriftMonitoringDashboard();
  await dashboard.generateDashboard();
...
```

**Last Modified**: 2025-08-08T22:28:09.795Z

### Enhanced Evolution Detector

**Status**: stable **Description**: Enhanced evolution story detection with intelligence gap analysis
**Implementation**: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/enhanced-evolution-detector.ts
**Dependencies**: fs, path **Documentation**: [README.md](README.md) **Usage**:

```
// Example usage:

  const detector = new EnhancedEvolutionDetector();

  if (process.argv.length < 3) {
    console.log('Usage: node enhanced-evolution-detector.ts <context-file>');
    console.log('Example: node enhanced-evolution-detector.ts conversation-context.txt');
    process.exit(1);
  }

  const contextFi...
```

**Last Modified**: 2025-08-08T22:28:09.795Z

### Enhanced Test Runner

**Status**: stable **Description**: Enhanced test runner for intelligence features that handles TypeScript directly
**Implementation**: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/enhanced-test-runner.ts **Dependencies**:
fs, path, child_process **Documentation**: [README.md](README.md) **Usage**:

```
// Example usage:

  const runner = new EnhancedTestRunner();
  try {
    const report = await runner.runAllIntelligenceTests();
    process.exit(report.overallStatus === 'fail' ? 1 : 0);
  } catch (error) {
    console.error('❌ Enhanced testing failed:', error);
    process.exit(1);
  }
...
```

**Last Modified**: 2025-08-08T22:28:09.795Z

### Evidence Based Validation

**Status**: stable **Description**: Evidence-based validation system for all framework intelligence claims
**Implementation**: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/evidence-based-validation.ts
**Dependencies**: fs, path, child_process **Documentation**: [README.md](README.md) **Usage**:

```
// Example usage:

  const validation = new EvidenceBasedValidation();
  try {
    const report = await validation.validateAllEvidence();
    process.exit(report.insufficientClaims > report.fullyValidatedClaims ? 1 : 0);
  } catch (error) {
    console.error('❌ Evidence-based validation failed:', error);
    process....
```

**Last Modified**: 2025-08-08T22:28:09.795Z

### Evolution Learning System

**Status**: stable **Description**: Actual evolution learning system that prevents repeat patterns **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/evolution-learning-system.ts **Dependencies**: fs, path
**Documentation**: [README.md](README.md) **Usage**:

```
// Example usage:

  const learningSystem = new EvolutionLearningSystem();
  await learningSystem.preventRepeatPatterns();
...
```

**Last Modified**: 2025-08-08T22:28:09.795Z

### Framework Capability Mapper

**Status**: experimental **Description**: Live capability mapping system that auto-discovers framework features
**Implementation**: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/framework-capability-mapper.ts
**Dependencies**: fs, path, child_process **Documentation**: [README.md](README.md) **Usage**:

```
// Example usage:

  const mapper = new FrameworkCapabilityMapper();

  console.log('🧠 Aegis Framework Capability Mapper');
  console.log('=====================================\n');

  try {
    const map = await mapper.discoverCapabilities();

    // Save JSON map
    const jsonPath = await mapper.saveCapab...
```

**Last Modified**: 2025-08-08T23:10:35.711Z

### Framework Intelligence Certification

**Status**: stable **Description**: Framework intelligence certification system that validates and certifies all
intelligence claims **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/framework-intelligence-certification.ts **Dependencies**: fs,
path, child_process **Documentation**: [README.md](README.md) **Usage**:

```
// Example usage:

  const certification = new FrameworkIntelligenceCertification();
  try {
    const report = await certification.certifyAllClaims();
    process.exit(report.overallCertificationStatus === 'not-certified' ? 1 : 0);
  } catch (error) {
    console.error('❌ Intelligence certification failed:', error);...
```

**Last Modified**: 2025-08-08T22:28:09.796Z

### Generate Agent Instructions

**Status**: alpha **Description**: CLI tool for generating versioned agent instructions **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/CLI/generate-agent-instructions.ts **Documentation**:
[README.md](README.md) **Usage**:

```
');
```

**Last Modified**: 2025-08-08T22:28:09.774Z

### Generate Agent Instructions V2

**Status**: alpha **Description**: Template-driven, agent-agnostic instruction generator **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/CLI/generate-agent-instructions-v2.ts **Dependencies**: url, fs,
path, js-YAML, EJS **Documentation**: [README.md](README.md) **Usage**:

```
ts-node CLI/generate-agent-instructions-v2.ts <agent-id>');
```

**Last Modified**: 2025-08-08T22:28:09.773Z

### Generate Cursor Instructions

**Status**: alpha **Description**: Cursor-specific instruction generator with real-time detection integration
**Implementation**: /Users/nino/Workspace/02-local-dev/Aegis-framework/CLI/generate-cursor-instructions.ts
**Dependencies**: fs, path, url, js-YAML, EJS **Documentation**: [README.md](README.md) **Last Modified**:
2025-08-08T22:28:09.774Z

### Intelligent Pattern Detector

**Status**: stable **Description**: Intelligent pattern recognition system for systematic issue detection
**Implementation**: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/intelligent-pattern-detector.ts
**Dependencies**: fs, path, glob **Documentation**: [README.md](README.md) **Usage**:

```
// Example usage:

  const detector = new IntelligentPatternDetector();

  if (process.argv.length < 3) {
    console.log('Usage: node intelligent-pattern-detector.ts <violation-file>');
    console.log('Example: node intelligent-pattern-detector.ts violation.JSON');
    process.exit(1);
  }

  const violationFile ...
```

**Last Modified**: 2025-08-08T22:28:09.796Z

### Intent Enforcement Engine

**Status**: stable **Description**: Real-time intent enforcement and agent drift prevention that catches systematic
issues **Implementation**: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/intent-enforcement-engine.ts
**Dependencies**: child_process, fs, path **Documentation**: [README.md](README.md) **Last Modified**:
2025-08-08T23:04:48.989Z

### Pre Commit Hook

**Status**: stable **Description**: Pre-commit hook with team configuration support **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/pre-commit-hook.ts **Dependencies**: child_process, fs, path
**Documentation**: [README.md](README.md) **Usage**:

```
// Example usage:

  const hook = new PreCommitHook();
  const result = await hook.run();

  if (!result.allowed) {
    process.exit(1);
  }
...
```

**Last Modified**: 2025-08-08T22:28:09.796Z

### Predictive Compliance Monitor

**Status**: stable **Description**: Predictive compliance monitoring that prevents Constitutional violations before they
occur **Implementation**: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/predictive-compliance-monitor.ts
**Dependencies**: fs, path, child_process **Documentation**: [README.md](README.md) **Usage**:

```
// Example usage:

  const monitor = new PredictiveComplianceMonitor();
  try {
    const result = await monitor.monitorCompliance();
    process.exit(result.status === 'critical' ? 1 : 0);
  } catch (error) {
    console.error('❌ Predictive monitoring failed:', error);
    process.exit(1);
  }
...
```

**Last Modified**: 2025-08-08T22:28:09.797Z

### Realtime Evolution Detection

**Status**: stable **Description**: Real-time evolution trigger detection from AI conversation context
**Implementation**: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/realtime-evolution-detection.ts
**Dependencies**: fs, path **Documentation**: [README.md](README.md) **Last Modified**: 2025-08-08T22:28:09.797Z

### Systematic Prevention Validator

**Status**: stable **Description**: Systematic prevention validation framework that ensures all prevention mechanisms
work correctly **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/systematic-prevention-validator.ts **Dependencies**: fs, path,
child_process **Documentation**: [README.md](README.md) **Usage**:

```
// Example usage:

  const validator = new SystematicPreventionValidator();
  try {
    const report = await validator.validateAllMechanisms();
    process.exit(report.overallStatus === 'fail' ? 1 : 0);
  } catch (error) {
    console.error('❌ Systematic validation failed:', error);
    process.exit(1);
  }
...
```

**Last Modified**: 2025-08-08T22:28:09.797Z

### Test Cursor Detection

**Status**: alpha **Description**: Test script for Cursor-specific real-time evolution detection **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/test-cursor-detection.ts **Dependencies**: fs, path, url
**Documentation**: [README.md](README.md) **Usage**:

```
// Example usage:

  try {
    await testCursorDetection();
    await testCursorCLI();
  } catch (error) {
    console.error(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
...
```

**Last Modified**: 2025-08-08T22:28:09.797Z

### Validate Annotations

**Status**: stable **Description**: Annotation validation with team configuration support **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/validate-annotations.ts **Dependencies**: fs, path
**Documentation**: [README.md](README.md) **Usage**:

```
// Example usage:

  const validator = new AnnotationValidator();
  const result = await validator.validateAll();

  const enforcementLevel = validator['configLoader'].getAnnotationEnforcement();

  if (!result.valid && enforcementLevel === 'error') {
    process.exit(1);
  }
...
```

**Last Modified**: 2025-08-08T22:28:09.797Z

### Validate Output Fidelity

**Status**: stable **Description**: Ensure generated outputs match reference targets exactly **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/validate-output-fidelity.ts **Dependencies**: fs, path
**Documentation**: [README.md](README.md) **Last Modified**: 2025-08-08T22:28:09.798Z

### Validate Template Quality

**Status**: stable **Description**: Prevent HTML encoding artifacts and ensure template quality with team configuration
support **Implementation**: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/validate-template-quality.ts
**Dependencies**: fs, path, url **Documentation**: [README.md](README.md) **Last Modified**: 2025-08-08T22:28:09.798Z

### Validate Version Consistency

**Status**: stable **Description**: Comprehensive version consistency validation to prevent documentation drift
**Implementation**: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/validate-version-consistency.ts
**Dependencies**: fs, path, child_process **Documentation**: [README.md](README.md) **Usage**:

```
// Example usage:

  const validator = new VersionConsistencyValidator();

  if (process.argv.includes('--auto-fix')) {
    await validator.autoFix();
  } else {
    const result = await validator.validateAll();

    if (result.overallStatus === 'fail') {
      process.exit(1);
    }
  }
...
```

**Last Modified**: 2025-08-08T22:28:09.798Z

## CORE (18)

### Adapter Interface

**Status**: beta **Description**: Adapter interface for multi-agent, handoff, and dependency resolution
**Implementation**: /Users/nino/Workspace/02-local-dev/Aegis-framework/framework/adapters/adapter-interface.ts
**Documentation**: [README.md](README.md) **Last Modified**: 2025-08-08T22:28:09.785Z

### Advanced Observability Engine

**Status**: alpha **Description**: Implement advanced observability and Telemetry for framework intelligence
**Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/observability/advanced-observability-engine.ts
**Dependencies**: fs, path **Documentation**: [README.md](README.md) **Last Modified**: 2025-08-08T22:28:09.789Z

### Auto Repair Ml Engine

**Status**: stable **Description**: Scaffold for ML-driven Blueprint auto-repair engine **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/healing/auto-repair-ml-engine.ts **Documentation**:
[docs/implementation/auto-repair-ml-engine.md](docs/implementation/auto-repair-ml-engine.md) **Last Modified**:
2025-08-08T22:28:09.787Z

### Blueprint Apprenticeship Schema Extension

**Status**: stable **Description**: Blueprint schema extension for apprenticeship scaffolds **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/Blueprint-apprenticeship-schema-extension.ts
**Documentation**: [README.md](README.md) **Last Modified**: 2025-08-06T01:10:07.675Z

### Blueprint Multiagent Schema Extension

**Status**: beta **Description**: Blueprint schema extension for multi-agent orchestration and coordination
**Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/Blueprint-multiagent-schema-extension.ts **Documentation**:
[README.md](README.md) **Last Modified**: 2025-08-08T22:28:09.785Z

### ConstitutionalConstitutional Reflex Engine

**Status**: stable **Description**: Constitutional reflex engine for real-time semantic interrupt processing
**Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/governance/Constitutional-reflex-engine.ts
**Documentation**: [README.md](README.md) **Last Modified**: 2025-08-08T22:28:09.787Z

### Cross Framework Learning System

**Status**: experimental **Description**: Implement cross-framework pattern learning and knowledge synthesis
**Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/learning/cross-framework-learning-system.ts
**Dependencies**: fs, path **Documentation**: [README.md](README.md) **Last Modified**: 2025-08-08T22:28:09.788Z

### Democratic Amendment Engine

**Status**: beta **Description**: Implement democratic governance for Constitutional amendments **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/governance/democratic-amendment-engine.ts **Dependencies**:
fs, path, crypto **Documentation**: [README.md](README.md) **Last Modified**: 2025-08-08T22:28:09.787Z

### Foreground Hang Prevention

**Status**: stable **Description**: Prevent foreground process hangs in LLM-agent development loops **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/governance/foreground-hang-prevention.ts **Dependencies**:
fs, path, child_process **Documentation**: [README.md](README.md) **Last Modified**: 2025-08-08T23:04:48.989Z

### Ghost Mentor Plugin

**Status**: stable **Description**: Ghost Mentor plugin for apprenticeship scaffolds **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/mentors/ghost-mentor-plugin.ts **Documentation**:
[README.md](README.md) **Last Modified**: 2025-08-06T01:11:35.375Z

### Intelligent Changelog

**Status**: alpha **Description**: Implement intelligent changelog automation with AI-powered analysis
**Implementation**: /Users/nino/Workspace/02-local-dev/Aegis-framework/framework/learning/intelligent-changelog.ts
**Dependencies**: fs, path, child_process **Documentation**: [README.md](README.md) **Last Modified**:
2025-08-08T22:28:09.788Z

### Memory Core

**Status**: stable **Description**: Core memory interfaces and base classes for Aegis Memory Subsystem
**Implementation**: /Users/nino/Workspace/02-local-dev/Aegis-framework/framework/memory/memory-core.ts **Dependencies**:
zod **Documentation**: [README.md](README.md) **Last Modified**: 2025-08-08T22:28:09.789Z

### Pattern Recognition Engine

**Status**: beta **Description**: Implement intelligent pattern recognition for Constitutional drift prevention
**Implementation**: /Users/nino/Workspace/02-local-dev/Aegis-framework/framework/learning/pattern-recognition-engine.ts
**Dependencies**: fs, path **Documentation**: [README.md](README.md) **Last Modified**: 2025-08-08T22:28:09.789Z

### Predictive Enforcement

**Status**: beta **Description**: Implement predictive enforcement based on learned patterns **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/learning/predictive-enforcement.ts **Dependencies**: fs,
path **Documentation**: [README.md](README.md) **Last Modified**: 2025-08-08T22:28:09.789Z

### Self Healing Blueprint Engine

**Status**: alpha **Description**: Implement autonomous Blueprint repair and validation enhancement **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/healing/self-healing-Blueprint-engine.ts **Dependencies**:
fs, path, js-YAML **Documentation**: [README.md](README.md) **Last Modified**: 2025-08-08T22:28:09.787Z

### Self Healing Governance

**Status**: stable **Description**: Actual self-healing governance that prevents repeat failures **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/healing/self-healing-governance.ts **Dependencies**: fs,
path **Documentation**: [README.md](README.md) **Last Modified**: 2025-08-08T22:28:09.788Z

### Semantic Interrupt Detector

**Status**: stable **Description**: Semantic interrupt detection for agent drift prevention and intent realignment
**Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/governance/semantic-interrupt-detector.ts **Dependencies**:
fs, path **Documentation**: [README.md](README.md) **Last Modified**: 2025-08-08T22:28:09.787Z

### Types

**Status**: stable **Description**: Type definitions for ML-driven Blueprint auto-repair engine **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/healing/types.ts **Documentation**: [README.md](README.md)
**Last Modified**: 2025-08-06T00:18:14.041Z

## GOVERNANCE (4)

### ConstitutionalConstitutional Reflex Engine

**Status**: stable **Description**: Constitutional reflex engine for real-time semantic interrupt processing
**Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/governance/Constitutional-reflex-engine.ts
**Documentation**: [README.md](README.md) **Last Modified**: 2025-08-08T22:28:09.787Z

### Democratic Amendment Engine

**Status**: beta **Description**: Implement democratic governance for Constitutional amendments **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/governance/democratic-amendment-engine.ts **Dependencies**:
fs, path, crypto **Documentation**: [README.md](README.md) **Last Modified**: 2025-08-08T22:28:09.787Z

### Foreground Hang Prevention

**Status**: stable **Description**: Prevent foreground process hangs in LLM-agent development loops **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/governance/foreground-hang-prevention.ts **Dependencies**:
fs, path, child_process **Documentation**: [README.md](README.md) **Last Modified**: 2025-08-08T23:04:48.989Z

### Semantic Interrupt Detector

**Status**: stable **Description**: Semantic interrupt detection for agent drift prevention and intent realignment
**Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/governance/semantic-interrupt-detector.ts **Dependencies**:
fs, path **Documentation**: [README.md](README.md) **Last Modified**: 2025-08-08T22:28:09.787Z

## INTEGRATION (2)

### memory_operation_failed

**Status**: stable **Description**: Notify governance system of violation **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/blueprints/memory-governance/Blueprint.YAML **Documentation**:
[README.md](README.md) **Last Modified**: 2025-08-08T22:28:09.772Z

### Public Tournament Viewer

**Status**: stable **Description**: Blueprint: feat-public-viewing **Implementation**:
/Users/nino/Workspace/02-local-dev/Aegis-framework/blueprints/feat-public-viewing/Blueprint.YAML **Documentation**:
[README.md](README.md) **Last Modified**: 2025-08-08T22:28:09.772Z
