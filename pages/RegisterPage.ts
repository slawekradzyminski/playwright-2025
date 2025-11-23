import { expect, type Locator, type Page } from '@playwright/test';
import type { UserRegisterDto } from '../types/auth';
import { UI_BASE_URL } from '../config/constants';

export class RegisterPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly submitButton: Locator;
  readonly loginLink: Locator;
  readonly usernameError: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly firstNameError: Locator;
  readonly lastNameError: Locator;
  readonly toastTitle: Locator;
  readonly toastDescription: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByTestId('register-username-input');
    this.emailInput = page.getByTestId('register-email-input');
    this.passwordInput = page.getByTestId('register-password-input');
    this.firstNameInput = page.getByTestId('register-firstname-input');
    this.lastNameInput = page.getByTestId('register-lastname-input');
    this.submitButton = page.getByTestId('register-submit-button');
    this.loginLink = page.getByTestId('register-login-link');
    this.usernameError = page.getByTestId('register-username-error');
    this.emailError = page.getByTestId('register-email-error');
    this.passwordError = page.getByTestId('register-password-error');
    this.firstNameError = page.getByTestId('register-firstname-error');
    this.lastNameError = page.getByTestId('register-lastname-error');
    this.toastTitle = page.getByTestId('toast-title');
    this.toastDescription = page.getByTestId('toast-description');
  }

  async goto() {
    await this.page.goto(`${UI_BASE_URL}/register`);
  }

  async attemptRegister(userData: Omit<UserRegisterDto, 'roles'>) {
    await this.usernameInput.fill(userData.username);
    await this.emailInput.fill(userData.email);
    await this.passwordInput.fill(userData.password);
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.submitButton.click();
  }

  async expectUsernameError(message: string) {
    await expect(this.usernameError).toBeVisible();
    await expect(this.usernameError).toHaveText(message);
  }

  async expectEmailError(message: string) {
    await expect(this.emailError).toBeVisible();
    await expect(this.emailError).toHaveText(message);
  }

  async expectPasswordError(message: string) {
    await expect(this.passwordError).toBeVisible();
    await expect(this.passwordError).toHaveText(message);
  }

  async expectFirstNameError(message: string) {
    await expect(this.firstNameError).toBeVisible();
    await expect(this.firstNameError).toHaveText(message);
  }

  async expectLastNameError(message: string) {
    await expect(this.lastNameError).toBeVisible();
    await expect(this.lastNameError).toHaveText(message);
  }

  async expectToastError(title: string, description: string) {
    await expect(this.toastTitle).toBeVisible();
    await expect(this.toastTitle).toHaveText(title);
    await expect(this.toastDescription).toHaveText(description);
  }

  async expectToastSuccess(title: string, description: string) {
    await expect(this.toastTitle).toBeVisible();
    await expect(this.toastTitle).toHaveText(title);
    await expect(this.toastDescription).toHaveText(description);
  }

  async clickLoginLink() {
    await this.loginLink.click();
  }
}

