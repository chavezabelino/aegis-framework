# Aegis Governance Operations (Solo Dev, 1-Week Parallelized Rollout)

## Commands
- Enable (dry-run):    npm run governance:enable
- Disable (off):       npm run governance:disable
- Enforce validation:  npm run governance:enforce:validation
- Enforce hooks:       npm run governance:enforce:hooks
- Enforce intel:       npm run governance:enforce:intel
- Enforce monitoring:  npm run governance:enforce:monitoring
- Enforce all:         npm run governance:enforce:all
- Hooks install:       npm run governance:hooks:install
- Hooks uninstall:     npm run governance:hooks:uninstall
- Replay harness:      npm run governance:replay
- Status:              npm run governance:status

## Flags / Env
- AEGIS_GOVERNANCE_MODE = off | dry-run | enforce
- AEGIS_ENFORCE_VALIDATION / PREVENTION / INTEL / MONITORING = 0|1
- AEGIS_INTEL_THRESHOLD = 0.0–1.0 (default 0.90)
- TS_RUNNER = tsx (or your TS runner)

## Rollout Plan
Day 1: Wire all tools in dry-run; CI green; artifacts produced  
Day 2: Enforce validation only; fix breaks  
Day 3: Hooks installed locally (dry-run); CI enforces hooks on critical paths  
Day 4: Intelligence shadow (dry-run) with threshold 0.90  
Day 5: Enforce intelligence if stable; backoff to dry-run on flapping  
Day 6: Soak + perf tuning; budget thresholds  
Day 7: Utilities/docs hardening; tag release

## Kill Switch
- Global: set AEGIS_GOVERNANCE_MODE=off (CI and hooks exit 0)
- Local bypass: SKIP_AEGIS_HOOKS=1 git commit -m "..." (for emergencies)
