import { test, expect } from './fixtures/test-base';

test.describe('Menu Catalog, Search & Filtering Journey', () => {
  test.use({ storageState: 'tests/e2e/.auth/customer.json' });

  test.beforeEach(async ({ resetDatabase }) => {
    resetDatabase();
  });

  test('Happy Path: Customer can view menu catalog with items and details', async ({ page }) => {
    await page.goto('/menus');

    await expect(page.getByRole('heading', { name: /explore our best menu/i })).toBeVisible();
    await expect(page.getByText('Espresso E2E')).toBeVisible();
    await expect(page.getByText('Croissant Butter E2E')).toBeVisible();
    await expect(page.getByText('Matcha Latte E2E')).toBeVisible();
  });

  test('Happy Path: Customer can filter menus by category', async ({ page }) => {
    await page.goto('/menus');

    // Click "Coffee" category filter
    const coffeeFilterBtn = page.locator('[data-testid="category-filter-Coffee"]');
    await coffeeFilterBtn.click();
    await page.waitForURL('**/*Kategori=Coffee*');

    await expect(page.getByText('Espresso E2E')).toBeVisible();
    // Pastries item should not be shown
    await expect(page.getByText('Croissant Butter E2E')).not.toBeVisible();

    // Click "Pastries" category filter
    const pastriesFilterBtn = page.locator('[data-testid="category-filter-Pastries"]');
    await pastriesFilterBtn.click();
    await page.waitForURL('**/*Kategori=Pastries*');

    await expect(page.getByText('Croissant Butter E2E')).toBeVisible();
    await expect(page.getByText('Espresso E2E')).not.toBeVisible();
  });

  test('Happy Path: Customer can search menus via navbar search input', async ({ page }) => {
    await page.goto('/menus');

    // Find desktop navbar search input
    const searchInput = page.locator('nav input[placeholder*="Cari produk"]').first();
    await searchInput.fill('Matcha');
    await searchInput.press('Enter');

    await page.waitForURL('**/*search=Matcha*');
    await expect(page.getByText('Matcha Latte E2E')).toBeVisible();
    await expect(page.getByText('Croissant Butter E2E')).not.toBeVisible();
  });

  test('Happy Path: Customer can view product detail page', async ({ page }) => {
    await page.goto('/menus');

    const espressoCard = page.locator('[data-testid^="product-card-"]').filter({ hasText: 'Espresso E2E' });
    await espressoCard.locator('[data-testid^="product-detail-btn-"]').click();

    await page.waitForURL('**/menus/*');
    await expect(page.getByRole('heading', { name: 'Espresso E2E' })).toBeVisible();
    await expect(page.getByText(/Rp 20\.000/)).toBeVisible();
    await expect(page.getByText(/Espresso murni dengan aroma pekat/)).toBeVisible();
    await expect(page.locator('[data-testid="add-to-cart-button"]')).toBeVisible();
  });

  test('Failure / Empty State: Search with non-matching keyword shows no results', async ({ page }) => {
    await page.goto('/menus');

    const searchInput = page.locator('nav input[placeholder*="Cari produk"]').first();
    await searchInput.fill('KeywordYangPastiTidakAda12345');
    await searchInput.press('Enter');

    await page.waitForURL('**/*search=KeywordYangPastiTidakAda12345*');
    await expect(page.getByText('Espresso E2E')).not.toBeVisible();
    await expect(page.getByText('Matcha Latte E2E')).not.toBeVisible();
  });

  test('Failure State: Accessing non-existent menu ID returns 404', async ({ page }) => {
    const response = await page.goto('/menus/999999');
    expect(response?.status()).toBe(404);
  });
});
