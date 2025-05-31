import { expect } from '@playwright/test';
import { test } from '../../fixtures/auth.fixture';
import { HomePage } from '../../pages/HomePage';

test.describe('Home UI tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test('should display all header navigation elements after login', async ({ page, authToken, userDetails }) => {
    // given
    await homePage.goto();
    await page.evaluate((token) => {
      localStorage.setItem('token', token);
    }, authToken);
    
    // when
    await homePage.goto();

    // then
    await homePage.expectHeaderLinksToBeVisible();
    await homePage.expectUserProfileLinkToContainName(userDetails.firstName, userDetails.lastName);
  });
});
