import { expect, type Locator, type Page } from '@playwright/test';
import type { UserRegisterDto } from '../types/auth';
import { LoggedOutPage } from './abstract/loggedOutPage';

export class RegisterPage extends LoggedOutPage {
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly createAccountButton: Locator;
  readonly signInButton: Locator;
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
    this.createAccountButton = page.getByTestId('register-submit-button');
    this.signInButton = page.getByTestId('register-login-link');
    this.usernameError = page.getByTestId('register-username-error');
    this.emailError = page.getByTestId('register-email-error');
    this.passwordError = page.getByTestId('register-password-error');
    this.firstNameError = page.getByTestId('register-firstname-error');
    this.lastNameError = page.getByTestId('register-lastname-error');
  }

  async register(userData: UserRegisterDto) {
    await this.usernameInput.fill(userData.username);
    await this.emailInput.fill(userData.email);
    await this.passwordInput.fill(userData.password);
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.createAccountButton.click();
  }

  async clickSignInButton() {
    await this.signInButton.click();
  }

  async expectUsernameError(message: string) {
    await expect(this.usernameError).toHaveText(message);
  }

  async expectEmailError(message: string) {
    await expect(this.emailError).toHaveText(message);
  }

  async expectPasswordError(message: string) {
    await expect(this.passwordError).toHaveText(message);
  }

  async expectFirstNameError(message: string) {
    await expect(this.firstNameError).toHaveText(message);
  }

  async expectLastNameError(message: string) {
    await expect(this.lastNameError).toHaveText(message);
  }

}

