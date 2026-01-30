import { test as setup, expect } from '@playwright/test';
import { config } from 'dotenv';
import path from 'path';

config();

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  await page.goto(`${process.env.FRONTEND_URL}/login`);

  await page.getByTestId('login-username-input').fill(process.env.TEST_USERNAME!);
  await page.getByTestId('login-password-input').fill(process.env.TEST_PASSWORD!);
  await page.getByTestId('login-submit-button').click();

  await page.waitForURL(`${process.env.FRONTEND_URL}/`);
  
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();

  await page.context().storageState({ path: authFile });
});
