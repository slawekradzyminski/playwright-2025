import { test, expect } from '@playwright/test';
import type { LoginDto } from '../../types/auth';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Login UI tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // given
    const credentials: LoginDto = {
      username: 'admin',
      password: 'admin'
    };

    // when
    await loginPage.login(credentials);

    // then
    await loginPage.expectToBeRedirectedFromLogin();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // given
    const credentials: LoginDto = {
      username: 'invaliduser',
      password: 'invalidpassword'
    };

    // when
    await loginPage.login(credentials);

    // then
    await loginPage.expectToBeOnLoginPage();
    await loginPage.expectErrorMessage('Invalid username/password');
  });

  test('should navigate to register page when register button is clicked', async ({ page }) => {
    // when
    await loginPage.clickRegisterButton();

    // then
    await loginPage.expectToBeOnRegisterPage();
  });

  test('should navigate to register page when register link is clicked', async ({ page }) => {
    // when
    await loginPage.clickRegisterLink();

    // then
    await loginPage.expectToBeOnRegisterPage();
  });

  test('should have proper form validation for short username', async ({ page }) => {
    // given
    const credentials = {
      username: 'abc',
      password: 'admin'
    };

    // when
    await loginPage.login(credentials);

    // then
    await loginPage.expectUsernameValidationError();
    await loginPage.expectToBeOnLoginPage();
  });
});