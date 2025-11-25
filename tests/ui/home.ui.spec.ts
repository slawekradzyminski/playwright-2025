import { test, expect } from '../../fixtures/uiAuthFixture';
import { HomePage } from '../../pages/HomePage';

test.describe('Home UI - authenticated', () => {
  test('should display user info for logged in user', async ({ page, clientUiAuth }) => {
    const homePage = new HomePage(page);

    await expect(page).toHaveURL(HomePage.URL);
    await expect(homePage.homePage).toBeVisible();
    await expect(homePage.welcomeTitle).toBeVisible();
    await expect(homePage.userEmail).toHaveText(clientUiAuth.userData.email);
  });
});
