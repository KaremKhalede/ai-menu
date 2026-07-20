import { type Page } from '@playwright/test';

export class OnboardingPage {
  constructor(private page: Page) {}

  async completeOnboarding() {
    // Step 1: Select type
    const typeBtn = this.page.locator('text=مطعم فاخر');
    await typeBtn.waitFor({ state: 'visible' });
    await typeBtn.click({ force: true });
    await this.page.click('button:has-text("التالي")', { force: true });

    // Step 2: Fill info
    const nameInput = this.page.locator('input[placeholder="مثال: لافاندا"]');
    await nameInput.waitFor({ state: 'visible' });
    await nameInput.fill('لافاندا E2E');
    await this.page.fill('textarea[placeholder*="وصف قصير"]', 'مطعم راقي يقدم مأكولات فرنسية فاخرة');
    await this.page.click('button:has-text("التالي")', { force: true });

    // Step 3: Accept AI Suggestions
    const nextBtn = this.page.locator('button:has-text("التالي")');
    await nextBtn.waitFor({ state: 'visible' });
    await nextBtn.click({ force: true });

    // Step 4: Finish success screen
    const dashboardBtn = this.page.locator('button:has-text("لوحة التحكم")');
    await dashboardBtn.waitFor({ state: 'visible' });
    await dashboardBtn.click({ force: true });
  }
}
