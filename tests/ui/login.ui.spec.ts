import { test, expect } from '@playwright/test';
import type { LoginDto } from '../../types/auth';
import { UI_BASE_URL } from '../../config/constants';

const LOGIN_URL = `${UI_BASE_URL}/login`;

test.describe('Login UI tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL);
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // given
    const credentials: LoginDto = {
      username: 'admin',
      password: 'admin'
    };

    // when
    await page.getByTestId('login-username-input').fill(credentials.username);
    await page.getByTestId('login-password-input').fill(credentials.password);
    await page.getByTestId('login-submit-button').click();

    // then
    await expect(page).toHaveURL(`${UI_BASE_URL}/`);
    await expect(page.getByTestId('home-welcome-title')).toBeVisible();
    await expect(page.getByTestId('home-welcome-title')).toContainText('Welcome');
    await expect(page.getByTestId('logout-button')).toBeVisible();
  });

  test('should show error for empty password', async ({ page }) => {
    // given
    const credentials: LoginDto = {
      username: 'admin',
      password: ''
    };

    // when
    await page.getByTestId('login-username-input').fill(credentials.username);
    await page.getByTestId('login-password-input').fill(credentials.password);
    await page.getByTestId('login-submit-button').click();

    // then
    await expect(page).toHaveURL(LOGIN_URL);
    await expect(page.getByTestId('login-password-error')).toBeVisible();
    await expect(page.getByTestId('login-password-error')).toHaveText('Password is required');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // given
    const credentials: LoginDto = {
      username: 'invaliduser',
      password: 'invalidpassword'
    };

    await page.getByTestId('login-username-input').fill(credentials.username);
    await page.getByTestId('login-password-input').fill(credentials.password);
    await page.getByTestId('login-submit-button').click();

    // then
    await expect(page).toHaveURL(LOGIN_URL);
    await expect(page.getByTestId('toast-title')).toBeVisible();
    await expect(page.getByTestId('toast-title')).toHaveText('Error');
    await expect(page.getByTestId('toast-description')).toHaveText('Invalid username/password');
  });


  test('should have proper form validation for short username', async ({ page }) => {
    // given
    const credentials: LoginDto = {
      username: 'abc',
      password: 'admin'
    };

    // when
    await page.getByTestId('login-username-input').fill(credentials.username);
    await page.getByTestId('login-password-input').fill(credentials.password);
    await page.getByTestId('login-submit-button').click();

    // then
    await expect(page).toHaveURL(LOGIN_URL);
    await expect(page.getByTestId('login-username-error')).toBeVisible();
    await expect(page.getByTestId('login-username-error')).toHaveText('Username must be at least 4 characters');
  });

  test('should navigate to register page when register button is clicked', async ({ page }) => {
    // when
    await page.getByTestId('login-register-link').click();

    // then
    await expect(page).toHaveURL(`${UI_BASE_URL}/register`);
  });

  test('should navigate to register page when register link is clicked', async ({ page }) => {
    // when
    await page.getByTestId('register-link').click();

    // then
    await expect(page).toHaveURL(`${UI_BASE_URL}/register`);
  });

}); 