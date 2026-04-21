import { expect, type Locator, type Page } from '@playwright/test';

export class LoggedOutHeaderComponent {
  private readonly loginLink: Locator;
  private readonly registerLink: Locator;

  constructor(page: Page) {
    this.loginLink = page.getByTestId('login-link');
    this.registerLink = page.getByTestId('register-link');
  }

  async clickRegisterLink(): Promise<void> {
    await this.registerLink.click();
  }

  async assertThatHeaderIsVisible(): Promise<void> {
    await expect(this.loginLink).toBeVisible();
    await expect(this.registerLink).toBeVisible();
  }
}
