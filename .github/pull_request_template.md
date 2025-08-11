# 🛡️ Aegis Constitutional Governance PR

## 📋 __Evidence Manifest**

### __Blueprint Compliance**

- [ ] __Blueprint__: `blueprints/<id>/Blueprint.YAML` exists and is valid
- [ ] __Evidence__: `blueprints/<id>/evidence.JSON` contains required commands and outputs
- [ ] __Validation__: All evidence commands execute successfully

### __Governance Checks**

- [ ] __Provenance__: All AI-generated files have valid headers with cryptographic hashes
- [ ] __Attestations__: HMAC signatures generated and verified for all files
- [ ] __Paths__: All files in allowed directories, no unauthorized locations
- [ ] __Versions__: All version references synchronized across project
- [ ] __Evidence__: Evidence manifest validates successfully

## 🔍 __Command Receipts**

### __Planning Optimization**

```bash
# Auto-detection
npm run Aegis:planning auto "Add user authentication" -- --output .Aegis/outputs/auth-plan-strict.JSON
# Output: ✅ Plan generated: .Aegis/outputs/auth-plan-strict.JSON

# Validation
npm run Aegis:planning validate MVP-Fix .Aegis/outputs/auth-plan-strict.JSON 2
# Output: ✅ Plan validation passed
```

### __Governance Enforcement**

```bash
# Provenance check
npm run check:provenance -- --ci
# Output: ✅ All files have valid provenance headers

# Path check
npm run check:paths -- --ci
# Output: ✅ All files and directories are in allowed locations

# Version check
npm run check:version -- --ci
# Output: ✅ All version references are synchronized

# Evidence check
node tools/check-evidence.ts blueprints/__/evidence.JSON --ci
# Output: ✅ All evidence manifests are valid
```

### __Attestation**

```bash
# Generate attestations
AEGIS_HMAC_KEY=${{ secrets.AEGIS_HMAC_KEY }} node tools/attest.ts attest tools CLI
# Output: ✅ Attested 48 files

# Verify attestations
AEGIS_HMAC_KEY=${{ secrets.AEGIS_HMAC_KEY }} node tools/attest.ts verify tools CLI
# Output: ✅ All attestations verified successfully
```

## 📊 __Telemetry Artifacts**

### __Planning Events**

```json
{"timestamp":"2025-01-15T10:00:00Z","event":"planning.detected","planClass":"MVP-Fix","confidence":0.95,"prompt":"Add user authentication"}
{"timestamp":"2025-01-15T10:00:01Z","event":"planning.validated","planClass":"MVP-Fix","validationResult":"passed","tokenCount":1089}
{"timestamp":"2025-01-15T10:00:02Z","event":"planning.selected","planClass":"MVP-Fix","reasoning":["minimal scope","contract-driven","observable behavior"]}
```

### __Generated Outputs**

- `.Aegis/outputs/auth-plan-strict.JSON` - Planning optimization output
- `.Aegis/Telemetry/planning-events.NDJSON` - Telemetry events
- `.Aegis/attestations/<commit>/tools/*.sig` - Cryptographic attestations

## 🎯 __VR Summary**

### __Visual Regression Tests**

- [ ] __Baseline__: `.Aegis/VR-baselines/` contains reference screenshots
- [ ] __Current__: `.Aegis/VR-report/` contains current run results
- [ ] __Threshold__: Diff percentage < 0.01 (1%)
- [ ] __Routes__: All public routes tested for visual consistency

### __VR Results**

```bash
npx Playwright test --config=tests/VR/Playwright.config.ts
# Output: ✅ All VR tests passed
```

## 🚨 __Governance Violations**

### __Fixed Violations**

- [ ] __Path violations__: Moved unauthorized files to proper locations
- [ ] __Provenance violations__: Added missing headers and generated hashes
- [ ] __Version violations__: Synchronized all version references
- [ ] __Evidence violations__: Created missing Telemetry and output files

### __Current Status**

- [ ] __CI Status__: All governance jobs pass
- [ ] __Required Statuses__: All required status checks enabled
- [ ] __Artifacts__: All required artifacts uploaded

## 📝 __Summary**

### __What Changed**

- [ ] __Files modified__: List of files with changes
- [ ] __Governance impact__: How changes affect Constitutional compliance
- [ ] __Evidence provided__: Links to generated artifacts and receipts

### __Compliance Verification**

- [ ] __Blueprint primacy__: All changes trace to valid blueprints
- [ ] __Provenance__: All AI-generated content has verifiable headers
- [ ] __Attestation__: All files have cryptographic signatures
- [ ] __Evidence__: All claims backed by machine-checkable proofs

---

**This PR demonstrates Constitutional governance enforcement with concrete evidence, cryptographic attestations, and
machine-verifiable proofs.**
