<!--
@aegisBlueprint: planning-optimization
# Minimum Viable Plan (MVP-Fix) Template

@version: 1.0.0
@mode: lean
@intent: Template for minimum viable plan creation with contract-driven approach
@context: Standardized plan format for MVP-Fix class plans
-->

# Minimum Viable Plan (MVP-Fix) Template

## 1) Contracts

- [ ] Contract 1 (e.g., unauthenticated admin redirects to login)
- [ ] Contract 2 Notes: Keep to observable behavior.

## 2) Changes (≤ 2 files)

- File: <path> — action & reason
- File: <path> — action & reason

## 3) Tests

- E2E: add/adjust contract specs (no RGB or class assertions)
- Component (optional): assert roles/labels only

## 4) Risks & Rollback

- Risk: …
- Rollback: revert files: …

## 5) Done When

- [ ] Contracts pass locally
- [ ] Redirects accept `/login` __or__ `/(auth)/login`
- [ ] plan-gate passes
