import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('login with invalid credentials', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Email' }).fill('invalid@example.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('invalidpassword');
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('paragraph')).toContainText('The provided credentials do not match our records.');
});

test('login', async ({ page }) => {
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

  await page.goto('/');
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByRole('button', { name: fullName })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
