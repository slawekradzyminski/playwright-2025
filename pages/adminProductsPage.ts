import { expect, type Locator, type Page } from '@playwright/test';

export class AdminProductsPage {
  readonly page: Page;
  readonly pageHeading: Locator;
  readonly addNewProductButton: Locator;
  readonly productsTable: Locator;
  readonly tableHeaders: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: 'Manage Products', level: 1 });
    this.addNewProductButton = page.getByRole('link', { name: 'Add New Product' });
    this.productsTable = page.getByRole('table');
    this.tableHeaders = page.getByRole('columnheader');
  }

  async goto() {
    await this.page.goto(`${process.env.FRONTEND_URL}/admin/products`);
  }

  async expectToBeOnProductsPage() {
    await expect(this.page).toHaveURL(`${process.env.FRONTEND_URL}/admin/products`);
    await expect(this.pageHeading).toBeVisible();
  }

  async expectProductsTableVisible() {
    await expect(this.productsTable).toBeVisible();
  }

  async expectTableHeaders() {
    await expect(this.tableHeaders.nth(0)).toHaveText('ID');
    await expect(this.tableHeaders.nth(1)).toHaveText('Name');
    await expect(this.tableHeaders.nth(2)).toHaveText('Price');
    await expect(this.tableHeaders.nth(3)).toHaveText('Stock');
    await expect(this.tableHeaders.nth(4)).toHaveText('Category');
    await expect(this.tableHeaders.nth(5)).toHaveText('Actions');
  }

  async expectAddNewProductButtonVisible() {
    await expect(this.addNewProductButton).toBeVisible();
  }
}
