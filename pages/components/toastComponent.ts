import { expect, type Locator, type Page } from '@playwright/test';

export class ToastComponent {
  private readonly viewport: Locator;
  private readonly errorToast: Locator;

  constructor(page: Page) {
    this.viewport = page.getByTestId('toast-viewport');
    this.errorToast = this.viewport.locator('li[class*="error"]');
  }

  async assertThatErrorToastContainsText(text: string | RegExp): Promise<void> {
    await expect(this.errorToast.getByTestId('toast-title')).toHaveText('Error');
    await expect(this.errorToast.getByTestId('toast-description')).toContainText(text);
  }
}
