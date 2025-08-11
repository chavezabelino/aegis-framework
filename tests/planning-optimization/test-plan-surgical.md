<!--
@aegisBlueprint: planning-optimization
@version: 1.0.0
@mode: strict
@intent: Test surgical plan for planning optimization validation
@context: Validation of planning optimization system for surgical refactoring
-->

# Test Surgical Plan - Planning Optimization Validation

## 1) Contracts
- [ ] Planning optimization system handles surgical refactoring correctly
- [ ] Plan gate enforces surgical-level constraints (≤ 5 files, ≤ 6000 tokens)
- [ ] Behavioral contracts are properly validated for refactoring scenarios
- [ ] Route equivalence is maintained during refactoring

## 2) Changes (≤ 5 files)
- File: `tests/planning-optimization/test-plan-mvp.md` — create test plan for validation
- File: `tests/planning-optimization/test-plan-surgical.md` — create test plan for surgical validation
- File: `tests/planning-optimization/test-plan-systemic.md` — create test plan for systemic validation
- File: `tests/planning-optimization/planning-optimization.test.ts` — create integration tests
- File: `tests/planning-optimization/README.md` — create test documentation

## 3) Tests
- E2E: validate plan gate passes for surgical plan
- E2E: validate plan gate fails when exceeding surgical limits
- E2E: validate planner critic prefers MVP over surgical when appropriate
- Integration: test planning optimization with real blueprint scenarios

## 4) Risks & Rollback
- Risk: Surgical plan may touch more files than intended
- Risk: Integration tests may reveal framework compatibility issues
- Rollback: revert all test files if validation issues arise

## 5) Done When
- [ ] Surgical plan passes plan gate validation
- [ ] Integration tests pass successfully
- [ ] Planner critic correctly identifies surgical vs MVP tradeoffs
- [ ] All planning optimization tools work correctly for surgical scenarios
