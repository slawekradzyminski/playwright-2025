import { test as clientAuthTest, expect, APP_BASE_URL } from '../../../fixtures/clientAuthFixture';
import { HomePage } from '../pages/HomePage';

type ClientHomeFixtures = {
  homePage: HomePage;
};

export const test = clientAuthTest.extend<ClientHomeFixtures>({
  homePage: async ({ page, authenticatedClientUser }, use) => {
    // given
    await page.addInitScript(({ token, refreshToken }) => {
      window.localStorage.setItem('token', token);
      window.localStorage.setItem('refreshToken', refreshToken);
    }, {
      token: authenticatedClientUser.token,
      refreshToken: authenticatedClientUser.refreshToken,
    });

    const homePage = new HomePage(page);

    // when
    await homePage.goto();

    // then
    await homePage.expectLoggedInAs(
      authenticatedClientUser.user.firstName,
      authenticatedClientUser.user.email,
    );

    await use(homePage);
  },
});

export { expect, APP_BASE_URL };
