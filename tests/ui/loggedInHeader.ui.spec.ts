import { test, expect } from '../../fixtures/uiAuth';
import { HomePage } from '../../pages/homePage';
import { ProductsPage } from '../../pages/productsPage';
import { UsersPage } from '../../pages/usersPage';
import { ProfilePage } from '../../pages/profilePage';
import { TrafficPage } from '../../pages/trafficPage';
import { LlmPage } from '../../pages/llmPage';
import { QrPage } from '../../pages/qrPage';
import { EmailPage } from '../../pages/emailPage';
import { LoginPage } from '../../pages/loginPage';

test.describe('Logged In Header UI tests', () => {

  test.describe('Header visibility and elements', () => {
    test('should display all header elements when logged in', async ({ uiAuth }) => {
      // given
      const homePage = new HomePage(uiAuth.page);

      // when
      // User is already on home page via uiAuth fixture

      // then
      await homePage.header.expectToBeVisible();
      await homePage.header.expectProfileText('Test User');
    });
  });

  test.describe('Navigation links', () => {
    test('should navigate to home page via header link', async ({ uiAuth }) => {
      // given
      const homePage = new HomePage(uiAuth.page);
      const productsPage = new ProductsPage(uiAuth.page);
      
      // Navigate away from home first
      await productsPage.goto();
      
      // when
      await homePage.header.clickHome();

      // then
      await homePage.expectToBeOnPage('/');
    });

    test('should navigate to products page via header link', async ({ uiAuth }) => {
      // given
      const homePage = new HomePage(uiAuth.page);
      const productsPage = new ProductsPage(uiAuth.page);
      
      // when
      await homePage.header.clickProducts();

      // then
      await productsPage.expectToBeOnPage('/products');
    });

    test('should navigate to send email page via header link', async ({ uiAuth }) => {
      // given
      const homePage = new HomePage(uiAuth.page);
      const emailPage = new EmailPage(uiAuth.page);
      
      // when
      await homePage.header.clickSendEmail();

      // then
      await emailPage.expectToBeOnPage('/email');
    });

    test('should navigate to QR code page via header link', async ({ uiAuth }) => {
      // given
      const homePage = new HomePage(uiAuth.page);
      const qrPage = new QrPage(uiAuth.page);
      
      // when
      await homePage.header.clickQrCode();

      // then
      await qrPage.expectToBeOnPage('/qr');
    });

    test('should navigate to LLM page via header link', async ({ uiAuth }) => {
      // given
      const homePage = new HomePage(uiAuth.page);
      const llmPage = new LlmPage(uiAuth.page);
      
      // when
      await homePage.header.clickLlm();

      // then
      await llmPage.expectToBeOnPage('/llm');
    });

    test('should navigate to traffic monitor page via header link', async ({ uiAuth }) => {
      // given
      const homePage = new HomePage(uiAuth.page);
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
      const homePage = new HomePage(uiAuth.page);
      const profilePage = new ProfilePage(uiAuth.page);
      
      // when
      await homePage.header.clickProfile();

      // then
      await profilePage.expectToBeOnPage('/profile');
    });

    test('should navigate to cart page when clicking cart icon', async ({ uiAuth }) => {
      // given
      const homePage = new HomePage(uiAuth.page);
      
      // when
      await homePage.header.clickCart();

      // then
      await expect(uiAuth.page).toHaveURL(/.*\/cart/);
    });

    test('should logout and redirect to login page when clicking logout', async ({ uiAuth }) => {
      // given
      const homePage = new HomePage(uiAuth.page);
      const loginPage = new LoginPage(uiAuth.page);
      
      // when
      await homePage.header.clickLogout();

      // then
      await loginPage.expectToBeOnPage('/login');
      
      // Note: We don't check localStorage.token here as the app may handle logout differently
      // The important thing is that the user is redirected to the login page
    });
  });

});
