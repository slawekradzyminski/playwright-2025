import type { Locator, Page } from '@playwright/test';
import { FORGOT_PASSWORD_MESSAGES, FORGOT_PASSWORD_URL } from '../constants/forgot-password.ui.constants';
import { ToastComponent } from '../components/toast.component';

export class ForgotPasswordPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly identifierInput: Locator;
  readonly submitButton: Locator;
  readonly backToLoginButton: Locator;
  readonly validationAlert: Locator;
  readonly toast: ToastComponent;

  constructor(page: Page) {
    this.page = page;
    this.heading = page
      .getByTestId('forgot-title')
      .filter({ hasText: FORGOT_PASSWORD_MESSAGES.heading });
    this.identifierInput = page.getByTestId('forgot-identifier-input');
    this.submitButton = page.getByTestId('forgot-submit-button');
    this.backToLoginButton = page.getByTestId('forgot-back-to-login');
    this.validationAlert = page.getByRole('alert');
    this.toast = new ToastComponent(page);
  }

  async goto(): Promise<void> {
    await this.page.goto(FORGOT_PASSWORD_URL);
  }

  async submit(identifier: string): Promise<void> {
    await this.identifierInput.fill(identifier);
    await this.submitButton.click();
  }

  async submitEmpty(): Promise<void> {
    await this.submitButton.click();
  }

  async clickBackToLogin(): Promise<void> {
    await this.backToLoginButton.click();
  }

  getValidationError(message: string): Locator {
    return this.validationAlert.filter({ hasText: message });
  }
}
