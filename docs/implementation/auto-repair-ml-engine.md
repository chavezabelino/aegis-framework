# Enhanced Blueprint Auto-Repair ML Engine

<!--
@aegisBlueprint: enhanced-blueprint-auto-repair
@version: 1.2.1
@mode: lean
@intent: Documentation for the ML-driven blueprint auto-repair engine
@context: Describes design, usage, and observability for the v2.4.0 feature implementation
-->

## Overview
The ML-driven auto-repair engine analyzes blueprints for errors and anomalies, suggests or applies repairs, and emits observability events for all actions. It integrates with the self-healing-blueprint-engine and the observability pipeline.

## Key Features
- Rule-based and extensible error pattern recognition
- Context-sensitive repair suggestions and auto-fixes (id, version, content)
- Observability event emission for all repair actions
- Full constitutional compliance and traceability
- Extensible for future ML model/plugin integration

## Usage
1. Instantiate `AutoRepairMLEngine`.
2. Call `analyzeBlueprint(blueprint)` to detect error patterns.
3. Call `repairBlueprint(blueprint, patterns)` to get/apply repair actions.
4. Call `emitObservabilityEvents(actions)` to log all actions.

## Types
See `framework/healing/types.ts` for shared interfaces.

## Observability
All repair actions emit events to `framework/observability/events.jsonl` for audit and replay. Events include action details, context, and error handling.

## Status
- Complete as of v1.2.1
- All tests passing
- Ready for production and extension
