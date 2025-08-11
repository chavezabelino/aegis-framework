# Governance CI Workflows

## Required Jobs (set as required on main)

- `validate_blueprint`
- `check_provenance`
- `check_paths`
- `check_version`
- `prove_evidence`
- `vr_tests`

## Artifacts

- Governance report: `.Aegis/reports/governance-report.ci.JSON`
- Evidence outputs: `.Aegis/outputs/`
- Telemetry: `.Aegis/Telemetry/`
- Attestations: `.Aegis/attestations/`
- VR results: `test-results/`, `Playwright-report/`, `.Aegis/VR-baselines/`

## Command

- Local/CI generator: `node tools/generate-governance-report.ts`
