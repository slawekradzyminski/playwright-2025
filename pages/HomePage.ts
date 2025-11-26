import type { Page, Locator } from '@playwright/test';
import { FRONTEND_URL } from '../config/constants';
import { Toast } from './components/Toast';
import { LoggedInHeader } from './components/LoggedInHeader';

export class HomePage {
  readonly page: Page;
  readonly toast: Toast;
  readonly header: LoggedInHeader;
  readonly homePage: Locator;
  readonly welcomeTitle: Locator;
  readonly userEmail: Locator;
  readonly productsButton: Locator;
  readonly usersButton: Locator;
  readonly profileButton: Locator;
  readonly trafficButton: Locator;
  readonly llmButton: Locator;
  readonly qrButton: Locator;
  readonly emailButton: Locator;

  static readonly URL = `${FRONTEND_URL}/`;

  constructor(page: Page) {
    this.page = page;
    this.toast = new Toast(page);
    this.header = new LoggedInHeader(page);
    this.homePage = page.getByTestId('home-page');
    this.welcomeTitle = page.getByTestId('home-welcome-title');
    this.userEmail = page.getByTestId('home-user-email');
    this.productsButton = page.getByTestId('home-products-button');
    this.usersButton = page.getByTestId('home-users-button');
    this.profileButton = page.getByTestId('home-profile-button');
    this.trafficButton = page.getByTestId('home-traffic-button');
    this.llmButton = page.getByTestId('home-llm-button');
    this.qrButton = page.getByTestId('home-qr-button');
    this.emailButton = page.getByTestId('home-email-button');
  }

  async goto() {
    await this.page.goto(HomePage.URL);
  }
}
