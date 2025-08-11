# Governance Runbook

## Generate Receipts (Local)
```bash
node tools/generate-governance-report.ts
open .aegis/reports/governance-report.local.json
```

## Seed Red→Green in CI
### Red (seed a violation)
```bash
echo "// no provenance" > unauthorized-file.ts
git add unauthorized-file.ts
git commit -m "test: seed governance violation"
git push
```
### Green (fix)
```bash
git rm unauthorized-file.ts
git commit -m "fix: remove seeded violation"
git push
```

## Interpret Failures
- `check_paths` exitCode ≠ 0 → unauthorized files/dirs; fix placements.
- `check_provenance` failure → missing/invalid provenance or attestation.
- `prove_evidence` failure → evidence manifest outputs missing/invalid.
- `vr_tests` failure → visual diff > threshold; update baseline intentionally or fix UI.

## Artifacts
- CI uploads governance report, outputs, telemetry, attestations, and VR results.
