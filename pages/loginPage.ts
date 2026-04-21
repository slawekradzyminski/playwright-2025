import { expect, type Locator, type Page } from '@playwright/test';
import type { LoginDto } from '../types/auth';
import { BasePage } from './basePage';
import { LoggedOutHeaderComponent } from './components/loggedOutHeaderComponent';
import { ToastComponent } from './components/toastComponent';

export class LoginPage extends BasePage {
  static readonly url = '/login';

  readonly loggedOutHeader: LoggedOutHeaderComponent;
  readonly toast: ToastComponent;

  private readonly title: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  private readonly registerButton: Locator;

  constructor(page: Page) {
    super(page);
    this.loggedOutHeader = new LoggedOutHeaderComponent(page);
    this.toast = new ToastComponent(page);
    this.title = page.getByTestId('login-title');
    this.usernameInput = page.getByTestId('login-username-input');
    this.passwordInput = page.getByTestId('login-password-input');
    this.submitButton = page.getByTestId('login-submit-button');
    this.registerButton = page.getByTestId('login-register-link');
  }

  async open(): Promise<void> {
    await this.page.goto(LoginPage.url);
  }

  async login(credentials: LoginDto): Promise<void> {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.submitButton.click();
  }

  async clickRegisterButton(): Promise<void> {
    await this.registerButton.click();
  }

  async assertThatLoginFormIsVisible(): Promise<void> {
    await this.loggedOutHeader.assertThatHeaderIsVisible();
    await expect(this.title).toHaveText('Sign in to your account');
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async assertThatCredentialsAreFilled(credentials: LoginDto): Promise<void> {
    await expect(this.usernameInput).toHaveValue(credentials.username);
    await expect(this.passwordInput).toHaveValue(credentials.password);
  }
}
