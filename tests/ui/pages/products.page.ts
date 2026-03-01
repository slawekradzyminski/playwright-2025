import { expect, type Locator, type Page } from '@playwright/test';
import { ToastComponent } from '../components/toast.component';
import { PRODUCTS_URL } from '../constants/ui.urls.constants';
import { buildInCartText } from '../constants/products.ui.constants';
import { getCartCount } from '../utils/cart.util';

export class ProductsPage {
  readonly page: Page;
  readonly container: Locator;
  readonly title: Locator;
  readonly categoriesTitle: Locator;
  readonly allProductsCategoryButton: Locator;
  readonly homeKitchenCategoryButton: Locator;
  readonly productListTitle: Locator;
  readonly productSearchInput: Locator;
  readonly productSortSelect: Locator;
  readonly productItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly productCategories: Locator;
  readonly productQuantityValues: Locator;
  readonly productIncreaseQuantityButtons: Locator;
  readonly productDecreaseQuantityButtons: Locator;
  readonly productAddButtons: Locator;
  readonly productCardCartQuantities: Locator;
  readonly cartItemCount: Locator;
  readonly toast: ToastComponent;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId('products-page');
    this.title = page.getByTestId('products-title');
    this.categoriesTitle = page.getByTestId('products-categories-title');
    this.allProductsCategoryButton = page.getByTestId('products-category-all');
    this.homeKitchenCategoryButton = page.getByTestId('products-category-home-&-kitchen');
    this.productListTitle = page.getByTestId('product-list-title');
    this.productSearchInput = page.getByTestId('product-search');
    this.productSortSelect = page.getByTestId('product-sort');
    this.productItems = page.getByTestId('product-item');
    this.productNames = page.getByTestId('product-name');
    this.productPrices = page.getByTestId('product-price');
    this.productCategories = page.getByTestId('product-category');
    this.productQuantityValues = page.getByTestId('product-quantity-value');
    this.productIncreaseQuantityButtons = page.getByTestId('product-increase-quantity');
    this.productDecreaseQuantityButtons = page.getByTestId('product-decrease-quantity');
    this.productAddButtons = page.getByTestId('product-add-button');
    this.productCardCartQuantities = page.getByTestId('product-card-cart-quantity');
    this.cartItemCount = page.getByTestId('cart-item-count');
    this.toast = new ToastComponent(page);
  }

  async goto(): Promise<void> {
    await this.page.goto(PRODUCTS_URL);
  }

  async search(term: string): Promise<void> {
    await this.productSearchInput.fill(term);
  }

  async selectAllProductsCategory(): Promise<void> {
    await this.allProductsCategoryButton.click();
  }

  async selectHomeKitchenCategory(): Promise<void> {
    await this.homeKitchenCategoryButton.click();
  }

  async openFirstProductCard(): Promise<void> {
    await this.productItems.first().click();
  }

  async setFirstProductQuantity(target: number): Promise<void> {
    const quantityLocator = this.productQuantityValues.first();
    let current = Number.parseInt((await quantityLocator.innerText()).trim(), 10);

    while (current < target) {
      await this.productIncreaseQuantityButtons.first().click();
      current += 1;
    }

    while (current > target) {
      await this.productDecreaseQuantityButtons.first().click();
      current -= 1;
    }
  }

  async addFirstProductToCart(): Promise<void> {
    await this.productAddButtons.first().click();
  }

  async getCartCount(): Promise<number> {
    return getCartCount(this.cartItemCount);
  }

  async expectCartCount(count: number): Promise<void> {
    await expect(this.cartItemCount).toHaveText(String(count));
  }

  async expectFirstProductInCartQuantity(quantity: number): Promise<void> {
    await expect(this.productCardCartQuantities.first()).toHaveText(buildInCartText(quantity));
  }

  async expectFirstProductActionLabel(label: string): Promise<void> {
    await expect(this.productAddButtons.first()).toHaveText(label);
  }
}
