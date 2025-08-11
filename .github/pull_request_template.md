# 🛡️ Aegis Constitutional Governance PR

## 📋 **Evidence Manifest**

### **Blueprint Compliance**
- [ ] **Blueprint**: `blueprints/<id>/blueprint.yaml` exists and is valid
- [ ] **Evidence**: `blueprints/<id>/evidence.json` contains required commands and outputs
- [ ] **Validation**: All evidence commands execute successfully

### **Governance Checks**
- [ ] **Provenance**: All AI-generated files have valid headers with cryptographic hashes
- [ ] **Attestations**: HMAC signatures generated and verified for all files
- [ ] **Paths**: All files in allowed directories, no unauthorized locations
- [ ] **Versions**: All version references synchronized across project
- [ ] **Evidence**: Evidence manifest validates successfully

## 🔍 **Command Receipts**

### **Planning Optimization**
```bash
# Auto-detection
npm run aegis:planning auto "Add user authentication" -- --output .aegis/outputs/auth-plan-strict.json
# Output: ✅ Plan generated: .aegis/outputs/auth-plan-strict.json

# Validation
npm run aegis:planning validate MVP-Fix .aegis/outputs/auth-plan-strict.json 2
# Output: ✅ Plan validation passed
```

### **Governance Enforcement**
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
node tools/check-evidence.ts blueprints/**/evidence.json --ci
# Output: ✅ All evidence manifests are valid
```

### **Attestation**
```bash
# Generate attestations
AEGIS_HMAC_KEY=${{ secrets.AEGIS_HMAC_KEY }} node tools/attest.ts attest tools cli
# Output: ✅ Attested 48 files

# Verify attestations
AEGIS_HMAC_KEY=${{ secrets.AEGIS_HMAC_KEY }} node tools/attest.ts verify tools cli
# Output: ✅ All attestations verified successfully
```

## 📊 **Telemetry Artifacts**

### **Planning Events**
```json
{"timestamp":"2025-01-15T10:00:00Z","event":"planning.detected","planClass":"MVP-Fix","confidence":0.95,"prompt":"Add user authentication"}
{"timestamp":"2025-01-15T10:00:01Z","event":"planning.validated","planClass":"MVP-Fix","validationResult":"passed","tokenCount":1089}
{"timestamp":"2025-01-15T10:00:02Z","event":"planning.selected","planClass":"MVP-Fix","reasoning":["minimal scope","contract-driven","observable behavior"]}
```

### **Generated Outputs**
- `.aegis/outputs/auth-plan-strict.json` - Planning optimization output
- `.aegis/telemetry/planning-events.ndjson` - Telemetry events
- `.aegis/attestations/<commit>/tools/*.sig` - Cryptographic attestations

## 🎯 **VR Summary**

### **Visual Regression Tests**
- [ ] **Baseline**: `.aegis/vr-baselines/` contains reference screenshots
- [ ] **Current**: `.aegis/vr-report/` contains current run results
- [ ] **Threshold**: Diff percentage < 0.01 (1%)
- [ ] **Routes**: All public routes tested for visual consistency

### **VR Results**
```bash
npx playwright test --config=tests/vr/playwright.config.ts
# Output: ✅ All VR tests passed
```

## 🚨 **Governance Violations**

### **Fixed Violations**
- [ ] **Path violations**: Moved unauthorized files to proper locations
- [ ] **Provenance violations**: Added missing headers and generated hashes
- [ ] **Version violations**: Synchronized all version references
- [ ] **Evidence violations**: Created missing telemetry and output files

### **Current Status**
- [ ] **CI Status**: All governance jobs pass
- [ ] **Required Statuses**: All required status checks enabled
- [ ] **Artifacts**: All required artifacts uploaded

## 📝 **Summary**

### **What Changed**
- [ ] **Files modified**: List of files with changes
- [ ] **Governance impact**: How changes affect constitutional compliance
- [ ] **Evidence provided**: Links to generated artifacts and receipts

### **Compliance Verification**
- [ ] **Blueprint primacy**: All changes trace to valid blueprints
- [ ] **Provenance**: All AI-generated content has verifiable headers
- [ ] **Attestation**: All files have cryptographic signatures
- [ ] **Evidence**: All claims backed by machine-checkable proofs

---

**This PR demonstrates constitutional governance enforcement with concrete evidence, cryptographic attestations, and machine-verifiable proofs.**
