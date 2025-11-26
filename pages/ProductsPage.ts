import type { Page, Locator } from '@playwright/test';
import { FRONTEND_URL } from '../config/constants';
import { Toast } from './components/Toast';
import { LoggedInHeader } from './components/LoggedInHeader';

export class ProductsPage {
  readonly page: Page;
  readonly toast: Toast;
  readonly header: LoggedInHeader;
  readonly productsPage: Locator;
  readonly pageTitle: Locator;
  readonly categoriesTitle: Locator;
  readonly categoryList: Locator;
  readonly allProductsCategory: Locator;
  readonly productListTitle: Locator;
  readonly searchInput: Locator;
  readonly clearSearchButton: Locator;
  readonly sortSelect: Locator;
  readonly productList: Locator;
  readonly productItems: Locator;

  static readonly URL = `${FRONTEND_URL}/products`;

  constructor(page: Page) {
    this.page = page;
    this.toast = new Toast(page);
    this.header = new LoggedInHeader(page);
    this.productsPage = page.getByTestId('products-page');
    this.pageTitle = page.getByTestId('products-title');
    this.categoriesTitle = page.getByTestId('products-categories-title');
    this.categoryList = page.getByTestId('products-categories-list');
    this.allProductsCategory = page.getByTestId('products-category-all');
    this.productListTitle = page.getByTestId('product-list-title');
    this.searchInput = page.getByTestId('product-search');
    this.clearSearchButton = page.getByTestId('clear-search');
    this.sortSelect = page.getByTestId('product-sort');
    this.productList = page.getByTestId('product-list');
    this.productItems = page.getByTestId('product-item');
  }

  async goto() {
    await this.page.goto(ProductsPage.URL);
  }

  getCategoryButton(category: string) {
    return this.page.getByTestId(`products-category-${category.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-')}`);
  }

  getProductByName(name: string) {
    return this.productItems.filter({ has: this.page.getByTestId('product-name').getByText(name, { exact: true }) });
  }

  getProductAddButton(productLocator: Locator) {
    return productLocator.getByTestId('product-add-button');
  }

  getProductQuantityDisplay(productLocator: Locator) {
    return productLocator.getByTestId('product-quantity-value');
  }

  getProductIncreaseButton(productLocator: Locator) {
    return productLocator.getByTestId('product-increase-quantity');
  }

  getProductDecreaseButton(productLocator: Locator) {
    return productLocator.getByTestId('product-decrease-quantity');
  }

  getProductRemoveButton(productLocator: Locator) {
    return productLocator.getByTestId('product-remove-button');
  }

  getProductInCartDisplay(productLocator: Locator) {
    return productLocator.getByTestId('product-card-cart-quantity');
  }

  async searchProducts(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

  async clearSearch() {
    await this.clearSearchButton.click();
  }

  async selectCategory(category: string) {
    await this.getCategoryButton(category).click();
  }

  async sortBy(option: 'Name (A-Z)' | 'Name (Z-A)' | 'Price (Low to High)' | 'Price (High to Low)') {
    await this.sortSelect.selectOption(option);
  }

  async addProductToCart(productName: string) {
    const product = this.getProductByName(productName);
    await this.getProductAddButton(product).click();
  }

  async clickProduct(productName: string) {
    const product = this.getProductByName(productName);
    await product.click();
  }
}
