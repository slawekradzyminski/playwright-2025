import { expect, type Locator, type Page } from '@playwright/test';
import type { LoginDto } from '../types/auth';
import { BACKEND_BASE_URL } from '../config/constants';

export class LoginPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly registerButton: Locator;
  readonly registerLink: Locator;
  readonly noAccountText: Locator;
  
  private readonly loginUrl = `${BACKEND_BASE_URL}/login`;
  private readonly registerUrl = `${BACKEND_BASE_URL}/register`;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByTestId('login-title');
    this.usernameInput = page.getByTestId('login-username-input');
    this.passwordInput = page.getByTestId('login-password-input');
    this.signInButton = page.getByTestId('login-submit-button');
    this.registerButton = page.getByTestId('login-register-link');
    this.registerLink = page.getByTestId('register-link');
    this.noAccountText = page.getByTestId('login-register-link-container');
  }

  async goto() {
    await this.page.goto(this.loginUrl);
  }

  async fillCredentials(credentials: LoginDto) {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
  }

  async fillCredentialsPartial(username?: string, password?: string) {
    if (username !== undefined) {
      await this.usernameInput.fill(username);
    }
    if (password !== undefined) {
      await this.passwordInput.fill(password);
    }
  }

  async clickSignIn() {
    await this.signInButton.click();
  }

  async login(credentials: LoginDto) {
    await this.fillCredentials(credentials);
    await this.clickSignIn();
  }

  async loginWithKeyboard(credentials: LoginDto) {
    await this.usernameInput.fill(credentials.username);
    await this.page.keyboard.press('Tab');
    await this.passwordInput.fill(credentials.password);
    await this.page.keyboard.press('Enter');
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

  async expectToBeOffLoginPage() {
    await expect(this.page).not.toHaveURL(this.loginUrl);
  }

  async expectToBeOnRegisterPage() {
    await expect(this.page).toHaveURL(this.registerUrl);
  }

  async expectAllElementsVisible() {
    await expect(this.heading).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
    await expect(this.registerButton).toBeVisible();
    await expect(this.noAccountText).toBeVisible();
  }
}
