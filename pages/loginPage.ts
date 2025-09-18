import { expect, type Locator, type Page } from '@playwright/test';
import type { LoginDto } from '../types/auth';
import { FRONTEND_URL } from '../config/constants';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly registerButton: Locator;
  readonly registerLink: Locator;
  readonly usernameError: Locator;
  readonly passwordError: Locator;
  readonly toastViewport: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByTestId('login-username-input');
    this.passwordInput = page.getByTestId('login-password-input');
    this.signInButton = page.getByTestId('login-submit-button');
    this.registerButton = page.getByTestId('login-register-link');
    this.registerLink = page.getByTestId('register-link');
    this.usernameError = page.getByTestId('login-username-error');
    this.passwordError = page.getByTestId('login-password-error');
    this.toastViewport = page.getByTestId('toast-viewport');
  }

  async goto() {
    await this.page.goto(`${FRONTEND_URL}/login`);
  }

  async login(credentials: LoginDto) {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.signInButton.click();
  }

  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickSignIn() {
    await this.signInButton.click();
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

  async expectToNotBeOnLoginPage() {
    await expect(this.page).not.toHaveURL(`${FRONTEND_URL}/login`);
  }

  async expectToBeOnRegisterPage() {
    await expect(this.page).toHaveURL(`${FRONTEND_URL}/register`);
  }

  async expectUsernameRequiredError() {
    await expect(this.usernameError).toBeVisible();
    await expect(this.usernameError).toHaveText('Username is required');
  }

  async expectPasswordRequiredError() {
    await expect(this.passwordError).toBeVisible();
    await expect(this.passwordError).toHaveText('Password is required');
  }

  async expectInvalidCredentialsError() {
    await expect(this.toastViewport).toContainText('Invalid username/password');
  }

  async expectNoUsernameError() {
    await expect(this.usernameError).not.toBeVisible();
  }

  async expectNoPasswordError() {
    await expect(this.passwordError).not.toBeVisible();
  }

  async expectUsernameMinLengthError() {
    await expect(this.usernameError).toBeVisible();
    await expect(this.usernameError).toHaveText('Username must be at least 4 characters');
  }
}
