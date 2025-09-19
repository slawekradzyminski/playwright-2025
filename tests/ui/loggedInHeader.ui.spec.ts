import { test, expect } from '../../fixtures/uiAuth';
import { HomePage } from '../../pages/homePage';
import { ProductsPage } from '../../pages/productsPage';
import { ProfilePage } from '../../pages/profilePage';
import { TrafficPage } from '../../pages/trafficPage';
import { LlmPage } from '../../pages/llmPage';
import { QrPage } from '../../pages/qrPage';
import { EmailPage } from '../../pages/emailPage';
import { LoginPage } from '../../pages/loginPage';

test.describe('Logged In Header UI tests', () => {

  let homePage: HomePage;

  test.beforeEach(async ({ uiAuth }) => {
    homePage = new HomePage(uiAuth.page);
  });

  test.describe('Header visibility and elements', () => {
    test('should display all header elements when logged in', async ({ uiAuth }) => {
      // then
      await homePage.header.expectToBeVisible();
      await homePage.header.expectProfileText(`${uiAuth.user.firstName} ${uiAuth.user.lastName}`);
    });
  });

  test.describe('Navigation links', () => {
    test('should navigate to home page via header link', async ({ uiAuth }) => {
      // given
      const productsPage = new ProductsPage(uiAuth.page);
      await productsPage.goto();
      
      // when
      await homePage.header.clickHome();

      // then
      await homePage.expectToBeOnPage('/');
    });

    test('should navigate to products page via header link', async ({ uiAuth }) => {
      // given
      const productsPage = new ProductsPage(uiAuth.page);
      
      // when
      await homePage.header.clickProducts();

      // then
      await productsPage.expectToBeOnPage('/products');
    });

    test('should navigate to send email page via header link', async ({ uiAuth }) => {
      // given
      const emailPage = new EmailPage(uiAuth.page);
      
      // when
      await homePage.header.clickSendEmail();

      // then
      await emailPage.expectToBeOnPage('/email');
    });

    test('should navigate to QR code page via header link', async ({ uiAuth }) => {
      // given
      const qrPage = new QrPage(uiAuth.page);
      
      // when
      await homePage.header.clickQrCode();

      // then
      await qrPage.expectToBeOnPage('/qr');
    });

    test('should navigate to LLM page via header link', async ({ uiAuth }) => {
      // given
      const llmPage = new LlmPage(uiAuth.page);
      
      // when
      await homePage.header.clickLlm();

      // then
      await llmPage.expectToBeOnPage('/llm');
    });

    test('should navigate to traffic monitor page via header link', async ({ uiAuth }) => {
      // given
      const trafficPage = new TrafficPage(uiAuth.page);
      
      // when
      await homePage.header.clickTrafficMonitor();

      // then
      await trafficPage.expectToBeOnPage('/traffic');
    });
  });

  test.describe('User actions', () => {
    test('should navigate to profile page when clicking profile link', async ({ uiAuth }) => {
      // given
      const profilePage = new ProfilePage(uiAuth.page);
      
      // when
      await homePage.header.clickProfile();

      // then
      await profilePage.expectToBeOnPage('/profile');
    });

    test('should navigate to cart page when clicking cart icon', async ({ uiAuth }) => {
      // given
      
      // when
      await homePage.header.clickCart();

      // then
      await expect(uiAuth.page).toHaveURL(/.*\/cart/);
    });

    test('should logout and redirect to login page when clicking logout', async ({ uiAuth }) => {
      // given
      const loginPage = new LoginPage(uiAuth.page);
      
      // when
      await homePage.header.clickLogout();

      // then
      await loginPage.verifyUsernameInputDisplayed();
      await loginPage.expectToBeOnLoginPage();
    });
  });

});
