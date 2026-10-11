import { test, expect } from './fixtures/test-base';

test.describe('Cart Management Journey', () => {
  test.use({ storageState: 'tests/e2e/.auth/customer.json' });

  test.beforeEach(async ({ resetDatabase }) => {
    resetDatabase();
  });

  test('Happy Path: Customer can add product to cart and see updated cart badge', async ({ page }) => {
    // Navigate to Espresso detail page
    await page.goto('/menus');
    const espressoCard = page.locator('[data-testid^="product-card-"]').filter({ hasText: 'Espresso E2E' });
    await espressoCard.locator('[data-testid^="product-detail-btn-"]').click();

    // Click Add To Cart button
    await page.locator('[data-testid="add-to-cart-button"]').click();

    // Alert or redirect confirms addition
    await page.waitForURL('**/menus');
    await expect(page.getByText('Data berhasil di tambahkann')).toBeVisible();
    // Navbar cart badge shows at least 1
    const cartBadge = page.locator('nav a[href="/carts"] span.bg-rose-500');
    await expect(cartBadge).toHaveText('1');
  });

  test('Happy Path: Customer can manage cart items (increment & decrement) in carts page', async ({ page }) => {
    // Add item first
    await page.goto('/menus');
    const espressoCard = page.locator('[data-testid^="product-card-"]').filter({ hasText: 'Espresso E2E' });
    await espressoCard.locator('[data-testid^="product-detail-btn-"]').click();
    await page.locator('[data-testid="add-to-cart-button"]').click();
    await page.waitForURL('**/menus');

    // Go to /carts
    await page.goto('/carts');
    await expect(page.getByRole('heading', { name: /halaman keranjang/i })).toBeVisible();
    await expect(page.getByText('Espresso E2E')).toBeVisible();

    // Verify quantity is 1 initially
    const qtySpan = page.locator('[data-testid^="cart-quantity-"]').first();
    await expect(qtySpan).toHaveText('1');
    await expect(page.getByText('Rp 20.000').first()).toBeVisible();

    // Increment (+)
    const incBtn = page.locator('[data-testid^="cart-increment-"]').first();
    await incBtn.click();
    await expect(qtySpan).toHaveText('2');
    await expect(page.getByText('Rp 40.000').first()).toBeVisible();

    // Decrement (-)
    const decBtn = page.locator('[data-testid^="cart-decrement-"]').first();
    await decBtn.click();
    await expect(qtySpan).toHaveText('1');
    await expect(page.getByText('Rp 20.000').first()).toBeVisible();

    // Decrement again when 1 -> removes item
    await decBtn.click();
    await expect(page.getByText(/keranjang belanja anda masih kosong/i)).toBeVisible();
  });

  test('Happy Path: Customer can clear all items in cart using Cancel modal', async ({ page }) => {
    // Add item first
    await page.goto('/menus');
    const espressoCard = page.locator('[data-testid^="product-card-"]').filter({ hasText: 'Espresso E2E' });
    await espressoCard.locator('[data-testid^="product-detail-btn-"]').click();
    await page.locator('[data-testid="add-to-cart-button"]').click();
    await page.waitForURL('**/menus');

    // Click Cancel button in sidebar cart
    const cancelBtn = page.locator('[data-testid="sidebar-cancel-cart-btn"]');
    await expect(cancelBtn).toBeEnabled();
    await cancelBtn.click();

    // Confirm Clear in modal
    const confirmClearBtn = page.locator('[data-testid="modal-confirm-clear-cart-btn"]');
    await expect(confirmClearBtn).toBeVisible();
    await confirmClearBtn.click();

    // Cart is now empty in sidebar
    await expect(page.getByText(/cart is empty/i)).toBeVisible();
  });

  test('Failure / Empty State: Empty cart shows empty message and no checkout button', async ({ page }) => {
    await page.goto('/carts');
    await expect(page.getByText(/keranjang belanja anda masih kosong/i)).toBeVisible();
    await expect(page.locator('[data-testid="cart-order-button"]')).not.toBeVisible();
  });

  test('Failure State: Increment button is disabled when quantity reaches stock limit', async ({ page }) => {
    // Matcha Latte has stock = 5 in E2ETestSeeder
    await page.goto('/menus');
    const matchaCard = page.locator('[data-testid^="product-card-"]').filter({ hasText: 'Matcha Latte E2E' });
    await matchaCard.locator('[data-testid^="product-detail-btn-"]').click();
    await page.locator('[data-testid="add-to-cart-button"]').click();
    await page.waitForURL('**/menus');

    await page.goto('/carts');
    const incBtn = page.locator('[data-testid^="cart-increment-"]').first();
    const qtySpan = page.locator('[data-testid^="cart-quantity-"]').first();

    // Click (+) 4 times to reach 5
    for (let i = 0; i < 4; i++) {
      await incBtn.click();
      await page.waitForTimeout(300);
    }

    await expect(qtySpan).toHaveText('5');
    // Once quantity reaches 5 (equal to stock), button is disabled
    await expect(incBtn).toBeDisabled();
  });
});
