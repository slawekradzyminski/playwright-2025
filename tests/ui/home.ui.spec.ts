import { test, expect } from '../../fixtures/uiAuthFixture';
import { HomePage } from '../../pages/HomePage';

test.describe('Home page UI tests', () => {
  test('should display correct email on homepage for logged in user', async ({ page, authenticatedClientUser }) => {
    // given
    const homePage = new HomePage(page);

    // when

    // then
    await homePage.expectToBeOnHomePage();
    await homePage.expectUserEmail(authenticatedClientUser.userData.email);
  });
});

