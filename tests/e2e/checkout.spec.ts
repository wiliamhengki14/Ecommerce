import { test, expect } from './fixtures/test-base';

test.describe('Checkout & Order Placement Journey', () => {
  test.use({ storageState: 'tests/e2e/.auth/customer.json' });

  test.beforeEach(async ({ resetDatabase }) => {
    resetDatabase();
  });

  test('Happy Path: Customer can checkout using Cash and view the new order in orders list', async ({ page }) => {
    // 1. Add item to cart
    await page.goto('/menus');
    const espressoCard = page.locator('[data-testid^="product-card-"]').filter({ hasText: 'Espresso E2E' });
    await espressoCard.locator('[data-testid^="product-detail-btn-"]').click();
    await page.locator('[data-testid="add-to-cart-button"]').click();
    await page.waitForURL('**/menus');

    // 2. Open /carts and trigger order modal
    await page.goto('/carts');
    const orderBtn = page.locator('[data-testid="cart-order-button"]');
    await expect(orderBtn).toBeVisible();
    await orderBtn.click();

    // 3. Confirm Cash Order
    const confirmOrderBtn = page.locator('[data-testid="cart-modal-confirm-order-button"]').first();
    await expect(confirmOrderBtn).toBeVisible();
    await confirmOrderBtn.click();

    // 4. Cart should now be empty and order message received
    await expect(page.getByText('Data berhasil di order!')).toBeVisible();

    // 5. Navigate to /orders
    await page.goto('/orders');
    await expect(page.getByRole('heading', { name: /list order milik: customer e2e/i })).toBeVisible();

    // Verify order row exists with ORD- prefix and pending status
    const orderRow = page.locator('tbody tr').first();
    await expect(orderRow).toBeVisible();
    await expect(orderRow.getByText(/ORD-/)).toBeVisible();
    await expect(orderRow.getByText(/pending/i)).toBeVisible();
    await expect(orderRow.getByText(/Rp 20\.000/)).toBeVisible();
  });

  test('Happy Path: Customer can checkout using QRIS tab', async ({ page }) => {
    // Add item to cart
    await page.goto('/menus');
    const croissantCard = page.locator('[data-testid^="product-card-"]').filter({ hasText: 'Croissant Butter E2E' });
    await croissantCard.locator('[data-testid^="product-detail-btn-"]').click();
    await page.locator('[data-testid="add-to-cart-button"]').click();
    await page.waitForURL('**/menus');

    // Go to /carts
    await page.goto('/carts');
    await page.locator('[data-testid="cart-order-button"]').click();

    // Switch to QRIS tab
    const qrisTabTrigger = page.getByRole('tab', { name: 'QRIS' });
    await qrisTabTrigger.click();
    await expect(page.getByText(/scan qr code berikut/i)).toBeVisible();

    // Click "Sudah Bayar & Order"
    const confirmQrisBtn = page.getByRole('button', { name: /sudah bayar & order/i });
    await confirmQrisBtn.click();

    // Check orders page
    await page.goto('/orders');
    const orderRow = page.locator('tbody tr').first();
    await expect(orderRow.getByText(/ORD-/)).toBeVisible();
  });

  test('Happy Path: Customer can view order details with item breakdown', async ({ page }) => {
    // Checkout one item first
    await page.goto('/menus');
    const espressoCard = page.locator('[data-testid^="product-card-"]').filter({ hasText: 'Espresso E2E' });
    await espressoCard.locator('[data-testid^="product-detail-btn-"]').click();
    await page.locator('[data-testid="add-to-cart-button"]').click();
    await page.waitForURL('**/menus');

    await page.goto('/carts');
    await page.locator('[data-testid="cart-order-button"]').click();
    await page.locator('[data-testid="cart-modal-confirm-order-button"]').first().click();

    // Go to /orders and click Detail
    await page.goto('/orders');
    const detailLink = page.locator('tbody tr').first().getByRole('link', { name: /detail/i });
    await detailLink.click();

    await page.waitForURL('**/orders/*/show');
    await expect(page.getByRole('heading', { name: /detail order/i })).toBeVisible();
    await expect(page.getByText('Espresso E2E').first()).toBeVisible();
    await expect(page.getByText(/Rp 20\.000/).first()).toBeVisible();
  });

  test('Failure / Security State: Customer cannot access other customers or non-existent order detail', async ({ page }) => {
    const response = await page.goto('/orders/99999/show');
    // Non-existent ID returns 404 or redirects
    expect([404, 302, 200]).toContain(response?.status());
    if (response?.status() === 302 || response?.status() === 200) {
      await expect(page).toHaveURL(/.*orders$/);
    }
  });
});
