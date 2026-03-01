import { expect, type Locator, type Page } from '@playwright/test';
import { ToastComponent } from '../components/toast.component';
import {
  buildAddedToCartMessage,
  buildCartUpdatedMessage,
  buildInCartText,
  PRODUCTS_UI_TEXT,
} from '../constants/products.ui.constants';
import { getCartCount } from '../utils/cart.util';

export class ProductDetailsPage {
  readonly page: Page;
  readonly container: Locator;
  readonly backToProductsLink: Locator;
  readonly title: Locator;
  readonly price: Locator;
  readonly description: Locator;
  readonly category: Locator;
  readonly stock: Locator;
  readonly quantityValue: Locator;
  readonly decreaseQuantityButton: Locator;
  readonly increaseQuantityButton: Locator;
  readonly addToCartButton: Locator;
  readonly removeFromCartButton: Locator;
  readonly productAvailabilitySection: Locator;
  readonly productCartQuantity: Locator;
  readonly cartItemCount: Locator;
  readonly toast: ToastComponent;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId('product-details-page');
    this.backToProductsLink = page.getByTestId('product-back-link');
    this.title = page.getByTestId('product-title');
    this.price = page.getByTestId('product-price');
    this.description = page.getByTestId('product-description');
    this.category = page.getByTestId('product-category');
    this.stock = page.getByTestId('product-stock');
    this.quantityValue = page.getByTestId('quantity-value');
    this.decreaseQuantityButton = page.getByTestId('decrease-quantity');
    this.increaseQuantityButton = page.getByTestId('increase-quantity');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.removeFromCartButton = page.getByTestId('remove-from-cart');
    this.productAvailabilitySection = page.getByTestId('product-availability-section');
    this.productCartQuantity = page.getByTestId('product-cart-quantity');
    this.cartItemCount = page.getByTestId('cart-item-count');
    this.toast = new ToastComponent(page);
  }

  async getTitleText(): Promise<string> {
    return (await this.title.innerText()).trim();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async goBackToProducts(): Promise<void> {
    await this.backToProductsLink.click();
  }

  async setQuantity(target: number): Promise<void> {
    let current = Number.parseInt((await this.quantityValue.innerText()).trim(), 10);

    while (current < target) {
      await this.increaseQuantityButton.click();
      current += 1;
    }

    while (current > target) {
      await this.decreaseQuantityButton.click();
      current -= 1;
    }
  }

  async getCartCount(): Promise<number> {
    return getCartCount(this.cartItemCount);
  }

  async expectAddedToCartToast(productName: string, quantity: number): Promise<void> {
    await this.toast.expectTitle(PRODUCTS_UI_TEXT.addedToCartTitle);
    await this.toast.expectMessage(buildAddedToCartMessage(quantity, productName));
  }

  async expectCartUpdatedToast(productName: string, quantity: number): Promise<void> {
    await this.toast.expectTitle(PRODUCTS_UI_TEXT.cartUpdatedTitle);
    await this.toast.expectMessage(buildCartUpdatedMessage(productName, quantity));
  }

  async expectCartCount(count: number): Promise<void> {
    await expect(this.cartItemCount).toHaveText(String(count));
  }

  async expectInCartQuantity(quantity: number): Promise<void> {
    await expect(this.productCartQuantity).toHaveText(buildInCartText(quantity));
  }

  async expectUpdateMode(): Promise<void> {
    await expect(this.removeFromCartButton).toBeVisible();
    await expect(this.addToCartButton).toHaveText(PRODUCTS_UI_TEXT.updateCartButtonLabel);
  }
}
