import { test, expect } from '@playwright/test';
import type { LoginDto } from '../../types/auth';
import { FRONTEND_URL } from '../../config/constants';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';

test.describe('Login UI tests', () => {

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // given
    const homePage = new HomePage(page);
    const credentials: LoginDto = {
      username: 'admin',
      password: 'admin'
    };

    // when
    await loginPage.login(credentials.username, credentials.password);

    // then
    await expect(page).toHaveURL(HomePage.URL);
    await expect(homePage.homePage).toBeVisible();
    await expect(homePage.welcomeTitle).toBeVisible();
  });

  test('should show error for empty password', async () => {
    // given
    const credentials = {
      username: 'admin',
      password: ''
    };

    // when
    await loginPage.login(credentials.username, credentials.password);

    // then
    await expect(loginPage.passwordError).toHaveText('Password is required');
  });

  test('should show error for invalid credentials', async () => {
    // given
    const credentials: LoginDto = {
      username: 'invaliduser',
      password: 'invalidpassword'
    };

    // when
    await loginPage.login(credentials.username, credentials.password);

    // then
    await loginPage.toast.expectError('Invalid username/password');
  });

  test('should navigate to register page when register button is clicked', async ({ page }) => {
    // when
    await loginPage.clickRegister();

    // then
    await expect(page).toHaveURL(`${FRONTEND_URL}/register`);
  });

  test('should navigate to register page when register link is clicked', async ({ page }) => {
    // when
    await loginPage.header.clickRegister();

    // then
    await expect(page).toHaveURL(`${FRONTEND_URL}/register`);
  });

  test('should have proper form validation for short username', async () => {
    // given
    const credentials = {
      username: 'abc',
      password: 'admin'
    };

    // when
    await loginPage.login(credentials.username, credentials.password);

    // then
    await expect(loginPage.usernameError).toHaveText('Username must be at least 4 characters');
  });
});
