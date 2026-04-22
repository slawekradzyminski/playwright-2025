import { expect, type Locator, type Page } from '@playwright/test';
import type { AddressDto } from '../types/order';
import { BasePage } from './basePage';
import { LoggedInHeaderComponent } from './components/loggedInHeaderComponent';

export interface ExpectedCheckoutItem {
  productId: number;
  name: string;
  unitPrice: string;
  quantity: number;
  totalPrice: string;
}

export class CheckoutPage extends BasePage {
  static readonly url = '/checkout';

  readonly header: LoggedInHeaderComponent;

  private readonly title: Locator;
  private readonly streetInput: Locator;
  private readonly cityInput: Locator;
  private readonly stateInput: Locator;
  private readonly zipInput: Locator;
  private readonly countryInput: Locator;
  private readonly submitButton: Locator;
  private readonly itemsValue: Locator;
  private readonly totalValue: Locator;
  private readonly orderTotalAmount: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new LoggedInHeaderComponent(page);
    this.title = page.getByTestId('checkout-title');
    this.streetInput = page.getByTestId('checkout-street-input');
    this.cityInput = page.getByTestId('checkout-city-input');
    this.stateInput = page.getByTestId('checkout-state-input');
    this.zipInput = page.getByTestId('checkout-zip-input');
    this.countryInput = page.getByTestId('checkout-country-input');
    this.submitButton = page.getByTestId('checkout-submit-button');
    this.itemsValue = page.getByTestId('checkout-items-value');
    this.totalValue = page.getByTestId('checkout-total-value');
    this.orderTotalAmount = page.getByTestId('checkout-total-amount');
  }

  async open(): Promise<void> {
    await this.page.goto(CheckoutPage.url);
  }

  async submitEmptyForm(): Promise<void> {
    await this.submitButton.click();
  }

  async placeOrder(shippingAddress: AddressDto): Promise<void> {
    await this.streetInput.fill(shippingAddress.street);
    await this.cityInput.fill(shippingAddress.city);
    await this.stateInput.fill(shippingAddress.state);
    await this.zipInput.fill(shippingAddress.zipCode);
    await this.countryInput.fill(shippingAddress.country);
    await this.submitButton.click();
  }

  async assertThatCheckoutIsVisible(expectedItem: ExpectedCheckoutItem): Promise<void> {
    await expect(this.title).toHaveText('Checkout');
    await expect(this.streetInput).toBeVisible();
    await expect(this.cityInput).toBeVisible();
    await expect(this.stateInput).toBeVisible();
    await expect(this.zipInput).toBeVisible();
    await expect(this.countryInput).toBeVisible();
    await expect(this.submitButton).toHaveText('Place Order');
    await expect(this.itemsValue).toHaveText(String(expectedItem.quantity));
    await expect(this.totalValue).toHaveText(expectedItem.totalPrice);
    await expect(this.orderTotalAmount).toHaveText(expectedItem.totalPrice);
    await expect(this.page.getByTestId(`checkout-item-name-${expectedItem.productId}`)).toHaveText(expectedItem.name);
    await expect(this.page.getByTestId(`checkout-item-price-${expectedItem.productId}`)).toHaveText(
      expectedItem.unitPrice
    );
    await expect(this.page.getByTestId(`checkout-item-quantity-${expectedItem.productId}`)).toHaveText(
      String(expectedItem.quantity)
    );
    await expect(this.page.getByTestId(`checkout-item-total-${expectedItem.productId}`)).toHaveText(
      expectedItem.totalPrice
    );
  }

  async assertThatRequiredValidationMessagesAreVisible(): Promise<void> {
    await expect(this.page.getByTestId('checkout-street-error')).toHaveText('Street address is required');
    await expect(this.page.getByTestId('checkout-city-error')).toHaveText('City is required');
    await expect(this.page.getByTestId('checkout-state-error')).toHaveText('State is required');
    await expect(this.page.getByTestId('checkout-zip-error')).toHaveText('ZIP code is required');
    await expect(this.page.getByTestId('checkout-country-error')).toHaveText('Country is required');
  }
}
