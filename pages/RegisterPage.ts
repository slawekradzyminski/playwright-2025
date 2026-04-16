import { Locator, type Page } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  static readonly url = `${APP_BASE_URL}/register`;

  readonly page: Page;
  readonly createAccountButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.createAccountButton = page.getByTestId('register-submit-button');
  }

}
