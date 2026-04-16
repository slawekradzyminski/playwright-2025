import { type Locator, type Page } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';
import type { RegisterDto } from '../types/auth';
import { BasePage } from './BasePage';
import { ToastComponent } from './components/ToastComponent';

export class RegisterPage extends BasePage {
  static readonly url = `${APP_BASE_URL}/register`;

  readonly page: Page;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly createAccountButton: Locator;
  readonly toast: ToastComponent;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.usernameInput = page.getByTestId('register-username-input');
    this.emailInput = page.getByTestId('register-email-input');
    this.passwordInput = page.getByTestId('register-password-input');
    this.firstNameInput = page.getByTestId('register-firstname-input');
    this.lastNameInput = page.getByTestId('register-lastname-input');
    this.createAccountButton = page.getByTestId('register-submit-button');
    this.toast = new ToastComponent(page);
  }

  async goto() {
    await this.page.goto(RegisterPage.url);
  }

  async register(user: RegisterDto) {
    await this.fillRegisterForm(user);
    await this.submit();
  }

  async fillRegisterForm(user: RegisterDto) {
    await this.usernameInput.fill(user.username);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
  }

  async submit() {
    await this.createAccountButton.click();
  }

}
