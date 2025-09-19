import { expect, Locator, type Page } from '@playwright/test';

export class LoggedOutHeader {
  readonly page: Page;
  readonly navigation: Locator;
  readonly loginLink: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigation = page.locator('navigation');
    this.loginLink = page.getByRole('link', { name: 'Login' });
    this.registerLink = page.getByRole('link', { name: 'Register' });
  }

  async clickLogin() {
    await this.loginLink.click();
  }

  async clickRegister() {
    await this.registerLink.click();
  }

  async expectToBeVisible() {
    await expect(this.navigation).toBeVisible();
    await expect(this.loginLink).toBeVisible();
    await expect(this.registerLink).toBeVisible();
  }
}
