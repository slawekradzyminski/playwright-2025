import { expect, type Locator, type Page } from '@playwright/test';
import type { LoginDto } from '../types/auth';  
import { LoggedOutPage } from './loggedOutPage';

export class LoginPage extends LoggedOutPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly registerButton: Locator;
  readonly registerLink: Locator;
  readonly usernameError: Locator;
  readonly passwordError: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByTestId('login-username-input');
    this.passwordInput = page.getByTestId('login-password-input');
    this.signInButton = page.getByTestId('login-submit-button');
    this.registerButton = page.getByTestId('login-register-link');
    this.registerLink = page.getByTestId('register-link');
    this.usernameError = page.getByTestId('login-username-error');
    this.passwordError = page.getByTestId('login-password-error');
  }

  async login(credentials: LoginDto) {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.signInButton.click();
  }

  async clickRegisterButton() {
    await this.registerButton.click();
  }

  async clickRegisterLink() {
    await this.registerLink.click();
  }

  async expectUsernameError(message: string) {
    await expect(this.usernameError).toHaveText(message);
  }

  async expectPasswordError(message: string) {
    await expect(this.passwordError).toHaveText(message);
  }

}

