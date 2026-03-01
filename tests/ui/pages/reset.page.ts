import type { Locator, Page } from '@playwright/test';
import { RESET_MESSAGES, RESET_URL } from '../constants/reset.ui.constants';
import { ToastComponent } from '../components/toast.component';

type ResetFormData = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

export class ResetPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly tokenInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly backToLoginButton: Locator;
  readonly validationAlert: Locator;
  readonly toast: ToastComponent;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByTestId('reset-title').filter({ hasText: RESET_MESSAGES.heading });
    this.tokenInput = page.getByTestId('reset-token-input');
    this.newPasswordInput = page.getByTestId('reset-password-input');
    this.confirmPasswordInput = page.getByTestId('reset-confirm-password-input');
    this.submitButton = page.getByTestId('reset-submit-button');
    this.backToLoginButton = page.getByTestId('reset-back-to-login');
    this.validationAlert = page.getByRole('alert');
    this.toast = new ToastComponent(page);
  }

  async goto(): Promise<void> {
    await this.page.goto(RESET_URL);
  }

  async submit(formData: ResetFormData): Promise<void> {
    await this.tokenInput.fill(formData.token);
    await this.newPasswordInput.fill(formData.newPassword);
    await this.confirmPasswordInput.fill(formData.confirmPassword);
    await this.submitButton.click();
  }

  async clickBackToLogin(): Promise<void> {
    await this.backToLoginButton.click();
  }

  getValidationError(message: string): Locator {
    return this.validationAlert.filter({ hasText: message });
  }
}
