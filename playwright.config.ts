import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Configuration for Laravel (Inertia + React)
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel or sequentially depending on database isolation */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI to avoid race conditions with database state */
  workers: process.env.CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [['list'], ['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  /* Timeout per test */
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: process.env.APP_URL || 'http://127.0.0.1:8000',
    /* Collect trace when retrying the failed test or upon failure */
    trace: 'retain-on-failure',
    /* Capture screenshot after test failure */
    screenshot: 'only-on-failure',
    /* Record video only on failure */
    video: 'retain-on-failure',
    /* Custom test attribute */
    testIdAttribute: 'data-testid',
  },

  /* Configure projects for major browsers and auth fixtures */
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'guest',
      testMatch: /.*auth\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'customer',
      dependencies: ['setup'],
      testMatch: /.*(catalog|cart|checkout|ai-chat)\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/e2e/.auth/customer.json',
      },
    },
    {
      name: 'admin',
      dependencies: ['setup'],
      testMatch: /.*admin-.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/e2e/.auth/admin.json',
      },
    },
  ],

  /* Run local dev server before starting the tests */
  webServer: {
    command: 'php artisan serve --host=127.0.0.1 --port=8000',
    url: 'http://127.0.0.1:8000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
