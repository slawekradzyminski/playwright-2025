import { expect, type Locator, type Page } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';
import type { LoginDto } from '../types/auth';
import { BasePage } from './BasePage';
import { ToastComponent } from './components/ToastComponent';

export class LoginPage extends BasePage {
  static readonly url = `${APP_BASE_URL}/login`;

  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly ssoButton: Locator;
  readonly googleButton: Locator;
  readonly githubButton: Locator;
  readonly registerButton: Locator;
  readonly registerNavigationLink: Locator;
  readonly loginPasswordError: Locator;
  readonly toast: ToastComponent;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.usernameInput = page.getByTestId('login-username-input');
    this.passwordInput = page.getByTestId('login-password-input');
    this.submitButton = page.getByTestId('login-submit-button');
    this.ssoButton = page.getByTestId('login-sso-button');
    this.googleButton = page.getByTestId('login-google-button');
    this.githubButton = page.getByTestId('login-github-button');
    this.registerButton = page.getByTestId('login-register-link');
    this.registerNavigationLink = page.getByTestId('register-link');
    this.loginPasswordError = page.getByTestId('login-password-error');
    this.toast = new ToastComponent(page);
  }

  async goto() {
    await this.page.goto(LoginPage.url);
  }

  async login(credentials: LoginDto) {
    await this.fillLoginForm(credentials);
    await this.submit();
  }

  async fillLoginForm(credentials: LoginDto) {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async clickSsoButton() {
    await this.ssoButton.click();
  }

  async clickGoogleButton() {
    await this.googleButton.click();
  }

  async clickGitHubButton() {
    await this.githubButton.click();
  }

  async clickRegisterButton() {
    await this.registerButton.click();
  }

  async clickRegisterNavigationLink() {
    await this.registerNavigationLink.click();
  }

  async expectPasswordErrorToHaveText(expectedText: string) {
    await expect(this.loginPasswordError).toHaveText(expectedText);
  }

}
