import { expect, type Locator, type Page } from '@playwright/test';
import type { UserRegisterDto } from '../types/auth';
import { APP_BASE_URL } from '../config/constants';
import { BasePage } from './basePage';
import { LoggedOutHeaderComponent } from './components/loggedOutHeaderComponent';

export class RegisterPage extends BasePage {
  static readonly url = `${APP_BASE_URL}/register`;

  readonly loggedOutHeader: LoggedOutHeaderComponent;

  private readonly title: Locator;
  private readonly usernameInput: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly submitButton: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.loggedOutHeader = new LoggedOutHeaderComponent(page);
    this.title = page.getByTestId('register-title');
    this.usernameInput = page.getByTestId('register-username-input');
    this.emailInput = page.getByTestId('register-email-input');
    this.passwordInput = page.getByTestId('register-password-input');
    this.firstNameInput = page.getByTestId('register-firstname-input');
    this.lastNameInput = page.getByTestId('register-lastname-input');
    this.submitButton = page.getByTestId('register-submit-button');
    this.loginButton = page.getByTestId('register-login-link');
  }

  async open(): Promise<void> {
    await this.page.goto(RegisterPage.url);
  }

  async register(userData: UserRegisterDto): Promise<void> {
    await this.usernameInput.fill(userData.username);
    await this.emailInput.fill(userData.email);
    await this.passwordInput.fill(userData.password);
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.submitButton.click();
  }

  async submitEmptyForm(): Promise<void> {
    await this.submitButton.click();
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async assertThatRegisterFormIsVisible(): Promise<void> {
    await this.loggedOutHeader.assertThatHeaderIsVisible();
    await expect(this.title).toHaveText('Create your account');
    await expect(this.usernameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async assertThatUserDataIsFilled(userData: UserRegisterDto): Promise<void> {
    await expect(this.usernameInput).toHaveValue(userData.username);
    await expect(this.emailInput).toHaveValue(userData.email);
    await expect(this.passwordInput).toHaveValue(userData.password);
    await expect(this.firstNameInput).toHaveValue(userData.firstName);
    await expect(this.lastNameInput).toHaveValue(userData.lastName);
  }

  async assertThatValidationErrorsAreVisible(errors: string[]): Promise<void> {
    for (const error of errors) {
      await expect(this.page.getByRole('alert').filter({ hasText: error })).toBeVisible();
    }
  }
}
