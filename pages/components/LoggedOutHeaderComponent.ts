import { type Locator, type Page } from '@playwright/test';

export class LoggedOutHeaderComponent {
  readonly page: Page;
  readonly loginLink: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginLink = page.getByTestId('login-link');
    this.registerLink = page.getByTestId('register-link');
  }

  async clickLoginLink() {
    await this.loginLink.click();
  }

  async clickRegisterLink() {
    await this.registerLink.click();
  }
}

