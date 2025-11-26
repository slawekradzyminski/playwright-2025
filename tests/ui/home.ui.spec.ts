import { test, expect } from '../../fixtures/uiAuthFixture';
import { HomePage } from '../../pages/HomePage';
import { FRONTEND_URL } from '../../config/constants';
import type { UserRegisterDto } from '../../types/auth';

test.describe('Home UI - client user', () => {
  let userData: UserRegisterDto;
  let homePage: HomePage;

  test.beforeEach(async ({ page, clientUiAuth }) => {
    userData = clientUiAuth.userData;
    homePage = new HomePage(page);
  });

  test('should display user info for logged in user', async ({ page }) => {
    // then
    await expect(page).toHaveURL(HomePage.URL);
    await expect(homePage.homePage).toBeVisible();
    await expect(homePage.welcomeTitle).toBeVisible();
    await expect(homePage.userEmail).toHaveText(userData.email);
  });

  test('should render navigation links for logged in user', async ({ page }) => {
    // given
    const navChecks = [
      { locator: homePage.header.productsLink, url: `${FRONTEND_URL}/products` },
      { locator: homePage.header.sendEmailLink, url: `${FRONTEND_URL}/email` },
      { locator: homePage.header.qrLink, url: `${FRONTEND_URL}/qr` },
      { locator: homePage.header.llmLink, url: `${FRONTEND_URL}/llm` },
      { locator: homePage.header.trafficLink, url: `${FRONTEND_URL}/traffic` },
      { locator: homePage.header.usernameLink, url: `${FRONTEND_URL}/profile` },
      { locator: homePage.header.cartLink, url: `${FRONTEND_URL}/cart` }
    ];

    await expect(homePage.header.navigation).toBeVisible();
    await expect(homePage.header.menu).toBeVisible();
    await expect(homePage.header.userActions).toBeVisible();

    // when + then
    for (const { locator, url } of navChecks) {
      await expect(locator).toBeVisible();
      await locator.click();
      await expect(page).toHaveURL(url);
      await page.goBack();
      await expect(page).toHaveURL(HomePage.URL);
    }
  });

  test('should open quick-access cards from home', async ({ page }) => {
    // given
    const shortcuts = [
      { button: homePage.productsButton, url: `${FRONTEND_URL}/products` },
      { button: homePage.usersButton, url: `${FRONTEND_URL}/users` },
      { button: homePage.profileButton, url: `${FRONTEND_URL}/profile` },
      { button: homePage.trafficButton, url: `${FRONTEND_URL}/traffic` },
      { button: homePage.llmButton, url: `${FRONTEND_URL}/llm` },
      { button: homePage.qrButton, url: `${FRONTEND_URL}/qr` },
      { button: homePage.emailButton, url: `${FRONTEND_URL}/email` }
    ];

    // when + then
    for (const { button, url } of shortcuts) {
      await expect(button).toBeVisible();
      await button.click();
      await expect(page).toHaveURL(url);
      await page.goBack();
      await expect(page).toHaveURL(HomePage.URL);
    }
  });

  test('should redirect to login when token is removed', async ({ page }) => {
    // when
    await page.evaluate(() => {
      globalThis.localStorage.removeItem('token');
    });
    await page.reload();

    // then
    await expect(page).toHaveURL(`${FRONTEND_URL}/login`);
  });

  test('should not display admin link in header for client user', async () => {
    // then
    await expect(homePage.header.adminLink).toBeHidden();
  });
});

test.describe('Home UI - admin user', () => {
  let homePage: HomePage;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  test.beforeEach(async ({ page, adminUiAuth }) => {
    homePage = new HomePage(page);
  });

  test('should navigate to admin page via header link', async ({ page }) => {
    // when
    await homePage.header.adminLink.click();

    // then
    await expect(page).toHaveURL(`${FRONTEND_URL}/admin`);
  });
});
