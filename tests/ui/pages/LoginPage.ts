import { type Page, type Locator, expect } from '@playwright/test';

const APP_BASE_URL = process.env.APP_BASE_URL || '';

export class LoginPage {
  readonly page: Page;
  readonly url: string;

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly registerButton: Locator;
  readonly registerNavLink: Locator;
  readonly usernameError: Locator;
  readonly passwordError: Locator;
  readonly toastTitle: Locator;
  readonly toastDescription: Locator;

  constructor(page: Page) {
    this.page = page;
    this.url = `${APP_BASE_URL}/login`;

    this.usernameInput = page.getByTestId('login-username-input');
    this.passwordInput = page.getByTestId('login-password-input');
    this.submitButton = page.getByTestId('login-submit-button');
    this.registerButton = page.getByTestId('login-register-link');
    this.registerNavLink = page.getByTestId('register-link');
    this.usernameError = page.getByTestId('login-username-error');
    this.passwordError = page.getByTestId('login-password-error');
    this.toastTitle = page.getByTestId('toast-title');
    this.toastDescription = page.getByTestId('toast-description');
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectToBeOnLoginPage() {
    await expect(this.page).toHaveURL(this.url);
  }

  async expectToBeRedirectedAway() {
    await expect(this.page).not.toHaveURL(this.url);
  }
}
