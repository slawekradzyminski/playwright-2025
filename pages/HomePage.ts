import { expect, type Locator, type Page } from '@playwright/test';
import { FRONTEND_URL } from './constants';

export class HomePage {
  readonly page: Page;
  readonly welcomeTitle: Locator;
  readonly userEmail: Locator;
  readonly profileLink: Locator;
  readonly logoutButton: Locator;
  readonly viewProductsButton: Locator;
  readonly manageUsersButton: Locator;
  readonly viewProfileButton: Locator;
  readonly trafficMonitorButton: Locator;
  readonly aiAssistantButton: Locator;
  readonly qrGeneratorButton: Locator;
  readonly emailServiceButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeTitle = page.getByTestId('home-welcome-title');
    this.userEmail = page.getByTestId('home-user-email');
    this.profileLink = page.getByTestId('username-profile-link');
    this.logoutButton = page.getByTestId('logout-button');
    this.viewProductsButton = page.getByTestId('home-products-button');
    this.manageUsersButton = page.getByTestId('home-users-button');
    this.viewProfileButton = page.getByTestId('home-profile-button');
    this.trafficMonitorButton = page.getByTestId('home-traffic-button');
    this.aiAssistantButton = page.getByTestId('home-llm-button');
    this.qrGeneratorButton = page.getByTestId('home-qr-button');
    this.emailServiceButton = page.getByTestId('home-email-button');
  }

  async expectToBeOnHomePage() {
    await expect(this.page).toHaveURL(`${FRONTEND_URL}/`);
  }

  async expectWelcomeMessage(firstName: string) {
    await expect(this.welcomeTitle).toContainText(`Welcome, ${firstName}!`);
  }

  async expectUserEmail(email: string) {
    await expect(this.userEmail).toContainText(email);
  }

  async expectProfileLink(firstName: string, lastName: string) {
    await expect(this.profileLink).toContainText(`${firstName} ${lastName}`);
  }

  async expectLogoutButtonVisible() {
    await expect(this.logoutButton).toBeVisible();
  }

  async expectSuccessfulLogin(firstName: string, email: string, lastName: string) {
    await this.expectToBeOnHomePage();
    await this.expectWelcomeMessage(firstName);
    await this.expectUserEmail(email);
    await this.expectProfileLink(firstName, lastName);
    await this.expectLogoutButtonVisible();
  }

  async clickViewProducts() {
    await this.viewProductsButton.click();
  }

  async clickManageUsers() {
    await this.manageUsersButton.click();
  }

  async clickViewProfile() {
    await this.viewProfileButton.click();
  }

  async clickTrafficMonitor() {
    await this.trafficMonitorButton.click();
  }

  async clickAiAssistant() {
    await this.aiAssistantButton.click();
  }

  async clickQrGenerator() {
    await this.qrGeneratorButton.click();
  }

  async clickEmailService() {
    await this.emailServiceButton.click();
  }

  async expectNavigationButtonsVisible() {
    await expect(this.viewProductsButton).toBeVisible();
    await expect(this.manageUsersButton).toBeVisible();
    await expect(this.viewProfileButton).toBeVisible();
    await expect(this.trafficMonitorButton).toBeVisible();
    await expect(this.aiAssistantButton).toBeVisible();
    await expect(this.qrGeneratorButton).toBeVisible();
    await expect(this.emailServiceButton).toBeVisible();
  }
}
