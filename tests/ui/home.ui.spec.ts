import { test } from '../../fixtures/ui.auth.fixture';
import { HomePage } from '../../pages/HomePage';

test.describe('Home UI tests', () => {
  test('should display all header navigation elements after login', async ({ loggedInPage, authToken, userDetails }) => {
    // given
    const homePage = new HomePage(loggedInPage);

    // then
    await homePage.expectHeaderLinksToBeVisible();
    await homePage.expectUserProfileLinkToContainName(userDetails.firstName, userDetails.lastName);
  });

  test('should display welcome section with user information', async ({ loggedInPage, userDetails }) => {
    // given
    const homePage = new HomePage(loggedInPage);

    // then
    await homePage.expectWelcomeSection(userDetails.firstName, userDetails.email);
  });

  test('should display all main content sections', async ({ loggedInPage }) => {
    // given
    const homePage = new HomePage(loggedInPage);

    // then
    await homePage.expectMainContentSections();
  });

  test('should display all action buttons', async ({ loggedInPage }) => {
    // given
    const homePage = new HomePage(loggedInPage);

    // then
    await homePage.expectAllActionButtons();
  });

  test('should navigate to products page when View Products button is clicked', async ({ loggedInPage }) => {
    // given
    const homePage = new HomePage(loggedInPage);

    // when
    await homePage.clickViewProducts();

    // then
    await homePage.expectToBeOnPage('/products');
  });

  test('should navigate to users page when Manage Users button is clicked', async ({ loggedInPage }) => {
    // given
    const homePage = new HomePage(loggedInPage);

    // when
    await homePage.clickManageUsers();

    // then
    await homePage.expectToBeOnPage('/users');
  });

  test('should navigate to profile page when View Profile & Orders button is clicked', async ({ loggedInPage }) => {
    // given
    const homePage = new HomePage(loggedInPage);

    // when
    await homePage.clickViewProfileOrders();

    // then
    await homePage.expectToBeOnPage('/profile');
  });
});
