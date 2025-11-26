import type { Page, Locator } from '@playwright/test';
import { FRONTEND_URL } from '../config/constants';
import { Toast } from './components/Toast';
import { LoggedInHeader } from './components/LoggedInHeader';

export class ProductDetailsPage {
  readonly page: Page;
  readonly toast: Toast;
  readonly header: LoggedInHeader;
  readonly productDetailsPage: Locator;
  readonly backToProductsLink: Locator;
  readonly productImage: Locator;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly descriptionSection: Locator;
  readonly descriptionTitle: Locator;
  readonly productDescription: Locator;
  readonly categorySection: Locator;
  readonly categoryTitle: Locator;
  readonly productCategory: Locator;
  readonly availabilitySection: Locator;
  readonly availabilityTitle: Locator;
  readonly productStock: Locator;
  readonly quantitySection: Locator;
  readonly quantityTitle: Locator;
  readonly quantityControls: Locator;
  readonly quantityValue: Locator;
  readonly decreaseQuantityButton: Locator;
  readonly increaseQuantityButton: Locator;
  readonly addToCartButton: Locator;

  static readonly URL = `${FRONTEND_URL}/products`;

  static getProductUrl(productId: number): string {
    return `${FRONTEND_URL}/products/${productId}`;
  }

  constructor(page: Page) {
    this.page = page;
    this.toast = new Toast(page);
    this.header = new LoggedInHeader(page);
    this.productDetailsPage = page.getByTestId('product-details-page');
    this.backToProductsLink = page.getByTestId('product-back-link');
    this.productImage = page.getByTestId('product-image');
    this.productName = page.getByTestId('product-title');
    this.productPrice = page.getByTestId('product-price');
    this.descriptionSection = page.getByTestId('product-description-section');
    this.descriptionTitle = page.getByTestId('product-description-title');
    this.productDescription = page.getByTestId('product-description');
    this.categorySection = page.getByTestId('product-category-section');
    this.categoryTitle = page.getByTestId('product-category-title');
    this.productCategory = page.getByTestId('product-category');
    this.availabilitySection = page.getByTestId('product-availability-section');
    this.availabilityTitle = page.getByTestId('product-availability-title');
    this.productStock = page.getByTestId('product-stock');
    this.quantitySection = page.getByTestId('product-quantity-section');
    this.quantityTitle = page.getByTestId('product-quantity-title');
    this.quantityControls = page.getByTestId('product-quantity-controls');
    this.quantityValue = page.getByTestId('quantity-value');
    this.decreaseQuantityButton = page.getByTestId('decrease-quantity');
    this.increaseQuantityButton = page.getByTestId('increase-quantity');
    this.addToCartButton = page.getByTestId('add-to-cart');
  }

  async goto(productId: number) {
    await this.page.goto(ProductDetailsPage.getProductUrl(productId));
  }

  async increaseQuantity(times = 1) {
    for (let i = 0; i < times; i++) {
      await this.increaseQuantityButton.click();
    }
  }

  async decreaseQuantity(times = 1) {
    for (let i = 0; i < times; i++) {
      await this.decreaseQuantityButton.click();
    }
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async navigateBackToProducts() {
    await this.backToProductsLink.click();
  }
}
