import { type Page, type Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  readonly welcomeTitle: Locator;
  readonly userEmail: Locator;
  readonly logoutButton: Locator;
  readonly usernameProfileLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.welcomeTitle = page.getByTestId('home-welcome-title');
    this.userEmail = page.getByTestId('home-user-email');
    this.logoutButton = page.getByTestId('logout-button');
    this.usernameProfileLink = page.getByTestId('username-profile-link');
  }

  async expectLoggedInAs(username: string, email: string) {
    await expect(this.welcomeTitle).toContainText(username);
    await expect(this.userEmail).toHaveText(email);
    await expect(this.logoutButton).toBeVisible();
  }
}
