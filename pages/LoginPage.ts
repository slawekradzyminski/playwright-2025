import type { Page, Locator } from '@playwright/test';
import { FRONTEND_URL } from '../config/constants';
import { Toast } from './components/Toast';
import { LoggedOutHeader } from './components/LoggedOutHeader';

export class LoginPage {
  readonly page: Page;
  readonly toast: Toast;
  readonly header: LoggedOutHeader;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly registerButton: Locator;
  readonly usernameError: Locator;
  readonly passwordError: Locator;

  static readonly URL = `${FRONTEND_URL}/login`;

  constructor(page: Page) {
    this.page = page;
    this.toast = new Toast(page);
    this.header = new LoggedOutHeader(page);
    this.usernameInput = page.getByTestId('login-username-input');
    this.passwordInput = page.getByTestId('login-password-input');
    this.submitButton = page.getByTestId('login-submit-button');
    this.registerButton = page.getByTestId('login-register-link');
    this.usernameError = page.getByTestId('login-username-error');
    this.passwordError = page.getByTestId('login-password-error');
  }

  async goto() {
    await this.page.goto(LoginPage.URL);
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async clickRegister() {
    await this.registerButton.click();
  }
}

