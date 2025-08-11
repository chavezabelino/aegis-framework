# Visual Regression Policy

## Baselines
- Store baselines under `.aegis/vr-baselines/`.
- Keep deterministic viewport and content for stability.

## Threshold
- Use `maxDiffPixelRatio: 0.01` (1%) as the failure threshold.

## CI
- Install Playwright in CI and run tests.
- Upload `test-results/`, `playwright-report/`, and `.aegis/vr-baselines/` as artifacts.

## Example Test
```ts
import { test, expect } from '@playwright/test';

test('baseline visual', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 600 });
  await page.setContent('<main style="font-family:sans-serif;padding:24px"><h1>Aegis VR Baseline</h1></main>');
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.01 });
});
```
