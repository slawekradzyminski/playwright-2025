import { expect, type Locator, type Page } from '@playwright/test';
import { LoggedInPage } from './abstract/loggedInPage';

export class AdminProductsPage extends LoggedInPage {
  readonly title: Locator;
  readonly addNewProductLink: Locator;
  readonly table: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId('admin-product-list-title');
    this.addNewProductLink = page.getByTestId('admin-product-list-add-new');
    this.table = page.getByTestId('admin-product-list-table');
  }

  async expectOnPage() {
    await expect(this.page).toHaveURL(/\/admin\/products$/);
    await expect(this.title).toBeVisible();
  }
}
