import { type Locator, expect } from '@playwright/test';

export class ToastComponent {
  readonly root: Locator;
  readonly title: Locator;
  readonly description: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.title = root.getByTestId('toast-title');
    this.description = root.getByTestId('toast-description');
  }

  async expectMessage(title: string, description: string) {
    await expect(this.title).toHaveText(title);
    await expect(this.description).toHaveText(description);
  }

  async expectError(title: string, description: string) {
    await this.expectMessage(title, description);
  }
}
