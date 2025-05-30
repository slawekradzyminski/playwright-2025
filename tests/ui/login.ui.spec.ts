import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import type { LoginDto } from '../../types/auth';

test.describe('Login UI tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should successfully login with valid credentials', async () => {
    // given
    const credentials: LoginDto = {
      username: 'admin',
      password: 'admin'
    };

    // when
    await loginPage.login(credentials);

    // then
    await loginPage.expectToNotBeOnLoginPage();
  });

  test('should show error for empty username', async () => {
    // given
    const credentials = {
      username: '',
      password: 'admin'
    };

    // when
    await loginPage.login(credentials);

    // then
    await loginPage.expectToBeOnLoginPage();
  });

  test('should show error for invalid credentials', async () => {
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

  test('should navigate to register page when register button is clicked', async () => {
    // given
    // when
    await loginPage.goToRegisterPageViaButton();

    // then
    await loginPage.expectToBeOnRegisterPage();
  });

  test('should navigate to register page when register link is clicked', async () => {
    // given
    // when
    await loginPage.goToRegisterPageViaLink();

    // then
    await loginPage.expectToBeOnRegisterPage();
  });

  test('should have proper form validation for short password', async () => {
    // given
    const credentials = {
      username: 'admin',
      password: 'abc'
    };

    // when
    await loginPage.login(credentials);

    // then
    await loginPage.expectToBeOnLoginPage();
  });

}); 