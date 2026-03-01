import { test, expect } from '@playwright/test';
import {
  createValidRegisterFormData,
  createInvalidEmailRegisterData,
  createMissingEmailRegisterData,
  LOGIN_URL,
  REGISTER_MESSAGES,
  REGISTER_URL,
} from './constants/register.ui.constants';
import { RegisterPage } from './pages/register.page';
import { LoginPage } from './pages/login.page';

test.describe('Register UI tests', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('should successfully register with valid data', async ({ page }) => {
    // given
    const loginPage = new LoginPage(page);

    // when
    await registerPage.register(createValidRegisterFormData());

    // then
    await expect(page).toHaveURL(LOGIN_URL);
    await expect(loginPage.heading).toBeVisible();
    await registerPage.toast.expectMessage(REGISTER_MESSAGES.registrationSuccess);
    await registerPage.toast.expectTitle(REGISTER_MESSAGES.successToastTitle);
  });

  test('should show validation error for missing email', async ({ page }) => {
    // when
    await registerPage.register(createMissingEmailRegisterData());

    // then
    await expect(page).toHaveURL(REGISTER_URL);
    await expect(registerPage.getValidationError(REGISTER_MESSAGES.emailRequired)).toBeVisible();
  });

  test('should show validation error for invalid email format', async ({ page }) => {
    // when
    await registerPage.register(createInvalidEmailRegisterData());

    // then
    await expect(page).toHaveURL(REGISTER_URL);
    await expect(registerPage.getValidationError(REGISTER_MESSAGES.invalidEmailFormat)).toBeVisible();
  });

  test('should navigate to login page when sign in link is clicked', async ({ page }) => {
    // when
    await registerPage.clickSignInLink();

    // then
    await expect(page).toHaveURL(LOGIN_URL);
  });
});
