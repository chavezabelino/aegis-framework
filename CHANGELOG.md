# Changelog

All notable changes to the Aegis Framework will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned for v1.3.0
- Apprenticeship Scaffolds for Junior Developers:
  - `@apprenticeshipMode` execution contexts (guided, challenge, review-only)
  - Blueprint reflection blocks and prompts
  - Observability events for learning signals
  - Ghost Mentor plugin system for review/feedback
  - Reflection-aware hybrid snapshots for learning delta
  - CLI and schema support for apprenticeship workflows

## [1.3.0] - 2025-08-05

### Added - Apprenticeship Scaffolds for Junior Developers
- **Apprenticeship execution modes**: `@apprenticeshipMode` contexts (guided, challenge, review-only) for blueprints and CLI
- **Blueprint reflection blocks and prompts**: Schema extension for learning objectives, reflection, and progress tracking
- **Observability events**: Dedicated `framework/observability/apprenticeship-events.jsonl` for apprenticeship telemetry and learning signals
- **Ghost Mentor plugin**: Automated feedback and review system for apprenticeship workflows (`framework/mentors/ghost-mentor-plugin.ts`)
- **CLI support**: `cli/apprenticeship-cli.ts` and compiled CLI for running apprenticeship workflows with event emission and mentor feedback
- **Replay and snapshot tests**: Deterministic output validation and learning delta tracking (`tests/snapshot-tests/apprenticeship-scaffolds.test.ts`, `tests/replay-diff-tests/apprenticeship-scaffolds-replay.test.ts`)
- **Constitutional compliance**: All scaffolds, events, and plugins include required annotations and follow blueprint-driven traceability

#### Migration Notes
- No breaking changes. Existing blueprints are unaffected unless adopting apprenticeship scaffolds.
- See `docs/implementation/apprenticeship-scaffolds.md` for usage, extension, and compliance guidance.

## [1.2.1] - 2025-08-05

### Added - Enhanced Blueprint Auto-Repair (ML Optimization)
- **ML-driven error detection and repair**: `framework/healing/auto-repair-ml-engine.ts` with rule-based and extensible pattern recognition
- **Context-sensitive auto-fixes**: Automated repair for missing/invalid blueprint fields (id, version, content)
- **Observability event emission**: All repair actions are logged to `framework/observability/events.jsonl` for audit and replay
- **Constitutional compliance**: Full traceability, error handling, and fallback for all auto-repair actions
- **Extensible design**: Ready for future ML model/plugin integration

#### Migration Notes
- No breaking changes. Existing blueprints will be auto-repaired if missing required fields or types.
- See `docs/implementation/auto-repair-ml-engine.md` for usage and extension guidance.

### Enhanced
- **Constitutional Compliance**: All Phase 3 systems fully adhere to Aegis constitutional requirements
- **Error Handling**: Comprehensive graceful degradation and safe operation modes
- **Documentation**: Complete Phase 3 implementation guide with usage examples and architectural details
- **Integration**: Seamless integration with existing governance, pattern recognition, and amendment systems

### Technical Achievements
- 🏆 **First AI Framework** with constitutional self-governance and autonomous healing
- 🚀 **Pioneer in Cross-Framework Learning** with systematic pattern synthesis and knowledge transfer
- 🛡️ **Advanced Self-Healing** with preventive maintenance and intelligent auto-repair
- 📈 **Comprehensive Observability** with predictive analytics and strategic evolution guidance
- ⚖️ **Constitutional AI Governance** with democratic amendment processes and community engagement

## [1.1.0-beta] - 2025-08-05

### Added
- **🏛️ Constitutional Governance**: Complete constitutional framework with `CONSTITUTION.md` establishing foundational principles, governance structures, and amendment processes
- **🔄 Self-Healing System**: Automated drift detection, constitutional enforcement, and introspective learning capabilities
- **⚖️ Constitutional Conductor**: CLI tool `cli/aegis-conductor.ts` for comprehensive governance automation
- **📊 Constitutional Validator**: Advanced validation tool `tools/validate-constitution.ts` with compliance scoring
- **📈 Drift Monitoring**: Multi-layer drift detection for agent behavior, user workflows, and framework evolution
- **🎯 Amendment Proposals**: Democratic amendment proposal system with `framework/governance/amendment-proposals/`
- **🗺️ Strategic Roadmap**: Phased implementation plan in `docs/roadmap/self-healing-governance-roadmap.md`
- **⚙️ Configuration Management**: Constitutional state tracking with `.framework/constitutional-state.json` and enforcement configuration
- **📋 Engineering Communication**: Updated team guidance in `docs/reference/pov-engineering-team.md`

### Enhanced
- **Framework Specification**: Detailed v1.0.1-alpha spec for Constitutional Conductor phase
- **Governance Structure**: Complete governance directory structure with amendment tracking
- **Compliance Monitoring**: Real-time constitutional compliance scoring and violation detection
- **Auto-Correction**: Automated fixes for structural deviations, annotation compliance, and version consistency
- **Democratic Process**: Community-driven amendment proposals with voting mechanisms

## [1.1.0-beta] - 2025-08-19

### Added
- 🧠 **Pattern Recognition Engine**: Analyzes drift logs to learn from violations and predict future issues
- 🛡️ **Predictive Enforcement System**: Prevents violations before they occur using learned patterns
- 🎯 **Phase 2: Enhanced Pattern Recognition Complete**: Intelligent learning, pattern analysis, and predictive enforcement capabilities
- 📝 **Intelligent Changelog Generation**: AI-powered changelog analysis, version planning, and automated documentation detection
- 🗳️ **Democratic Amendment Workflows**: Complete community-driven constitutional governance system
- 🏛️ **Amendment Management Engine**: Proposal, review, voting, and implementation lifecycle management
- 🖥️ **Amendment CLI**: User-friendly command-line interface for democratic governance processes
- ⚖️ **Weighted Voting System**: Role-based voting weights with automatic quorum and threshold calculations

## [1.0.0-alpha] - 2025-08-05

### Added
- **Framework Foundation**: Semantic versioning adoption with structured v1.0.0-alpha release
- **Agent Manifest**: `framework/agent-manifest.json` for agent capability discovery and configuration
- **Version-Specific Instructions**: `framework/versions/instructions-v1.0.0-alpha.md` for agent guidance
- **CLI Tooling**: `cli/init-agent-context.ts` for automated copilot instruction generation
- **Three-Mode Execution**: `lean`, `strict`, and `generative` modes with token optimization
- **Output Management**: Standardized `output.{lean,strict,full}.json` pattern for AI agent outputs
- **Blueprint Replay**: Deterministic AI output regeneration from blueprint specifications
- **Visual Regression Testing**: Required screenshot diffing for public routes
- **Observability Contracts**: Mandatory telemetry emission points and event tracking
- **Error State Taxonomy**: Fallback UX definitions and error handling contracts
- **Rule Versioning**: Contract evolution tracking with semantic versioning

### Changed
- **Breaking**: Migrated from informal v4.x versioning to semantic v1.0.0-alpha
- **Breaking**: `@blueprintId` annotation now mandatory for all AI-generated files
- **Enhanced**: Blueprint metadata blocks now include `@aegisFrameworkVersion`
- **Enhanced**: CLI tooling updated to support v1.0.0-alpha workflows
- **Enhanced**: Documentation structure aligned with semantic versioning
- **Updated**: All framework references from v4.6/v4.7 to v1.0.0-alpha
- **Renamed**: Framework core specification to `framework-core-v1.0.0-alpha.md`

### Fixed
- Git tag migration from `v4.6.0` to `v1.0.0-alpha`
- Version consistency across all documentation and configuration files
- Copilot instructions alignment with new versioning system

### Infrastructure
- Adapter interface design for multi-tech-stack blueprint translation
- Agent manifest system for multi-agent orchestration support
- Snapshot testing framework for blueprint fidelity validation
- Enhanced validation tooling with `tools/validate-blueprint.ts`
