import { type Page, type Locator, expect } from '@playwright/test';
import type { SignupDto } from '../../../types/auth';
import { ToastComponent } from '../components/ToastComponent';
import { LoggedOutHeaderComponent } from '../components/LoggedOutHeaderComponent';

const APP_BASE_URL = process.env.APP_BASE_URL || '';

export class RegisterPage {
  readonly page: Page;
  readonly url: string;

  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly submitButton: Locator;
  readonly loginButton: Locator;
  readonly title: Locator;
  readonly usernameError: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly firstNameError: Locator;
  readonly lastNameError: Locator;
  readonly toast: ToastComponent;
  readonly header: LoggedOutHeaderComponent;

  constructor(page: Page) {
    this.page = page;
    this.url = `${APP_BASE_URL}/register`;

    this.usernameInput = page.getByTestId('register-username-input');
    this.emailInput = page.getByTestId('register-email-input');
    this.passwordInput = page.getByTestId('register-password-input');
    this.firstNameInput = page.getByTestId('register-firstname-input');
    this.lastNameInput = page.getByTestId('register-lastname-input');
    this.submitButton = page.getByTestId('register-submit-button');
    this.loginButton = page.getByTestId('register-login-link');
    this.title = page.getByTestId('register-title');
    this.usernameError = page.getByTestId('register-username-error');
    this.emailError = page.getByTestId('register-email-error');
    this.passwordError = page.getByTestId('register-password-error');
    this.firstNameError = page.getByTestId('register-firstname-error');
    this.lastNameError = page.getByTestId('register-lastname-error');
    this.toast = new ToastComponent(page.getByTestId('toast-viewport'));
    this.header = new LoggedOutHeaderComponent(page.getByTestId('navigation'));
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async register(user: SignupDto) {
    await this.usernameInput.fill(user.username);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.submitButton.click();
  }

  async expectToBeOnRegisterPage() {
    await expect(this.page).toHaveURL(this.url);
    await expect(this.title).toHaveText('Create your account');
  }
}
