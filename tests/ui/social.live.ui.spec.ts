import { expect, test } from '@playwright/test';
import { APP_BASE_URL } from '../../config/constants';
import { SOCIAL, UI } from '../../config/tags';
import { GOOGLE_MOCK_USERNAME, GOOGLE_MOCK_PASSWORD } from '../../config/sso';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Live social login UI tests', {
  tag: [UI, SOCIAL],
}, () => {
  test('should authenticate through Google mock realm via Keycloak brokering', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.clickGoogleButton();

    await expect(page).toHaveURL(/\/realms\/google-mock\/protocol\/openid-connect\/auth/);
    await page.getByRole('textbox', { name: 'Username or email' }).fill(GOOGLE_MOCK_USERNAME);
    await page.getByRole('textbox', { name: 'Password' }).fill(GOOGLE_MOCK_PASSWORD);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(`${APP_BASE_URL}/`, { timeout: 15000 });
    await expect.poll(async () => page.evaluate(() => localStorage.getItem('token'))).not.toBeNull();
    await expect.poll(async () => page.evaluate(() => localStorage.getItem('refreshToken'))).not.toBeNull();
    await expect(page.getByRole('link', { name: /Awesome Testing/i })).toBeVisible();
  });
});
