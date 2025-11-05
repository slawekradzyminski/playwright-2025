import { Page, Locator } from '@playwright/test';
import type { LoginDto } from '../types/auth';
import { UI_BASE_URL } from '../config/constants';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly registerLink: Locator;
  readonly loginRegisterLink: Locator;
  readonly usernameErrorAlert: Locator;
  readonly passwordErrorAlert: Locator;
  readonly toastNotification: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByTestId('login-username-input');
    this.passwordInput = page.getByTestId('login-password-input');
    this.submitButton = page.getByTestId('login-submit-button');
    this.registerLink = page.getByTestId('register-link');
    this.loginRegisterLink = page.getByTestId('login-register-link');
    this.usernameErrorAlert = page.getByTestId('login-username-input').locator('..').getByRole('alert');
    this.passwordErrorAlert = page.getByTestId('login-password-input').locator('..').getByRole('alert');
    this.toastNotification = page.getByRole('region', { name: 'Notifications (F8)' }).getByRole('listitem').last();
  }

  async goto() {
    await this.page.goto(`${UI_BASE_URL}/login`);
  }

  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickSubmit() {
    await this.submitButton.click();
  }

  async clickRegisterLink() {
    await this.registerLink.click();
  }

  async clickLoginRegisterLink() {
    await this.loginRegisterLink.click();
  }

  async login(credentials: LoginDto) {
    await this.fillUsername(credentials.username);
    await this.fillPassword(credentials.password);
    await this.clickSubmit();
  }

  get url() {
    return `${UI_BASE_URL}/login`;
  }

  get homepageUrl() {
    return `${UI_BASE_URL}/`;
  }

  async getUsernameError() {
    return await this.usernameErrorAlert.textContent();
  }

  async getPasswordError() {
    return await this.passwordErrorAlert.textContent();
  }

  async getToastError() {
    return await this.toastNotification.textContent();
  }
}
