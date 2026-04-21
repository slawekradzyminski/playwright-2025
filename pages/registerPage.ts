import { expect, type Locator, type Page } from '@playwright/test';
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
  }

  async assertThatRegisterFormIsVisible(): Promise<void> {
    await expect(this.title).toHaveText('Create your account');
    await expect(this.usernameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }
}
