import type { Locator, Page } from '@playwright/test';

export class LoggedOutHeaderComponent {
  readonly navigation: Locator;
  readonly loginLink: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.navigation = page.getByTestId('navigation');
    this.loginLink = page.getByTestId('login-link');
    this.registerLink = page.getByTestId('register-link');
  }
}
