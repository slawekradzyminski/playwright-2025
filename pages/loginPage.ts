import { expect, type Locator, type Page } from '@playwright/test';
import type { LoginDto } from '../types/auth';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly registerButton: Locator;
  readonly registerLink: Locator;
  readonly usernameError: Locator;
  readonly passwordError: Locator;
  readonly toastError: Locator;
  readonly loginUrl: string;
  readonly registerUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.loginUrl = `${process.env.FRONTEND_URL}/login`;
    this.registerUrl = `${process.env.FRONTEND_URL}/register`;
    this.usernameInput = page.getByTestId('login-username-input');
    this.passwordInput = page.getByTestId('login-password-input');
    this.signInButton = page.getByTestId('login-submit-button');
    this.registerButton = page.getByTestId('login-register-link');
    this.registerLink = page.getByTestId('register-link');
    this.usernameError = page.getByTestId('login-username-error');
    this.passwordError = page.getByTestId('login-password-error');
    this.toastError = page.getByTestId('toast-description');
  }

  async goto() {
    await this.page.goto(this.loginUrl);
  }

  async login(credentials: LoginDto) {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.signInButton.click();
    await this.page.waitForLoadState('networkidle', { timeout: 2000 }).catch(() => {});
  }

  async clickRegisterButton() {
    await this.registerButton.click();
  }

  async clickRegisterLink() {
    await this.registerLink.click();
  }

  async expectToBeOnLoginPage() {
    await expect(this.page).toHaveURL(this.loginUrl);
  }

  async expectToBeOnRegisterPage() {
    await expect(this.page).toHaveURL(this.registerUrl);
  }

  async expectNotToBeOnLoginPage() {
    await expect(this.page).not.toHaveURL(this.loginUrl);
  }

  async expectUsernameError(message: string) {
    await expect(this.usernameError).toBeVisible();
    await expect(this.usernameError).toHaveText(message);
  }

  async expectPasswordError(message: string) {
    await expect(this.passwordError).toBeVisible();
    await expect(this.passwordError).toHaveText(message);
  }

  async expectToastError(message: string) {
    await expect(this.toastError).toBeVisible();
    await expect(this.toastError).toHaveText(message);
  }
}
