import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class LoggedInHeaderComponent extends BasePage {
  readonly page: Page;
  readonly navigation: Locator;
  readonly brandLink: Locator;
  readonly productsLink: Locator;
  readonly emailLink: Locator;
  readonly qrCodeLink: Locator;
  readonly llmLink: Locator;
  readonly trafficMonitorLink: Locator;
  readonly cartLink: Locator;
  readonly profileLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.navigation = page.getByTestId('navigation');
    this.brandLink = page.getByTestId('brand-link');
    this.productsLink = page.getByTestId('desktop-menu-products');
    this.emailLink = page.getByTestId('desktop-menu-send-email');
    this.qrCodeLink = page.getByTestId('desktop-menu-qr-code');
    this.llmLink = page.getByTestId('desktop-menu-llm');
    this.trafficMonitorLink = page.getByTestId('desktop-menu-traffic-monitor');
    this.cartLink = page.getByTestId('desktop-cart-icon');
    this.profileLink = page.getByTestId('username-profile-link');
    this.logoutButton = page.getByTestId('logout-button');
  }

  async clickBrandLink() {
    await this.brandLink.click();
  }

  async clickProductsLink() {
    await this.productsLink.click();
  }

  async clickEmailLink() {
    await this.emailLink.click();
  }

  async clickQrCodeLink() {
    await this.qrCodeLink.click();
  }

  async clickLlmLink() {
    await this.llmLink.click();
  }

  async clickTrafficMonitorLink() {
    await this.trafficMonitorLink.click();
  }

  async clickCartLink() {
    await this.cartLink.click();
  }

  async clickProfileLink() {
    await this.profileLink.click();
  }

  async clickLogoutButton() {
    await this.logoutButton.click();
  }
}
