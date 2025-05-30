import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly sendEmailLink: Locator;
  readonly qrCodeLink: Locator;
  readonly llmLink: Locator;
  readonly trafficMonitorLink: Locator;
  readonly adminLink: Locator;
  readonly userProfileLink: Locator;
  readonly logoutButton: Locator;
  readonly welcomeHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeLink = page.getByRole('link', { name: 'Home' });
    this.productsLink = page.getByRole('link', { name: 'Products' });
    this.sendEmailLink = page.getByRole('link', { name: 'Send Email' });
    this.qrCodeLink = page.getByRole('link', { name: 'QR Code' });
    this.llmLink = page.getByRole('link', { name: 'LLM' });
    this.trafficMonitorLink = page.getByRole('link', { name: 'Traffic Monitor' });
    this.adminLink = page.getByRole('link', { name: 'Admin' });
    this.userProfileLink = page.getByRole('link', { name: 'Slawomir Radzyminski' });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.welcomeHeading = page.getByRole('heading', { name: 'Welcome, Slawomir!' });
  }

  async goto() {
    await this.page.goto('http://localhost:8081/');
  }

  async expectToBeOnHomePage() {
    await expect(this.page).toHaveURL('http://localhost:8081/');
    await expect(this.welcomeHeading).toBeVisible();
  }

  async expectLoggedInHeaderToBeVisible() {
    await expect(this.homeLink).toBeVisible();
    await expect(this.productsLink).toBeVisible();
    await expect(this.sendEmailLink).toBeVisible();
    await expect(this.qrCodeLink).toBeVisible();
    await expect(this.llmLink).toBeVisible();
    await expect(this.trafficMonitorLink).toBeVisible();
    await expect(this.adminLink).toBeVisible();
    await expect(this.userProfileLink).toBeVisible();
  }

  async expectUserProfileLinkToHaveText(expectedText: string) {
    await expect(this.userProfileLink).toHaveText(expectedText);
  }

  async logout() {
    await this.logoutButton.click();
  }
} 