import { expect, type Locator, type Page } from '@playwright/test';
import { FRONTEND_URL } from './constants';

export class HomePage {
  readonly page: Page;
  readonly welcomeTitle: Locator;
  readonly userEmail: Locator;
  readonly profileLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeTitle = page.getByTestId('home-welcome-title');
    this.userEmail = page.getByTestId('home-user-email');
    this.profileLink = page.getByTestId('username-profile-link');
    this.logoutButton = page.getByTestId('logout-button');
  }

  async expectToBeOnHomePage() {
    await expect(this.page).toHaveURL(`${FRONTEND_URL}/`);
  }

  async expectWelcomeMessage(firstName: string) {
    await expect(this.welcomeTitle).toContainText(`Welcome, ${firstName}!`);
  }

  async expectUserEmail(email: string) {
    await expect(this.userEmail).toContainText(email);
  }

  async expectProfileLink(firstName: string, lastName: string) {
    await expect(this.profileLink).toContainText(`${firstName} ${lastName}`);
  }

  async expectLogoutButtonVisible() {
    await expect(this.logoutButton).toBeVisible();
  }

  async expectSuccessfulLogin(firstName: string, email: string, lastName: string) {
    await this.expectToBeOnHomePage();
    await this.expectWelcomeMessage(firstName);
    await this.expectUserEmail(email);
    await this.expectProfileLink(firstName, lastName);
    await this.expectLogoutButtonVisible();
  }
}
