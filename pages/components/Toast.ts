import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class Toast {
  readonly page: Page;
  readonly title: Locator;
  readonly description: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('toast-title');
    this.description = page.getByTestId('toast-description');
    this.closeButton = page.getByTestId('toast-close');
  }

  async expectError(message: string) {
    await expect(this.title).toHaveText('Error');
    await expect(this.description).toHaveText(message);
  }

  async expectSuccess(message: string) {
    await expect(this.title).toHaveText('Success');
    await expect(this.description).toHaveText(message);
  }

  async close() {
    await this.closeButton.click();
  }
}

