import { test } from '@playwright/test';
import { config } from 'dotenv';
import type { LoginDto } from '../../types/auth';
import { LoginPage } from '../../pages/loginPage';

config();

test.describe('Login UI tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should successfully login with valid credentials', async () => {
    const credentials: LoginDto = {
      username: process.env.TEST_USERNAME!,
      password: process.env.TEST_PASSWORD!
    };

    await loginPage.login(credentials);

    await loginPage.expectNotToBeOnLoginPage();
  });

  test('should show error for empty password', async () => {
    const credentials = {
      username: process.env.TEST_USERNAME!,
      password: ''
    };

    await loginPage.login(credentials);

    await loginPage.expectToBeOnLoginPage();
    await loginPage.expectPasswordError('Password is required');
  });

  test('should show error for invalid credentials', async () => {
    const credentials: LoginDto = {
      username: 'invaliduser',
      password: 'invalidpassword'
    };

    await loginPage.login(credentials);

    await loginPage.expectToBeOnLoginPage();
    await loginPage.expectToastError('Invalid username/password');
  });

  test('should navigate to register page when register button is clicked', async () => {
    await loginPage.clickRegisterButton();

    await loginPage.expectToBeOnRegisterPage();
  });

  test('should navigate to register page when register link is clicked', async () => {
    await loginPage.clickRegisterLink();

    await loginPage.expectToBeOnRegisterPage();
  });

  test('should have proper form validation for short username', async () => {
    const credentials = {
      username: 'abc',
      password: process.env.TEST_PASSWORD!
    };

    await loginPage.login(credentials);

    await loginPage.expectToBeOnLoginPage();
    await loginPage.expectUsernameError('Username must be at least 4 characters');
  });

}); 