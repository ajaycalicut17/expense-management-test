import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const credentialsFile = path.join(__dirname, '../.auth/credentials.json');
const credentials = fs.existsSync(credentialsFile) ? JSON.parse(fs.readFileSync(credentialsFile, 'utf-8')) : {};

test('logout', async ({ page }) => {
  await page.goto('/dashboard');
  await page.getByRole('button', { name: credentials.name }).click();
  await page.getByRole('link', { name: 'Log Out' }).click();

  await expect(page).toHaveURL('/');
});
