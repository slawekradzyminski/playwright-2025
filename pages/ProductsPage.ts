import { expect, type Locator, type Page } from '@playwright/test';
import { FRONTEND_URL } from '../config/constants';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly productsHeading: Locator;
  readonly categoriesHeading: Locator;
  readonly searchInput: Locator;
  readonly clearSearchButton: Locator;
  readonly sortDropdown: Locator;
  readonly productGrid: Locator;
  readonly currentSectionHeading: Locator;
  
  readonly allProductsButton: Locator;
  readonly audioButton: Locator;
  readonly booksButton: Locator;
  readonly computersButton: Locator;
  readonly electronicsButton: Locator;
  readonly gamingButton: Locator;
  readonly homeKitchenButton: Locator;
  readonly wearablesButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productsHeading = page.getByRole('heading', { name: 'Products', level: 1 });
    this.categoriesHeading = page.getByRole('heading', { name: 'Categories', level: 2 });
    this.searchInput = page.getByTestId('product-search');
    this.clearSearchButton = page.getByTestId('clear-search');
    this.sortDropdown = page.getByRole('combobox', { name: 'Sort by:' });
    this.productGrid = page.locator('div').filter({ hasText: /Apple Watch|iPhone|MacBook/ }).first().locator('..');
    this.currentSectionHeading = page.locator('h2').nth(1);
    
    this.allProductsButton = page.getByTestId('products-category-all');
    this.audioButton = page.getByTestId('products-category-audio');
    this.booksButton = page.getByTestId('products-category-books');
    this.computersButton = page.getByTestId('products-category-computers');
    this.electronicsButton = page.getByTestId('products-category-electronics');
    this.gamingButton = page.getByTestId('products-category-gaming');
    this.homeKitchenButton = page.getByRole('button', { name: 'Home & Kitchen' });
    this.wearablesButton = page.getByTestId('products-category-wearables');
  }

  async goto() {
    await this.page.goto(`${FRONTEND_URL}/products`);
  }

  async expectPageElements() {
    await expect(this.productsHeading).toBeVisible();
    await expect(this.categoriesHeading).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.sortDropdown).toBeVisible();
  }

  async expectAllCategoryButtons() {
    await expect(this.allProductsButton).toBeVisible();
    await expect(this.audioButton).toBeVisible();
    await expect(this.booksButton).toBeVisible();
    await expect(this.computersButton).toBeVisible();
    await expect(this.electronicsButton).toBeVisible();
    await expect(this.gamingButton).toBeVisible();
    await expect(this.homeKitchenButton).toBeVisible();
    await expect(this.wearablesButton).toBeVisible();
  }

  async expectProductsToBeDisplayed() {
    const products = this.page.locator('h3').filter({ hasText: /Apple Watch|iPhone|MacBook|Clean Code|PlayStation|Samsung|Sony|Ninja/ });
    await expect(products.first()).toBeVisible();
    const productCount = await products.count();
    expect(productCount).toBeGreaterThan(0);
  }

  async searchForProduct(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

  async clearSearch() {
    await this.clearSearchButton.click();
  }

  async expectSearchResults(searchTerm: string) {
    const products = this.page.locator('h3').filter({ hasText: new RegExp(searchTerm, 'i') });
    const productCount = await products.count();
    expect(productCount).toBeGreaterThan(0);
  }

  async expectClearSearchButtonVisible() {
    await expect(this.clearSearchButton).toBeVisible();
  }

  async expectClearSearchButtonHidden() {
    await expect(this.clearSearchButton).not.toBeVisible();
  }

  async clickCategory(category: string) {
    switch (category.toLowerCase()) {
      case 'all':
        await this.allProductsButton.click();
        break;
      case 'audio':
        await this.audioButton.click();
        break;
      case 'books':
        await this.booksButton.click();
        break;
      case 'computers':
        await this.computersButton.click();
        break;
      case 'electronics':
        await this.electronicsButton.click();
        break;
      case 'gaming':
        await this.gamingButton.click();
        break;
      case 'home & kitchen':
        await this.homeKitchenButton.click();
        break;
      case 'wearables':
        await this.wearablesButton.click();
        break;
      default:
        throw new Error(`Unknown category: ${category}`);
    }
  }

  async expectCategoryProducts(category: string) {
    if (category.toLowerCase() === 'all') {
      await expect(this.currentSectionHeading).toHaveText('All Products');
    } else {
      await expect(this.currentSectionHeading).toHaveText(`${category} Products`);
    }
  }

  async addFirstProductToCart() {
    const firstAddToCartButton = this.page.getByRole('button', { name: 'Add to Cart' }).first();
    await firstAddToCartButton.click();
  }

  async changeQuantity(productIndex: number, action: 'increase' | 'decrease') {
    const buttons = action === 'increase' 
      ? this.page.getByRole('button', { name: '+' })
      : this.page.getByRole('button', { name: '-' });
    await buttons.nth(productIndex).click();
  }

  async expectQuantity(productIndex: number, expectedQuantity: string) {
    const quantityDisplays = this.page.locator('div').filter({ hasText: /^\d+$/ });
    await expect(quantityDisplays.nth(productIndex)).toHaveText(expectedQuantity);
  }
} 