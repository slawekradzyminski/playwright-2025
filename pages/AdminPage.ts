import { expect, type Locator, type Page } from '@playwright/test';
import { UI_BASE_URL } from '../config/constants';
import { LoggedInHeaderComponent } from './components/LoggedInHeader';

export class AdminPage {
  readonly page: Page;
  readonly header: LoggedInHeaderComponent;
  readonly pageContainer: Locator;
  readonly dashboardTitle: Locator;
  readonly metricsSection: Locator;
  readonly productsCount: Locator;
  readonly ordersCount: Locator;
  readonly pendingCount: Locator;
  readonly revenueAmount: Locator;
  readonly viewAllOrdersLink: Locator;
  readonly manageProductsLink: Locator;
  readonly manageInventoryLink: Locator;
  readonly recentOrdersList: Locator;
  readonly lowStockMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new LoggedInHeaderComponent(page);
    this.pageContainer = page.getByTestId('admin-dashboard-page');
    this.dashboardTitle = page.getByTestId('admin-dashboard-title');
    this.metricsSection = page.getByTestId('admin-dashboard-metrics');
    this.productsCount = page.getByTestId('admin-dashboard-products-count');
    this.ordersCount = page.getByTestId('admin-dashboard-orders-count');
    this.pendingCount = page.getByTestId('admin-dashboard-pending-count');
    this.revenueAmount = page.getByTestId('admin-dashboard-revenue-amount');
    this.viewAllOrdersLink = page.getByTestId('admin-dashboard-view-all-orders');
    this.manageProductsLink = page.getByTestId('admin-dashboard-products-link');
    this.manageInventoryLink = page.getByTestId('admin-dashboard-manage-inventory');
    this.recentOrdersList = page.getByTestId('admin-dashboard-orders-list');
    this.lowStockMessage = page.getByTestId('admin-dashboard-no-low-stock');
  }

  async goto() {
    await this.page.goto(`${UI_BASE_URL}/admin`);
  }

  async expectOnAdminDashboard() {
    await expect(this.page).toHaveURL(`${UI_BASE_URL}/admin`);
    await expect(this.pageContainer).toBeVisible();
    await expect(this.dashboardTitle).toHaveText(/Admin Dashboard/i);
  }

  async expectSummaryCardsVisible() {
    await expect(this.metricsSection).toBeVisible();
    await expect(this.productsCount).toBeVisible();
    await expect(this.ordersCount).toBeVisible();
    await expect(this.pendingCount).toBeVisible();
    await expect(this.revenueAmount).toBeVisible();
  }

  async expectRecentOrdersVisible() {
    await expect(this.recentOrdersList).toBeVisible();
    await expect(this.viewAllOrdersLink).toBeVisible();
  }

  async expectLowStockMessage() {
    await expect(this.manageInventoryLink).toBeVisible();
    await expect(this.lowStockMessage).toBeVisible();
  }

  async clickViewAllOrders() {
    await this.viewAllOrdersLink.click();
  }

  async clickManageProducts() {
    await this.manageProductsLink.click();
  }

  async clickManageInventory() {
    await this.manageInventoryLink.click();
  }
}
