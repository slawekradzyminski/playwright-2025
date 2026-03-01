import { test, expect } from '@playwright/test';
import { generateUser } from '../../generators/userGenerator';
import type { ForgotPasswordResponseDto } from '../../types/auth';
import { forgotPasswordRequest } from '../../http/password-reset/forgotPasswordRequest';
import { signupRequest } from '../../http/users/signupRequest';
import { HomePage } from './pages/home.page';
import { LoginPage } from './pages/login.page';
import { ResetPage } from './pages/reset.page';
import { HOME_URL, LOGIN_URL, RESET_MESSAGES, RESET_URL } from './constants/reset.ui.constants';

test.describe('Reset Password UI tests', () => {
  let resetPage: ResetPage;

  test.beforeEach(async ({ page }) => {
    resetPage = new ResetPage(page);
    await resetPage.goto();
    await expect(resetPage.heading).toBeVisible();
  });

  test('should reset password with valid token and allow login with new password', async ({
    page,
    request,
  }) => {
    // given
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const user = generateUser();

    const signupResponse = await signupRequest(request, user);
    expect(signupResponse.status()).toBe(201);

    const forgotResponse = await forgotPasswordRequest(request, { identifier: user.username });
    expect(forgotResponse.status()).toBe(202);
    const forgotResponseBody = (await forgotResponse.json()) as ForgotPasswordResponseDto;
    const resetToken = forgotResponseBody.token;
    expect(resetToken).toBeTruthy();

    const newPassword = 'NewPassword123!';

    // when
    await resetPage.submit({
      token: resetToken ?? '',
      newPassword,
      confirmPassword: newPassword,
    });

    // then
    await expect(page).toHaveURL(LOGIN_URL);
    await expect(loginPage.heading).toBeVisible();
    await resetPage.toast.expectTitle(RESET_MESSAGES.successToastTitle);
    await resetPage.toast.expectMessage(RESET_MESSAGES.successToastMessage);

    await loginPage.login({ username: user.username, password: newPassword });
    await expect(page).toHaveURL(HOME_URL);
    await expect(homePage.logoutButton).toBeVisible();
  });

  test('should show validation error when passwords do not match', async ({ page }) => {
    // when
    await resetPage.submit({
      token: 'placeholder-token',
      newPassword: 'NewPassword123!',
      confirmPassword: 'MismatchPassword123!',
    });

    // then
    await expect(page).toHaveURL(RESET_URL);
    await expect(resetPage.getValidationError(RESET_MESSAGES.passwordsMustMatch)).toBeVisible();
  });

  test('should navigate to login page when back to login button is clicked', async ({ page }) => {
    // given
    const loginPage = new LoginPage(page);

    // when
    await resetPage.clickBackToLogin();

    // then
    await expect(page).toHaveURL(LOGIN_URL);
    await expect(loginPage.heading).toBeVisible();
  });
});
