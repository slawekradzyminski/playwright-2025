import { Page, Locator } from '@playwright/test';
import { UI_BASE_URL } from '../config/constants';
import { BasePage } from './basePage';

export class HomePage extends BasePage {
  readonly welcomeHeading: Locator;
  readonly emailParagraph: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeHeading = page.getByTestId('home-welcome-title');
    this.emailParagraph = page.getByTestId('home-user-email');
  }

  async getEmail() {
    return await this.emailParagraph.textContent();
  }

  get url() {
    return `${UI_BASE_URL}/`;
  }
}
