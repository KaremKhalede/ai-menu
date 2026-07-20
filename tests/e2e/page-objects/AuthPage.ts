import { type Page } from '@playwright/test';

export class AuthPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  async loginWithDemo() {
    const emailInput = this.page.locator('input[type="email"]');
    
    // Click with force: true to bypass Framer Motion stability checks
    let attempts = 0;
    while (attempts < 5) {
      await this.page.locator('button:has-text("تسجيل عبر الإيميل")').click({ force: true });
      try {
        await emailInput.waitFor({ state: 'visible', timeout: 1500 });
        break;
      } catch {
        attempts++;
      }
    }

    // Type email
    await emailInput.fill('test@menuai.com');

    // Click submit/send magic link button with force: true
    const demoBtn = this.page.locator('button:has-text("للعرض التجريبي، اضغط هنا")');
    attempts = 0;
    while (attempts < 5) {
      await this.page.locator('button:has-text("إرسال رابط تسجيل الدخول")').click({ force: true });
      try {
        await demoBtn.waitFor({ state: 'visible', timeout: 1500 });
        break;
      } catch {
        attempts++;
      }
    }

    // Click demo login button with force: true
    await demoBtn.click({ force: true });
  }
}
