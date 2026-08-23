import { test, expect } from '@playwright/test';

test('unauthenticated access to dashboard', async ({ browser }) => {
  const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const page = await context.newPage();

  await page.goto('/dashboard');
  await expect(page).toHaveURL('/');

  await context.close();
});

test('average daily expenses', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByRole('main')).toContainText('Average Daily Expenses');

  await page.locator('#monthSelector').selectOption('3');
  await page.locator('#yearSelector').selectOption('2025');

  await expect(page.getByText('$0.00 per day')).toBeVisible();
  await expect(page.locator('#monthLabel')).toContainText('March 2025');

  await page.getByRole('link', { name: 'Expense' }).click();

  await expect(page).toHaveURL('/expense');

  await page.getByRole('link', { name: 'Add' }).click();
  await page.locator('select[name="category_id"]').selectOption({ label: 'Salary' });
  await page.getByRole('spinbutton', { name: 'Amount (USD)' }).fill('123456');
  await page.getByRole('textbox', { name: 'Description' }).fill('Description');
  await page.getByRole('textbox', { name: 'Spent At' }).fill('2025-03-15T18:52');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByRole('main')).toContainText('Expense added successfully');

  await page.getByRole('link', { name: 'Dashboard' }).click();

  await expect(page).toHaveURL('/dashboard');

  await page.locator('#monthSelector').selectOption('3');
  await page.locator('#yearSelector').selectOption('2025');

  await expect(page.getByRole('main')).toContainText('$123,456.00 per day');
  await expect(page.locator('#monthLabel')).toContainText('March 2025');
});
