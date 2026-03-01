import type { Locator, Page } from '@playwright/test';
import type { LoginDto } from '../../../types/auth';
import { LOGIN_MESSAGES, LOGIN_URL } from '../constants/login.ui.constants';
import { LoggedOutHeaderComponent } from '../components/logged-out-header.component';
import { ToastComponent } from '../components/toast.component';

export class LoginPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly registerButton: Locator;
  readonly registerLink: Locator;
  readonly toast: ToastComponent;
  readonly validationAlert: Locator;
  readonly header: LoggedOutHeaderComponent;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByTestId('login-title').filter({ hasText: LOGIN_MESSAGES.heading });
    this.usernameInput = page.getByTestId('login-username-input');
    this.passwordInput = page.getByTestId('login-password-input');
    this.signInButton = page.getByTestId('login-submit-button');
    this.registerButton = page.getByTestId('login-register-link');
    this.registerLink = page.getByTestId('register-link');
    this.toast = new ToastComponent(page);
    this.validationAlert = page.getByRole('alert');
    this.header = new LoggedOutHeaderComponent(page);
  }

  async goto(): Promise<void> {
    await this.page.goto(LOGIN_URL);
  }

  async login(credentials: LoginDto): Promise<void> {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.signInButton.click();
  }

  async clickRegisterButton(): Promise<void> {
    await this.registerButton.click();
  }

  async clickRegisterLink(): Promise<void> {
    await this.registerLink.click();
  }

  getValidationError(message: string): Locator {
    return this.validationAlert.filter({ hasText: message });
  }
}
