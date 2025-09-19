import { expect, Locator, type Page } from '@playwright/test';
import { FRONTEND_URL } from '../config/constants';
import { LoggedInPage } from './loggedInPage';

export class ProductsPage extends LoggedInPage {
  readonly productsHeading: Locator;
  readonly productCards: Locator;
  readonly addToCartButtons: Locator;
  readonly removeFromCartButtons: Locator;
  readonly updateCartButtons: Locator;
  readonly inCartTexts: Locator;
  readonly quantityControls: Locator;
  readonly toastNotification: Locator;
  readonly toastMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.productsHeading = page.getByTestId('products-title');
    this.productCards = page.getByTestId('product-item');
    this.addToCartButtons = page.getByTestId('product-add-button');
    this.removeFromCartButtons = page.getByTestId('product-remove-button');
    this.updateCartButtons = page.getByTestId('product-add-button').filter({ hasText: 'Update Cart' });
    this.inCartTexts = page.getByTestId('product-card-cart-quantity');
    this.quantityControls = page.getByTestId('product-quantity-controls');
    this.toastNotification = page.getByTestId('toast-title');
    this.toastMessage = page.getByTestId('toast-description');
  }

  async goto() {
    await this.page.goto(`${FRONTEND_URL}/products`);
  }

  async addProductToCart(productIndex: number = 0) {
    await this.addToCartButtons.nth(productIndex).click();
  }

  async getProductByName(productName: string) {
    return this.productCards.filter({ has: this.page.getByTestId('product-name').filter({ hasText: productName }) });
  }

  async addProductToCartByName(productName: string) {
    const productCard = await this.getProductByName(productName);
    await productCard.getByTestId('product-add-button').click();
  }

  async expectProductInCart(productName: string) {
    const productCard = await this.getProductByName(productName);
    await expect(productCard.getByTestId('product-card-cart-quantity')).toBeVisible();
    await expect(productCard.getByTestId('product-remove-button')).toBeVisible();
    await expect(productCard.getByTestId('product-add-button').filter({ hasText: 'Update Cart' })).toBeVisible();
  }

  async expectToastMessage(message: string) {
    await expect(this.toastNotification).toBeVisible();
    await expect(this.toastMessage).toContainText(message);
  }

}
