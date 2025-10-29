import { expect, type Locator, type Page } from '@playwright/test';
import { LoggedInPage } from './abstract/loggedInPage';

export class AdminDashboardPage extends LoggedInPage {
  readonly title: Locator;
  readonly metricsSection: Locator;
  readonly productsCount: Locator;
  readonly ordersCount: Locator;
  readonly pendingCount: Locator;
  readonly revenueAmount: Locator;
  readonly productsLink: Locator;
  readonly ordersLink: Locator;
  readonly pendingLink: Locator;
  readonly viewAllOrdersLink: Locator;
  readonly recentOrdersList: Locator;
  readonly recentOrderIds: Locator;
  readonly recentOrderDates: Locator;
  readonly recentOrderTotals: Locator;
  readonly recentOrderStatuses: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId('admin-dashboard-title');
    this.metricsSection = page.getByTestId('admin-dashboard-metrics');
    this.productsCount = page.getByTestId('admin-dashboard-products-count');
    this.ordersCount = page.getByTestId('admin-dashboard-orders-count');
    this.pendingCount = page.getByTestId('admin-dashboard-pending-count');
    this.revenueAmount = page.getByTestId('admin-dashboard-revenue-amount');
    this.productsLink = page.getByTestId('admin-dashboard-products-link');
    this.ordersLink = page.getByTestId('admin-dashboard-orders-link');
    this.pendingLink = page.getByTestId('admin-dashboard-pending-link');
    this.viewAllOrdersLink = page.getByTestId('admin-dashboard-view-all-orders');
    this.recentOrdersList = page.getByTestId('admin-dashboard-orders-list');
    this.recentOrderIds = page.locator('[data-testid^="admin-dashboard-order-id-"]');
    this.recentOrderDates = page.locator('[data-testid^="admin-dashboard-order-date-"]');
    this.recentOrderTotals = page.locator('[data-testid^="admin-dashboard-order-amount-"]');
    this.recentOrderStatuses = page.locator('[data-testid^="admin-dashboard-order-status-"]');
  }

  async expectOnPage() {
    await expect(this.page).toHaveURL(/\/admin$/);
    await expect(this.title).toBeVisible();
  }

  async clickProductsLink() {
    await this.productsLink.click();
  }

  async clickOrdersLink() {
    await this.ordersLink.click();
  }

  async clickPendingLink() {
    await this.pendingLink.click();
  }

  async clickViewAllOrders() {
    await this.viewAllOrdersLink.click();
  }

  private static parseInteger(text: string): number {
    return Number.parseInt(text.replace(/[^\d]/g, ''), 10);
  }

  private static parseCurrency(text: string): number {
    const cleaned = text.replace(/[^\d.,-]/g, '').replace(/,/g, '');
    return Number.parseFloat(cleaned);
  }

  async getProductsCount(): Promise<number> {
    const text = (await this.productsCount.textContent()) ?? '';
    return AdminDashboardPage.parseInteger(text);
  }

  async getOrdersCount(): Promise<number> {
    const text = (await this.ordersCount.textContent()) ?? '';
    return AdminDashboardPage.parseInteger(text);
  }

  async getPendingCount(): Promise<number> {
    const text = (await this.pendingCount.textContent()) ?? '';
    return AdminDashboardPage.parseInteger(text);
  }

  async getRevenueAmount(): Promise<number> {
    const text = (await this.revenueAmount.textContent()) ?? '';
    return AdminDashboardPage.parseCurrency(text);
  }

  async expectMetricsVisible() {
    await expect(this.metricsSection).toBeVisible();
    await expect(this.productsCount).toBeVisible();
    await expect(this.ordersCount).toBeVisible();
    await expect(this.pendingCount).toBeVisible();
    await expect(this.revenueAmount).toBeVisible();
  }

  async expectMetricsPositive() {
    const [products, orders, pending, revenue] = await Promise.all([
      this.getProductsCount(),
      this.getOrdersCount(),
      this.getPendingCount(),
      this.getRevenueAmount(),
    ]);

    expect(products).toBeGreaterThan(0);
    expect(orders).toBeGreaterThan(0);
    expect(pending).toBeGreaterThanOrEqual(0);
    expect(revenue).toBeGreaterThan(0);
  }

  async expectRecentOrdersPreview(count: number) {
    await expect(this.recentOrdersList).toBeVisible();
    await expect(this.recentOrderIds).toHaveCount(count);
    await expect(this.recentOrderDates).toHaveCount(count);
    await expect(this.recentOrderTotals).toHaveCount(count);
    await expect(this.recentOrderStatuses).toHaveCount(count);

    const values = await Promise.all([
      this.recentOrderIds.allTextContents(),
      this.recentOrderDates.allTextContents(),
      this.recentOrderTotals.allTextContents(),
      this.recentOrderStatuses.allTextContents(),
    ]);

    for (const collection of values) {
      for (const entry of collection) {
        expect(entry.trim().length).toBeGreaterThan(0);
      }
    }
  }
}
