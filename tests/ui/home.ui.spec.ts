import { test } from '../../fixtures/uiAuthFixture';
import { HomePage } from '../../pages/homePage';

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

    // when
    await homePage.clickViewProducts();

    // then
    await homePage.expectOnPage('products');
  });

  test('should navigate to users page when Manage Users button is clicked', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);

    // when
    await homePage.clickManageUsers();

    // then
    await homePage.expectOnPage('users');
  });

  test('should navigate to profile page when View Profile & Orders button is clicked', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);

    // when
    await homePage.clickViewProfileOrders();

    // then
    await homePage.expectOnPage('profile');
  });

  test('should navigate to traffic monitor page when Open Traffic Monitor button is clicked', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);

    // when
    await homePage.clickOpenTrafficMonitor();

    // then
    await homePage.expectOnPage('traffic');
  });

  test('should navigate to LLM page when Open AI Assistant button is clicked', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);

    // when
    await homePage.clickOpenAIAssistant();

    // then
    await homePage.expectOnPage('llm');
  });

  test('should navigate to QR code page when Generate QR Codes button is clicked', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);

    // when
    await homePage.clickGenerateQRCodes();

    // then
    await homePage.expectOnPage('qr');
  });

  test('should navigate to email page when Send Emails button is clicked', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);

    // when
    await homePage.clickSendEmails();

    // then
    await homePage.expectOnPage('email');
  });

});
