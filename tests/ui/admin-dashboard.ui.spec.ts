import { test } from '../../fixtures/uiAuthFixture';
import { HomePage } from '../../pages/homePage';
import { AdminDashboardPage } from '../../pages/adminDashboardPage';
import { AdminProductsPage } from '../../pages/adminProductsPage';
import { AdminOrdersPage } from '../../pages/adminOrdersPage';

test.describe('Admin dashboard UI', () => {
  test('should open admin dashboard from header navigation', async ({ page, authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);
    const expectedFullName = `${authenticatedUIAdmin.userData.firstName} ${authenticatedUIAdmin.userData.lastName}`;

    // when
    await homePage.header.clickAdmin();

    // then
    const adminDashboardPage = new AdminDashboardPage(page);
    await adminDashboardPage.expectOnPage();
    await adminDashboardPage.header.expectUserProfileName(expectedFullName);
  });

  test('should surface positive dashboard metrics and navigate via deep links', async ({ page, authenticatedUIAdmin: _authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);
    await homePage.header.clickAdmin();

    const adminDashboardPage = new AdminDashboardPage(page);
    await adminDashboardPage.expectOnPage();

    // then
    await adminDashboardPage.expectMetricsVisible();
    await adminDashboardPage.expectMetricsPositive();

    // when
    await adminDashboardPage.clickProductsLink();

    // then
    const adminProductsPage = new AdminProductsPage(page);
    await adminProductsPage.expectOnPage();

    // when
    await adminProductsPage.header.clickAdmin();
    await adminDashboardPage.expectOnPage();
    await adminDashboardPage.clickOrdersLink();

    // then
    const adminOrdersPage = new AdminOrdersPage(page);
    await adminOrdersPage.expectOnPage();

    // when
    await adminOrdersPage.header.clickAdmin();
    await adminDashboardPage.expectOnPage();
    await adminDashboardPage.clickPendingLink();

    // then
    await adminOrdersPage.expectOnPage();
  });

  test('should display recent orders preview with status pills and link to manage orders', async ({ page, authenticatedUIAdmin: _authenticatedUIAdmin }) => {
    // given
    const homePage = new HomePage(page);
    await homePage.header.clickAdmin();

    const adminDashboardPage = new AdminDashboardPage(page);
    await adminDashboardPage.expectOnPage();

    // then
    await adminDashboardPage.expectRecentOrdersPreview(5);

    // when
    await adminDashboardPage.clickViewAllOrders();

    // then
    const adminOrdersPage = new AdminOrdersPage(page);
    await adminOrdersPage.expectOnPage();
  });
});
