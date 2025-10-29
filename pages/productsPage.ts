import { expect, Locator, Page } from '@playwright/test';
import { LoggedInPage } from './abstract/loggedInPage';
import { ToastComponent } from './components/toastComponent';

export enum SortOption {
  NameAsc = 'name-asc',
  NameDesc = 'name-desc',
  PriceAsc = 'price-asc',
  PriceDesc = 'price-desc',
}

export enum Category {
  All = 'all',
}

export class ProductsPage extends LoggedInPage {
  static readonly MAX_SORT_CHECK = 5;

  readonly toast: ToastComponent;
  readonly productsTitle: Locator;
  readonly categoriesTitle: Locator;
  readonly categoriesList: Locator;
  readonly categoryAll: Locator;
  readonly searchInput: Locator;
  readonly clearSearchButton: Locator;
  readonly sortDropdown: Locator;
  readonly productListTitle: Locator;
  readonly productCards: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.toast = new ToastComponent(page);
    this.productsTitle = page.getByTestId('products-title');
    this.categoriesTitle = page.getByTestId('products-categories-title');
    this.categoriesList = page.getByTestId('products-categories-list');
    this.categoryAll = page.getByTestId('products-category-all');
    this.searchInput = page.getByTestId('product-search');
    this.clearSearchButton = page.getByTestId('clear-search');
    this.sortDropdown = page.getByTestId('product-sort');
    this.productListTitle = page.getByTestId('product-list-title');
    this.productCards = page.getByTestId('product-item');
    this.cartBadge = page.getByTestId('desktop-cart-icon');
  }

  async expectOnPage() {
    await expect(this.page).toHaveURL(/\/products/);
    await expect(this.productsTitle).toBeVisible();
  }

  getCategoryButton(category: string) {
    return this.page.getByTestId(`products-category-${category}`);
  }

  async clickCategory(category: string) {
    await this.getCategoryButton(category).click();
  }

  async clickAllProducts() {
    await this.categoryAll.click();
  }

  async expectCategoryActive(category: string) {
    const categoryButton = category === 'all'
      ? this.categoryAll
      : this.getCategoryButton(category);
    await expect(categoryButton).toHaveClass(/bg-blue-100/);
    await expect(categoryButton).toHaveClass(/text-blue-700/);
  }

  async expectProductListTitle(title: string) {
    await expect(this.productListTitle).toHaveText(title);
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async clickClearSearch() {
    await this.clearSearchButton.click();
  }

  async expectSearchValue(value: string) {
    await expect(this.searchInput).toHaveValue(value);
  }

  async expectClearSearchVisible() {
    await expect(this.clearSearchButton).toBeVisible();
  }

  async selectSort(option: string | SortOption) {
    await this.sortDropdown.selectOption(option);
  }

  async expectProductCount(count: number) {
    await expect(this.productCards).toHaveCount(count);
  }

  async expectProductsCount(count: number) {
    const productsCount = await this.productCards.count();
    expect(productsCount).toEqual(count);
  }

  async expectMinimumProducts(minCount: number) {
    const productsCount = await this.productCards.count();
    expect(productsCount).toBeGreaterThanOrEqual(minCount);
  }

  getProductCard(index: number) {
    return this.productCards.nth(index);
  }

  getProductName(index: number) {
    return this.getProductCard(index).getByTestId('product-name');
  }

  getProductPrice(index: number) {
    return this.getProductCard(index).getByTestId('product-price');
  }

  getProductCategory(index: number) {
    return this.getProductCard(index).getByTestId('product-category');
  }

  getProductQuantity(index: number) {
    return this.getProductCard(index).getByTestId('product-quantity-value');
  }

  getIncreaseQuantityButton(index: number) {
    return this.getProductCard(index).getByTestId('product-increase-quantity');
  }

  getDecreaseQuantityButton(index: number) {
    return this.getProductCard(index).getByTestId('product-decrease-quantity');
  }

  getAddToCartButton(index: number) {
    return this.getProductCard(index).getByTestId('product-add-button');
  }

  async clickIncreaseQuantity(index: number) {
    await this.getIncreaseQuantityButton(index).click();
  }

  async clickDecreaseQuantity(index: number) {
    await this.getDecreaseQuantityButton(index).click();
  }

  async clickAddToCart(index: number) {
    await this.getAddToCartButton(index).click();
  }

  async expectProductQuantity(index: number, quantity: number) {
    await expect(this.getProductQuantity(index)).toHaveText(quantity.toString());
  }

  async expectAllProductsHaveCategory(category: string) {
    const items = await this.productCards.locator('[data-testid="product-category"]').allTextContents();
    const slice = items.slice(0, 3);
    for (const text of slice) {
      expect(text.trim().toLowerCase()).toBe(category.trim().toLowerCase());
    }
  }

  async expectCartBadge(count: string) {
    await expect(this.cartBadge).toHaveText(count);
  }

  async getFirstProductName(): Promise<string> {
    const text = await this.getProductName(0).textContent();
    expect(text, 'First product name should exist').toBeTruthy();
    return (text ?? '').trim();
  }

  async expectAddedToCartToast(message: string | RegExp) {
    const toast = this.page.getByTestId('toast-description');
    const toastTitle = this.page.getByTestId('toast-title');
    await expect(toastTitle).toHaveText('Added to cart');
    await expect(toast).toHaveText(message);
  }

  private static parsePrice(input: string): number {
    const noSpaces = input.replace(/\s/g, '');
    const stripped = noSpaces.replace(/[^\d,.-]/g, '');
    const euroDecimal = /,\d{1,2}$/.test(stripped);
    const canonical = euroDecimal
      ? stripped.replace(/\./g, '').replace(',', '.')
      : stripped.replace(/,/g, '');
    const n = Number(canonical);
    return Number.isNaN(n) ? 0 : n;
  }

  async getVisibleProductNames(limit = ProductsPage.MAX_SORT_CHECK): Promise<string[]> {
    const names = await this.productCards
      .locator('[data-testid="product-name"]')
      .allTextContents();
    return names.slice(0, limit).map(s => s.trim()).filter(Boolean);
  }

  async getVisibleProductPrices(limit = ProductsPage.MAX_SORT_CHECK): Promise<number[]> {
    const texts = await this.productCards
      .locator('[data-testid="product-price"]')
      .allTextContents();
    return texts.slice(0, limit).map(t => ProductsPage.parsePrice(t));
  }

  async expectProductsSortedByName(ascending = true) {
    const names = await this.getVisibleProductNames();
    const sorted = [...names].sort((a, b) =>
      (ascending ? 1 : -1) * a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true })
    );
    expect(names, `Product names not sorted in ${ascending ? 'ascending' : 'descending'} order`).toEqual(sorted);
  }

  async expectProductsSortedByPrice(ascending = true) {
    const prices = await this.getVisibleProductPrices();
    const sorted = [...prices].sort((a, b) => (ascending ? a - b : b - a));
    expect(prices, `Product prices not sorted in ${ascending ? 'ascending' : 'descending'} order`).toEqual(sorted);
  }
}
