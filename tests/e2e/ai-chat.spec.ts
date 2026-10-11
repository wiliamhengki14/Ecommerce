import { test, expect } from './fixtures/test-base';

test.describe('AI Chat Assistant Journey (Resilient Network Mocking)', () => {
  test.use({ storageState: 'tests/e2e/.auth/customer.json' });

  test.beforeEach(async ({ resetDatabase }) => {
    resetDatabase();
  });

  test('Happy Path: Customer can open floating AI chat widget, ask question, and receive response', async ({ page }) => {
    // Intercept network call to /ai-chat with deterministic response
    await page.route('**/ai-chat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          reply: 'Halo! Saya merekomendasikan **Espresso E2E** untuk pecinta kopi sejati.',
        }),
      });
    });

    await page.goto('/menus');

    // Toggle chat widget open
    const chatToggleBtn = page.locator('[data-testid="floating-ai-chat-btn"]');
    await expect(chatToggleBtn).toBeVisible();
    await chatToggleBtn.click();

    // Verify chat widget is open with textarea
    const chatTextarea = page.locator('[data-testid="ai-chat-textarea"]');
    await expect(chatTextarea).toBeVisible();

    // Type prompt and send
    await chatTextarea.fill('Rekomendasi kopi terbaik apa?');
    const sendBtn = page.locator('[data-testid="ai-chat-send-btn"]');
    await expect(sendBtn).toBeEnabled();
    await sendBtn.click();

    // Expect bot reply to be rendered
    await expect(page.getByText('Halo! Saya merekomendasikan Espresso E2E untuk pecinta kopi sejati.')).toBeVisible();
  });

  test('Failure / Realistic State: Chat input button is disabled when prompt is empty', async ({ page }) => {
    await page.goto('/menus');

    const chatToggleBtn = page.locator('[data-testid="floating-ai-chat-btn"]');
    await chatToggleBtn.click();

    const chatTextarea = page.locator('[data-testid="ai-chat-textarea"]');
    await expect(chatTextarea).toHaveValue('');

    const sendBtn = page.locator('[data-testid="ai-chat-send-btn"]');
    await expect(sendBtn).toBeDisabled();
  });

  test('Failure State: Server network error displays error notification gracefully', async ({ page }) => {
    // Mock network failure (500 internal server error)
    await page.route('**/ai-chat', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Layanan AI sedang mengalami gangguan. Silakan coba beberapa saat lagi.',
        }),
      });
    });

    await page.goto('/menus');

    const chatToggleBtn = page.locator('[data-testid="floating-ai-chat-btn"]');
    await chatToggleBtn.click();

    const chatTextarea = page.locator('[data-testid="ai-chat-textarea"]');
    await chatTextarea.fill('Pertanyaan saat server error');

    const sendBtn = page.locator('[data-testid="ai-chat-send-btn"]');
    await sendBtn.click();

    // Chat displays error message without crashing
    await expect(page.getByText(/layanan ai sedang mengalami gangguan|oops, something went wrong/i)).toBeVisible();
  });
});
