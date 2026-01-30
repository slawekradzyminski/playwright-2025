import { expect, type Locator, type Page } from '@playwright/test';

export class AdminDashboardPage {
  readonly page: Page;
  readonly dashboardHeading: Locator;
  readonly totalProductsCard: Locator;
  readonly totalOrdersCard: Locator;
  readonly pendingOrdersCard: Locator;
  readonly totalRevenueCard: Locator;
  readonly manageProductsLink: Locator;
  readonly viewAllOrdersLink: Locator;
  readonly recentOrdersSection: Locator;
  readonly lowStockSection: Locator;
  readonly adminUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.adminUrl = `${process.env.FRONTEND_URL}/admin`;
    this.dashboardHeading = page.getByRole('heading', { name: 'Admin Dashboard', level: 1 });
    this.totalProductsCard = page.getByRole('heading', { name: 'Total Products', level: 2 });
    this.totalOrdersCard = page.getByRole('heading', { name: 'Total Orders', level: 2 });
    this.pendingOrdersCard = page.getByRole('heading', { name: 'Pending Orders', level: 2 });
    this.totalRevenueCard = page.getByRole('heading', { name: 'Total Revenue', level: 2 });
    this.manageProductsLink = page.getByTestId('admin-dashboard-products-link');
    this.viewAllOrdersLink = page.getByTestId('admin-dashboard-orders-link');
    this.recentOrdersSection = page.getByRole('heading', { name: 'Recent Orders', level: 2 });
    this.lowStockSection = page.getByRole('heading', { name: 'Low Stock Products', level: 2 });
  }

  async goto() {
    await this.page.goto(this.adminUrl);
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  }

  async clickManageProducts() {
    await this.manageProductsLink.click();
  }

  async clickViewAllOrders() {
    await this.viewAllOrdersLink.click();
  }

  async expectToBeOnAdminDashboard() {
    await expect(this.page).toHaveURL(this.adminUrl);
    await expect(this.dashboardHeading).toBeVisible();
  }

  async expectDashboardStatisticsVisible() {
    await expect(this.totalProductsCard).toBeVisible();
    await expect(this.totalOrdersCard).toBeVisible();
    await expect(this.pendingOrdersCard).toBeVisible();
    await expect(this.totalRevenueCard).toBeVisible();
  }

  async expectRecentOrdersSectionVisible() {
    await expect(this.recentOrdersSection).toBeVisible();
  }

  async expectLowStockSectionVisible() {
    await expect(this.lowStockSection).toBeVisible();
  }

  async expectToBeOnProductsPage() {
    await expect(this.page).toHaveURL(`${process.env.FRONTEND_URL}/admin/products`);
  }

  async expectToBeOnOrdersPage() {
    await expect(this.page).toHaveURL(`${process.env.FRONTEND_URL}/admin/orders`);
  }
}
