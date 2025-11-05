import { Page, Locator } from '@playwright/test';
import { UI_BASE_URL } from '../config/constants';

export class HomePage {
  readonly page: Page;
  readonly welcomeHeading: Locator;
  readonly emailParagraph: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeHeading = page.getByRole('heading', { level: 1 });
    this.emailParagraph = page.getByRole('main').getByRole('paragraph').first();
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
