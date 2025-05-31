import { expect, type Locator, type Page } from '@playwright/test';
import { FRONTEND_URL } from '../config/constants';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly sendEmailLink: Locator;
  readonly qrCodeLink: Locator;
  readonly llmLink: Locator;
  readonly trafficMonitorLink: Locator;
  readonly adminLink: Locator;
  readonly userProfileLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.homeLink = page.getByRole('link', { name: 'Home' });
    this.productsLink = page.getByRole('link', { name: 'Products' });
    this.sendEmailLink = page.getByRole('link', { name: 'Send Email' });
    this.qrCodeLink = page.getByRole('link', { name: 'QR Code' });
    this.llmLink = page.getByRole('link', { name: 'LLM' });
    this.trafficMonitorLink = page.getByRole('link', { name: 'Traffic Monitor' });
    this.adminLink = page.getByRole('link', { name: 'Admin' });
    this.userProfileLink = page.locator('a[href="/profile"]');
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  async goto() {
    await this.page.goto(`${FRONTEND_URL}/`);
  }

  async expectHeaderLinksToBeVisible() {
    await expect(this.homeLink).toBeVisible();
    await expect(this.productsLink).toBeVisible();
    await expect(this.sendEmailLink).toBeVisible();
    await expect(this.qrCodeLink).toBeVisible();
    await expect(this.llmLink).toBeVisible();
    await expect(this.trafficMonitorLink).toBeVisible();
    await expect(this.adminLink).toBeVisible();
    await expect(this.userProfileLink).toBeVisible();
    await expect(this.logoutButton).toBeVisible();
  }

  async expectUserProfileLinkToContainName(firstName: string, lastName: string) {
    const expectedName = `${firstName} ${lastName}`;
    await expect(this.userProfileLink).toHaveText(expectedName);
  }
} 