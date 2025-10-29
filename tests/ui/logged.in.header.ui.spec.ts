import { test } from '../../fixtures/uiAuthFixture';
import { HomePage } from '../../pages/homePage';
import { ProductsPage } from '../../pages/productsPage';
import { EmailPage } from '../../pages/emailPage';
import { QrPage } from '../../pages/qrPage';
import { LlmPage } from '../../pages/llmPage';
import { TrafficPage } from '../../pages/trafficPage';
import { CartPage } from '../../pages/cartPage';
import { ProfilePage } from '../../pages/profilePage';
import { LoginPage } from '../../pages/loginPage';

test.describe('Logged In Header UI tests', () => {
  test('should navigate to home when home link is clicked', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);
    await homePage.clickViewProducts();

    // when
    await homePage.header.clickHome();

    // then
    await homePage.expectOnPage();
  });

  test('should navigate to products when products link is clicked', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);

    // when
    await homePage.header.clickProducts();

    // then
    const productsPage = new ProductsPage(page);
    await productsPage.expectOnPage();
  });

  test('should navigate to email when send email link is clicked', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);

    // when
    await homePage.header.clickSendEmail();

    // then
    const emailPage = new EmailPage(page);
    await emailPage.expectOnPage();
  });

  test('should navigate to QR code when QR code link is clicked', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);

    // when
    await homePage.header.clickQRCode();

    // then
    const qrPage = new QrPage(page);
    await qrPage.expectOnPage();
  });

  test('should navigate to LLM when LLM link is clicked', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);

    // when
    await homePage.header.clickLLM();

    // then
    const llmPage = new LlmPage(page);
    await llmPage.expectOnPage();
  });

  test('should navigate to traffic monitor when traffic monitor link is clicked', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);

    // when
    await homePage.header.clickTrafficMonitor();

    // then
    const trafficPage = new TrafficPage(page);
    await trafficPage.expectOnPage();
  });

  test('should navigate to cart when cart icon is clicked', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);

    // when
    await homePage.header.clickCart();

    // then
    const cartPage = new CartPage(page);
    await cartPage.expectOnPage();
  });

  test('should navigate to profile when user profile link is clicked', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);
    const expectedName = `${authenticatedUIAdmin.userData.firstName} ${authenticatedUIAdmin.userData.lastName}`;
    await homePage.header.expectUserProfileName(expectedName);

    // when
    await homePage.header.clickUserProfile();

    // then
    const profilePage = new ProfilePage(page);
    await profilePage.expectOnPage();
  });

  test('should logout and redirect to login when logout button is clicked', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);

    // when
    await homePage.header.clickLogout();

    // then
    const loginPage = new LoginPage(page);
    await loginPage.expectOnPage();
  });
});
 