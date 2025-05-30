import { expect, type Locator, type Page } from '@playwright/test';
import type { LoginDto } from '../types/auth';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly registerButton: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.registerLink = page.getByRole('link', { name: 'Register' });
  }

  async goto() {
    await this.page.goto('http://localhost:8081/login');
  }

  async login(credentials: LoginDto) {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.signInButton.click();
  }

  async goToRegisterPageViaButton() {
    await this.registerButton.click();
  }

  async goToRegisterPageViaLink() {
    await this.registerLink.click();
  }

  async expectToBeOnLoginPage() {
    await expect(this.page).toHaveURL('http://localhost:8081/login');
  }

  async expectToNotBeOnLoginPage() {
    await this.page.waitForURL(url => !url.toString().includes('/login'), { timeout: 10000 });
    await expect(this.page).not.toHaveURL('http://localhost:8081/login');
  }

  async expectToBeOnRegisterPage() {
    await expect(this.page).toHaveURL('http://localhost:8081/register');
  }

  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }
} 