import { expect, type Locator, type Page } from '@playwright/test';
import type { UserRegisterDto } from '../types/auth';
import { BACKEND_BASE_URL } from '../config/constants';

export class RegisterPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly createAccountButton: Locator;
  readonly signInButton: Locator;
  readonly loginLink: Locator;
  readonly registerLink: Locator;
  readonly alreadyHaveAccountText: Locator;
  
  private readonly registerUrl = `${BACKEND_BASE_URL}/register`;
  private readonly loginUrl = `${BACKEND_BASE_URL}/login`;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByTestId('register-title');
    this.usernameInput = page.getByTestId('register-username-input');
    this.emailInput = page.getByTestId('register-email-input');
    this.passwordInput = page.getByTestId('register-password-input');
    this.firstNameInput = page.getByTestId('register-firstname-input');
    this.lastNameInput = page.getByTestId('register-lastname-input');
    this.createAccountButton = page.getByTestId('register-submit-button');
    this.signInButton = page.getByTestId('register-login-link');
    this.loginLink = page.getByTestId('login-link');
    this.registerLink = page.getByTestId('register-link');
    this.alreadyHaveAccountText = page.getByTestId('register-login-link-container');
  }

  async goto() {
    await this.page.goto(this.registerUrl);
  }

  async fillRegistrationForm(user: UserRegisterDto) {
    await this.usernameInput.fill(user.username);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
  }

  async fillPartialForm(data: Partial<UserRegisterDto>) {
    if (data.username !== undefined) {
      await this.usernameInput.fill(data.username);
    }
    if (data.email !== undefined) {
      await this.emailInput.fill(data.email);
    }
    if (data.password !== undefined) {
      await this.passwordInput.fill(data.password);
    }
    if (data.firstName !== undefined) {
      await this.firstNameInput.fill(data.firstName);
    }
    if (data.lastName !== undefined) {
      await this.lastNameInput.fill(data.lastName);
    }
  }

  async clickCreateAccount() {
    await this.createAccountButton.click();
  }

  async register(user: UserRegisterDto) {
    await this.fillRegistrationForm(user);
    await this.clickCreateAccount();
  }

  async clickSignInButton() {
    await this.signInButton.click();
  }

  async clickLoginLink() {
    await this.loginLink.click();
  }

  async expectToBeOnRegisterPage() {
    await expect(this.page).toHaveURL(this.registerUrl);
  }

  async expectToBeOffRegisterPage() {
    await expect(this.page).not.toHaveURL(this.registerUrl);
  }

  async expectToBeOnLoginPage() {
    await expect(this.page).toHaveURL(this.loginUrl);
  }

  async expectAllElementsVisible() {
    await expect(this.heading).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.createAccountButton).toBeVisible();
    await expect(this.alreadyHaveAccountText).toBeVisible();
  }

  async expectValidationError(message: string) {
    await expect(this.page.getByRole('alert').filter({ hasText: message })).toBeVisible();
  }

  async expectValidationErrors(messages: string[]) {
    for (const message of messages) {
      await this.expectValidationError(message);
    }
  }
}
