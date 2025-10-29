import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class HomePage extends BasePage {
  readonly userEmail: Locator;
  readonly viewProductsButton: Locator;
  readonly manageUsersButton: Locator;
  readonly viewProfileOrdersButton: Locator;
  readonly openTrafficMonitorButton: Locator;
  readonly openAIAssistantButton: Locator;
  readonly generateQRCodesButton: Locator;
  readonly sendEmailsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.userEmail = page.getByTestId('home-user-email');
    this.viewProductsButton = page.getByTestId('home-products-button');
    this.manageUsersButton = page.getByTestId('home-users-button');
    this.viewProfileOrdersButton = page.getByTestId('home-profile-button');
    this.openTrafficMonitorButton = page.getByTestId('home-traffic-button');
    this.openAIAssistantButton = page.getByTestId('home-llm-button');
    this.generateQRCodesButton = page.getByTestId('home-qr-button');
    this.sendEmailsButton = page.getByTestId('home-email-button');
  }

  async expectUserEmail(email: string) {
    await expect(this.userEmail).toHaveText(email);
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

  async clickOpenAIAssistant() {
    await this.openAIAssistantButton.click();
  }

  async clickGenerateQRCodes() {
    await this.generateQRCodesButton.click();
  }

  async clickSendEmails() {
    await this.sendEmailsButton.click();
  }
}