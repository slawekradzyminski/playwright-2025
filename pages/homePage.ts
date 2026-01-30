import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly welcomeHeading: Locator;
  readonly userEmail: Locator;
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly sendEmailLink: Locator;
  readonly qrCodeLink: Locator;
  readonly llmLink: Locator;
  readonly trafficMonitorLink: Locator;
  readonly adminLink: Locator;
  readonly cartLink: Locator;
  readonly profileLink: Locator;
  readonly logoutButton: Locator;
  readonly viewProductsButton: Locator;
  readonly manageUsersButton: Locator;
  readonly viewProfileOrdersButton: Locator;
  readonly openTrafficMonitorButton: Locator;
  readonly openAiAssistantButton: Locator;
  readonly generateQrCodesButton: Locator;
  readonly sendEmailsButton: Locator;
  readonly homeUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.homeUrl = `${process.env.FRONTEND_URL}/`;
    this.welcomeHeading = page.getByRole('heading', { level: 1 });
    this.userEmail = page.locator('p').filter({ hasText: /@/ });
    this.homeLink = page.getByRole('link', { name: 'Home' });
    this.productsLink = page.getByRole('link', { name: 'Products' });
    this.sendEmailLink = page.getByRole('link', { name: 'Send Email' });
    this.qrCodeLink = page.getByRole('link', { name: 'QR Code' });
    this.llmLink = page.getByRole('link', { name: 'LLM' });
    this.trafficMonitorLink = page.getByRole('link', { name: 'Traffic Monitor' });
    this.adminLink = page.getByRole('link', { name: 'Admin' });
    this.cartLink = page.locator('a[href="/cart"]');
    this.profileLink = page.getByRole('link', { name: /Slawomir|profile/i });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.viewProductsButton = page.getByRole('button', { name: 'View Products' });
    this.manageUsersButton = page.getByRole('button', { name: 'Manage Users' });
    this.viewProfileOrdersButton = page.getByRole('button', { name: 'View Profile & Orders' });
    this.openTrafficMonitorButton = page.getByRole('button', { name: 'Open Traffic Monitor' });
    this.openAiAssistantButton = page.getByRole('button', { name: 'Open AI Assistant' });
    this.generateQrCodesButton = page.getByRole('button', { name: 'Generate QR Codes' });
    this.sendEmailsButton = page.getByRole('button', { name: 'Send Emails' });
  }

  async goto() {
    await this.page.goto(this.homeUrl);
  }

  async clickLogout() {
    await this.logoutButton.click();
  }

  async clickProductsLink() {
    await this.productsLink.click();
  }

  async clickViewProductsButton() {
    await this.viewProductsButton.click();
  }

  async clickManageUsersButton() {
    await this.manageUsersButton.click();
  }

  async clickTrafficMonitorLink() {
    await this.trafficMonitorLink.click();
  }

  async expectToBeOnHomePage() {
    await expect(this.page).toHaveURL(this.homeUrl);
  }

  async expectWelcomeMessage(firstName: string) {
    await expect(this.welcomeHeading).toBeVisible();
    await expect(this.welcomeHeading).toContainText(`Welcome, ${firstName}!`);
  }

  async expectUserEmail(email: string) {
    await expect(this.userEmail).toBeVisible();
    await expect(this.userEmail).toHaveText(email);
  }

  async expectLogoutButtonVisible() {
    await expect(this.logoutButton).toBeVisible();
  }

  async expectNavigationLinksVisible() {
    await expect(this.homeLink).toBeVisible();
    await expect(this.productsLink).toBeVisible();
    await expect(this.sendEmailLink).toBeVisible();
    await expect(this.qrCodeLink).toBeVisible();
    await expect(this.llmLink).toBeVisible();
    await expect(this.trafficMonitorLink).toBeVisible();
    await expect(this.adminLink).toBeVisible();
  }

  async expectToBeOnLoginPage() {
    await expect(this.page).toHaveURL(`${process.env.FRONTEND_URL}/login`);
  }

  async expectToBeOnProductsPage() {
    await expect(this.page).toHaveURL(`${process.env.FRONTEND_URL}/products`);
  }

  async expectToBeOnAdminPage() {
    await expect(this.page).toHaveURL(`${process.env.FRONTEND_URL}/admin`);
  }

  async expectToBeOnTrafficPage() {
    await expect(this.page).toHaveURL(`${process.env.FRONTEND_URL}/traffic`);
  }
}
