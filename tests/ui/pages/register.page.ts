import type { Locator, Page } from '@playwright/test';
import type { RegisterFormData } from '../constants/register.ui.constants';
import { REGISTER_MESSAGES, REGISTER_URL } from '../constants/register.ui.constants';
import { LoggedOutHeaderComponent } from '../components/logged-out-header.component';
import { ToastComponent } from '../components/toast.component';

export class RegisterPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly submitButton: Locator;
  readonly signInLink: Locator;
  readonly validationAlert: Locator;
  readonly toast: ToastComponent;
  readonly header: LoggedOutHeaderComponent;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByTestId('register-title').filter({ hasText: REGISTER_MESSAGES.heading });
    this.usernameInput = page.getByTestId('register-username-input');
    this.emailInput = page.getByTestId('register-email-input');
    this.passwordInput = page.getByTestId('register-password-input');
    this.firstNameInput = page.getByTestId('register-firstname-input');
    this.lastNameInput = page.getByTestId('register-lastname-input');
    this.submitButton = page.getByTestId('register-submit-button');
    this.signInLink = page.getByTestId('register-login-link');
    this.validationAlert = page.getByRole('alert');
    this.toast = new ToastComponent(page);
    this.header = new LoggedOutHeaderComponent(page);
  }

  async goto(): Promise<void> {
    await this.page.goto(REGISTER_URL);
  }

  async register(formData: RegisterFormData): Promise<void> {
    await this.usernameInput.fill(formData.username);
    await this.emailInput.fill(formData.email);
    await this.passwordInput.fill(formData.password);
    await this.firstNameInput.fill(formData.firstName);
    await this.lastNameInput.fill(formData.lastName);
    await this.submitButton.click();
  }

  async clickSignInLink(): Promise<void> {
    await this.signInLink.click();
  }

  getValidationError(message: string): Locator {
    return this.validationAlert.filter({ hasText: message });
  }
}
