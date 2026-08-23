import { test, expect } from '@playwright/test';

test('unauthenticated access to expense', async ({ browser }) => {
  const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const page = await context.newPage();

  await page.goto('/expense');
  await expect(page).toHaveURL('/');

  await context.close();
});

test('Add expense', async ({ page }) => {
  await page.goto('/expense');

  await expect(page.getByRole('heading', { name: 'Expense' })).toBeVisible();

  await page.getByRole('link', { name: 'Add' }).click();
  await page.locator('select[name="category_id"]').selectOption({ label: 'Salary' });
  await page.getByRole('spinbutton', { name: 'Amount (USD)' }).fill('1000');
  await page.getByRole('textbox', { name: 'Description' }).fill('Salary credit');
  await page.getByRole('textbox', { name: 'Spent At' }).fill('2026-08-23T17:28');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByRole('main')).toContainText('Expense added successfully');
  await expect(page.locator('tbody')).toContainText('Salary');
  await expect(page.locator('tbody')).toContainText('$1,000.00');
  await expect(page.locator('tbody')).toContainText('Salary credit');
  await expect(page.locator('tbody')).toContainText('08/23/2026 5:28 PM');
});

test('Edit expense', async ({ page }) => {
  await page.goto('/expense');

  await expect(page.getByRole('heading', { name: 'Expense' })).toBeVisible();

  await page.getByRole('link', { name: 'Edit' }).click();

  await expect(page.getByRole('heading', { name: 'Edit Expense' })).toBeVisible();

  await page.locator('select[name="category_id"]').selectOption({ label: 'Investment' });
  await page.getByRole('spinbutton', { name: 'Amount (USD)' }).fill('2000');
  await page.getByRole('textbox', { name: 'Description' }).fill('Invested');
  await page.getByRole('textbox', { name: 'Spent At' }).fill('2026-08-01T17:51');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByRole('main')).toContainText('Expense updated successfully');
  await expect(page.locator('tbody')).toContainText('Investment');
  await expect(page.locator('tbody')).toContainText('$2,000.00');
  await expect(page.locator('tbody')).toContainText('Invested');
  await expect(page.locator('tbody')).toContainText('08/01/2026 5:51 PM');
});

test('Delete expense', async ({ page }) => {
  await page.goto('/expense');

  await expect(page.getByRole('heading', { name: 'Expense' })).toBeVisible();

  await page.getByRole('button', { name: 'Delete' }).click();

  await expect(page.getByRole('main')).toContainText('Expense deleted successfully');
  await expect(page.getByRole('cell', { name: 'No expenses found' })).toBeVisible();
});
