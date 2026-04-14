import { test, expect } from '@playwright/test';
import type { LoginDto } from '../../types/auth';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';

const APP_BASE_URL = process.env.APP_BASE_URL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const REGISTER_URL = `${APP_BASE_URL}/register`;

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
      password: ADMIN_PASSWORD,
    };

    // when
    await loginPage.login(credentials.username, credentials.password);

    // then
    const homePage = new HomePage(page);
    await loginPage.expectToBeRedirectedAway();
    await homePage.expectLoggedInAs('Slawomir', 'awesome@testing.com');
  });

  test('should show validation error when password is empty', async () => {
    // given
    const credentials = { username: 'admin', password: '' };

    // when
    await loginPage.login(credentials.username, credentials.password);

    // then
    await loginPage.expectToBeOnLoginPage();
    await expect(loginPage.passwordError).toHaveText('Password is required');
  });

  test('should show error toast with invalid credentials', async () => {
    // given
    const credentials: LoginDto = {
      username: 'invaliduser',
      password: 'invalidpassword',
    };

    // when
    await loginPage.login(credentials.username, credentials.password);

    // then
    await loginPage.expectToBeOnLoginPage();
    await loginPage.toast.expectError('Error', 'Invalid username/password');
  });

  test('should show validation error when username is too short', async () => {
    // given
    const credentials = { username: 'abc', password: ADMIN_PASSWORD };

    // when
    await loginPage.login(credentials.username, credentials.password);

    // then
    await loginPage.expectToBeOnLoginPage();
    await expect(loginPage.usernameError).toHaveText('Username must be at least 4 characters');
  });

  test('should navigate to register page when register button is clicked', async () => {
    // when
    await loginPage.registerButton.click();

    // then
    await expect(loginPage.page).toHaveURL(REGISTER_URL);
  });

  test('should navigate to register page when register nav link is clicked', async () => {
    // when
    await loginPage.header.registerLink.click();

    // then
    await expect(loginPage.page).toHaveURL(REGISTER_URL);
  });
});

