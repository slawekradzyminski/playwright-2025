import { test, expect, APP_BASE_URL } from './fixtures/clientHomeFixture';

const LOGIN_URL = `${APP_BASE_URL}/login`;
const PRODUCTS_URL = `${APP_BASE_URL}/products`;
const PROFILE_URL = `${APP_BASE_URL}/profile`;

test.describe('Homepage UI tests', () => {
  test('should show authenticated client details on homepage', async ({ homePage, authenticatedClientUser }) => {
    // given
    const { user } = authenticatedClientUser;

    // then
    await homePage.expectLoggedInAs(user.firstName, user.email);
    await expect(homePage.usernameProfileLink).toHaveText(`${user.firstName} ${user.lastName}`);
  });

  test('should navigate to products from homepage header', async ({ page, homePage }) => {
    // when
    await homePage.productsLink.click();

    // then
    await expect(page).toHaveURL(PRODUCTS_URL);
  });

  test('should navigate to profile from username link', async ({ page, homePage }) => {
    // when
    await homePage.usernameProfileLink.click();

    // then
    await expect(page).toHaveURL(PROFILE_URL);
  });

  test('should log out from homepage', async ({ page, homePage }) => {
    // when
    await homePage.logoutButton.click();

    // then
    await expect(page).toHaveURL(LOGIN_URL);
    await expect.poll(async () => page.evaluate(() => localStorage.getItem('token'))).toBeNull();
    await expect.poll(async () => page.evaluate(() => localStorage.getItem('refreshToken'))).toBeNull();
  });
});
