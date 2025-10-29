import { expect, Page } from '@playwright/test';
import { LoggedInPage } from './abstract/loggedInPage';

export class TrafficPage extends LoggedInPage {

  constructor(page: Page) {
    super(page);
  }

  async expectOnPage() {
    await expect(this.page).toHaveURL(/\/traffic/);
  }

}

