import type { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly logoutButton: Locator;
  readonly userEmail: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoutButton = page.getByTestId('logout-button');
    this.userEmail = page.getByTestId('home-user-email');
  }
}
