import { test, expect } from '../fixtures/ui-auth.fixture';
import { HOME_URL, LOGIN_URL, PRODUCTS_URL, PROFILE_URL } from './constants/ui.urls.constants';
import { LoginPage } from './pages/login.page';
import { HomePage } from './pages/home.page';
import { ProductsPage } from './pages/products.page';
import { ProfilePage } from './pages/profile.page';

test.describe('Home UI tests', () => {
  test('should show authenticated user email on homepage', async ({ authenticatedPage, clientAuth }) => {
    // given
    const homePage = new HomePage(authenticatedPage);

    // then
    await expect(authenticatedPage).toHaveURL(HOME_URL);
    await expect(homePage.userEmail).toHaveText(clientAuth.userDetails.email);
  });

  test('should render logged in header navigation items', async ({ authenticatedPage }) => {
    // given
    const homePage = new HomePage(authenticatedPage);

    // then
    await expect(homePage.header.navigation).toBeVisible();
    await expect(homePage.header.homeLink).toBeVisible();
    await expect(homePage.header.productsLink).toBeVisible();
    await expect(homePage.header.sendEmailLink).toBeVisible();
    await expect(homePage.header.qrCodeLink).toBeVisible();
    await expect(homePage.header.llmLink).toBeVisible();
    await expect(homePage.header.trafficMonitorLink).toBeVisible();
    await expect(homePage.header.adminLink).toHaveCount(0);
    await expect(homePage.header.cartIconLink).toBeVisible();
    await expect(homePage.header.profileLink).toBeVisible();
    await expect(homePage.header.logoutButton).toBeVisible();
  });

  test('should logout and redirect to login page', async ({ authenticatedPage }) => {
    // given
    const homePage = new HomePage(authenticatedPage);
    const loginPage = new LoginPage(authenticatedPage);

    // when
    await homePage.header.clickLogout();

    // then
    await expect(authenticatedPage).toHaveURL(LOGIN_URL);
    await expect(loginPage.heading).toBeVisible();
  });

  test('should navigate to profile via home page header profile link', async ({ authenticatedPage }) => {
    // given
    const homePage = new HomePage(authenticatedPage);
    const profilePage = new ProfilePage(authenticatedPage);

    // when
    await homePage.header.profileLink.click();

    // then
    await expect(authenticatedPage).toHaveURL(PROFILE_URL);
    await expect(profilePage.title).toHaveText('Profile');
  });

  test('should navigate to products via home page body button', async ({ authenticatedPage }) => {
    // given
    const homePage = new HomePage(authenticatedPage);
    const productsPage = new ProductsPage(authenticatedPage);

    // when
    await homePage.productsButton.click();

    // then
    await expect(authenticatedPage).toHaveURL(PRODUCTS_URL);
    await expect(productsPage.title).toHaveText('Products');
  });
});
