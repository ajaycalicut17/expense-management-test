import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { faker } from '@faker-js/faker';

const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Start of authentication.
  const fullName = faker.person.fullName();
  const email = faker.internet.email();
  const password = faker.internet.password();

  await page.goto('/register');
  await page.getByRole('textbox', { name: 'Name' }).fill(fullName);
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill(password);
  await page.getByRole('textbox', { name: 'Confirm Password' }).fill(password);
  await page.getByRole('button', { name: 'Register' }).click();

  await page.goto('/');
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page.getByRole('button', { name: fullName })).toBeVisible();
  // End of authentication.

  await page.context().storageState({ path: authFile });
});