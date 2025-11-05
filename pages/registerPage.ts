import { Page, Locator } from '@playwright/test';
import type { UserRegisterDto } from '../types/auth';
import { UI_BASE_URL } from '../config/constants';
import { BasePage } from './basePage';

export class RegisterPage extends BasePage {
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly rolesSelect: Locator;
  readonly submitButton: Locator;
  readonly loginLink: Locator;
  readonly registerLoginLink: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByTestId('register-username-input');
    this.emailInput = page.getByTestId('register-email-input');
    this.passwordInput = page.getByTestId('register-password-input');
    this.firstNameInput = page.getByTestId('register-firstname-input');
    this.lastNameInput = page.getByTestId('register-lastname-input');
    this.rolesSelect = page.getByTestId('register-roles-select');
    this.submitButton = page.getByTestId('register-submit-button');
    this.loginLink = page.getByTestId('login-link');
    this.registerLoginLink = page.getByTestId('register-login-link');
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

  async clickLoginLink() {
    await this.loginLink.click();
  }

  async clickRegisterLoginLink() {
    await this.registerLoginLink.click();
  }

  async register(registerData: UserRegisterDto) {
    await this.fillUsername(registerData.username);
    await this.fillEmail(registerData.email);
    await this.fillPassword(registerData.password);
    await this.fillFirstName(registerData.firstName);
    await this.fillLastName(registerData.lastName);
    await this.clickSubmit();
  }

  get url() {
    return `${UI_BASE_URL}/register`;
  }
}
