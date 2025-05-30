import { test, expect } from '../../fixtures/ui.fixtures';
import { HomePage } from '../../pages/HomePage';

test.describe('Homepage UI tests', () => {
  let homePage: HomePage;

  test('should display logged in header with all navigation links', async ({ loggedInPage }) => {
    // given
    homePage = new HomePage(loggedInPage);

    // when
    await homePage.expectToBeOnHomePage();

    // then
    await homePage.expectLoggedInHeaderToBeVisible();
    await homePage.expectUserProfileLinkToHaveText('Slawomir Radzyminski');
  });
}); 