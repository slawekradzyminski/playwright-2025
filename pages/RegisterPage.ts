import { expect, type Locator, type Page } from '@playwright/test';
import type { RegisterDto } from '../types/auth';
import { FRONTEND_URL } from '../config/constants';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly submitButton: Locator;
  readonly loginLink: Locator;
  readonly toastDescription: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByTestId('register-username-input');
    this.emailInput = page.getByTestId('register-email-input');
    this.passwordInput = page.getByTestId('register-password-input');
    this.firstNameInput = page.getByTestId('register-firstname-input');
    this.lastNameInput = page.getByTestId('register-lastname-input');
    this.submitButton = page.getByTestId('register-submit-button');
    this.loginLink = page.getByTestId('register-login-link');
    this.toastDescription = page.getByTestId('toast-description');
  }

  async goto() {
    await this.page.goto(`${FRONTEND_URL}/register`);
  }

  async register(userData: RegisterDto) {
    await this.usernameInput.fill(userData.username);
    await this.emailInput.fill(userData.email);
    await this.passwordInput.fill(userData.password);
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.submitButton.click();
  }

  async fillPartialForm(userData: Partial<RegisterDto>) {
    if (userData.username) await this.usernameInput.fill(userData.username);
    if (userData.email) await this.emailInput.fill(userData.email);
    if (userData.password) await this.passwordInput.fill(userData.password);
    if (userData.firstName) await this.firstNameInput.fill(userData.firstName);
    if (userData.lastName) await this.lastNameInput.fill(userData.lastName);
    await this.submitButton.click();
  }

  async clickLoginLink() {
    await this.loginLink.click();
  }

  async expectSuccessMessage(message: string) {
    await expect(this.toastDescription).toBeVisible();
    await expect(this.toastDescription).toHaveText(message);
  }

  async expectErrorMessage(message: string) {
    await expect(this.toastDescription).toBeVisible();
    await expect(this.toastDescription).toHaveText(message);
  }

  async expectValidationError(errorText: string) {
    await expect(this.page.getByText(errorText)).toBeVisible();
  }
} 