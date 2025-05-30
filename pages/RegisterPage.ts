import { expect, type Locator, type Page } from '@playwright/test';
import type { RegisterDto } from '../types/auth';

export class RegisterPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly createAccountButton: Locator;
  readonly signInButton: Locator;
  readonly registerTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.createAccountButton = page.getByRole('button', { name: 'Create account' });
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.registerTitle = page.getByRole('heading', { name: 'Create your account' });
  }

  async goto() {
    await this.page.goto('http://localhost:8081/register');
  }

  async register(userData: RegisterDto) {
    await this.usernameInput.fill(userData.username);
    await this.emailInput.fill(userData.email);
    await this.passwordInput.fill(userData.password);
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.createAccountButton.click();
  }

  async fillPartialForm(userData: Partial<RegisterDto>) {
    if (userData.username !== undefined) {
      await this.usernameInput.fill(userData.username);
    }
    if (userData.email !== undefined) {
      await this.emailInput.fill(userData.email);
    }
    if (userData.password !== undefined) {
      await this.passwordInput.fill(userData.password);
    }
    if (userData.firstName !== undefined) {
      await this.firstNameInput.fill(userData.firstName);
    }
    if (userData.lastName !== undefined) {
      await this.lastNameInput.fill(userData.lastName);
    }
  }

  async clickCreateAccount() {
    await this.createAccountButton.click();
  }

  async goToLoginPage() {
    await this.signInButton.click();
  }

  async expectToBeOnRegisterPage() {
    await expect(this.page).toHaveURL('http://localhost:8081/register');
    await expect(this.registerTitle).toBeVisible();
  }

  async expectToBeOnLoginPage() {
    await expect(this.page).toHaveURL('http://localhost:8081/login');
  }

  async expectToNotBeOnRegisterPage() {
    await this.page.waitForURL(url => !url.toString().includes('/register'), { timeout: 10000 });
    await expect(this.page).not.toHaveURL('http://localhost:8081/register');
  }

  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }
} 