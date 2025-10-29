import { expect, type Locator, type Page } from '@playwright/test';

export class LoggedOutHeader {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}

