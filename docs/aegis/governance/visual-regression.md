# Visual Regression Policy

## Baselines

- Store baselines under `.Aegis/VR-baselines/`.
- Keep deterministic viewport and content for stability.

## Threshold

- Use `maxDiffPixelRatio: 0.01` (1%) as the failure threshold.

## CI

- Install Playwright in CI and run tests.
- Upload `test-results/`, `Playwright-report/`, and `.Aegis/VR-baselines/` as artifacts.

## Example Test

```ts
import {test, expect} from "@Playwright/test"

test("baseline visual", async ({page}) => {
  await page.setViewportSize({width: 800, height: 600})
  await page.setContent('<main style="font-family:sans-serif;padding:24px"><h1>Aegis VR Baseline</h1></main>')
  await expect(page).toHaveScreenshot({maxDiffPixelRatio: 0.01})
})
```text
