import { expect, type Locator, type Page } from '@playwright/test';
import { UI_BASE_URL } from '../config/constants';
import { LoggedInHeaderComponent } from './components/LoggedInHeaderComponent';

export class HomePage {
  readonly page: Page;
  readonly header: LoggedInHeaderComponent;
  readonly welcomeTitle: Locator;
  readonly userEmail: Locator;
  readonly viewProductsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new LoggedInHeaderComponent(page);
    this.welcomeTitle = page.getByTestId('home-welcome-title');
    this.userEmail = page.getByTestId('home-user-email');
    this.viewProductsButton = page.getByTestId('home-products-button');
  }

  async expectToBeOnHomePage() {
    await expect(this.page).toHaveURL(`${UI_BASE_URL}/`);
  }

  async expectWelcomeMessage() {
    await expect(this.welcomeTitle).toBeVisible();
    await expect(this.welcomeTitle).toContainText('Welcome');
  }

  async expectUserEmail(email: string) {
    await expect(this.userEmail).toBeVisible();
    await expect(this.userEmail).toHaveText(email);
  }

  async clickViewProductsButton() {
    await this.viewProductsButton.click();
  }
}

