import { test } from '@playwright/test';
import { HomePage } from '../../pages/homePage';

test.describe('Home UI tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display welcome message and user email after login', async () => {
    await homePage.expectToBeOnHomePage();
    await homePage.expectWelcomeMessage('Slawomir');
    await homePage.expectUserEmail('awesome@testing.com');
  });

  test('should display all navigation links', async () => {
    await homePage.expectToBeOnHomePage();
    await homePage.expectNavigationLinksVisible();
    await homePage.expectLogoutButtonVisible();
  });
});
