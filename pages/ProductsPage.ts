import { expect, type Locator, type Page } from '@playwright/test';
import { UI_BASE_URL } from '../config/constants';
import { LoggedInHeaderComponent } from './components/LoggedInHeader';
import { ToastComponent } from './components/Toast';

export class ProductsPage {
  readonly page: Page;
  readonly header: LoggedInHeaderComponent;
  readonly toast: ToastComponent;
  readonly pageHeading: Locator;
  readonly categoriesHeading: Locator;
  readonly searchInput: Locator;
  readonly clearSearchButton: Locator;
  readonly sortDropdown: Locator;
  readonly productCards: Locator;
  readonly categoryAllButton: Locator;
  readonly categoryAudioButton: Locator;
  readonly categoryBooksButton: Locator;
  readonly categoryComputersButton: Locator;
  readonly categoryElectronicsButton: Locator;
  readonly categoryGamingButton: Locator;
  readonly categoryHomeKitchenButton: Locator;
  readonly categoryWearablesButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new LoggedInHeaderComponent(page);
    this.toast = new ToastComponent(page);
    this.pageHeading = page.getByTestId('products-title');
    this.categoriesHeading = page.getByTestId('products-categories-title');
    this.searchInput = page.getByTestId('product-search');
    this.clearSearchButton = page.getByTestId('clear-search');
    this.sortDropdown = page.getByTestId('product-sort');
    this.productCards = page.getByTestId('product-item');
    this.categoryAllButton = page.getByTestId('products-category-all');
    this.categoryAudioButton = page.getByTestId('products-category-audio');
    this.categoryBooksButton = page.getByTestId('products-category-books');
    this.categoryComputersButton = page.getByTestId('products-category-computers');
    this.categoryElectronicsButton = page.getByTestId('products-category-electronics');
    this.categoryGamingButton = page.getByTestId('products-category-gaming');
    this.categoryHomeKitchenButton = page.getByTestId('products-category-homekitchen');
    this.categoryWearablesButton = page.getByTestId('products-category-wearables');
  }

  async goto() {
    await this.page.goto(`${UI_BASE_URL}/products`);
  }

  async expectToBeOnProductsPage() {
    await expect(this.page).toHaveURL(`${UI_BASE_URL}/products`);
  }

  async expectPageHeading(text: string) {
    await expect(this.pageHeading).toHaveText(text);
  }

  async expectProductsHeading(text: string) {
    const productsHeading = this.page.getByTestId('product-list-title');
    await expect(productsHeading).toHaveText(text);
  }

  async expectProductCardCount(count: number) {
    await expect(this.productCards).toHaveCount(count);
  }

  async expectMinimumProductCards(minCount: number) {
    const count = await this.productCards.count();
    expect(count).toBeGreaterThanOrEqual(minCount);
  }

  async expectSortOption(option: string) {
    await expect(this.sortDropdown).toHaveValue(option);
  }

  async search(text: string) {
    await this.searchInput.fill(text);
  }

  async clearSearch() {
    await this.clearSearchButton.click();
  }

  async selectSort(option: string) {
    await this.sortDropdown.selectOption(option);
  }

  async clickCategory(category: 'all' | 'audio' | 'books' | 'computers' | 'electronics' | 'gaming' | 'homekitchen' | 'wearables') {
    const buttons = {
      all: this.categoryAllButton,
      audio: this.categoryAudioButton,
      books: this.categoryBooksButton,
      computers: this.categoryComputersButton,
      electronics: this.categoryElectronicsButton,
      gaming: this.categoryGamingButton,
      homekitchen: this.categoryHomeKitchenButton,
      wearables: this.categoryWearablesButton,
    };
    await buttons[category].click();
  }

  async getProductCard(index: number) {
    return this.productCards.nth(index);
  }

  async getProductName(productCard: Locator) {
    return productCard.getByTestId('product-name').textContent();
  }

  async getProductPrice(productCard: Locator) {
    const priceText = await productCard.getByTestId('product-price').textContent();
    return parseFloat(priceText?.replace('$', '') || '0');
  }

  async getProductCategory(productCard: Locator) {
    return productCard.getByTestId('product-category').textContent();
  }

  async expectProductHasElements(productCard: Locator) {
    await expect(productCard.getByTestId('product-image')).toBeVisible();
    await expect(productCard.getByTestId('product-name')).toBeVisible();
    await expect(productCard.getByTestId('product-price')).toBeVisible();
  }

  async increaseQuantity(productCard: Locator) {
    await productCard.getByTestId('product-increase-quantity').click();
  }

  async decreaseQuantity(productCard: Locator) {
    await productCard.getByTestId('product-decrease-quantity').click();
  }

  async getQuantity(productCard: Locator) {
    const text = await productCard.getByTestId('product-quantity-value').textContent();
    return parseInt(text || '1');
  }

  async addToCart(productCard: Locator) {
    await productCard.getByTestId('product-add-button').click();
  }

  async updateCart(productCard: Locator) {
    await productCard.getByRole('button', { name: 'Update Cart' }).click();
  }

  async removeFromCart(productCard: Locator) {
    await productCard.getByTestId('product-remove-button').click();
  }

  async expectInCartText(productCard: Locator, quantity: number) {
    await expect(productCard.getByText(`${quantity} in cart`)).toBeVisible();
  }

  async expectAddToCartButton(productCard: Locator) {
    await expect(productCard.getByTestId('product-add-button')).toBeVisible();
  }

  async expectUpdateCartButton(productCard: Locator) {
    await expect(productCard.getByRole('button', { name: 'Update Cart' })).toBeVisible();
  }

  async expectRemoveFromCartButton(productCard: Locator) {
    await expect(productCard.getByTestId('product-remove-button')).toBeVisible();
  }

  async clickProductCard(productCard: Locator) {
    await productCard.click();
  }

  async expectAllProductsHaveCategory(category: string) {
    const count = await this.productCards.count();
    for (let i = 0; i < count; i++) {
      const card = await this.getProductCard(i);
      const cardCategory = await this.getProductCategory(card);
      expect(cardCategory).toBe(category);
    }
  }

  async expectProductsSortedByPriceAscending() {
    const count = await this.productCards.count();
    const prices: number[] = [];
    
    for (let i = 0; i < count; i++) {
      const card = await this.getProductCard(i);
      const price = await this.getProductPrice(card);
      prices.push(price);
    }

    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  }

  async expectProductsSortedByPriceDescending() {
    const count = await this.productCards.count();
    const prices: number[] = [];
    
    for (let i = 0; i < count; i++) {
      const card = await this.getProductCard(i);
      const price = await this.getProductPrice(card);
      prices.push(price);
    }

    const sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedPrices);
  }

}
