import { expect, type Locator, type Page } from '@playwright/test';

export class ToastComponent {
  readonly page: Page;
  readonly title: Locator;
  readonly description: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('toast-title');
    this.description = page.getByTestId('toast-description');
  }

  async expectError(title: string, description: string) {
    await expect(this.title).toBeVisible();
    await expect(this.title).toHaveText(title);
    await expect(this.description).toHaveText(description);
  }

  async expectSuccess(title: string, description: string) {
    await expect(this.title).toBeVisible();
    await expect(this.title).toHaveText(title);
    await expect(this.description).toHaveText(description);
  }

}

