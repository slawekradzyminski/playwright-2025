import { expect, type Locator, type Page } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly productsHeading: Locator;
  readonly categoryHeading: Locator;
  readonly searchInput: Locator;
  readonly clearSearchButton: Locator;
  readonly sortSelect: Locator;
  readonly cartLink: Locator;
  readonly cartItemCount: Locator;
  readonly notificationMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsHeading = page.getByTestId('products-title');
    this.categoryHeading = page.getByTestId('product-list-title');
    this.searchInput = page.getByTestId('product-search');
    this.clearSearchButton = page.getByTestId('clear-search');
    this.sortSelect = page.getByTestId('product-sort');
    this.cartLink = page.locator('nav a[href="/cart"]');
    this.cartItemCount = page.locator('nav a[href="/cart"] div').last();
    this.notificationMessage = page.locator('[role="status"]').first();
  }

  async goto() {
    await this.page.goto('http://localhost:8081/products');
  }

  async expectToBeOnProductsPage() {
    await expect(this.page).toHaveURL('http://localhost:8081/products');
    await expect(this.productsHeading).toBeVisible();
  }

  async selectCategory(category: string) {
    const categoryButton = this.page.getByTestId(`products-category-${category.toLowerCase()}`);
    await categoryButton.click();
  }

  async expectCategoryHeading(expectedHeading: string) {
    await expect(this.categoryHeading).toHaveText(expectedHeading);
  }

  async searchForProduct(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

  async clearSearch() {
    await this.clearSearchButton.click();
  }

  async expectClearSearchButtonToBeVisible() {
    await expect(this.clearSearchButton).toBeVisible();
  }

  async sortBy(sortOption: string) {
    await this.sortSelect.selectOption(sortOption);
  }

  async expectSortValue(expectedValue: string) {
    await expect(this.sortSelect).toHaveValue(expectedValue);
  }

  async expectProductsToBeDisplayed(expectedCount: number) {
    const productHeadings = this.page.getByRole('heading', { level: 3 });
    await expect(productHeadings).toHaveCount(expectedCount);
  }

  async expectProductToBeVisible(productName: string) {
    const productHeading = this.page.getByRole('heading', { name: productName, level: 3 });
    await expect(productHeading).toBeVisible();
  }

  async expectProductNotToBeVisible(productName: string) {
    const productHeading = this.page.getByRole('heading', { name: productName, level: 3 });
    await expect(productHeading).not.toBeVisible();
  }

  async addToCart(productName: string) {
    const productHeading = this.page.getByRole('heading', { name: productName, level: 3 });
    const productCard = productHeading.locator('..').locator('..');
    const addButton = productCard.getByTestId('product-add-button');
    await addButton.click();
  }

  async increaseQuantity(productName: string) {
    const productHeading = this.page.getByRole('heading', { name: productName, level: 3 });
    const productCard = productHeading.locator('..').locator('..');
    const increaseButton = productCard.getByTestId('product-increase-quantity');
    await increaseButton.click();
  }

  async decreaseQuantity(productName: string) {
    const productHeading = this.page.getByRole('heading', { name: productName, level: 3 });
    const productCard = productHeading.locator('..').locator('..');
    const decreaseButton = productCard.getByTestId('product-decrease-quantity');
    await decreaseButton.click();
  }

  async expectQuantity(productName: string, expectedQuantity: string) {
    const productHeading = this.page.getByRole('heading', { name: productName, level: 3 });
    const productCard = productHeading.locator('..').locator('..');
    const quantityDisplay = productCard.locator('div').filter({ hasText: expectedQuantity }).first();
    await expect(quantityDisplay).toBeVisible();
  }

  async expectCartItemCount(expectedCount: string) {
    await expect(this.cartItemCount).toHaveText(expectedCount);
  }

  async expectAddToCartNotification(productName: string, quantity: string) {
    const expectedMessage = `${quantity} × ${productName} added to your cart`;
    await expect(this.notificationMessage).toContainText(expectedMessage);
  }

  async expectProductInCartStatus(productName: string, quantity: string) {
    const productHeading = this.page.getByRole('heading', { name: productName, level: 3 });
    const productCard = productHeading.locator('..').locator('..');
    const cartStatus = productCard.locator(':text("in cart")');
    await expect(cartStatus).toHaveText(`${quantity} in cart`);
  }

  async expectFirstProductToBe(productName: string) {
    const productHeadings = this.page.getByRole('heading', { level: 3 });
    const firstProduct = productHeadings.first();
    await expect(firstProduct).toHaveText(productName);
  }
} 