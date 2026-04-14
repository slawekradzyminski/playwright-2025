import { type Page, type Locator, expect } from '@playwright/test';

const APP_BASE_URL = process.env.APP_BASE_URL || '';

export class ProductsPage {
  readonly page: Page;
  readonly url: string;

  readonly pageTitle: Locator;
  readonly listTitle: Locator;
  readonly searchInput: Locator;
  readonly clearSearchButton: Locator;
  readonly sortSelect: Locator;
  readonly productList: Locator;
  readonly noProductsMessage: Locator;
  readonly resetSearchButton: Locator;
  readonly cartItemCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.url = `${APP_BASE_URL}/products`;

    this.pageTitle = page.getByTestId('products-title');
    this.listTitle = page.getByTestId('product-list-title');
    this.searchInput = page.getByTestId('product-search');
    this.clearSearchButton = page.getByTestId('clear-search');
    this.sortSelect = page.getByTestId('product-sort');
    this.productList = page.getByTestId('product-list');
    this.noProductsMessage = page.getByTestId('no-products-message');
    this.resetSearchButton = page.getByTestId('reset-search-button');
    this.cartItemCount = page.getByTestId('cart-item-count');
  }

  async goto() {
    await Promise.all([
      this.page.waitForResponse(
        resp => resp.url().includes('/api/v1/products') && resp.status() === 200
      ),
      this.page.goto(this.url),
    ]);
  }

  get productItems(): Locator {
    return this.page.getByTestId('product-item');
  }

  async getProductNames(): Promise<string[]> {
    return this.page.getByTestId('product-name').allTextContents();
  }

  async getProductPrices(): Promise<string[]> {
    return this.page.getByTestId('product-price').allTextContents();
  }

  categoryButton(category: string): Locator {
    return this.page.getByTestId('products-categories-list').getByRole('button', { name: category });
  }

  productItemByName(name: string): Locator {
    return this.page.getByTestId('product-item').filter({ hasText: name });
  }

  addToCartButton(productName: string): Locator {
    return this.productItemByName(productName).getByTestId('product-add-button');
  }

  removeFromCartButton(productName: string): Locator {
    return this.productItemByName(productName).getByTestId('product-remove-button');
  }

  updateCartButton(productName: string): Locator {
    return this.productItemByName(productName).getByRole('button', { name: 'Update Cart' });
  }

  cartQuantityLabel(productName: string): Locator {
    return this.productItemByName(productName).getByTestId('product-card-cart-quantity');
  }

  async filterByCategory(category: string): Promise<void> {
    await Promise.all([
      this.page.waitForResponse(
        resp => resp.url().includes('/api/v1/products') && resp.status() === 200
      ),
      this.categoryButton(category).click(),
    ]);
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  async sortBy(option: string): Promise<void> {
    await this.sortSelect.selectOption(option);
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(this.url);
    await expect(this.pageTitle).toHaveText('Products');
  }

  async expectListTitle(title: string): Promise<void> {
    await expect(this.listTitle).toContainText(title);
  }
}
