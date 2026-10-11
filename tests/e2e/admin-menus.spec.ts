import { test, expect } from './fixtures/test-base';
import path from 'node:path';

test.describe('Admin Product Catalog Management Journey', () => {
  test.use({ storageState: 'tests/e2e/.auth/admin.json' });

  test.beforeEach(async ({ resetDatabase }) => {
    resetDatabase();
  });

  test('Happy Path: Admin can view list of all products in admin table', async ({ page }) => {
    await page.goto('/admin/menus');

    await expect(page.getByRole('heading', { name: /daftar produk/i })).toBeVisible();
    await expect(page.getByText('Espresso E2E')).toBeVisible();
    await expect(page.getByText('Croissant Butter E2E')).toBeVisible();
  });

  test('Happy Path: Admin can search products in admin table', async ({ page }) => {
    await page.goto('/admin/menus');

    const searchInput = page.locator('input[placeholder*="Cari produk..."]');
    await searchInput.fill('Croissant');

    await expect(page.getByText('Croissant Butter E2E')).toBeVisible();
    await expect(page.getByText('Espresso E2E')).not.toBeVisible();
  });

  test('Happy Path: Admin can create a new product with image upload', async ({ page }) => {
    await page.goto('/menus/create');
    await expect(page.getByRole('heading', { name: /halaman tambah product/i })).toBeVisible();

    const sampleImagePath = path.resolve('tests/e2e/fixtures/sample-product.png');

    await page.locator('input[name="name"]').fill('Americano Special Playwright');
    await page.locator('input[name="price"]').fill('22000');
    await page.locator('input[name="description"]').fill('Americano segar dingin untuk testing Playwright');
    await page.locator('input[name="stock"]').fill('15');
    await page.locator('select[name="kategori"]').selectOption('Coffee');
    await page.locator('input[name="image"]').setInputFiles(sampleImagePath);

    await page.locator('[data-testid="submit-create-menu-btn"]').click();

    // Success alert appears
    await expect(page.getByText(/data berhasil di tambahkan/i)).toBeVisible();

    // Verify it appears in /admin/menus
    await page.goto('/admin/menus');
    await expect(page.getByText('Americano Special Playwright').first()).toBeVisible();
  });

  test('Happy Path: Admin can delete a product with confirmation modal', async ({ page }) => {
    await page.goto('/admin/menus');

    // Find delete button for Out of Stock Coffee
    const outOfStockRow = page.locator('tr').filter({ hasText: 'Out of Stock Coffee' });
    await expect(outOfStockRow).toBeVisible();
    const deleteBtn = outOfStockRow.locator('[data-testid^="delete-menu-btn-"]');
    await deleteBtn.click();

    // Modal opens
    await expect(page.getByText(/apakah anda yakin ingin menghapus produk/i)).toBeVisible();
    const confirmDeleteBtn = page.locator('[data-testid="confirm-delete-menu-btn"]');
    await confirmDeleteBtn.click();

    // Modal closes and row should no longer be visible
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(outOfStockRow).not.toBeVisible();
  });

  test('Failure State: Validation error when submitting empty product form', async ({ page }) => {
    await page.goto('/menus/create');

    // Fill only price, leave required name empty or trigger client-side / browser validation
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toHaveAttribute('required', '');

    // Attempt to submit empty
    await page.locator('[data-testid="submit-create-menu-btn"]').click();

    // Browser prevents submission; stays on /menus/create
    await expect(page).toHaveURL(/.*menus\/create/);
  });

  test('Failure / Security State: Customer cannot access product creation page', async ({ browser, baseURL }) => {
    const customerContext = await browser.newContext({
      baseURL,
      storageState: 'tests/e2e/.auth/customer.json',
    });
    const customerPage = await customerContext.newPage();

    const response = await customerPage.goto('/menus/create');
    expect(response?.status()).toBe(403);
    await customerContext.close();
  });
});
