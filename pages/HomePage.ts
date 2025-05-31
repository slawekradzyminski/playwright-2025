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
  
  readonly welcomeHeading: Locator;
  readonly userEmail: Locator;
  readonly applicationFeaturesHeading: Locator;
  readonly viewProductsButton: Locator;
  readonly manageUsersButton: Locator;
  readonly viewProfileOrdersButton: Locator;
  readonly openTrafficMonitorButton: Locator;
  readonly openAiAssistantButton: Locator;
  readonly generateQrCodesButton: Locator;
  readonly sendEmailsButton: Locator;

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
    
    this.welcomeHeading = page.getByRole('heading', { level: 1 });
    this.userEmail = page.locator('p').filter({ hasText: '@' });
    this.applicationFeaturesHeading = page.getByRole('heading', { name: 'Application Features' });
    this.viewProductsButton = page.getByTestId('home-products-button');
    this.manageUsersButton = page.getByTestId('home-users-button');
    this.viewProfileOrdersButton = page.getByTestId('home-profile-button');
    this.openTrafficMonitorButton = page.getByTestId('home-traffic-button');
    this.openAiAssistantButton = page.getByTestId('home-llm-button');
    this.generateQrCodesButton = page.getByTestId('home-qr-button');
    this.sendEmailsButton = page.getByTestId('home-email-button');
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

  async expectWelcomeSection(firstName: string, email: string) {
    await expect(this.welcomeHeading).toHaveText(`Welcome, ${firstName}!`);
    await expect(this.userEmail).toHaveText(email);
  }

  async expectMainContentSections() {
    await expect(this.applicationFeaturesHeading).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Advanced Monitoring' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'AI Integration' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Additional Utilities' })).toBeVisible();
  }

  async expectAllActionButtons() {
    await expect(this.viewProductsButton).toBeVisible();
    await expect(this.manageUsersButton).toBeVisible();
    await expect(this.viewProfileOrdersButton).toBeVisible();
    await expect(this.openTrafficMonitorButton).toBeVisible();
    await expect(this.openAiAssistantButton).toBeVisible();
    await expect(this.generateQrCodesButton).toBeVisible();
    await expect(this.sendEmailsButton).toBeVisible();
  }

  async clickViewProducts() {
    await this.viewProductsButton.click();
  }

  async clickManageUsers() {
    await this.manageUsersButton.click();
  }

  async clickViewProfileOrders() {
    await this.viewProfileOrdersButton.click();
  }

  async clickOpenTrafficMonitor() {
    await this.openTrafficMonitorButton.click();
  }

  async clickOpenAiAssistant() {
    await this.openAiAssistantButton.click();
  }

  async clickGenerateQrCodes() {
    await this.generateQrCodesButton.click();
  }

  async clickSendEmails() {
    await this.sendEmailsButton.click();
  }
} 