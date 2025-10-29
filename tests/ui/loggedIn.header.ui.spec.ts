import { test } from '../../fixtures/uiAuthFixture';
import { HomePage } from '../../pages/homePage';

test.describe('Logged In Header UI tests', () => {
    test('should display user full name in header', async ({ page, authenticatedUIAdmin }) => {
      // given
      const homePage = new HomePage(page);
      const expectedName = `${authenticatedUIAdmin.userData.firstName} ${authenticatedUIAdmin.userData.lastName}`;

      // when

      // then
      await homePage.header.expectUserProfileName(expectedName);
    });

    test('should navigate to home when home link is clicked', async ({ page, authenticatedUIAdmin }) => {
      // given
      const homePage = new HomePage(page);
      await homePage.clickViewProducts();

      // when
      await homePage.header.clickHome();

      // then
      await homePage.expectOnPage('');
    });

    test('should navigate to products when products link is clicked', async ({ page, authenticatedUIAdmin }) => {
      // given
      const homePage = new HomePage(page);

      // when
      await homePage.header.clickProducts();

      // then
      await homePage.expectOnPage('products');
    });

    test('should navigate to email when send email link is clicked', async ({ page, authenticatedUIAdmin }) => {
      // given
      const homePage = new HomePage(page);

      // when
      await homePage.header.clickSendEmail();

      // then
      await homePage.expectOnPage('email');
    });

    test('should navigate to QR code when QR code link is clicked', async ({ page, authenticatedUIAdmin }) => {
      // given
      const homePage = new HomePage(page);

      // when
      await homePage.header.clickQRCode();

      // then
      await homePage.expectOnPage('qr');
    });

    test('should navigate to LLM when LLM link is clicked', async ({ page, authenticatedUIAdmin }) => {
      // given
      const homePage = new HomePage(page);

      // when
      await homePage.header.clickLLM();

      // then
      await homePage.expectOnPage('llm');
    });

    test('should navigate to traffic monitor when traffic monitor link is clicked', async ({ page, authenticatedUIAdmin }) => {
      // given
      const homePage = new HomePage(page);

      // when
      await homePage.header.clickTrafficMonitor();

      // then
      await homePage.expectOnPage('traffic');
    });

    test('should navigate to cart when cart icon is clicked', async ({ page, authenticatedUIAdmin }) => {
      // given
      const homePage = new HomePage(page);

      // when
      await homePage.header.clickCart();

      // then
      await homePage.expectOnPage('cart');
    });

    test('should navigate to profile when user profile link is clicked', async ({ page, authenticatedUIAdmin }) => {
      // given
      const homePage = new HomePage(page);

      // when
      await homePage.header.clickUserProfile();

      // then
      await homePage.expectOnPage('profile');
    });

    test('should logout and redirect to login when logout button is clicked', async ({ page, authenticatedUIAdmin }) => {
      // given
      const homePage = new HomePage(page);

      // when
      await homePage.header.clickLogout();

      // then
      await homePage.expectOnPage('login');
    });
  });
 