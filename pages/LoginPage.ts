import { expect, type Locator, type Page } from '@playwright/test';
import type { LoginDto } from '../types/auth';
import { FRONTEND_URL } from '../config/constants';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly registerButton: Locator;
  readonly registerLink: Locator;
  readonly toastDescription: Locator;
  readonly usernameValidationError: Locator;

  constructor(page: Page) {
    this.page = page;
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

  async expectToBeOnLoginPage() {
    await expect(this.page).toHaveURL(`${FRONTEND_URL}/login`);
  }

  async expectToBeRedirectedFromLogin() {
    await expect(this.page).not.toHaveURL(`${FRONTEND_URL}/login`);
  }

  async expectToBeOnRegisterPage() {
    await expect(this.page).toHaveURL(`${FRONTEND_URL}/register`);
  }

  async expectErrorMessage(message: string) {
    await expect(this.toastDescription).toBeVisible();
    await expect(this.toastDescription).toHaveText(message);
  }

  async expectUsernameValidationError() {
    await expect(this.usernameValidationError).toBeVisible();
  }
} 