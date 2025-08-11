import { test, expect } from '@playwright/test';

test('@critical app starts', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Aegis/i);
});

test('@critical theme tokens present', async ({ page }) => {
  await page.goto('/');
  const c = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--color-bg'));
  expect(c?.trim().length).toBeGreaterThan(0);
});
