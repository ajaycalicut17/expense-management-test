import { test, expect } from '@playwright/test';

test('health', async ({ page }) => {
    const response = await page.goto('/health');
    expect(response?.status()).toBe(200);
    expect(await response?.text()).toContain('{"status":"ok"}');
});