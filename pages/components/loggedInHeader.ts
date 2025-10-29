import { expect, type Locator, type Page } from '@playwright/test';

export class LoggedInHeader {
  readonly page: Page;
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly sendEmailLink: Locator;
  readonly qrCodeLink: Locator;
  readonly llmLink: Locator;
  readonly trafficMonitorLink: Locator;
  readonly adminLink: Locator;
  readonly cartIcon: Locator;
  readonly userProfileLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeLink = page.getByTestId('desktop-menu-home');
    this.productsLink = page.getByTestId('desktop-menu-products');
    this.sendEmailLink = page.getByTestId('desktop-menu-send-email');
    this.qrCodeLink = page.getByTestId('desktop-menu-qr-code');
    this.llmLink = page.getByTestId('desktop-menu-llm');
    this.trafficMonitorLink = page.getByTestId('desktop-menu-traffic-monitor');
    this.adminLink = page.getByTestId('desktop-menu-admin');
    this.cartIcon = page.getByTestId('desktop-cart-icon');
    this.userProfileLink = page.getByTestId('username-profile-link');
    this.logoutButton = page.getByTestId('logout-button');
  }

  async clickHome() {
    await this.homeLink.click();
  }

  async clickProducts() {
    await this.productsLink.click();
  }

  async clickSendEmail() {
    await this.sendEmailLink.click();
  }

  async clickQRCode() {
    await this.qrCodeLink.click();
  }

  async clickLLM() {
    await this.llmLink.click();
  }

  async clickTrafficMonitor() {
    await this.trafficMonitorLink.click();
  }

  async clickAdmin() {
    await this.adminLink.click();
  }

  async expectAdminLinkHidden() {
    await expect(this.adminLink).toHaveCount(0);
  }

  async clickCart() {
    await this.cartIcon.click();
  }

  async clickUserProfile() {
    await this.userProfileLink.click();
  }

  async clickLogout() {
    await this.logoutButton.click();
  }

  async expectUserProfileName(name: string) {
    await expect(this.userProfileLink).toHaveText(name);
  }
}
