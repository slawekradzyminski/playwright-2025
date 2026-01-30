import { test } from '@playwright/test';
import { AdminDashboardPage } from '../../pages/adminDashboardPage';

test.describe('Admin Dashboard UI tests', () => {
  let adminDashboardPage: AdminDashboardPage;

  test.beforeEach(async ({ page }) => {
    adminDashboardPage = new AdminDashboardPage(page);
    await adminDashboardPage.goto();
  });

  test('should display dashboard statistics', async () => {
    await adminDashboardPage.expectToBeOnAdminDashboard();
    await adminDashboardPage.expectDashboardStatisticsVisible();
    await adminDashboardPage.expectRecentOrdersSectionVisible();
    await adminDashboardPage.expectLowStockSectionVisible();
  });

  test('should navigate to products management from dashboard', async () => {
    await adminDashboardPage.clickManageProducts();

    await adminDashboardPage.expectToBeOnProductsPage();
  });

  test('should navigate to orders management from dashboard', async () => {
    await adminDashboardPage.clickViewAllOrders();

    await adminDashboardPage.expectToBeOnOrdersPage();
  });
});
