# PREC: Production-Ready Evidence Contract

## Purpose

A PREC proves a change is production-ready with machine-checkable commands and outputs.

## Location

- `blueprints/<id>/evidence.JSON`

## Schema (informal)

- Blueprint: string
- version: string
- evidence:
  - commands[]:
    - name: string
    - command: string
    - expected:
      - exit_code: number
      - output_contains[]?: string
      - files[]?: { path: string, required: boolean, non_empty: boolean }
  - Telemetry:
    - events[]: { name: string, file: string, schema: any }
  - outputs:
    - required_files[]: string
- validation: { timestamp: string, commit: string, environment: string }

## Example: blueprints/planning-optimization/evidence.JSON

```json
{
  "Blueprint": "planning-optimization",
  "version": "2.5.0",
  "evidence": {
    "commands": [
      {
        "name": "cli_help",
        "command": "npm run Aegis:planning help",
        "expected": {"exit_code": 0, "output_contains": ["Usage:", "auto", "validate", "compare"]}
      },
      {
        "name": "auto_detection",
        "command": "npm run Aegis:planning auto \"Add user authentication\" -- --output .Aegis/outputs/auth-plan-strict.JSON",
        "expected": {
          "exit_code": 0,
          "output_contains": ["Plan generated"],
          "files": [{"path": ".Aegis/outputs/auth-plan-strict.JSON", "required": true, "non_empty": true}]
        }
      }
    ],
    "Telemetry": {
      "events": [{"name": "planning.detected", "file": ".Aegis/Telemetry/planning-events.NDJSON", "schema": {}}]
    },
    "outputs": {"required_files": [".Aegis/outputs/auth-plan-strict.JSON"]}
  },
  "validation": {"timestamp": "2025-01-15T10:00:00Z", "commit": "{{COMMIT_SHA}}", "environment": "ci"}
}
```text

## CI Enforcement

- CI MUST execute each `commands[].command` and verify:
  - Exit code matches.
  - `output_contains[]` lines appear.
  - Each expected file exists, has size > 0, and mtime > job start.
- CI MUST upload outputs and Telemetry as artifacts.
