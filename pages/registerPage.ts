import { expect, type Locator, type Page } from '@playwright/test';
import type { UserRegisterDto } from '../types/auth';
import { FRONTEND_URL } from '../config/constants';
import { LoggedOutPage } from './loggedOutPage';

export class RegisterPage extends LoggedOutPage {
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly submitButton: Locator;
  readonly signInLink: Locator;
  readonly usernameError: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly firstNameError: Locator;
  readonly lastNameError: Locator;
  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByTestId('register-username-input');
    this.emailInput = page.getByTestId('register-email-input');
    this.passwordInput = page.getByTestId('register-password-input');
    this.firstNameInput = page.getByTestId('register-firstname-input');
    this.lastNameInput = page.getByTestId('register-lastname-input');
    this.submitButton = page.getByTestId('register-submit-button');
    this.signInLink = page.getByTestId('register-login-link');
    this.usernameError = page.getByTestId('register-username-error');
    this.emailError = page.getByTestId('register-email-error');
    this.passwordError = page.getByTestId('register-password-error');
    this.firstNameError = page.getByTestId('register-firstname-error');
    this.lastNameError = page.getByTestId('register-lastname-error');
  }

  async goto() {
    await this.page.goto(`${FRONTEND_URL}/register`);
  }

  async register(userData: UserRegisterDto) {
    await this.usernameInput.fill(userData.username);
    await this.emailInput.fill(userData.email);
    await this.passwordInput.fill(userData.password);
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.submitButton.click();
  }

  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async fillFirstName(firstName: string) {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string) {
    await this.lastNameInput.fill(lastName);
  }

  async clickSubmit() {
    await this.submitButton.click();
  }

  async clickSignInLink() {
    await this.signInLink.click();
  }

  async expectUsernameRequiredError() {
    await expect(this.usernameError).toBeVisible();
    await expect(this.usernameError).toHaveText('Username is required');
  }

  async expectEmailRequiredError() {
    await expect(this.emailError).toBeVisible();
    await expect(this.emailError).toHaveText('Email is required');
  }

  async expectPasswordRequiredError() {
    await expect(this.passwordError).toBeVisible();
    await expect(this.passwordError).toHaveText('Password is required');
  }

  async expectFirstNameRequiredError() {
    await expect(this.firstNameError).toBeVisible();
    await expect(this.firstNameError).toHaveText('First name is required');
  }

  async expectLastNameRequiredError() {
    await expect(this.lastNameError).toBeVisible();
    await expect(this.lastNameError).toHaveText('Last name is required');
  }

  async expectUsernameMinLengthError() {
    await expect(this.usernameError).toBeVisible();
    await expect(this.usernameError).toHaveText('Username must be at least 4 characters');
  }

  async expectPasswordMinLengthError() {
    await expect(this.passwordError).toBeVisible();
    await expect(this.passwordError).toHaveText('Password must be at least 8 characters');
  }

  async expectFirstNameMinLengthError() {
    await expect(this.firstNameError).toBeVisible();
    await expect(this.firstNameError).toHaveText('First name must be at least 4 characters');
  }

  async expectNoUsernameError() {
    await expect(this.usernameError).not.toBeVisible();
  }

  async expectNoEmailError() {
    await expect(this.emailError).not.toBeVisible();
  }

  async expectNoPasswordError() {
    await expect(this.passwordError).not.toBeVisible();
  }

  async expectNoFirstNameError() {
    await expect(this.firstNameError).not.toBeVisible();
  }

  async expectNoLastNameError() {
    await expect(this.lastNameError).not.toBeVisible();
  }

}
