import { test, expect } from '../../fixtures/uiAuthFixture';
import { HomePage } from '../../pages/HomePage';
import { UI_BASE_URL } from '../../config/constants';

test.describe('Home page UI tests', () => {
  test('should display correct email on homepage for logged in user', async ({ page, authenticatedUiClientUser }) => {
    // given
    const homePage = new HomePage(page);

    // when

    // then
    await homePage.expectToBeOnHomePage();
    await homePage.expectUserEmail(authenticatedUiClientUser.userData.email);
  });

  test('should navigate to products page when View Products button is clicked', async ({ page, authenticatedUiClientUser }) => {
    // given
    const homePage = new HomePage(page);

    // when
    await homePage.clickViewProductsButton();

    // then
    await expect(page).toHaveURL(`${UI_BASE_URL}/products`);
  });

  test('should navigate to profile page when user name link is clicked', async ({ page, authenticatedUiClientUser }) => {
    // given
    const homePage = new HomePage(page);

    // when
    await homePage.header.clickUserProfileLink();

    // then
    await expect(page).toHaveURL(`${UI_BASE_URL}/profile`);
  });

  test('should logout and redirect to login page when logout button is clicked', async ({ page, authenticatedUiClientUser }) => {
    // given
    const homePage = new HomePage(page);

    // when
    await homePage.header.clickLogoutButton();

    // then
    await expect(page).toHaveURL(`${UI_BASE_URL}/login`);
  });
});

