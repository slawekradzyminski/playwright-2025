import { expect, type Locator, type Page } from '@playwright/test';
import type { LoginDto } from '../types/auth';
import { UI_BASE_URL } from '../config/constants';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly registerButton: Locator;
  readonly registerLink: Locator;
  readonly passwordError: Locator;
  readonly usernameError: Locator;
  readonly toastTitle: Locator;
  readonly toastDescription: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByTestId('login-username-input');
    this.passwordInput = page.getByTestId('login-password-input');
    this.submitButton = page.getByTestId('login-submit-button');
    this.registerButton = page.getByTestId('login-register-link');
    this.registerLink = page.getByTestId('register-link');
    this.passwordError = page.getByTestId('login-password-error');
    this.usernameError = page.getByTestId('login-username-error');
    this.toastTitle = page.getByTestId('toast-title');
    this.toastDescription = page.getByTestId('toast-description');
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

  async expectToastError(title: string, description: string) {
    await expect(this.toastTitle).toBeVisible();
    await expect(this.toastTitle).toHaveText(title);
    await expect(this.toastDescription).toHaveText(description);
  }

  async clickRegisterButton() {
    await this.registerButton.click();
  }

  async clickRegisterLink() {
    await this.registerLink.click();
  }
}

