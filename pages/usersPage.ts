import { expect, Page } from '@playwright/test';
import { LoggedInPage } from './abstract/loggedInPage';

export class UsersPage extends LoggedInPage {

  constructor(page: Page) {
    super(page);
  }

  async expectOnPage() {
    await expect(this.page).toHaveURL(/\/users/);
  }

}

