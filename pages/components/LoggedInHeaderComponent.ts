import { expect, type Locator, type Page } from '@playwright/test';

export class LoggedInHeaderComponent {
  readonly page: Page;
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly sendEmailLink: Locator;
  readonly qrCodeLink: Locator;
  readonly llmLink: Locator;
  readonly trafficMonitorLink: Locator;
  readonly cartLink: Locator;
  readonly userProfileLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeLink = page.getByTestId('nav-home-link');
    this.productsLink = page.getByTestId('nav-products-link');
    this.sendEmailLink = page.getByTestId('nav-email-link');
    this.qrCodeLink = page.getByTestId('nav-qr-link');
    this.llmLink = page.getByTestId('nav-llm-link');
    this.trafficMonitorLink = page.getByTestId('nav-traffic-link');
    this.cartLink = page.getByTestId('cart-link');
    this.userProfileLink = page.getByTestId('username-profile-link');
    this.logoutButton = page.getByTestId('logout-button');
  }

  async expectLogoutButtonVisible() {
    await expect(this.logoutButton).toBeVisible();
  }

  async clickLogoutButton() {
    await this.logoutButton.click();
  }

  async clickUserProfileLink() {
    await this.userProfileLink.click();
  }

  async clickHomeLink() {
    await this.homeLink.click();
  }

  async clickProductsLink() {
    await this.productsLink.click();
  }

  async clickSendEmailLink() {
    await this.sendEmailLink.click();
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
}

