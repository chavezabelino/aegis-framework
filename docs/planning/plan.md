<!--
@aegisBlueprint: planning-optimization
# Minimum Viable Plan (MVP-Fix) Template

@version: 1.0.0
@mode: lean
@intent: Example plan for adding user authentication redirect
@context: Real-world example of using planning optimization system
-->

# Minimum Viable Plan (MVP-Fix) Template

## 1) Contracts

- [ ] Unauthenticated users are redirected to login page (observable behavior)
- [ ] Login page displays form with email and password fields (user-facing)
- [ ] Successful login redirects to dashboard (behavioral contract) Notes: Keep to observable behavior.

## 2) Changes (≤ 2 files)

- File: `src/middleware/auth.ts` — add authentication middleware with redirect logic
- File: `src/pages/login.tsx` — create login page with form and redirect handling

## 3) Tests

- E2E: test unauthenticated user redirects to login (accepts `/login` or `/(auth)/login`)
- E2E: test successful login redirects to dashboard
- Component: assert login form has proper ARIA labels and roles

## 4) Risks & Rollback

- Risk: Middleware might affect other routes
- Rollback: revert `src/middleware/auth.ts` and `src/pages/login.tsx`

## 5) Done When

- [ ] Contracts pass locally
- [ ] Redirects accept `/login` __or__ `/(auth)/login`
- [ ] plan-gate passes
