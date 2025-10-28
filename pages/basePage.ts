import { expect, type Locator, type Page } from '@playwright/test';
import { FRONTEND_URL } from '../config/constants';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(`${FRONTEND_URL}/${url}`);
  }

  async expectOnPage(url: string) {
    await expect(this.page).toHaveURL(`${FRONTEND_URL}/${url}`);
  }

  async expectNotOnPage(url: string) {
    await expect(this.page).not.toHaveURL(`${FRONTEND_URL}/${url}`);
  }



  async expectToastMessage(message: string) {
    const toast = this.page.getByTestId('toast-description');
    await expect(toast).toHaveText(message);
  }
}