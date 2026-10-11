import { test as setup, expect } from '@playwright/test';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const authDir = path.resolve('tests/e2e/.auth');
const customerAuthFile = path.join(authDir, 'customer.json');
const adminAuthFile = path.join(authDir, 'admin.json');

setup('prepare database and authenticate users', async ({ browser, baseURL }) => {
  // 1. Ensure .auth directory exists
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // 2. Run E2E database seeder to ensure deterministic test users & menus exist
  try {
    execSync('php artisan db:seed --class=E2ETestSeeder --force', {
      stdio: 'inherit',
    });
  } catch (error) {
    console.error('Failed to seed database for E2E tests:', error);
  }

  // 3. Authenticate Customer user
  const customerContext = await browser.newContext({ baseURL });
  const customerPage = await customerContext.newPage();
  
  await customerPage.goto('/login');
  await customerPage.locator('input[name="email"]').fill('customer@e2e.test');
  await customerPage.locator('input[name="password"]').fill('password123');
  await customerPage.locator('button[type="submit"]').click();
  
  // Wait until redirected to /menus
  await customerPage.waitForURL('**/menus', { timeout: 15000 });
  await expect(customerPage).toHaveURL(/.*menus/);
  await customerPage.context().storageState({ path: customerAuthFile });
  await customerContext.close();

  // 4. Authenticate Admin user
  const adminContext = await browser.newContext({ baseURL });
  const adminPage = await adminContext.newPage();
  
  await adminPage.goto('/login');
  await adminPage.locator('input[name="email"]').fill('admin@e2e.test');
  await adminPage.locator('input[name="password"]').fill('password123');
  await adminPage.locator('button[type="submit"]').click();
  
  await adminPage.waitForURL('**/admin/dashboard', { timeout: 15000 });
  await expect(adminPage).toHaveURL(/.*admin\/dashboard/);
  await adminPage.context().storageState({ path: adminAuthFile });
  await adminContext.close();
});
