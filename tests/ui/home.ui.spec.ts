import { test } from '../../fixtures/authenticatedUiUserFixture';
import { HomePage } from '../../pages/homePage';

test.describe('Home UI tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test('should show homepage for authenticated user', async ({ authenticatedUiUser }) => {
    // given
    const expectedUserEmail = authenticatedUiUser.userData.email;
    const expectedFirstName = authenticatedUiUser.userData.firstName;

    // when
    await homePage.open();

    // then
    await homePage.assertThatUrlIs(HomePage.url);
    await homePage.assertThatHomePageIsVisible(expectedUserEmail, expectedFirstName);
  });
});
