import { expect, type Page } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  async assertThatUrlIs(url: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(this.resolveUrl(url));
  }

  async assertThatUrlIsNot(url: string | RegExp): Promise<void> {
    await expect(this.page).not.toHaveURL(this.resolveUrl(url));
  }

  private resolveUrl(url: string | RegExp): string | RegExp {
    if (url instanceof RegExp || !url.startsWith('/')) {
      return url;
    }

    return new URL(url, APP_BASE_URL).toString();
  }
}
