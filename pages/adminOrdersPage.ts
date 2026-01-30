import { expect, type Locator, type Page } from '@playwright/test';

export class AdminOrdersPage {
  readonly page: Page;
  readonly pageHeading: Locator;
  readonly ordersTable: Locator;
  readonly tableHeaders: Locator;
  readonly statusFilter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: 'Manage Orders', level: 1 });
    this.ordersTable = page.getByRole('table');
    this.tableHeaders = page.getByRole('columnheader');
    this.statusFilter = page.getByRole('combobox', { name: 'Filter by Status:' });
  }

  async goto() {
    await this.page.goto(`${process.env.FRONTEND_URL}/admin/orders`);
  }

  async expectToBeOnOrdersPage() {
    await expect(this.page).toHaveURL(`${process.env.FRONTEND_URL}/admin/orders`);
    await expect(this.pageHeading).toBeVisible();
  }

  async expectOrdersTableVisible() {
    await expect(this.ordersTable).toBeVisible();
  }

  async expectTableHeaders() {
    await expect(this.tableHeaders.nth(0)).toHaveText('Order ID');
    await expect(this.tableHeaders.nth(1)).toHaveText('Customer');
    await expect(this.tableHeaders.nth(2)).toHaveText('Date');
    await expect(this.tableHeaders.nth(3)).toHaveText('Total');
    await expect(this.tableHeaders.nth(4)).toHaveText('Status');
    await expect(this.tableHeaders.nth(5)).toHaveText('Actions');
  }

  async expectStatusFilterVisible() {
    await expect(this.statusFilter).toBeVisible();
  }
}
