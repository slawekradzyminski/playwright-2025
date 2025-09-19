import { expect, Locator, type Page } from '@playwright/test';

export class LoggedInHeader {
  readonly page: Page;
  readonly navigation: Locator;
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly sendEmailLink: Locator;
  readonly qrCodeLink: Locator;
  readonly llmLink: Locator;
  readonly trafficMonitorLink: Locator;
  readonly cartLink: Locator;
  readonly cartIcon: Locator;
  readonly profileLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigation = page.getByTestId('navigation');
    this.homeLink = page.getByTestId('desktop-menu-home');
    this.productsLink = page.getByTestId('desktop-menu-products');
    this.sendEmailLink = page.getByTestId('desktop-menu-send-email');
    this.qrCodeLink = page.getByTestId('desktop-menu-qr-code');
    this.llmLink = page.getByTestId('desktop-menu-llm');
    this.trafficMonitorLink = page.getByTestId('desktop-menu-traffic-monitor');
    this.cartLink = page.getByTestId('desktop-cart-icon');
    this.cartIcon = this.cartLink.locator('img');
    this.profileLink = page.getByTestId('username-profile-link');
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

  async clickQrCode() {
    await this.qrCodeLink.click();
  }

  async clickLlm() {
    await this.llmLink.click();
  }

  async clickTrafficMonitor() {
    await this.trafficMonitorLink.click();
  }

  async clickCart() {
    await this.cartLink.click();
  }

  async clickProfile() {
    await this.profileLink.click();
  }

  async clickLogout() {
    await this.logoutButton.click();
  }

  async expectToBeVisible() {
    await expect(this.navigation).toBeVisible();
    await expect(this.homeLink).toBeVisible();
    await expect(this.productsLink).toBeVisible();
    await expect(this.cartLink).toBeVisible();
    await expect(this.profileLink).toBeVisible();
    await expect(this.logoutButton).toBeVisible();
  }

  async expectProfileText(userName: string) {
    await expect(this.profileLink).toHaveText(userName);
  }
}
