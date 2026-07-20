import { test, expect } from '@playwright/test';

test('should load landing page and display logo title', async ({ page }) => {
  // Go to root landing path
  await page.goto('/');

  // Expect logo/header title to be present
  const logo = page.locator('span.font-playfair:has-text("Servio AI")');
  await expect(logo).toBeVisible();

  // Try to find trial/menu action buttons
  const menuBtn = page.locator('button:has-text("ابدأ مجاناً")').first();
  await expect(menuBtn).toBeVisible();
});
