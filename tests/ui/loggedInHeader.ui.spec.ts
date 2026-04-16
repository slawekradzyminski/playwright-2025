import { test, expect } from '../../fixtures/uiAuthFixture';
import { CartPage } from '../../pages/CartPage';
import { EmailPage } from '../../pages/EmailPage';
import { HomePage } from '../../pages/HomePage';
import { LlmPage } from '../../pages/LlmPage';
import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { ProfilePage } from '../../pages/ProfilePage';
import { QrCodePage } from '../../pages/QrCodePage';
import { TrafficPage } from '../../pages/TrafficPage';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Logged in header tests', () => {
  test('should navigate to main sections from desktop menu links', async ({ uiAuth }) => {
    // given
    const { page } = uiAuth;
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);
    const emailPage = new EmailPage(page);
    const qrCodePage = new QrCodePage(page);
    const llmPage = new LlmPage(page);
    const trafficPage = new TrafficPage(page);
    await homePage.goto();

    // when / then
    await homePage.loggedInHeader.clickProductsLink();
    await productsPage.expectToBeOnPage(ProductsPage.url);
    await expect(productsPage.productsTitle).toHaveText('Products');

    await productsPage.loggedInHeader.clickEmailLink();
    await emailPage.expectToBeOnPage(EmailPage.url);
    await expect(emailPage.emailTitle).toHaveText('Send Email');

    await emailPage.loggedInHeader.clickQrCodeLink();
    await qrCodePage.expectToBeOnPage(QrCodePage.url);
    await expect(qrCodePage.qrCodeTitle).toHaveText('QR Code Generator');

    await qrCodePage.loggedInHeader.clickLlmLink();
    await llmPage.expectToBeOnPage(LlmPage.url);
    await expect(llmPage.llmTitle).toBeVisible();

    await llmPage.loggedInHeader.clickTrafficMonitorLink();
    await trafficPage.expectToBeOnPage(TrafficPage.url);
    await expect(trafficPage.trafficTitle).toHaveText('Traffic Monitor');
  });

  test('should navigate to cart and profile from account actions', async ({ uiAuth }) => {
    // given
    const { page } = uiAuth;
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const profilePage = new ProfilePage(page);
    await homePage.goto();

    // when / then
    await homePage.loggedInHeader.clickCartLink();
    await cartPage.expectToBeOnPage(CartPage.url);
    await expect(cartPage.cartTitle).toHaveText('Your Cart');

    await cartPage.loggedInHeader.clickProfileLink();
    await profilePage.expectToBeOnPage(ProfilePage.url);
    await expect(profilePage.profileTitle).toHaveText('Profile');
  });

  test('should navigate home from brand link', async ({ uiAuth }) => {
    // given
    const { page } = uiAuth;
    const homePage = new HomePage(page);
    const llmPage = new LlmPage(page);
    await page.goto(LlmPage.url);
    await expect(llmPage.llmTitle).toBeVisible();

    // when
    await llmPage.loggedInHeader.clickBrandLink();

    // then
    await homePage.expectToBeOnPage(HomePage.url);
    await expect(homePage.welcomeMessage).toBeVisible();
  });

  test('should log out user', async ({ uiAuth }) => {
    // given
    const { page } = uiAuth;
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    await homePage.goto();

    // when
    await homePage.loggedInHeader.clickLogoutButton();

    // then
    await loginPage.expectToBeOnPage(LoginPage.url);
    await expect(loginPage.submitButton).toBeVisible();
    await expect(page.evaluate(() => localStorage.getItem('token'))).resolves.toBeNull();
  });
});
