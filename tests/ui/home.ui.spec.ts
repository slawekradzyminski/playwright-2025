import { test, expect } from '../../fixtures/uiAuth';
import { HomePage } from '../../pages/homePage';
import { ProductsPage } from '../../pages/productsPage';
import { UsersPage } from '../../pages/usersPage';
import { ProfilePage } from '../../pages/profilePage';
import { TrafficPage } from '../../pages/trafficPage';
import { LlmPage } from '../../pages/llmPage';
import { QrPage } from '../../pages/qrPage';
import { EmailPage } from '../../pages/emailPage';

test.describe('Home UI tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test.describe('Welcome info', () => {
    test('should display welcome message and user email', async ({ uiAuth }) => {
      // then
      await homePage.verifyWelcomeMessage(uiAuth.user.firstName);
      await homePage.verifyUserEmail(uiAuth.user.email);
    });
  });

  test.describe('CTAs & navigation', () => {
    test('should successfully navigate to products page', async ({ uiAuth }) => {
      // given
      const productsPage = new ProductsPage(uiAuth.page);
      
      // when
      await homePage.clickViewProducts();

      // then
      await productsPage.expectToBeOnPage('/products');
    });

    test('should successfully navigate to users page', async ({ uiAuth }) => {
      // given
      const usersPage = new UsersPage(uiAuth.page);
      
      // when
      await homePage.clickManageUsers();

      // then
      await usersPage.expectToBeOnPage('/users');
    });

    test('should successfully navigate to profile page', async ({ uiAuth }) => {
      // given
      const profilePage = new ProfilePage(uiAuth.page);
      
      // when
      await homePage.clickViewProfile();

      // then
      await profilePage.expectToBeOnPage('/profile');
    });

    test('should successfully navigate to traffic monitor page', async ({ uiAuth }) => {
      // given
      const trafficPage = new TrafficPage(uiAuth.page);
      
      // when
      await homePage.clickOpenTrafficMonitor();

      // then
      await trafficPage.expectToBeOnPage('/traffic');
    });

    test('should successfully navigate to LLM page', async ({ uiAuth }) => {
      // given
      const llmPage = new LlmPage(uiAuth.page);
      
      // when
      await homePage.clickOpenAiAssistant();

      // then
      await llmPage.expectToBeOnPage('/llm');
    });

    test('should successfully navigate to QR code page', async ({ uiAuth }) => {
      // given
      const qrPage = new QrPage(uiAuth.page);
      
      // when
      await homePage.clickGenerateQrCodes();

      // then
      await qrPage.expectToBeOnPage('/qr');
    });

    test('should successfully navigate to email page', async ({ uiAuth }) => {
      // given
      const emailPage = new EmailPage(uiAuth.page);
      
      // when
      await homePage.clickSendEmails();

      // then
      await emailPage.expectToBeOnPage('/email');
    });
  });

  test.describe('Auth gating', () => {
    test('should redirect to login when not authenticated', async ({ page }) => {
      // given
      // User is not authenticated (no token in localStorage)

      // when
      await page.goto('http://localhost:8081/');

      // then
      await expect(page).toHaveURL(/.*\/login/);
    });
  });

}); 