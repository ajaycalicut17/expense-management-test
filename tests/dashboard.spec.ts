import { test, expect } from '@playwright/test';

test('unauthenticated access to dashboard', async ({ browser }) => {
  const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const page = await context.newPage();

  await page.goto('/dashboard');
  await expect(page).toHaveURL('/');

  await context.close();
});