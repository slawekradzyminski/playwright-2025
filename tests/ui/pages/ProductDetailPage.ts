import { type Page, type Locator, expect } from '@playwright/test';

const APP_BASE_URL = process.env.APP_BASE_URL || '';

export class ProductDetailPage {
  readonly page: Page;

  readonly pageContainer: Locator;
  readonly backLink: Locator;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly productCategory: Locator;
  readonly productStock: Locator;
  readonly decreaseQuantity: Locator;
  readonly increaseQuantity: Locator;
  readonly quantityValue: Locator;
  readonly addToCartButton: Locator;
  readonly removeFromCartButton: Locator;
  readonly updateCartButton: Locator;
  readonly cartItemCount: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageContainer = page.getByTestId('product-details-page');
    this.backLink = page.getByTestId('product-back-link');
    this.productName = page.getByTestId('product-title');
    this.productPrice = page.getByTestId('product-price');
    this.productDescription = page.getByTestId('product-description');
    this.productCategory = page.getByTestId('product-category');
    this.productStock = page.getByTestId('product-stock');
    this.decreaseQuantity = page.getByTestId('decrease-quantity');
    this.increaseQuantity = page.getByTestId('increase-quantity');
    this.quantityValue = page.getByTestId('quantity-value');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.removeFromCartButton = page.getByRole('button', { name: 'Remove from Cart' });
    this.updateCartButton = page.getByRole('button', { name: 'Update Cart' });
    this.cartItemCount = page.getByTestId('cart-item-count');
  }

  async goto(productId: number): Promise<void> {
    await this.page.goto(`${APP_BASE_URL}/products/${productId}`);
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.pageContainer).toBeVisible();
  }

  async expectInCartLabel(quantity: number): Promise<void> {
    await expect(this.page.getByText(`${quantity} in cart`)).toBeVisible();
  }
}
