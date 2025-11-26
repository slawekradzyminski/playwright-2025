import type { Page, Locator } from '@playwright/test';
import { FRONTEND_URL } from '../config/constants';
import { LoggedInHeader } from './components/LoggedInHeader';

export class CartPage {
  readonly page: Page;
  readonly header: LoggedInHeader;
  readonly cartPage: Locator;
  readonly pageTitle: Locator;
  readonly cartItemsList: Locator;
  readonly cartEmpty: Locator;
  readonly cartSummaryItemsCount: Locator;
  readonly cartSummaryTotalPrice: Locator;
  readonly checkoutButton: Locator;
  readonly clearCartButton: Locator;
  readonly continueShoppingLink: Locator;
  readonly browseProductsLink: Locator;

  static readonly URL = `${FRONTEND_URL}/cart`;

  constructor(page: Page) {
    this.page = page;
    this.header = new LoggedInHeader(page);
    this.cartPage = page.getByTestId('cart-page');
    this.pageTitle = page.getByTestId('cart-title');
    this.cartItemsList = page.getByTestId('cart-items-list');
    this.cartEmpty = page.getByTestId('cart-empty');
    this.cartSummaryItemsCount = page.getByTestId('cart-summary-items-count');
    this.cartSummaryTotalPrice = page.getByTestId('cart-summary-total-price');
    this.checkoutButton = page.getByTestId('cart-checkout-button');
    this.clearCartButton = page.getByTestId('cart-clear-button');
    this.continueShoppingLink = page.getByTestId('cart-continue-shopping');
    this.browseProductsLink = page.getByTestId('cart-browse-products');
  }

  async goto() {
    await this.page.goto(CartPage.URL);
  }

  getCartItemRow(productId: number) {
    return this.page.getByTestId(`cart-item-${productId}`);
  }

  getCartItemName(productId: number) {
    return this.page.getByTestId(`cart-item-name-${productId}`);
  }

  getCartItemPrice(productId: number) {
    return this.page.getByTestId(`cart-item-price-${productId}`);
  }

  getCartItemQuantity(productId: number) {
    return this.page.getByTestId(`cart-item-quantity-${productId}`);
  }

  getCartItemIncreaseButton(productId: number) {
    return this.page.getByTestId(`cart-item-increase-${productId}`);
  }

  getCartItemDecreaseButton(productId: number) {
    return this.page.getByTestId(`cart-item-decrease-${productId}`);
  }

  getCartItemRemoveButton(productId: number) {
    return this.page.getByTestId(`cart-item-remove-${productId}`);
  }

  getCartItemTotal(productId: number) {
    return this.page.getByTestId(`cart-item-total-${productId}`);
  }

  async increaseQuantity(productId: number) {
    await this.getCartItemIncreaseButton(productId).click();
  }

  async decreaseQuantity(productId: number) {
    await this.getCartItemDecreaseButton(productId).click();
  }

  async removeItem(productId: number) {
    await this.getCartItemRemoveButton(productId).click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async clearCart() {
    await this.clearCartButton.click();
  }

  getCartItemRows() {
    return this.cartItemsList.locator('tr');
  }
}
