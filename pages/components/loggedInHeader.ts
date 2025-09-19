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
    this.navigation = page.locator('navigation');
    this.homeLink = page.getByRole('link', { name: 'Home' });
    this.productsLink = page.getByRole('link', { name: 'Products' });
    this.sendEmailLink = page.getByRole('link', { name: 'Send Email' });
    this.qrCodeLink = page.getByRole('link', { name: 'QR Code' });
    this.llmLink = page.getByRole('link', { name: 'LLM' });
    this.trafficMonitorLink = page.getByRole('link', { name: 'Traffic Monitor' });
    this.cartLink = page.locator('a[href="/cart"]');
    this.cartIcon = this.cartLink.locator('img');
    this.profileLink = page.getByRole('link').filter({ hasText: /User/ });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
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
