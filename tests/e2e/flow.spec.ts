import { test, expect } from '@playwright/test';
import { AuthPage } from './page-objects/AuthPage';
import { OnboardingPage } from './page-objects/OnboardingPage';

test.describe.skip('End-to-End User Journeys', () => {
  test('should complete login, onboarding, and navigate dashboard tabs successfully', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));

    const auth = new AuthPage(page);
    const onboarding = new OnboardingPage(page);

    // 1. Authentication
    await auth.navigate();
    await auth.loginWithDemo();

    // 2. Onboarding Wizard
    await expect(page).toHaveURL(/.*onboarding/);
    await onboarding.completeOnboarding();

    // 3. Dashboard Navigation & Verification
    await expect(page).toHaveURL(/.*dashboard/);

    // Verify analytics cards are visible
    const cards = page.locator('text=مبيعات');
    await expect(cards).toBeVisible();

    // Navigate to Settings page
    await page.click('button:has-text("الإعدادات")');
    await expect(page.locator('text=شخصية المساعد الذكي')).toBeVisible();

    // Modify settings and save
    await page.fill('input[placeholder="أدخل الاسم"]', 'أحمد كمال');
    await page.click('button:has-text("حفظ التغييرات")');

    // Navigate to CRM page
    await page.click('button:has-text("العملاء")');
    await expect(page.locator('text=سجل العملاء')).toBeVisible();

    // Navigate to Menu page
    await page.click('button:has-text("محرر المنيو")');
    await expect(page.locator('text=أضف طبق جديد')).toBeVisible();
  });
});
