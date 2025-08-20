import { expect, type Locator, type Page } from '@playwright/test';
import type { UserRegisterDto } from '../types/user';
import { FRONTEND_URL } from './constants';

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
  readonly successToast: Locator;

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
    this.successToast = page.getByTestId('toast-description');
  }

  async goto() {
    await this.page.goto(`${FRONTEND_URL}/register`);
  }

  async fillRegistrationForm(userData: UserRegisterDto) {
    await this.usernameInput.fill(userData.username);
    await this.emailInput.fill(userData.email);
    await this.passwordInput.fill(userData.password);
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
  }

  async register(userData: UserRegisterDto) {
    await this.fillRegistrationForm(userData);
    await this.submitButton.click();
  }

  async clickLoginLink() {
    await this.loginLink.click();
  }

  async expectToBeOnRegisterPage() {
    await expect(this.page).toHaveURL(`${FRONTEND_URL}/register`);
  }

  async expectToBeRedirectedToLogin() {
    await expect(this.page).toHaveURL(`${FRONTEND_URL}/login`);
  }

  async expectUsernameRequiredError() {
    await expect(this.usernameError).toContainText('Username is required');
  }

  async expectEmailRequiredError() {
    await expect(this.emailError).toContainText('Email is required');
  }

  async expectPasswordRequiredError() {
    await expect(this.passwordError).toContainText('Password is required');
  }

  async expectFirstNameRequiredError() {
    await expect(this.firstNameError).toContainText('First name is required');
  }

  async expectLastNameRequiredError() {
    await expect(this.lastNameError).toContainText('Last name is required');
  }

  async expectShortUsernameError() {
    await expect(this.usernameError).toContainText('Username must be at least 4 characters');
  }

  async expectShortFirstNameError() {
    await expect(this.firstNameError).toContainText('First name must be at least 4 characters');
  }

  async expectShortLastNameError() {
    await expect(this.lastNameError).toContainText('Last name must be at least 4 characters');
  }

  async expectInvalidEmailError() {
    await expect(this.emailError).toContainText('Invalid email format');
  }

  async expectShortPasswordError() {
    await expect(this.passwordError).toContainText('Password must be at least 8 characters');
  }

  async expectSuccessfulRegistration() {
    await this.expectToBeRedirectedToLogin();
    await expect(this.successToast).toContainText('Registration successful! You can now log in.');
  }
}
