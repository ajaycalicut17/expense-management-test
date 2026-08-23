import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.use({ storageState: { cookies: [], origins: [] } });

test('register', async ({ page }) => {
  const fullName = faker.person.fullName();
  const email = faker.internet.email();
  const password = faker.internet.password();

  await page.goto('/register');
  await page.getByRole('textbox', { name: 'Name' }).fill(fullName);
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill(password);
  await page.getByRole('textbox', { name: 'Confirm Password' }).fill(password);
  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.locator('body')).toContainText('User registered successfully');
});
