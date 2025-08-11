# Aegis Framework Capability Map

**Generated__: 2025-08-08T23:10:40.374Z __Framework Version__: 2.4.0 __Total Capabilities__: 59 __Health Status__:
HEALTHY

## TOOL (35)

### Aegis Docs

**Status__: stable __Description__: Quick access to manifesto documentation and principles __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/CLI/Aegis-docs.ts __Dependencies__: commander, fs, path, chalk
**Documentation__: [README.md](README.md) __Usage__:

```text
Aegis-docs search <
```text

**Last Modified__: 2025-08-07T11:49:41.827Z

### Aegis Hydrate

**Status__: alpha __Description__: One-command migration tool with Constitutional governance __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/CLI/Aegis-hydrate.ts __Dependencies__: commander, fs, child_process,
util, inquirer, chalk, ora __Documentation__: [README.md](README.md) __Last Modified__: 2025-08-08T14:37:34.368Z

### Aegis Memory

**Status__: stable __Description__: CLI tool for Constitutional memory governance operations __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/CLI/Aegis-memory.ts __Dependencies__: commander, chalk, ora,
inquirer, fs, path __Documentation__: [README.md](README.md) __Last Modified__: 2025-08-08T22:28:09.773Z

### Amendment CLI

**Status__: beta __Description__: Provide user-friendly CLI for amendment management __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/CLI/amendment-CLI.ts __Documentation__: [README.md](README.md)
**Usage__:

```text
submit <proposal-id>');
```text

**Last Modified__: 2025-08-08T22:28:09.773Z

### Apprenticeship CLI

**Status__: beta __Description__: CLI for Blueprint-driven apprenticeship workflows (guided, challenge, review-only)
**Implementation__: /Users/nino/Workspace/02-local-dev/Aegis-framework/CLI/apprenticeship-CLI.ts __Dependencies__:
yargs, yargs/helpers __Documentation__: [README.md](README.md) __Usage__:

```text
1024, status: 'completed' }],
```text

**Last Modified__: 2025-08-08T22:28:09.773Z

### Auto Update Changelog

**Status__: stable __Description__: Automate changelog maintenance with AI-powered change detection and team
configuration support __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/auto-update-changelog.ts __Dependencies__: fs, path
**Documentation__: [README.md](README.md) __Usage__:

```text
// Example usage:

  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-n');

  const updater = new AutomatedChangelogUpdater();
  await updater.updateChangelog(dryRun);
...
```text

**Last Modified__: 2025-08-08T22:28:09.793Z

### Comprehensive Intelligence Testing

**Status__: stable __Description__: Comprehensive testing suite for all framework intelligence features
**Implementation__: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/comprehensive-intelligence-testing.ts
**Dependencies__: fs, path, child_process __Documentation__: [README.md](README.md) __Usage__:

```text
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
```text

**Last Modified__: 2025-08-08T22:28:09.793Z

### ConstitutionalConstitutional Compliance Enforcer

**Status__: stable __Description__: Constitutional compliance enforcer to prevent false claims and ensure framework
integrity __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/Constitutional-compliance-enforcer.ts __Dependencies__: fs,
path __Documentation__: [README.md](README.md) __Usage__:

```text
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
```text

**Last Modified__: 2025-08-08T22:29:35.197Z

### Continuous Compliance Monitor

**Status__: stable __Description__: Continuous compliance monitoring that ensures Constitutional adherence at all times
**Implementation__: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/continuous-compliance-monitor.ts
**Dependencies__: fs, path, child_process __Documentation__: [README.md](README.md) __Usage__:

```text
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
```text

**Last Modified__: 2025-08-08T22:28:09.794Z

### Cursor Integration

**Status__: alpha __Description__: Cursor-specific real-time evolution detection and conversation capture
**Implementation__: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/cursor-integration.ts __Dependencies__: fs,
path __Documentation__: [README.md](README.md) __Last Modified__: 2025-08-08T22:28:09.794Z

### Cursor Realtime CLI

**Status__: stable __Description__: CLI for managing Cursor real-time integration __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/CLI/cursor-realtime-CLI.ts __Dependencies__: commander, fs, path, url
**Documentation__: [README.md](README.md) __Last Modified__: 2025-08-08T22:28:09.773Z

### Cursor Realtime Integration

**Status__: stable __Description__: Real-time Cursor integration for live workflow detection __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/cursor-realtime-integration.ts __Dependencies__: fs, path, url,
events __Documentation__:
[docs/implementation/cursor-realtime-integration.md](docs/implementation/cursor-realtime-integration.md) __Last
Modified__: 2025-08-08T22:28:09.794Z

### Destructive Action Protection

**Status__: stable __Description__: Destructive action protection and validation system __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/destructive-action-protection.ts __Dependencies__: fs, path
**Documentation__: [README.md](README.md) __Usage__:

```text
// Example usage:

  const protector = new DestructiveActionProtector();

  if (process.argv.length < 4) {
    console.log('Usage: node destructive-action-protection.ts <action> <target1> [target2] ...');
    console.log('Example: node destructive-action-protection.ts delete .DS_Store');
    process.exit(1);
  }

 ...
```text

**Last Modified__: 2025-08-08T22:28:09.794Z

### Drift CLI

**Status__: beta __Description__: CLI for drift event listing, review, and replay (human-in-the-loop)
**Implementation__: /Users/nino/Workspace/02-local-dev/Aegis-framework/CLI/drift-CLI.ts __Dependencies__: fs, js-YAML
**Documentation__: [README.md](README.md) __Usage__:

```text
drift list [severity] | drift review <id> --approve | drift replay <blueprintId> --fix-mode=<mode>');
```text

**Last Modified__: 2025-08-08T22:28:09.773Z

### Drift Monitoring Dashboard

**Status__: stable __Description__: Drift monitoring dashboard with team configuration support __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/drift-monitoring-dashboard.ts __Dependencies__: fs, path
**Documentation__: [README.md](README.md) __Usage__:

```text
// Example usage:

  const dashboard = new DriftMonitoringDashboard();
  await dashboard.generateDashboard();
...
```text

**Last Modified__: 2025-08-08T22:28:09.795Z

### Enhanced Evolution Detector

**Status__: stable __Description__: Enhanced evolution story detection with intelligence gap analysis
**Implementation__: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/enhanced-evolution-detector.ts
**Dependencies__: fs, path __Documentation__: [README.md](README.md) __Usage__:

```text
// Example usage:

  const detector = new EnhancedEvolutionDetector();

  if (process.argv.length < 3) {
    console.log('Usage: node enhanced-evolution-detector.ts <context-file>');
    console.log('Example: node enhanced-evolution-detector.ts conversation-context.txt');
    process.exit(1);
  }

  const contextFi...
```text

**Last Modified__: 2025-08-08T22:28:09.795Z

### Enhanced Test Runner

**Status__: stable __Description__: Enhanced test runner for intelligence features that handles TypeScript directly
**Implementation__: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/enhanced-test-runner.ts __Dependencies__:
fs, path, child_process __Documentation__: [README.md](README.md) __Usage__:

```text
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
```text

**Last Modified__: 2025-08-08T22:28:09.795Z

### Evidence Based Validation

**Status__: stable __Description__: Evidence-based validation system for all framework intelligence claims
**Implementation__: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/evidence-based-validation.ts
**Dependencies__: fs, path, child_process __Documentation__: [README.md](README.md) __Usage__:

```text
// Example usage:

  const validation = new EvidenceBasedValidation();
  try {
    const report = await validation.validateAllEvidence();
    process.exit(report.insufficientClaims > report.fullyValidatedClaims ? 1 : 0);
  } catch (error) {
    console.error('❌ Evidence-based validation failed:', error);
    process....
```text

**Last Modified__: 2025-08-08T22:28:09.795Z

### Evolution Learning System

**Status__: stable __Description__: Actual evolution learning system that prevents repeat patterns __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/evolution-learning-system.ts __Dependencies__: fs, path
**Documentation__: [README.md](README.md) __Usage__:

```text
// Example usage:

  const learningSystem = new EvolutionLearningSystem();
  await learningSystem.preventRepeatPatterns();
...
```text

**Last Modified__: 2025-08-08T22:28:09.795Z

### Framework Capability Mapper

**Status__: experimental __Description__: Live capability mapping system that auto-discovers framework features
**Implementation__: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/framework-capability-mapper.ts
**Dependencies__: fs, path, child_process __Documentation__: [README.md](README.md) __Usage__:

```text
// Example usage:

  const mapper = new FrameworkCapabilityMapper();

  console.log('🧠 Aegis Framework Capability Mapper');
  console.log('=====================================\n');

  try {
    const map = await mapper.discoverCapabilities();

    // Save JSON map
    const jsonPath = await mapper.saveCapab...
```text

**Last Modified__: 2025-08-08T23:10:35.711Z

### Framework Intelligence Certification

**Status__: stable __Description__: Framework intelligence certification system that validates and certifies all
intelligence claims __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/framework-intelligence-certification.ts __Dependencies__: fs,
path, child_process __Documentation__: [README.md](README.md) __Usage__:

```text
// Example usage:

  const certification = new FrameworkIntelligenceCertification();
  try {
    const report = await certification.certifyAllClaims();
    process.exit(report.overallCertificationStatus === 'not-certified' ? 1 : 0);
  } catch (error) {
    console.error('❌ Intelligence certification failed:', error);...
```text

**Last Modified__: 2025-08-08T22:28:09.796Z

### Generate Agent Instructions

**Status__: alpha __Description__: CLI tool for generating versioned agent instructions __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/CLI/generate-agent-instructions.ts __Documentation__:
[README.md](README.md) __Usage__:

```text
');
```text

**Last Modified__: 2025-08-08T22:28:09.774Z

### Generate Agent Instructions V2

**Status__: alpha __Description__: Template-driven, agent-agnostic instruction generator __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/CLI/generate-agent-instructions-v2.ts __Dependencies__: url, fs,
path, js-YAML, EJS __Documentation__: [README.md](README.md) __Usage__:

```text
ts-node CLI/generate-agent-instructions-v2.ts <agent-id>');
```text

**Last Modified__: 2025-08-08T22:28:09.773Z

### Generate Cursor Instructions

**Status__: alpha __Description__: Cursor-specific instruction generator with real-time detection integration
**Implementation__: /Users/nino/Workspace/02-local-dev/Aegis-framework/CLI/generate-cursor-instructions.ts
**Dependencies__: fs, path, url, js-YAML, EJS __Documentation__: [README.md](README.md) __Last Modified__:
2025-08-08T22:28:09.774Z

### Intelligent Pattern Detector

**Status__: stable __Description__: Intelligent pattern recognition system for systematic issue detection
**Implementation__: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/intelligent-pattern-detector.ts
**Dependencies__: fs, path, glob __Documentation__: [README.md](README.md) __Usage__:

```text
// Example usage:

  const detector = new IntelligentPatternDetector();

  if (process.argv.length < 3) {
    console.log('Usage: node intelligent-pattern-detector.ts <violation-file>');
    console.log('Example: node intelligent-pattern-detector.ts violation.JSON');
    process.exit(1);
  }

  const violationFile ...
```text

**Last Modified__: 2025-08-08T22:28:09.796Z

### Intent Enforcement Engine

**Status__: stable __Description__: Real-time intent enforcement and agent drift prevention that catches systematic
issues __Implementation__: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/intent-enforcement-engine.ts
**Dependencies__: child_process, fs, path __Documentation__: [README.md](README.md) __Last Modified__:
2025-08-08T23:04:48.989Z

### Pre Commit Hook

**Status__: stable __Description__: Pre-commit hook with team configuration support __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/pre-commit-hook.ts __Dependencies__: child_process, fs, path
**Documentation__: [README.md](README.md) __Usage__:

```text
// Example usage:

  const hook = new PreCommitHook();
  const result = await hook.run();

  if (!result.allowed) {
    process.exit(1);
  }
...
```text

**Last Modified__: 2025-08-08T22:28:09.796Z

### Predictive Compliance Monitor

**Status__: stable __Description__: Predictive compliance monitoring that prevents Constitutional violations before they
occur __Implementation__: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/predictive-compliance-monitor.ts
**Dependencies__: fs, path, child_process __Documentation__: [README.md](README.md) __Usage__:

```text
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
```text

**Last Modified__: 2025-08-08T22:28:09.797Z

### Realtime Evolution Detection

**Status__: stable __Description__: Real-time evolution trigger detection from AI conversation context
**Implementation__: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/realtime-evolution-detection.ts
**Dependencies__: fs, path __Documentation__: [README.md](README.md) __Last Modified__: 2025-08-08T22:28:09.797Z

### Systematic Prevention Validator

**Status__: stable __Description__: Systematic prevention validation framework that ensures all prevention mechanisms
work correctly __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/systematic-prevention-validator.ts __Dependencies__: fs, path,
child_process __Documentation__: [README.md](README.md) __Usage__:

```text
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
```text

**Last Modified__: 2025-08-08T22:28:09.797Z

### Test Cursor Detection

**Status__: alpha __Description__: Test script for Cursor-specific real-time evolution detection __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/test-cursor-detection.ts __Dependencies__: fs, path, url
**Documentation__: [README.md](README.md) __Usage__:

```text
// Example usage:

  try {
    await testCursorDetection();
    await testCursorCLI();
  } catch (error) {
    console.error(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
...
```text

**Last Modified__: 2025-08-08T22:28:09.797Z

### Validate Annotations

**Status__: stable __Description__: Annotation validation with team configuration support __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/validate-annotations.ts __Dependencies__: fs, path
**Documentation__: [README.md](README.md) __Usage__:

```text
// Example usage:

  const validator = new AnnotationValidator();
  const result = await validator.validateAll();

  const enforcementLevel = validator['configLoader'].getAnnotationEnforcement();

  if (!result.valid && enforcementLevel === 'error') {
    process.exit(1);
  }
...
```text

**Last Modified__: 2025-08-08T22:28:09.797Z

### Validate Output Fidelity

**Status__: stable __Description__: Ensure generated outputs match reference targets exactly __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/tools/validate-output-fidelity.ts __Dependencies__: fs, path
**Documentation__: [README.md](README.md) __Last Modified__: 2025-08-08T22:28:09.798Z

### Validate Template Quality

**Status__: stable __Description__: Prevent HTML encoding artifacts and ensure template quality with team configuration
support __Implementation__: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/validate-template-quality.ts
**Dependencies__: fs, path, url __Documentation__: [README.md](README.md) __Last Modified__: 2025-08-08T22:28:09.798Z

### Validate Version Consistency

**Status__: stable __Description__: Comprehensive version consistency validation to prevent documentation drift
**Implementation__: /Users/nino/Workspace/02-local-dev/Aegis-framework/tools/validate-version-consistency.ts
**Dependencies__: fs, path, child_process __Documentation__: [README.md](README.md) __Usage__:

```text
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
```text

**Last Modified__: 2025-08-08T22:28:09.798Z

## CORE (18)

### Adapter Interface

**Status__: beta __Description__: Adapter interface for multi-agent, handoff, and dependency resolution
**Implementation__: /Users/nino/Workspace/02-local-dev/Aegis-framework/framework/adapters/adapter-interface.ts
**Documentation__: [README.md](README.md) __Last Modified__: 2025-08-08T22:28:09.785Z

### Advanced Observability Engine

**Status__: alpha __Description__: Implement advanced observability and Telemetry for framework intelligence
**Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/observability/advanced-observability-engine.ts
**Dependencies__: fs, path __Documentation__: [README.md](README.md) __Last Modified__: 2025-08-08T22:28:09.789Z

### Auto Repair Ml Engine

**Status__: stable __Description__: Scaffold for ML-driven Blueprint auto-repair engine __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/healing/auto-repair-ml-engine.ts __Documentation__:
[docs/implementation/auto-repair-ml-engine.md](docs/implementation/auto-repair-ml-engine.md) __Last Modified__:
2025-08-08T22:28:09.787Z

### Blueprint Apprenticeship Schema Extension

**Status__: stable __Description__: Blueprint schema extension for apprenticeship scaffolds __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/Blueprint-apprenticeship-schema-extension.ts
**Documentation__: [README.md](README.md) __Last Modified__: 2025-08-06T01:10:07.675Z

### Blueprint Multiagent Schema Extension

**Status__: beta __Description__: Blueprint schema extension for multi-agent orchestration and coordination
**Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/Blueprint-multiagent-schema-extension.ts __Documentation__:
[README.md](README.md) __Last Modified__: 2025-08-08T22:28:09.785Z

### ConstitutionalConstitutional Reflex Engine

**Status__: stable __Description__: Constitutional reflex engine for real-time semantic interrupt processing
**Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/governance/Constitutional-reflex-engine.ts
**Documentation__: [README.md](README.md) __Last Modified__: 2025-08-08T22:28:09.787Z

### Cross Framework Learning System

**Status__: experimental __Description__: Implement cross-framework pattern learning and knowledge synthesis
**Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/learning/cross-framework-learning-system.ts
**Dependencies__: fs, path __Documentation__: [README.md](README.md) __Last Modified__: 2025-08-08T22:28:09.788Z

### Democratic Amendment Engine

**Status__: beta __Description__: Implement democratic governance for Constitutional amendments __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/governance/democratic-amendment-engine.ts __Dependencies__:
fs, path, crypto __Documentation__: [README.md](README.md) __Last Modified__: 2025-08-08T22:28:09.787Z

### Foreground Hang Prevention

**Status__: stable __Description__: Prevent foreground process hangs in LLM-agent development loops __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/governance/foreground-hang-prevention.ts __Dependencies__:
fs, path, child_process __Documentation__: [README.md](README.md) __Last Modified__: 2025-08-08T23:04:48.989Z

### Ghost Mentor Plugin

**Status__: stable __Description__: Ghost Mentor plugin for apprenticeship scaffolds __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/mentors/ghost-mentor-plugin.ts __Documentation__:
[README.md](README.md) __Last Modified__: 2025-08-06T01:11:35.375Z

### Intelligent Changelog

**Status__: alpha __Description__: Implement intelligent changelog automation with AI-powered analysis
**Implementation__: /Users/nino/Workspace/02-local-dev/Aegis-framework/framework/learning/intelligent-changelog.ts
**Dependencies__: fs, path, child_process __Documentation__: [README.md](README.md) __Last Modified__:
2025-08-08T22:28:09.788Z

### Memory Core

**Status__: stable __Description__: Core memory interfaces and base classes for Aegis Memory Subsystem
**Implementation__: /Users/nino/Workspace/02-local-dev/Aegis-framework/framework/memory/memory-core.ts __Dependencies__:
zod __Documentation__: [README.md](README.md) __Last Modified__: 2025-08-08T22:28:09.789Z

### Pattern Recognition Engine

**Status__: beta __Description__: Implement intelligent pattern recognition for Constitutional drift prevention
**Implementation__: /Users/nino/Workspace/02-local-dev/Aegis-framework/framework/learning/pattern-recognition-engine.ts
**Dependencies__: fs, path __Documentation__: [README.md](README.md) __Last Modified__: 2025-08-08T22:28:09.789Z

### Predictive Enforcement

**Status__: beta __Description__: Implement predictive enforcement based on learned patterns __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/learning/predictive-enforcement.ts __Dependencies__: fs,
path __Documentation__: [README.md](README.md) __Last Modified__: 2025-08-08T22:28:09.789Z

### Self Healing Blueprint Engine

**Status__: alpha __Description__: Implement autonomous Blueprint repair and validation enhancement __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/healing/self-healing-Blueprint-engine.ts __Dependencies__:
fs, path, js-YAML __Documentation__: [README.md](README.md) __Last Modified__: 2025-08-08T22:28:09.787Z

### Self Healing Governance

**Status__: stable __Description__: Actual self-healing governance that prevents repeat failures __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/healing/self-healing-governance.ts __Dependencies__: fs,
path __Documentation__: [README.md](README.md) __Last Modified__: 2025-08-08T22:28:09.788Z

### Semantic Interrupt Detector

**Status__: stable __Description__: Semantic interrupt detection for agent drift prevention and intent realignment
**Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/governance/semantic-interrupt-detector.ts __Dependencies__:
fs, path __Documentation__: [README.md](README.md) __Last Modified__: 2025-08-08T22:28:09.787Z

### Types

**Status__: stable __Description__: Type definitions for ML-driven Blueprint auto-repair engine __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/healing/types.ts __Documentation__: [README.md](README.md)
**Last Modified__: 2025-08-06T00:18:14.041Z

## GOVERNANCE (4)

### ConstitutionalConstitutional Reflex Engine

**Status__: stable __Description__: Constitutional reflex engine for real-time semantic interrupt processing
**Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/governance/Constitutional-reflex-engine.ts
**Documentation__: [README.md](README.md) __Last Modified__: 2025-08-08T22:28:09.787Z

### Democratic Amendment Engine

**Status__: beta __Description__: Implement democratic governance for Constitutional amendments __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/governance/democratic-amendment-engine.ts __Dependencies__:
fs, path, crypto __Documentation__: [README.md](README.md) __Last Modified__: 2025-08-08T22:28:09.787Z

### Foreground Hang Prevention

**Status__: stable __Description__: Prevent foreground process hangs in LLM-agent development loops __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/governance/foreground-hang-prevention.ts __Dependencies__:
fs, path, child_process __Documentation__: [README.md](README.md) __Last Modified__: 2025-08-08T23:04:48.989Z

### Semantic Interrupt Detector

**Status__: stable __Description__: Semantic interrupt detection for agent drift prevention and intent realignment
**Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/framework/governance/semantic-interrupt-detector.ts __Dependencies__:
fs, path __Documentation__: [README.md](README.md) __Last Modified__: 2025-08-08T22:28:09.787Z

## INTEGRATION (2)

### memory_operation_failed

**Status__: stable __Description__: Notify governance system of violation __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/blueprints/memory-governance/Blueprint.YAML __Documentation__:
[README.md](README.md) __Last Modified__: 2025-08-08T22:28:09.772Z

### Public Tournament Viewer

**Status__: stable __Description__: Blueprint: feat-public-viewing __Implementation__:
/Users/nino/Workspace/02-local-dev/Aegis-framework/blueprints/feat-public-viewing/Blueprint.YAML __Documentation__:
[README.md](README.md) __Last Modified__: 2025-08-08T22:28:09.772Z
