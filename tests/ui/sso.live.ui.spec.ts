import { expect, test } from '@playwright/test';
import { APP_BASE_URL } from '../../config/constants';
import { SSO, UI } from '../../config/tags';
import { SSO_PASSWORD, SSO_USERNAME } from '../../config/sso';

test.describe('Live SSO UI tests', {
  tag: [UI, SSO],
}, () => {
  test('should authenticate through the real Keycloak redirect flow', async ({ page }) => {
    await page.goto(`${APP_BASE_URL}/login`);
    await page.getByTestId('login-sso-button').click();

    await expect(page).toHaveURL(/\/protocol\/openid-connect\/auth/);
    await page.getByRole('textbox', { name: 'Username or email' }).fill(SSO_USERNAME);
    await page.getByRole('textbox', { name: 'Password' }).fill(SSO_PASSWORD);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(`${APP_BASE_URL}/`);
    await expect.poll(async () => page.evaluate(() => localStorage.getItem('token'))).not.toBeNull();
    await expect.poll(async () => page.evaluate(() => localStorage.getItem('refreshToken'))).not.toBeNull();
    await expect(page.getByRole('link', { name: /Awesome Testing/i })).toBeVisible();
  });
});
