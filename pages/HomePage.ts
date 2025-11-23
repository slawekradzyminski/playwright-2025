import { expect, type Locator, type Page } from '@playwright/test';
import { UI_BASE_URL } from '../config/constants';

export class HomePage {
  readonly page: Page;
  readonly welcomeTitle: Locator;
  readonly userEmail: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeTitle = page.getByTestId('home-welcome-title');
    this.userEmail = page.getByTestId('home-user-email');
    this.logoutButton = page.getByTestId('logout-button');
  }

  async expectToBeOnHomePage() {
    await expect(this.page).toHaveURL(`${UI_BASE_URL}/`);
  }

  async expectWelcomeMessage() {
    await expect(this.welcomeTitle).toBeVisible();
    await expect(this.welcomeTitle).toContainText('Welcome');
  }

  async expectLogoutButtonVisible() {
    await expect(this.logoutButton).toBeVisible();
  }

  async expectUserEmail(email: string) {
    await expect(this.userEmail).toBeVisible();
    await expect(this.userEmail).toHaveText(email);
  }
}

