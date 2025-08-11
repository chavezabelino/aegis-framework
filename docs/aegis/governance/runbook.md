# Governance Runbook

## Generate Receipts (Local)

```
node tools/generate-governance-report.ts
open .Aegis/reports/governance-report.local.JSON
```

## Seed Red→Green in CI

### Red (seed a violation)

```
echo "// no provenance" > unauthorized-file.ts
git add unauthorized-file.ts
git commit -m "test: seed governance violation"
git push
```

### Green (fix)

```
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

- CI uploads governance report, outputs, Telemetry, attestations, and VR results.
