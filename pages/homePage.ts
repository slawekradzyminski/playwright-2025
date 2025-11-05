import { Page, Locator } from '@playwright/test';
import { UI_BASE_URL } from '../config/constants';

export class HomePage {
  readonly page: Page;
  readonly welcomeHeading: Locator;
  readonly emailParagraph: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeHeading = page.getByTestId('home-welcome-title');
    this.emailParagraph = page.getByTestId('home-user-email');
  }

  async goto() {
    await this.page.goto(`${UI_BASE_URL}/`);
  }

  async getEmail() {
    return await this.emailParagraph.textContent();
  }

  get url() {
    return `${UI_BASE_URL}/`;
  }
}
