import { expect, type Page } from '@playwright/test';

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  async assertThatUrlIs(url: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(url);
  }

  async assertThatUrlIsNot(url: string | RegExp): Promise<void> {
    await expect(this.page).not.toHaveURL(url);
  }
}
