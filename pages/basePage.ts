import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;
  readonly toastNotification: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toastNotification = page.getByTestId('toast-viewport').locator('li').last();
  }

  abstract get url(): string;

  async goto() {
    await this.page.goto(this.url);
  }

  async getToastMessage() {
    return await this.toastNotification.textContent();
  }
}
