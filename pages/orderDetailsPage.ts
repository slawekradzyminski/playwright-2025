import { expect, type Locator, type Page } from '@playwright/test';
import { formatMoney } from '../helpers/productHelpers';
import type { AddressDto, OrderDto, OrderStatus } from '../types/order';
import { BasePage } from './basePage';
import { LoggedInHeaderComponent } from './components/loggedInHeaderComponent';

export class OrderDetailsPage extends BasePage {
  static readonly urlPattern = /\/orders\/\d+$/;

  readonly header: LoggedInHeaderComponent;

  private readonly pageContainer: Locator;
  private readonly details: Locator;
  private readonly title: Locator;
  private readonly status: Locator;
  private readonly totalAmount: Locator;
  private readonly shippingAddress: Locator;
  private readonly notFoundMessage: Locator;
  private readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new LoggedInHeaderComponent(page);
    this.pageContainer = page.getByTestId('order-details-page-container');
    this.details = page.getByTestId('order-details');
    this.title = page.getByTestId('order-details-title');
    this.status = page.getByTestId('order-details-status');
    this.totalAmount = page.getByTestId('order-details-total-amount');
    this.shippingAddress = page.getByTestId('order-details-shipping-address');
    this.notFoundMessage = page.getByTestId('order-details-not-found');
    this.cancelButton = page.getByTestId('order-details-cancel-button');
  }

  async open(orderId: number): Promise<void> {
    await this.page.goto(`/orders/${orderId}`);
  }

  async cancelOrder(): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.cancelButton.click();
  }

  async assertThatOrderIsVisible(order: OrderDto): Promise<void> {
    await expect(this.pageContainer).toBeVisible();
    await expect(this.details).toBeVisible();
    await expect(this.title).toHaveText(`Order #${order.id}`);
    await expect(this.status).toHaveText(order.status);
    await expect(this.totalAmount).toHaveText(formatMoney(order.totalAmount));
    await this.assertThatShippingAddressIsVisible(order.shippingAddress);

    for (const item of order.items) {
      await expect(this.page.getByTestId(`order-item-name-${item.id}`)).toHaveText(item.productName);
      await expect(this.page.getByTestId(`order-item-price-details-${item.id}`)).toHaveText(
        `${formatMoney(item.unitPrice)} x ${item.quantity}`
      );
      await expect(this.page.getByTestId(`order-item-total-${item.id}`)).toHaveText(formatMoney(item.totalPrice));
    }
  }

  async assertThatStatusIs(status: OrderStatus): Promise<void> {
    await expect(this.status).toHaveText(status);
  }

  async assertThatCancelButtonIsHidden(): Promise<void> {
    await expect(this.cancelButton).toBeHidden();
  }

  async assertThatNotFoundIsVisible(): Promise<void> {
    await expect(this.notFoundMessage).toHaveText('Order not found', { timeout: 15_000 });
  }

  private async assertThatShippingAddressIsVisible(shippingAddress: AddressDto): Promise<void> {
    await expect(this.shippingAddress).toContainText(shippingAddress.street);
    await expect(this.shippingAddress).toContainText(
      `${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}`
    );
    await expect(this.shippingAddress).toContainText(shippingAddress.country);
  }
}
