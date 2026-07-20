import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  globalSetup: require.resolve('./tests/e2e/global-setup'),
  globalTeardown: require.resolve('./tests/e2e/global-teardown'),
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npx cross-env NODE_ENV=test DATABASE_URL=file:./dev.test.db PLAYWRIGHT_TEST=1 PORT=3001 next dev -p 3001',
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'file:./dev.test.db',
      PLAYWRIGHT_TEST: '1'
    },
    url: 'http://localhost:3001/api/health/liveness',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
