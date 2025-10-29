import { test } from '../../fixtures/uiAuthFixture';
import { HomePage } from '../../pages/homePage';
import { ProductsPage } from '../../pages/productsPage';
import { UsersPage } from '../../pages/usersPage';
import { ProfilePage } from '../../pages/profilePage';
import { TrafficPage } from '../../pages/trafficPage';
import { LlmPage } from '../../pages/llmPage';
import { QrPage } from '../../pages/qrPage';
import { EmailPage } from '../../pages/emailPage';

test.describe('Home UI tests', () => {
  test('should display authenticated admin user email', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);

    // when

    // then
    await homePage.expectUserEmail(authenticatedUIAdmin.userData.email);
  });

  test('should navigate to products page when View Products button is clicked', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);

    // when
    await homePage.clickViewProducts();

    // then
    await productsPage.expectOnPage();
  });

  test('should navigate to users page when Manage Users button is clicked', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);
    const usersPage = new UsersPage(page);

    // when
    await homePage.clickManageUsers();

    // then
    await usersPage.expectOnPage();
  });

  test('should navigate to profile page when View Profile & Orders button is clicked', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);
    const profilePage = new ProfilePage(page);

    // when
    await homePage.clickViewProfileOrders();

    // then
    await profilePage.expectOnPage();
  });

  test('should navigate to traffic monitor page when Open Traffic Monitor button is clicked', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);
    const trafficPage = new TrafficPage(page);

    // when
    await homePage.clickOpenTrafficMonitor();

    // then
    await trafficPage.expectOnPage();
  });

  test('should navigate to LLM page when Open AI Assistant button is clicked', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);
    const llmPage = new LlmPage(page);

    // when
    await homePage.clickOpenAIAssistant();

    // then
    await llmPage.expectOnPage();
  });

  test('should navigate to QR code page when Generate QR Codes button is clicked', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);
    const qrPage = new QrPage(page);

    // when
    await homePage.clickGenerateQRCodes();

    // then
    await qrPage.expectOnPage();
  });

  test('should navigate to email page when Send Emails button is clicked', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);
    const emailPage = new EmailPage(page);

    // when
    await homePage.clickSendEmails();

    // then
    await emailPage.expectOnPage();
  });

});
