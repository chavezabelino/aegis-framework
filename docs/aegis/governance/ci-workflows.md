# Governance CI Workflows

## Required Jobs (set as required on main)
- `validate_blueprint`
- `check_provenance`
- `check_paths`
- `check_version`
- `prove_evidence`
- `vr_tests`

## Artifacts
- Governance report: `.aegis/reports/governance-report.ci.json`
- Evidence outputs: `.aegis/outputs/`
- Telemetry: `.aegis/telemetry/`
- Attestations: `.aegis/attestations/`
- VR results: `test-results/`, `playwright-report/`, `.aegis/vr-baselines/`

## Command
- Local/CI generator: `node tools/generate-governance-report.ts`
