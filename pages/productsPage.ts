import { expect, Locator, Page } from '@playwright/test';
import { LoggedInPage } from './abstract/loggedInPage';
import { ToastComponent } from './components/toastComponent';

export class ProductsPage extends LoggedInPage {
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

  async selectSort(option: string) {
    await this.sortDropdown.selectOption(option);
  }

  async expectProductCount(count: number) {
    if (count === 0) {
      await expect(this.productCards).toHaveCount(0);
    } else {
      await expect(this.productCards.first()).toBeVisible();
      await expect(this.productCards).toHaveCount(count);
    }
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

  async expectProductsSortedByName(ascending: boolean = true) {
    const count = await this.productCards.count();
    const names: string[] = [];
    for (let i = 0; i < Math.min(count, 5); i++) {
      const name = await this.getProductName(i).textContent();
      if (name) names.push(name);
    }
    const sorted = [...names].sort((a, b) => 
      ascending ? a.localeCompare(b) : b.localeCompare(a)
    );
    expect(names).toEqual(sorted);
  }

  async expectProductsSortedByPrice(ascending: boolean = true) {
    const count = await this.productCards.count();
    const prices: number[] = [];
    for (let i = 0; i < Math.min(count, 5); i++) {
      const priceText = await this.getProductPrice(i).textContent();
      if (priceText) {
        const price = parseFloat(priceText.replace('$', ''));
        prices.push(price);
      }
    }
    const sorted = [...prices].sort((a, b) => 
      ascending ? a - b : b - a
    );
    expect(prices).toEqual(sorted);
  }

  async expectAllProductsHaveCategory(category: string) {
    const count = await this.productCards.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      await expect(this.getProductCategory(i)).toHaveText(category, { ignoreCase: true });
    }
  }

  async expectCartBadge(count: string) {
    await expect(this.cartBadge).toContainText(count);
  }

  async getFirstProductName(): Promise<string> {
    return await this.getProductName(0).textContent() || '';
  }

  async expectAddedToCartToast(message: string | RegExp) {
    const toast = this.page.getByTestId('toast-description');
    const toastTitle = this.page.getByTestId('toast-title');
    await expect(toastTitle).toHaveText('Added to cart');
    await expect(toast).toHaveText(message);
  }

}

