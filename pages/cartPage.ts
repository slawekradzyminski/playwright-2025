import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './basePage';
import { LoggedInHeaderComponent } from './components/loggedInHeaderComponent';

export interface ExpectedCartItem {
  productId: number;
  name: string;
  unitPrice: string;
  quantity: number;
  totalPrice: string;
}

export class CartPage extends BasePage {
  static readonly url = '/cart';

  readonly header: LoggedInHeaderComponent;

  private readonly title: Locator;
  private readonly emptyCartMessage: Locator;
  private readonly browseProductsLink: Locator;
  private readonly summary: Locator;
  private readonly summaryItemsCount: Locator;
  private readonly summaryTotalPrice: Locator;
  private readonly checkoutButton: Locator;
  private readonly clearButton: Locator;
  private readonly cartItems: Locator;
  private readonly errorMessage: Locator;
  private readonly retryButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new LoggedInHeaderComponent(page);
    this.title = page.getByTestId('cart-title');
    this.emptyCartMessage = page.getByTestId('cart-empty');
    this.browseProductsLink = page.getByTestId('cart-browse-products');
    this.summary = page.getByTestId('cart-summary');
    this.summaryItemsCount = page.getByTestId('cart-summary-items-count');
    this.summaryTotalPrice = page.getByTestId('cart-summary-total-price');
    this.checkoutButton = page.getByTestId('cart-checkout-button');
    this.clearButton = page.getByTestId('cart-clear-button');
    this.cartItems = page.getByTestId(/^cart-item-\d+$/);
    this.errorMessage = page.getByTestId('cart-error');
    this.retryButton = page.getByTestId('cart-retry');
  }

  async open(): Promise<void> {
    await this.page.goto(CartPage.url);
  }

  async increaseItemQuantity(productId: number): Promise<void> {
    await this.page.getByTestId(`cart-item-increase-${productId}`).click();
  }

  async updateItemQuantity(productId: number): Promise<void> {
    await this.page.getByTestId(`cart-item-update-${productId}`).click();
  }

  async removeItem(productId: number): Promise<void> {
    await this.page.getByTestId(`cart-item-remove-${productId}`).click();
  }

  async clearCart(): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.clearButton.click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async retryLoadingCart(): Promise<void> {
    await this.retryButton.click();
  }

  async assertThatEmptyCartIsVisible(): Promise<void> {
    await expect(this.title).toHaveText('Your Cart');
    await expect(this.emptyCartMessage).toContainText('Your cart is empty');
    await expect(this.browseProductsLink).toHaveText('Browse Products');
    await expect(this.cartItems).toHaveCount(0);
  }

  async assertThatCartItemIsVisible(expectedItem: ExpectedCartItem): Promise<void> {
    await expect(this.title).toHaveText('Your Cart');
    await expect(this.summary).toBeVisible();
    await expect(this.summaryItemsCount).toHaveText(String(expectedItem.quantity));
    await expect(this.summaryTotalPrice).toHaveText(expectedItem.totalPrice);
    await expect(this.checkoutButton).toBeEnabled();
    await expect(this.clearButton).toBeEnabled();

    await expect(this.page.getByTestId(`cart-item-name-${expectedItem.productId}`)).toHaveText(expectedItem.name);
    await expect(this.page.getByTestId(`cart-item-price-${expectedItem.productId}`)).toHaveText(expectedItem.unitPrice);
    await expect(this.page.getByTestId(`cart-item-quantity-${expectedItem.productId}`)).toHaveText(
      String(expectedItem.quantity)
    );
    await expect(this.page.getByTestId(`cart-item-total-${expectedItem.productId}`)).toHaveText(
      expectedItem.totalPrice
    );
    await expect(this.page.getByTestId(`cart-item-remove-${expectedItem.productId}`)).toHaveText('Remove');
  }

  async assertThatPendingQuantityIs(productId: number, quantity: number): Promise<void> {
    await expect(this.page.getByTestId(`cart-item-quantity-${productId}`)).toHaveText(String(quantity));
    await expect(this.page.getByTestId(`cart-item-update-${productId}`)).toHaveText('Update');
  }

  async assertThatErrorStateIsVisible(): Promise<void> {
    await expect(this.errorMessage).toContainText('Error loading cart');
    await expect(this.retryButton).toHaveText('Try again');
  }
}
