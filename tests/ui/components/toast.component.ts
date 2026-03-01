import { expect, type Locator, type Page } from '@playwright/test';

export class ToastComponent {
  readonly notificationsRegion: Locator;
  readonly toastTitle: Locator;
  readonly toastDescription: Locator;

  constructor(page: Page) {
    this.notificationsRegion = page.getByTestId('toast-viewport');
    this.toastTitle = this.notificationsRegion.getByTestId('toast-title');
    this.toastDescription = this.notificationsRegion.getByTestId('toast-description');
  }

  getTitle(title: string): Locator {
    return this.toastTitle.filter({ hasText: title });
  }

  getMessage(message: string): Locator {
    return this.toastDescription.filter({ hasText: message });
  }

  async expectTitle(title: string): Promise<void> {
    await expect(this.getTitle(title)).toBeVisible();
  }

  async expectMessage(message: string): Promise<void> {
    await expect(this.getMessage(message)).toBeVisible();
  }

  async expectError(message: string, title = 'Error'): Promise<void> {
    await this.expectTitle(title);
    await this.expectMessage(message);
  }
}
