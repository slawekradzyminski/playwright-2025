import { test, expect } from '@playwright/test';
import { getValidCredentials } from '../../utils/shared/credentialsUtil';
import {
  EMPTY_PASSWORD_LOGIN_CREDENTIALS,
  HOME_URL,
  INVALID_LOGIN_CREDENTIALS,
  LOGIN_URL,
  LOGIN_MESSAGES,
  REGISTER_URL,
  SHORT_USERNAME_LOGIN_CREDENTIALS,
} from './constants/login.ui.constants';
import { HomePage } from './pages/home.page';
import { LoginPage } from './pages/login.page';

test.describe('Login UI tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.header.navigation).toBeVisible();
    await expect(loginPage.header.loginLink).toBeVisible();
    await expect(loginPage.header.registerLink).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // given
    const homePage = new HomePage(page);
    const credentials = getValidCredentials();

    // when
    await loginPage.login(credentials);

    // then
    await expect(page).toHaveURL(HOME_URL);
    await expect(homePage.logoutButton).toBeVisible();
  });

  test('should show error for empty password', async ({ page }) => {
    // when
    await loginPage.login(EMPTY_PASSWORD_LOGIN_CREDENTIALS);

    // then
    await expect(page).toHaveURL(LOGIN_URL);
    await expect(loginPage.getValidationError(LOGIN_MESSAGES.passwordRequired)).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // when
    await loginPage.login(INVALID_LOGIN_CREDENTIALS);

    // then
    await expect(page).toHaveURL(LOGIN_URL);
    await loginPage.toast.expectError(
      LOGIN_MESSAGES.invalidCredentials,
      LOGIN_MESSAGES.errorToastTitle,
    );
  });

  test('should have proper form validation for short username', async ({ page }) => {
    // when
    await loginPage.login(SHORT_USERNAME_LOGIN_CREDENTIALS);

    // then
    await expect(page).toHaveURL(LOGIN_URL);
    await expect(loginPage.getValidationError(LOGIN_MESSAGES.usernameTooShort)).toBeVisible();
  });

  test('should navigate to register page when register button is clicked', async ({ page }) => {
    // when
    await loginPage.clickRegisterButton();

    // then
    await expect(page).toHaveURL(REGISTER_URL);
  });

  test('should navigate to register page when register link is clicked', async ({ page }) => {
    // when
    await loginPage.clickRegisterLink();

    // then
    await expect(page).toHaveURL(REGISTER_URL);
  });
});
