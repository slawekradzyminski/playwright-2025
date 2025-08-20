import { expect, type Locator, type Page } from '@playwright/test';
import type { LoginDto } from '../types/auth';
import { FRONTEND_URL } from './constants';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly registerLink: Locator;
  readonly usernameError: Locator;
  readonly toastDescription: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByTestId('login-username-input');
    this.passwordInput = page.getByTestId('login-password-input');
    this.submitButton = page.getByTestId('login-submit-button');
    this.registerLink = page.getByTestId('login-register-link');
    this.usernameError = page.getByTestId('login-username-error');
    this.toastDescription = page.getByTestId('toast-description');
  }

  async goto() {
    await this.page.goto(`${FRONTEND_URL}/login`);
  }

  async login(credentials: LoginDto) {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.submitButton.click();
  }

  async clickRegisterLink() {
    await this.registerLink.click();
  }

  async expectToBeOnLoginPage() {
    await expect(this.page).toHaveURL('http://localhost:8081/login');
  }

  async expectUsernameRequiredError() {
    await expect(this.usernameError).toContainText('Username is required');
  }

  async expectShortUsernameError() {
    await expect(this.usernameError).toContainText('Username must be at least 4 characters');
  }

  async expectInvalidCredentialsError() {
    await expect(this.toastDescription).toContainText('Invalid username/password');
  }
}
