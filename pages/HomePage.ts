import type { Page, Locator } from '@playwright/test';
import { FRONTEND_URL } from '../config/constants';
import { Toast } from '../components/Toast';

export class HomePage {
  readonly page: Page;
  readonly toast: Toast;
  readonly homePage: Locator;
  readonly welcomeTitle: Locator;
  readonly userEmail: Locator;

  static readonly URL = `${FRONTEND_URL}/`;

  constructor(page: Page) {
    this.page = page;
    this.toast = new Toast(page);
    this.homePage = page.getByTestId('home-page');
    this.welcomeTitle = page.getByTestId('home-welcome-title');
    this.userEmail = page.getByTestId('home-user-email');
  }

  async goto() {
    await this.page.goto(HomePage.URL);
  }
}

