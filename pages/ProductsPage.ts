import { expect, type Locator, type Page } from '@playwright/test';
import { FRONTEND_URL } from './constants';

export class ProductsPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly categoriesSection: Locator;
  readonly allProductsButton: Locator;
  readonly audioButton: Locator;
  readonly booksButton: Locator;
  readonly clothingButton: Locator;
  readonly computersButton: Locator;
  readonly electronicsButton: Locator;
  readonly foodBeverageButton: Locator;
  readonly gamingButton: Locator;
  readonly homeGardenButton: Locator;
  readonly homeKitchenButton: Locator;
  readonly sportsButton: Locator;
  readonly toysButton: Locator;
  readonly wearablesButton: Locator;
  readonly searchInput: Locator;
  readonly clearSearchButton: Locator;
  readonly sortSelect: Locator;
  readonly productsGrid: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole('heading', { name: 'Products', level: 1 });
    this.categoriesSection = page.getByRole('heading', { name: 'Categories', level: 2 });
    this.allProductsButton = page.getByTestId('products-category-all');
    this.audioButton = page.getByTestId('products-category-audio');
    this.booksButton = page.getByTestId('products-category-books');
    this.clothingButton = page.getByTestId('products-category-clothing');
    this.computersButton = page.getByTestId('products-category-computers');
    this.electronicsButton = page.getByTestId('products-category-electronics');
    this.foodBeverageButton = page.getByTestId('products-category-food-beverage');
    this.gamingButton = page.getByTestId('products-category-gaming');
    this.homeGardenButton = page.getByTestId('products-category-home-garden');
    this.homeKitchenButton = page.getByTestId('products-category-home-kitchen');
    this.sportsButton = page.getByTestId('products-category-sports');
    this.toysButton = page.getByTestId('products-category-toys');
    this.wearablesButton = page.getByTestId('products-category-wearables');
    this.searchInput = page.getByTestId('product-search');
    this.clearSearchButton = page.getByRole('button', { name: 'Clear search' });
    this.sortSelect = page.getByTestId('product-sort');
    this.productsGrid = page.getByTestId('products-grid');
  }

  async expectToBeOnProductsPage() {
    await expect(this.page).toHaveURL(`${FRONTEND_URL}/products`);
    await expect(this.pageTitle).toBeVisible();
  }

  async expectPageElements() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.categoriesSection).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.sortSelect).toBeVisible();
  }

  async filterByCategory(category: string) {
    const categoryButton = this.getCategoryButton(category);
    await categoryButton.click();
  }

  async expectCategoryActive(category: string) {
    const categoryButton = this.getCategoryButton(category);
    await expect(categoryButton).toHaveClass(/bg-blue-100/);
  }

  async expectCategoryTitle(category: string) {
    const expectedTitle = category === 'All' ? 'All Products' : `${category} Products`;
    const categoryTitle = this.page.getByRole('heading', { name: expectedTitle, level: 2 });
    await expect(categoryTitle).toBeVisible();
  }

  async searchProducts(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

  async clearSearch() {
    await this.clearSearchButton.click();
  }

  async expectSearchValue(searchTerm: string) {
    await expect(this.searchInput).toHaveValue(searchTerm);
  }

  async expectClearSearchButtonVisible() {
    await expect(this.clearSearchButton).toBeVisible();
  }

  async sortProducts(sortOption: string) {
    const sortValueMap: Record<string, string> = {
      'Name (A-Z)': 'name-asc',
      'Name (Z-A)': 'name-desc',
      'Price (Low to High)': 'price-asc',
      'Price (High to Low)': 'price-desc'
    };
    const value = sortValueMap[sortOption] || sortOption;
    await this.sortSelect.selectOption(value);
  }

  async expectSortValue(sortOption: string) {
    const sortValueMap: Record<string, string> = {
      'Name (A-Z)': 'name-asc',
      'Name (Z-A)': 'name-desc',
      'Price (Low to High)': 'price-asc',
      'Price (High to Low)': 'price-desc'
    };
    const value = sortValueMap[sortOption] || sortOption;
    await expect(this.sortSelect).toHaveValue(value);
  }

  async getProductCard(productName: string) {
    return this.page.getByTestId('product-name').filter({ hasText: productName }).locator('../..');
  }

  async expectProductVisible(productName: string) {
    const productCard = await this.getProductCard(productName);
    await expect(productCard).toBeVisible();
  }

  async expectProductNotVisible(productName: string) {
    const productCard = await this.getProductCard(productName);
    await expect(productCard).not.toBeVisible();
  }

  async expectProductCount(count: number) {
    const productCards = this.page.locator('.grid > div');
    await expect(productCards).toHaveCount(count);
  }

  async expectMinimumProductCount(minCount: number) {
    const productCards = this.page.locator('.grid > div');
    const actualCount = await productCards.count();
    expect(actualCount).toBeGreaterThanOrEqual(minCount);
  }

  async clickProduct(productName: string) {
    await this.page.getByTestId('product-name').filter({ hasText: productName }).click();
  }

  async addProductToCart(productName: string) {
    const productCard = await this.getProductCard(productName);
    const addButton = productCard.getByTestId('product-add-button');
    await addButton.click();
  }

  async updateProductQuantity(productName: string, action: 'increase' | 'decrease') {
    const productCard = await this.getProductCard(productName);
    const button = action === 'increase' 
      ? productCard.getByRole('button', { name: '+' })
      : productCard.getByRole('button', { name: '-' });
    await button.click();
  }

  async expectProductInCart(productName: string, quantity?: number) {
    const productCard = await this.getProductCard(productName);
    const cartInfo = productCard.getByText(/\d+ in cart/);
    await expect(cartInfo).toBeVisible();
    
    if (quantity) {
      await expect(cartInfo).toHaveText(`${quantity} in cart`);
    }
  }

  async expectAddToCartNotification() {
    const notification = this.page.getByText('Added to cart').first();
    await expect(notification).toBeVisible();
  }

  async expectProductDetails(productName: string, expectedDetails: {
    price?: string;
    category?: string;
    description?: string;
  }) {
    const productCard = await this.getProductCard(productName);
    
    if (expectedDetails.price) {
      const priceElement = productCard.getByText(expectedDetails.price).first();
      await expect(priceElement).toBeVisible();
    }
    
    if (expectedDetails.category) {
      const categoryElement = productCard.getByText(expectedDetails.category).first();
      await expect(categoryElement).toBeVisible();
    }
    
    if (expectedDetails.description) {
      const descriptionElement = productCard.getByText(expectedDetails.description, { exact: false }).first();
      await expect(descriptionElement).toBeVisible();
    }
  }

  async expectProductsSortedByName(ascending: boolean = true) {
    const productNames = await this.page.locator('.grid > div h3').allTextContents();
    const sortedNames = [...productNames].sort((a, b) => {
      const comparison = a.localeCompare(b, 'en', { sensitivity: 'base' });
      return ascending ? comparison : -comparison;
    });
    
    expect(productNames).toEqual(sortedNames);
  }

  async expectProductsSortedByPrice(ascending: boolean = true) {
    const priceElements = this.page.locator('.grid > div').getByText(/\$\d+/);
    const priceTexts = await priceElements.allTextContents();
    const prices = priceTexts.map(price => parseFloat(price.replace('$', '').replace(',', '')));
    
    const sortedPrices = [...prices].sort((a, b) => ascending ? a - b : b - a);
    expect(prices).toEqual(sortedPrices);
  }

  private getCategoryButton(category: string): Locator {
    const categoryMap: Record<string, Locator> = {
      'All': this.allProductsButton,
      'Audio': this.audioButton,
      'Books': this.booksButton,
      'Clothing': this.clothingButton,
      'Computers': this.computersButton,
      'Electronics': this.electronicsButton,
      'Food & Beverage': this.foodBeverageButton,
      'Gaming': this.gamingButton,
      'Home & Garden': this.homeGardenButton,
      'Home & Kitchen': this.homeKitchenButton,
      'Sports': this.sportsButton,
      'Toys': this.toysButton,
      'Wearables': this.wearablesButton
    };

    const button = categoryMap[category];
    if (!button) {
      throw new Error(`Unknown category: ${category}`);
    }
    return button;
  }
}
