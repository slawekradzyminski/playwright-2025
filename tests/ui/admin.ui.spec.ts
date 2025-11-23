import { test } from '../../fixtures/uiAuthFixture';
import { AdminPage } from '../../pages/AdminPage';
import { AdminOrdersPage } from '../../pages/AdminOrdersPage';

test.describe('Admin dashboard UI tests', () => {
  let adminPage: AdminPage;

  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page);
  });

  test('should display admin dashboard sections for an admin user', async ({ authenticatedUiAdminUser }) => {
    // given
    await adminPage.goto();

    // when

    // then
    await adminPage.expectOnAdminDashboard();
    await adminPage.header.expectLogoutButtonVisible();
    await adminPage.expectSummaryCardsVisible();
    await adminPage.expectRecentOrdersVisible();
    await adminPage.expectLowStockMessage();
  });

  test('should allow admin to navigate to the full orders list', async ({ page, authenticatedUiAdminUser }) => {
    // given
    const adminOrdersPage = new AdminOrdersPage(page);
    await adminPage.goto();

    // when
    await adminPage.clickViewAllOrders();

    // then
    await adminOrdersPage.expectOnOrdersPage();
    await adminOrdersPage.expectOrdersTableVisible();
  });
});
