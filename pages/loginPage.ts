import { expect, type Locator, type Page } from '@playwright/test';
import type { LoginDto } from '../types/auth';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly registerButton: Locator;
  readonly registerLink: Locator;
  readonly loginUrl: string;
  readonly registerUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.loginUrl = process.env.LOGIN_URL || 'http://localhost:8081/login';
    this.registerUrl = process.env.REGISTER_URL || 'http://localhost:8081/register';
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.registerLink = page.getByRole('link', { name: 'Register' });
  }

  async goto() {
    await this.page.goto(this.loginUrl);
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

  async expectToBeOnLoginPage() {
    await expect(this.page).toHaveURL(this.loginUrl);
  }

  async expectToBeOnRegisterPage() {
    await expect(this.page).toHaveURL(this.registerUrl);
  }

  async expectNotToBeOnLoginPage() {
    await expect(this.page).not.toHaveURL(this.loginUrl);
  }
}
