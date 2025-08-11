<!--
@aegisBlueprint: planning-optimization
@version: 1.0.0
@mode: strict
@intent: Alternative plan for user authentication with more complexity
@context: Demonstrating plan comparison with planner critic
-->

# Surgical Refactor Plan - User Authentication System

## 1) Contracts
- [ ] Unauthenticated users are redirected to login page (observable behavior)
- [ ] Login page displays form with email and password fields (user-facing)
- [ ] Successful login redirects to dashboard (behavioral contract)
- [ ] Authentication state persists across page refreshes (user-facing)
- [ ] Logout functionality clears authentication state (behavioral contract)

## 2) Changes (≤ 5 files)
- File: `src/middleware/auth.ts` — add authentication middleware with redirect logic
- File: `src/pages/login.tsx` — create login page with form and redirect handling
- File: `src/lib/auth.ts` — create authentication utilities and state management
- File: `src/components/AuthProvider.tsx` — create authentication context provider
- File: `src/hooks/useAuth.ts` — create authentication hook for components

## 3) Tests
- E2E: test unauthenticated user redirects to login (accepts `/login` or `/(auth)/login`)
- E2E: test successful login redirects to dashboard
- E2E: test authentication state persists on refresh
- E2E: test logout functionality clears state
- Component: assert login form has proper ARIA labels and roles

## 4) Risks & Rollback
- Risk: Context provider might affect app performance
- Risk: Multiple files increase complexity and testing burden
- Rollback: revert all 5 files if issues arise

## 5) Done When
- [ ] All contracts pass locally
- [ ] Authentication state management works correctly
- [ ] plan-gate passes for surgical plan
