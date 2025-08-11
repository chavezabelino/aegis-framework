<!--
@aegisBlueprint: planning-optimization
@version: 2.5.0
@mode: lean
@intent: Kilo prompt for generating contract-driven tests that assert observable behavior
@context: Test generation template that focuses on user-facing contracts rather than implementation details
-->

# Contract-Driven Tests — Kilo Prompt

Task: Write/adjust tests that assert **promises** to users, not implementation.
Must:
- Accept multiple valid routes for auth (`/login` | `/(auth)/login`).
- Avoid RGB/class name assertions for themes; prefer computed gradients or semantics.
- Skip auth-only tests when TEST_EMAIL/TEST_PASSWORD not set.
- Use role/label/data-testid selectors.

Deliver:
- Full Playwright spec files (no snippets).
- README notes if new env vars/hooks needed.
