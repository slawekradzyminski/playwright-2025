import { expect, Locator, type Page } from '@playwright/test';
import { FRONTEND_URL } from '../config/constants';
import { LoggedInPage } from './loggedInPage';

export class HomePage extends LoggedInPage {

  readonly welcomeHeading: Locator;
  readonly userEmail: Locator;
  readonly viewProductsButton: Locator;
  readonly manageUsersButton: Locator;
  readonly viewProfileButton: Locator;
  readonly openTrafficMonitorButton: Locator;
  readonly openAiAssistantButton: Locator;
  readonly generateQrCodesButton: Locator;
  readonly sendEmailsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeHeading = page.locator('h1');
    this.userEmail = page.locator('p').first();
    this.viewProductsButton = page.getByTestId('home-products-button');
    this.manageUsersButton = page.getByTestId('home-users-button');
    this.viewProfileButton = page.getByTestId('home-profile-button');
    this.openTrafficMonitorButton = page.getByTestId('home-traffic-button');
    this.openAiAssistantButton = page.getByTestId('home-llm-button');
    this.generateQrCodesButton = page.getByTestId('home-qr-button');
    this.sendEmailsButton = page.getByTestId('home-email-button');
  }

  async goto() {
    await this.page.goto(`${FRONTEND_URL}/`);
  }

  async verifyWelcomeMessage(firstName: string) {
    await expect(this.welcomeHeading).toHaveText(`Welcome, ${firstName}!`);
  }

  async verifyUserEmail(email: string) {
    await expect(this.userEmail).toHaveText(email);
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
