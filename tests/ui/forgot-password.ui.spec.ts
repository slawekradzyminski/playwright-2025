import { test, expect } from '@playwright/test';
import {
  FORGOT_PASSWORD_MESSAGES,
  FORGOT_PASSWORD_URL,
  LOGIN_URL,
} from './constants/forgot-password.ui.constants';
import { ForgotPasswordPage } from './pages/forgot-password.page';
import { LoginPage } from './pages/login.page';

test.describe('Forgot Password UI tests', () => {
  let forgotPasswordPage: ForgotPasswordPage;

  test.beforeEach(async ({ page }) => {
    forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.goto();
    await expect(forgotPasswordPage.heading).toBeVisible();
  });

  test('should request password reset and show success toast', async ({ page }) => {
    // when
    await forgotPasswordPage.submit('admin');

    // then
    await expect(page).toHaveURL(FORGOT_PASSWORD_URL);
    await forgotPasswordPage.toast.expectTitle(FORGOT_PASSWORD_MESSAGES.successToastTitle);
    await forgotPasswordPage.toast.expectMessage(FORGOT_PASSWORD_MESSAGES.successToastMessage);
  });

  test('should show validation error for missing identifier', async ({ page }) => {
    // when
    await forgotPasswordPage.submitEmpty();

    // then
    await expect(page).toHaveURL(FORGOT_PASSWORD_URL);
    await expect(
      forgotPasswordPage.getValidationError(FORGOT_PASSWORD_MESSAGES.identifierRequired),
    ).toBeVisible();
  });

  test('should navigate to login page when back to login button is clicked', async ({ page }) => {
    // given
    const loginPage = new LoginPage(page);

    // when
    await forgotPasswordPage.clickBackToLogin();

    // then
    await expect(page).toHaveURL(LOGIN_URL);
    await expect(loginPage.heading).toBeVisible();
  });
});
