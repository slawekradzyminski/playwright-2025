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
    this.productImage = page.getByTestId('product-image');
    this.productName = page.getByTestId('product-title');
    this.productPrice = page.getByTestId('product-price');
    this.productDescription = page.getByTestId('product-description');
    this.productCategory = page.getByTestId('product-category');
    this.productStock = page.getByTestId('product-stock');
    this.increaseQuantityButton = page.getByTestId('increase-quantity');
    this.decreaseQuantityButton = page.getByTestId('decrease-quantity');
    this.addToCartButton = page.getByTestId('add-to-cart');
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
