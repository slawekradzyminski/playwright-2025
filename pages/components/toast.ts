import { expect, type Page, type Locator } from '@playwright/test';

export class Toast {
  readonly page: Page;
  readonly toastViewport: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toastViewport = page.getByTestId('toast-viewport');
  }

  async verifySuccessMessage(expectedMessage: string) {
    await expect(this.toastViewport).toContainText(expectedMessage);
  }

  async verifyErrorMessage(expectedMessage: string) {
    await expect(this.toastViewport).toContainText(expectedMessage);
  }

  async waitForToastToAppear() {
    await expect(this.toastViewport.locator('[role="status"]')).toBeVisible();
  }

  async waitForToastToDisappear() {
    await expect(this.toastViewport.locator('[role="status"]')).not.toBeVisible();
  }
}
