import { expect, type Locator, type Page } from '@playwright/test';
import type { LoginDto } from '../types/auth';
import { UI_BASE_URL } from '../config/constants';
import { ToastComponent } from './components/ToastComponent';
import { LoggedOutHeaderComponent } from './components/LoggedOutHeaderComponent';

export class LoginPage {
  readonly page: Page;
  readonly header: LoggedOutHeaderComponent;
  readonly toast: ToastComponent;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly registerButton: Locator;
  readonly passwordError: Locator;
  readonly usernameError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new LoggedOutHeaderComponent(page);
    this.toast = new ToastComponent(page);
    this.usernameInput = page.getByTestId('login-username-input');
    this.passwordInput = page.getByTestId('login-password-input');
    this.submitButton = page.getByTestId('login-submit-button');
    this.registerButton = page.getByTestId('login-register-link');
    this.passwordError = page.getByTestId('login-password-error');
    this.usernameError = page.getByTestId('login-username-error');
  }

  async goto() {
    await this.page.goto(`${UI_BASE_URL}/login`);
  }

  async login(credentials: LoginDto) {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.submitButton.click();
  }

  async expectPasswordError(message: string) {
    await expect(this.passwordError).toBeVisible();
    await expect(this.passwordError).toHaveText(message);
  }

  async expectUsernameError(message: string) {
    await expect(this.usernameError).toBeVisible();
    await expect(this.usernameError).toHaveText(message);
  }

  async clickRegisterButton() {
    await this.registerButton.click();
  }
}

