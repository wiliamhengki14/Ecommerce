import { test, expect } from './fixtures/test-base';

test.describe('Admin Order Fulfillment Journey', () => {
  test.use({ storageState: 'tests/e2e/.auth/admin.json' });

  test.beforeEach(async ({ resetDatabase }) => {
    resetDatabase();
  });

  test('Happy Path: Admin can view list of customer orders in table', async ({ page }) => {
    await page.goto('/admin/orders');

    await expect(page.getByRole('heading', { name: /daftar pesanan/i }).first()).toBeVisible();
    await expect(page.getByText('ORD-TEST1234')).toBeVisible();
    await expect(page.getByText('Customer E2E').first()).toBeVisible();
    await expect(page.getByText(/menunggu|pending/i).first()).toBeVisible();
  });

  test('Happy Path: Admin can search orders by order number or customer name', async ({ page }) => {
    await page.goto('/admin/orders');

    const searchInput = page.locator('input[placeholder*="Cari ID / Nama / Status..."]');
    await searchInput.fill('ORD-TEST1234');

    await expect(page.getByText('ORD-TEST1234')).toBeVisible();
  });

  test('Happy Path: Admin can view order details and mark as completed', async ({ page }) => {
    await page.goto('/admin/orders');

    // Click detail button on the order row
    const orderRow = page.locator('tr').filter({ hasText: 'ORD-TEST1234' });
    const detailLink = orderRow.locator('[data-testid^="order-detail-link-"]');
    await detailLink.click();

    // Verify detail page
    await page.waitForURL('**/admin/orders/*/show');
    await expect(page.getByText(/pesanan #ord-test1234/i)).toBeVisible();
    await expect(page.getByText('Customer E2E').first()).toBeVisible();
    await expect(page.getByText('Espresso E2E')).toBeVisible();
    await expect(page.getByText('Rp 20.000').first()).toBeVisible();

    // Click "Tandai Selesai" button
    const markCompletedBtn = page.locator('[data-testid="mark-order-completed-btn"]');
    await expect(markCompletedBtn).toBeVisible();
    await markCompletedBtn.click();

    // Verify status badge changed to "Selesai"
    await expect(page.getByText(/selesai/i).first()).toBeVisible();
    await expect(markCompletedBtn).not.toBeVisible();
  });

  test('Failure / Empty State: Searching non-existent order number shows empty state', async ({ page }) => {
    await page.goto('/admin/orders');

    const searchInput = page.locator('input[placeholder*="Cari ID / Nama / Status..."]');
    await searchInput.fill('ORD-NONEXISTENT-99999');

    await expect(page.getByText('ORD-TEST1234')).not.toBeVisible();
    await expect(page.getByText(/tidak ada pesanan ditemukan/i)).toBeVisible();
  });

  test('Failure / Security State: Customer cannot access admin orders page', async ({ browser, baseURL }) => {
    const customerContext = await browser.newContext({
      baseURL,
      storageState: 'tests/e2e/.auth/customer.json',
    });
    const customerPage = await customerContext.newPage();

    const response = await customerPage.goto('/admin/orders');
    expect(response?.status()).toBe(403);
    await customerContext.close();
  });
});
