import { test, expect } from './fixtures/test-base';

test.describe('Authentication & Access Control Journey', () => {
  test.beforeEach(async ({ resetDatabase }) => {
    resetDatabase();
  });

  test('Happy Path: Customer can login successfully and is redirected to menus', async ({ page }) => {
    await page.goto('/login');

    await page.locator('[data-testid="login-email-input"]').fill('customer@e2e.test');
    await page.locator('[data-testid="login-password-input"]').fill('password123');
    await page.locator('[data-testid="login-submit-button"]').click();

    await page.waitForURL('**/menus');
    await expect(page).toHaveURL(/.*menus/);
    await expect(page.getByText('Customer E2E').first()).toBeVisible();
  });

  test('Happy Path: Admin can login successfully and is redirected to admin dashboard', async ({ page }) => {
    await page.goto('/login');

    await page.locator('[data-testid="login-email-input"]').fill('admin@e2e.test');
    await page.locator('[data-testid="login-password-input"]').fill('password123');
    await page.locator('[data-testid="login-submit-button"]').click();

    await page.waitForURL('**/admin/dashboard');
    await expect(page).toHaveURL(/.*admin\/dashboard/);
    await expect(page.getByRole('heading', { name: /dashboard/i }).first()).toBeVisible();
  });

  test('Happy Path: New user can register and is automatically logged in', async ({ page }) => {
    const uniqueEmail = `newuser_${Date.now()}@e2e.test`;

    await page.goto('/register');
    await page.locator('[data-testid="register-name-input"]').fill('New User Playwright');
    await page.locator('[data-testid="register-email-input"]').fill(uniqueEmail);
    await page.locator('[data-testid="register-password-input"]').fill('secret1234');
    await page.locator('[data-testid="register-password-confirmation-input"]').fill('secret1234');
    await page.locator('[data-testid="register-submit-button"]').click();

    await page.waitForURL('**/menus');
    await expect(page).toHaveURL(/.*menus/);
    await expect(page.getByText('New User Playwright').first()).toBeVisible();
  });

  test('Happy Path: Customer can logout successfully', async ({ page }) => {
    await page.goto('/login');
    await page.locator('[data-testid="login-email-input"]').fill('customer@e2e.test');
    await page.locator('[data-testid="login-password-input"]').fill('password123');
    await page.locator('[data-testid="login-submit-button"]').click();
    await page.waitForURL('**/menus');

    // Click logout icon in navbar (desktop)
    const logoutIcon = page.locator('nav').locator('svg.text-red-600').first();
    await logoutIcon.click();

    // Confirm logout in modal
    const confirmLogoutBtn = page.getByRole('button', { name: /ya, logout/i });
    await expect(confirmLogoutBtn).toBeVisible();
    await confirmLogoutBtn.click();

    await page.waitForURL('**/login');
    await expect(page).toHaveURL(/.*login/);
  });

  test('Failure State: Login with invalid password displays error message', async ({ page }) => {
    await page.goto('/login');

    await page.locator('[data-testid="login-email-input"]').fill('customer@e2e.test');
    await page.locator('[data-testid="login-password-input"]').fill('wrong-password-999');
    await page.locator('[data-testid="login-submit-button"]').click();

    // Stays on login page and shows validation error
    await expect(page).toHaveURL(/.*login/);
    const errorText = page.locator('span.text-red-500');
    await expect(errorText).toBeVisible();
    await expect(errorText).toContainText(/tidak cocok|match our records/i);
  });

  test('Failure State: Register with mismatched password confirmation displays error', async ({ page }) => {
    await page.goto('/register');

    await page.locator('[data-testid="register-name-input"]').fill('Test Mismatch');
    await page.locator('[data-testid="register-email-input"]').fill(`mismatch_${Date.now()}@e2e.test`);
    await page.locator('[data-testid="register-password-input"]').fill('password123');
    await page.locator('[data-testid="register-password-confirmation-input"]').fill('different-password');
    await page.locator('[data-testid="register-submit-button"]').click();

    await expect(page).toHaveURL(/.*register/);
    await expect(page.locator('span.text-red-500')).toBeVisible();
  });

  test('Failure State: Guest is redirected to login when accessing protected customer route', async ({ page }) => {
    await page.goto('/carts');
    await page.waitForURL('**/login');
    await expect(page).toHaveURL(/.*login/);
  });

  test('Failure State: Guest is redirected to login when accessing protected admin dashboard', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await page.waitForURL('**/login');
    await expect(page).toHaveURL(/.*login/);
  });

  test('Failure State: Customer is forbidden (403) from accessing admin dashboard', async ({ browser, baseURL }) => {
    // Open context with customer authentication storageState
    const context = await browser.newContext({
      baseURL,
      storageState: 'tests/e2e/.auth/customer.json',
    });
    const page = await context.newPage();

    const response = await page.goto('/admin/dashboard');
    expect(response?.status()).toBe(403);
    await context.close();
  });
});
