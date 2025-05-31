import { expect, type Page } from '@playwright/test';
import { FRONTEND_URL } from '../config/constants';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectToBeOnPage(path: string) {
    await expect(this.page).toHaveURL(`${FRONTEND_URL}${path}`);
  }

  async expectToBeRedirectedFromPage(path: string) {
    await expect(this.page).not.toHaveURL(`${FRONTEND_URL}${path}`);
  }

} 