import { type Locator, expect } from '@playwright/test';

export class LoggedOutHeaderComponent {
  readonly root: Locator;
  readonly loginLink: Locator;
  readonly registerLink: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.loginLink = root.getByTestId('login-link');
    this.registerLink = root.getByTestId('register-link');
  }

  async expectVisible() {
    await expect(this.loginLink).toBeVisible();
    await expect(this.registerLink).toBeVisible();
  }
}
