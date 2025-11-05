import { test, expect } from '../../fixtures/uiAuthFixtures';
import { HomePage } from '../../pages/homePage';

test.describe('Home UI tests - logged in', () => {
  test('should display user email when logged in', async ({ page, loggedInClient }) => {
    // given
    const homePage = new HomePage(page);

    // when
    await homePage.goto();

    // then
    await expect(homePage.welcomeHeading).toBeVisible();
    await expect(homePage.emailParagraph).toHaveText(loggedInClient.user.email);
  });
});

