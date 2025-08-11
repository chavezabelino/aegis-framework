# PREC: Production-Ready Evidence Contract

## Purpose
A PREC proves a change is production-ready with machine-checkable commands and outputs.

## Location
- `blueprints/<id>/evidence.json`

## Schema (informal)
- blueprint: string
- version: string
- evidence:
  - commands[]:
    - name: string
    - command: string
    - expected:
      - exit_code: number
      - output_contains[]?: string
      - files[]?: { path: string, required: boolean, non_empty: boolean }
  - telemetry:
    - events[]: { name: string, file: string, schema: any }
  - outputs:
    - required_files[]: string
- validation: { timestamp: string, commit: string, environment: string }

## Example: blueprints/planning-optimization/evidence.json
```json
{
  "blueprint": "planning-optimization",
  "version": "2.5.0",
  "evidence": {
    "commands": [
      {
        "name": "cli_help",
        "command": "npm run aegis:planning help",
        "expected": { "exit_code": 0, "output_contains": ["Usage:", "auto", "validate", "compare"] }
      },
      {
        "name": "auto_detection",
        "command": "npm run aegis:planning auto \"Add user authentication\" -- --output .aegis/outputs/auth-plan-strict.json",
        "expected": {
          "exit_code": 0,
          "output_contains": ["Plan generated"],
          "files": [
            { "path": ".aegis/outputs/auth-plan-strict.json", "required": true, "non_empty": true }
          ]
        }
      }
    ],
    "telemetry": {
      "events": [
        { "name": "planning.detected", "file": ".aegis/telemetry/planning-events.ndjson", "schema": {} }
      ]
    },
    "outputs": { "required_files": [ ".aegis/outputs/auth-plan-strict.json" ] }
  },
  "validation": { "timestamp": "2025-01-15T10:00:00Z", "commit": "{{COMMIT_SHA}}", "environment": "ci" }
}
```

## CI Enforcement
- CI MUST execute each `commands[].command` and verify:
  - Exit code matches.
  - `output_contains[]` lines appear.
  - Each expected file exists, has size > 0, and mtime > job start.
- CI MUST upload outputs and telemetry as artifacts.
