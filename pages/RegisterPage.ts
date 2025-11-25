import type { Page, Locator } from '@playwright/test';
import { FRONTEND_URL } from '../config/constants';
import { Toast } from './components/Toast';
import { LoggedOutHeader } from './components/LoggedOutHeader';
import type { UserRegisterDto } from '../types/auth';

export class RegisterPage {
  readonly page: Page;
  readonly toast: Toast;
  readonly header: LoggedOutHeader;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly submitButton: Locator;
  readonly loginButton: Locator;
  readonly usernameError: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly firstNameError: Locator;
  readonly lastNameError: Locator;

  static readonly URL = `${FRONTEND_URL}/register`;

  constructor(page: Page) {
    this.page = page;
    this.toast = new Toast(page);
    this.header = new LoggedOutHeader(page);
    this.usernameInput = page.getByTestId('register-username-input');
    this.emailInput = page.getByTestId('register-email-input');
    this.passwordInput = page.getByTestId('register-password-input');
    this.firstNameInput = page.getByTestId('register-firstname-input');
    this.lastNameInput = page.getByTestId('register-lastname-input');
    this.submitButton = page.getByTestId('register-submit-button');
    this.loginButton = page.getByTestId('register-login-link');
    this.usernameError = page.getByTestId('register-username-error');
    this.emailError = page.getByTestId('register-email-error');
    this.passwordError = page.getByTestId('register-password-error');
    this.firstNameError = page.getByTestId('register-firstname-error');
    this.lastNameError = page.getByTestId('register-lastname-error');
  }

  async goto() {
    await this.page.goto(RegisterPage.URL);
  }

  async register(userData: UserRegisterDto) {
    await this.usernameInput.fill(userData.username);
    await this.emailInput.fill(userData.email);
    await this.passwordInput.fill(userData.password);
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.submitButton.click();
  }

  async clickLogin() {
    await this.loginButton.click();
  }
}

