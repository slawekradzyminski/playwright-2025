import { expect, type Locator, type Page } from '@playwright/test';
import type { LoginDto } from '../types/auth';
import { FRONTEND_URL } from '../config/constants';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly registerButton: Locator;
  readonly registerLink: Locator;
  readonly toastDescription: Locator;
  readonly usernameValidationError: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByTestId('login-username-input');
    this.passwordInput = page.getByTestId('login-password-input');
    this.submitButton = page.getByTestId('login-submit-button');
    this.registerButton = page.getByTestId('login-register-link');
    this.registerLink = page.getByTestId('register-link');
    this.toastDescription = page.getByTestId('toast-description');
    this.usernameValidationError = page.getByText('Username must be at least 4 characters');
  }

  async goto() {
    await this.page.goto(`${FRONTEND_URL}/login`);
  }

  async login(credentials: LoginDto) {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.submitButton.click();
  }

  async clickRegisterButton() {
    await this.registerButton.click();
  }

  async clickRegisterLink() {
    await this.registerLink.click();
  }

  async expectErrorMessage(message: string) {
    await expect(this.toastDescription).toBeVisible();
    await expect(this.toastDescription).toHaveText(message);
  }

  async expectUsernameValidationError() {
    await expect(this.usernameValidationError).toBeVisible();
  }
} 