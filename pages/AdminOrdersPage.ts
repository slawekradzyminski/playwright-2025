import { expect, type Locator, type Page } from '@playwright/test';
import { UI_BASE_URL } from '../config/constants';
import { LoggedInHeaderComponent } from './components/LoggedInHeader';

export class AdminOrdersPage {
  readonly page: Page;
  readonly header: LoggedInHeaderComponent;
  readonly pageContainer: Locator;
  readonly title: Locator;
  readonly statusFilter: Locator;
  readonly ordersTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new LoggedInHeaderComponent(page);
    this.pageContainer = page.getByTestId('admin-orders-page');
    this.title = page.getByTestId('admin-order-list-title');
    this.statusFilter = page.getByTestId('admin-order-list-status-filter');
    this.ordersTable = page.getByTestId('admin-order-list-table');
  }

  async expectOnOrdersPage() {
    await expect(this.page).toHaveURL(`${UI_BASE_URL}/admin/orders`);
    await expect(this.pageContainer).toBeVisible();
    await expect(this.title).toHaveText(/Manage Orders/i);
  }

  async expectOrdersTableVisible() {
    await expect(this.statusFilter).toBeVisible();
    await expect(this.ordersTable).toBeVisible();
  }
}
