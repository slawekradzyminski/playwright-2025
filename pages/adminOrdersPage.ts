import { expect, type Locator, type Page } from '@playwright/test';
import { LoggedInPage } from './abstract/loggedInPage';

export class AdminOrdersPage extends LoggedInPage {
  readonly title: Locator;
  readonly statusFilter: Locator;
  readonly table: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId('admin-order-list-title');
    this.statusFilter = page.getByTestId('admin-order-list-status-filter');
    this.table = page.getByTestId('admin-order-list-table');
  }

  async expectOnPage() {
    await expect(this.page).toHaveURL(/\/admin\/orders$/);
    await expect(this.title).toBeVisible();
  }
}
