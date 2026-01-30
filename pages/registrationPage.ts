import { expect, type Locator, type Page } from '@playwright/test';
import type { UserRegisterDto } from '../types/auth';

export class RegisterPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly createAccountButton: Locator;
  readonly signInButton: Locator;
  readonly toastError: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly registerUrl: string;
  readonly loginUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.registerUrl = `${process.env.FRONTEND_URL}/register`;
    this.loginUrl = `${process.env.FRONTEND_URL}/login`;
    this.usernameInput = page.getByTestId('register-username-input');
    this.emailInput = page.getByTestId('register-email-input');
    this.passwordInput = page.getByTestId('register-password-input');
    this.firstNameInput = page.getByTestId('register-firstname-input');
    this.lastNameInput = page.getByTestId('register-lastname-input');
    this.createAccountButton = page.getByTestId('register-submit-button');
    this.signInButton = page.getByTestId('register-login-link');
    this.toastError = page.getByTestId('toast-description');
    this.emailError = page.getByTestId('register-email-error');
    this.passwordError = page.getByTestId('register-password-error');
  }

  async goto() {
    await this.page.goto(this.registerUrl);
  }

  async register(user: UserRegisterDto) {
    await this.usernameInput.fill(user.username);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.createAccountButton.click();
  }

  async clickSignInButton() {
    await this.signInButton.click();
  }

  async expectToBeOnRegisterPage() {
    await expect(this.page).toHaveURL(this.registerUrl);
  }

  async expectToBeOnLoginPage() {
    await expect(this.page).toHaveURL(this.loginUrl);
  }

  async expectNotToBeOnRegisterPage() {
    await expect(this.page).not.toHaveURL(this.registerUrl);
  }

  async expectToastError(message: string) {
    await expect(this.toastError).toBeVisible();
    await expect(this.toastError).toHaveText(message);
  }

  async expectEmailError(message: string) {
    await expect(this.emailError).toBeVisible();
    await expect(this.emailError).toHaveText(message);
  }

  async expectPasswordError(message: string) {
    await expect(this.passwordError).toBeVisible();
    await expect(this.passwordError).toHaveText(message);
  }
}
