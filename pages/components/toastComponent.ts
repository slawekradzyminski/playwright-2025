import { expect, type Page } from '@playwright/test';

export class ToastComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private async expectToastMessage(title: string, message: string) {
    const toast = this.page.getByTestId('toast-description');
    const toastTitle = this.page.getByTestId('toast-title');
    await expect(toastTitle).toHaveText(title);
    await expect(toast).toHaveText(message);
  }

  async expectSuccessToastMessage(message: string) {
    await this.expectToastMessage('Success', message);
  }

  async expectErrorToastMessage(message: string) {
    await this.expectToastMessage('Error', message);
  }
}
