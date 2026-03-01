import { expect, type Locator, type Page } from '@playwright/test';

export class ToastComponent {
  readonly notificationsRegion: Locator;

  constructor(page: Page) {
    this.notificationsRegion = page.getByTestId('toast-viewport');
  }

  getTitle(title: string): Locator {
    return this.notificationsRegion.getByText(title);
  }

  getMessage(message: string): Locator {
    return this.notificationsRegion.getByText(message);
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
