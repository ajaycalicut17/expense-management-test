import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { faker } from '@faker-js/faker';
import fs from 'fs';

const authFile = path.join(__dirname, '../.auth/user.json');
const credentialsFile = path.join(__dirname, '../.auth/credentials.json');

setup('authenticate', async ({ page }) => {
  // Start of authentication.
  const name = faker.person.fullName();
  const email = faker.internet.email();
  const password = faker.internet.password();

  // Save credentials for future use
  const credentials = { name, email };
  fs.writeFileSync(credentialsFile, JSON.stringify(credentials, null, 2));

  await page.goto('/register');
  await page.getByRole('textbox', { name: 'Name' }).fill(name);
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill(password);
  await page.getByRole('textbox', { name: 'Confirm Password' }).fill(password);
  await page.getByRole('button', { name: 'Register' }).click();

  await page.goto('/');
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page.getByRole('button', { name: name })).toBeVisible();
  // End of authentication.

  await page.context().storageState({ path: authFile });
});