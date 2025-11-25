import type { Page, Locator } from '@playwright/test';

export class LoggedOutHeader {
  readonly page: Page;
  readonly navigation: Locator;
  readonly authActions: Locator;
  readonly loginLink: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigation = page.getByTestId('navigation');
    this.authActions = page.getByTestId('auth-actions');
    this.loginLink = page.getByTestId('login-link');
    this.registerLink = page.getByTestId('register-link');
  }

  async clickLogin() {
    await this.loginLink.click();
  }

  async clickRegister() {
    await this.registerLink.click();
  }
}

