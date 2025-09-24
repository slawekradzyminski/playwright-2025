import { test, expect } from '@playwright/test';
import type { LoginDto } from '../../types/auth';
import { LoginPage } from '../../pages/loginPage';

test.describe('Login UI tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display login form elements', async ({ page }) => {
    // given
    // when
    // then
    await loginPage.expectAllElementsVisible();
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
    await loginPage.expectToBeOffLoginPage();
  });

  test('should show error for empty username', async ({ page }) => {
    // given
    const credentials = {
      username: '',
      password: 'admin'
    };

    // when
    await loginPage.fillCredentialsPartial(credentials.username, credentials.password);
    await loginPage.clickSignIn();

    // then
    await loginPage.expectToBeOnLoginPage();
  });

  test('should show error for empty password', async ({ page }) => {
    // given
    const credentials = {
      username: 'admin',
      password: ''
    };

    // when
    await loginPage.fillCredentialsPartial(credentials.username, credentials.password);
    await loginPage.clickSignIn();

    // then
    await loginPage.expectToBeOnLoginPage();
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
  });

  test('should navigate to register page when register button is clicked', async ({ page }) => {
    // given
    // when
    await loginPage.clickRegisterButton();

    // then
    await loginPage.expectToBeOnRegisterPage();
  });

  test('should navigate to register page when register link is clicked', async ({ page }) => {
    // given
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
    await loginPage.fillCredentialsPartial(credentials.username, credentials.password);
    await loginPage.clickSignIn();

    // then
    await loginPage.expectToBeOnLoginPage();
  });

  test('should have proper form validation for short password', async ({ page }) => {
    // given
    const credentials = {
      username: 'admin',
      password: 'abc'
    };

    // when
    await loginPage.fillCredentialsPartial(credentials.username, credentials.password);
    await loginPage.clickSignIn();

    // then
    await loginPage.expectToBeOnLoginPage();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // given
    const credentials: LoginDto = {
      username: 'admin',
      password: 'admin'
    };

    // when
    await loginPage.loginWithKeyboard(credentials);

    // then
    await loginPage.expectToBeOffLoginPage();
  });
}); 