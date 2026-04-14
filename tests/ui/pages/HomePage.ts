import { type Page, type Locator, expect } from '@playwright/test';

const APP_BASE_URL = process.env.APP_BASE_URL || '';

export class HomePage {
  readonly page: Page;
  readonly url: string;

  readonly welcomeTitle: Locator;
  readonly userEmail: Locator;
  readonly logoutButton: Locator;
  readonly usernameProfileLink: Locator;
  readonly productsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.url = `${APP_BASE_URL}/`;

    this.welcomeTitle = page.getByTestId('home-welcome-title');
    this.userEmail = page.getByTestId('home-user-email');
    this.logoutButton = page.getByTestId('logout-button');
    this.usernameProfileLink = page.getByTestId('username-profile-link');
    this.productsLink = page.getByRole('link', { name: 'Products' });
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async expectLoggedInAs(username: string, email: string) {
    await expect(this.welcomeTitle).toContainText(username);
    await expect(this.userEmail).toHaveText(email);
    await expect(this.logoutButton).toBeVisible();
  }
}
