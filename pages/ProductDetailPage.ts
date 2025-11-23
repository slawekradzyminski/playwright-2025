import { expect, type Locator, type Page } from '@playwright/test';
import { UI_BASE_URL } from '../config/constants';
import { LoggedInHeaderComponent } from './components/LoggedInHeader';

export class ProductDetailPage {
  readonly page: Page;
  readonly header: LoggedInHeaderComponent;
  readonly backToProductsLink: Locator;
  readonly productImage: Locator;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly productCategory: Locator;
  readonly productStock: Locator;
  readonly increaseQuantityButton: Locator;
  readonly decreaseQuantityButton: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new LoggedInHeaderComponent(page);
    this.backToProductsLink = page.getByTestId('product-back-link');
    this.productImage = page.locator('main img');
    this.productName = page.locator('main h1');
    this.productPrice = page.locator('main').locator('p').first();
    this.productDescription = page.locator('h2:has-text("Description")').locator('..').locator('p');
    this.productCategory = page.locator('h2:has-text("Category")').locator('..').locator('p');
    this.productStock = page.locator('h2:has-text("Availability")').locator('..').locator('p');
    this.increaseQuantityButton = page.getByTestId('product-increase-quantity');
    this.decreaseQuantityButton = page.getByTestId('product-decrease-quantity');
    this.addToCartButton = page.getByTestId('product-add-button');
  }

  async expectToBeOnProductDetailPage(productId?: string) {
    if (productId) {
      await expect(this.page).toHaveURL(`${UI_BASE_URL}/products/${productId}`);
    } else {
      await expect(this.page).toHaveURL(new RegExp(`${UI_BASE_URL}/products/\\d+`));
    }
  }

  async expectProductName(name: string) {
    await expect(this.productName).toHaveText(name);
  }

  async expectProductDetailsVisible() {
    await expect(this.productName).toBeVisible();
    await expect(this.productPrice).toBeVisible();
    await expect(this.productDescription).toBeVisible();
    await expect(this.productCategory).toBeVisible();
    await expect(this.productStock).toBeVisible();
  }

  async clickBackToProducts() {
    await this.backToProductsLink.click();
  }
}
