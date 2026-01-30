import { expect, type Locator, type Page } from '@playwright/test';

export class ProductDetailsPage {
  readonly page: Page;
  readonly productTitle: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly productCategory: Locator;
  readonly stockStatus: Locator;
  readonly cartActionButton: Locator;
  readonly removeFromCartButton: Locator;
  readonly quantityControls: Locator;
  readonly quantityValue: Locator;
  readonly increaseQuantityButton: Locator;
  readonly decreaseQuantityButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productTitle = this.withTestId('product-details-title', page.getByRole('heading', { level: 1 }));
    this.productDescription = this.withTestId(
      'product-description',
      page.getByRole('heading', { name: 'Description' }).locator('..').locator('p')
    );
    this.productPrice = this.withTestId('product-price', page.getByText(/\$\d/));
    this.productCategory = this.withTestId(
      'product-category',
      page.getByRole('heading', { name: 'Category' }).locator('..').locator('p')
    );
    this.stockStatus = this.withTestId(
      'product-stock',
      page.getByRole('heading', { name: 'Availability' }).locator('..').getByText(/stock/i)
    );
    this.cartActionButton = this.withTestId(
      'product-cart-action',
      page.getByRole('button', { name: /add to cart|update cart/i })
    );
    this.removeFromCartButton = this.withTestId(
      'product-remove-from-cart',
      page.getByRole('button', { name: /remove from cart/i })
    );
    this.quantityControls = this.withTestId(
      'product-quantity-controls',
      page.getByRole('button', { name: '-' }).locator('..')
    );
    this.quantityValue = this.withTestId('product-quantity', this.quantityControls.getByText(/^\d+$/));
    this.increaseQuantityButton = this.withTestId(
      'product-quantity-increase',
      this.quantityControls.getByRole('button', { name: '+' })
    );
    this.decreaseQuantityButton = this.withTestId(
      'product-quantity-decrease',
      this.quantityControls.getByRole('button', { name: '-' })
    );
  }

  async goto(productId: number | string) {
    await this.page.goto(`${process.env.FRONTEND_URL}/products/${productId}`);
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  }

  async expectToBeOnProductDetailsPage() {
    const baseUrl = (process.env.FRONTEND_URL ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await expect(this.page).toHaveURL(new RegExp(`${baseUrl}/products/\\d+`));
  }

  async expectProductDetailsVisible() {
    await expect(this.productTitle).toBeVisible();
    await expect(this.productPrice).toBeVisible();
    await expect(this.productDescription).toBeVisible();
    await expect(this.productCategory).toBeVisible();
    await expect(this.stockStatus).toBeVisible();
    await expect(this.cartActionButton).toBeVisible();
  }

  async expectQuantityValue(expected: number) {
    await expect(this.quantityValue).toHaveText(String(expected));
  }

  async readQuantityValue() {
    const valueText = (await this.quantityValue.textContent()) ?? '0';
    return Number.parseInt(valueText.trim(), 10);
  }

  async increaseQuantity() {
    await this.increaseQuantityButton.click();
  }

  async decreaseQuantity() {
    await this.decreaseQuantityButton.click();
  }

  async updateCart() {
    await this.cartActionButton.click();
  }

  async removeFromCart() {
    await this.removeFromCartButton.click();
  }

  private withTestId(testId: string, fallback: Locator) {
    return this.page.getByTestId(testId).or(fallback);
  }
}
